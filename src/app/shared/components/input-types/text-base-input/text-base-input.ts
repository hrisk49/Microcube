import {Component, input, output, effect} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-text-base-input',
  imports: [
    FormsModule,
    MatInput,
    ReactiveFormsModule,
    NgClass,
    MatTooltipModule
  ],
  templateUrl: './text-base-input.html',
  standalone: true,
  styleUrl: './text-base-input.scss'
})
export class TextBaseInput {
  readonly frmGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly label = input.required<string>();
  readonly type = input<string>();
  readonly isReadonly = input<boolean>();
  readonly placeholder = input<any>();
  readonly minLength = input<number>();
  readonly maxLength = input<number>();
  readonly onDoubleClick = output<void>();
  readonly isVertical = input<boolean>(false);

  // Tooltip support
  readonly isAllowSpecialChars = input<boolean>(true);
  readonly tooltip = input<string>('');
  readonly tooltipPosition = input<'above' | 'below' | 'left' | 'right'>('above');
  readonly tooltipDelay = input<number>(500);
  readonly tooltipClass = input<string>('custom-tooltip');

  // Custom error messages support
  readonly customErrorMessages = input<{ [key: string]: string }>({});

  // Output
  readonly valueChanged = output<string>();
  readonly onChanged = output<any>();

  
  constructor() {
    // Effect to update validators when min/max length inputs change
    effect(() => {
      this.updateValidators();
    });
  }

  private specialCharacterValidator(control: any): { [key: string]: boolean } | null {
    const specialCharRegex = /^[a-zA-Z0-9 ]*$/;
    if (control.value && !specialCharRegex.test(control.value)) {
      return { specialCharacterNotAllowed: true };
    }
    return null;
  }

  private updateValidators(): void {
    const control = this.frmGroup().get(this.controlName());
    if (!control) return;

    const existingValidators = control.validator ? [control.validator] : [];
    const validators = [...existingValidators];

    // Add required validator if detected from outside or input()
    if (this.isRequired()) {
      validators.push(Validators.required);
    }

    // Add min length validator if specified
    if (this.minLength() !== undefined && this.minLength()! > 0) {
      validators.push(Validators.minLength(this.minLength()!));
    }

    // Add max length validator if specified
    if (this.maxLength() !== undefined && this.maxLength()! > 0) {
      validators.push(Validators.maxLength(this.maxLength()!));
    }

    // Add special character validator if not allowed
    if (!this.isAllowSpecialChars()) {
      validators.push(this.specialCharacterValidator);
    }

    // Merge validators without overwriting existing ones
    control.setValidators(validators);
    control.updateValueAndValidity();
  }

  isRequired(): boolean {
    const control = this.frmGroup().get(this.controlName());
    if (!control?.validator) return false;
    const validation = control.validator({} as any);
    return !!validation?.['required'];
  }

  preventSpecialChars(event: KeyboardEvent): void {
    if (!this.isAllowSpecialChars()) {
      const specialCharRegex = /^[a-zA-Z0-9 ]$/;
      const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
      
      // Allow navigation and editing keys
      if (!specialCharRegex.test(event.key) && !allowedKeys.includes(event.key)) {
        event.preventDefault();
      }
    }
  }

  // Get custom error message for a specific error key
  getCustomErrorMessage(errorKey: string): string {
    const customMessages = this.customErrorMessages();
    return customMessages[errorKey] || `${this.label()} has validation error: ${errorKey}`;
  }

  // Get all error keys that are not handled by default error messages
  getCustomErrorKeys(): string[] {
    const control = this.frmGroup().get(this.controlName());
    if (!control?.errors) return [];

    const defaultErrorKeys = ['required', 'minlength', 'maxlength', 'specialCharacterNotAllowed'];
    return Object.keys(control.errors).filter(key => !defaultErrorKeys.includes(key));
  }

  // Check if there are any custom errors to display
  hasCustomErrors(): boolean {
    return this.getCustomErrorKeys().length > 0;
  }
}