import {Component, effect, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatInput} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCard} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TextBaseInput} from '../../../../shared/components/input-types/text-base-input/text-base-input';
import {FORM_LAYOUT} from '../../../../shared/constant/css-constant';
import {ButtonActions} from '../../../../shared/constant/button-actions';
import {RESET_CLICK} from '../../../../shared/constant/button-click';
import {DateInput} from '../../../../shared/components/input-types/date-input/date-input';
import {SelectOptionField} from '../../../../shared/components/input-types/select-option-field/select-option-field';
import {SelectOptions} from '../../../../shared/models/select-options';
import {FormPanel} from '../../../../shared/components/form-panel/form-panel';

@Component({
  selector: 'app-quick-form',
  imports: [
    CommonModule,
    MatInput,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCard,
    ReactiveFormsModule,
    TextBaseInput,
    DateInput,
    SelectOptionField,
    FormPanel,
  ],
  templateUrl: './quick-form.html',
  standalone: true,
  styleUrl: './quick-form.scss'
})
export class QuickForm implements OnInit {

  formBuilder = inject(FormBuilder);
  frmGroup: FormGroup;
  FORM_LAYOUT = FORM_LAYOUT;
  resetClick = RESET_CLICK;
  genderOptions: SelectOptions[] = [
    {key: 'male', value: 'Male'},
    {key: 'female', value: 'Female'}
  ];
  nationalities: SelectOptions[] = [
    {key: 'bd', value: 'Bangladesh'},
    {key: 'us', value: 'United States'},
    {key: 'ca', value: 'Canada'},
    {key: 'uk', value: 'United Kingdom'},
    {key: 'au', value: 'Australia'}
  ];

  constructor() {
    ButtonActions.set({
      save: true,
      update: false,
      view: true,
      delete: true,
      exit: true,
      reset: true
    });

    effect(() => {
      if (this.resetClick()) {
        this.resetForm();
        RESET_CLICK.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.frmGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: [''],
      date: [new Date()],
      gender: ['male'],
      nationality: [null, Validators.required],
      fatherName: ['', Validators.required],
      phone: [''],
      alternativePhone: [''],
      emergencyContactName: [''],
      emergencyContactPhone: [''],
      income: [''],
      streetAddress: [''],
      city: [''],
      state: [''],
      zipCode: [''],
    });
  }

  resetForm(): void {
    this.frmGroup.reset();
    this.frmGroup.patchValue({
      date: new Date(),
    });
  }

}
