import {Component, computed, input, output, signal, effect} from '@angular/core';
import {MatInput} from "@angular/material/input";
import {FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors} from "@angular/forms";
import {NgClass} from '@angular/common';

@Component({
  selector: 'lds-amount',
  imports: [
    MatInput,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './amount-input.html',
  standalone: true,
  styleUrl: './amount-input.scss'
})
export class AmountInput {

  readonly frmGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly label = input.required<string>();
  readonly isReadonly = input<boolean>();
  readonly placeholder = input<any>();
  readonly enable = input<boolean>(true);
  readonly valueChange = output<any>();
  readonly cssClass = input<string>('');
  readonly maxLen = input<number>();
  readonly maxAmt = input<number>();
  readonly minAmt = input<number>();
  readonly labelText = input<string>('');
  
  // New validation inputs
  readonly decimalPlaces = input<number>(2); // Default to 2 decimal places
  readonly allowNegative = input<boolean>(false);
  readonly allowLeadingZeros = input<boolean>(false);

  // Outputs
  readonly valueChanged = output<string>();
  readonly onChanged = output<any>();
  readonly onInput = output<any>();

  // Internal state
  isInvalidState = signal(false);
  errorMessage = signal('');

  constructor() {
    // Effect to update validators when validation inputs change
    effect(() => {
      this.updateValidators();
    });
  }

  // Custom validators
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
    
    // Add custom amount validator
    validators.push(AmountInput.amountValidator(
      this.decimalPlaces(), 
      this.allowLeadingZeros()
    ));
    
    // Add negative validator
    validators.push(AmountInput.negativeAmountValidator(this.allowNegative()));
    
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

  get isDisabled(): boolean {
    return !this.enable();
  }

  onChangeInput() {
    const control = this.frmGroup().get(this.controlName());
    this.valueChange.emit(control?.value);
  }

  // Helper method to format step attribute based on decimal places
  getStepValue(): string {
    if (this.decimalPlaces() === 0) return '1';
    return '0.' + '0'.repeat(this.decimalPlaces() - 1) + '1';
  }
}