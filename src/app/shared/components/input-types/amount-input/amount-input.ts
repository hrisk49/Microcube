import {Component, computed, input, output, signal} from '@angular/core';
import {MatInput} from "@angular/material/input";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
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


    // Outputs
  readonly valueChanged = output<string>();
  readonly onChanged = output<any>();
  readonly onInput = output<any>();

  // Internal state
  isInvalidState = signal(false);
  errorMessage = signal('');

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
    if (typeof error === 'object' && error !== null) {
      return error[errorCode];
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
}
