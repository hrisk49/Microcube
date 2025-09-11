// moment-date-input.component.ts
import {ChangeDetectionStrategy, Component, input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NgIf} from '@angular/common';
import { MOMENT_DATE_FORMATS } from '../../adapter/moment-date-format.constant';
import moment from 'moment';

export interface MomentDateConfig {
  parse: {
    dateInput: string;
  };
  display: {
    dateInput: string;
    monthYearLabel: string;
    dateA11yLabel: string;
    monthYearA11yLabel: string;
  };
}

@Component({
  selector: 'lds-moment-date-input',
  templateUrl: './moment-date-format.component.html',
  styles: [`
    .full-width {
    }
    
    :host {
      display: block;
    }
  `],
  providers: [
    // Provide Moment.js date adapter with custom formats
    provideMomentDateAdapter(MOMENT_DATE_FORMATS),
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class MomentDateInputComponent implements OnInit {
  // Required inputs
  readonly formGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  
  // Optional inputs with defaults
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly hint = input<string>('MMMM DD, YYYY');
  readonly appearance = input<'fill' | 'outline'>('outline');
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly initialValue = input<any>(null);
  
  // Custom formats input (optional)
  readonly customFormats = input<MomentDateConfig>();

  ngOnInit(): void {
    const control = this.getFormControl();
    
    // Set initial value if provided and control is empty
    if (this.initialValue() && !control.value) {
      const initialDate = moment(this.initialValue()).isValid() 
        ? moment(this.initialValue()) 
        : moment();
      control.setValue(initialDate);
    }
  }

  getFormControl(): FormControl {
    const control = this.formGroup().get(this.controlName());
    if (!control) {
      throw new Error(`FormControl with name '${this.controlName()}' not found in FormGroup`);
    }
    return control as FormControl;
  }

  // Helper method to get current value as moment object
  getMomentValue(): any {
    return this.getFormControl().value;
  }

  // Helper method to get current value as JavaScript Date
  getDateValue(): Date | null {
    const momentValue = this.getMomentValue();
    return momentValue && moment.isMoment(momentValue) ? momentValue.toDate() : null;
  }

  // Helper method to set value programmatically
  setValue(value: any): void {
    const momentValue = moment(value).isValid() ? moment(value) : null;
    this.getFormControl().setValue(momentValue);
  }

  // Helper method to clear the date
  clearDate(): void {
    this.getFormControl().setValue(null);
  }
}