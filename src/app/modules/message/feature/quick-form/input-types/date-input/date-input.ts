import {Component, input} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatInput, MatSuffix} from '@angular/material/input';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-date-input',
  imports: [
    FormsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatInput,
    NgIf,
    ReactiveFormsModule,
    MatSuffix
  ],
  templateUrl: './date-input.html',
  standalone: true,
  styleUrl: './date-input.scss'
})
export class DateInput {

  readonly frmGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly label = input.required<string>();

  isRequired(): boolean {
    const control = this.frmGroup().get(this.controlName());
    if (!control?.validator) return false;
    const validation = control.validator({} as any);
    return !!validation?.['required'];
  }

}
