import {Component, computed, input, output, signal} from '@angular/core';
import {MatInput} from "@angular/material/input";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgClass} from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'lds-id-box',
  imports: [
    MatInput,
    MatTooltipModule,
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

  // Outputs
  readonly valueChanged = output<string>();
  readonly onChanged = output<any>();
  readonly onInput = output<any>();
  readonly onDoubleClick = output<void>();


  // Internal state
  isInvalidState = signal(false);
  errorMessage = signal('');

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
}