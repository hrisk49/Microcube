import {Component, input} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {NgClass} from '@angular/common';

type Option = { key: any; value: string };

@Component({
  selector: 'app-select-option-field',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInput,
    NgClass
  ],
  templateUrl: './select-option-field.html',
  standalone: true,
  styleUrl: './select-option-field.scss'
})
export class SelectOptionField {
  readonly frmGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly label = input.required<string>();
  readonly isReadonly = input<boolean>();
  options = input<Option[] | null>(null);

  isRequired(): boolean {
    const control = this.frmGroup().get(this.controlName());
    if (!control?.validator) return false;
    const validation = control.validator({} as any);
    return !!validation?.['required'];
  }
}
