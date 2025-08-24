

import {Component, effect, inject, OnInit, signal, WritableSignal} from '@angular/core';
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
import {AmountToWordInput} from '../../../../shared/components/input-types/amount-to-word-input/amount-to-word-input';
import {Mx054Service} from '../../service/mx054.service';
import {BusinessApplicationHeader} from '../../components/business-application-header/business-application-header';
import {ExpansionPanelHeader} from '../../../../shared/components/expansion-panel-header/expansion-panel-header';
import {
  ExpansionSubPanelHeader
} from '../../../../shared/components/expansion-sub-panel-header/expansion-sub-panel-header';

@Component({
  selector: 'app-pacs-106',
  imports: [
    ReactiveFormsModule,
    SelectOptionField,
    TextBaseInput,
    DateInput,
    BusinessApplicationHeader,
    ExpansionPanelHeader,
    ExpansionSubPanelHeader,
  ],
  templateUrl: './pacs-106.html',
  standalone: true,
  styleUrl: './pacs-106.scss'
})
export class Pacs106 implements OnInit {

  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  mx054Service = inject(Mx054Service);
  frmGroup: FormGroup;
  onClickReset = ONCLICK_RESET;
  onClickSave = ONCLICK_SAVE;

  // expension panel header
  businessAppHeader: WritableSignal<boolean> = signal(true);
  rltdPanelOpen: WritableSignal<boolean> = signal(true);
  chrgsPmtReqOpn: WritableSignal<boolean> = signal(true);
  grpHeadrOpn : WritableSignal<boolean> = signal(true);
  chrgsRqstrOpn : WritableSignal<boolean> = signal(true);
  finInstnIdOpn : WritableSignal<boolean> = signal(true);
  chrgsRqstrPoAddrsOpn : WritableSignal<boolean> = signal(true);
  ttlChrgsOpn : WritableSignal<boolean> = signal(true);
  clrSysMmbIdOpn : WritableSignal<boolean> = signal(true);


  priorityOptions: SelectOptionsModel[] = [
    {key: 'high', value: 'High'},
    {key: 'normal', value: 'Normal'}
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

  currencyOptions : SelectOptionsModel[] = [
    {key:'000', value: 'BDT'},
    {key:'001', value: 'USD'},
    {key:'002', value: 'EUR'},
    {key:'003', value: 'AED'}
  ];
  clrsSystemoptions: SelectOptionsModel [] = [
    {key:'Cd', value:'Code'}
  ]

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
        // this.save();
        ONCLICK_SAVE.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.frmGroup = this.formBuilder.group({

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


      // Charge Payment Request -> Group Header
      msgId: ['', [Validators.required, Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]], // MessageIdentification //0-9 a-z A-Z / - ? : ( ) . , ' +
      creDtTm: ['', [Validators.required,Validators.pattern(/^(\+|-)((0[0-9])|(1[0-3])):[0-5][0-9]$/)]],

      // Charge Payment Request -> Group Header -> Requerstor
      chrgRqstrBicfi: ['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
      clsmMId:['',[Validators.required,Validators.maxLength(28),Validators.pattern(/^[0-9a-zA-Z/\-\?:\(\)\.,'\+ ]+?$/)]],
      clrSysIdCd:['',[Validators.maxLength(5)]],
      chrgRqstrLei: ['',Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)],
      crgsRqstrNm: ['',[Validators.maxLength(140),Validators.pattern(/[0-9a-zA-Z/\-\?:\(\)\.,'\+ !#$%&\*=^_`\{\|\}~";<>@\[\]\\]+/)]],

      // Charge Payment Request -> Group Header -> Requerstor -> Postal Address
      dept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      subDept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      strtNm: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      bldgNb: ['', [Validators.maxLength(16)]],
      bldgNm: ['', [Validators.maxLength(35)]],
      flr: ['', Validators.maxLength(70)],
      pstBx: ['', [Validators.maxLength(16)]],
      room: ['', [Validators.maxLength(70)]],
      pstCd: ['', [Validators.maxLength(16)]],
      twnNm: ['', [Validators.maxLength(35)]],
      twnLctnNm: ['', [Validators.maxLength(35)]],
      dstrctNm: ['', [Validators.maxLength(35)]],
      ctrySubDvsn: ['', [Validators.maxLength(35)]],
      ctry: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      adrLine: ['', [Validators.maxLength(70)]],
      ctryOfRes: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      Tp: ['Cd'],

      // Charge Payment Request -> Group Header -> Requerstor -> Total Number of Charges Records
      nbOfChrgsRcrds:[Validators.required,Validators.pattern(/^[0-9]{1,15}/)],
      ctrlSum :[Validators.pattern(/^d{1,18}(\.\d{1,17})?$/)],
      ttlChrgsAmt:[],
      cdtDbtInd: [''],


      settlementMethod: ['clrg'],
      settleAccountId: [''],
      settleIban: [''],
      settleLei: [''],
      instructingReimbursementAgent: [''],
      instructingAccountId: [''],
      instructingIban: [''],
      instructingLei: [''],
      instructedReimbursementAgent: [''],
      instructedAccountId: [''],
      instructedIban: [''],
      instructedLei: [''],
      thirdReimbursementAgent: [''],
      thirdAccountId: [''],
      thirdIban: [''],
      thirdLei: [''],

      //  Credit Transfer Transaction Information
      interbankSettlementAmount: [''],
      // settlementDate: ['', Validators.required],
      settlementDate: [''],
      settlementPriority: [''],
      settlementTimeIndication: [''],
      settlementTimeRequest: [''],
      instructedAmount: [''],
      chargeBearer: ['debt'],
      exchangeRate: [''],

      // Credit Transfer -> Payment Identification
      // instructionIdentification: ['', Validators.required],
      instructionIdentification: [''],
      endToEndIdentification: [''],
      transactionIdentification: [''],
      clearingSystemReference: [''],

      // Credit Transfer -> Payment Type Info
      instructionPriority: ['high'],
      clearingChannel: [''],
      localInstrument: [''],
      categoryPurpose: [''],

      // Payment Type Info -> Service Level

      serviceLevels: this.formBuilder.array([
        this.createServiceLevelGroup()
      ]),

      serviceCode: [''],
      servicePriority: ['high'],

      // Credit Transfer -> Normal
      instructingAgentBic1: [''],
      instructingAccountId1: [''],
      instructingIban1: [''],
      instructingLei1: [''],
      instructingAgentBic2: [''],
      instructingAccountId2: [''],
      instructingIban2: [''],
      instructingLei2: [''],
      instructingAgentBic3: [''],
      instructingAccountId3: [''],
      instructingIban3: [''],
      instructingLei3: [''],

      // Credit Transfer -> Debitor
      // debitorName: ['', Validators.required],
      debitorName: [''],
      debitorPostalAddress: [''],
      debitorOrganisationIdentification: [''],
      debitorPrivateIdentification: [''],
      debitorCountryOfResidence: [''],
      debitorAgentBic: [''],
      debitorAccountId: [''],
      debitorIban: [''],
      debitorLei: [''],

      // // Charges Payment Notification
      // msgId: ['', [Validators.required, Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]], // MessageIdentification //0-9 a-z A-Z / - ? : ( ) . , ' +
      // creDtTm: ['', [Validators.required,Validators.pattern(/^(\+|-)((0[0-9])|(1[0-3])):[0-5][0-9]$/)]],
      //
      // // charges Requestor


      adrLine1:['',[Validators.maxLength(35),Validators.pattern(/[0-9a-zA-Z/\-\?:\(\)\.,'\+ !#$%&\*=^_`\{\|\}~";<>@\[\]\\]+/)]],
      adrLine2:['',[Validators.maxLength(35),Validators.pattern(/[0-9a-zA-Z/\-\?:\(\)\.,'\+ !#$%&\*=^_`\{\|\}~";<>@\[\]\\]+/)]],
      adrLine3:['',[Validators.maxLength(35),Validators.pattern(/[0-9a-zA-Z/\-\?:\(\)\.,'\+ !#$%&\*=^_`\{\|\}~";<>@\[\]\\]+/)]],


      //  Charges Account Owner
      ownrBicfi: ['',[Validators.pattern(/^[A-Z0-9]{4,4}[A-Z]{2,2}[A-Z0-9]{2,2}([A-Z0-9]{3,3}){0,1}/)]],
      //clrSysIdCd :['',[Validators.required,Validators.maxLength(35)]],
      mmbId:['',[Validators.maxLength(28),Validators.pattern(/^[0-9a-zA-Z/\-\?:\(\)\.,'\+ ]+/)]],
      //  other Schem Information
      othrSchmCd:['', Validators.required],
      othrSchmPrtry: ['', Validators.required],
      finOthrIssr: ['',Validators.required],



      //charges Information
      iban: [''],
      crgsAccTypeCd: ['',Validators.required],
      crgsAccTypePrtry: ['',Validators.required],
      ccy: ['001'],

      // Charges Per-Transaction Information
      ChrgsId : ['',[Validators.required,Validators.pattern(/^[0-9a-zA-Z/\-\?:\(\)\.,'\+ ]+/)]],
      rcrdId: [''],
      msgNmId: ['',Validators.required],
      acctSvcrRef:[''],
      pmtInfId:[''],
      instrId:[''],
      txnId:[''],
      mndtId: [''],
      chqNb: [''],
      acctOwnrTxId:[''],
      acctSvcrTxId: [''],

      // Total Charges Per Record
      valDt: [''],
      nbOfChrgsBrkdwnItms: ['', Validators.required],


    });


    this.frmGroup.get('othrSchmCd')?.valueChanges.subscribe(value => {
      const othrSchmPrtryControl = this.frmGroup.get('othrSchmPrtry');
      if (value) {
        othrSchmPrtryControl?.setValue('');
        othrSchmPrtryControl?.clearValidators();
      } else {
        othrSchmPrtryControl?.setValidators(Validators.required);
      }
      othrSchmPrtryControl?.updateValueAndValidity({ emitEvent: false });
    });

    this.frmGroup.get('othrSchmPrtry')?.valueChanges.subscribe(value => {
      const othrSchmCdControl = this.frmGroup.get('othrSchmCd');
      if (value) {
        othrSchmCdControl?.setValue('');
        othrSchmCdControl?.clearValidators();
      } else {
        othrSchmCdControl?.setValidators(Validators.required);
      }
      othrSchmCdControl?.updateValueAndValidity({ emitEvent: false });
    });

    this.frmGroup.get('crgsAccTypeCd')?.valueChanges.subscribe(value => {
      const crgsAccTypePrtryControl = this.frmGroup.get('crgsAccTypePrtry');
      if (value) {
        crgsAccTypePrtryControl?.setValue('');
        crgsAccTypePrtryControl?.clearValidators();
      } else {
        crgsAccTypePrtryControl?.setValidators(Validators.required);
      }
      crgsAccTypePrtryControl?.updateValueAndValidity({ emitEvent: false });
    });

    this.frmGroup.get('othrSchmPrtry')?.valueChanges.subscribe(value => {
      const crgsAccTypeCdControl = this.frmGroup.get('crgsAccTypeCd');
      if (value) {
        crgsAccTypeCdControl?.setValue('');
        crgsAccTypeCdControl?.clearValidators();
      } else {
        crgsAccTypeCdControl?.setValidators(Validators.required);
      }
      crgsAccTypeCdControl?.updateValueAndValidity({ emitEvent: false });
    });

    FormGroupSignal.set(this.frmGroup);
  }

  createServiceLevelGroup(): FormGroup {
    return this.formBuilder.group({
      serviceCode: [''],
      servicePriority: ['high']
    });
  }

  get serviceLevels(): FormArray<FormGroup> {
    return this.frmGroup.get('serviceLevels') as FormArray<FormGroup>;
  }

  addServiceRow(): void {
    if (this.serviceLevels.length === 3) {
      this.toastr.warning("You can't be add more then 3..!!", 'WARN');
      return;
    }
    this.serviceLevels.push(this.createServiceLevelGroup());
  }

  removeServiceRow(index: number): void {
    this.serviceLevels.removeAt(index);
  }

  resetForm(): void {
    this.frmGroup.reset();
    this.frmGroup.patchValue({
      date: new Date(),
    });
  }

  //save() {
  //   this.mx008Service.save(this.frmGroup.value).subscribe(res => {
  //      console.log(res);
  //    })
  //  }

}
