import { ChangeDetectionStrategy, Component, input, effect, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatInput, MatSuffix } from '@angular/material/input';
import { NgClass } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateAdapter } from '../../../adapter/custom-date.adapter';
import { AppDateFormatsConstant } from '../../../constant/app-date-formats.constant';

export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY/MM/DD' | 'DD-MM-YYYY' | 'MM-DD-YYYY' | 'YYYY-MM-DD';

@Component({
  selector: 'lds-date-input',
  imports: [
    FormsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatInput,
    ReactiveFormsModule,
    MatSuffix,
    NgClass
  ],
  templateUrl: './date-input.component.html',
  standalone: true,
  styleUrl: './date-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: AppDateFormatsConstant }
  ],
})
export class DateInputComponent {
  readonly frmGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly label = input.required<string>();
  readonly isReadonly = input<boolean>(false);
  readonly dateFormat = input<DateFormat>('DD/MM/YYYY');
  readonly isVertical = input<boolean>(false);

  private dateAdapter = inject(DateAdapter) as CustomDateAdapter;

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

  getDateSeparator(): string {
    return this.dateFormat().includes('/') ? '/' : '-';
  }

  onKeyDown(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End',
      'ArrowLeft', 'ArrowRight', 'Clear', 'Copy', 'Paste'
    ];
    
    const isNumberKey = (event.key >= '0' && event.key <= '9');
    const isSeparatorKey = event.key === this.getDateSeparator();
    
    if (!allowedKeys.includes(event.key) && !isNumberKey && !isSeparatorKey) {
      event.preventDefault();
      return;
    }
    
    // Auto-add separators but be less aggressive
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const cursorPosition = input.selectionStart || 0;
    
    if (isNumberKey) {
      const newValue = currentValue.substring(0, cursorPosition) + event.key + currentValue.substring(cursorPosition);
      
      // Only auto-add separator if we're at the right position and not in the middle of editing
      if (this.shouldAddSeparator(newValue, cursorPosition) && cursorPosition === currentValue.length) {
        event.preventDefault();
        const separator = this.getDateSeparator();
        const valueWithSeparator = currentValue + event.key + separator;
        input.value = valueWithSeparator;
        input.setSelectionRange(valueWithSeparator.length, valueWithSeparator.length);
        
        // Trigger Angular change detection
        const changeEvent = new Event('input', { bubbles: true });
        input.dispatchEvent(changeEvent);
      }
    }
  }

  private shouldAddSeparator(value: string, cursorPosition: number): boolean {
    const format = this.dateFormat();
    const separator = this.getDateSeparator();
    const parts = value.split(separator);
    
    if (parts.length === 1) {
      // First separator
      if (format.startsWith('YYYY')) {
        return parts[0].length === 4; // After year
      } else {
        return parts[0].length === 2; // After day/month
      }
    } else if (parts.length === 2) {
      // Second separator
      if (format.startsWith('YYYY')) {
        return parts[1].length === 2; // After month
      } else {
        return parts[1].length === 2; // After month/day
      }
    }
    
    return false;
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    // Ensure we're working with a string
    if (typeof value !== 'string') {
      value = String(value || '');
    }
    
    // Remove any characters that are not numbers or the expected separator
    const separator = this.getDateSeparator();
    const cleanValue = value.replace(new RegExp(`[^0-9\\${separator}]`, 'g'), '');
    console.log('clean',cleanValue);
    
    if (cleanValue !== value) {
      input.value = cleanValue;
      this.frmGroup().get(this.controlName())?.setValue(cleanValue);
      return;
    }
    
    // Only validate if the input looks like it might be complete or nearly complete
    // Don't clear partial valid input
    if (cleanValue.length > 0) {
      // Allow partial input during typing - only clear if format is obviously wrong
      if (!this.isPartialInputValid(cleanValue)) {
        this.clearField();
      }
    }
  }

  private isValidFormatStructure(value: any): boolean {
    if (!value) return true;
    
    // Convert to string if it's not already
    const stringValue = typeof value === 'string' ? value : String(value);
    
    const separator = this.getDateSeparator();
    const format = this.dateFormat();
    const maxLength = format.length;
    
    // Check if value is too long
    if (stringValue.length > maxLength) return false;
    
    // Check separator positions
    const separatorPositions = [];
    for (let i = 0; i < stringValue.length; i++) {
      if (stringValue[i] === separator) {
        separatorPositions.push(i);
      }
    }
    
    // Check if separators are in correct positions for the format
    if (format.startsWith('YYYY')) {
      return separatorPositions.every((pos, index) => {
        const expectedPositions = [4, 7];
        return pos === expectedPositions[index];
      });
    } else {
      return separatorPositions.every((pos, index) => {
        const expectedPositions = [2, 5];
        return pos === expectedPositions[index];
      });
    }
  }

  onBlur(): void {
    const control = this.frmGroup().get(this.controlName());
    if (control && control.value) {
      // Ensure we have a string value
      const stringValue = typeof control.value === 'string' ? control.value : String(control.value);
      
      // Only validate complete dates on blur - don't clear partial input
      if (this.isCompleteDateInput(stringValue)) {
        const isValid = this.isValidDateFormat(stringValue);
        if (!isValid) {
          this.clearField();
        }
      }
    }
  }

  private isCompleteDateInput(value: string): boolean {
    if (!value) return false;
    
    const separator = this.getDateSeparator();
    const parts = value.split(separator);
    
    // Don't validate if it ends with separator (still typing)
    if (value.endsWith(separator)) return false;
    
    // Check if we have 3 non-empty parts
    if (parts.length !== 3) return false;
    
    // Check that all parts have content and reasonable lengths
    const format = this.dateFormat();
    
    if (format.startsWith('YYYY')) {
      return parts[0].length === 4 && parts[1].length >= 1 && parts[1].length <= 2 && parts[2].length >= 1 && parts[2].length <= 2;
    } else {
      return parts[0].length >= 1 && parts[0].length <= 2 && parts[1].length >= 1 && parts[1].length <= 2 && parts[2].length === 4;
    }
  }

  private clearField(): void {
    const control = this.frmGroup().get(this.controlName());
    if (control) {
      control.setValue('');
      control.markAsTouched();
    }
  }

  private isPartialInputValid(value: string): boolean {
    if (!value) return true;
    
    const format = this.dateFormat();
    const separator = this.getDateSeparator();
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
          // if (part.length === 1 && num > 1) return false;
        } else if (i === 2) { // Day position  
          if (part.length > 2) return false;
          if (part.length === 2 && (num > 31 || num < 1)) return false;
          if (part.length === 1 && num > 3) return false;
        }
      } else if (format.startsWith('DD')) {
        if (i === 0) { // Day position
          if (part.length > 2) return false;
          if (part.length === 2 && (num > 31 || num < 1)) return false;
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
          // if (part.length === 1 && num > 1) return false;
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
    
    // Validate ranges
    if (year < 1900 || year > 2030) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    // Validate actual date
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  }

private dateFormatValidator(control: AbstractControl): { [key: string]: any } | null {
  if (!control.value) return null;

  let value: string;

  // Check if the value is a Date object
  if (control.value instanceof Date) {
    const date = control.value as Date;
    const separator = this.getDateSeparator();
    const format = this.dateFormat();

    // Format the Date object to a string based on the current dateFormat
    value = format
      .replace('YYYY', date.getFullYear().toString())
      .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
      .replace('DD', String(date.getDate()).padStart(2, '0'));
  } else {
    value = control.value;
  }

  console.log('Validating formatted value:', value);

  if (!this.isValidDateFormat(value)) {
    return { invalidDateFormat: true };
  }

  const separator = this.getDateSeparator();
  const parts = value.split(separator);

  if (parts.length === 3) {
    const [year, month, day] = this.dateFormat().startsWith('YYYY')
      ? parts.map(Number)
      : this.dateFormat().startsWith('DD')
      ? [parts[2], parts[1], parts[0]].map(Number)
      : [parts[2], parts[0], parts[1]].map(Number);

    const isValidDate = !isNaN(new Date(year, month - 1, day).getTime());
    if (!isValidDate) {
      return { invalidDate: true };
    }
  }

  // Clear errors if the input is valid
  return null;
}

  hasError(errorCode: string): boolean {
    const control = this.frmGroup().get(this.controlName());
    return !!control?.hasError(errorCode) && control.touched;
  }
}
