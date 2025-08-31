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
  readonly tooltip = input<string>('');
  readonly tooltipPosition = input<'above' | 'below' | 'left' | 'right'>('above');
  readonly tooltipDelay = input<number>(500);
  readonly tooltipClass = input<string>('custom-tooltip');
  //output
  readonly valueChanged = output<string>();
  readonly onChanged = output<any>();

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

  isRequired(): boolean {
    const control = this.frmGroup().get(this.controlName());
    if (!control?.validator) return false;
    const validation = control.validator({} as any);
    return !!validation?.['required'];
  }
}
