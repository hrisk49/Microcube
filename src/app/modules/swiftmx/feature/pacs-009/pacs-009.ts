import {Component, effect, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Pacs008Service} from '../../service/pacs008.service';
import {
  BUTTON_VISIBILITY,
  FormGroupSignal,
  ONCLICK_RESET,
  ONCLICK_SAVE
} from '../../../../shared/constant/button-signals.constant';
import {SelectOptionsModel} from '../../../../shared/models/select-options-model';
import {AmountToWordInput} from '../../../../shared/components/input-types/amount-to-word-input/amount-to-word-input';
import {DateInput} from '../../../../shared/components/input-types/date-input/date-input';
import {PanelHeader} from '../../../../shared/components/panel-header/panel-header';
import {SelectOptionField} from '../../../../shared/components/input-types/select-option-field/select-option-field';
import {SubPanelHeader} from '../../../../shared/components/sub-panel-header/sub-panel-header';
import {TextBaseInput} from '../../../../shared/components/input-types/text-base-input/text-base-input';
import {Pacs009Service} from '../../service/pacs009.service';

@Component({
  selector: 'app-pacs-009',
  imports: [
    AmountToWordInput,
    DateInput,
    PanelHeader,
    ReactiveFormsModule,
    SelectOptionField,
    SubPanelHeader,
    TextBaseInput
  ],
  templateUrl: './pacs-009.html',
  standalone: true,
  styleUrl: './pacs-009.scss'
})
export class Pacs009 implements OnInit {

  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  pacs009Service = inject(Pacs009Service);
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

      timeIndi13C: [''],
      timeSign13C: [''],
      timeOffset13C: [''],
      valDate32A: [], // todo date
      valCurr32A: [''],
      valAmt32A: [],
      bizMsgIdr: [''],//BusinessMessageIdentifier max 35
      msgDefIdr: [''],//MessageDefinitionIdentifier example - camt.001.001.03
      bizSvc: [''],//BusinessService The value "swift.cbprplus.02" must be used.
      creDt: [''],
      cpyDplct: [''], // values can be only - CODU,COPY,DUPL
      psblDplct: [''], //PossibleDuplicate Values Can only  be - YES/NO
      priority: [''],// Header block Priority values can only be - HIGH,NORM
      msgId: [''],// MessageIdentification  //0-9 a-z A-Z / - ? : ( ) . , ' +
      creDtTm: [''],//CreationDateTime
      nbOfTxs: [''],// Number of transactions
      sttlmMtd: [''],//SettlementMethod value - COVE,INDA,INGA
      // Account SttlmAcct;//SettlementMethod //todo
      //need more properties here for settlement method
      /// PaymentIdentification Tag
      /// Assigned by Instructing party to Instructed party to identify the msg uniquely
      /// can never have starting or ending / and never have '//'
      instrId: [''], //InstructionIdentification Max 16 pattern 0-9 a-z A-Z - ? : ( ) . , ' +
      endToEndId: [''],//EndToEndIdentification max 35
      txId: [''],//TransactionIdentification max 35 Mandatory
      /// If the pacs.009 is used to settle a pacs.009 Advice, the UETR should transport
      /// the UETR of the underlying pacs.009 Advice
      uETR: [''],//Mandatory
      clrSysRef: [''], //ClearingSystemReference max 35 pattern [0-9a-zA-Z/\-\?:\(\)\.,'\+ ]+
      //End PaymentIdentification tag
      instrPrty: [''],//InstructionPriority value can be HIGH/NORM
      clrChanl: [''],//ClearingChannel values can be BOOK/MPNS/RTGS/RTNS
      svcLvlCD: [''], // String[3]; todo
      svcLvlPrtry: [''], //String[3];//Proprietary todo
      lclInstrmCD: [''],//LocalInstrument
      lclInstrmPrtry: [''],//LocalInstrument Proprietary
      ctgyPurpCd: [''],//CategoryPurpose Code
      ctgyPurpPrtry: [''],//CategoryPurpose
      intrBkSttlmAmtCcy: [''],//InterbankSettlementAmount max 3 char
      intrBkSttlmAmt: [],//InterbankSettlementAmount size 14,5
      intrBkSttlmDt: [''],//InterbankSettlementDate
      sttlmPrty: [''],//SettlementPriority valus HIGH/NORM/URGT
      // Agent PrvsInstgAgt1;//PreviousInstructingAgent1 <> todo
      // Account PrvsInstgAgt1Acct;//PreviousInstructingAgent1Account <> todo
      // Agent PrvsInstgAgt3;//PreviousInstructingAgent3 <> todo
      // Agent PrvsInstgAgt2;//PreviousInstructingAgent2 <> todo
      // Account PrvsInstgAgt2Acct;//PreviousInstructingAgent2Account <> todo
      // Account PrvsInstgAgt3Acct;//PreviousInstructingAgent3Account <> todo
      // Agent InstgAgt;//InstructingAgent <> todo
      // Agent InstdAgt;//InstructedAgent <> todo
      // Agent IntrmyAgt1;//IntermediaryAgent1 <> todo
      // Account IntrmyAgt1Acct;//IntermediaryAgent1Account <> todo
      // Agent IntrmyAgt2;//IntermediaryAgent2 <> todo
      // Account IntrmyAgt2Acct;//IntermediaryAgent2Account <> todo
      // Agent IntrmyAgt3;//IntermediaryAgent3 <> todo
      // Account IntrmyAgt3Acct;//IntermediaryAgent3Account <> todo
      // Agent Dbtr;//Debtor <> todo
      // Account DbtrAcct;//DebtorAccount <> todo
      // Agent DbtrAgt;//DebtorAgent <> todo
      // Account DbtrAgtAcct;//DebtorAgentAccount <> todo
      // Agent CdtrAgt;//CreditorAgent <> todo
      // Account CdtrAgtAcct;//CreditorAgentAccount <> todo
      // Agent Cdtr;//Creditor <> todo
      // Account CdtrAcct;//CreditorAccount todo
      instrForCdtrAgtCD: [''],//InstructionForCreditorAgent 4//value TELB/PHOB PhoneBeneficiary
      instrForCdtrAgtInf: [''],//InstructionForCreditorAgent 140
      instrForNxtAgt1: [''],//InstructionForNextAgent Max35
      instrForNxtAgt2: [''],//InstructionForNextAgent Max35
      instrForNxtAgt3: [''],//InstructionForNextAgent Max35
      instrForNxtAgt4: [''],//InstructionForNextAgent Max35
      instrForNxtAgt5: [''],//InstructionForNextAgent Max35
      instrForNxtAgt6: [''],//InstructionForNextAgent Max35
      purpCD: [''],//Purpose ExternalPurpose1Code max 4
      purpPrtry: [''],//Purpose ExternalPurpose1Code max 35
      rmtInf: [''],//RemittanceInformation Max140 [0-9a-zA-Z/\-\?:\(\)\.,'\+ !#$%&\*=^_`\{\|\}~";<>@\[\\\]]+
      auth1stBy: [''],
      makeDt: [], // todo date
      auth1stDt: [], // todo date
      auth2ndBy: [''],
      auth2ndDt: [], // todo date
      lastAction: [''],
      branchId: [''],
      trnRefNo20: [''],
      relatedRef21: [''],
      // Related Rltd;//InstructedAgent todo

      //Account
      iBAN: [''],//MAX 30
      iD: [''], ///OTHER/ID MAX 34
      schmeNmCD: [''],//OTHER/SchemeName CODE MAX 4 ExternalAccountIdentification1Code
      schmeNmPrtry: [''],//OTHER/SchemeName PRIORITY
      issr: [''],//OTHER/Issuer MAX 35
      tpCD: [''],//Type/CD
      tpPrtry: [''],//TYPE/PRIORITY
      ccy: [''],//Currency MAX 3
      nmAccount: [''],//Name 70 PTRN [0-9a-zA-Z/\-\?:\(\)\.,'\+ ]+ todo variable name will be changed to nm
      prxyTpCd: [''],//Proxy
      prxyTpPrtry: [''],//Proxy
      prxyId: [''],//PROXY ID MAX 320

      //Agent
      bICFI: [''],//BICFI max 12
      clrSysIdCd: [''],//ClearingSystemIdentification Code ExternalClearingSystemIdentification1Code
      mmbId: [''],//MemberIdentification max 28 [0-9a-zA-Z/\-\?:\(\)\.,'\+ ]+
      lEI: [''],//LEI Max 20 [A-Z0-9]{18,18}[0-9]{2,2}
      nmAgent: [''],//Name of the agent max 140 todo variable name will be changed to nm
      adrLine1: [''],//AddressLine max 35 [0-9a-zA-Z/\-\?:\(\)\.,'\+ !#$%&\*=^_`\{\|\}~";<>@\[\\\]]+
      adrLine2: [''],//AddressLine max 35  [0-9a-zA-Z/\-\?:\(\)\.,'\+ !#$%&\*=^_`\{\|\}~";<>@\[\\\]]+
      adrLine3: [''],//AddressLine max 35  [0-9a-zA-Z/\-\?:\(\)\.,'\+ !#$%&\*=^_`\{\|\}~";<>@\[\\\]]+
      // Address Adr;//AddressLine max 35  [0-9a-zA-Z/\-\?:\(\)\.,'\+ !#$%&\*=^_`\{\|\}~";<>@\[\\\]]+ todo

      // Address
      dept: [''],//Department 70
      subDept: [''],//SubDepartment 70
      strtNm: [''],//StreetName 70
      bldgNb: [''],//BuildingNumber 16
      bldgNm: [''],//BuildingName 35
      flr: [''],//Floor
      pstBx: [''],//PostBox 16
      room: [''],//Room 70
      pstCd: [''],//PostCode 16
      twnNm: [''],//TownName 35
      twnLctnNm: [''],//TownLocationName35
      dstrctNm: [''],//DistrictName35
      ctrySubDvsn: [''],//CountrySubDivision35
      ctry: [''],//Country
      adrLine: [''], // = new String[3];//Address line todo

      // Related
      charSet: [''],//CharacterSet
      // Agent Fr;//OriginalEndToEndIdentification todo
      // Agent To;//OriginalEndToEndIdentification todo
      bizMsgIdrRel: [''],//BusinessMessageIdentifier 35 todo variable name changed, removed rel from last
      msgDefIdrRel: [''],//MessageDefinitionIdentifier EXAMPLE PACS.009.01.08 todo variable name changed, removed rel from last
      bizSvcRel: [''],//BusinessService 35 todo variable name changed, removed rel from last
      creDtRel: [''],//CreationDate todo variable name changed, removed rel from last
      cpyDplctRel: [''],//CopyDuplicate VALUES CODU/COPY/DUPL todo variable name changed, removed rel from last
      prty: [''],//Priority

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

  save() {
    this.pacs009Service.save(this.frmGroup.value).subscribe(res => {
      console.log(res);
    })
  }

}
