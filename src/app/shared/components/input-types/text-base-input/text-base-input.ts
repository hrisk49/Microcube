import {Component, input, output} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-text-base-input',
  imports: [
    FormsModule,
    MatInput,
    ReactiveFormsModule,
    NgClass
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
  readonly onDoubleClick = output<void>();

  //output
  readonly valueChanged = output<string>();
  readonly onChanged = output<any>();

  isRequired(): boolean {
    const control = this.frmGroup().get(this.controlName());
    if (!control?.validator) return false;
    const validation = control.validator({} as any);
    return !!validation?.['required'];
  }

  


}
