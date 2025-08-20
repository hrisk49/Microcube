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
import {Pacs008Service} from '../../service/pacs008.service';
import { ExpansionPanelHeader } from '../../../../shared/components/expansion-panel-header/expansion-panel-header';
import { ExpansionSubPanelHeader } from '../../../../shared/components/expansion-sub-panel-header/expansion-sub-panel-header';
import { DataSelectionModal } from '../../../../shared/components/data-selection-modal/data-selection-modal';
import { DialogUtils } from '../../../../shared/service/dialog-utils';
import { BranchInfoService } from '../../../../shared/services/branch-info.service';
import { Mx009Model } from '../../model/mx009.model';
import { IdBoxComponent } from '../../../../shared/components/input-types/id-box/id-box';
import { AmountInput } from '../../../../shared/components/input-types/amount-input/amount-input';
import { FileComponent } from '../../../../shared/components/input-types/file-input/file-input';

@Component({
    selector: 'app-pacs-008',
    imports: [
    ReactiveFormsModule,
    TextBaseInput,
    IdBoxComponent,
    AmountInput,
    SubPanelHeader,
    FileComponent,
    SelectOptionField,
    DateInput,
    AmountToWordInput,
    ExpansionPanelHeader,
    ExpansionSubPanelHeader,
    DataSelectionModal,
    ],
    templateUrl: './pacs-008.html',
    standalone: true,
    styleUrl: './pacs-008.scss'
})
export class Pacs008 implements OnInit {
dialogUtils = inject(DialogUtils);
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  pacs008Service = inject(Pacs008Service);
  frmGroup: FormGroup;
  onClickReset = ONCLICK_RESET;
  onClickSave = ONCLICK_SAVE;
  priorityOptions: SelectOptionsModel[] = [
    { key: 'HIGH', value: 'High' },
    { key: 'NORM', value: 'Normal' },
  ];

  duplicateOptions: SelectOptionsModel[] = [
    { key: 'CODU', value: 'CODU' },
    { key: 'COPY', value: 'COPY' },
    { key: 'DUPL', value: 'DUPL' },
  ];

  settlementOptions: SelectOptionsModel[] = [
    { key: 'CLRG', value: 'CLRG' },
    { key: 'COVE', value: 'COVE' },
    { key: 'INDA', value: 'INDA' },
    { key: 'INGA', value: 'INGA' },
  ];

  chargeBearerOptions: SelectOptionsModel[] = [
    { key: 'DEBT', value: 'Debitor' },
    { key: 'CRED', value: 'Creditor' },
    { key: 'SHAR', value: 'Shared' },
  ];

  yesNoOptions: SelectOptionsModel[] = [
    { key: 'YES', value: 'Yes' },
    { key: 'NO', value: 'No' },
  ];

  clearingChannelOptions: SelectOptionsModel[] = [
    { key: 'BOOK', value: 'Book' },
    { key: 'MPNS', value: 'MPNS' },
    { key: 'RTGS', value: 'RTGS' },
    { key: 'RTNS', value: 'RTNS' },
  ];

  settlementPriorityOptions: SelectOptionsModel[] = [
    { key: 'HIGH', value: 'High' },
    { key: 'NORM', value: 'Normal' },
    { key: 'URGT', value: 'Urgent' },
  ];

  currencyOptions: SelectOptionsModel[] = [
    { key: 'USD', value: 'USD - US Dollar' },
    { key: 'EUR', value: 'EUR - Euro' },
    { key: 'GBP', value: 'GBP - British Pound' },
    { key: 'JPY', value: 'JPY - Japanese Yen' },
    { key: 'CHF', value: 'CHF - Swiss Franc' },
    { key: 'CAD', value: 'CAD - Canadian Dollar' },
    { key: 'AUD', value: 'AUD - Australian Dollar' },
    { key: 'CNY', value: 'CNY - Chinese Yuan' },
    { key: 'HKD', value: 'HKD - Hong Kong Dollar' },
    { key: 'SGD', value: 'SGD - Singapore Dollar' },
    { key: 'SEK', value: 'SEK - Swedish Krona' },
    { key: 'NOK', value: 'NOK - Norwegian Krone' },
    { key: 'DKK', value: 'DKK - Danish Krone' },
    { key: 'NZD', value: 'NZD - New Zealand Dollar' },
    { key: 'MXN', value: 'MXN - Mexican Peso' },
    { key: 'BRL', value: 'BRL - Brazilian Real' },
    { key: 'INR', value: 'INR - Indian Rupee' },
    { key: 'KRW', value: 'KRW - South Korean Won' },
    { key: 'TRY', value: 'TRY - Turkish Lira' },
    { key: 'RUB', value: 'RUB - Russian Ruble' },
    { key: 'ZAR', value: 'ZAR - South African Rand' },
    { key: 'PLN', value: 'PLN - Polish Zloty' },
    { key: 'CZK', value: 'CZK - Czech Koruna' },
    { key: 'HUF', value: 'HUF - Hungarian Forint' },
    { key: 'ILS', value: 'ILS - Israeli Shekel' },
    { key: 'CLP', value: 'CLP - Chilean Peso' },
    { key: 'PHP', value: 'PHP - Philippine Peso' },
    { key: 'AED', value: 'AED - UAE Dirham' },
    { key: 'SAR', value: 'SAR - Saudi Riyal' },
    { key: 'THB', value: 'THB - Thai Baht' },
    { key: 'MYR', value: 'MYR - Malaysian Ringgit' },
    { key: 'IDR', value: 'IDR - Indonesian Rupiah' },
    { key: 'VND', value: 'VND - Vietnamese Dong' },
    { key: 'EGP', value: 'EGP - Egyptian Pound' },
    { key: 'NGN', value: 'NGN - Nigerian Naira' },
    { key: 'KES', value: 'KES - Kenyan Shilling' },
    { key: 'GHS', value: 'GHS - Ghanaian Cedi' },
    { key: 'MAD', value: 'MAD - Moroccan Dirham' },
    { key: 'TND', value: 'TND - Tunisian Dinar' },
  ];

  // File upload demo state
  showAnyFileUpload: boolean = true;
  pdfFiles: File[] = [];
  imageFiles: File[] = [];
  anyFiles: File[] = [];
  documentFiles: File[] = [];
  profilePicFile?: File;

  // Panel visibility signals
  timeDatePanel: WritableSignal<boolean> = signal(true);
  fromBicPanel: WritableSignal<boolean> = signal(true);
  toBicPanel: WritableSignal<boolean> = signal(true);
  subPanelOpen: WritableSignal<boolean> = signal(true);
  businessHeaderPanel: WritableSignal<boolean> = signal(true);
  businessApplicationHeaderPanel: WritableSignal<boolean> = signal(true);
  groupHeaderPanel: WritableSignal<boolean> = signal(true);
  settlementPanel: WritableSignal<boolean> = signal(true);
  financialInstitutionCreditTransferPanel: WritableSignal<boolean> =
    signal(true);
  paymentIdPanel: WritableSignal<boolean> = signal(true);
  paymentTypePanel: WritableSignal<boolean> = signal(true);
  serviceLevelPanel: WritableSignal<boolean> = signal(true);
  interbankPanel: WritableSignal<boolean> = signal(true);
  previousAgentsPanel: WritableSignal<boolean> = signal(true);
  prevAgent1Panel: WritableSignal<boolean> = signal(false);
  prevAgent1AddressPanel:  WritableSignal<boolean> = signal(false);
  prevAgent2Panel: WritableSignal<boolean> = signal(false);
  prevAgent2AddressPanel:  WritableSignal<boolean> = signal(false);
  prevAgent3Panel: WritableSignal<boolean> = signal(false);
  prevAgent3AddressPanel:  WritableSignal<boolean> = signal(false);
  agentsPanel: WritableSignal<boolean> = signal(true);
  instructingAgentPanel: WritableSignal<boolean> = signal(true);
  instgAgtAddressPanel: WritableSignal<boolean> = signal(false);
  instructedAgentPanel: WritableSignal<boolean> = signal(true);
  instructedAgentAddressPanel: WritableSignal<boolean> = signal(false);
  intermediaryAgentsPanel: WritableSignal<boolean> = signal(true);
  intermediary1Panel: WritableSignal<boolean> = signal(false);
  intermediary2Panel: WritableSignal<boolean> = signal(false);
  intermediary3Panel: WritableSignal<boolean> = signal(false);
  debtorPanel: WritableSignal<boolean> = signal(true);
  creditTransferTransactionPanel: WritableSignal<boolean> = signal(true);
  creditorPanel: WritableSignal<boolean> = signal(true);
  instructionsPanel: WritableSignal<boolean> = signal(true);
  purposePanel: WritableSignal<boolean> = signal(true);
  authorizationPanel: WritableSignal<boolean> = signal(true);
  otherInfoPanel: WritableSignal<boolean> = signal(true);
  relatedInfoPanel: WritableSignal<boolean> = signal(false);
  swiftCodesFrom: any;
  swiftCodesTo: any;

  // Define column headers for the BIC selection modal
  bicTableHeaders = new Map<string, string>([
    ['swift', 'SWIFT Code'],
    ['branchName', 'Branch Name'],
    ['address', 'Address']
  ]);

  constructor(private branchInfoService: BranchInfoService) {
    BUTTON_VISIBILITY.set({
      save: true,
      update: false,
      view: true,
      delete: true,
      exit: true,
      reset: true,
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
    try {
      this.initForm();
      if (!this.frmGroup) {
        console.error('Form initialization failed');
        this.toastr.error('Form initialization failed', 'Error');
      }
    } catch (error) {
      console.error('Error during form initialization:', error);
      this.toastr.error('Error during form initialization', 'Error');
    }
  }

  initForm(): void {
    this.frmGroup = this.formBuilder.group({
      // Time and Value Information
      timeIndi13C: [''],
      timeSign13C: [''],
      timeOffset13C: [''],
      valDate32A: [''],
      valCurr32A: [''],
      valAmt32A: [''],

      // Business Message Header
      charSet: [''],
      fromBicfi: ['', Validators.required],
      fromNm: [''],
      idinfo: ['',[Validators.required, Validators.maxLength(35), Validators.minLength(2)]],
      amount1: ['', [Validators.required]],
      toBicfi: ['', Validators.required],
      toNm: [''],
      rltdBizMsgIdr: [''],
      rltdMsgDefIdr: [''],
      rltdBizSvc: [''],
      rltdCreDt: [''],
      bizMsgIdr: ['', Validators.required],
      msgDefIdr: ['pacs.009.001.08', Validators.required],
      bizSvc: ['swift.cbprplus.02', Validators.required],
      creDt: ['', Validators.required],
      cpyDplct: ['COPY'],
      psblDplct: [null],
      priority: ['NORM'],
      msgId: ['', Validators.required],
      creDtTm: ['', Validators.required],
      nbOfTxs: ['1', Validators.required],

      // Settlement Information
      sttlmMtd: ['INGA', Validators.required],
      // Settlement Account (flat)
      sttlmAcctId: [''],
      sttlmAcctCcy: [null],
      sttlmAcctTp: [''],
      sttlmAcctNm: [''],
      sttlmAcctSchmeNm: [''],
      sttlmAcctIssr: [''],

      // Payment Identification
      instrId: [''],
      endToEndId: [''],
      txId: ['', Validators.required],
      uetr: [''],
      clrSysRef: [''],

      // Payment Type Information
      instrPrty: [null],
      clrChanl: [null],
      serviceLevels: this.formBuilder.array([]),
      lclInstrmCD: [''],
      lclInstrmPrtry: [''],
      ctgyPurpCd: [''],
      ctgyPurpPrtry: [''],

      // Interbank Settlement
      intrBkSttlmAmtCcy: [null, Validators.required],
      intrBkSttlmAmt: ['', Validators.required],
      intrBkSttlmDt: ['', Validators.required],
      sttlmPrty: [null],

      // Previous Instructing Agent 1 (flat)
      prvsInstgAgt1Bicfi: [''],
      prvsInstgAgt1ClrSysIdCd: [''],
      prvsInstgAgt1MmbId: [''],
      prvsInstgAgt1Lei: [''],
      prvsInstgAgt1Nm: [''],
      prvsInstgAgt1AdrLine1: [''],
      prvsInstgAgt1AdrLine2: [''],
      prvsInstgAgt1AdrLine3: [''],
      prvsInstgAgt1AdrDept: [''],
      prvsInstgAgt1AdrSubDept: [''],
      prvsInstgAgt1AdrStrtNm: [''],
      prvsInstgAgt1AdrBldgNb: [''],
      prvsInstgAgt1AdrBldgNm: [''],
      prvsInstgAgt1AdrFlr: [''],
      prvsInstgAgt1AdrPstBx: [''],
      prvsInstgAgt1AdrRoom: [''],
      prvsInstgAgt1AdrPstCd: [''],
      prvsInstgAgt1AdrTwnNm: [''],
      prvsInstgAgt1AdrTwnLctnNm: [''],
      prvsInstgAgt1AdrDstrctNm: [''],
      prvsInstgAgt1AdrCtrySubDvsn: [''],
      prvsInstgAgt1AdrCtry: [''],
      prvsInstgAgt1AdrLine: [''],
      // Previous Instructing Agent 1 Account (flat)
      prvsInstgAgt1AcctId: [''],
      prvsInstgAgt1AcctCcy: [null],
      prvsInstgAgt1AcctTp: [''],
      prvsInstgAgt1AcctNm: [''],
      prvsInstgAgt1AcctSchmeNm: [''],
      prvsInstgAgt1AcctIssr: [''],

      // Previous Instructing Agent 2 (flat)
      prvsInstgAgt2Bicfi: [''],
      prvsInstgAgt2ClrSysIdCd: [''],
      prvsInstgAgt2MmbId: [''],
      prvsInstgAgt2Lei: [''],
      prvsInstgAgt2Nm: [''],
      prvsInstgAgt2AdrLine1: [''],
      prvsInstgAgt2AdrLine2: [''],
      prvsInstgAgt2AdrLine3: [''],
      prvsInstgAgt2AdrDept: [''],
      prvsInstgAgt2AdrSubDept: [''],
      prvsInstgAgt2AdrStrtNm: [''],
      prvsInstgAgt2AdrBldgNb: [''],
      prvsInstgAgt2AdrBldgNm: [''],
      prvsInstgAgt2AdrFlr: [''],
      prvsInstgAgt2AdrPstBx: [''],
      prvsInstgAgt2AdrRoom: [''],
      prvsInstgAgt2AdrPstCd: [''],
      prvsInstgAgt2AdrTwnNm: [''],
      prvsInstgAgt2AdrTwnLctnNm: [''],
      prvsInstgAgt2AdrDstrctNm: [''],
      prvsInstgAgt2AdrCtrySubDvsn: [''],
      prvsInstgAgt2AdrCtry: [''],
      prvsInstgAgt2AdrLine: [''],
      // Previous Instructing Agent 2 Account (flat)
      prvsInstgAgt2AcctId: [''],
      prvsInstgAgt2AcctCcy: [''],
      prvsInstgAgt2AcctTp: [''],
      prvsInstgAgt2AcctNm: [''],
      prvsInstgAgt2AcctSchmeNm: [''],
      prvsInstgAgt2AcctIssr: [''],

      // Previous Instructing Agent 3 (flat)
      prvsInstgAgt3Bicfi: [''],
      prvsInstgAgt3ClrSysIdCd: [''],
      prvsInstgAgt3MmbId: [''],
      prvsInstgAgt3Lei: [''],
      prvsInstgAgt3Nm: [''],
      prvsInstgAgt3AdrLine1: [''],
      prvsInstgAgt3AdrLine2: [''],
      prvsInstgAgt3AdrLine3: [''],
      prvsInstgAgt3AdrDept: [''],
      prvsInstgAgt3AdrSubDept: [''],
      prvsInstgAgt3AdrStrtNm: [''],
      prvsInstgAgt3AdrBldgNb: [''],
      prvsInstgAgt3AdrBldgNm: [''],
      prvsInstgAgt3AdrFlr: [''],
      prvsInstgAgt3AdrPstBx: [''],
      prvsInstgAgt3AdrRoom: [''],
      prvsInstgAgt3AdrPstCd: [''],
      prvsInstgAgt3AdrTwnNm: [''],
      prvsInstgAgt3AdrTwnLctnNm: [''],
      prvsInstgAgt3AdrDstrctNm: [''],
      prvsInstgAgt3AdrCtrySubDvsn: [''],
      prvsInstgAgt3AdrCtry: [''],
      prvsInstgAgt3AdrLine: [''],
      // Previous Instructing Agent 3 Account (flat)
      prvsInstgAgt3AcctId: [''],
      prvsInstgAgt3AcctCcy: [''],
      prvsInstgAgt3AcctTp: [''],
      prvsInstgAgt3AcctNm: [''],
      prvsInstgAgt3AcctSchmeNm: [''],
      prvsInstgAgt3AcctIssr: [''],

      // Agents (flat)
      instgAgtBicfi: [''],
      instgAgtClrSysIdCd: [''],
      instgAgtMmbId: [''],
      instgAgtLei: [''],
      instgAgtNm: [''],
      instgAgtAdrLine1: [''],
      instgAgtAdrLine2: [''],
      instgAgtAdrLine3: [''],
      instgAgtAdrDept: [''],
      instgAgtAdrSubDept: [''],
      instgAgtAdrStrtNm: [''],
      instgAgtAdrBldgNb: [''],
      instgAgtAdrBldgNm: [''],
      instgAgtAdrFlr: [''],
      instgAgtAdrPstBx: [''],
      instgAgtAdrRoom: [''],
      instgAgtAdrPstCd: [''],
      instgAgtAdrTwnNm: [''],
      instgAgtAdrTwnLctnNm: [''],
      instgAgtAdrDstrctNm: [''],
      instgAgtAdrCtrySubDvsn: [''],
      instgAgtAdrCtry: [''],
      instgAgtAdrLine: [''],

      instdAgtBicfi: [''],
      instdAgtClrSysIdCd: [''],
      instdAgtMmbId: [''],
      instdAgtLei: [''],
      instdAgtNm: [''],
      instdAgtAdrLine1: [''],
      instdAgtAdrLine2: [''],
      instdAgtAdrLine3: [''],
      instdAgtAdrDept: [''],
      instdAgtAdrSubDept: [''],
      instdAgtAdrStrtNm: [''],
      instdAgtAdrBldgNb: [''],
      instdAgtAdrBldgNm: [''],
      instdAgtAdrFlr: [''],
      instdAgtAdrPstBx: [''],
      instdAgtAdrRoom: [''],
      instdAgtAdrPstCd: [''],
      instdAgtAdrTwnNm: [''],
      instdAgtAdrTwnLctnNm: [''],
      instdAgtAdrDstrctNm: [''],
      instdAgtAdrCtrySubDvsn: [''],
      instdAgtAdrCtry: [''],
      instdAgtAdrLine: [''],

      // Intermediary Agent 1 (flat)
      intrmyAgt1Bicfi: [''],
      intrmyAgt1ClrSysIdCd: [''],
      intrmyAgt1MmbId: [''],
      intrmyAgt1Lei: [''],
      intrmyAgt1Nm: [''],
      intrmyAgt1AdrLine1: [''],
      intrmyAgt1AdrLine2: [''],
      intrmyAgt1AdrLine3: [''],
      intrmyAgt1AdrDept: [''],
      intrmyAgt1AdrSubDept: [''],
      intrmyAgt1AdrStrtNm: [''],
      intrmyAgt1AdrBldgNb: [''],
      intrmyAgt1AdrBldgNm: [''],
      intrmyAgt1AdrFlr: [''],
      intrmyAgt1AdrPstBx: [''],
      intrmyAgt1AdrRoom: [''],
      intrmyAgt1AdrPstCd: [''],
      intrmyAgt1AdrTwnNm: [''],
      intrmyAgt1AdrTwnLctnNm: [''],
      intrmyAgt1AdrDstrctNm: [''],
      intrmyAgt1AdrCtrySubDvsn: [''],
      intrmyAgt1AdrCtry: [''],
      intrmyAgt1AdrLine: [''],
      // Intermediary Agent 1 Account (flat)
      intrmyAgt1AcctId: [''],
      intrmyAgt1AcctCcy: [''],
      intrmyAgt1AcctTp: [''],
      intrmyAgt1AcctNm: [''],
      intrmyAgt1AcctSchmeNm: [''],
      intrmyAgt1AcctIssr: [''],

      // Intermediary Agent 2 (flat)
      intrmyAgt2Bicfi: [''],
      intrmyAgt2ClrSysIdCd: [''],
      intrmyAgt2MmbId: [''],
      intrmyAgt2Lei: [''],
      intrmyAgt2Nm: [''],
      intrmyAgt2AdrLine1: [''],
      intrmyAgt2AdrLine2: [''],
      intrmyAgt2AdrLine3: [''],
      intrmyAgt2AdrDept: [''],
      intrmyAgt2AdrSubDept: [''],
      intrmyAgt2AdrStrtNm: [''],
      intrmyAgt2AdrBldgNb: [''],
      intrmyAgt2AdrBldgNm: [''],
      intrmyAgt2AdrFlr: [''],
      intrmyAgt2AdrPstBx: [''],
      intrmyAgt2AdrRoom: [''],
      intrmyAgt2AdrPstCd: [''],
      intrmyAgt2AdrTwnNm: [''],
      intrmyAgt2AdrTwnLctnNm: [''],
      intrmyAgt2AdrDstrctNm: [''],
      intrmyAgt2AdrCtrySubDvsn: [''],
      intrmyAgt2AdrCtry: [''],
      intrmyAgt2AdrLine: [''],
      // Intermediary Agent 2 Account (flat)
      intrmyAgt2AcctId: [''],
      intrmyAgt2AcctCcy: [''],
      intrmyAgt2AcctTp: [''],
      intrmyAgt2AcctNm: [''],
      intrmyAgt2AcctSchmeNm: [''],
      intrmyAgt2AcctIssr: [''],

      // Intermediary Agent 3 (flat)
      intrmyAgt3Bicfi: [''],
      intrmyAgt3ClrSysIdCd: [''],
      intrmyAgt3MmbId: [''],
      intrmyAgt3Lei: [''],
      intrmyAgt3Nm: [''],
      intrmyAgt3AdrLine1: [''],
      intrmyAgt3AdrLine2: [''],
      intrmyAgt3AdrLine3: [''],
      intrmyAgt3AdrDept: [''],
      intrmyAgt3AdrSubDept: [''],
      intrmyAgt3AdrStrtNm: [''],
      intrmyAgt3AdrBldgNb: [''],
      intrmyAgt3AdrBldgNm: [''],
      intrmyAgt3AdrFlr: [''],
      intrmyAgt3AdrPstBx: [''],
      intrmyAgt3AdrRoom: [''],
      intrmyAgt3AdrPstCd: [''],
      intrmyAgt3AdrTwnNm: [''],
      intrmyAgt3AdrTwnLctnNm: [''],
      intrmyAgt3AdrDstrctNm: [''],
      intrmyAgt3AdrCtrySubDvsn: [''],
      intrmyAgt3AdrCtry: [''],
      intrmyAgt3AdrLine: [''],
      // Intermediary Agent 3 Account (flat)
      intrmyAgt3AcctId: [''],
      intrmyAgt3AcctCcy: [''],
      intrmyAgt3AcctTp: [''],
      intrmyAgt3AcctNm: [''],
      intrmyAgt3AcctSchmeNm: [''],
      intrmyAgt3AcctIssr: [''],

      // Debtor (flat)
      dbtrNm: [''],
      dbtrAdrDept: [''],
      dbtrAdrSubDept: [''],
      dbtrAdrStrtNm: [''],
      dbtrAdrBldgNb: [''],
      dbtrAdrBldgNm: [''],
      dbtrAdrFlr: [''],
      dbtrAdrPstBx: [''],
      dbtrAdrRoom: [''],
      dbtrAdrPstCd: [''],
      dbtrAdrTwnNm: [''],
      dbtrAdrTwnLctnNm: [''],
      dbtrAdrDstrctNm: [''],
      dbtrAdrCtrySubDvsn: [''],
      dbtrAdrCtry: [''],
      dbtrAdrLine: [''],
      // Debtor Account (flat)
      dbtrAcctId: [''],
      dbtrAcctCcy: [''],
      dbtrAcctTp: [''],
      dbtrAcctNm: [''],
      dbtrAcctSchmeNm: [''],
      dbtrAcctIssr: [''],

      // Debtor Agent (flat)
      dbtrAgtBicfi: [''],
      dbtrAgtClrSysIdCd: [''],
      dbtrAgtMmbId: [''],
      dbtrAgtLei: [''],
      dbtrAgtNm: [''],
      dbtrAgtAdrLine1: [''],
      dbtrAgtAdrLine2: [''],
      dbtrAgtAdrLine3: [''],
      dbtrAgtAdrDept: [''],
      dbtrAgtAdrSubDept: [''],
      dbtrAgtAdrStrtNm: [''],
      dbtrAgtAdrBldgNb: [''],
      dbtrAgtAdrBldgNm: [''],
      dbtrAgtAdrFlr: [''],
      dbtrAgtAdrPstBx: [''],
      dbtrAgtAdrRoom: [''],
      dbtrAgtAdrPstCd: [''],
      dbtrAgtAdrTwnNm: [''],
      dbtrAgtAdrTwnLctnNm: [''],
      dbtrAgtAdrDstrctNm: [''],
      dbtrAgtAdrCtrySubDvsn: [''],
      dbtrAgtAdrCtry: [''],
      dbtrAgtAdrLine: [''],
      // Debtor Agent Account (flat)
      dbtrAgtAcctId: [''],
      dbtrAgtAcctCcy: [''],
      dbtrAgtAcctTp: [''],
      dbtrAgtAcctNm: [''],
      dbtrAgtAcctSchmeNm: [''],
      dbtrAgtAcctIssr: [''],

      // Creditor Agent (flat)
      cdtrAgtBicfi: [''],
      cdtrAgtClrSysIdCd: [''],
      cdtrAgtMmbId: [''],
      cdtrAgtLei: [''],
      cdtrAgtNm: [''],
      cdtrAgtAdrLine1: [''],
      cdtrAgtAdrLine2: [''],
      cdtrAgtAdrLine3: [''],
      cdtrAgtAdrDept: [''],
      cdtrAgtAdrSubDept: [''],
      cdtrAgtAdrStrtNm: [''],
      cdtrAgtAdrBldgNb: [''],
      cdtrAgtAdrBldgNm: [''],
      cdtrAgtAdrFlr: [''],
      cdtrAgtAdrPstBx: [''],
      cdtrAgtAdrRoom: [''],
      cdtrAgtAdrPstCd: [''],
      cdtrAgtAdrTwnNm: [''],
      cdtrAgtAdrTwnLctnNm: [''],
      cdtrAgtAdrDstrctNm: [''],
      cdtrAgtAdrCtrySubDvsn: [''],
      cdtrAgtAdrCtry: [''],
      cdtrAgtAdrLine: [''],
      // Creditor Agent Account (flat)
      cdtrAgtAcctId: [''],
      cdtrAgtAcctCcy: [''],
      cdtrAgtAcctTp: [''],
      cdtrAgtAcctNm: [''],
      cdtrAgtAcctSchmeNm: [''],
      cdtrAgtAcctIssr: [''],

      // Creditor (flat)
      cdtrNm: [''],
      cdtrAdrDept: [''],
      cdtrAdrSubDept: [''],
      cdtrAdrStrtNm: [''],
      cdtrAdrBldgNb: [''],
      cdtrAdrBldgNm: [''],
      cdtrAdrFlr: [''],
      cdtrAdrPstBx: [''],
      cdtrAdrRoom: [''],
      cdtrAdrPstCd: [''],
      cdtrAdrTwnNm: [''],
      cdtrAdrTwnLctnNm: [''],
      cdtrAdrDstrctNm: [''],
      cdtrAdrCtrySubDvsn: [''],
      cdtrAdrCtry: [''],
      cdtrAdrLine: [''],
      // Creditor Account (flat)
      cdtrAcctId: [''],
      cdtrAcctCcy: [''],
      cdtrAcctTp: [''],
      cdtrAcctNm: [''],
      cdtrAcctSchmeNm: [''],
      cdtrAcctIssr: [''],

      // Instructions
      instrForCdtrAgtCD: [''],
      instrForCdtrAgtInf: [''],
      instrForNxtAgt1: [''],
      instrForNxtAgt2: [''],
      instrForNxtAgt3: [''],
      instrForNxtAgt4: [''],
      instrForNxtAgt5: [''],
      instrForNxtAgt6: [''],

      // Purpose
      purpCD: [''],
      purpPrtry: [''],

      // Remittance
      rmtInf: [''],

      // Authorization
      // auth1stBy: [''],
      // makeDt: [''],
      // auth1stDt: [''],
      // auth2ndBy: [''],
      // auth2ndDt: [''],

      // Other
      lastAction: [''],
      branchId: [''],
      trnRefNo20: [''],
      relatedRef21: [''],

      // Related (flat)
      rltdCharSet: [''],
      rltdFrBicfi: [''],
      rltdFrClrSysIdCd: [''],
      rltdFrMmbId: [''],
      rltdFrLei: [''],
      rltdFrNm: [''],
      rltdFrAdrLine1: [''],
      rltdFrAdrLine2: [''],
      rltdFrAdrLine3: [''],
      rltdFrAdrDept: [''],
      rltdFrAdrSubDept: [''],
      rltdFrAdrStrtNm: [''],
      rltdFrAdrBldgNb: [''],
      rltdFrAdrBldgNm: [''],
      rltdFrAdrFlr: [''],
      rltdFrAdrPstBx: [''],
      rltdFrAdrRoom: [''],
      rltdFrAdrPstCd: [''],
      rltdFrAdrTwnNm: [''],
      rltdFrAdrTwnLctnNm: [''],
      rltdFrAdrDstrctNm: [''],
      rltdFrAdrCtrySubDvsn: [''],
      rltdFrAdrCtry: [''],
      rltdFrAdrLine: [''],

      rltdToBicfi: [''],
      rltdToClrSysIdCd: [''],
      rltdToMmbId: [''],
      rltdToLei: [''],
      rltdToNm: [''],
      rltdToAdrLine1: [''],
      rltdToAdrLine2: [''],
      rltdToAdrLine3: [''],
      rltdToAdrDept: [''],
      rltdToAdrSubDept: [''],
      rltdToAdrStrtNm: [''],
      rltdToAdrBldgNb: [''],
      rltdToAdrBldgNm: [''],
      rltdToAdrFlr: [''],
      rltdToAdrPstBx: [''],
      rltdToAdrRoom: [''],
      rltdToAdrPstCd: [''],
      rltdToAdrTwnNm: [''],
      rltdToAdrTwnLctnNm: [''],
      rltdToAdrDstrctNm: [''],
      rltdToAdrCtrySubDvsn: [''],
      rltdToAdrCtry: [''],
      rltdToAdrLine: [''],
      rltdCpyDplct: ['COPY'],
      rltdPrty: ['NORM'],
    });

    // Ensure the form is properly initialized
    if (this.frmGroup) {
      FormGroupSignal.set(this.frmGroup);
      // Initialize with one service level row
      this.addServiceRow();
    }
  }

  // File input handlers used by the template examples
  onPdfSelected(files: File[]): void {
    this.pdfFiles = files || [];
    this.toastr.info(`${this.pdfFiles.length} PDF file(s) selected`, 'Files');
  }

  onImagesSelected(files: File[]): void {
    this.imageFiles = files || [];
    this.toastr.info(`${this.imageFiles.length} image file(s) selected`, 'Files');
  }

  onAnyFilesSelected(files: File[]): void {
    this.anyFiles = files || [];
    this.toastr.info(`${this.anyFiles.length} file(s) selected`, 'Files');
  }

  onDocumentsSelected(files: File[]): void {
    this.documentFiles = files || [];
    this.toastr.info(`${this.documentFiles.length} document(s) selected`, 'Files');
  }

  onProfilePicSelected(files: File[]): void {
    this.profilePicFile = files && files.length > 0 ? files[0] : undefined;
    this.toastr.success(this.profilePicFile ? `Selected: ${this.profilePicFile.name}` : 'No file selected', 'Profile Picture');
  }

  onFileInputChanged(context: string): void {
    // Context string helps distinguish which input fired, e.g., 'PDF', 'Images'
    this.toastr.show(`File input changed: ${context}`, 'Notice');
  }

  toggleAnyFileUpload(): void {
    this.showAnyFileUpload = !this.showAnyFileUpload;
  }

  // Open BIC selection modal for "From BIC" (Instructing Agent)
  openFromBicSelectionModal(): void {
    this.branchInfoService
      .getBySwiftCodePrefix(
        this.frmGroup.get('fromBicfi')?.value
          ? this.frmGroup.get('fromBicfi')?.value.trim()
          : 'SCBLBDDX'
      )
      .subscribe((res) => {
        this.swiftCodesFrom = res?.payload;
        const dialogRef = this.dialogUtils.openDialog(
          DataSelectionModal,
          this.bicTableHeaders,
          this.swiftCodesFrom
        );

        dialogRef.afterClosed().subscribe((selectedBank: any) => {
          if (selectedBank) {
            // Update From BIC fields
            this.frmGroup.patchValue({
              fromBicfi: selectedBank.swift,
              fromNm: selectedBank.branchName,
            });

            // Update Instructing Agent fields
            this.frmGroup.patchValue({
              instgAgtBicfi: selectedBank.swift,
              instgAgtNm: selectedBank.branchName,
            });

            // this.toastr.success('From BIC selected successfully', 'Success');
          }
        });
      });
  }

  // Open BIC selection modal for "To BIC" (Instructed Agent)
  openToBicSelectionModal(): void {
    this.branchInfoService
      .getBySwiftCodePrefix(
        this.frmGroup.get('toBicfi')?.value
          ? this.frmGroup.get('toBicfi')?.value.trim()
          : 'AANLGB21XXX'
      )
      .subscribe((res) => {
        this.swiftCodesTo = res?.payload;
        const dialogRef = this.dialogUtils.openDialog(
          DataSelectionModal,
          this.bicTableHeaders,
          this.swiftCodesTo
        );

        dialogRef.afterClosed().subscribe((selectedBank: any) => {
          if (selectedBank) {
            // Update To BIC fields
            this.frmGroup.patchValue({
              toBicfi: selectedBank.swift,
              toNm: selectedBank.branchName,
            });

            // Update Instructed Agent fields
            this.frmGroup.patchValue({
              instdAgtBicfi: selectedBank.swift,
              instdAgtNm: selectedBank.branchName,
            });

            //  this.toastr.success('To BIC selected successfully', 'Success');
          }
        });
      });
  }

  resetForm(): void {
    if (this.frmGroup) {
      this.frmGroup.reset();
      // Clear service levels and add one default row
      this.serviceLevels.clear();
      this.addServiceRow();
    }
  }

  // Helper method to get nested form group
  getNestedFormGroup(path: string): FormGroup {
    return this.frmGroup.get(path) as FormGroup;
  }

  // Helper method to check if a nested form group is empty
  isNestedGroupEmpty(path: string): boolean {
    const group = this.getNestedFormGroup(path);
    if (!group) return true;

    const values = group.value;
    return Object.values(values).every(
      (value) =>
        value === '' ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.every((v) => v === ''))
    );
  }

  // Helper method to clear a specific nested form group
  clearNestedGroup(path: string): void {
    const group = this.getNestedFormGroup(path);
    if (group) {
      group.reset();
    }
  }

  // Getter methods for nested form groups - REMOVED - using flat form structure

  // Service Level FormArray getter
  get serviceLevels() {
    return this.frmGroup.get('serviceLevels') as FormArray;
  }

  // Add service level row
  addServiceRow() {
    const serviceGroup = this.formBuilder.group({
      serviceCode: [''],
      servicePriority: [null],
    });
    this.serviceLevels.push(serviceGroup);
  }

  // Remove service level row
  removeServiceRow(index: number) {
    this.serviceLevels.removeAt(index);
  }

  // Get service level group at specific index
  getServiceLevelGroup(index: number): FormGroup {
    return this.serviceLevels.at(index) as FormGroup;
  }

  // Helper method to add address line to a specific address field
  addAddressLine(fieldName: string) {
    const currentValue = this.frmGroup.get(fieldName)?.value || [];
    if (Array.isArray(currentValue)) {
      this.frmGroup.get(fieldName)?.setValue([...currentValue, '']);
    }
  }

  // Helper method to validate required fields
  validateRequiredFields(): boolean {
    const requiredFields = ['bizMsgIdr', 'txId', 'uetr'];
    for (const field of requiredFields) {
      const control = this.frmGroup.get(field);
      if (control && control.invalid) {
        this.toastr.error(`Field ${field} is required`, 'Validation Error');
        return false;
      }
    }
    return true;
  }

  generatePayload(): Mx009Model {
    let payload: any = {};
    let frmValue = this.frmGroup.value;

    // Time and Value Information
    payload.timeIndi13C = frmValue.timeIndi13C;
    payload.timeSign13C = frmValue.timeSign13C;
    payload.timeOffset13C = frmValue.timeOffset13C;
    payload.valDate32A = frmValue.valDate32A
      ? new Date(frmValue.valDate32A)
      : null;
    payload.valCurr32A = frmValue.valCurr32A;
    payload.valAmt32A = frmValue.valAmt32A ? Number(frmValue.valAmt32A) : null;

    // Business Message Header
    payload.bizMsgIdr = frmValue.bizMsgIdr;
    payload.msgDefIdr = frmValue.msgDefIdr;
    payload.bizSvc = frmValue.bizSvc;
    payload.creDt = frmValue.creDt;
    payload.cpyDplct = frmValue.cpyDplct;
    payload.psblDplct = frmValue.psblDplct;
    payload.priority = frmValue.priority;
    payload.msgId = frmValue.msgId;
    payload.creDtTm = frmValue.creDtTm;
    payload.nbOfTxs = frmValue.nbOfTxs;

    // Settlement Information
    payload.sttlmMtd = frmValue.sttlmMtd;

    // Map flat settlement account to nested structure
    payload.sttlmAcct = {
      id: frmValue.sttlmAcctId,
      ccy: frmValue.sttlmAcctCcy,
      tp: frmValue.sttlmAcctTp,
      nm: frmValue.sttlmAcctNm,
      schmeNm: frmValue.sttlmAcctSchmeNm,
      issr: frmValue.sttlmAcctIssr,
    };

    // Payment Identification
    payload.instrId = frmValue.instrId;
    payload.endToEndId = frmValue.endToEndId;
    payload.txId = frmValue.txId;
    payload.uetr = frmValue.uetr;
    payload.clrSysRef = frmValue.clrSysRef;

    // Payment Type Information
    payload.instrPrty = frmValue.instrPrty;
    payload.clrChanl = frmValue.clrChanl;
    // Convert service level FormArray to fixed arrays of 3 elements as per model
    const serviceLevels = frmValue.serviceLevels || [];
    const serviceCodes = serviceLevels
      .map((level: any) => level.serviceCode)
      .filter((code: string) => code);
    const servicePriorities = serviceLevels
      .map((level: any) => level.servicePriority)
      .filter((priority: string) => priority);

    // Ensure arrays have exactly 3 elements as per model specification
    payload.svcLvlCD = [
      serviceCodes[0] || '',
      serviceCodes[1] || '',
      serviceCodes[2] || '',
    ];
    payload.svcLvlPrtry = [
      servicePriorities[0] || '',
      servicePriorities[1] || '',
      servicePriorities[2] || '',
    ];

    payload.lclInstrmCD = frmValue.lclInstrmCD;
    payload.lclInstrmPrtry = frmValue.lclInstrmPrtry;
    payload.ctgyPurpCd = frmValue.ctgyPurpCd;
    payload.ctgyPurpPrtry = frmValue.ctgyPurpPrtry;

    // Interbank Settlement
    payload.intrBkSttlmAmtCcy = frmValue.intrBkSttlmAmtCcy;
    payload.intrBkSttlmAmt = frmValue.intrBkSttlmAmt
      ? Number(frmValue.intrBkSttlmAmt)
      : null;
    payload.intrBkSttlmDt = frmValue.intrBkSttlmDt;
    payload.sttlmPrty = frmValue.sttlmPrty;

    // Map flat previous instructing agent 1 to nested structure
    payload.prvsInstgAgt1 = {
      bIcfi: frmValue.prvsInstgAgt1Bicfi,
      clrSysIdCd: frmValue.prvsInstgAgt1ClrSysIdCd,
      mmbId: frmValue.prvsInstgAgt1MmbId,
      lei: frmValue.prvsInstgAgt1Lei,
      nm: frmValue.prvsInstgAgt1Nm,
      adrLine1: frmValue.prvsInstgAgt1AdrLine1,
      adrLine2: frmValue.prvsInstgAgt1AdrLine2,
      adrLine3: frmValue.prvsInstgAgt1AdrLine3,
      adr: {
        dept: frmValue.prvsInstgAgt1AdrDept,
        subDept: frmValue.prvsInstgAgt1AdrSubDept,
        strtNm: frmValue.prvsInstgAgt1AdrStrtNm,
        bldgNb: frmValue.prvsInstgAgt1AdrBldgNb,
        bldgNm: frmValue.prvsInstgAgt1AdrBldgNm,
        flr: frmValue.prvsInstgAgt1AdrFlr,
        pstBx: frmValue.prvsInstgAgt1AdrPstBx,
        room: frmValue.prvsInstgAgt1AdrRoom,
        pstCd: frmValue.prvsInstgAgt1AdrPstCd,
        twnNm: frmValue.prvsInstgAgt1AdrTwnNm,
        twnLctnNm: frmValue.prvsInstgAgt1AdrTwnLctnNm,
        dstrctNm: frmValue.prvsInstgAgt1AdrDstrctNm,
        ctrySubDvsn: frmValue.prvsInstgAgt1AdrCtrySubDvsn,
        ctry: frmValue.prvsInstgAgt1AdrCtry,
        adrLine: (frmValue.prvsInstgAgt1AdrLine || []).filter(
          (line: string) => line && line.trim() !== ''
        ),
      },
    };

    payload.prvsInstgAgt1Acct = {
      id: frmValue.prvsInstgAgt1AcctId,
      ccy: frmValue.prvsInstgAgt1AcctCcy,
      tp: frmValue.prvsInstgAgt1AcctTp,
      nm: frmValue.prvsInstgAgt1AcctNm,
      schmeNm: frmValue.prvsInstgAgt1AcctSchmeNm,
      issr: frmValue.prvsInstgAgt1AcctIssr,
    };

    // Map flat previous instructing agent 2 to nested structure
    payload.prvsInstgAgt2 = {
      bIcfi: frmValue.prvsInstgAgt2Bicfi,
      clrSysIdCd: frmValue.prvsInstgAgt2ClrSysIdCd,
      mmbId: frmValue.prvsInstgAgt2MmbId,
      lei: frmValue.prvsInstgAgt2Lei,
      nm: frmValue.prvsInstgAgt2Nm,
      adrLine1: frmValue.prvsInstgAgt2AdrLine1,
      adrLine2: frmValue.prvsInstgAgt2AdrLine2,
      adrLine3: frmValue.prvsInstgAgt2AdrLine3,
      adr: {
        dept: frmValue.prvsInstgAgt2AdrDept,
        subDept: frmValue.prvsInstgAgt2AdrSubDept,
        strtNm: frmValue.prvsInstgAgt2AdrStrtNm,
        bldgNb: frmValue.prvsInstgAgt2AdrBldgNb,
        bldgNm: frmValue.prvsInstgAgt2AdrBldgNm,
        flr: frmValue.prvsInstgAgt2AdrFlr,
        pstBx: frmValue.prvsInstgAgt2AdrPstBx,
        room: frmValue.prvsInstgAgt2AdrRoom,
        pstCd: frmValue.prvsInstgAgt2AdrPstCd,
        twnNm: frmValue.prvsInstgAgt2AdrTwnNm,
        twnLctnNm: frmValue.prvsInstgAgt2AdrTwnLctnNm,
        dstrctNm: frmValue.prvsInstgAgt2AdrDstrctNm,
        ctrySubDvsn: frmValue.prvsInstgAgt2AdrCtrySubDvsn,
        ctry: frmValue.prvsInstgAgt2AdrCtry,
        adrLine: (frmValue.prvsInstgAgt2AdrLine || []).filter(
          (line: string) => line && line.trim() !== ''
        ),
      },
    };

    payload.prvsInstgAgt2Acct = {
      id: frmValue.prvsInstgAgt2AcctId,
      ccy: frmValue.prvsInstgAgt2AcctCcy,
      tp: frmValue.prvsInstgAgt2AcctTp,
      nm: frmValue.prvsInstgAgt2AcctNm,
      schmeNm: frmValue.prvsInstgAgt2AcctSchmeNm,
      issr: frmValue.prvsInstgAgt2AcctIssr,
    };

    // Map flat previous instructing agent 3 to nested structure
    payload.prvsInstgAgt3 = {
      bIcfi: frmValue.prvsInstgAgt3Bicfi,
      clrSysIdCd: frmValue.prvsInstgAgt3ClrSysIdCd,
      mmbId: frmValue.prvsInstgAgt3MmbId,
      lei: frmValue.prvsInstgAgt3Lei,
      nm: frmValue.prvsInstgAgt3Nm,
      adrLine1: frmValue.prvsInstgAgt3AdrLine1,
      adrLine2: frmValue.prvsInstgAgt3AdrLine2,
      adrLine3: frmValue.prvsInstgAgt3AdrLine3,
      adr: {
        dept: frmValue.prvsInstgAgt3AdrDept,
        subDept: frmValue.prvsInstgAgt3AdrSubDept,
        strtNm: frmValue.prvsInstgAgt3AdrStrtNm,
        bldgNb: frmValue.prvsInstgAgt3AdrBldgNb,
        bldgNm: frmValue.prvsInstgAgt3AdrBldgNm,
        flr: frmValue.prvsInstgAgt3AdrFlr,
        pstBx: frmValue.prvsInstgAgt3AdrPstBx,
        room: frmValue.prvsInstgAgt3AdrRoom,
        pstCd: frmValue.prvsInstgAgt3AdrPstCd,
        twnNm: frmValue.prvsInstgAgt3AdrTwnNm,
        twnLctnNm: frmValue.prvsInstgAgt3AdrTwnLctnNm,
        dstrctNm: frmValue.prvsInstgAgt3AdrDstrctNm,
        ctrySubDvsn: frmValue.prvsInstgAgt3AdrCtrySubDvsn,
        ctry: frmValue.prvsInstgAgt3AdrCtry,
        adrLine: (frmValue.prvsInstgAgt3AdrLine || []).filter(
          (line: string) => line && line.trim() !== ''
        ),
      },
    };

    payload.prvsInstgAgt3Acct = {
      id: frmValue.prvsInstgAgt3AcctId,
      ccy: frmValue.prvsInstgAgt3AcctCcy,
      tp: frmValue.prvsInstgAgt3AcctTp,
      nm: frmValue.prvsInstgAgt3AcctNm,
      schmeNm: frmValue.prvsInstgAgt3AcctSchmeNm,
      issr: frmValue.prvsInstgAgt3AcctIssr,
    };

    // Map flat agents to nested structure
    payload.instgAgt = {
      bIcfi: frmValue.instgAgtBicfi,
      clrSysIdCd: frmValue.instgAgtClrSysIdCd,
      mmbId: frmValue.instgAgtMmbId,
      lei: frmValue.instgAgtLei,
      nm: frmValue.instgAgtNm,
      adrLine1: frmValue.instgAgtAdrLine1,
      adrLine2: frmValue.instgAgtAdrLine2,
      adrLine3: frmValue.instgAgtAdrLine3,
      adr: {
        dept: frmValue.instgAgtAdrDept,
        subDept: frmValue.instgAgtAdrSubDept,
        strtNm: frmValue.instgAgtAdrStrtNm,
        bldgNb: frmValue.instgAgtAdrBldgNb,
        bldgNm: frmValue.instgAgtAdrBldgNm,
        flr: frmValue.instgAgtAdrFlr,
        pstBx: frmValue.instgAgtAdrPstBx,
        room: frmValue.instgAgtAdrRoom,
        pstCd: frmValue.instgAgtAdrPstCd,
        twnNm: frmValue.instgAgtAdrTwnNm,
        twnLctnNm: frmValue.instgAgtAdrTwnLctnNm,
        dstrctNm: frmValue.instgAgtAdrDstrctNm,
        ctrySubDvsn: frmValue.instgAgtAdrCtrySubDvsn,
        ctry: frmValue.instgAgtAdrCtry,
        adrLine: (frmValue.instgAgtAdrLine || []).filter(
          (line: string) => line && line.trim() !== ''
        ),
      },
    };

    payload.instdAgt = {
      bIcfi: frmValue.instdAgtBicfi,
      clrSysIdCd: frmValue.instdAgtClrSysIdCd,
      mmbId: frmValue.instdAgtMmbId,
      lei: frmValue.instdAgtLei,
      nm: frmValue.instdAgtNm,
      adrLine1: frmValue.instdAgtAdrLine1,
      adrLine2: frmValue.instdAgtAdrLine2,
      adrLine3: frmValue.instdAgtAdrLine3,
      adr: {
        dept: frmValue.instdAgtAdrDept,
        subDept: frmValue.instdAgtAdrSubDept,
        strtNm: frmValue.instdAgtAdrStrtNm,
        bldgNb: frmValue.instdAgtAdrBldgNb,
        bldgNm: frmValue.instdAgtAdrBldgNm,
        flr: frmValue.instdAgtAdrFlr,
        pstBx: frmValue.instdAgtAdrPstBx,
        room: frmValue.instdAgtAdrRoom,
        pstCd: frmValue.instdAgtAdrPstCd,
        twnNm: frmValue.instdAgtAdrTwnNm,
        twnLctnNm: frmValue.instdAgtAdrTwnLctnNm,
        dstrctNm: frmValue.instdAgtAdrDstrctNm,
        ctrySubDvsn: frmValue.instdAgtAdrCtrySubDvsn,
        ctry: frmValue.instdAgtAdrCtry,
        adrLine: (frmValue.instdAgtAdrLine || []).filter(
          (line: string) => line && line.trim() !== ''
        ),
      },
    };

    // Map flat intermediary agents to nested structure
    payload.intrmyAgt1 = {
      bIcfi: frmValue.intrmyAgt1Bicfi,
      clrSysIdCd: frmValue.intrmyAgt1ClrSysIdCd,
      mmbId: frmValue.intrmyAgt1MmbId,
      lei: frmValue.intrmyAgt1Lei,
      nm: frmValue.intrmyAgt1Nm,
      adrLine1: frmValue.intrmyAgt1AdrLine1,
      adrLine2: frmValue.intrmyAgt1AdrLine2,
      adrLine3: frmValue.intrmyAgt1AdrLine3,
      adr: {
        dept: frmValue.intrmyAgt1AdrDept,
        subDept: frmValue.intrmyAgt1AdrSubDept,
        strtNm: frmValue.intrmyAgt1AdrStrtNm,
        bldgNb: frmValue.intrmyAgt1AdrBldgNb,
        bldgNm: frmValue.intrmyAgt1AdrBldgNm,
        flr: frmValue.intrmyAgt1AdrFlr,
        pstBx: frmValue.intrmyAgt1AdrPstBx,
        room: frmValue.intrmyAgt1AdrRoom,
        pstCd: frmValue.intrmyAgt1AdrPstCd,
        twnNm: frmValue.intrmyAgt1AdrTwnNm,
        twnLctnNm: frmValue.intrmyAgt1AdrTwnLctnNm,
        dstrctNm: frmValue.intrmyAgt1AdrDstrctNm,
        ctrySubDvsn: frmValue.intrmyAgt1AdrCtrySubDvsn,
        ctry: frmValue.intrmyAgt1AdrCtry,
        adrLine: (frmValue.intrmyAgt1AdrLine || []).filter(
          (line: string) => line && line.trim() !== ''
        ),
      },
    };

    payload.intrmyAgt1Acct = {
      id: frmValue.intrmyAgt1AcctId,
      ccy: frmValue.intrmyAgt1AcctCcy,
      tp: frmValue.intrmyAgt1AcctTp,
      nm: frmValue.intrmyAgt1AcctNm,
      schmeNm: frmValue.intrmyAgt1AcctSchmeNm,
      issr: frmValue.intrmyAgt1AcctIssr,
    };

    payload.intrmyAgt2 = {
      bIcfi: frmValue.intrmyAgt2Bicfi,
      clrSysIdCd: frmValue.intrmyAgt2ClrSysIdCd,
      mmbId: frmValue.intrmyAgt2MmbId,
      lei: frmValue.intrmyAgt2Lei,
      nm: frmValue.intrmyAgt2Nm,
      adrLine1: frmValue.intrmyAgt2AdrLine1,
      adrLine2: frmValue.intrmyAgt2AdrLine2,
      adrLine3: frmValue.intrmyAgt2AdrLine3,
      adr: {
        dept: frmValue.intrmyAgt2AdrDept,
        subDept: frmValue.intrmyAgt2AdrSubDept,
        strtNm: frmValue.intrmyAgt2AdrStrtNm,
        bldgNb: frmValue.intrmyAgt2AdrBldgNb,
        bldgNm: frmValue.intrmyAgt2AdrBldgNm,
        flr: frmValue.intrmyAgt2AdrFlr,
        pstBx: frmValue.intrmyAgt2AdrPstBx,
        room: frmValue.intrmyAgt2AdrRoom,
        pstCd: frmValue.intrmyAgt2AdrPstCd,
        twnNm: frmValue.intrmyAgt2AdrTwnNm,
        twnLctnNm: frmValue.intrmyAgt2AdrTwnLctnNm,
        dstrctNm: frmValue.intrmyAgt2AdrDstrctNm,
        ctrySubDvsn: frmValue.intrmyAgt2AdrCtrySubDvsn,
        ctry: frmValue.intrmyAgt2AdrCtry,
        adrLine: (frmValue.intrmyAgt2AdrLine || []).filter(
          (line: string) => line && line.trim() !== ''
        ),
      },
    };

    payload.intrmyAgt2Acct = {
      id: frmValue.intrmyAgt2AcctId,
      ccy: frmValue.intrmyAgt2AcctCcy,
      tp: frmValue.intrmyAgt2AcctTp,
      nm: frmValue.intrmyAgt2AcctNm,
      schmeNm: frmValue.intrmyAgt2AcctSchmeNm,
      issr: frmValue.intrmyAgt2AcctIssr,
    };

    payload.intrmyAgt3 = {
      bIcfi: frmValue.intrmyAgt3Bicfi,
      clrSysIdCd: frmValue.intrmyAgt3ClrSysIdCd,
      mmbId: frmValue.intrmyAgt3MmbId,
      lei: frmValue.intrmyAgt3Lei,
      nm: frmValue.intrmyAgt3Nm,
      adrLine1: frmValue.intrmyAgt3AdrLine1,
      adrLine2: frmValue.intrmyAgt3AdrLine2,
      adrLine3: frmValue.intrmyAgt3AdrLine3,
      adr: {
        dept: frmValue.intrmyAgt3AdrDept,
        subDept: frmValue.intrmyAgt3AdrSubDept,
        strtNm: frmValue.intrmyAgt3AdrStrtNm,
        bldgNb: frmValue.intrmyAgt3AdrBldgNb,
        bldgNm: frmValue.intrmyAgt3AdrBldgNm,
        flr: frmValue.intrmyAgt3AdrFlr,
        pstBx: frmValue.intrmyAgt3AdrPstBx,
        room: frmValue.intrmyAgt3AdrRoom,
        pstCd: frmValue.intrmyAgt3AdrPstCd,
        twnNm: frmValue.intrmyAgt3AdrTwnNm,
        twnLctnNm: frmValue.intrmyAgt3AdrTwnLctnNm,
        dstrctNm: frmValue.intrmyAgt3AdrDstrctNm,
        ctrySubDvsn: frmValue.intrmyAgt3AdrCtrySubDvsn,
        ctry: frmValue.intrmyAgt3AdrCtry,
        adrLine: (frmValue.intrmyAgt3AdrLine || []).filter(
          (line: string) => line && line.trim() !== ''
        ),
      },
    };

    payload.intrmyAgt3Acct = {
      id: frmValue.intrmyAgt3AcctId,
      ccy: frmValue.intrmyAgt3AcctCcy,
      tp: frmValue.intrmyAgt3AcctTp,
      nm: frmValue.intrmyAgt3AcctNm,
      schmeNm: frmValue.intrmyAgt3AcctSchmeNm,
      issr: frmValue.intrmyAgt3AcctIssr,
    };

    // Map flat debtor to nested structure
    payload.dbtr = {
      bIcfi: '',
      clrSysIdCd: '',
      mmbId: '',
      lei: '',
      nm: frmValue.dbtrNm,
      adrLine1: '',
      adrLine2: '',
      adrLine3: '',
      adr: {
        dept: frmValue.dbtrAdrDept,
        subDept: frmValue.dbtrAdrSubDept,
        strtNm: frmValue.dbtrAdrStrtNm,
        bldgNb: frmValue.dbtrAdrBldgNb,
        bldgNm: frmValue.dbtrAdrBldgNm,
        flr: frmValue.dbtrAdrFlr,
        pstBx: frmValue.dbtrAdrPstBx,
        room: frmValue.dbtrAdrRoom,
        pstCd: frmValue.dbtrAdrPstCd,
        twnNm: frmValue.dbtrAdrTwnNm,
        twnLctnNm: frmValue.dbtrAdrTwnLctnNm,
        dstrctNm: frmValue.dbtrAdrDstrctNm,
        ctrySubDvsn: frmValue.dbtrAdrCtrySubDvsn,
        ctry: frmValue.dbtrAdrCtry,
        adrLine: (frmValue.dbtrAdrLine || []).filter(
          (line: string) => line && line.trim() !== ''
        ),
      },
    };

    payload.dbtrAcct = {
      id: frmValue.dbtrAcctId,
      ccy: frmValue.dbtrAcctCcy,
      tp: frmValue.dbtrAcctTp,
      nm: frmValue.dbtrAcctNm,
      schmeNm: frmValue.dbtrAcctSchmeNm,
      issr: frmValue.dbtrAcctIssr,
    };

    payload.dbtrAgt = {
      bIcfi: frmValue.dbtrAgtBicfi,
      clrSysIdCd: frmValue.dbtrAgtClrSysIdCd,
      mmbId: frmValue.dbtrAgtMmbId,
      lei: frmValue.dbtrAgtLei,
      nm: frmValue.dbtrAgtNm,
      adrLine1: frmValue.dbtrAgtAdrLine1,
      adrLine2: frmValue.dbtrAgtAdrLine2,
      adrLine3: frmValue.dbtrAgtAdrLine3,
      adr: {
        dept: frmValue.dbtrAgtAdrDept,
        subDept: frmValue.dbtrAgtAdrSubDept,
        strtNm: frmValue.dbtrAgtAdrStrtNm,
        bldgNb: frmValue.dbtrAgtAdrBldgNb,
        bldgNm: frmValue.dbtrAgtAdrBldgNm,
        flr: frmValue.dbtrAgtAdrFlr,
        pstBx: frmValue.dbtrAgtAdrPstBx,
        room: frmValue.dbtrAgtAdrRoom,
        pstCd: frmValue.dbtrAgtAdrPstCd,
        twnNm: frmValue.dbtrAgtAdrTwnNm,
        twnLctnNm: frmValue.dbtrAgtAdrTwnLctnNm,
        dstrctNm: frmValue.dbtrAgtAdrDstrctNm,
        ctrySubDvsn: frmValue.dbtrAgtAdrCtrySubDvsn,
        ctry: frmValue.dbtrAgtAdrCtry,
        adrLine: (frmValue.dbtrAgtAdrLine || []).filter(
          (line: string) => line && line.trim() !== ''
        ),
      },
    };

    payload.dbtrAgtAcct = {
      id: frmValue.dbtrAgtAcctId,
      ccy: frmValue.dbtrAgtAcctCcy,
      tp: frmValue.dbtrAgtAcctTp,
      nm: frmValue.dbtrAgtAcctNm,
      schmeNm: frmValue.dbtrAgtAcctSchmeNm,
      issr: frmValue.dbtrAgtAcctIssr,
    };

    // Map flat creditor agent to nested structure
    payload.cdtrAgt = {
      bIcfi: frmValue.cdtrAgtBicfi,
      clrSysIdCd: frmValue.cdtrAgtClrSysIdCd,
      mmbId: frmValue.cdtrAgtMmbId,
      lei: frmValue.cdtrAgtLei,
      nm: frmValue.cdtrAgtNm,
      adrLine1: frmValue.cdtrAgtAdrLine1,
      adrLine2: frmValue.cdtrAgtAdrLine2,
      adrLine3: frmValue.cdtrAgtAdrLine3,
      adr: {
        dept: frmValue.cdtrAgtAdrDept,
        subDept: frmValue.cdtrAgtAdrSubDept,
        strtNm: frmValue.cdtrAgtAdrStrtNm,
        bldgNb: frmValue.cdtrAgtAdrBldgNb,
        bldgNm: frmValue.cdtrAgtAdrBldgNm,
        flr: frmValue.cdtrAgtAdrFlr,
        pstBx: frmValue.cdtrAgtAdrPstBx,
        room: frmValue.cdtrAgtAdrRoom,
        pstCd: frmValue.cdtrAgtAdrPstCd,
        twnNm: frmValue.cdtrAgtAdrTwnNm,
        twnLctnNm: frmValue.cdtrAgtAdrTwnLctnNm,
        dstrctNm: frmValue.cdtrAgtAdrDstrctNm,
        ctrySubDvsn: frmValue.cdtrAgtAdrCtrySubDvsn,
        ctry: frmValue.cdtrAgtAdrCtry,
        adrLine: (frmValue.cdtrAgtAdrLine || []).filter(
          (line: string) => line && line.trim() !== ''
        ),
      },
    };

    payload.cdtrAgtAcct = {
      id: frmValue.cdtrAgtAcctId,
      ccy: frmValue.cdtrAgtAcctCcy,
      tp: frmValue.cdtrAgtAcctTp,
      nm: frmValue.cdtrAgtAcctNm,
      schmeNm: frmValue.cdtrAgtAcctSchmeNm,
      issr: frmValue.cdtrAgtAcctIssr,
    };

    // Map flat creditor to nested structure
    payload.cdtr = {
      bIcfi: '',
      clrSysIdCd: '',
      mmbId: '',
      lei: '',
      nm: frmValue.cdtrNm,
      adrLine1: '',
      adrLine2: '',
      adrLine3: '',
      adr: {
        dept: frmValue.cdtrAdrDept,
        subDept: frmValue.cdtrAdrSubDept,
        strtNm: frmValue.cdtrAdrStrtNm,
        bldgNb: frmValue.cdtrAdrBldgNb,
        bldgNm: frmValue.cdtrAdrBldgNm,
        flr: frmValue.cdtrAdrFlr,
        pstBx: frmValue.cdtrAdrPstBx,
        room: frmValue.cdtrAdrRoom,
        pstCd: frmValue.cdtrAdrPstCd,
        twnNm: frmValue.cdtrAdrTwnNm,
        twnLctnNm: frmValue.cdtrAdrTwnLctnNm,
        dstrctNm: frmValue.cdtrAdrDstrctNm,
        ctrySubDvsn: frmValue.cdtrAdrCtrySubDvsn,
        ctry: frmValue.cdtrAdrCtry,
        adrLine: (frmValue.cdtrAdrLine || []).filter(
          (line: string) => line && line.trim() !== ''
        ),
      },
    };

    payload.cdtrAcct = {
      id: frmValue.cdtrAcctId,
      ccy: frmValue.cdtrAcctCcy,
      tp: frmValue.cdtrAcctTp,
      nm: frmValue.cdtrAcctNm,
      schmeNm: frmValue.cdtrAcctSchmeNm,
      issr: frmValue.cdtrAcctIssr,
    };

    // Instructions
    payload.instrForCdtrAgtCD = frmValue.instrForCdtrAgtCD;
    payload.instrForCdtrAgtInf = frmValue.instrForCdtrAgtInf;
    payload.instrForNxtAgt1 = frmValue.instrForNxtAgt1;
    payload.instrForNxtAgt2 = frmValue.instrForNxtAgt2;
    payload.instrForNxtAgt3 = frmValue.instrForNxtAgt3;
    payload.instrForNxtAgt4 = frmValue.instrForNxtAgt4;
    payload.instrForNxtAgt5 = frmValue.instrForNxtAgt5;
    payload.instrForNxtAgt6 = frmValue.instrForNxtAgt6;

    // Purpose
    payload.purpCD = frmValue.purpCD;
    payload.purpPrtry = frmValue.purpPrtry;

    // Remittance
    payload.rmtInf = frmValue.rmtInf;

    // Authorization
    payload.auth1stBy = frmValue.auth1stBy;
    payload.makeDt = frmValue.makeDt ? new Date(frmValue.makeDt) : null;
    payload.auth1stDt = frmValue.auth1stDt
      ? new Date(frmValue.auth1stDt)
      : null;
    payload.auth2ndBy = frmValue.auth2ndBy;
    payload.auth2ndDt = frmValue.auth2ndDt
      ? new Date(frmValue.auth2ndDt)
      : null;

    // Other
    payload.lastAction = frmValue.lastAction;
    payload.branchId = frmValue.branchId;
    payload.trnRefNo20 = frmValue.trnRefNo20;
    payload.relatedRef21 = frmValue.relatedRef21;

    // Map flat related to nested structure
    payload.rltd = {
      charSet: frmValue.rltdCharSet,
      fr: {
        bIcfi: frmValue.rltdFrBicfi,
        clrSysIdCd: frmValue.rltdFrClrSysIdCd,
        mmbId: frmValue.rltdFrMmbId,
        lei: frmValue.rltdFrLei,
        nm: frmValue.rltdFrNm,
        adrLine1: frmValue.rltdFrAdrLine1,
        adrLine2: frmValue.rltdFrAdrLine2,
        adrLine3: frmValue.rltdFrAdrLine3,
        adr: {
          dept: frmValue.rltdFrAdrDept,
          subDept: frmValue.rltdFrAdrSubDept,
          strtNm: frmValue.rltdFrAdrStrtNm,
          bldgNb: frmValue.rltdFrAdrBldgNb,
          bldgNm: frmValue.rltdFrAdrBldgNm,
          flr: frmValue.rltdFrAdrFlr,
          pstBx: frmValue.rltdFrAdrPstBx,
          room: frmValue.rltdFrAdrRoom,
          pstCd: frmValue.rltdFrAdrPstCd,
          twnNm: frmValue.rltdFrAdrTwnNm,
          twnLctnNm: frmValue.rltdFrAdrTwnLctnNm,
          dstrctNm: frmValue.rltdFrAdrDstrctNm,
          ctrySubDvsn: frmValue.rltdFrAdrCtrySubDvsn,
          ctry: frmValue.rltdFrAdrCtry,
          adrLine: (frmValue.rltdFrAdrLine || []).filter(
            (line: string) => line && line.trim() !== ''
          ),
        },
      },
      to: {
        bIcfi: frmValue.rltdToBicfi,
        clrSysIdCd: frmValue.rltdToClrSysIdCd,
        mmbId: frmValue.rltdToMmbId,
        lei: frmValue.rltdToLei,
        nm: frmValue.rltdToNm,
        adrLine1: frmValue.rltdToAdrLine1,
        adrLine2: frmValue.rltdToAdrLine2,
        adrLine3: frmValue.rltdToAdrLine3,
        adr: {
          dept: frmValue.rltdToAdrDept,
          subDept: frmValue.rltdToAdrSubDept,
          strtNm: frmValue.rltdToAdrStrtNm,
          bldgNb: frmValue.rltdToAdrBldgNb,
          bldgNm: frmValue.rltdToAdrBldgNm,
          flr: frmValue.rltdToAdrFlr,
          pstBx: frmValue.rltdToAdrPstBx,
          room: frmValue.rltdToAdrRoom,
          pstCd: frmValue.rltdToAdrPstCd,
          twnNm: frmValue.rltdToAdrTwnNm,
          twnLctnNm: frmValue.rltdToAdrTwnLctnNm,
          dstrctNm: frmValue.rltdToAdrDstrctNm,
          ctrySubDvsn: frmValue.rltdToAdrCtrySubDvsn,
          ctry: frmValue.rltdToAdrCtry,
          adrLine: (frmValue.rltdToAdrLine || []).filter(
            (line: string) => line && line.trim() !== ''
          ),
        },
      },
      bizMsgIdr: frmValue.rltdBizMsgIdr,
      msgDefIdr: frmValue.rltdMsgDefIdr,
      bizSvc: frmValue.rltdBizSvc,
      creDt: frmValue.rltdCreDt,
      cpyDplct: frmValue.rltdCpyDplct,
      prty:
        frmValue.rltdPrty === 'HIGH' || frmValue.rltdPrty === 'NORM'
          ? frmValue.rltdPrty
          : 'NORM',
    };

    return payload as Mx009Model;
  }
  onIdInfoChange(a:string){
    console.log('ID Info changed:', a);
  }

  save(): void {
    if (this.frmGroup.invalid) {
      this.toastr.error(
        'Please fill in all required fields',
        'Validation Error'
      );
      return;
    }

    // Additional validation for required fields
    if (!this.validateRequiredFields()) {
      return;
    }

    const payload = this.generatePayload();

    // Log the payload for debugging
    console.log('Generated payload:', payload);

    this.pacs008Service.save(payload).subscribe({
      next: (res) => {
        console.log('Success response:', res);
        this.toastr.success('PACS.008 message saved successfully!', 'Success');
        // Optionally reset form after successful save
        // this.resetForm();
      },
      error: (error) => {
        console.error('Error saving PACS.008:', error);
        let errorMessage = 'Failed to save PACS.008 message';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

}
