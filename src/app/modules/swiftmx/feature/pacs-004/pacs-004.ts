import {Component, effect, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {SelectOptionField} from "../../../../shared/components/input-types/select-option-field/select-option-field";
import {TextBaseInput} from "../../../../shared/components/input-types/text-base-input/text-base-input";
import {SelectOptionsModel} from "../../../../shared/models/select-options-model";
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
import {Mx004Service} from '../../service/mx004.service';

import {CurrencyService} from '../../../../shared/services/currency.service';
import {CurrencyModel} from '../../../../shared/models/currency.model';

@Component({
  selector: 'app-pacs-004',
  imports: [
    ReactiveFormsModule,
    SelectOptionField,
    TextBaseInput,
    DateInput,
    PanelHeader,
    SubPanelHeader,

  ],
  templateUrl: './pacs-004.html',
  standalone: true,
  styleUrl: './pacs-004.scss'
})
export class Pacs004 implements OnInit {

  private currencyService = inject(CurrencyService);  // Currency Service
  currencies: CurrencyModel[] = [];  // Currency Models
  errorMessage = '';


  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  mx004Service = inject(Mx004Service);
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


  chargeBearerOptions: SelectOptionsModel[] = [
    {key: 'debt', value: 'Debitor'},
    {key: 'cred', value: 'Creditor'},
    {key: 'shar', value: 'Shared'}
  ];

  IdentificationOptions: SelectOptionsModel[] = [
    {key: 'iban', value: 'IBAN'},
    {key: 'other', value: 'Other'}
  ];

  SchmeNmOptions: SelectOptionsModel[] = [
    {key: 'Cd', value: 'Code'},
    {key: 'Prtry', value: 'Proprietary'}
  ];
  TypeOptions: SelectOptionsModel[] = [
    {key: 'Cd', value: 'Code'},
    {key: 'Prtry', value: 'Proprietary'}
  ];
  CurrencyOptions: SelectOptionsModel[] = [];

  ProxyOptions: SelectOptionsModel[] = [
    {key: 'PrxyTp', value: 'Type'},
    {key: 'PrxyId', value: 'Identification'}
  ];

  ProxcyTpOptions: SelectOptionsModel[] = [
    {key: 'PrxyTpCd', value: 'Code'},
    {key: 'PrxyTpPrtry', value: 'Proprietary'}
  ];
  SttlmPrtyOptions: SelectOptionsModel[] = [
    {key: 'HIGH', value: 'High'},
    {key: 'NORM', value: 'Normal'},
    {key: 'URGT', value: 'Urgent'},
  ];

  ChrgBrOptions: SelectOptionsModel[] = [
    {key: 'CRED', value: 'BorneBy Creditor'},
    {key: 'DEBT', value: 'BorneBy Debtor'},
    {key: 'SHAR', value: 'Shared'},
    {key: 'SLEV', value: 'Following Service Level'},
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
        // this.save();
        ONCLICK_SAVE.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadCurrencies();
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

      // Business Application Header -> related
      // relatedFromBic: ['', Validators.required],
      relatedFromBic: [''],
      relatedToBic: [''],
      relatedBusinessMessageIdentifier: [''],
      relatedMessageDefinitionIdentifier: [''],
      relatedBusinessService: [''],
      relatedCopyDuplicate: ['codu'],
      relatedPriority: ['high'],


      // Payment Return V09
      // Payment Return V09 -> Group Header
      messageIdentification: [''],
      creationDate: [],
      numberOfTransactions: [],

      //Payment Return V09 -> Group Header-> Settlement Information
      Id: ['iban'],
      otherId: [''],
      otherSchmeNm: [''],
      otherIssr: [''],
      Tp: ['Cd'],
      Ccy: [null],
      Nm: [''],
      Prxy: ['PrxyId'],
      ProxcyTp: ['PrxyTpCd'],


      // Payment Return V09 -> TransactionInformation
      RtrId: [''],
      orgnlInstrId: [''],
      orgnlEndToEndId: [''],
      orgnlTxId: [''],
      orgnlUETR: [''],
      OrgnlClrSysRef: [''],
      OrgnlIntrBkSttlmAmt: [],
      OrgnlIntrBkSttlmDt: [],
      RtrdIntrBkSttlmAmt: [],
      IntrBkSttlmDt: [],
      SttlmPrty: ['HIGH'],
      DbtDtTm: [],
      CdtDtTm: [],
      InstructingAgentBICFI: [],
      InstructedAgentBICFI: [],


      //Payment Return V09 -> TransactionInformation -> Original Group Information
      OrgnlMsgId: [''],
      OrgnlMsgNmId: [''],
      OrgnlCreDtTm: [],

      RtrdInstdAmt: [],
      XchgRate: [],
      ChrgBr: ['CRED'],
      ClrSysRef: [''],
      thirdIban: [''],
      thirdLei: [''],

      OrgnlTxRefIntrBkSttlmAmt: [],
      InstdAmt: [],
      EqvtAmtAmt: [],

      // Payment Type Info -> Service Level

      serviceLevels: this.formBuilder.array([
        this.createServiceLevelGroup()
      ]),


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


  loadCurrencies(): void {
    this.currencyService.getAllCurrency().subscribe({
      next: (response: any) => {
        // console.log('Data received:', response);
        if (response.payload.length > 0) {
          this.currencies = response.payload;
          this.errorMessage = '';
          // Map CurrencyModel[] to SelectOptionsModel[]
          this.CurrencyOptions = this.currencies.map(c => ({
            key: c.isoSwiftCode,      // or any unique id like isoSwiftCode
            value: c.currencyFullNm // or short code like 'USD', 'BDT'
          }));
          console.log(this.CurrencyOptions);
        }


      },
      error: (err: any) => {
        console.log('Error occurred:');
        this.errorMessage = 'Failed to load currencies. Please try again later.';
      }
    });
  }


}
