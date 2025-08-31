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
import {BusinessApplicationHeader} from '../../components/business-application-header/business-application-header';
import {BicSelectionService} from '../../../../shared/services/bic-selection.service';
import {Mx008Model} from '../../model/mx008.model';
import {ExternalCodeService} from '../../../../shared/services/external-code.service';

@Component({
    selector: 'app-pacs-008',
  imports: [
    ReactiveFormsModule,
    TextBaseInput,
    SubPanelHeader,
    SelectOptionField,
    DateInput,
    AmountToWordInput,
    ExpansionPanelHeader,
    ExpansionSubPanelHeader,
    DataSelectionModal,
    BusinessApplicationHeader,
  ],
    templateUrl: './pacs-008.html',
    standalone: true,
    styleUrl: './pacs-008.scss'
})
export class Pacs008 implements OnInit {
dialogUtils = inject(DialogUtils);
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  externalCodeService = inject(ExternalCodeService);
  pacs008Service = inject(Pacs008Service);
  frmGroup: FormGroup;
  onClickReset = ONCLICK_RESET;
  onClickSave = ONCLICK_SAVE;
  priorityOptions: SelectOptionsModel[] = [
    { key: 'HIGH', value: 'HIGH' },
    { key: 'NORM', value: 'NORM' },
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

  TypeOptions: SelectOptionsModel[] =[
    {key: 'Cd', value: 'Code'},
    {key: 'Prtry', value: 'Proprietary'}
  ];

  serviceLevelCodeOptions: SelectOptionsModel[] = [];

  // Panel visibility signals
  timeDatePanel: WritableSignal<boolean> = signal(true);
  fromBicPanel: WritableSignal<boolean> = signal(true);
  toBicPanel: WritableSignal<boolean> = signal(true);
  marketPracticePanel: WritableSignal<boolean> = signal(false);
  subPanelOpen: WritableSignal<boolean> = signal(true);
  businessHeaderPanel: WritableSignal<boolean> = signal(true);
  businessApplicationHeaderPanel: WritableSignal<boolean> = signal(true);
  groupHeaderPanel: WritableSignal<boolean> = signal(true);
  settlementPanel: WritableSignal<boolean> = signal(true);
  financialInstitutionCreditTransferPanel: WritableSignal<boolean> =
    signal(true);
  paymentIdPanel: WritableSignal<boolean> = signal(true);
  paymentTypePanel: WritableSignal<boolean> = signal(false);
  serviceLevelPanel: WritableSignal<boolean> = signal(true);
  interbankPanel: WritableSignal<boolean> = signal(true);
  sttlmTmIndctnPanel: WritableSignal<boolean> = signal(false);
  sttmlTmRqstPanel: WritableSignal<boolean> = signal(false);
  chargesInformationPanel: WritableSignal<boolean> = signal(true);
  previousAgentsPanel: WritableSignal<boolean> = signal(true);
  prevAgent1Panel: WritableSignal<boolean> = signal(false);
  prevAgent1AddressPanel:  WritableSignal<boolean> = signal(false);
  prevAgent2Panel: WritableSignal<boolean> = signal(false);
  prevAgent2AddressPanel:  WritableSignal<boolean> = signal(false);
  prevAgent3Panel: WritableSignal<boolean> = signal(false);
  prevAgent3AddressPanel:  WritableSignal<boolean> = signal(false);
  agentsPanel: WritableSignal<boolean> = signal(true);
  instructingAgentPanel: WritableSignal<boolean> = signal(true);
  instructedAgentPanel: WritableSignal<boolean> = signal(true);
  instructedAgentAddressPanel: WritableSignal<boolean> = signal(false);
  intermediaryAgentsPanel: WritableSignal<boolean> = signal(true);
  intermediary1Panel: WritableSignal<boolean> = signal(false);
  intrmyAgt1AddrPanel: WritableSignal<boolean> = signal(false);
  intrmyAgt2AddrPanel: WritableSignal<boolean> = signal(false);
  intrmyAgt3AddrPanel: WritableSignal<boolean> = signal(false);
  intermediary2Panel: WritableSignal<boolean> = signal(false);
  intermediary3Panel: WritableSignal<boolean> = signal(false);
  detorInfoPanel: WritableSignal<boolean> = signal(true);
  debtorPanel: WritableSignal<boolean> = signal(true);
  dbtrAddressPanel: WritableSignal<boolean> = signal(false);
  dbtrIdenPanel: WritableSignal<boolean> = signal(false);
  debtorAccPanel: WritableSignal<boolean> = signal(true);
  debtorAccIdenPanel: WritableSignal<boolean> = signal(true);
  debtorAccOthr: WritableSignal<boolean> = signal(true);
  dbtrAgentPanel: WritableSignal<boolean> = signal(true);
  dbtrAgentClrSysMemId: WritableSignal<boolean> = signal(false);
  dbAgntAddrsPanel: WritableSignal<boolean> = signal(false);
  dbtrAgAccOthr: WritableSignal<boolean> = signal(true);
  dbtrAgentAccPanel: WritableSignal<boolean> = signal(false);
  dbtrAgentAccIdenPanel: WritableSignal<boolean> = signal(true);
  ultimateDebtorPanel: WritableSignal<boolean> = signal(false);
  ultdbtrAddressPanel: WritableSignal<boolean> = signal(false);
  ultdbtrIdenPanel: WritableSignal<boolean> = signal(false);
  ultorgIden : WritableSignal<boolean> = signal(true);
  ultprivateIden : WritableSignal<boolean> = signal(true);
  ultorgIdenOthr : WritableSignal<boolean> = signal(true);
  ultdateNPlaceOfBirth : WritableSignal<boolean> = signal(false);
  ultprivateIdenOthr : WritableSignal<boolean> = signal(true);
  orgIden : WritableSignal<boolean> = signal(true);
  orgIdenOthr : WritableSignal<boolean> = signal(true);
  privateIden : WritableSignal<boolean> = signal(true);
  dateNPlaceOfBirth : WritableSignal<boolean> = signal(false);
  privateIdenOthr : WritableSignal<boolean> = signal(true);
  creditTransferTransactionPanel: WritableSignal<boolean> = signal(true);
  creditorInfoPanel: WritableSignal<boolean> = signal(true);
  creditorPanel: WritableSignal<boolean> = signal(true);

  crdtrAddressPanel: WritableSignal<boolean> = signal(false);
  crdtrIdenPanel: WritableSignal<boolean> = signal(false);
  crdtrorgIden: WritableSignal<boolean> = signal(true);
  crdtrorgIdenOthr: WritableSignal<boolean> = signal(true);
  crdtrprivateIden: WritableSignal<boolean> = signal(true);
  crdtrdateNPlaceOfBirth: WritableSignal<boolean> = signal(false);
  crdtrprivateIdenOthr: WritableSignal<boolean> = signal(true);
  crdtrAccPanel: WritableSignal<boolean> = signal(false);
  crdtrAccIdenPanel: WritableSignal<boolean> = signal(true);
  crdtrAccOthr: WritableSignal<boolean> = signal(true);
  crdtrAgentPanel: WritableSignal<boolean> = signal(true);
  crdtrAgentClrSysMemId: WritableSignal<boolean> = signal(false);
  crdtrAgntAddrsPanel: WritableSignal<boolean> = signal(false);
  crdtrAgentAccPanel: WritableSignal<boolean> = signal(false);
  crdtrAgentAccIdenPanel: WritableSignal<boolean> = signal(true);
  crdtrAgAccOthr: WritableSignal<boolean> = signal(true);
  ultimateCreditorPanel: WritableSignal<boolean> = signal(false);
  ultcrdtrAddressPanel: WritableSignal<boolean> = signal(false);
  ultcrdtrIdenPanel: WritableSignal<boolean> = signal(false);
  ultcrdtrorgIden : WritableSignal<boolean> = signal(true);
  ultcrdtrorgIdenOthr : WritableSignal<boolean> = signal(true);
  ultcrdtrprivateIden : WritableSignal<boolean> = signal(true);
  ultcrdtrdateNPlaceOfBirth : WritableSignal<boolean> = signal(false);
  ultcrdtrprivateIdenOthr : WritableSignal<boolean> = signal(true);

  instructionsPanel: WritableSignal<boolean> = signal(true);
  purposePanel: WritableSignal<boolean> = signal(true);
  authorizationPanel: WritableSignal<boolean> = signal(true);
  otherInfoPanel: WritableSignal<boolean> = signal(true);
  relatedInfoPanel: WritableSignal<boolean> = signal(false);
  rltdFrmBicPanel: WritableSignal<boolean> = signal(false);
  rltdToBicPanel: WritableSignal<boolean> = signal(false);
  swiftCodesFrom: any;
  swiftCodesTo: any;

  // Define column headers for the BIC selection modal
  bicTableHeaders = new Map<string, string>([
    ['swift', 'SWIFT Code'],
    ['branchName', 'Branch Name'],
    ['address', 'Address']
  ]);

  constructor(private branchInfoService: BranchInfoService,private bicSelectionService: BicSelectionService) {
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
      this.loadServiceLevelCodes();
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
      // Business Message Header
      charSet: [''],
      fromBicfi: ['', Validators.required],
      fromMembId: [''],
      fromClrSysIdCd: [''],
      fromLei: [''],
      toBicfi: ['', Validators.required],
      toMembId: [''],
      toClrSysIdCd: [''],
      toLei: [''],

      bizMsgIdr: ['PACS008_' + new Date().getTime(), Validators.required],
      msgDefIdr: ['pacs.008.001.08', Validators.required],
      bizSvc: ['swift.cbprplus.02',Validators.required],
      regy: ['',[Validators.maxLength(350),Validators.minLength(1)]],
      mktPrctcId: ['',[Validators.maxLength(2048),Validators.minLength(1)]],
      creDt: [new Date().toISOString(), Validators.required],
      cpyDplct: [null],
      psblDplct: [null],
      priority: ['HIGH'],

      //Related
      rltdFrBicfi: [''],
      rltdFrmClrSysIdCd: [''],
      rltdFrmMembId: ['', [Validators.minLength(1), Validators.maxLength(28)]],
      rltdFrmLei: [''],
      rltdToBicfi: [''],
      rltdToClrSysIdCd: [''],
      rltdToMembId: ['', [Validators.minLength(1), Validators.maxLength(28)]],
      rltdToLei: [''],
      rltdBizMsgIdr: [''],
      rltdMsgDefIdr: [''],
      rltdBizSvc: [''],
      rltdCreDt: [''],
      rltdCpyDplct: [null],
      rltdPriority: [null],

      msgId: 'MSG_' + new Date().getTime(),
      creDtTm: [new Date().toISOString(), Validators.required],
      nbOfTxs: ['1', Validators.required],



      // Settlement Information
      sttlmMtd: [null, Validators.required],
      // Settlement Account (flat)
      sttlmAcctId: [''],
      sttlmAcctCcy: [null],
      sttlmAcctTp: [''],
      sttlmAcctNm: [''],
      sttlmAcctSchmeNm: [''],
      sttlmAcctIssr: [''],

      // Payment Identification
      instrId: ['PACS008_' + new Date().getTime().toString().slice(-8), Validators.required],
      endToEndId: ['', Validators.required],
      txId: ['TX_' + new Date().getTime()],
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
      intrBkSttlmDt: [new Date().toISOString().split('T')[0], Validators.required],
      sttlmPrty: [null],

      //Settlement Time Indication
      dbtDtTm: [''],
      cdtDtTm: [''],

      //Settlement Time Request
      CLSTm: [''],
      tillTm: [''],
      frTm: [''],
      rjctTm: [''],

      instdAmtCcy: [null],
      instdAmtValue: [null],
      chrgBr: [null,Validators.required],
      xchgRate: [null],
      chrgInfoForm: this.formBuilder.array([]),

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
      prvsInstgAgt1ProxyCd: [''],
      prvsInstgAgt1ProxyPrtry: [''],
      prvsInstgAgt1ProxyId: [''],

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
      prvsInstgAgt2ProxyCd: [''],
      prvsInstgAgt2ProxyPrtry: [''],
      prvsInstgAgt2ProxyId: [''],

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
      prvsInstgAgt3ProxyCd: [''],
      prvsInstgAgt3ProxyPrtry: [''],
      prvsInstgAgt3ProxyId: [''],

      // Agents (flat)
      instgAgtBicfi: [''],
      instgAgtClrSysIdCd: [''],
      instgAgtMmbId: [''],
      instgAgtLei: [''],


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
      intrmyAgt1ProxyCd: [''],
      intrmyAgt1ProxyPrtry: [''],
      intrmyAgt1ProxyId: [''],

      // Intermediary Agent 2 (flat)
      intrmyAgt2Bicfi: [''],
      intrmyAgt2ClrSysIdCd: [''],
      intrmyAgt2MmbId: [''],
      intrmyAgt2Lei: [''],
      intrmyAgt2Nm: [''],
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
      intrmyAgt2ProxyCd: [''],
      intrmyAgt2ProxyPrtry: [''],
      intrmyAgt2ProxyId: [''],

      // Intermediary Agent 3 (flat)
      intrmyAgt3Bicfi: [''],
      intrmyAgt3ClrSysIdCd: [''],
      intrmyAgt3MmbId: [''],
      intrmyAgt3Lei: [''],
      intrmyAgt3Nm: [''],
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
      intrmyAgt3ProxyCd: [''],
      intrmyAgt3ProxyPrtry: [''],
      intrmyAgt3ProxyId: [''],

      // Debtor (flat)
      dbtrNm: ['',Validators.required],
      dbtrCtryOfRes: [''],

      //postal address
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
      adrLine1: ['', [Validators.maxLength(70)]],
      adrLine2: ['', [Validators.maxLength(70)]],
      adrLine3: ['', [Validators.maxLength(70)]],
      ctryOfRes: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      Tp: ['Cd'],

      //Identification starts

      //Organisation Identification starts
      anyBIC: [''],
      LEI: [''],
      //Other
      orgIdOthr: this.formBuilder.array([]),
      //Organisation Identification ends


      //PrivateIdentification starts

      //DateAndPlaceOfBirth
      birthDt: [''],
      prvcOfBirth: [''],
      cityOfBirth: [''],
      ctryOfBirth: [''],
      //Other
      PrivtIdenOthr: this.formBuilder.array([]),

      //PrivateIdentification ends

      //Identification ends


      // Debtor Account (flat)
      IBAN:[''],
      dbAccOthrId: ['',Validators.required],
      dbAccOthrScmNm: [''],
      dbOthrIssr: [''],
      dbtrAcctTp: [''],
      dbtrAcctCcy: [''],
      dbtrAcctNm: [''],
      dbtrAcctPrxy: [''],

      // Debtor Agent (flat)
      dbtrAgtBicfi: ['',Validators.required],
      dbtrAgtClrSysIdCd: [''],
      dbtrAgtMmbId: [''],
      dbtrAgtLei: [''],
      dbtrAgtNm: [''],
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
      dbtrAgtAdrLine1: [''],
      dbtrAgtAdrLine2: [''],
      dbtrAgtAdrLine3: [''],
      // Debtor Agent Account (flat)
      dbtrAgAccIBAN: [''],
      dbtrAgtAcctId: [''],
      dbtrAgtAcctCcy: [''],
      dbtrAgtAcctTp: [''],
      dbtrAgtAcctNm: [''],
      dbtrAgtAcctSchmeNm: [''],
      dbtrAgtAcctIssr: [''],


      // Ultimate Debtor
      ultdbtrNm: [''],
      ultdbtrCtryOfRes: [''],

      //postal address
      ultdbtrdept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      ultdbtrsubDept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      ultdbtrstrtNm: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      ultdbtrbldgNb: ['', [Validators.maxLength(16)]],
      ultdbtrbldgNm: ['', [Validators.maxLength(35)]],
      ultdbtrflr: ['', Validators.maxLength(70)],
      ultdbtrpstBx: ['', [Validators.maxLength(16)]],
      ultdbtrroom: ['', [Validators.maxLength(70)]],
      ultdbtrpstCd: ['', [Validators.maxLength(16)]],
      ultdbtrtwnNm: ['', [Validators.maxLength(35)]],
      ultdbtrtwnLctnNm: ['', [Validators.maxLength(35)]],
      ultdbtrdstrctNm: ['', [Validators.maxLength(35)]],
      ultdbtrctrySubDvsn: ['', [Validators.maxLength(35)]],
      ultdbtrctry: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      ultdbtrctryOfRes: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      ultdbtrTp: ['Cd'],

      //Identification starts
      //Organisation Identification starts
      ultanyBIC: [''],
      ultLEI: [''],

      ultorgIdOthr: this.formBuilder.array([]),

      //Private Identification starts
      //DateAndPlaceOfBirth
      ultbirthDt: [''],
      ultprvcOfBirth: [''],
      ultcityOfBirth: [''],
      ultctryOfBirth: [''],

      ultPrivtIdenOthr: this.formBuilder.array([]),

      // Ultimate Debtor ends


      // Creditor Starts
      crdtrNm: ['',Validators.required],
      crdtrCtryOfRes: [''],

      //postal address
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
      crdtrctry: [''],
      crdtradrLine1: [''],
      crdtradrLine2: [''],
      crdtradrLine3: [''],

      //Identification starts

      //Organisation Identification starts
      crdtranyBIC: [''],
      crdtrLEI: [''],
      //Other
      crdtrorgIdOthr: this.formBuilder.array([]),
      //Organisation Identification ends


      //PrivateIdentification starts

      //DateAndPlaceOfBirth
      crdtrbirthDt: [''],
      crdtrprvcOfBirth: [''],
      crdtrcityOfBirth: [''],
      crdtrctryOfBirth: [''],
      //Other
      crdtrPrivtIdenOthr: this.formBuilder.array([]),

      //PrivateIdentification ends

      //Identification ends


      // Creditor Account (flat)
      crdtrIBAN:[''],
      crdtrAccOthrId: [''],
      crdtrAccOthrScmNm: [''],
      crdtrOthrIssr: [''],
      crdtrAcctTp: [''],
      crdtrAcctCcy: [''],
      crdtrAcctNm: [''],
      crdtrAcctPrxy: [''],

      // Creditor Agent (flat)
      crdtrAgtBicfi: ['',Validators.required],
      crdtrAgtLei: [''],
      crdtrAgtNm: [''],
      cdtrAgtNm: [''],
      crdtrAgtClrSysIdCd: [''],
      crdtrAgtMmbId: [''],
      crdtrAgtAdrDept: [''],
      crdtrAgtAdrSubDept: [''],
      crdtrAgtAdrStrtNm: [''],
      crdtrAgtAdrBldgNb: [''],
      crdtrAgtAdrBldgNm: [''],
      crdtrAgtAdrFlr: [''],
      crdtrAgtAdrPstBx: [''],
      crdtrAgtAdrRoom: [''],
      crdtrAgtAdrPstCd: [''],
      crdtrAgtAdrTwnNm: [''],
      crdtrAgtAdrTwnLctnNm: [''],
      crdtrAgtAdrDstrctNm: [''],
      crdtrAgtAdrCtrySubDvsn: [''],
      crdtrAgtAdrCtry: [''],
      crdtrAgtAdrLine1: [''],
      crdtrAgtAdrLine2: [''],
      crdtrAgtAdrLine3: [''],
      // Creditor Agent Account (flat)
      crdtrAgAccIBAN: [''],
      crdtrAgtAcctId: [''],
      crdtrAgtAcctCcy: [''],
      crdtrAgtAcctTp: [''],
      crdtrAgtAcctNm: [''],
      crdtrAgtAcctSchmeNm: [''],
      crdtrAgtAcctIssr: [''],


      // Ultimate Debtor
      ultcrdtrNm: [''],
      ultcrdtrCtryOfRes: [''],

      //postal address
      ultcrdtrdept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      ultcrdtrsubDept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      ultcrdtrstrtNm: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      ultcrdtrbldgNb: ['', [Validators.maxLength(16)]],
      ultcrdtrbldgNm: ['', [Validators.maxLength(35)]],
      ultcrdtrflr: ['', Validators.maxLength(70)],
      ultcrdtrpstBx: ['', [Validators.maxLength(16)]],
      ultcrdtrroom: ['', [Validators.maxLength(70)]],
      ultcrdtrpstCd: ['', [Validators.maxLength(16)]],
      ultcrdtrwnNm: ['', [Validators.maxLength(35)]],
      ultcrdtrtwnLctnNm: ['', [Validators.maxLength(35)]],
      ultcrdtrdstrctNm: ['', [Validators.maxLength(35)]],
      ultcrdtrctrySubDvsn: ['', [Validators.maxLength(35)]],
      ultcrdtrctry: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      ultcrdtrctryOfRes: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      ultcrdtrTp: ['Cd'],

      //Identification starts
      //Organisation Identification starts
      ultcrdtranyBIC: [''],
      ultcrdtrLEI: [''],

      ultcrdtrorgIdOthr: this.formBuilder.array([]),

      //Private Identification starts
      //DateAndPlaceOfBirth
      ultcrdtrbirthDt: [''],
      ultcrdtrprvcOfBirth: [''],
      ultcrdtrcityOfBirth: [''],
      ultcrdtrctryOfBirth: [''],

      ultcrdtrPrivtIdenOthr: this.formBuilder.array([]),

      // Creditor ends


      // Instructions
      instrForCdtrAgtCD1: [''],
      instrForCdtrAgtInf1: [''],
      instrForCdtrAgtCD2: [''],
      instrForCdtrAgtInf2: [''],
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
    });

    // Ensure the form is properly initialized
    if (this.frmGroup) {
      FormGroupSignal.set(this.frmGroup);
      // Initialize with one service level row
      this.addServiceRow();
    }
  }

  generatePayload(): Mx008Model {
    const frm = this.frmGroup.value;
    const payload: any = {};

    // 1. Business Header
    payload.fromBicfi = frm.fromBicfi ;
    payload.toBicfi = frm.toBicfi ;
    payload.bizMsgIdr = frm.bizMsgIdr ;
    payload.msgDefIdr = frm.msgDefIdr ;
    payload.bizSvc = frm.bizSvc ;
    payload.regy = frm.regy ;
    payload.mktPrctcId = frm.mktPrctcId ;
    payload.creDt = frm.creDt ;
    payload.cpyDplct = frm.cpyDplct;
    payload.psblDplct = frm.psblDplct;
    payload.priority = frm.priority ;
    payload.msgId = frm.msgId ;
    payload.creDtTm = frm.creDtTm ;
    payload.nbOfTxs = frm.nbOfTxs ;

    //2. Related
    payload.rltdFrBicfi= frm.rltdFrBicfi ;
    payload.rltdFrmClrSysIdCd= frm.rltdFrmClrSysIdCd ;
    payload.rltdFrmMembId= frm.rltdFrmMembId ;
    payload.rltdFrmLei= frm.rltdFrmLei ;
    payload.rltdToBicfi= frm.rltdToBicfi ;
    payload.rltdToClrSysIdCd= frm.rltdToClrSysIdCd ;
    payload.rltdToMembId= frm.rltdToMembId ;
    payload.rltdToLei= frm.rltdToLei ;
    payload.rltdBizMsgIdr= frm.rltdBizMsgIdr ;
    payload.rltdMsgDefIdr= frm.rltdMsgDefIdr ;
    payload.rltdBizSvc= frm.rltdBizSvc ;
    payload.rltdCreDt= frm.rltdCreDt ;
    payload.rltdCpyDplct= frm.rltdCpyDplct ;
    payload.rltdPriority= frm.rltdPriority ;

    // 3. Settlement Info
    payload.sttlmMtd = frm.sttlmMtd ;
    payload.sttlmAcct = {
      id: frm.sttlmAcct ,
      ccy: frm.sttlmAcct ,
      tp: frm.sttlmAcct ,
      nm: frm.sttlmAcct,
      schmeNm: frm.sttlmAcct,
      issr: frm.sttlmAcct,
    };
    payload.instgAgtBic = frm.instgAgtBicfi,
    payload.instdAgtBic = frm.instdAgtBicfi,

    // 4. Payment Identifiers
    payload.instrId = frm.instrId ;
    payload.endToEndId = frm.endToEndId ;
    payload.txId = frm.txId ;
    payload.uetr = frm.uetr ;
    payload.clrSysRef = frm.clrSysRef ;

    // 5. Payment Type Info
    payload.instrPrty = frm.instrPrty ;
    payload.clrChanl = frm.clrChanl ;
    payload.lclInstrmCD = frm.lclInstrmCD ;
    payload.lclInstrmPrtry = frm.lclInstrmPrtry ;
    payload.ctgyPurpCd = frm.ctgyPurpCd ;
    payload.ctgyPurpPrtry = frm.ctgyPurpPrtry ;
    const serviceLevels = frm.serviceLevels || [];
    const serviceCodes = serviceLevels
      .map((level: any) => level.serviceCode)
      .filter((code: string) => code);
    const servicePriorities = serviceLevels
      .map((level: any) => level.servicePriority)
      .filter((priority: string) => priority);
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

    // 6. Interbank Settlement
    payload.intrBkSttlmAmtCcy = frm.intrBkSttlmAmtCcy ;
    payload.intrBkSttlmAmt = frm.intrBkSttlmAmt != null ? Number(frm.intrBkSttlmAmt) : null;
    payload.intrBkSttlmDt = frm.intrBkSttlmDt ;
    payload.sttlmPrty = frm.sttlmPrty ;

    payload.dbtDtTm = frm.dbtDtTm ;
    payload.cdtDtTm = frm.cdtDtTm ;
    payload.clsTm = frm.CLSTm ;
    payload.tillTm = frm.tillTm ;
    payload.frTm = frm.frTm ;
    payload.rjctTm = frm.rjctTm ;
    payload.instdAmtCcy = frm.instdAmtCcy ;
    payload.instdAmtValue = frm.instdAmtValue ;
    payload.chrgBr = frm.chrgBr ;
    payload.xchgRate = frm.xchgRate ;

    payload.chrgInfoList = frm.chrgInfoForm.map((row: any) => ({
      chrgInfoAmt: row.chrgInfoAmt,
      chrgInfAgtBicfi: row.chrgInfAgtBicfi,
      chrgInfAgtClrSysIdCd: row.chrgInfAgtClrSysIdCd,
      chrgInfoAgtMmbId: row.chrgInfoAgtMmbId,
      chrgInfoAgtLei: row.chrgInfoAgtLei,
      chrgInfoAgtNm: row.chrgInfoAgtNm,
      chrgInfoAgtAdd: {
        chrgInfoAgtDept: row.chrgInfoAgtDept,
        chrgInfoAgtSubDept: row.chrgInfoAgtSubDept,
        chrgInfoAgtStrtNm: row.chrgInfoAgtStrtNm,
        chrgInfoAgtBldgNb: row.chrgInfoAgtBldgNb,
        chrgInfoAgtBldgNm: row.chrgInfoAgtBldgNm,
        chrgInfoAgtFlr: row.chrgInfoAgtFlr,
        chrgInfoAgtPstBx: row.chrgInfoAgtPstBx,
        chrgInfoAgtRoom: row.chrgInfoAgtRoom,
        chrgInfoAgtPstCd: row.chrgInfoAgtPstCd,
        chrgInfoAgtTwnNm: row.chrgInfoAgtTwnNm,
        chrgInfoAgtTwnLctnNm: row.chrgInfoAgtTwnLctnNm,
        chrgInfoAgtDstrctNm: row.chrgInfoAgtDstrctNm,
        chrgInfoAgtCtrySubDvsn: row.chrgInfoAgtCtrySubDvsn,
        chrgInfoAgtCtry: row.chrgInfoAgtCtry,
        chrgInfoAgtAdd: [
          row.chrgInfoAgtAdrLine1,
          row.chrgInfoAgtAdrLine2,
          row.chrgInfoAgtAdrLine3,
        ].filter(Boolean),
      }
    }));

    // 7. Agents & Accounts (Generic Builder)
    const buildParty = (pfx: string) => ({
      bIcfi: frm[`${pfx}Bicfi`] ,
      clrSysIdCd: frm[`${pfx}ClrSysIdCd`] ,
      mmbId: frm[`${pfx}MmbId`] ,
      lei: frm[`${pfx}Lei`] ,
      nm: frm[`${pfx}Nm`] ,
      adr: {
        dept: frm[`${pfx}AdrDept`] ,
        subDept: frm[`${pfx}AdrSubDept`] ,
        strtNm: frm[`${pfx}AdrStrtNm`] ,
        bldgNb: frm[`${pfx}AdrBldgNb`] ,
        bldgNm: frm[`${pfx}AdrBldgNm`] ,
        flr: frm[`${pfx}AdrFlr`] ,
        pstBx: frm[`${pfx}AdrPstBx`] ,
        room: frm[`${pfx}AdrRoom`] ,
        pstCd: frm[`${pfx}AdrPstCd`] ,
        twnNm: frm[`${pfx}AdrTwnNm`] ,
        twnLctnNm: frm[`${pfx}AdrTwnLctnNm`] ,
        dstrctNm: frm[`${pfx}AdrDstrctNm`] ,
        ctrySubDvsn: frm[`${pfx}AdrCtrySubDvsn`] ,
        ctry: frm[`${pfx}AdrCtry`] ,
        adrLine: (frm[`${pfx}AdrLine`] || []).filter((s: string) => s?.trim()),
      }
    });

    const buildAccount = (pfx: string) => ({
      id: frm[`${pfx}AcctId`] ,
      ccy: frm[`${pfx}AcctCcy`] ,
      tp: frm[`${pfx}AcctTp`] ,
      nm: frm[`${pfx}AcctNm`] ,
      schmeNm: frm[`${pfx}AcctSchmeNm`] ,
      issr: frm[`${pfx}AcctIssr`] ,
      prxyCd: frm[`${pfx}ProxyCd`] ,
      prxyPrtry: frm[`${pfx}ProxyPrtry`] ,
      prxyId: frm[`${pfx}ProxyId`] ,
    });

    [
      "prvsInstgAgt1", "prvsInstgAgt2", "prvsInstgAgt3",
      "intrmyAgt1", "intrmyAgt2", "intrmyAgt3"
    ].forEach(pfx => {
      payload[pfx] = buildParty(pfx);
      payload[`${pfx}Acct`] = buildAccount(pfx);
    });

    //instructing agent
    payload.instgAgt = {
      bicfi: frm.instgAgtBicfi,
      clrSysIdCd: frm.instgAgtClrSysIdCd,
      mmbId: frm.instgAgtMmbId,
      lei: frm.instgAgtLei,
    }

    //instructing agent
    payload.instdAgt = {
      bicfi: frm.instdAgtBicfi,
      clrSysIdCd: frm.instdAgtClrSysIdCd,
      mmbId: frm.instdAgtMmbId,
      lei: frm.instdAgtLei,
    }

    // 8. Debtor + Account
    payload.dbtr = {
      nm: frm.dbtrNm ,
      ctryOfRes: frm.dbtrCtryOfRes ,
      address:{
        dept: frm.dept,
        subDept: frm.subDept,
        strtNm: frm.strtNm,
        bldgNb: frm.bldgNb,
        bldgNm: frm.bldgNm,
        flr: frm.flr,
        pstBx: frm.pstBx,
        room: frm.room,
        pstCd: frm.pstCd,
        twnNm: frm.twnNm,
        twnLctnNm: frm.twnLctnNm,
        dstrctNm: frm.dstrctNm,
        ctrySubDvsn: frm.ctrySubDvsn,
        ctry: frm.ctry,
        adrLine: [
          frm.adrLine1,
          frm.adrLine2,
          frm.adrLine3,
        ].filter(Boolean),
      },
      orgIdBic: frm.anyBIC ,
      orgIdLEI: frm.LEI ,
      orgOtherList: (frm.orgIdOthr || []).map((e: any) => ({
        orgIdOthrID: e.orgIdOthrId,
        orgIdOthrScNmCD: e.orgIdOthrScmNm,
        orgIdOthrIssr: e.orgIdOthrIssr,
      })),
      birthDt: frm.birthDt ,
      prvcOfBirth: frm.prvcOfBirth ,
      cityOfBirth: frm.cityOfBirth ,
      ctryOfBirth: frm.ctryOfBirth ,
      prvtOtherList: (frm.PrivtIdenOthr || []).map((e: any) => ({
        prvtOthId: e.privtIdOthrId,
        prvtOthIdSchNmCD: e.privtIdOthrScmNm,
        prvtOthIdIssr: e.privtIdOthrIssr,
      }))
    };

    payload.dbtrAcct = {
      iban: frm.IBAN ,
      id: frm.dbAccOthrId ,
      tpCd: frm.dbtrAcctTp,
      ccy: frm.dbtrAcctCcy ,
      nm: frm.dbtrAcctNm ,
      //schmeNmCd: frm.dbtrAcctSchmeNmCd ,
      //schmeNmPrtry: frm.dbtrAcctSchmeNmPrtry ,
      issr: frm.dbOthrIssr ,
      //prxyId: frm.dbtrAcctPrxyId ,
      //prxyTpCd: frm.dbtrAcctPrxyTpCd ,
      //prxyTpPrtry: frm.dbtrAcctPrxyTpPrtry ,
    };

    payload.dbtrAgt = {
      bicfi: frm.dbtrAgtBicfi ,
      clrSysIdCd: frm.dbtrAgtClrSysIdCd ,
      mmbId: frm.dbtrAgtMmbId ,
      lei: frm.dbtrAgtLei ,
      nm: frm.dbtrAgtNm ,
      adr: {
        dept: frm.dbtrAgtAdrDept ,
        subDept: frm.dbtrAgtAdrSubDept ,
        strtNm: frm.dbtrAgtAdrStrtNm ,
        bldgNb: frm.dbtrAgtAdrBldgNb ,
        bldgNm: frm.dbtrAgtAdrBldgNm ,
        flr: frm.dbtrAgtAdrFlr ,
        pstBx: frm.dbtrAgtAdrPstBx ,
        room: frm.dbtrAgtAdrRoom ,
        pstCd: frm.dbtrAgtAdrPstCd ,
        twnNm: frm.dbtrAgtAdrTwnNm ,
        twnLctnNm: frm.dbtrAgtAdrTwnLctnNm ,
        dstrctNm: frm.dbtrAgtAdrDstrctNm ,
        ctrySubDvsn: frm.dbtrAgtAdrCtrySubDvsn ,
        ctry: frm.dbtrAgtAdrCtry ,
        adrLine: (frm.dbtrAgtAdrLine || []).filter((s: string) => s?.trim()),
      }
    };

    payload.dbtrAgtAcct = {
      id: frm.dbtrAgtAcctId ,
      ccy: frm.dbtrAgtAcctCcy ,
      tp: frm.dbtrAgtAcctTp ,
      nm: frm.dbtrAgtAcctNm ,
      schmeNm: frm.dbtrAgtAcctSchmeNm ,
      issr: frm.dbtrAgtAcctIssr ,
    };

    // 9. Creditor + Account
    payload.cdtr = {
      nm: frm.crdtrNm ,
      ctryOfRes: frm.crdtrCtryOfRes ,
      address: {
        dept: frm.cdtrAdrDept ,
        subDept: frm.cdtrAdrSubDept ,
        strtNm: frm.cdtrAdrStrtNm ,
        bldgNb: frm.cdtrAdrBldgNb ,
        bldgNm: frm.cdtrAdrBldgNm ,
        flr: frm.cdtrAdrFlr ,
        pstBx: frm.cdtrAdrPstBx ,
        room: frm.cdtrAdrRoom ,
        pstCd: frm.cdtrAdrPstCd ,
        twnNm: frm.cdtrAdrTwnNm ,
        twnLctnNm: frm.cdtrAdrTwnLctnNm ,
        dstrctNm: frm.cdtrAdrDstrctNm ,
        ctrySubDvsn: frm.cdtrAdrCtrySubDvsn ,
        ctry: frm.cdtrAdrCtry ,
        adrLine: (frm.cdtrAdrLine || []).filter((s: string) => s?.trim()),
      },
      orgIdBic: frm.crdtranyBIC ,
      orgIdLEI: frm.crdtrLEI ,
      orgOtherList: (frm.crdtrorgIdOthr || []).map((e: any) => ({
        orgIdOthrID: e.crdtrorgIdOthrId,
        orgIdOthrScNmCD: e.crdtrorgIdOthrScmNm,
        orgIdOthrIssr: e.crdtrorgIdOthrIssr,
      })),
      birthDt: frm.crdtrbirthDt ,
      prvcOfBirth: frm.crdtrprvcOfBirth ,
      cityOfBirth: frm.crdtrcityOfBirth ,
      ctryOfBirth: frm.crdtrctryOfBirth ,
      prvtOtherList: (frm.crdtrPrivtIdenOthr || []).map((e: any) => ({
        prvtOthId: e.crdtrprivateIdOthrId,
        prvtOthIdSchNmCD: e.crdtrprivateIdOthrScmNm,
        prvtOthIdIssr: e.crdtrprivateIdOthrIssr,
      }))
    };

    payload.cdtrAcct = {
      iban: frm.crdtrIBAN ,
      id: frm.cdtrAcctId ,
      tpCd: frm.cdtrAcctTp,
      ccy: frm.cdtrAcctCcy ,
      nm: frm.cdtrAcctNm ,
      //schmeNmCd: frm.cdtrAcctSchmeNmCd ,
      //schmeNmPrtry: frm.cdtrAcctSchmeNmPrtry ,
      issr: frm.cdtrAcctIssr ,
      //prxyId: frm.cdtrAcctPrxyId ,
      //prxyTpCd: frm.cdtrAcctPrxyTpCd ,
      //prxyTpPrtry: frm.cdtrAcctPrxyTpPrtry ,
    };

    payload.cdtrAgt = {
      bicfi: frm.crdtrAgtBicfi ,
      clrSysIdCd: frm.cdtrAgtClrSysIdCd ,
      mmbId: frm.cdtrAgtMmbId ,
      lei: frm.cdtrAgtLei ,
      nm: frm.cdtrAgtNm ,
      adr: {
        dept: frm.cdtrAgtAdrDept ,
        subDept: frm.cdtrAgtAdrSubDept ,
        strtNm: frm.cdtrAgtAdrStrtNm ,
        bldgNb: frm.cdtrAgtAdrBldgNb ,
        bldgNm: frm.cdtrAgtAdrBldgNm ,
        flr: frm.cdtrAgtAdrFlr ,
        pstBx: frm.cdtrAgtAdrPstBx ,
        room: frm.cdtrAgtAdrRoom ,
        pstCd: frm.cdtrAgtAdrPstCd ,
        twnNm: frm.cdtrAgtAdrTwnNm ,
        twnLctnNm: frm.cdtrAgtAdrTwnLctnNm ,
        dstrctNm: frm.cdtrAgtAdrDstrctNm ,
        ctrySubDvsn: frm.cdtrAgtAdrCtrySubDvsn ,
        ctry: frm.cdtrAgtAdrCtry ,
        adrLine: (frm.cdtrAgtAdrLine || []).filter((s: string) => s?.trim()),
      },
      //id:"3"
    };

    payload.cdtrAgtAcct = {
      iban: frm.cdtrAgtAcctId ,
      id: frm.cdtrAgtAcctId ,
      ccy: frm.cdtrAgtAcctCcy ,
      tpCd: frm.cdtrAgtAcctTp ,
      nm: frm.cdtrAgtAcctNm ,
      schmeNm: frm.cdtrAgtAcctSchmeNm ,
      //schmeNmCd: frm.cdtrAgtAcctSchmeNm ,
      //schmeNmPrtry: frm.cdtrAgtAcctSchmeNm ,
      issr: frm.cdtrAgtAcctIssr ,
      //prxyId: frm.cdtrAgtAcctIssr ,
      //prxyTpCd: frm.cdtrAgtAcctIssr ,
      //prxyTpPrtry: frm.cdtrAgtAcctIssr ,

    };

    // 10. Ultimate Parties
    payload.ultmtDbtr = {
      nm: frm.ultdbtrNm ,
      ctryOfRes: frm.ultdbtrCtryOfRes ,
      address: {
        dept: frm.ultdbtrdept,
        subDept: frm.ultdbtrsubDept,
        strtNm: frm.ultdbtrstrtNm,
        bldgNb: frm.ultdbtrbldgNb,
        bldgNm: frm.dbtrAdrBldgNm,
        flr: frm.ultdbtrflr,
        pstBx: frm.ultdbtrpstBx,
        room: frm.ultdbtrroom,
        pstCd: frm.ultdbtrpstCd,
        twnNm: frm.ultdbtrtwnNm,
        twnLctnNm: frm.ultdbtrtwnLctnNm,
        dstrctNm: frm.ultdbtrdstrctNm,
        ctrySubDvsn: frm.ultdbtrctrySubDvsn,
        ctry: frm.ultdbtrctry,
        adrLine: [frm.dbtrAdrLine1, frm.dbtrAdrLine2, frm.dbtrAdrLine3].filter(Boolean),
      },
      orgIdBic: frm.ultanyBIC,
      orgIdLEI:frm.ultLEI,
      orgOtherList: (frm.ultorgIdOthr || []).map((e: any) => ({
        orgIdOthrID: e.ultorgIdOthr.ultorgIdOthrId,
        orgIdOthrScNmCD: e.ultorgIdOthr.ultorgIdOthrScmNm,
        orgIdOthrIssr: e.ultorgIdOthr.ultorgIdOthrIssr,
      })),
      birthDt: frm.ultbirthDt,
      prvcOfBirth: frm.ultprvcOfBirth,
      cityOfBirth: frm.ultcityOfBirth,
      ctryOfBirth: frm.ultctryOfBirth,
      prvtOtherList: (frm.ultPrivtIdenOthr || []).map((e: any) => ({
        prvtOthId1: e.ultPrivtIdenOthr.ultprivateIdOthrId,
        prvtOthIdSchNmCD1: e.ultPrivtIdenOthr.ultprivateIdOthrScmNm,
        prvtOthIdIssr1: e.ultPrivtIdenOthr.ultprivateIdOthrIssr,
      }))
    };

    payload.ultmtCdtr = {
      nm: frm.ultcrdtrNm ,
      ctryOfRes: frm.ultcrdtrCtryOfRes ,
      address: {
        dept: frm.ultcrdtrdept,
        subDept: frm.ultcrdtrsubDept,
        strtNm: frm.ultcrdtrstrtNm,
        bldgNb: frm.ultcrdtrbldgNb,
        bldgNm: frm.ultcrdtrbldgNm,
        flr: frm.ultcrdtrflr,
        pstBx: frm.ultcrdtrpstBx,
        room: frm.ultcrdtrroom,
        pstCd: frm.ultcrdtrpstCd,
        twnNm: frm.ultcrdtrtwnNm,
        twnLctnNm: frm.ultcrdtrtwnLctnNm,
        dstrctNm: frm.ultcrdtrdstrctNm,
        ctrySubDvsn: frm.ultcrdtrctrySubDvsn,
        ctry: frm.ultcrdtrctry,
        //adrLine: (frm.ultmtCdtrAdrLine || []).filter((s: string) => s?.trim()),
      },
      orgIdBic: frm.ultcrdtranyBIC ,
      orgIdLEI: frm.ultcrdtrLEI ,
      orgOtherList: (frm.ultcrdtrorgIdOthr || []).map((e: any) => ({
        orgIdOthrID: e.ultcrdtrorgIdOthrId,
        orgIdOthrScNmCD: e.ultcrdtrorgIdOthrScmNm,
        orgIdOthrIssr: e.ultcrdtrorgIdOthrIssr,
      })),
      birthDt: frm.ultcrdtrbirthDt ,
      prvcOfBirth: frm.ultcrdtrprvcOfBirth ,
      cityOfBirth: frm.ultcrdtrcityOfBirth ,
      ctryOfBirth: frm.ultcrdtrctryOfBirth ,
      prvtOtherList: (frm.ultcrdtrPrivtIdenOthr || []).map((e: any) => ({
        prvtOthId: e.ultcrdtrprivateIdOthrId,
        prvtOthIdSchNmCD: e.ultcrdtrprivateIdOthrScmNm,
        prvtOthIdIssr: e.ultcrdtrprivateIdOthrIssr,
      }))
    };

    // 11. Instruction and Purpose
    payload.instrForCdtrAgtCD1 = frm.instrForCdtrAgtCD1;
    payload.instrForCdtrAgtInf1 = frm.instrForCdtrAgtInf;
    payload.instrForCdtrAgtCD2 = frm.instrForCdtrAgtCD2;
    payload.instrForCdtrAgtInf2 = frm.instrForCdtrAgtInf2;
    payload.instrForNxtAgt1 = frm.instrForNxtAgt1;
    payload.instrForNxtAgt2 = frm.instrForNxtAgt2;
    payload.instrForNxtAgt3 = frm.instrForNxtAgt3;
    payload.instrForNxtAgt4 = frm.instrForNxtAgt4;
    payload.instrForNxtAgt5 = frm.instrForNxtAgt5;
    payload.instrForNxtAgt6 = frm.instrForNxtAgt6;

    payload.purpCd = frm.purpCd ;
    payload.purpPrtry = frm.purpPrtry ;

    // 12. Remittance Info
    payload.rmtInfUstrd = (frm.rmtInfUstrd || []).filter((e: string) => e?.trim());
    payload.rmtInfStrd = (frm.rmtInfStrd || []).map((e: any) => ({
      cdtrRefInfTpCd: e.cdtrRefInfTpCd,
      cdtrRefInfTpPrtry: e.cdtrRefInfTpPrtry,
      cdtrRefInfIssr: e.cdtrRefInfIssr,
      cdtrRef: e.cdtrRef,
    }));

    // 13. Authorization


    // 14. Related Parties (nested rltd)
    payload.rltd = {
      rltdRmtInf: (frm.rltdRmtInf || []).map((info: any) => ({
        ustrd: info.ustrd ,
        strd: (info.strd || []).map((s: any) => ({
          cdtrRefInfTpCd: s.cdtrRefInfTpCd,
          cdtrRefInfTpPrtry: s.cdtrRefInfTpPrtry,
          cdtrRefInfIssr: s.cdtrRefInfIssr,
          cdtrRef: s.cdtrRef,
        }))
      })),
      /*rltdDates: {
        accptncDtTm: frm.rltdAccptncDtTm ,
        tradgDt: frm.rltdTradgDt ,
        intrBkSttlmDt: frm.rltdIntrBkSttlmDt ,
      }*/
    };

    return payload as Mx008Model;
  }



  /*generatePayload(): Mx008Model {
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
    }

    payload.chrgBr = frmValue.chrgBr;

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

    payload.instgAgtBic = frmValue.instgAgtBicfi,
    payload.instdAgtBic = frmValue.instdAgtBicfi,

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
      bicfi: frmValue.instdAgtBicfi,
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

    // Debtor
    payload.dbtr = {
      nm: frmValue.dbtrNm,
      ctryOfRes: frmValue.dbtrCtryOfRes,
      address: {
        dept: frmValue.dept,
        subDept: frmValue.subDept,
        strtNm: frmValue.strtNm,
        bldgNb: frmValue.bldgNb,
        bldgNm: frmValue.bldgNm,
        flr: frmValue.flr,
        pstBx: frmValue.pstBx,
        room: frmValue.room,
        pstCd: frmValue.pstCd,
        twnNm: frmValue.twnNm,
        twnLctnNm: frmValue.twnLctnNm,
        dstrctNm: frmValue.dstrctNm,
        ctrySubDvsn: frmValue.ctrySubDvsn,
        ctry: frmValue.ctry,
        adrLine: [frmValue.adrLine1, frmValue.adrLine2, frmValue.adrLine3].filter(Boolean),
      },
      orgIdBic: frmValue.anyBIC,
      orgIdLei:frmValue.LEI,
      orgIdOthrId: frmValue.orgIdOthr?.[0]?.orgIdOthrId || '',
      orgIdOthrScNmCd: frmValue.orgIdOthr?.[0]?.orgIdOthrScmNm || '',
      orgIdOthrIssr: frmValue.orgIdOthr?.[0]?.orgIdOthrIssr || '',
      birthDt: frmValue.birthDt,
      prvcOfBirth: frmValue.prvcOfBirth,
      cityOfBirth: frmValue.cityOfBirth,
      ctryOfBirth: frmValue.ctryOfBirth,
      prvtOthId1: frmValue.PrivtIdenOthr.privtIdOthrId,
      prvtOthIdSchNmCd1: frmValue.PrivtIdenOthr.privtIdOthrScmNm,
      prvtOthIdIssr1: frmValue.PrivtIdenOthr.privtIdOthrIssr,
    };

    // Debtor Account
    payload.dbtrAcct = {
      //no iban
      id: frmValue.dbAccOthrId,
      tp: frmValue.dbtrAcctTp,
      ccy: frmValue.dbtrAcctCcy,
      nm: frmValue.dbtrAcctNm,
      schmeNm: frmValue.dbAccOthrScmNm, //check
      issr: frmValue.dbOthrIssr,
    };

    // Debtor Agent
    payload.dbtrAgt = {
      bicfi: frmValue.dbtrAgtBicfi,
      clrSysIdCd: frmValue.dbtrAgtClrSysIdCd,
      mmbId: frmValue.dbtrAgtMmbId,
      lei: frmValue.dbtrAgtLei,
      nm: frmValue.dbtrAgtNm,
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
        adrLine: [frmValue.dbtrAgtAdrLine1, frmValue.dbtrAgtAdrLine2, frmValue.dbtrAgtAdrLine3].filter(Boolean),
      }
    };

    // Debtor Agent Account
    payload.dbtrAgtAcct = {
      id: frmValue.dbtrAgtAcctId,
      tp: frmValue.dbtrAgtAcctTp,
      ccy: frmValue.dbtrAgtAcctCcy,
      nm: frmValue.dbtrAgtAcctNm,
      schmeNm: frmValue.dbtrAgtAcctSchmeNm, //check
      issr: frmValue.dbtrAgtAcctIssr,
    };

    // Ultimate Debtor
    payload.ultmtDbtr = {
      nm: frmValue.ultdbtrNm,
      ctryOfRes: frmValue.ultdbtrCtryOfRes,
      address: {
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
        adrLine: [frmValue.dbtrAdrLine1, frmValue.dbtrAdrLine2, frmValue.dbtrAdrLine3].filter(Boolean),
      },
      orgIdBic: frmValue.ultanyBIC,
      orgIdLEI:frmValue.ultLEI,
      orgIdOthrID: frmValue.ultorgIdOthr.ultorgIdOthrId,
      orgIdOthrScNmCD: frmValue.ultorgIdOthr.ultorgIdOthrScmNm,
      orgIdOthrIssr: frmValue.ultorgIdOthr.ultorgIdOthrIssr,
      birthDt: frmValue.ultbirthDt,
      prvcOfBirth: frmValue.ultprvcOfBirth,
      cityOfBirth: frmValue.ultcityOfBirth,
      ctryOfBirth: frmValue.ultctryOfBirth,
      prvtOthId1: frmValue.ultPrivtIdenOthr.ultprivateIdOthrId,
      prvtOthIdSchNmCD1: frmValue.ultPrivtIdenOthr.ultprivateIdOthrScmNm,
      prvtOthIdIssr1: frmValue.ultPrivtIdenOthr.ultprivateIdOthrIssr,

    };

    // Creditor
    payload.cdtr = {
      nm: frmValue.crdtrNm,
      ctryOfRes: frmValue.crdtrCtryOfRes,
      address: {
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
        ctry: frmValue.crdtrctry,
        adrLine: [
          frmValue.cdtrAdrLine1,
          frmValue.cdtrAdrLine2,
          frmValue.cdtrAdrLine3
        ].filter(Boolean),
      },
      orgIdBic: frmValue.crdtranyBIC,
      orgIdLei:frmValue.crdtrLEI,
      orgIdOthrId: frmValue.crdtrorgIdOthr?.[0]?.crdtrorgIdOthrId || '',
      orgIdOthrScNmCd: frmValue.crdtrorgIdOthr?.[0]?.crdtrorgIdOthrScmNm || '',
      orgIdOthrIssr: frmValue.crdtrorgIdOthr?.[0]?.crdtrorgIdOthrIssr || '',
      birthDt: frmValue.crdtrbirthDt,
      prvcOfBirth: frmValue.crdtrprvcOfBirth,
      cityOfBirth: frmValue.crdtrcityOfBirth,
      ctryOfBirth: frmValue.crdtrctryOfBirth,
      prvtOthId1: frmValue.crdtrPrivtIdenOthr.crdtrprivateIdOthrId,
      prvtOthIdSchNmCd1: frmValue.crdtrPrivtIdenOthr.crdtrprivateIdOthrScmNm,
      prvtOthIdIssr1: frmValue.crdtrPrivtIdenOthr.crdtrprivateIdOthrIssr,
    },

    payload.cdtrAcct = {
      //no iban
      id: frmValue.crdtrAccOthrId,
      tp: frmValue.crdtrAcctTp,
      ccy: frmValue.crdtrAcctCcy,
      nm: frmValue.crdtrAcctNm,
      schmeNm: frmValue.crdtrAccOthrScmNm, //check
      issr: frmValue.crdtrOthrIssr,
    };

    // Creditor Agent
    payload.cdtrAgt = {
      bicfi: frmValue.crdtrAgtBicfi,
      clrSysIdCd: frmValue.crdtrAgtClrSysIdCd,
      mmbId: frmValue.crdtrAgtMmbId,
      lei: frmValue.crdtrAgtLei,
      nm: frmValue.crdtrAgtNm,
      adr: {
        dept: frmValue.crdtrAgtAdrDept,
        subDept: frmValue.crdtrAgtAdrSubDept,
        strtNm: frmValue.crdtrAgtAdrStrtNm,
        bldgNb: frmValue.crdtrAgtAdrBldgNb,
        bldgNm: frmValue.crdtrAgtAdrBldgNm,
        flr: frmValue.crdtrAgtAdrFlr,
        pstBx: frmValue.crdtrAgtAdrPstBx,
        room: frmValue.crdtrAgtAdrRoom,
        pstCd: frmValue.crdtrAgtAdrPstCd,
        twnNm: frmValue.crdtrAgtAdrTwnNm,
        twnLctnNm: frmValue.crdtrAgtAdrTwnLctnNm,
        dstrctNm: frmValue.crdtrAgtAdrDstrctNm,
        ctrySubDvsn: frmValue.crdtrAgtAdrCtrySubDvsn,
        ctry: frmValue.crdtrAgtAdrCtry,
        adrLine: [frmValue.crdtrAgtAdrLine1, frmValue.crdtrAgtAdrLine2, frmValue.crdtrAgtAdrLine3].filter(Boolean),
      }
    };

    payload.CdtrAgtAcct = {
      ccy: frmValue.crdtAgtAcctCcy,
      tp: frmValue.crdtAgtAcctTp,
      nm: frmValue.crdtAgtAcctNm,
      prxy: frmValue.crdtrAcctPrxy,
      cdtrAgtAccIden:{
        IBAN: frmValue.crdtAcctIBAN,
        cdtrAgtAccOthr:{
          acctOthrId: frmValue.crdtAgtAcctId,
          acctOthrScmNm: frmValue.crdtAgtAcctSchmeNm,
          acctOthrIssr: frmValue.crdtAgtAcctIssr,
        },
      },
    };
    payload.UltmtCdtr = {
      nm: frmValue.ultCrdtNm,
      ctryOfRes: frmValue.ultCrdtCtryOfRes,
      adr: {
        dept: frmValue.ultCrdtAdrDept,
        subDept: frmValue.ultCrdtAdrSubDept,
        strtNm: frmValue.ultCrdtAdrStrtNm,
        bldgNb: frmValue.ultCrdtAdrBldgNb,
        bldgNm: frmValue.ultCrdtAdrBldgNm,
        flr: frmValue.ultCrdtAdrFlr,
        pstBx: frmValue.ultCrdtAdrPstBx,
        room: frmValue.ultCrdtAdrRoom,
        pstCd: frmValue.ultCrdtAdrPstCd,
        twnNm: frmValue.ultCrdtAdrTwnNm,
        twnLctnNm: frmValue.ultCrdtAdrTwnLctnNm,
        dstrctNm: frmValue.ultCrdtAdrDstrctNm,
        ctrySubDvsn: frmValue.ultCrdtAdrCtrySubDvsn,
        ctry: frmValue.ultCrdtAdrCtry,
        adrLine: [
          frmValue.ultCrdtAdrLine1,
          frmValue.ultCrdtAdrLine2,
          frmValue.ultCrdtAdrLine3
        ].filter(Boolean),
      },
      identification:{
        orgIden: {
          anyBIC: frmValue.ultCrdtAnyBIC,
          LEI:frmValue.ultCrdtLEI,
          orgIdOthr: (frmValue.ultcrdtrorgIdOthr || []).map((entry: any) => ({
            ultcrdtrorgIdOthrId: entry.ultcrdtrorgIdOthrId,
            ultcrdtrorgIdOthrScmNm: entry.ultcrdtrorgIdOthrScmNm,
            ultcrdtrorgIdOthrIssr: entry.ultcrdtrorgIdOthrIssr,
          })),
        },
        privateIden: {
          birthDt: frmValue.ultCrdtBirthDt,
          prvcOfBirth: frmValue.ultCrdtPrvcOfBirth,
          cityOfBirth: frmValue.ultCrdtCityOfBirth,
          ctryOfBirth: frmValue.ultCrdtCtryOfBirth,
          privtIdenOthr: (frmValue.ultCrdtPrivtIdenOthr || []).map((entry: any) => ({
            ultcrdtrprivateIdOthrId: entry.ultcrdtrprivateIdOthrId,
            ultcrdtrprivateIdOthrScmNm: entry.ultcrdtrprivateIdOthrScmNm,
            ultcrdtrprivateIdOthrIssr: entry.ultcrdtrprivateIdOthrIssr,
          }))
        }
      },
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

    return payload as Mx008Model;
  }*/

  openBicSelectionModal(ctrlNm :string, nameField:string|null = null) :void{
    const val = {
      bicField : ctrlNm,
      defaultValue : 'SCBLBDDX',
    };

    this.bicSelectionService.openBicSelectionModal(
      this.frmGroup,
      val).subscribe(selectedData => {
      if (selectedData) {
        const { swiftCode, branchName } = selectedData;
        this.frmGroup.patchValue({[ctrlNm]: swiftCode});
        if(nameField!=null){
          this.frmGroup.patchValue({[nameField]: branchName});
        }
        if(ctrlNm==='fromBicfi' ){
          this.frmGroup.patchValue({'instgAgtBicfi': swiftCode});
          this.frmGroup.patchValue({'instgAgtNm': branchName});
        }
        if(ctrlNm==='toBicfi' ){
          this.frmGroup.patchValue({'instdAgtBicfi': swiftCode});
          this.frmGroup.patchValue({'instdAgtNm': branchName});
        }
        if(ctrlNm==='rltdFrBicfi' ){
          this.frmGroup.patchValue({'rltdFrBicfi': swiftCode});
        }
        if(ctrlNm==='rltdToBicfi' ){
          this.frmGroup.patchValue({'rltdToBicfi': swiftCode});
        }
        if(ctrlNm==='prvsInstgAgt1Bicfi' ){
          this.frmGroup.patchValue({'prvsInstgAgt1Bicfi': swiftCode});
          this.frmGroup.patchValue({'prvsInstgAgt1Nm': branchName});
        }
        if(ctrlNm==='prvsInstgAgt2Bicfi' ){
          this.frmGroup.patchValue({'prvsInstgAgt2Bicfi': swiftCode});
          this.frmGroup.patchValue({'prvsInstgAgt2Nm': branchName});
        }
        if(ctrlNm==='prvsInstgAgt3Bicfi' ){
          this.frmGroup.patchValue({'prvsInstgAgt3Bicfi': swiftCode});
          this.frmGroup.patchValue({'prvsInstgAgt3Nm': branchName});
        }
        if(ctrlNm==='instgAgtBicfi' ){
          this.frmGroup.patchValue({'instgAgtBicfi': swiftCode});
          this.frmGroup.patchValue({'instgAgtNm': branchName});
        }
        if(ctrlNm==='instdAgtBicfi' ){
          this.frmGroup.patchValue({'instdAgtBicfi': swiftCode});
          this.frmGroup.patchValue({'instdAgtNm': branchName});
        }
        if(ctrlNm==='intrmyAgt1Bicfi' ){
          this.frmGroup.patchValue({'intrmyAgt1Bicfi': swiftCode});
          this.frmGroup.patchValue({'intrmyAgt1Nm': branchName});
        }
        if(ctrlNm==='intrmyAgt2Bicfi' ){
          this.frmGroup.patchValue({'intrmyAgt2Bicfi': swiftCode});
          this.frmGroup.patchValue({'intrmyAgt2Nm': branchName});
        }
        if(ctrlNm==='intrmyAgt3Bicfi' ){
          this.frmGroup.patchValue({'intrmyAgt3Bicfi': swiftCode});
          this.frmGroup.patchValue({'intrmyAgt3Nm': branchName});
        }
        if(ctrlNm==='anyBIC' ){
          this.frmGroup.patchValue({'anyBIC': swiftCode});
        }
        if(ctrlNm==='dbtrAgtBicfi' ){
          this.frmGroup.patchValue({'dbtrAgtBicfi': swiftCode});
          this.frmGroup.patchValue({'dbtrAgtNm': branchName});
        }
        if(ctrlNm==='ultanyBIC' ){
          this.frmGroup.patchValue({'ultanyBIC': swiftCode});
        }
        if(ctrlNm==='crdtranyBIC' ){
          this.frmGroup.patchValue({'crdtranyBIC': swiftCode});
        }

        if(ctrlNm==='crdtrAgtBicfi' ){
          this.frmGroup.patchValue({'crdtrAgtBicfi': swiftCode});
          this.frmGroup.patchValue({'cdtrAgtNm': branchName});
        }
        if(ctrlNm==='ultcrdtranyBIC' ){
          this.frmGroup.patchValue({'ultcrdtranyBIC': swiftCode});
        }
      }
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

  private loadServiceLevelCodes(): void {
    const codeSet = 'ExternalServiceLevel1Code';
    this.externalCodeService.getSwiftExternalCodes(codeSet).subscribe({
      next: (res) => {
        const list = Array.isArray(res?.payload) ? res.payload : [];
        this.serviceLevelCodeOptions = list.map((item: any) => ({
          key: item.codeValue,
          value: item.codeName ? `${item.codeValue} - ${item.codeName}` : item.codeValue,
        }));
      },
      error: (err) => {
        console.error('Failed to load service level codes', err);
        this.toastr.error('Failed to load service level codes', 'Error');
        this.serviceLevelCodeOptions = [];
      }
    });
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
      serviceCode: [null],
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

  // Add ChrgInfo row
  addChrgInfoRow() {
    const serviceGroup = this.formBuilder.group({
      chrgInfoAmt: '',
      chrgInfAgtBicfi: '',
      chrgInfAgtClrSysIdCd: '',
      chrgInfoAgtMmbId: '',
      chrgInfoAgtLei: '',
      chrgInfoAgtNm: '',
      chrgInfoAgtDept: '',
      chrgInfoAgtSubDept: '',
      chrgInfoAgtStrtNm: '',
      chrgInfoAgtBldgNb: '',
      chrgInfoAgtBldgNm: '',
      chrgInfoAgtFlr: '',
      chrgInfoAgtPstBx: '',
      chrgInfoAgtRoom: '',
      chrgInfoAgtPstCd: '',
      chrgInfoAgtTwnNm: '',
      chrgInfoAgtTwnLctnNm: '',
      chrgInfoAgtDstrctNm: '',
      chrgInfoAgtCtrySubDvsn: '',
      chrgInfoAgtCtry: '',
      chrgInfoAgtAdrLine1: '',
      chrgInfoAgtAdrLine2: '',
      chrgInfoAgtAdrLine3: '',
    });
    this.chrgInfoForm.push(serviceGroup);
  }

  get chrgInfoForm() {
    return this.frmGroup.get('chrgInfoForm') as FormArray;
  }

  // Remove ChrgInfo row
  removeChrgInfoRow(index: number) {
    this.chrgInfoForm.removeAt(index);
  }

  // Get ChrgInfo group at specific index
  getChrgInfoFormGroup(index: number): FormGroup {
    return this.chrgInfoForm.at(index) as FormGroup;
  }


  get orgIdenOthrGetter() {
    return this.frmGroup.get('orgIdOthr') as FormArray;
  }

  getOrgIdenOthr(index: number): FormGroup {
    return this.orgIdenOthrGetter.at(index) as FormGroup;
  }

  addOrgIdenOthrRow() {
    if (this.orgIdenOthrGetter.length < 2) { // Max 6 as per spec
      const OrgIdenOthr = this.formBuilder.group({
        orgIdOthrId: ['',Validators.required],
        orgIdOthrScmNm: [''],
        orgIdOthrIssr: [''],
      });
      this.orgIdenOthrGetter.push(OrgIdenOthr);
    } else {
      this.toastr.warning('Maximum 2 is allowed', 'Limit Reached');
    }

  }

  // Remove service level row
  removeOrgIdenOthrRow(index: number) {
    this.orgIdenOthrGetter.removeAt(index);
  }


  get privateIdenOthrGetter() {
    return this.frmGroup.get('PrivtIdenOthr') as FormArray;
  }

  getPrivateIdenOthr(index: number): FormGroup {
    return this.privateIdenOthrGetter.at(index) as FormGroup;
  }

  addPrivateIdenOthrRow() {
    if (this.privateIdenOthrGetter.length < 2) { // Max 6 as per spec
      const PrivtIdenOther = this.formBuilder.group({
        privtIdOthrId: [''],
        privtIdOthrScmNm: [''],
        privtIdOthrIssr: [''],
      });
      this.privateIdenOthrGetter.push(PrivtIdenOther);
    } else {
      this.toastr.warning('Maximum 2 is allowed', 'Limit Reached');
    }
  }

  // Remove service level row
  removePrivateIdenOthrRow(index: number) {
    this.privateIdenOthrGetter.removeAt(index);
  }

  get ultorgIdenOthrGetter() {
    return this.frmGroup.get('ultorgIdOthr') as FormArray;
  }

  // Get service level group at specific index
  getultOrgIdenOthr(index: number): FormGroup {
    return this.ultorgIdenOthrGetter.at(index) as FormGroup;
  }

  // Add service level row
  addultOrgIdenOthrRow() {
    const serviceGroup = this.formBuilder.group({
      ultorgIdOthrId: [''],
      ultorgIdOthrScmNm: [''],
      ultorgIdOthrIssr: [''],
    });
    this.ultorgIdenOthrGetter.push(serviceGroup);
  }

  // Remove service level row
  removeultOrgIdenOthrRow(index: number) {
    this.ultorgIdenOthrGetter.removeAt(index);
  }

  get ultprivateIdenOthrGetter() {
    return this.frmGroup.get('ultPrivtIdenOthr') as FormArray;
  }

  getultPrivateIdenOthr(index: number): FormGroup {
    return this.ultprivateIdenOthrGetter.at(index) as FormGroup;
  }

  ultaddPrivateIdenOthrRow() {
    const ultPrivtIdenOther = this.formBuilder.group({
      ultprivateIdOthrId: [''],
      ultprivateIdOthrScmNm: [''],
      ultprivateIdOthrIssr: [''],
    });
    this.ultprivateIdenOthrGetter.push(ultPrivtIdenOther);
  }

  // Remove service level row
  removeultPrivateIdenOthrRow(index: number) {
    this.ultprivateIdenOthrGetter.removeAt(index);
  }

  //Creditor
  get crdtrorgIdenOthrGetter() {
    return this.frmGroup.get('crdtrorgIdOthr') as FormArray;
  }

  getcrdtrOrgIdenOthr(index: number): FormGroup {
    return this.crdtrorgIdenOthrGetter.at(index) as FormGroup;
  }

  addcrdtrOrgIdenOthrRow() {
    if (this.crdtrorgIdenOthrGetter.length < 2) { // Max 6 as per spec
      const OrgIdenOthr = this.formBuilder.group({
        crdtrorgIdOthrId: [''],
        crdtrorgIdOthrScmNm: [''],
        crdtrorgIdOthrIssr: [''],
      });
      this.crdtrorgIdenOthrGetter.push(OrgIdenOthr);
    } else {
      this.toastr.warning('Maximum 2 is allowed', 'Limit Reached');
    }

  }

  // Remove service level row
  removecrdtrOrgIdenOthrRow(index: number) {
    this.crdtrorgIdenOthrGetter.removeAt(index);
  }


  get crdtrprivateIdenOthrGetter() {
    return this.frmGroup.get('crdtrPrivtIdenOthr') as FormArray;
  }

  getcrdtrPrivateIdenOthr(index: number): FormGroup {
    return this.crdtrprivateIdenOthrGetter.at(index) as FormGroup;
  }

  addcrdtrPrivateIdenOthrRow() {
    if (this.crdtrprivateIdenOthrGetter.length < 2) { // Max 6 as per spec
      const crdtrPrivtIdenOthr = this.formBuilder.group({
        crdtrprivateIdOthrId: [''],
        crdtrprivateIdOthrScmNm: [''],
        crdtrprivateIdOthrIssr: [''],
      });
      this.crdtrprivateIdenOthrGetter.push(crdtrPrivtIdenOthr);
    } else {
      this.toastr.warning('Maximum 2 is allowed', 'Limit Reached');
    }
  }

  // Remove service level row
  removecrdtrPrivateIdenOthrRow(index: number) {
    this.crdtrprivateIdenOthrGetter.removeAt(index);
  }

  get ultcrdtrorgIdenOthrGetter() {
    return this.frmGroup.get('ultcrdtrorgIdOthr') as FormArray;
  }

  // Get service level group at specific index
  getultcrdtrOrgIdenOthr(index: number): FormGroup {
    return this.ultcrdtrorgIdenOthrGetter.at(index) as FormGroup;
  }

  // Add service level row
  addultcrdtrOrgIdenOthrRow() {
    const serviceGroup = this.formBuilder.group({
      ultcrdtrorgIdOthrId: [''],
      ultcrdtrorgIdOthrScmNm: [''],
      ultcrdtrorgIdOthrIssr: [''],
    });
    this.ultcrdtrorgIdenOthrGetter.push(serviceGroup);
  }

  // Remove service level row
  removeultcrdtrOrgIdenOthrRow(index: number) {
    this.ultcrdtrorgIdenOthrGetter.removeAt(index);
  }

  get ultcrdtrprivateIdenOthrGetter() {
    return this.frmGroup.get('ultcrdtrPrivtIdenOthr') as FormArray;
  }

  getultcrdtrPrivateIdenOthr(index: number): FormGroup {
    return this.ultcrdtrprivateIdenOthrGetter.at(index) as FormGroup;
  }

  ultcrdtraddPrivateIdenOthrRow() {
    const ultcrdtrPrivtIdenOthr = this.formBuilder.group({
      ultcrdtrprivateIdOthrId: [''],
      ultcrdtrprivateIdOthrScmNm: [''],
      ultcrdtrprivateIdOthrIssr: [''],
    });
    this.ultcrdtrprivateIdenOthrGetter.push(ultcrdtrPrivtIdenOthr);
  }

  // Remove service level row
  removeultcrdtrPrivateIdenOthrRow(index: number) {
    this.ultcrdtrprivateIdenOthrGetter.removeAt(index);
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
