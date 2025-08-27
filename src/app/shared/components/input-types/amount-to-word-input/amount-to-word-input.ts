import {Component, input, output, effect} from '@angular/core';
import {MatInput} from "@angular/material/input";
import {FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors} from "@angular/forms";
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-amount-to-word-input',
  imports: [
    MatInput,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './amount-to-word-input.html',
  standalone: true,
  styleUrl: './amount-to-word-input.scss'
})
export class AmountToWordInput {
  readonly frmGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly label = input.required<string>();
  readonly isReadonly = input<boolean>();
  readonly placeholder = input<any>();
  readonly valueChange = output<any>();
  readonly isVertical = input<boolean>(false);
  
  // New validation inputs (same as AmountInput)
  readonly decimalPlaces = input<number>(2);
  readonly allowNegative = input<boolean>(false);
  readonly allowLeadingZeros = input<boolean>(false);
  readonly maxLen = input<number>();
  readonly maxAmt = input<number>();
  readonly minAmt = input<number>();

  constructor() {
    // Effect to update validators when validation inputs change
    effect(() => {
      this.updateValidators();
    });
  }

  // Custom validators (same as AmountInput)
  static amountValidator(decimalPlaces: number, allowLeadingZeros: boolean) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = control.value.toString();
      
      // Check for leading zeros (like 0987)
      if (!allowLeadingZeros && /^0\d+/.test(value)) {
        return { leadingZeros: { value: control.value } };
      }
      
      // Create regex based on decimal places
      const decimalRegex = decimalPlaces > 0 
        ? new RegExp(`^\\d+(\\.\\d{1,${decimalPlaces}})?$`)
        : /^\d+$/;
      
      if (!decimalRegex.test(value)) {
        return { invalidAmount: { 
          value: control.value, 
          maxDecimals: decimalPlaces 
        } };
      }
      
      return null;
    };
  }

  static negativeAmountValidator(allowNegative: boolean) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const numValue = parseFloat(control.value);
      if (!allowNegative && numValue < 0) {
        return { negativeNotAllowed: { value: control.value } };
      }
      
      return null;
    };
  }

  static maxLengthNumberValidator(maxLength: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = control.value.toString();
      if (value.length > maxLength) {
        return { 
          maxLengthNumber: { 
            actualLength: value.length,
            requiredLength: maxLength,
            value: control.value
          } 
        };
      }
      
      return null;
    };
  }

  private updateValidators(): void {
    const control = this.frmGroup().get(this.controlName());
    if (!control) return;

    const validators = [];
    
    // Check if field was already required
    if (this.isRequired()) {
      validators.push(Validators.required);
    }
    
    // Add min/max validators if specified
    if (this.minAmt() !== undefined) {
      validators.push(Validators.min(this.minAmt()!));
    }
    
    if (this.maxAmt() !== undefined) {
      validators.push(Validators.max(this.maxAmt()!));
    }

    // Add max length validator for numbers
    if (this.maxLen() !== undefined && this.maxLen()! > 0) {
      validators.push(AmountToWordInput.maxLengthNumberValidator(this.maxLen()!));
    }
    
    // Add custom amount validator
    validators.push(AmountToWordInput.amountValidator(
      this.decimalPlaces(), 
      this.allowLeadingZeros()
    ));
    
    // Add negative validator
    validators.push(AmountToWordInput.negativeAmountValidator(this.allowNegative()));
    
    // Update the control's validators
    control.setValidators(validators);
    control.updateValueAndValidity();
  }

  isRequired(): boolean {
    const control = this.frmGroup().get(this.controlName());
    if (!control?.validator) return false;
    const validation = control.validator({} as any);
    return !!validation?.['required'];
  }

  isInvalid(): boolean {
    const control = this.frmGroup().get(this.controlName());
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  hasError(errorCode: string): boolean {
    const control = this.frmGroup().get(this.controlName());
    return !!control?.hasError(errorCode);
  }

  getErrorValue(errorCode: string): any {
    const control = this.frmGroup().get(this.controlName());
    const error = control?.getError(errorCode);
    
    // For min and max errors, Angular returns an object {min: x, actual: y}
    if (errorCode === 'min' && error) {
      return error.min;
    }
    if (errorCode === 'max' && error) {
      return error.max;
    }
    
    // For custom validators
    if (typeof error === 'object' && error !== null) {
      return error;
    }
    return error;
  }

  // Enhanced input handler with all validations
  onChangeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const control = this.frmGroup().get(this.controlName());
    let value = input.value;
    
    // Remove leading zeros (convert "0345" to "345", but keep "0" and "0.5")
    if (value && !this.allowLeadingZeros()) {
      if (value !== '0' && !value.startsWith('0.') && /^0+/.test(value)) {
        value = value.replace(/^0+/, '') || '0';
      }
    }
    
    // Handle decimal places restriction
    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts[1] && parts[1].length > this.decimalPlaces()) {
        value = parts[0] + '.' + parts[1].substring(0, this.decimalPlaces());
      }
    }
    
    // Apply maxLength restriction if specified
    if (this.maxLen() && value.length > this.maxLen()!) {
      value = value.slice(0, this.maxLen()!);
    }
    
    // Update input and form control if value changed
    if (input.value !== value) {
      input.value = value;
      control?.setValue(value);
    }
    
    this.valueChange.emit(control?.value);
  }

  // Prevent typing beyond decimal places and restrictions
  onKeyPress(event: KeyboardEvent): boolean {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const currentLength = currentValue.length;
    const char = event.key;
    const cursorPosition = input.selectionStart || 0;
    
    // Allow control keys
    if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key) ||
        (event.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(event.key.toLowerCase()))) {
      return true;
    }
    
    // Only allow numbers and decimal point
    if (!/[\d.]/.test(char)) {
      event.preventDefault();
      return false;
    }
    
    // Handle decimal point restrictions
    if (char === '.') {
      if (currentValue.includes('.') || this.decimalPlaces() === 0) {
        event.preventDefault();
        return false;
      }
      return true;
    }
    
    // Handle digit input after decimal point
    if (currentValue.includes('.')) {
      const decimalIndex = currentValue.indexOf('.');
      const afterDecimal = currentValue.substring(decimalIndex + 1);
      
      if (cursorPosition > decimalIndex && afterDecimal.length >= this.decimalPlaces()) {
        event.preventDefault();
        return false;
      }
    }
    
    // Prevent leading zeros
    if (char === '0' && currentValue === '' && !this.allowLeadingZeros()) {
      return true;
    }
    
    if (currentValue === '0' && /\d/.test(char) && char !== '.' && !this.allowLeadingZeros()) {
      event.preventDefault();
      return false;
    }
    
    // Check max length
    if (this.maxLen() && currentLength >= this.maxLen()!) {
      event.preventDefault();
      return false;
    }
    
    return true;
  }

  // Handle paste events
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    
    const paste = event.clipboardData?.getData('text') || '';
    const input = event.target as HTMLInputElement;
    const control = this.frmGroup().get(this.controlName());
    
    // Clean the pasted value
    let cleanValue = paste.replace(/[^0-9.]/g, '');
    
    // Remove multiple decimal points
    const decimalCount = (cleanValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
      const firstDecimalIndex = cleanValue.indexOf('.');
      cleanValue = cleanValue.substring(0, firstDecimalIndex + 1) + 
                   cleanValue.substring(firstDecimalIndex + 1).replace(/\./g, '');
    }
    
    // Handle decimal places
    if (cleanValue.includes('.')) {
      const parts = cleanValue.split('.');
      if (parts[1] && parts[1].length > this.decimalPlaces()) {
        cleanValue = parts[0] + '.' + parts[1].substring(0, this.decimalPlaces());
      }
      
      if (this.decimalPlaces() === 0) {
        cleanValue = parts[0];
      }
    }
    
    // Remove leading zeros
    if (cleanValue && !this.allowLeadingZeros()) {
      if (cleanValue !== '0' && !cleanValue.startsWith('0.') && /^0+/.test(cleanValue)) {
        cleanValue = cleanValue.replace(/^0+/, '') || '0';
      }
    }
    
    // Apply max length
    if (this.maxLen() && cleanValue.length > this.maxLen()!) {
      cleanValue = cleanValue.slice(0, this.maxLen()!);
    }
    
    input.value = cleanValue;
    control?.setValue(cleanValue);
    this.valueChange.emit(control?.value);
  }

  // Helper method for step attribute
  getStepValue(): string {
    if (this.decimalPlaces() === 0) return '1';
    return '0.' + '0'.repeat(this.decimalPlaces() - 1) + '1';
  }

  amountToWord() {
    const value = this.frmGroup().get(this.controlName())?.value;
    if (!value || isNaN(value)) return '';
    
    const [wholeStr, decimalStr] = value.toString().split('.');
    const wholeNumber = parseInt(wholeStr, 10);
    
    const words = this.convertNumberToWords(wholeNumber);
    
    // Handle decimal part with "point"
    if (decimalStr && decimalStr.length > 0) {
      const decimalWords = decimalStr.split('').map((digit: string) => 
        this.convertNumberToWords(parseInt(digit, 10))
      ).join(' ');
      
      return words + ' Point ' + decimalWords;
    }
    
    return words;
  }

  convertNumberToWords(num: number): string {
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];

    if ((num = num || 0) === 0) return 'Zero';
    if (num < 20) return a[num];
    if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? ' ' + a[num % 10] : '');
    if (num < 1000) return a[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + this.convertNumberToWords(num % 100) : '');
    if (num < 100000) return this.convertNumberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + this.convertNumberToWords(num % 1000) : '');
    if (num < 10000000) return this.convertNumberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + this.convertNumberToWords(num % 100000) : '');
    return this.convertNumberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + this.convertNumberToWords(num % 10000000) : '');
  }
}