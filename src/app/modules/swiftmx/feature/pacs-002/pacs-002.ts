import {Component, effect, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SelectOptionField} from "../../../../shared/components/input-types/select-option-field/select-option-field";
import {TextBaseInput} from "../../../../shared/components/input-types/text-base-input/text-base-input";
import {SelectOptionsModel} from '../../../../shared/models/select-options-model';
import {
  BUTTON_VISIBILITY,
  FormGroupSignal,
  ONCLICK_RESET,
  ONCLICK_SAVE
} from '../../../../shared/constant/button-signals.constant';
import {DateInput} from '../../../../shared/components/input-types/date-input/date-input';
import {ToastrService} from 'ngx-toastr';
import {PanelHeader} from '../../../../shared/components/panel-header/panel-header';
import {SubPanelHeader} from '../../../../shared/components/sub-panel-header/sub-panel-header';
import {Mx002Service} from '../../service/mx002.service';
import {AmountToWordInput} from "../../../../shared/components/input-types/amount-to-word-input/amount-to-word-input";
import {AgentComponent} from '../../components/agent/agent';

@Component({
  selector: 'app-pacs-002',
  imports: [
    ReactiveFormsModule,
    SelectOptionField,
    TextBaseInput,
    DateInput,
    PanelHeader,
    SubPanelHeader,
    AgentComponent,

  ],
  templateUrl: './pacs-002.html',
  standalone: true,
  styleUrl: './pacs-002.scss'
})
export class Pacs002 implements OnInit {
  formBuilder = inject(FormBuilder);
  mx002Service = inject(Mx002Service);
  toastr = inject(ToastrService);
  frmGroup : FormGroup;
  onClickReset = ONCLICK_RESET;
  onClickSave = ONCLICK_SAVE;

  priorityOptions: SelectOptionsModel[] = [
    {key: 'high', value: 'High'},
    {key: 'low', value: 'Low'},
    {key: 'normal', value: 'Normal'},
    {key: 'urgent', value: 'Urgent'}
  ];

  duplicateOptions : SelectOptionsModel[] = [
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

  possibleDuplicateOptions: SelectOptionsModel[] = [
    {key: 'YES', value: 'Yes'},
    {key: 'NO', value: 'No'}
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



  ngOnInit():void {
    this.initForm();
  }

  initForm(): void {
    this.frmGroup = this.formBuilder.group({
      // Business Application Header
      amountToText:[''],
      fromBic:['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
      toBic: ['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
      bizMsgIdr: ['',[Validators.required, Validators.minLength(1),Validators.maxLength(35)]],
      msgDefIdr: ['',[Validators.required, Validators.minLength(1),Validators.maxLength(35)]],
      bizSvc: ['',[Validators.required, Validators.minLength(6),Validators.maxLength(35),Validators.pattern(/^[a-z0-9]{1,10}(\.[a-z0-9]{1,10})+\.\d\d$/)]],
      CreDt: ['', [Validators.required,Validators.pattern(/^(\+|-)((0[0-9])|(1[0-3])):[0-5][0-9]$/)]],

      cpyDplct: [null],
      psblDplct: [null],
      prty: ['high'],

      // Business Application Header -> related
      rltdFrBic: ['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
      rltdToBic: ['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
      rltdBizMsgIdr: ['',[Validators.required, Validators.minLength(1),Validators.maxLength(35)]],
      rltdMsgDefIdr: [''],
      rltdBizSvc: ['',[Validators.required, Validators.minLength(6),Validators.maxLength(35),Validators.pattern(/^[a-z0-9]{1,10}(\.[a-z0-9]{1,10})+\.\d\d$/)]],
      rltdCpyDplct: ['codu'],
      rltdPrty: ['high'],

      //  FI To FI Payment Status Report
      msgId: ['', [Validators.required, Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]], // MessageIdentification //0-9 a-z A-Z / - ? : ( ) . , ' +

      creDtTm: ['', [Validators.required,Validators.pattern(/^(\+|-)((0[0-9])|(1[0-3])):[0-5][0-9]$/)]],

      // Transaction Information And Status

      // -> original Group Information orgnlGrpInf
      orgnlMsgId:['', [Validators.minLength(1),Validators.maxLength(35),Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]], // MessageIdentification //0-9 a-z A-Z / - ? : ( ) . , ' +
      orgnlMsgNmId:['', [Validators.minLength(1),Validators.maxLength(35),Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]], // MessageIdentification //0-9 a-z A-Z / - ? : ( ) . , ' +
      orgnlCreDtTm: ['', [Validators.required,Validators.pattern(/^(\+|-)((0[0-9])|(1[0-3])):[0-5][0-9]$/)]],

      orgnlNbOfTxs:['',[Validators.pattern(/^[0-9]{1,15}$/)]],

      orgnlInstrId: ['', Validators.required],
      orgnlEndToEndId: ['',Validators.required],
      orgnlTxId: [''],



      orgnlUETR: ['', Validators.required],
      txSts: ['', Validators.required],

      // Status Reason Information block StsRsnInf
      orgtr:[''],
      nm:[''],
      pstlAdr:[''],
      id:[''],
      ctryOfRes:[''],

      //  Number of transaction per status
      dtldNbOfTxs:['',Validators.required],
      dtldSts : ['',Validators.required],
      dtldCtrlSum: [],
      // Address Information
      dept:[''],
      subDept:[''],
      strtNm:[''],
      BldgNb:[''],
      bldgNm:[''],
      flr:[''],
      pstBx:[''],
      room:[''],
      pstCd:[''],
      twnNm:[''],
      twnLctnNm:[''],
      dstrctNm:[''],
      ctrySubDvsn:[''],
      ctry:[''],
      adrLine:[''],

      orgIdBic:['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
      orgIdLei:[''],
      orgIdOthrId:[''],
      orgIdOthrScNmCd:[''],
      orgIdOthrIssr:[''],
      orgIdOthrCd:[''], // added by developer
      orgIdOthrIssrPtry:[''], // added by developer

      birthDt:[''],
      prvcOfBirth:[''],
      cityOfBirth:[''],
      ctryOfBirth:[''],
      prvtOthId1:[''],
      prvtOthIdSchNmCd1:[''],
      prvtOthIdIssr1:[''],
      prvtOthId2:[''],
      prvtOthIdSchNmCd2:[''],
      prvtOthIdIssr2:[''],

      // Status Reason Information block StsRsnInf
      StsRsnInf: [''],
      rsnCd:['',Validators.required],
      rsnPrtry :['',Validators.required],
      addtlInf1:[''],
      addtlInf2:[''],

      clrSysRef: [''],
      instgAgtBic: ['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
      instdAgt: ['',Validators.required],

      // Agent Information
      bIcfi:['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
      clrSysIdCd:[''],
      mmbId:[''],
      lei:[''],
      agentNm:[''],
      adrLine1:[''],
      adrLine2:[''],
      adrLine3:[''],
    });

    this.frmGroup.get('rsnCd')?.valueChanges.subscribe(value => {
      const prtryControl = this.frmGroup.get('rsnPrtry');
      if (value) {
        prtryControl?.setValue('');
        prtryControl?.clearValidators();
      } else {
        prtryControl?.setValidators(Validators.required);
      }
      prtryControl?.updateValueAndValidity({ emitEvent: false });
    });

    // 🔹 Watch othrSchmPrtry changes
    this.frmGroup.get('rsnPrtry')?.valueChanges.subscribe(value => {
      const cdControl = this.frmGroup.get('rsnCd');
      if (value) {
        cdControl?.setValue('');
        cdControl?.clearValidators();
      } else {
        cdControl?.setValidators(Validators.required);
      }
      cdControl?.updateValueAndValidity({ emitEvent: false });
    });
  }

  resetForm(): void{
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
