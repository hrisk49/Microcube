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
import {AmountToWordInput} from '../../../../shared/components/input-types/amount-to-word-input/amount-to-word-input';
import {Mx054Service} from '../../service/mx054.service';

@Component({
  selector: 'app-pacs-106',
  imports: [
    ReactiveFormsModule,
    SelectOptionField,
    TextBaseInput,
    DateInput,
    PanelHeader,
    SubPanelHeader,
    AmountToWordInput,
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
      // relatedToBic: ['', Validators.required],
      relatedToBic: [''],
      relatedBusinessMessageIdentifier: [''],
      relatedMessageDefinitionIdentifier: [''],
      // relatedBusinessService: ['', Validators.required],
      relatedBusinessService: [''],
      relatedCopyDuplicate: ['codu'],
      relatedPriority: ['high'],

      // FI To FI Customer Credit Transfer
      // FI To FI Customer -> Group Header
      messageIdentification: [''],
      creDtTm: [new Date()],

      // FI To FI Customer -> Settlement Information
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

      servicePriority: ['high'],

      // Credit Transfer -> Normal
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
      // Charges Payment Notification
      msgId: [''],
      // charges Requestor
      bicfi:[''],
      ClrSysMmbId:['',Validators.required],
      lei:[''],
      nm: [''],

      // Postal address
      dept: [''],
      subDept: [''],
      strtNm: [''],
      bldgNb: [''],
      blggNm: [''],
      flr: [''],
      pstBx: [''],
      room: [''],
      pstCd: [''],
      twnNm: [''],
      ctrySubDvsn: [''],
      ctry:[''],
      twnLctnNm: [''],
      dstrctNm: [''],
      adrLine1:[''],
      adrLine2:[''],
      adrLine3:[''],


      //  other Schem Information
      othrSchmCd:['', Validators.required],
      othrSchmPrtry: ['', Validators.required],
      finOthrIssr: ['',Validators.required],

      // Total Charges
      nbOfChrgsRcrds:[Validators.required],
      ctrlSum :[],
      ttlChrgsAmt:[],
      cdtDbtInd: [''],

      //charges Information
      iban: [''],
      crgsAccTypeCd: ['',Validators.required],
      crgsAccTypePrtry: ['',Validators.required],
      ccy: ['001'],

      // Charges Per-Transaction Information
      ChrgsId : ['',Validators.required],
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

      // Payment Type Info -> Service Level

      serviceLevels: this.formBuilder.array([
        this.createServiceLevelGroup()
      ]),

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
