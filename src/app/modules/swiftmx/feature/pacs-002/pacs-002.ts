import {Component, effect, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SelectOptionField} from '../../../../shared/components/input-types/select-option-field/select-option-field';
import {TextBaseInput} from '../../../../shared/components/input-types/text-base-input/text-base-input';
import {ToastrService} from 'ngx-toastr';
import {DateInput} from '../../../../shared/components/input-types/date-input/date-input';
import {BUTTON_VISIBILITY, ONCLICK_RESET, ONCLICK_SAVE} from '../../../../shared/constant/button-signals.constant';
import {Mx002Service} from '../../service/mx002.service';
import {SelectOptionsModel} from '../../../../shared/models/select-options-model';
import {PanelHeader} from '../../../../shared/components/panel-header/panel-header';
import {AmountToWordInput} from '../../../../shared/components/input-types/amount-to-word-input/amount-to-word-input';
import {SubPanelHeader} from '../../../../shared/components/sub-panel-header/sub-panel-header';

@Component({
  selector: 'app-pacs-002',
  imports: [
    ReactiveFormsModule,
    SelectOptionField,
    TextBaseInput,
    DateInput,
    PanelHeader,
    AmountToWordInput,
    SubPanelHeader,

  ],
  templateUrl: './pacs-002.html',
  styleUrl: './pacs-002.scss'
})
export class Pacs002 implements OnInit {
  form: FormGroup;
  formBuilder = inject(FormBuilder);
  mx002Service = inject(Mx002Service);
  toastr = inject(ToastrService);
  frmGroup: FormGroup;
  onClickReset = ONCLICK_RESET;
  onClickSave = ONCLICK_SAVE;

  priorityOptions: SelectOptionsModel[] = [
    {key: 'high', value: 'High'},
    {key: 'low', value: 'Low'},
    {key: 'normal', value: 'Normal'},
    {key: 'urgent', value: 'Urgent'}
  ];

  duplicateOptions: SelectOptionsModel[] = [
    {key: 'codu', value: 'CODU'},
    {key: 'copy', value: 'COPY'},
    {key: 'dupl', value: 'DUPL'}
  ];

  settlementOptions: SelectOptionsModel[] = [
    {key: 'clrg', value: 'CLRG'},
    {key: 'cove', value: 'COVE'},
    {key: 'inda', value: 'INDA'},
    {key: 'inga', value: 'INGA'}
  ];

  chargeBearerOptions: SelectOptionsModel[] = [
    {key: 'debt', value: 'Debitor'},
    {key: 'cred', value: 'Creditor'},
    {key: 'shar', value: 'Shared'}
  ];

  constructor() {
    BUTTON_VISIBILITY.set({
      save: true,
      update: false,
      view: true,
      delete: true,
      exit: true,
      reset: true
    });

    effect(() => {
      if (this.onClickReset()) {
        this.resetForm();
        ONCLICK_RESET.set(false);
      } else if (this.onClickSave()) {
        this.save();
        ONCLICK_SAVE.set(false);
      }
    });
  }


  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.frmGroup = this.formBuilder.group({
      // Business Application Header
      fromBic: ['', Validators.required],
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
      TxInfAndSts: ['', Validators.required],
      OrgnlGrpInf: [''],
      OrgnlInstrId: ['', Validators.required],
      OrgnlEndToEndId: ['', Validators.required],
      OrgnlTxId: [''],
      OrgnlUETR: ['', Validators.required],
      TxSts: ['', Validators.required],
      StsRsnInf: [''],
      ClrSysRef: [''],
      InstgAgt: ['', Validators.required],
      InstdAgt: ['', Validators.required],
    });
  }

  resetForm(): void {
    this.frmGroup.reset();
    this.frmGroup.patchValue({
      date: new Date()
    });
  }

  save() {
    this.mx002Service.save(this.frmGroup.value).subscribe(res => {
      console.log(res);
    })
  }

}
