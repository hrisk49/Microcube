import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatError, MatFormField, MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCard} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TextBaseInput} from './input-types/text-base-input/text-base-input';

@Component({
  selector: 'app-quick-form',
  imports: [
    CommonModule,
    MatIcon,
    MatFormField,
    MatSelect,
    MatOption,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatInput,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCard,
    MatError,
    ReactiveFormsModule,
    TextBaseInput,
  ],
  templateUrl: './quick-form.html',
  styleUrl: './quick-form.scss'
})
export class QuickForm implements OnInit {

  formBuilder = inject(FormBuilder);
  frmGroup: FormGroup;

  constructor() {
  }

  ngOnInit(): void {
    this.frmGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: [''],
      date: [new Date()],
      message: ['']
    });
  }

}
