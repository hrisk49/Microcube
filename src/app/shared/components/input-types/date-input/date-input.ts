import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatInput, MatSuffix} from '@angular/material/input';
import {NgClass} from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {CustomDateAdapter} from '../../../adapter/custom-date.adapter';
import {APP_DATE_FORMATS} from '../../../constant/app_date_formats';
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';

@Component({
  selector: 'app-date-input',
  imports: [
    FormsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatInput,
    ReactiveFormsModule,
    MatSuffix,
    NgClass,
    NgxMaskDirective
  ],
  templateUrl: './date-input.html',
  standalone: true,
  styleUrl: './date-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    provideNgxMask()
  ],
})
export class DateInput {

  readonly frmGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly label = input.required<string>();
  readonly isReadonly = input<boolean>(false);
  readonly placeholder = input<any>();

  isRequired(): boolean {
    const control = this.frmGroup().get(this.controlName());
    if (!control?.validator) return false;
    const validation = control.validator({} as any);
    return !!validation?.['required'];
  }

}
