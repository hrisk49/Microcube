import {ChangeDetectorRef, Component, effect, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule, ValidationErrors, ValidatorFn,
  Validators
} from "@angular/forms";
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
import {Subject, takeUntil} from 'rxjs';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-pacs-008',
  imports: [
    ReactiveFormsModule,
    TextBaseInput,
    SelectOptionField,
    DateInput,
    AmountToWordInput,
    ExpansionPanelHeader,
    ExpansionSubPanelHeader,
    JsonPipe,
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
    { key: 'HIGH', value: 'High' },
    { key: 'NORM', value: 'Normal' },
  ];

  duplicateOptions: SelectOptionsModel[] = [
    { key: 'CODU', value: 'Copy Duplicate' },
    { key: 'COPY', value: 'Copy' },
    { key: 'DUPL', value: 'Duplicate' },
  ];

  settlementOptions: SelectOptionsModel[] = [
    { key: 'COVE', value: 'Cover Method' },
    { key: 'INDA', value: 'Instructed Agent' },
    { key: 'INGA', value: 'Instructing Agent' },
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
    { key: 'BOOK', value: 'Book Transfer' },
    { key: 'MPNS', value: 'Mass Payment Net System' },
    { key: 'RTGS', value: 'Real Time Gross Settlement System' },
    { key: 'RTNS', value: 'Real Time Net Settlement System' },
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


  InstructionCdOptions: SelectOptionsModel[] = [
    { key: 'CHQB', value: 'Pay Creditor By Cheque' },
    { key: 'HOLD', value: 'Hold Cash For Creditor' },
    { key: 'PHOB', value: 'Phone Beneficiary' },
    { key: 'TELB', value: 'Telecom' },
  ];

  MthdOptions: SelectOptionsModel[] = [
    { key: 'EDIC', value: 'Electronic Data Interchange' },
    { key: 'EMAL', value: 'EMail' },
    { key: 'FAX', value: 'Fax' },
    { key: 'POST', value: 'Post' },
    { key: 'SMSM', value: 'Sms' },
    { key: 'URID', value: 'UniformResourceIdentifier' },
  ];

  RptgTpOptions: SelectOptionsModel[] = [
    { key: 'BOTH', value: 'Both' },
    { key: 'CRED', value: 'Credit' },
    { key: 'DEBIT', value: 'Debit' },
  ];

  serviceLevelCodeOptions: SelectOptionsModel[] = [];
  prxyCdOptions: SelectOptionsModel[] = [];

  private loadProxyCodeOptions(): void {
    this.externalCodeService.getSwiftExternalCodes('ExternalProxyAccountType1Code').pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        if (response.payload && response.payload.length > 0) {
          this.prxyCdOptions = response.payload.map((item: any) => ({
            key: item.codeValue,
            value: item.codeName ? `${item.codeValue} - ${item.codeName}` : item.codeValue,
          }));
        }
      },
      error: (err) => {
        console.error('Failed to load reimbursement agent proxy code options', err);
        this.toastr.error('Failed to load reimbursement agent proxy code options', 'Error');
        // Fallback to default options if API fails
        this.prxyCdOptions = [
          { key: 'BANK', value: 'Bank' },
          { key: 'CUST', value: 'Customer' },
          { key: 'EMPL', value: 'Employee' },
        ];
      }
    });
  }

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
  settlementAccPanel: WritableSignal<boolean> = signal(false);
  financialInstitutionCreditTransferPanel: WritableSignal<boolean> =
    signal(true);
  paymentIdPanel: WritableSignal<boolean> = signal(true);
  paymentTypePanel: WritableSignal<boolean> = signal(false);
  serviceLevelPanel: WritableSignal<boolean> = signal(true);
  interbankPanel: WritableSignal<boolean> = signal(true);
  sttlmTmIndctnPanel: WritableSignal<boolean> = signal(false);
  sttmlTmRqstPanel: WritableSignal<boolean> = signal(false);
  InstgRmbrsmntAgtPanel: WritableSignal<boolean> = signal(false);
  instgRmbrsmntgAgtAddPanel: WritableSignal<boolean> = signal(false);
  instgRmbrsmntgAgtAccPanel: WritableSignal<boolean> = signal(false);
  InstdRmbrsmntAgtPanel: WritableSignal<boolean> = signal(false);
  instdRmbrsmntAgtAddPanel: WritableSignal<boolean> = signal(false);
  instdRmbrsmntAgtAccPanel: WritableSignal<boolean> = signal(false);
  chargesInformationPanel: WritableSignal<boolean> = signal(true);
  chrgInfAgtPanel: WritableSignal<boolean> = signal(false);
  chrgInfAgtAddPanel: WritableSignal<boolean> = signal(false);
  previousAgentsPanel: WritableSignal<boolean> = signal(true);
  prevAgent1Panel: WritableSignal<boolean> = signal(false);
  prevAgent1AddressPanel:  WritableSignal<boolean> = signal(false);
  prevAgent1AccPanel:  WritableSignal<boolean> = signal(false);
  prevAgent2Panel: WritableSignal<boolean> = signal(false);
  prevAgent2AddressPanel:  WritableSignal<boolean> = signal(false);
  prevAgent2AccPanel:  WritableSignal<boolean> = signal(false);
  prevAgent3Panel: WritableSignal<boolean> = signal(false);
  prevAgent3AddressPanel:  WritableSignal<boolean> = signal(false);
  prevAgent3AccPanel:  WritableSignal<boolean> = signal(false);
  agentsPanel: WritableSignal<boolean> = signal(true);
  instructingAgentPanel: WritableSignal<boolean> = signal(true);
  instructedAgentPanel: WritableSignal<boolean> = signal(true);
  intermediaryAgentsPanel: WritableSignal<boolean> = signal(true);
  intermediary1Panel: WritableSignal<boolean> = signal(false);
  intrmyAgt1AddrPanel: WritableSignal<boolean> = signal(false);
  intrmyAgt1AccPanel: WritableSignal<boolean> = signal(false);
  intrmyAgt2AddrPanel: WritableSignal<boolean> = signal(false);
  intrmyAgt2AccPanel: WritableSignal<boolean> = signal(false);
  intrmyAgt3AddrPanel: WritableSignal<boolean> = signal(false);
  intrmyAgt3AccPanel: WritableSignal<boolean> = signal(false);
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
  //
  initiatingPrtyPanel: WritableSignal<boolean> = signal(false);
  initiatingPrtyAddressPanel: WritableSignal<boolean> = signal(false);
  initiatingPrtyIdenPanel: WritableSignal<boolean> = signal(false);
  initiatingPrtyOrgIden: WritableSignal<boolean> = signal(true);
  initiatingPrtyPrivateIden: WritableSignal<boolean> = signal(true);
  initiatingPrtyOrgIdenOthr: WritableSignal<boolean> = signal(true);
  initiatingPrtyDateNPlaceOfBirth: WritableSignal<boolean> = signal(false);
  initiatingPrtyPrivateIdenOthr: WritableSignal<boolean> = signal(true);
//
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

  instructionsPanel: WritableSignal<boolean> = signal(false);
  instForCrdtrAgtPanel: WritableSignal<boolean> = signal(false);
  instForNxtAgtPanel: WritableSignal<boolean> = signal(false);
  purposePanel: WritableSignal<boolean> = signal(false);
  authorizationPanel: WritableSignal<boolean> = signal(true);
  otherInfoPanel: WritableSignal<boolean> = signal(true);
  relatedInfoPanel: WritableSignal<boolean> = signal(false);
  rltdRemInfoPanel: WritableSignal<boolean> = signal(true);
  rltdRemDtlsPanel: WritableSignal<boolean> = signal(true);
  rltdRemPostAddPanel: WritableSignal<boolean> = signal(false);
  rltdRemAddPanel: WritableSignal<boolean> = signal(false);
  rltdFrmBicPanel: WritableSignal<boolean> = signal(false);
  rltdToBicPanel: WritableSignal<boolean> = signal(false);
  rgltryRptgPanel: WritableSignal<boolean> = signal(false);
  dbtCdtRptgIndPanel: WritableSignal<boolean> = signal(false);
  dtlsPanel: WritableSignal<boolean> = signal(false);
  infoPanel: WritableSignal<boolean> = signal(false);
  authrtyPanel: WritableSignal<boolean> = signal(false);
  swiftCodesFrom: any;
  swiftCodesTo: any;

  // Define column headers for the BIC selection modal
  bicTableHeaders = new Map<string, string>([
    ['swift', 'SWIFT Code'],
    ['branchName', 'Branch Name'],
    ['address', 'Address']
  ]);
  private destroy$ = new Subject<void>();
  constructor(private cdRef: ChangeDetectorRef,private branchInfoService: BranchInfoService,private bicSelectionService: BicSelectionService) {
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
      this.loadProxyCodeOptions();
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
      fromLei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      toBicfi: ['', Validators.required],
      toMembId: [''],
      toClrSysIdCd: [''],
      toLei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],

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
      rltdFrmLei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      rltdToBicfi: [''],
      rltdToClrSysIdCd: [''],
      rltdToMembId: ['', [Validators.minLength(1), Validators.maxLength(28)]],
      rltdToLei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      rltdBizMsgIdr: [''],
      rltdMsgDefIdr: [''],
      rltdBizSvc: [''],
      rltdCreDt: [''],
      rltdCpyDplct: [null],
      rltdPriority: [null],

      msgId: 'MSG' + new Date().getTime(),
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

      // Instructing Reimbursement Agent
      instgRmbrsmntgAgtBicfi: [''],
      instgRmbrsmntgAgtClrSysIdCd: [''],
      instgRmbrsmntgAgtMmbId: [''],
      instgRmbrsmntgAgtLei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      instgRmbrsmntgAgtNm: [''],
      instgRmbrsmntgAgtAdr: this.getPostalAddressGroup('', this.postalAddressValidator()),

      // Instructing Reimbursement Agent Account (flat)
      instgRmbrsmntgAgtAcctId: [''],
      instgRmbrsmntgAgtAcctCcy: [null],
      instgRmbrsmntgAgtAcctTp: [''],
      instgRmbrsmntgAgtAcctNm: [''],
      instgRmbrsmntgAgtAcctSchmeNm: [''],
      instgRmbrsmntgAgtAcctIssr: [''],
      instgRmbrsmntgAgtProxyCd: [''],
      instgRmbrsmntgAgtProxyId: [''],

      // Instructed Reimbursement Agent
      instdRmbrsmntgAgtBicfi: [''],
      instdRmbrsmntgAgtClrSysIdCd: [''],
      instdRmbrsmntgAgtMmbId: [''],
      instdRmbrsmntgAgtLei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      instdRmbrsmntgAgtNm: [''],
      instdRmbrsmntgAgtAdr: this.getPostalAddressGroup('', this.postalAddressValidator()),

      // Instructed Reimbursement Agent Account (flat)
      instdRmbrsmntgAgtAcctId: [''],
      instdRmbrsmntgAgtAcctCcy: [null],
      instdRmbrsmntgAgtAcctTp: [''],
      instdRmbrsmntgAgtAcctNm: [''],
      instdRmbrsmntgAgtAcctSchmeNm: [''],
      instdRmbrsmntgAgtAcctIssr: [''],
      instdRmbrsmntgAgtProxyCd: [''],
      instdRmbrsmntgAgtProxyId: [''],

      // Payment Identification
      instrId: ['PACS008-' + new Date().getTime().toString().slice(-8), Validators.required],
      endToEndId: ['', Validators.required],
      txId: ['TX-' + new Date().getTime()],
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
      prvsInstgAgt1Lei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      prvsInstgAgt1Nm: [''],
      prvsInstgAgt1Adr: this.getPostalAddressGroup('', this.postalAddressValidator()),

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
      prvsInstgAgt2Lei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      prvsInstgAgt2Nm: [''],
      prvsInstgAgt2Adr: this.getPostalAddressGroup('', this.postalAddressValidator()),

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
      prvsInstgAgt3Lei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      prvsInstgAgt3Nm: [''],
      prvsInstgAgt3Adr: this.getPostalAddressGroup('', this.postalAddressValidator()),

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
      instgAgtLei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],


      instdAgtBicfi: [''],
      instdAgtClrSysIdCd: [''],
      instdAgtMmbId: [''],
      instdAgtLei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],


      // Intermediary Agent 1 (flat)
      intrmyAgt1Bicfi: [''],
      intrmyAgt1ClrSysIdCd: [''],
      intrmyAgt1MmbId: [''],
      intrmyAgt1Lei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      intrmyAgt1Nm: [''],
      intrmyAgt1Adr: this.getPostalAddressGroup('', this.postalAddressValidator()),
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
      intrmyAgt2Lei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      intrmyAgt2Nm: [''],
      intrmyAgt2Adr: this.getPostalAddressGroup('', this.postalAddressValidator()),
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
      intrmyAgt3Lei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      intrmyAgt3Nm: [''],
      intrmyAgt3Adr: this.getPostalAddressGroup('', this.postalAddressValidator()),
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
      LEI: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
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
      dbtrAcctProxyCd: [''],
      dbtrAcctProxyPrtry: [''],
      dbtrAcctProxyId: [''],

      // Debtor Agent (flat)
      dbtrAgtBicfi: ['',Validators.required],
      dbtrAgtClrSysIdCd: [''],
      dbtrAgtMmbId: [''],
      dbtrAgtLei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
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
      dbtrAgtAcctProxyCd: [''],
      dbtrAgtAcctProxyPrtry: [''],
      dbtrAgtAcctProxyId: [''],


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
      ultLEI: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],

      ultorgIdOthr: this.formBuilder.array([]),

      //Private Identification starts
      //DateAndPlaceOfBirth
      ultbirthDt: [''],
      ultprvcOfBirth: [''],
      ultcityOfBirth: [''],
      ultctryOfBirth: [''],

      ultPrivtIdenOthr: this.formBuilder.array([]),

      // Ultimate Debtor ends

      // Initiating Party
      initiatingPrtyNm: [''],
      initiatingPrtyCtryOfRes: [''],

// Postal address
      initiatingPrtydept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      initiatingPrtysubDept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      initiatingPrtystrtNm: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      initiatingPrtybldgNb: ['', [Validators.maxLength(16)]],
      initiatingPrtybldgNm: ['', [Validators.maxLength(35)]],
      initiatingPrtyflr: ['', Validators.maxLength(70)],
      initiatingPrtypstBx: ['', [Validators.maxLength(16)]],
      initiatingPrtyroom: ['', [Validators.maxLength(70)]],
      initiatingPrtypstCd: ['', [Validators.maxLength(16)]],
      initiatingPrtytwnNm: ['', [Validators.maxLength(35)]],
      initiatingPrtytwnLctnNm: ['', [Validators.maxLength(35)]],
      initiatingPrtydstrctNm: ['', [Validators.maxLength(35)]],
      initiatingPrtyctrySubDvsn: ['', [Validators.maxLength(35)]],
      initiatingPrtyctry: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      initiatingPrtyctryOfRes: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      initiatingPrtyTp: ['Cd'],

// Identification starts
// Organisation Identification starts
      initiatingPrtyanyBIC: [''],
      initiatingPrtyLEI: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],

      iniPrtyOrgIden: this.formBuilder.array([]),

// Private Identification starts
// DateAndPlaceOfBirth
      initiatingPrtybirthDt: [''],
      initiatingPrtyprvcOfBirth: [''],
      initiatingPrtycityOfBirth: [''],
      initiatingPrtyctryOfBirth: [''],
      iniPrtyprivtId: [''],
      iniPrtySchmNm: [''],
      iniPrtyIssr: [''],

      iniPrtyPrvtIdenOthr: this.formBuilder.array([]),


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
      crdtrLEI: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
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
      cdtrAcctPrxyId: [''],
      cdtrAcctPrxyTpCd: [''],
      cdtrAcctPrxyTpPrtry: [''],

      // Creditor Agent (flat)
      crdtrAgtBicfi: ['',Validators.required],
      crdtrAgtLei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
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
      crdtrAgtAcctPrxyId: [''],
      crdtrAgtAcctPrxyTpCd: [''],
      crdtrAgtAcctPrxyTpPrtry: [''],


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
      ultcrdtrLEI: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],

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
      // Instructions
      instructionForCreditorAgent: this.formBuilder.array([]),
      instructionForNextAgent: this.formBuilder.array([]),
      instrForCdtrAgtCD1: [null],
      instrForCdtrAgtInf1: [''],
      instrForCdtrAgtCD2: [null],
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
      rltdRemInfoForm: this.formBuilder.array([]),
      //Regulatory Reporting
      rgltryRptg: this.formBuilder.array([this.createRgltryRptgGroup()]),

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
    }, {
      validators: Validators.compose([
        this.remittanceMutualExclusionValidator(),
        this.agentIdentificationValidator('prvsInstgAgt1', 'prvsInstgAgt1Adr'),
        this.agentIdentificationValidator('prvsInstgAgt2', 'prvsInstgAgt2Adr'),
        this.agentIdentificationValidator('prvsInstgAgt3', 'prvsInstgAgt3Adr'),
        this.agentIdentificationValidator('intrmyAgt1', 'intrmyAgt1Adr'),
        this.agentIdentificationValidator('intrmyAgt2', 'intrmyAgt2Adr'),
        this.agentIdentificationValidator('intrmyAgt3', 'intrmyAgt3Adr'),
        this.agentIdentificationValidator('instgRmbrsmntgAgt', 'instgRmbrsmntgAgtAdr'),
        this.agentIdentificationValidator('instdRmbrsmntgAgt', 'instdRmbrsmntgAgtAdr'),
        this.validateSettlementMethod(),
      ])
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
    payload.charSet = frm.charSet ;
    payload.fromBicfi = frm.fromBicfi ;
    payload.fromMembId = frm.fromMembId ;
    payload.fromLei = frm.fromLei ;
    payload.toBicfi = frm.toBicfi ;
    payload.toMembId = frm.toMembId ;
    payload.toLei = frm.toLei ;
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
      id: frm.sttlmAcctId ,
      ccy: frm.sttlmAcctCcy ,
      tp: frm.sttlmAcct ,
      nm: frm.sttlmAcct,
      schmeNm: frm.sttlmAcct,
      issr: frm.sttlmAcct,
    };
    payload.instgAgtBic = frm.instgAgtBicfi,
      payload.instgAgtClrSysIdCd = frm.instgAgtClrSysIdCd,
      payload.instgAgtMembId = frm.instgAgtMmbId,
      payload.instgAgtLei = frm.instgAgtLei,
      payload.instdAgtBic = frm.instdAgtBicfi,
      payload.instdAgtClrSysIdCd = frm.instdAgtClrSysIdCd,
      payload.instdAgtMembId = frm.instdAgtMmbId,
      payload.instdAgtLei = frm.instdAgtLei,

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

    payload.chrgsInfAgnt = frm.chrgInfoForm.map((row: any) => ({
      chgCcy:row.chrgInfoCcy,
      chgAmt:row.chrgInfoAmt,
      chrgsInfAgnt:{
        bicfi: row.chrgInfAgtBicfi,
        clrSysIdCd: row.chrgInfAgtClrSysIdCd,
        mmbId: row.chrgInfoAgtMmbId,
        lei: row.chrgInfoAgtLei,
        nm: row.chrgInfoAgtNm,
        adr: {
          dept: row.chrgInfoAgtDept,
          subDept: row.chrgInfoAgtSubDept,
          strtNm: row.chrgInfoAgtStrtNm,
          bldgNb: row.chrgInfoAgtBldgNb,
          bldgNm: row.chrgInfoAgtBldgNm,
          flr: row.chrgInfoAgtFlr,
          pstBx: row.chrgInfoAgtPstBx,
          room: row.chrgInfoAgtRoom,
          pstCd: row.chrgInfoAgtPstCd,
          twnNm: row.chrgInfoAgtTwnNm,
          twnLctnNm: row.chrgInfoAgtTwnLctnNm,
          dstrctNm: row.chrgInfoAgtDstrctNm,
          ctrySubDvsn: row.chrgInfoAgtCtrySubDvsn,
          ctry: row.chrgInfoAgtCtry,
          adrLine: [
            row.chrgInfoAgtAdrLine1,
            row.chrgInfoAgtAdrLine2,
            row.chrgInfoAgtAdrLine3,
          ].filter(Boolean),
        }
      }
    }));

    // 7. Agents & Accounts (Generic Builder)
    const buildParty = (pfx: string) => {
      const adrGroup = frm[`${pfx}Adr`] || {}; // This is just an object, not a FormGroup

      return {
        bicfi: frm[`${pfx}Bicfi`],
        clrSysIdCd: frm[`${pfx}ClrSysIdCd`],
        mmbId: frm[`${pfx}MmbId`],
        lei: frm[`${pfx}Lei`],
        nm: frm[`${pfx}Nm`],
        adr: {
          dept: adrGroup['Dept'],
          subDept: adrGroup['SubDept'],
          strtNm: adrGroup['StrtNm'],
          bldgNb: adrGroup['BldgNb'],
          bldgNm: adrGroup['BldgNm'],
          flr: adrGroup['Flr'],
          pstBx: adrGroup['PstBx'],
          room: adrGroup['Room'],
          pstCd: adrGroup['PstCd'],
          twnNm: adrGroup['TwnNm'],
          twnLctnNm: adrGroup['TwnLctnNm'],
          dstrctNm: adrGroup['DstrctNm'],
          ctrySubDvsn: adrGroup['CtrySubDvsn'],
          ctry: adrGroup['Ctry'],
          adrLine: [
            adrGroup['AdrLine1'],
            adrGroup['AdrLine2'],
            adrGroup['AdrLine3'],
          ].filter(Boolean),
        },
      };
    };

    const buildAccount = (pfx: string) => ({
      id: frm[`${pfx}AcctId`] ,
      ccy: frm[`${pfx}AcctCcy`] ,
      tpCd: frm[`${pfx}AcctTp`] ,
      nm: frm[`${pfx}AcctNm`] ,
      schmeNm: frm[`${pfx}AcctSchmeNm`] ,
      issr: frm[`${pfx}AcctIssr`] ,
      prxyCd: frm[`${pfx}ProxyCd`] ,
      prxyPrtry: frm[`${pfx}ProxyPrtry`] ,
      prxyId: frm[`${pfx}ProxyId`] ,
    });

    [
      "prvsInstgAgt1", "prvsInstgAgt2", "prvsInstgAgt3",
      "intrmyAgt1", "intrmyAgt2", "intrmyAgt3",
      "instgRmbrsmntgAgt","instdRmbrsmntgAgt"
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
      schmeNm: frm.dbAccOthrScmNm ,
      issr: frm.dbOthrIssr ,
      prxyId: frm.dbtrAcctProxyId ,
      prxyTpCd: frm.dbtrAcctProxyCd ,
      prxyTpPrtry: frm.dbtrAcctProxyPrtry ,
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
      tpCd: frm.dbtrAgtAcctTp ,
      nm: frm.dbtrAgtAcctNm ,
      schmeNm: frm.dbtrAgtAcctSchmeNm ,
      issr: frm.dbtrAgtAcctIssr ,
      prxyId: frm.dbtrAgtAcctProxyId ,
      prxyTpCd: frm.dbtrAgtAcctProxyCd ,
      prxyTpPrtry: frm.dbtrAgtAcctProxyPrtry ,
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
      id: frm.crdtrAccOthrId ,
      tpCd: frm.crdtrAcctTp,
      ccy: frm.crdtrAcctCcy ,
      nm: frm.crdtrAcctNm ,
      schmeNm: frm.crdtrAccOthrScmNm ,
      issr: frm.crdtrOthrIssr ,
      prxyId: frm.cdtrAcctPrxyId ,
      prxyTpCd: frm.cdtrAcctPrxyTpCd ,
      prxyTpPrtry: frm.cdtrAcctPrxyTpPrtry ,
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
      iban: frm.crdtrAgAccIBAN ,
      id: frm.crdtrAgtAcctId ,
      ccy: frm.crdtrAgtAcctCcy ,
      tpCd: frm.crdtrAgtAcctTp ,
      nm: frm.crdtrAgtAcctNm ,
      schmeNm: frm.crdtrAgtAcctSchmeNm ,
      issr: frm.crdtrAgtAcctIssr ,
      prxyId: frm.crdtrAgtAcctPrxyId ,
      prxyTpCd: frm.crdtrAgtAcctPrxyTpCd ,
      prxyTpPrtry: frm.crdtrAgtAcctPrxyTpPrtry ,

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
        prvtOthId: e.ultPrivtIdenOthr.ultprivateIdOthrId,
        prvtOthIdSchNmCD: e.ultPrivtIdenOthr.ultprivateIdOthrScmNm,
        prvtOthIdIssr: e.ultPrivtIdenOthr.ultprivateIdOthrIssr,
      }))
    };

    //initiating party
    payload.initgPty = {
      nm: frm.initiatingPrtyNm,
      ctryOfRes: frm.initiatingPrtyCtryOfRes,
      address: {
        dept: frm.initiatingPrtydept,
        subDept: frm.initiatingPrtysubDept,
        strtNm: frm.initiatingPrtystrtNm,
        bldgNb: frm.initiatingPrtybldgNb,
        bldgNm: frm.initiatingPrtybldgNm,
        flr: frm.initiatingPrtyflr,
        pstBx: frm.initiatingPrtypstBx,
        room: frm.initiatingPrtyroom,
        pstCd: frm.initiatingPrtypstCd,
        twnNm: frm.initiatingPrtytwnNm,
        twnLctnNm: frm.initiatingPrtytwnLctnNm,
        dstrctNm: frm.initiatingPrtydstrctNm,
        ctrySubDvsn: frm.initiatingPrtyctrySubDvsn,
        ctry: frm.initiatingPrtyctry,
        adrLine: [frm.initiatingPrtyAdrLine1, frm.initiatingPrtyAdrLine2, frm.initiatingPrtyAdrLine3].filter(Boolean),
      },
      orgIdBic: frm.initiatingPrtyanyBIC,
      orgIdLEI: frm.initiatingPrtyLEI,
      orgOtherList: (frm.iniPrtyOrgIden || []).map((e: any) => ({
        orgIdOthrID: e.iniPrtyOrgIdenId,
        orgIdOthrScNmCD: e.iniPrtySchmNm,
        orgIdOthrIssr: e.iniPrtyOrgIdenIssr,
      })),
      birthDt: frm.initiatingPrtybirthDt,
      prvcOfBirth: frm.initiatingPrtyprvcOfBirth,
      cityOfBirth: frm.initiatingPrtycityOfBirth,
      ctryOfBirth: frm.initiatingPrtyctryOfBirth,
      prvtOtherList: (frm.iniPrtyPrvtIdenOthr || []).map((e: any) => ({
        prvtOthId: e.iniPrtyprivtId,
        prvtOthIdSchNmCD: e.iniPrtySchmNm,
        prvtOthIdIssr: e.iniPrtyIssr,
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
    const creditorAgentInstructions = frm.instructionForCreditorAgent || [];
    payload.instrForCdtrAgtCD1 = creditorAgentInstructions[0]?.code || '';
    payload.instrForCdtrAgtInf1 = creditorAgentInstructions[0]?.info || '';
    payload.instrForCdtrAgtCD2 = creditorAgentInstructions[0]?.code || '';
    payload.instrForCdtrAgtInf2 = creditorAgentInstructions[0]?.info || '';

    // Map instruction for next agent FormArray to individual fields as per DTO
    const nextAgentInstructions = frm.instructionForNextAgent || [];
    payload.instrForNxtAgt1 = nextAgentInstructions[0]?.instruction || '';
    payload.instrForNxtAgt2 = nextAgentInstructions[1]?.instruction || '';
    payload.instrForNxtAgt3 = nextAgentInstructions[2]?.instruction || '';
    payload.instrForNxtAgt4 = nextAgentInstructions[3]?.instruction || '';
    payload.instrForNxtAgt5 = nextAgentInstructions[4]?.instruction || '';
    payload.instrForNxtAgt6 = nextAgentInstructions[5]?.instruction || '';

    payload.purpCd = frm.purpCd ;
    payload.purpPrtry = frm.purpPrtry ;
    payload.rmtInf = frm.rmtInf ;


      //Related Remitance Info
    payload.rltdRmtInf = (frm.rltdRemInfoForm || []).map((info: any) => ({
      rmtId: info.rmtId,
      rmtLctnDtls: (info.rltdRemDtlsForm || []).map((s: any) => ({
        mhtd: s.mhtd,
        elctrncAdr: s.elctrncAdr,
        nm: s.nm,
        address: {
          dept: s.dept,
          subDept: s.subDept,
          strtNm: s.strtNm,
          bldgNb: s.bldgNb,
          bldgNm: s.bldgNm,
          flr: s.flr,
          pstBx: s.pstBx,
          room: s.room,
          pstCd: s.pstCd,
          twnNm: s.twnNm,
          twnLctnNm: s.twnLctnNm,
          dstrctNm: s.dstrctNm,
          ctrySubDvsn: s.ctrySubDvsn,
          ctry: s.ctry,
          adrLine: [
            s.adrLine1,
            s.adrLine2,
            s.adrLine3,
          ].filter(Boolean),
        },
      })),
    }));
    //Regulatory Reporting
    payload.rgltryRptg = (frm.rgltryRptg || []).map((info: any) => ({
      dbtCdtRptgInd: info.dbtCdtRptgInd,
      authrtyNm: info.authrtyNm,
      authrtyCtry: info.authrtyCtry,
      dtls: (info.dtlsForm || []).map((s: any) => ({
        dtlsTp: s.dtlsTp,
        dtlsDt: s.dtlsDt,
        dtlsCtry: s.dtlsCtry,
        dtlsCd: s.dtlsCd,
        dtlsCcy: s.dtlsCcy,
        dtlsAmt: s.dtlsAmt,
        inf: (s.inf || []).map((i: any) => i.value).filter((val: string) => !!val),
      }))
    }));
    return payload as Mx008Model;
  }

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
        if(ctrlNm==='chrgInfAgtBicfi' ){
          const chrgInfoFormArray = this.frmGroup.get('chrgInfoForm') as FormArray;
          const firstGroup = chrgInfoFormArray.at(0) as FormGroup;
          console.log(firstGroup);
          firstGroup.patchValue({ chrgInfAgtBicfi: swiftCode });
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
        if(ctrlNm==='instdRmbrsmntgAgtBicfi' ){
          this.frmGroup.patchValue({'instdRmbrsmntgAgtBicfi': swiftCode});
          this.frmGroup.patchValue({'instdRmbrsmntgAgtNm': branchName});
        }
        if(ctrlNm==='instgRmbrsmntgAgtBicfi' ){
          this.frmGroup.patchValue({'instgRmbrsmntgAgtBicfi': swiftCode});
          this.frmGroup.patchValue({'instgRmbrsmntgAgtNm': branchName});
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
    const selectedChargeBearer = this.frmGroup.get('chrgBr')?.value;
    const isRequired = selectedChargeBearer === 'CRED' || selectedChargeBearer === 'SHAR';

    const serviceGroup = this.formBuilder.group({
      chrgInfoCcy: ['', isRequired ? Validators.required : []],
      chrgInfoAmt: ['', isRequired ? Validators.required : []],
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

  //initiating party
  // Get Organisation Identification Other List
  get iniPrtyOrgIdenGetter() {
    return this.frmGroup.get('iniPrtyOrgIden') as FormArray;
  }

  getIniPrtyOrgIden(index: number): FormGroup {
    return this.iniPrtyOrgIdenGetter.at(index) as FormGroup;
  }

  addIniPrtyOrgIdenRow() {
    const serviceGroup = this.formBuilder.group({
      iniPrtyOrgIdenId: [''],
      iniPrtySchmNm: [''],
      iniPrtyOrgIdenIssr: [''],
    });
    this.iniPrtyOrgIdenGetter.push(serviceGroup);
  }

// Remove Organisation Identification Other row
  rmvIniPrtyOrgIdenRow(index: number) {
    this.iniPrtyOrgIdenGetter.removeAt(index);
  }

// Get Private Identification Other List
  get iniPrtyPrvtIdGetter() {
    return this.frmGroup.get('iniPrtyPrvtIdenOthr') as FormArray;
  }

// Get Private Identification Other at specific index
  getIniPrtyPrvtId(index: number): FormGroup {
    return this.iniPrtyPrvtIdGetter.at(index) as FormGroup;
  }

  iniPrtyAddPrivtIdRow() {
    const row = this.formBuilder.group({
      iniPrtyprivtId: [''],
      iniPrtySchmNm: [''],
      iniPrtyIssr: [''],
    });
    this.iniPrtyPrvtIdGetter.push(row);
  }

// Remove Private Identification Other row
  rmvIniPrtPrivtIden(index: number) {
    this.iniPrtyPrvtIdGetter.removeAt(index);
  }

  //initiating party

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

  // Instruction for Creditor Agent FormArray getter
  get instructionForCreditorAgent() {
    return this.frmGroup.get('instructionForCreditorAgent') as FormArray;
  }

  // Instruction for Next Agent FormArray getter
  get instructionForNextAgent() {
    return this.frmGroup.get('instructionForNextAgent') as FormArray;
  }

  // Add instruction for creditor agent row
  addInstructionForCreditorAgentRow() {
    if (this.instructionForCreditorAgent.length < 2) { // Max 2 as per spec
      const instructionGroup = this.formBuilder.group({
        code: [''],
        info: [''],
      });
      this.instructionForCreditorAgent.push(instructionGroup);
    } else {
      this.toastr.warning('Maximum 2 instructions for creditor agent allowed', 'Limit Reached');
    }
  }

  // Remove instruction for creditor agent row
  removeInstructionForCreditorAgentRow(index: number) {
    this.instructionForCreditorAgent.removeAt(index);
  }

  // Add instruction for next agent row
  addInstructionForNextAgentRow() {
    if (this.instructionForNextAgent.length < 6) { // Max 6 as per spec
      const instructionGroup = this.formBuilder.group({
        instruction: [''],
      });
      this.instructionForNextAgent.push(instructionGroup);
    } else {
      this.toastr.warning('Maximum 6 instructions for next agent allowed', 'Limit Reached');
    }
  }

  // Remove instruction for next agent row
  removeInstructionForNextAgentRow(index: number) {
    this.instructionForNextAgent.removeAt(index);
  }

  // Get instruction for creditor agent group at specific index
  getInstructionForCreditorAgentGroup(index: number): FormGroup {
    return this.instructionForCreditorAgent.at(index) as FormGroup;
  }

  // Get instruction for next agent group at specific index
  getInstructionForNextAgentGroup(index: number): FormGroup {
    return this.instructionForNextAgent.at(index) as FormGroup;
  }

  //Related Remitance Info
  createRltdRemGroup(): FormGroup {
    return this.formBuilder.group({
      rmtId: [''],
      rltdRemDtlsForm: this.formBuilder.array([
        this.createRltdRemDtlsGroup()
      ]),
    });
  }

  get rltdRemFormGetter(): FormArray<FormGroup> {
    return this.frmGroup.get('rltdRemInfoForm') as FormArray<FormGroup>;
  }


  addRltdRemRow() {
    if (this.rltdRemFormGetter.length < 2) { // Max 6 as per spec
      this.rltdRemFormGetter.push(this.createRltdRemGroup());
    } else {
      this.toastr.warning('Maximum 2 is allowed', 'Limit Reached');
    }

  }

  removeRltdRemRow(index: number) {
    this.rltdRemFormGetter.removeAt(index);
  }

  // details
  createRltdRemDtlsGroup(): FormGroup {
    return this.formBuilder.group({
      mhtd: [''],
      elctrncAdr: [''],
      nm: [''],
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
    });
  }

  getRltdRemDtlsArray(statementIndex: number): FormArray<FormGroup> {
    const array = this.rltdRemFormGetter.at(statementIndex)?.get('rltdRemDtlsForm');
    if (array instanceof FormArray) {
      return array as FormArray<FormGroup>;
    }
    return this.formBuilder.array([]) as unknown as FormArray<FormGroup>; // fallback
  }

  addRltdRemDtlsRow(statementIndex: number): void {
    const dtlsArray = this.getRltdRemDtlsArray(statementIndex);
    if (dtlsArray.length > 3) {
      this.toastr.warning('Maximum 2 is allowed', 'Limit Reached');
      return;
    }
    dtlsArray.push(this.createRltdRemDtlsGroup());
  }

  removeRltdRemDtlsRow(statementIndex: number, dtlsIndex: number): void {
    const array = this.getRltdRemDtlsArray(statementIndex);
    if (array.length > 1) {
      array.removeAt(dtlsIndex);
    } else {
      this.toastr.warning("At least one interest record is required!", 'WARN');
    }
  }

  //Regulatory Reporting
  createRgltryRptgGroup(): FormGroup {
    return this.formBuilder.group({
      dbtCdtRptgInd: [''],
      authrtyNm: [''],
      authrtyCtry: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      dtlsForm: this.formBuilder.array([this.createDbtCdtRptgIndGroup()])
    });
  }

  // Create Debit/Credit Reporting Indicator group
  createDbtCdtRptgIndGroup(): FormGroup {
    return this.formBuilder.group({
      dtlsTp: ['', [Validators.minLength(1), Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?:\(\)\.,'\+\s]+$/)]],
      dtlsDt: [''],
      dtlsCtry: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      dtlsCd: ['', [Validators.minLength(1), Validators.maxLength(10), Validators.pattern(/^[0-9a-zA-Z\/\-\?:\(\)\.,'\+\s]+$/)]],
      dtlsCcy: [null],
      dtlsAmt: [''],
      inf: this.formBuilder.array([this.formBuilder.group({ value: [''] })])
    });
  }




  // Getters for FormArrays/FormGroups
  getRgltryRptgArray(): FormArray {
    return this.frmGroup.get('rgltryRptg') as FormArray;
  }

  getDbtCdtRptgInd(i: number): FormArray {
    return this.getRgltryRptgArray().at(i).get('dtlsForm') as FormArray;
  }

  getInnerGroup(i: number, j: number): FormGroup {
    return this.getDbtCdtRptgInd(i).at(j) as FormGroup;
  }

  getDtlsGroup(innerGroup: FormGroup): FormGroup {
    return innerGroup.get('dtls') as FormGroup;
  }

  getInfoArray(i: number, j: number): FormArray {
    const dtlsGroup = this.getDbtCdtRptgInd(i).at(j) as FormGroup;
    if (!dtlsGroup) return this.formBuilder.array([]);
    const infArray = dtlsGroup.get('inf') as FormArray;
    return infArray || this.formBuilder.array([]);
  }



  // Add/Remove rows
  addRgltryRptgRow() {
    this.getRgltryRptgArray().push(this.createRgltryRptgGroup());
  }

  removeRgltryRptgRow(i: number) {
    this.getRgltryRptgArray().removeAt(i);
  }

  addDbtCdtRptgIndRow(i: number) {
    this.getDbtCdtRptgInd(i).push(this.createDbtCdtRptgIndGroup());
  }

  removeDbtCdtRptgIndRow(i: number, j: number) {
    this.getDbtCdtRptgInd(i).removeAt(j);
  }

  addInfo(i: number, j: number) {
    this.getInfoArray(i, j).push(this.formBuilder.group({ value: [''] }));
  }

  removeInfo(i: number, j: number, k: number) {
    this.getInfoArray(i, j).removeAt(k);
  }

  // Helper cast for template binding
  castToFormGroup(ctrl: AbstractControl): FormGroup {
    return ctrl as FormGroup;
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

    this.pacs008Service.save(payload).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.toastr.success('PACS.008 message saved successfully!', 'Success');
      },
      error: (error) => {
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

  getPostalAddressGroup(prefix: string = '', validator?: ValidatorFn): FormGroup {
    const group = this.formBuilder.group({
      [`${prefix}Dept`]: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      [`${prefix}SubDept`]: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      [`${prefix}StrtNm`]: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      [`${prefix}BldgNb`]: ['', [Validators.maxLength(16)]],
      [`${prefix}BldgNm`]: ['', [Validators.maxLength(35)]],
      [`${prefix}Flr`]: ['', [Validators.maxLength(70)]],
      [`${prefix}PstBx`]: ['', [Validators.maxLength(16)]],
      [`${prefix}Room`]: ['', [Validators.maxLength(70)]],
      [`${prefix}PstCd`]: ['', [Validators.maxLength(16)]],
      [`${prefix}TwnNm`]: ['', [Validators.maxLength(35)]],
      [`${prefix}TwnLctnNm`]: ['', [Validators.maxLength(35)]],
      [`${prefix}DstrctNm`]: ['', [Validators.maxLength(35)]],
      [`${prefix}CtrySubDvsn`]: ['', [Validators.maxLength(35)]],
      [`${prefix}Ctry`]: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      [`${prefix}AdrLine1`]: ['', [Validators.maxLength(70)]],
      [`${prefix}AdrLine2`]: ['', [Validators.maxLength(70)]],
      [`${prefix}AdrLine3`]: ['', [Validators.maxLength(70)]],
    });

    if (validator) {
      group.setValidators(validator);
    }
    return group;
  }

  get instgRmbrsmntgAgtAdrGroup(): FormGroup {
    return this.frmGroup.get('instgRmbrsmntgAgtAdr') as FormGroup;
  }

  get instdRmbrsmntAgtAdrGroup(): FormGroup {
    return this.frmGroup.get('instdRmbrsmntgAgtAdr') as FormGroup;
  }

  get prvsInstgAgt1AdrGroup(): FormGroup {
    return this.frmGroup.get('prvsInstgAgt1Adr') as FormGroup;
  }

  get prvsInstgAgt2AdrGroup(): FormGroup {
    return this.frmGroup.get('prvsInstgAgt2Adr') as FormGroup;
  }

  get prvsInstgAgt3AdrGroup(): FormGroup {
    return this.frmGroup.get('prvsInstgAgt3Adr') as FormGroup;
  }

  get intrmyAgt1AdrGroup(): FormGroup {
    return this.frmGroup.get('intrmyAgt1Adr') as FormGroup;
  }

  get intrmyAgt2AdrGroup(): FormGroup {
    return this.frmGroup.get('intrmyAgt2Adr') as FormGroup;
  }

  get intrmyAgt3AdrGroup(): FormGroup {
    return this.frmGroup.get('intrmyAgt3Adr') as FormGroup;
  }


  //custom validation

  remittanceMutualExclusionValidator(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const rmtInf = group.get('rmtInf')?.value?.trim();
      const rltdRemInfoArray = group.get('rltdRemInfoForm') as any;

      const rmtInfFilled = !!rmtInf;
      const rltdRemFilled = rltdRemInfoArray?.length > 0 &&
        rltdRemInfoArray.controls.some((ctrl: AbstractControl) =>
          !!ctrl.get('rmtId')?.value?.trim()
        );

      // Allow if both are empty
      if (!rmtInfFilled && !rltdRemFilled) return null;

      // Allow if only one is filled
      if (rmtInfFilled && !rltdRemFilled) return null;
      if (!rmtInfFilled && rltdRemFilled) return null;

      // Error if both are filled
      return { bothRemittanceTypesFilled: true };
    };
  }

  isExchangeRateReadonly(): boolean {
    const group = this.frmGroup;

    const instdAmtValue = group.get('instdAmtValue')?.value;
    const instdAmtCcy = group.get('instdAmtCcy')?.value;
    const intrBkSttlmAmtCcy = group.get('intrBkSttlmAmtCcy')?.value;

    const isInstdAmtPresent = instdAmtValue !== null && instdAmtValue !== '' && Number(instdAmtValue) !== 0;
    const isSameCurrency = instdAmtCcy && intrBkSttlmAmtCcy && instdAmtCcy === intrBkSttlmAmtCcy;

    return isInstdAmtPresent && isSameCurrency;
  }

  agentIdentificationValidator(prefix: string, addressKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const g = group as FormGroup;
      const get = (field: string) => g.get(`${prefix}${field}`)?.value?.trim();
      const touched = (field: string) => g.get(`${prefix}${field}`)?.touched || g.get(`${prefix}${field}`)?.dirty;

      const bicfi = get('Bicfi');
      const name = get('Nm');

      const addressGroup = g.get(addressKey) as FormGroup;
      const postalProvided = ['AdrLine1', 'AdrLine2', 'AdrLine3', 'TwnNm', 'Ctry']
        .some(f => addressGroup?.get(f)?.value?.trim());

      const otherTouched = ['ClrSysIdCd', 'MmbId', 'Lei']
        .some(f => touched(f));

      const errors: ValidationErrors = {};

      if (bicfi) {
        if (name || postalProvided) {
          errors['bicfiConflict'] = true;
        }
      } else {
        const validNameAndPostal = !!name && postalProvided;
        if (!validNameAndPostal && otherTouched) {
          // Other fields touched, but missing Name + Postal
          errors['missingNameOrPostalOrBicfi'] = true;
        } else if (!validNameAndPostal && (name || postalProvided)) {
          // Only one of Name or Postal provided
          errors['missingNameOrPostalOrBicfi'] = true;
        }
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  postalAddressValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const g = group as FormGroup;

      const get = (key: string) => g.get(key)?.value?.trim?.();

      const adrLine1 = get('AdrLine1');
      const adrLine2 = get('AdrLine2');
      const adrLine3 = get('AdrLine3');
      const townName = get('TwnNm');
      const country = get('Ctry');

      const otherFields = [
        'Dept', 'SubDept', 'StrtNm', 'BldgNb', 'BldgNm', 'Flr',
        'PstBx', 'Room', 'PstCd', 'TwnLctnNm', 'DstrctNm', 'CtrySubDvsn'
      ].map(get).filter(Boolean);

      const addressLines = [adrLine1, adrLine2, adrLine3].filter(Boolean);
      const hasAddressLines = addressLines.length > 0;

      const errors: ValidationErrors = {};

      if (!hasAddressLines && otherFields.length > 0) {
        if (!townName || !country) {
          errors['missingTownOrCountry'] = true;
        }
      }

      if (hasAddressLines && otherFields.length > 0) {
        if (!townName || !country) {
          errors['missingTownOrCountryWithAddressLine'] = true;
        }
      }

      if (addressLines.length > 2) {
        errors['tooManyAddressLines'] = true;
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  isRequired: boolean = false;
  handleCategorySelection(event: { selectedOption: any; selectedKey: string; selectedValue: string }): void {
    const selectedChargeBearer = event.selectedValue;
    this.isRequired = selectedChargeBearer === 'Creditor' || selectedChargeBearer === 'Shared';
    this.cdRef.detectChanges();
    this.chrgInfoForm.controls.forEach((control: AbstractControl) => {
      const group = control as FormGroup;

      const ccyControl = group.get('chrgInfoCcy');
      const amtControl = group.get('chrgInfoAmt');

      if (this.isRequired) {
        ccyControl?.setValidators([Validators.required]);
        amtControl?.setValidators([Validators.required]);
        this.addChrgInfoRow();
      } else {
        ccyControl?.clearValidators();
        amtControl?.clearValidators();
      }

      ccyControl?.updateValueAndValidity();
      amtControl?.updateValueAndValidity();

      // Optional: mark as touched to trigger UI error display
      ccyControl?.markAsTouched();
      amtControl?.markAsTouched();
    });
  }

  validateSettlementMethod(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const sttlmMtd = group.get('sttlmMtd')?.value;

      const instgRmbrsmntgAgtBic = group.get('instgRmbrsmntgAgtBicfi')?.value;
      const instdRmbrsmntgAgtBic = group.get('instdRmbrsmntgAgtBicfi')?.value;

      const sttlmAcctId = group.get('sttlmAcctId')?.value;
      const sttlmAcctCcy = group.get('sttlmAcctCcy')?.value;
      const sttlmAcctClrSys = group.get('clrSysCd')?.value;

      const errors: ValidationErrors = {};

      // For COVE, any of the reimbursement agents must be present
      if (sttlmMtd === 'COVE') {
        const hasAgent = !!instgRmbrsmntgAgtBic || !!instdRmbrsmntgAgtBic;
        if (!hasAgent) {
          errors['missingReimbursementAgent'] = true;
        }

        //Settlement account and clearing system are NOT allowed for COVE
        if (sttlmAcctId || sttlmAcctCcy || sttlmAcctClrSys) {
          errors['settlementNotAllowedForCOVE'] = true;
        }
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

}
