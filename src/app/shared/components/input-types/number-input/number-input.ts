import {Component, computed, input, output, signal, effect} from '@angular/core';
import {MatInput} from "@angular/material/input";
import {FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass} from '@angular/common';

@Component({
  selector: 'lds-number',
  imports: [
    MatInput,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './number-input.html',
  standalone: true,
  styleUrl: './number-input.scss'
})
export class NumberInput {
  readonly frmGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly label = input.required<string>();
  readonly isReadonly = input<boolean>();
  readonly placeholder = input<any>();
  readonly enable = input<boolean>(true);
  readonly valueChange = output<any>();
  readonly cssClass = input<string>('');
  readonly maxLen = input<number>();
  readonly minLen = input<number>();
  readonly labelText = input<string>('');
  
  // Add min and max value inputs for validation
  readonly minValue = input<number>();
  readonly maxValue = input<number>();

  // Outputs
  readonly valueChanged = output<string>();
  readonly onChanged = output<any>();

  // Internal state
  isInvalidState = signal(false);
  errorMessage = signal('');

  constructor() {
    // Effect to update validators when min/max value inputs change
    effect(() => {
      this.updateValidators();
    });
  }

  private updateValidators(): void {
    const control = this.frmGroup().get(this.controlName());
    if (!control) return;

    const validators = [];
    
    // Check if field was already required
    if (this.isRequired()) {
      validators.push(Validators.required);
    }
    
    // Add min value validator if specified
    if (this.minValue() !== undefined && this.minValue() !== null) {
      validators.push(Validators.min(this.minValue()!));
    }
    
    // Add max value validator if specified
    if (this.maxValue() !== undefined && this.maxValue() !== null) {
      validators.push(Validators.max(this.maxValue()!));
    }

    // Add min length validator if specified
    if (this.minLen() !== undefined && this.minLen()! > 0) {
      validators.push(Validators.minLength(this.minLen()!));
    }
    
    // Add max length validator if specified
    if (this.maxLen() !== undefined && this.maxLen()! > 0) {
      validators.push(Validators.maxLength(this.maxLen()!));
    }
    
    // Add pattern validator to ensure only integers (no decimals)
    validators.push(Validators.pattern(/^\d+$/));
    
    // Update the control's validators
    control.setValidators(validators);
    control.updateValueAndValidity();
  }

  // Computed signals for reactive styling
  inputClasses = computed(() => {
    const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none';
    const stateClasses = this.isDisabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white';
    const errorClasses = this.isInvalidState() ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-300' : 'border-gray-300';
    const customClasses = this.cssClass() || '';
    
    return `${baseClasses} ${stateClasses} ${errorClasses} ${customClasses}`;
  });

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
    
    // For min and max errors, Angular returns an object {min: expectedValue, actual: actualValue}
    if (errorCode === 'min' && error) {
      return error.min;
    }
    if (errorCode === 'max' && error) {
      return error.max;
    }
    
    return error;
  }

  get isDisabled(): boolean {
    return !this.enable();
  }

  // Prevent decimal point and other non-numeric characters, and enforce max length
  onKeyPress(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value || '';
    const maxLength = this.maxLen();
    
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    
    // Always allow navigation and control keys
    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }
    
    // Prevent decimal point specifically
    if (event.key === '.' || event.key === ',') {
      event.preventDefault();
      return;
    }
    
    // Check if it's a numeric character
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
      return;
    }
    
    // Prevent typing if max length is reached and no text is selected
    if (maxLength && currentValue.length >= maxLength) {
      // Only prevent if no text is selected (which would be replaced)
      const selectionStart = input.selectionStart || 0;
      const selectionEnd = input.selectionEnd || 0;
      
      if (selectionStart === selectionEnd) {
        // No text selected, prevent typing
        event.preventDefault();
      }
    }
  }

  // Additional input validation with max length enforcement
  onInput(event: any): void {
    const input = event.target;
    let value = input.value;
    const maxLength = this.maxLen();
    
    // Remove any non-numeric characters (including decimal points)
    value = value.replace(/[^0-9]/g, '');
    
    // Enforce max length by truncating if necessary
    if (maxLength && value.length > maxLength) {
      value = value.substring(0, maxLength);
    }
    
    // Update the input value if it was changed
    if (input.value !== value) {
      input.value = value;
      
      // Update form control
      const control = this.frmGroup().get(this.controlName());
      if (control) {
        control.setValue(value ? parseInt(value, 10) : null);
      }
    }
    
    this.onChangeInput();
  }

  onChangeInput() {
    const control = this.frmGroup().get(this.controlName());
    this.valueChange.emit(control?.value);
  }
}