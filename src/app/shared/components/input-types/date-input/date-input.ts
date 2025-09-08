import { ChangeDetectionStrategy, Component, input, effect, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatInput, MatSuffix } from '@angular/material/input';
import { NgClass } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateAdapter } from '../../../adapter/custom-date.adapter';
import { AppDateFormatsConstant } from '../../../constant/app-date-formats.constant';
import { MatTooltipModule } from '@angular/material/tooltip';

export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY/MM/DD' | 'DD-MM-YYYY' | 'MM-DD-YYYY' | 'YYYY-MM-DD' | 'DD MMM, YYYY';

@Component({
  selector: 'app-date-input',
  imports: [
    FormsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatInput,
    ReactiveFormsModule,
    MatSuffix,
    MatTooltipModule,
    NgClass
  ],
  templateUrl: './date-input.html',
  standalone: true,
  styleUrl: './date-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: AppDateFormatsConstant }
  ],
})
export class DateInput {
  readonly frmGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly label = input.required<string>();
  readonly isReadonly = input<boolean>(false);
  readonly dateFormat = input<DateFormat>('DD/MM/YYYY');
  readonly isVertical = input<boolean>(false);

  private dateAdapter = inject(DateAdapter) as CustomDateAdapter;
  readonly tooltip = input<string>('Select a date');
  readonly tooltipPosition = input<'above' | 'below' | 'left' | 'right'>('above');
  readonly tooltipDelay = input<number>(500);
  readonly tooltipClass = input<string>('custom-tooltip');

  
  constructor() {
    // Add custom validator when component initializes
    effect(() => {
      const control = this.frmGroup().get(this.controlName());
      if (control) {
        const existingValidators = control.validator;
        control.setValidators([
          ...(existingValidators ? [existingValidators] : []),
          this.dateFormatValidator.bind(this)
        ]);
        control.updateValueAndValidity();
      }
    });

    // Update date adapter format when dateFormat input changes
    effect(() => {
      this.dateAdapter.setFormat(this.dateFormat());
    });
  }

  isRequired(): boolean {
    const control = this.frmGroup().get(this.controlName());
    if (!control?.validator) return false;
    const validation = control.validator({} as any);
    return !!validation?.['required'];
  }

  // Method to get display format (always 'DD MMM, YYYY')
  getDisplayFormat(): string {
    return 'DD MMM, YYYY';
  }

  // Method to get the actual date format for validation
  getActualDateFormat(): DateFormat {
    return this.dateFormat();
  }

  getDateSeparator(): string {
    if (this.dateFormat() === 'DD MMM, YYYY') {
      return ' '; 
    }
    return this.dateFormat().includes('/') ? '/' : '-';
  }

  // Handle date selection from calendar
onDateSelected(event: any): void {
  if (event.value instanceof Date) {
    const date = event.value as Date;
    const control = this.frmGroup().get(this.controlName());
    
    if (control) {
      // Always store the Date object itself, not the formatted string
      // This makes it consistent and easier to handle
      control.setValue(date);
      
      // Update the input display immediately
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const displayValue = `${String(date.getDate()).padStart(2, '0')} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
      
      const inputElement = document.querySelector(`[formcontrolname="${this.controlName()}"]`) as HTMLInputElement;
      if (inputElement) {
        inputElement.value = displayValue;
      }
    }
  }
}

 onKeyDown(event: KeyboardEvent): void {
  const format = this.dateFormat();
  const input = event.target as HTMLInputElement;
  const currentValue = input.value;
  const cursorPosition = input.selectionStart || 0;
  const separator = this.getDateSeparator();

  // Allowed keys
  const allowedKeys = [
    'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End',
    'ArrowLeft', 'ArrowRight', 'Clear', 'Copy', 'Paste'
  ];

  const isNumberKey = (event.key >= '0' && event.key <= '9');
  const isSeparatorKey = event.key === separator;

  if (!allowedKeys.includes(event.key) && !isNumberKey && !isSeparatorKey) {
    event.preventDefault();
    return;
  }

  // PREVENT CONSECUTIVE SEPARATORS
  if (isSeparatorKey) {
    // Check if the last character is already a separator
    if (currentValue.charAt(cursorPosition - 1) === separator) {
      event.preventDefault();
      return;
    }
    
    // Check if adding this separator would create consecutive separators
    const newValue = currentValue.substring(0, cursorPosition) + separator + currentValue.substring(cursorPosition);
    if (this.hasConsecutiveSeparators(newValue)) {
      event.preventDefault();
      return;
    }
  }

  if (isNumberKey) {
    const newValue = currentValue.substring(0, cursorPosition) + event.key + currentValue.substring(cursorPosition);

    // Check validity of the partial input before allowing
    if (!this.isPartialInputValid(newValue)) {
      event.preventDefault();
      return;
    }

    // If we should add a separator next, do it safely
    if (this.shouldAddSeparator(newValue, cursorPosition + 1)) {
      event.preventDefault();

      const valueWithSeparator = newValue + separator;
      input.value = valueWithSeparator;
      input.setSelectionRange(valueWithSeparator.length, valueWithSeparator.length);

      // Fire Angular change detection
      const changeEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(changeEvent);
    }
  }
}


// onInputChange(event: Event): void {
//   const input = event.target as HTMLInputElement;
//   let value = input.value;
  
//   // Ensure we're working with a string
//   if (typeof value !== 'string') {
//     value = String(value || '');
//   }
  
//   const format = this.dateFormat();
//   const control = this.frmGroup().get(this.controlName());
  
//   // Handle the 'DD MMM, YYYY' display format
//   if (format === 'DD MMM, YYYY') {
//     // Allow letters, numbers, spaces, and commas for month abbreviation format
//     const cleanValue = value.replace(/[^0-9A-Za-z\s,]/g, '');
//     if (cleanValue !== value) {
//       input.value = cleanValue;
//       control?.setValue(cleanValue);
//       control?.setErrors({ ...control.errors, invalidCharacters: true });
//       return;
//     } else {
//       if (control?.errors?.['invalidCharacters']) {
//         const errors = { ...control.errors };
//         delete errors['invalidCharacters'];
//         control.setErrors(Object.keys(errors).length ? errors : null);
//       }
//     }
//   } else {
//     // Remove any characters that are not numbers or the expected separator
//     const separator = this.getDateSeparator();
//     const cleanValue = value.replace(new RegExp(`[^0-9\\${separator}]`, 'g'), '');
    
//     if (cleanValue !== value) {
//       input.value = cleanValue;
//       control?.setValue(cleanValue);
//       control?.setErrors({ ...control.errors, invalidCharacters: true });
//       return;
//     }

//     // CHECK FOR CONSECUTIVE SEPARATORS AND INVALID PATTERNS
//     if (this.hasConsecutiveSeparators(cleanValue) || this.hasInvalidSeparatorPattern(cleanValue)) {
//       control?.setErrors({ ...control.errors, invalidDateFormat: true });
//       return;
//     } else {
//       // Remove invalidCharacters and invalidDateFormat errors if input is clean
//       if (control?.errors?.['invalidCharacters'] || control?.errors?.['invalidDateFormat']) {
//         const errors = { ...control.errors };
//         delete errors['invalidCharacters'];
//         delete errors['invalidDateFormat'];
//         control.setErrors(Object.keys(errors).length ? errors : null);
//       }
//     }
//   }
  
//   // Only validate if the input looks like it might be complete or nearly complete
//   if (value.length > 0) {
//     if (!this.isPartialInputValid(value)) {
//       this.clearField();
//     }
//   }
// }


private hasConsecutiveSeparators(value: string): boolean {
  const separator = this.getDateSeparator();
  const consecutivePattern = new RegExp(`\\${separator}{2,}`, 'g');
  return consecutivePattern.test(value);
}

private hasInvalidSeparatorPattern(value: string): boolean {
  const separator = this.getDateSeparator();
  
  // Check if starts or ends with separator
  if (value.startsWith(separator) ) {
    return true; // Allow trailing separator during typing
  }

  const part = value.split(separator);
  if (value.endsWith(separator) && part.length > 3) {
    return true;
  }

  if (value.endsWith(separator)) {
    return false; 
  }

  // Check if there are more than 2 separators
  const separatorCount = (value.match(new RegExp(`\\${separator}`, 'g')) || []).length;
  if (separatorCount > 2) {
    return true;
  }
  
  // Check for empty segments (like "12//12" or "12/12/")
  const parts = value.split(separator);
  let emptySegments = 0;
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].trim() === '') {
      emptySegments++;
    }
  }
  
  // Allow one empty segment at the end (for typing), but not in the middle
  if (emptySegments > 1) {
    return true;
  }
  
  if (emptySegments === 1 && parts[parts.length - 1] !== '') {
    return true; // Empty segment in the middle
  }
  
  return false;
}




  // onKeyDown(event: KeyboardEvent): void {
  //   const format = this.dateFormat();
    
  //   // Handle the 'DD MMM, YYYY' display format
  //   if (format === 'DD MMM, YYYY') {
  //     const allowedKeys = [
  //       'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End',
  //       'ArrowLeft', 'ArrowRight', 'Clear', 'Copy', 'Paste', ' '
  //     ];
      
  //     const isNumberKey = (event.key >= '0' && event.key <= '9');
  //     const isLetterKey = (event.key >= 'a' && event.key <= 'z') || (event.key >= 'A' && event.key <= 'Z');
  //     const isCommaKey = event.key === ',';
      
  //     if (!allowedKeys.includes(event.key) && !isNumberKey && !isLetterKey && !isCommaKey) {
  //       event.preventDefault();
  //       return;
  //     }
  //     return; // Don't apply auto-separator logic for this format
  //   }
    
  //   // Original logic for other formats
  //   const allowedKeys = [
  //     'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End',
  //     'ArrowLeft', 'ArrowRight', 'Clear', 'Copy', 'Paste'
  //   ];
    
  //   const isNumberKey = (event.key >= '0' && event.key <= '9');
  //   const isSeparatorKey = event.key === this.getDateSeparator();
    
  //   if (!allowedKeys.includes(event.key) && !isNumberKey && !isSeparatorKey) {
  //     event.preventDefault();
  //     return;
  //   }
    
  //   // Auto-add separators but be less aggressive
  //   const input = event.target as HTMLInputElement;
  //   const currentValue = input.value;
  //   const cursorPosition = input.selectionStart || 0;
    
  //   if (isNumberKey) {
  //     const newValue = currentValue.substring(0, cursorPosition) + event.key + currentValue.substring(cursorPosition);
  //     console.log("New value:", newValue);
  //     // Only auto-add separator if we're at the right position and not in the middle of editing
  //     if (this.shouldAddSeparator(newValue, cursorPosition) && cursorPosition === currentValue.length) {
  //       event.preventDefault();
  //       const separator = this.getDateSeparator();
  //       const valueWithSeparator = currentValue + event.key + separator;
  //       input.value = valueWithSeparator;
  //       input.setSelectionRange(valueWithSeparator.length, valueWithSeparator.length);
        
  //       // Trigger Angular change detection
  //       const changeEvent = new Event('input', { bubbles: true });
  //       input.dispatchEvent(changeEvent);
  //     }
  //   }
  // }

  onInputChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  let value = input.value;
  
  // Ensure we're working with a string
  if (typeof value !== 'string') {
    value = String(value || '');
  }
  
  const format = this.dateFormat();
  const control = this.frmGroup().get(this.controlName());
  
  // Handle the 'DD MMM, YYYY' display format
  if (format === 'DD MMM, YYYY') {
    // Allow letters, numbers, spaces, and commas for month abbreviation format
    const cleanValue = value.replace(/[^0-9A-Za-z\s,]/g, '');
    if (cleanValue !== value) {
      input.value = cleanValue;
      control?.setValue(cleanValue);
      // Set invalid characters error
      control?.setErrors({ ...control.errors, invalidCharacters: true });
      return;
    } else {
      // Remove invalidCharacters error if input is clean
      if (control?.errors?.['invalidCharacters']) {
        const errors = { ...control.errors };
        delete errors['invalidCharacters'];
        control.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
  } else {
    // Remove any characters that are not numbers or the expected separator
    const separator = this.getDateSeparator();
    const cleanValue = value.replace(new RegExp(`[^0-9\\${separator}]`, 'g'), '');
    
    if (cleanValue !== value) {
      input.value = cleanValue;
      control?.setValue(cleanValue);
      // Set invalid characters error
      control?.setErrors({ ...control.errors, invalidCharacters: true });
      return;
    } else {
      // Remove invalidCharacters error if input is clean
      if (control?.errors?.['invalidCharacters']) {
        const errors = { ...control.errors };
        delete errors['invalidCharacters'];
        control.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
  }
  
  // Only validate if the input looks like it might be complete or nearly complete
  if (value.length > 0) {
    if (!this.isPartialInputValid(value)) {
      this.clearField();
    }
  }
}


getDetailedErrorMessage(): string {
  const control = this.frmGroup().get(this.controlName());
  if (!control || !control.touched) return '';
  
  const errors = control.errors;
  if (!errors) return '';
  
  // Check for required error first
  if (errors['required']) {
    return `${this.label()} is required!`;
  }
  
  // Check for invalid characters
  if (errors['invalidCharacters']) {
    if (this.dateFormat() === 'DD MMM, YYYY') {
      return 'Only numbers, letters, spaces and commas are allowed';
    } else {
      return `Only numbers and ${this.getDateSeparator()} are allowed`;
    }
  }
  
  // Check for format errors (including consecutive separators)
  if (errors['invalidDateFormat']) {
    const currentValue = control.value || '';
    if (this.hasConsecutiveSeparators(currentValue)) {
      return `Consecutive ${this.getDateSeparator()} separators are not allowed`;
    }
    if (this.hasInvalidSeparatorPattern(currentValue)) {
      return `Invalid date format - please use ${this.dateFormat()} format`;
    }
    return `Please enter date in ${this.dateFormat()} format`;
  }
  
  // Check for invalid date with detailed info
  if (errors['invalidDate']) {
    const details = errors['invalidDateDetails'];
    if (details) {
      return `${details.monthName} ${details.year} only has ${details.maxDays} days. You entered day ${details.enteredDay}`;
    }
    return 'Please enter a valid date';
  }
  
  return 'Please enter a valid date';
}
onFocus(event: FocusEvent): void {
  const control = this.frmGroup().get(this.controlName());
  if (!control) return;

  let currentValue = control.value;

  // If value is a Date, convert to editable format
  if (currentValue instanceof Date) {
    const date = currentValue as Date;
    const separator = this.getDateSeparator();
    const editable = `${String(date.getDate()).padStart(2, '0')}${separator}${String(date.getMonth() + 1).padStart(2, '0')}${separator}${date.getFullYear()}`;

    const input = event.target as HTMLInputElement;
    input.value = editable;
  }
  else if (this.isDisplayFormat(currentValue)) {
    const convertedValue = this.convertDisplayFormatToInputFormat(currentValue);
    if (convertedValue) {

      const input = event.target as HTMLInputElement;
      input.value = convertedValue;
    }
  }
}




private isDisplayFormat(value: string): boolean {
  // Check if the value matches "DD MMM, YYYY" format (e.g., "18 Aug, 2025")
  const displayFormatPattern = /^(\d{1,2})\s+([A-Za-z]{3})\s*,?\s*(\d{4})$/;
  return displayFormatPattern.test(value);
}


private convertDisplayFormatToInputFormat(displayValue: string): string | null {
  const match = displayValue.match(/^(\d{1,2})\s+([A-Za-z]{3})\s*,?\s*(\d{4})$/);
  if (!match) return null;

  const day = match[1].padStart(2, '0');
  const monthAbbr = match[2].toLowerCase();
  const year = match[3];

  // Month abbreviation to number mapping
  const monthMap: { [key: string]: string } = {
    'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 
    'may': '05', 'jun': '06', 'jul': '07', 'aug': '08', 
    'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
  };

  const month = monthMap[monthAbbr];
  if (!month) return null;

  const format = this.dateFormat();
  const separator = this.getDateSeparator();

  // Convert based on the current format
  switch (format) {
    case 'DD/MM/YYYY':
    case 'DD-MM-YYYY':
      return `${day}${separator}${month}${separator}${year}`;
    case 'MM/DD/YYYY':
    case 'MM-DD-YYYY':
      return `${month}${separator}${day}${separator}${year}`;
    case 'YYYY/MM/DD':
    case 'YYYY-MM-DD':
      return `${year}${separator}${month}${separator}${day}`;
    default:
      return null;
  }
}



onBlur(): void {
  const control = this.frmGroup().get(this.controlName());
  if (control && control.value) {
    let stringValue: string;
    
    // Handle Date objects
    if (control.value instanceof Date) {
      const date = control.value as Date;
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      stringValue = `${String(date.getDate()).padStart(2, '0')} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
      
      // Update the input element to show the display format
      const inputElement = document.querySelector(`[formcontrolname="${this.controlName()}"]`) as HTMLInputElement;
      if (inputElement) {
        inputElement.value = stringValue;
      }
      
      console.log('Date object converted to display format on blur:', stringValue);
      return; // Date objects are always valid, no need to validate further
    } else {
      stringValue = typeof control.value === 'string' ? control.value : String(control.value);
    }
    
    // Only validate complete dates on blur - don't clear partial input
    if (this.isCompleteDateInput(stringValue)) {
      const format = this.dateFormat();
      let isValid = false;
      
      if (format === 'DD MMM, YYYY') {
        isValid = this.isValidMonthAbbreviationFormat(stringValue);
      } else {
        isValid = this.isValidDateFormat(stringValue);
        
        // If valid and not already in display format, convert to display format
        if (isValid && !this.isDisplayFormat(stringValue)) {
          const displayValue = this.convertInputFormatToDisplayFormat(stringValue);
          if (displayValue) {
            // Update the input element value directly
            const inputElement = document.querySelector(`[formcontrolname="${this.controlName()}"]`) as HTMLInputElement;
            if (inputElement) {
              inputElement.value = displayValue;
            }
            
            // Create a Date object and store it in the control for consistency
            const dateObj = this.createDateFromInputString(stringValue);
            if (dateObj) {
              setTimeout(() => {
                control.setValue(dateObj, { emitEvent: false });
              }, 0);
            }
          }
        }
      }
      
      if (!isValid) {
        this.clearField();
      }
    }
  }
}

private createDateFromInputString(inputValue: string): Date | null {
  const format = this.dateFormat();
  const separator = this.getDateSeparator();
  const parts = inputValue.split(separator);
  
  if (parts.length !== 3) return null;
  
  let day: number, month: number, year: number;
  
  switch (format) {
    case 'DD/MM/YYYY':
    case 'DD-MM-YYYY':
      day = parseInt(parts[0]);
      month = parseInt(parts[1]);
      year = parseInt(parts[2]);
      break;
    case 'MM/DD/YYYY':
    case 'MM-DD-YYYY':
      month = parseInt(parts[0]);
      day = parseInt(parts[1]);
      year = parseInt(parts[2]);
      break;
    case 'YYYY/MM/DD':
    case 'YYYY-MM-DD':
      year = parseInt(parts[0]);
      month = parseInt(parts[1]);
      day = parseInt(parts[2]);
      break;
    default:
      return null;
  }
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  
  return new Date(year, month - 1, day);
}

private convertInputFormatToDisplayFormat(inputValue: string): string | null {
  const format = this.dateFormat();
  const separator = this.getDateSeparator();
  const parts = inputValue.split(separator);
  
  if (parts.length !== 3) return null;
  
  let day: string, month: string, year: string;
  
  switch (format) {
    case 'DD/MM/YYYY':
    case 'DD-MM-YYYY':
      [day, month, year] = parts;
      break;
    case 'MM/DD/YYYY':
    case 'MM-DD-YYYY':
      [month, day, year] = parts;
      break;
    case 'YYYY/MM/DD':
    case 'YYYY-MM-DD':
      [year, month, day] = parts;
      break;
    default:
      return null;
  }
  
  // Convert month number to abbreviation
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthNum = parseInt(month);
  
  if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) return null;
  
  const monthAbbr = monthNames[monthNum - 1];
  const dayNum = parseInt(day);
  
  if (isNaN(dayNum)) return null;
  
  return `${dayNum.toString().padStart(2, '0')} ${monthAbbr}, ${year}`;
}

  private isCompleteDateInput(value: string): boolean {
    if (!value) return false;
    
    const format = this.dateFormat();
    
    // Handle the 'DD MMM, YYYY' display format
    if (format === 'DD MMM, YYYY') {
      // Check if it matches the pattern "18 Aug, 2025" or "18 Aug 2025"
      const match = value.match(/^(\d{1,2})\s+([A-Za-z]{3})\s*,?\s*(\d{4})$/);
      return !!match;
    }
    
    const separator = this.getDateSeparator();
    const parts = value.split(separator);
    
    // Don't validate if it ends with separator (still typing)
    if (value.endsWith(separator)) return false;
    
    // Check if we have 3 non-empty parts
    if (parts.length !== 3) return false;
    
    // Check that all parts have content and reasonable lengths
    if (format.startsWith('YYYY')) {
      return parts[0].length === 4 && parts[1].length >= 1 && parts[1].length <= 2 && parts[2].length >= 1 && parts[2].length <= 2;
    } else {
      return parts[0].length >= 1 && parts[0].length <= 2 && parts[1].length >= 1 && parts[1].length <= 2 && parts[2].length === 4;
    }
  }

private clearField(): void {
  const control = this.frmGroup().get(this.controlName());
  if (control) {
    // Only clear if the field is not currently focused
    const inputElement = document.querySelector(`[formcontrolname="${this.controlName()}"]`) as HTMLInputElement;
    const isCurrentlyFocused = inputElement === document.activeElement;
    
    if (!isCurrentlyFocused) {
      control.setValue('');
      control.markAsTouched();
      
      // Clear the input element as well
      if (inputElement) {
        inputElement.value = '';
      }
    }
  }
}

  private preventFurtherWriting(): void {
  const control = this.frmGroup().get(this.controlName());
  if (control && !this.isPartialInputValid(control.value)) {
    const inputEl = document.querySelector(
      `[formcontrolname="${this.controlName()}"]`
    ) as HTMLInputElement;

    if (inputEl) {
      inputEl.readOnly = true; // 🚫 stops further writing
    }
  }
}


private isPartialInputValid(value: string): boolean {
  if (!value) return true;
  
  const format = this.dateFormat();
  
  // Handle the 'DD MMM, YYYY' display format
  if (format === 'DD MMM, YYYY') {
    return this.isPartialMonthAbbreviationInputValid(value);
  }
  
  const separator = this.getDateSeparator();
  
  // Check for consecutive separators
  if (this.hasConsecutiveSeparators(value)) {
    return false;
  }
  
  // Check for invalid separator patterns
  if (this.hasInvalidSeparatorPattern(value)) {
    return false;
  }
  
  const parts = value.split(separator);
  
  // Allow trailing separators during typing (e.g., "02/03/")
  if (value.endsWith(separator)) {
    return true;
  }
  
  // Very lenient validation for partial input - only check obvious errors
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    
    // Allow completely empty parts during typing
    if (part === '') continue;
    
    const num = parseInt(part);
    if (isNaN(num)) return false;
    
    // Basic range checks based on position and format
    if (format.startsWith('YYYY')) {
      if (i === 0) { // Year position
        if (part.length > 4) return false;
        if (part.length === 4 && (num < 1900 || num > 2030)) return false;
        if (part.length === 3 && num > 203) return false;
        if (part.length === 2 && num > 29) return false;
        if (part.length === 1 && num > 2) return false;
      } else if (i === 1) { // Month position
        if (part.length > 2) return false;
        if (part.length === 2 && (num > 12 || num < 1)) return false;
      } else if (i === 2) { // Day position  
        if (part.length > 2) return false;
        if (part.length === 2 && (num > 31 || num < 1)) return false;
        if (part.length === 1 && num > 3) return false;
      }
    } else if (format.startsWith('DD')) {
      if (i === 0) { // Day position
        if (part.length === 2 && (num > 31 || num < 1)) return false;
        if (part.length > 2) return false;
        if (part.length === 1 && num > 3) return false;
      } else if (i === 1) { // Month position
        if (part.length > 2) return false;
        if (part.length == 2 && (num > 12 || num < 1)) return false;
      } else if (i === 2) { // Year position
        if (part.length > 4) return false;
        if (part.length === 4 && (num < 1900 || num > 2030)) return false;
        if (part.length === 3 && num > 299) return false;
        if (part.length === 2 && num > 29) return false;
        if (part.length === 1 && num > 2) return false;
      }
    } else if (format.startsWith('MM')) {
      if (i === 0) { // Month position
        if (part.length > 2) return false;
        if (part.length === 2 && (num > 12 || num < 1)) return false;
      } else if (i === 1) { // Day position
        if (part.length > 2) return false;
        if (part.length === 2 && (num > 31 || num < 1)) return false;
        if (part.length === 1 && num > 3) return false;
      } else if (i === 2) { // Year position
        if (part.length > 4) return false;
        if (part.length === 4 && (num < 1900 || num > 2030)) return false;
        if (part.length === 3 && num > 299) return false;
        if (part.length === 2 && num > 29) return false;
        if (part.length === 1 && num > 2) return false;
      }
    }
  }
  
  return true;
}



  private shouldAddSeparator(value: string, cursorPosition: number): boolean {
    const format = this.dateFormat();
    const separator = this.getDateSeparator();
    const parts = value.split(separator);
    const isSecondMonth = this.dateFormat().split(this.getDateSeparator())[1] === 'MM';
    const isFirstMonth = this.dateFormat().split(this.getDateSeparator())[0] === 'MM';
    if (parts.length === 1) {
      // First separator
      if (format.startsWith('YYYY')) {
        return parts[0].length === 4; // After year
      } else {
        if(isFirstMonth){
          if(parts[0]>'1') return true;
        }
        return parts[0].length === 2; // After day/month
      }
    } else if (parts.length === 2) {
      // Second separator
      if (format.startsWith('YYYY')) {
        return parts[1].length === 2; // After month
      } else {
        if(isSecondMonth){
          if(parts[1]>'1') return true;
        }
        return parts[1].length === 2; // After month/day
      }
    }
    
    return false;
  }

// Fixed validation methods - replace the existing ones in your component

private isValidDateFormat(value: any): boolean {
  if (!value) return true; // Empty is valid (let required validator handle it)
  
  // Convert to string if it's not already
  const stringValue = typeof value === 'string' ? value : String(value);
  
  const format = this.dateFormat();
  const separator = format.includes('/') ? '/' : '-';
  const parts = stringValue.split(separator);
  
  if (parts.length !== 3) return false;
  
  let day: number, month: number, year: number;
  
  switch (format) {
    case 'DD/MM/YYYY':
    case 'DD-MM-YYYY':
      [day, month, year] = parts.map(p => parseInt(p));
      break;
    case 'MM/DD/YYYY':
    case 'MM-DD-YYYY':
      [month, day, year] = parts.map(p => parseInt(p));
      break;
    case 'YYYY/MM/DD':
    case 'YYYY-MM-DD':
      [year, month, day] = parts.map(p => parseInt(p));
      break;
    default:
      return false;
  }
  
  // Check for NaN values
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  
  // Validate ranges
  if (year < 1900 || year > 2030) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  
  // FIXED: Proper date validation - this will catch invalid dates like June 31
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && 
         date.getMonth() === (month - 1) && 
         date.getDate() === day;
}

private isValidMonthAbbreviationFormat(value: string): boolean {
  // Expected format: "18 Aug, 2025" or "18 Aug 2025"
  const match = value.match(/^(\d{1,2})\s+([A-Za-z]{3})\s*,?\s*(\d{4})$/);
  
  if (!match) return false;
  
  const day = parseInt(match[1]);
  const monthAbbr = match[2].toLowerCase();
  const year = parseInt(match[3]);
  
  // Check for NaN values
  if (isNaN(day) || isNaN(year)) return false;
  
  // Month abbreviation mapping
  const monthMap: { [key: string]: number } = {
    'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
    'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
  };
  
  const month = monthMap[monthAbbr];
  if (month === undefined) return false;
  
  // Validate ranges
  if (year < 1900 || year > 2030) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  
  // FIXED: Proper date validation - this will catch invalid dates like "31 Jun, 2025"
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && 
         date.getMonth() === (month - 1) && 
         date.getDate() === day;
}

private isPartialMonthAbbreviationInputValid(value: string): boolean {
  // Allow partial input during typing
  if (!value.trim()) return true;
  
  // For partial input, be more lenient
  // Check if it's a complete date first
  const completeMatch = value.match(/^(\d{1,2})\s+([A-Za-z]{3})\s*,?\s*(\d{4})$/);
  
  if (completeMatch) {
    // If it looks complete, validate it properly
    return this.isValidMonthAbbreviationFormat(value);
  }
  
  // For partial input, just check basic patterns
  const partialPattern = /^(\d{0,2})(\s+([A-Za-z]{0,3})(\s*,?\s*(\d{0,4}))?)?$/;
  const match = value.match(partialPattern);
  
  if (!match) return false;
  
  const dayPart = match[1];
  const monthPart = match[3] || '';
  const yearPart = match[5] || '';
  
  // Basic validation for partial input
  if (dayPart) {
    const day = parseInt(dayPart);
    if (!isNaN(day) && (day < 1 || day > 31)) return false;
  }
  
  if (monthPart && monthPart.length === 3) {
    const monthMap: { [key: string]: number } = {
      'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
      'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
    };
    if (!monthMap[monthPart.toLowerCase()]) return false;
  }
  
  if (yearPart && yearPart.length === 4) {
    const year = parseInt(yearPart);
    if (!isNaN(year) && (year < 1900 || year > 2030)) return false;
  }
  
  return true;
}

private dateFormatValidator(control: AbstractControl): { [key: string]: any } | null {
  if (!control.value) return null;

  let value: string;

  // Check if the value is a Date object
  if (control.value instanceof Date) {
    const date = control.value as Date;
    const format = this.dateFormat();
    
    // Format the Date object based on the current dateFormat
    if (format === 'DD MMM, YYYY') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      value = `${String(date.getDate()).padStart(2, '0')} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
    } else {
      const separator = this.getDateSeparator();
      value = format
        .replace('YYYY', date.getFullYear().toString())
        .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
        .replace('DD', String(date.getDate()).padStart(2, '0'));
    }
  } else {
    value = String(control.value || '');
  }

  // Validate based on the current format
  const format = this.dateFormat();
  
  if (format === 'DD MMM, YYYY') {
    return this.validateMonthAbbreviationFormat(value);
  } else {
    return this.validateStandardDateFormat(value);
  }
}

private validateMonthAbbreviationFormat(value: string): { [key: string]: any } | null {
  // Expected format: "18 Aug, 2025" or "18 Aug 2025"
  const match = value.match(/^(\d{1,2})\s+([A-Za-z]{3})\s*,?\s*(\d{4})$/);
  
  if (!match) {
    return { invalidDateFormat: true };
  }
  
  const day = parseInt(match[1]);
  const monthAbbr = match[2].toLowerCase();
  const year = parseInt(match[3]);
  
  // Check for NaN values
  if (isNaN(day) || isNaN(year)) {
    return { invalidDateFormat: true };
  }
  
  // Month abbreviation mapping
  const monthMap: { [key: string]: number } = {
    'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
    'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
  };
  
  const month = monthMap[monthAbbr];
  if (month === undefined) {
    return { invalidDateFormat: true };
  }
  
  // Validate year range
  if (year < 1900 || year > 2030) {
    return { invalidDate: true };
  }
  
  // Validate day range
  if (day < 1 || day > 31) {
    return { invalidDate: true };
  }
  
  // IMPORTANT: Check if the date actually exists (catches cases like June 31)
  const date = new Date(year, month - 1, day);
  const isValidDate = date.getFullYear() === year && 
                      date.getMonth() === (month - 1) && 
                      date.getDate() === day;
  
  if (!isValidDate) {
    // Store additional info for better error messages
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const daysInMonth = new Date(year, month, 0).getDate();
    
    return { 
      invalidDate: true,
      invalidDateDetails: {
        monthName: monthNames[month - 1],
        year: year,
        maxDays: daysInMonth,
        enteredDay: day
      }
    };
  }
  
  return null;
}
private validateStandardDateFormat(value: string): { [key: string]: any } | null {
  const format = this.dateFormat();
  const separator = format.includes('/') ? '/' : '-';
  const parts = value.split(separator);
  
  if (parts.length !== 3) {
    return { invalidDateFormat: true };
  }
  
  let day: number, month: number, year: number;
  
  switch (format) {
    case 'DD/MM/YYYY':
    case 'DD-MM-YYYY':
      [day, month, year] = parts.map(p => parseInt(p));
      break;
    case 'MM/DD/YYYY':
    case 'MM-DD-YYYY':
      [month, day, year] = parts.map(p => parseInt(p));
      break;
    case 'YYYY/MM/DD':
    case 'YYYY-MM-DD':
      [year, month, day] = parts.map(p => parseInt(p));
      break;
    default:
      return { invalidDateFormat: true };
  }
  
  // Check for NaN values
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return { invalidDateFormat: true };
  }
  
  // Validate basic ranges
  if (year < 1900 || year > 2030 || month < 1 || month > 12 || day < 1 || day > 31) {
    return { invalidDate: true };
  }
  
  // IMPORTANT: Check if the date actually exists (catches cases like June 31)
  const date = new Date(year, month - 1, day);
  const isValidDate = date.getFullYear() === year && 
                      date.getMonth() === (month - 1) && 
                      date.getDate() === day;
  
  if (!isValidDate) {
    // Store additional info for better error messages
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const daysInMonth = new Date(year, month, 0).getDate();
    
    return { 
      invalidDate: true,
      invalidDateDetails: {
        monthName: monthNames[month - 1],
        year: year,
        maxDays: daysInMonth,
        enteredDay: day
      }
    };
  }
  
  return null;
}

// Helper method to get days in a specific month (you can add this for additional validation if needed)
private getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

  hasError(errorCode: string): boolean {
    const control = this.frmGroup().get(this.controlName());
    return !!control?.hasError(errorCode) && control.touched;
  }
}
