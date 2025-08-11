import {Component, effect, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
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
import {Mx054Service} from '../../service/mx054.service';

import {CurrencyService} from '../../../../shared/services/currency.service';
import {CurrencyModel} from '../../../../shared/models/currency.model';

@Component({
  selector: 'app-pacs-054',
  imports: [
    ReactiveFormsModule,
    SelectOptionField,
    TextBaseInput,
    DateInput,
    PanelHeader,
    SubPanelHeader,

  ],
  templateUrl: './pacs-054.html',
  standalone: true,
  styleUrl: './pacs-054.scss'
})
export class Pacs054 implements OnInit {

  private currencyService = inject(CurrencyService);  // Currency Service
  currencies: CurrencyModel[] = [];  // Currency Models
  errorMessage = '';


  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  mx054Service = inject(Mx054Service);
  frmGroup: FormGroup;
  onClickReset = ONCLICK_RESET;
  onClickSave = ONCLICK_SAVE;
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

  NtfctnRltdAcctCcyOptions: SelectOptionsModel[] = [];

  NtfctnIntrstRateVldtyRgCdtDbtCcyOptions: SelectOptionsModel[] = [];

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
    this.loadNtfctnRltdAcctCcy();
    this.loadNtfctnIntrstRateVldtyRgCdtDbtCcy();
  }

  initForm(): void {
    this.frmGroup = this.formBuilder.group({

      // Business Application Header
      amountToText: ['',],
      // fromBic: ['', Validators.required],
      fromBic: [''],
      // toBic: ['', Validators.required],
      toBic: [''],
      businessMessageIdentifier: [''],
      messageDefinitionIdentifier: [''],
      // businessService: ['', Validators.required],
      businessService: [''],
      copyDuplicate: ['codu'],
      priority: ['high'],

      // Business Application Header -> relate
      relatedFromBic: [''],
      relatedToBic: [''],
      relatedBusinessMessageIdentifier: [''],
      relatedMessageDefinitionIdentifier: [''],
      relatedBusinessService: [''],
      relatedCopyDuplicate: ['codu'],
      relatedPriority: ['high'],

      // Group Header
      GrpHdrMsgId: [''],
      GrpHdrCreDtTm: [],
      GrpHdrMsgRcptNm: [],
      MsgRcptPstlAdrCd: [''],
      MsgRcptPstlAdrPrtry: [''],
      MsgRcptPstlAdrDept: [''],
      MsgRcptPstlAdrSubDept: [''],
      MsgRcptPstlAdrStrtNm: [''],
      MsgRcptPstlAdrBldgNb: [''],
      MsgRcptCtctDtlsNm: [''],
      MsgRcptOrgIdAnyBIC: [''],
      MsgRcptOrgIdLEI: [''],
      MsgRcptOrgIdOthrId: [''],
      MsgRcptOrgIdOthrSchmeNmCode: [''],
      MsgRcptOrgIdOthrSchmeNmPrtry: [''],
      MsgRcptOrgIdOthrSchmeNmIssr: [''],
      OrgnlBizQryMsgId: [''],
      OrgnlBizQryMsgNmId: [''],
      OrgnlBizQryCreDtTm: [],
      AddtlInf: [''],


      // Notification Header
      NtfctnId: [''],
      NtfctnNtfctnPgntnPgNb: [''],
      NtfctnNtfctnPgntnLastPgInd: [],
      NtfctnElctrncSeqNb: [''],
      NtfctnRptgSeqFrSeq: [''],
      NtfctnRptgToSeq: [''],
      NtfctnRptgEQSeq: [],
      NtfctnRptgNEQSeq: [''],
      NtfctnCreDtTm: [],
      NtfctnFrToDtFrDtTm: [],
      NtfctnCpyDplctInd: [''],
      NtfctnRptgSrcCd: [''],
      NtfctnRptgSrcPrtry: [''],
      NtfctnLglSeqNb: [''],
      NtfctnAcctOthrId: [''],
      NtfctnAcctOthrSchmeNm: [''],
      NtfctnAcctTpCd: [''],
      NtfctnAcctTpPrtry: [''],
      NtfctnFrToDtToDtTm: [],
      NtfctnRltdAcctOthrId: [''],
      NtfctnRltdAcctOthrSchmeNm: [],
      NtfctnRltdAcctTp: [''],
      NtfctnRltdAcctCcy: [null],
      NtfctnRltdAcctNm: [''],
      NtfctnRltdAcctPrxyTp: [''],
      NtfctnRltdAcctPrxyId: [''],
      NtfctnAcctIdIBAN: [''],
      NtfctnIntrstTp: [''],
      NtfctnIntrstRateTpPctg: [''],
      NtfctnIntrstRateVldtyRgAmtFrAmt: [''],
      NtfctnIntrstRateVldtyRgAmtToAmtBdryAmt: [''],
      NtfctnIntrstRateVldtyRgAmtToAmtIncl: [''],
      NtfctnIntrstRateVldtyRgFrToAmtBdryAmt: [''],
      NtfctnIntrstRateVldtyRgFrToAmtIncl: [''],
      NtfctnIntrstRateVldtyRgEQAmt: [''],
      NtfctnIntrstRateVldtyRgNEQAmt: [''],
      NtfctnIntrstRateVldtyRgCdtDbtInd: [''],
      NtfctnIntrstRateVldtyRgCdtDbtCcy: [null],
      NtfctnIntrstFrToDtFrDtTm: [],
      NtfctnIntrstFrToDtToDtTm: [],
      NtfctnRltdAcctIdIBAN: [],
      NtfctnTtlTxsSummryNtriesNbOfNtries: [],
      NtfctnTtlTxsSummryNtriesSum: [],
      NtfctnTtlTxsSummryNtriesTtlNetNtryAmt: [],
      NtfctnTtlTxsSummryTtlDbtNtriesNbOfNtries: [],
      NtfctnTtlTxsSummryTtlDbtNtriesSum: [],
      NtfctnTtlTxsSummryTtlNtriesPerBkTxCdNbOfNtries: [],
      NtfctnTtlTxsSummryTtlNtriesPerBkTxCdSum: [],
      NtfctnTtlTxsSummryTtlNtriesPerBkTxCdTtlNetNtryAmt: [],
      NtfctnTtlTxsSummryTtlNtriesPerBkTxCdTtlNetNtryCdtDbtInd: [],
      NtfctnTtlTxsSummryTtlNtriesPerBkTxCdTtlCdtNtriesNbOfNtries: [],
      NtfctnTtlTxsSummryTtlNtriesPerBkTxCdTtlCdtNtriesSum: [],
      NtfctnTtlTxsSummryTtlNtriesPerBkTxCdTtlDbtNtriesNbOfNtries: [],
      NtfctnTtlTxsSummryTtlNtriesPerBkTxCdTtlDbtNtriesSum: [],
      NtfctnTtlTxsSummryTtlNtriesPerBkTxCdTtlFcstInd: [],
      NtfctnTtlTxsSummryTtlNtriesPerBkTxCdTtlBkTxCd: [],
      NtfctnTtlTxsSummryTtlNtriesPerBkTxAvlbtyDtNbOfDays: [],
      NtfctnTtlTxsSummryTtlNtriesPerBkTxAvlbtyDtActlDt: [],
      NtfctnTtlTxsSummryTtlNtriesPerBkTxAvlbtyAmt: [],
      NtfctnTtlTxsSummryTtlNtriesPerBkTxAvlbtyCdtDbtInd: [],
      NtfctnTtlTxsSummryTtlNtriesPerBkTxDt: [],
      NtfctnNtry: [],
      NtfctnAddtlNtfctnInf: [],


      // Payment Type Info -> Service Level

      serviceLevels: this.formBuilder.array([
        this.createServiceLevelGroup()
      ]),

      serviceCode: [''],
      servicePriority: ['high'],


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

  // Related Account Currency Start
  loadNtfctnRltdAcctCcy(): void {
    this.currencyService.getAllCurrency().subscribe({
      next: (response: any) => {
        // console.log('Data received:', response);
        if (response.payload.length > 0) {
          this.currencies = response.payload;
          this.errorMessage = '';
          // Map CurrencyModel[] to SelectOptionsModel[]
          this.NtfctnRltdAcctCcyOptions = this.currencies.map(c => ({
            key: c.isoSwiftCode,      // or any unique id like isoSwiftCode
            value: c.currencyFullNm // or short code like 'USD', 'BDT'
          }));
          console.log(this.NtfctnRltdAcctCcyOptions);
        }


      },
      error: (err: any) => {
        console.log('Error occurred:');
        this.errorMessage = 'Failed to load currencies. Please try again later.';
      }
    });
  }

  // Related Account Currency END


  // Interest Rate ValidityRange Currency Start
  loadNtfctnIntrstRateVldtyRgCdtDbtCcy(): void {
    this.currencyService.getAllCurrency().subscribe({
      next: (response: any) => {
        // console.log('Data received:', response);
        if (response.payload.length > 0) {
          this.currencies = response.payload;
          this.errorMessage = '';
          // Map CurrencyModel[] to SelectOptionsModel[]
          this.NtfctnIntrstRateVldtyRgCdtDbtCcyOptions = this.currencies.map(c => ({
            key: c.isoSwiftCode,      // or any unique id like isoSwiftCode
            value: c.currencyFullNm // or short code like 'USD', 'BDT'
          }));
          console.log(this.NtfctnIntrstRateVldtyRgCdtDbtCcyOptions);
        }


      },
      error: (err: any) => {
        console.log('Error occurred:');
        this.errorMessage = 'Failed to load currencies. Please try again later.';
      }
    });
  }

  // Interest Rate ValidityRange Currency Start

}
