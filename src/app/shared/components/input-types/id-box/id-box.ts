import {Component, computed, input, output, signal, effect} from '@angular/core';
import {MatInput} from "@angular/material/input";
import {FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass} from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'lds-id-box',
  imports: [
    MatInput,
    MatTooltipModule,
    MatRippleModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './id-box.html',
  standalone: true,
  styleUrl: './id-box.scss'
})
export class IdBoxComponent {

  // Required inputs
  readonly frmGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();

  // Optional inputs with defaults
  readonly id = input<string>('');
  readonly value = input<string>('');
  readonly isReadonly = input<boolean>();
  readonly label = input.required<string>();
  readonly valueChange = output<any>();
  readonly placeholder = input<any>();
  readonly tooltip = input<string>('');
  readonly labelText = input<string>('');
  readonly leadingZero = input<string>('');
  readonly visible = input<boolean>(true);
  
  // New validation inputs
  readonly minLength = input<number>();
  readonly maxLength = input<number>();

  // Outputs
  readonly valueChanged = output<string>();
  readonly onChanged = output<any>();
  readonly onInput = output<any>();
  readonly onDoubleClick = output<void>();
  readonly dotsClicked = output<void>(); 
  readonly isDotsVisible = input<boolean>(true);

  // Internal state
  isInvalidState = signal(false);
  errorMessage = signal('');

  constructor() {
    // Effect to update validators when min/max length inputs change
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
    
    // Add min length validator if specified
    if (this.minLength() !== undefined && this.minLength()! > 0) {
      validators.push(Validators.minLength(this.minLength()!));
    }
    
    // Add max length validator if specified
    if (this.maxLength() !== undefined && this.maxLength()! > 0) {
      validators.push(Validators.maxLength(this.maxLength()!));
    }
    
    // Update the control's validators
    control.setValidators(validators);
    control.updateValueAndValidity();
  }

  // Computed signals for reactive styling
  inputClasses = computed(() => {
    const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
    const errorClasses = this.isInvalidState() ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-300' : 'border-gray-300';

    const visibilityClasses = this.visible() ? '' : 'hidden';
    
    return `${baseClasses} ${errorClasses} ${visibilityClasses}`;
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
    return error;
  }

  onChangeInput() {
    const control = this.frmGroup().get(this.controlName());
    this.valueChange.emit(control?.value);
  }

  onDotsClick() {
    this.dotsClicked.emit();
  }
}