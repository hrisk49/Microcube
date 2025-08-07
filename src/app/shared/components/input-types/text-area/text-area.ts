import { Component, input, output, signal, OnInit, OnChanges, computed } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'lds-txt-area',
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf
  ],
  templateUrl: './text-area.html',
  styleUrl: './text-area.scss'
})
export class TextArea implements OnInit, OnChanges {
  // Form inputs
  readonly frmGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();

  // Inputs
  readonly id = input<string>('');
  readonly cssClass = input<string>('');
  readonly styles = input<string>('');
  readonly rows = input<number>(3);
  readonly placeholder = input<string>('');
  readonly required = input<boolean>(false);
  readonly enable = input<boolean>(true);
  readonly visible = input<boolean>(true);
  readonly maxLen = input<number>(2147483647);
  readonly minLen = input<number>(-2147483648);
  readonly labelText = input<string>('');

  // Outputs
  readonly valueChanged = output<string>();
  readonly onChanged = output<any>();

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

  ngOnInit() {
    // Set up value change listener
    const control = this.frmGroup().get(this.controlName());
    if (control) {
      control.valueChanges.subscribe(value => {
        this.valueChanged.emit(value || '');
        this.validateInput();
      });
      
      // Handle enable/disable state
      this.updateControlState();
    }
  }

  ngOnChanges() {
    this.validateInput();
    this.updateControlState();
  }

  updateControlState() {
    const control = this.frmGroup().get(this.controlName());
    if (control) {
      if (this.isDisabled) {
        control.disable();
      } else {
        control.enable();
      }
    }
  }

  isRequired(): boolean {
    const control = this.frmGroup().get(this.controlName());
    if (!control?.validator) return false;
    const validation = control.validator({} as any);
    return !!validation?.['required'];
  }

  isInvalid(): boolean {
    console.log('isInvalid', this.isInvalidState());
    const control = this.frmGroup().get(this.controlName());
    const hasFormErrors = !!(control && control.invalid && (control.touched || control.dirty));
    const hasCustomErrors = this.isInvalidState();
    return hasFormErrors || hasCustomErrors;
  }

  hasError(errorCode: string): boolean {
    const control = this.frmGroup().get(this.controlName());
    return !!control?.hasError(errorCode);
  }

  getErrorValue(errorCode: string): any {
    const control = this.frmGroup().get(this.controlName());
    const error = control?.getError(errorCode);
    if (typeof error === 'object' && error !== null) {
      return error[errorCode];
    }
    return error;
  }

  validateInput() {
    const control = this.frmGroup().get(this.controlName());
    if (!control) return;

    const value = control.value || '';
    let message = '';

    // Check required validation
    if (this.isRequired() && !value.trim()) {
      message = `${this.labelText() || 'This field'} is required!`;
    }
    // Check minimum length
    else if (this.minLen() > -2147483648 && value.length < this.minLen()) {
      message = `Minimum ${this.minLen()} characters required.`;
    }
    // Check maximum length
    else if (this.maxLen() < 2147483647 && value.length > this.maxLen()) {
      message = `Maximum ${this.maxLen()} characters allowed.`;
    }

    // Only show validation errors if the field has been touched or is dirty
    const shouldShowError = control.touched || control.dirty;
    this.isInvalidState.set(!!message && shouldShowError);
    this.errorMessage.set(message);
  }

  onInputChange(event: any) {
    this.onChanged.emit(event);
  }

  get isDisabled(): boolean {
    return !this.enable();
  }

  get isHidden(): boolean {
    return !this.visible();
  }



  get currentValue(): string {
    const control = this.frmGroup().get(this.controlName());
    return control?.value || '';
  }

  get characterCount(): number {
    return this.currentValue.length;
  }
}
