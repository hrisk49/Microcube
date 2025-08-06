import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectOptionField } from '../../../../shared/components/input-types/select-option-field/select-option-field';
import { TextBaseInput } from '../../../../shared/components/input-types/text-base-input/text-base-input';
import { ToastrService } from 'ngx-toastr';
import { RESET_CLICK } from '../../../../shared/constant/button-click';
import { SelectOptions } from '../../../../shared/models/select-options';
import { ButtonActions } from '../../../../shared/constant/button-actions';
import { FormPanel } from '../../../../shared/components/form-panel/form-panel';
import { DateInput } from '../../../../shared/components/input-types/date-input/date-input';
import { from } from 'rxjs';

@Component({
  selector: 'app-pacs-002',
  imports: [
    FormPanel,
        ReactiveFormsModule,
        SelectOptionField,
        TextBaseInput,
        DateInput,
  ],
  templateUrl: './pacs-002.html',
  styleUrl: './pacs-002.scss'
})
export class Pacs002 implements OnInit {
  form: FormGroup;
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  frmGroup : FormGroup;
  resetClick = RESET_CLICK;

  priorityOptions: SelectOptions[] = [
    {key: 'high', value: 'High'},
    {key: 'low', value: 'Low'},
    {key: 'normal', value: 'Normal'},
    {key: 'urgent', value: 'Urgent'}
  ];

  duplicateOptions : SelectOptions[] = [
    {key: 'codu', value: 'CODU'},
    {key: 'copy', value: 'COPY'},
    {key: 'dupl', value: 'DUPL'}
  ];

  settlementOptions: SelectOptions[] = [
    {key: 'clrg', value: 'CLRG'},
    {key: 'cove', value: 'COVE'},
    {key: 'inda', value: 'INDA'},
    {key: 'inga', value: 'INGA'}
  ];

  chargeBearerOptions: SelectOptions[] = [
    {key: 'debt', value: 'Debitor'},
    {key: 'cred', value: 'Creditor'},
    {key: 'shar', value: 'Shared'}
  ];

  constructor(){
    ButtonActions.set({
      save: true,
      update: false,
      view: true,
      delete: true,
      exit: true,
      reset: false
    });

    effect(() => {
      if (this.resetClick()) {
        this.resetForm();
        RESET_CLICK.set(false);
      }
    });


  }



  ngOnInit():void {
    this.initForm();
  }

  initForm(): void {
    this.frmGroup = this.formBuilder.group({
       // Business Application Header
      fromBic:['',Validators.required],
      toBic: ['', Validators.required],
      businessMessageIdentifier: [''],
      messageDefinitionIdentifier: [''],
      businessService: ['', Validators.required],
      copyDuplicate: ['codu'],
      priority: ['high'],

       // Business Application Header -> related
      relatedFromBic: ['', Validators.required],
      relatedToBic: ['', Validators.required],
      relatedBusinessMessageIdentifier: [''],
      relatedMessageDefinitionIdentifier: [''],
      relatedBusinessService: ['', Validators.required],
      relatedCopyDuplicate: ['codu'],
      relatedPriority: ['high'],

      //  FI To FI Payment Status Report
      msgId: [''],
      creationDate: [new Date()],

      // Transaction Information And Status
      TxInfAndSts :['',Validators.required],
      OrgnlGrpInf:[''],
      OrgnlInstrId: ['', Validators.required],
      OrgnlEndToEndId: ['',Validators.required],
      OrgnlTxId: [''],
      OrgnlUETR: ['', Validators.required],
      TxSts: ['', Validators.required],
      StsRsnInf: [''],
      ClrSysRef: [''],
      InstgAgt: ['',Validators.required],
      InstdAgt: ['',Validators.required],
    });
  }

  resetForm(): void{
    this.frmGroup.reset();
    this.frmGroup.patchValue({
      date: new Date()
    });
  }

}
