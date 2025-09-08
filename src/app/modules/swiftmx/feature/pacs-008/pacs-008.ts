import {ChangeDetectorRef, Component, effect, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
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
import {DateInputComponent} from '../../../../shared/components/input-types/date-input.component/date-input.component';

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
  debtorAccPanel: WritableSignal<boolean> = signal(false);
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

  constructor(
    private cdRef: ChangeDetectorRef,
    private branchInfoService: BranchInfoService,
    private bicSelectionService: BicSelectionService
  ) {
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
    this.setupDynamicValidators(this.frmGroup, {
      panel: this.marketPracticePanel,
      controls: ['regy', 'mktPrctcId'],
      validators: [Validators.required]
    });

    this.setupDynamicValidators(this.frmGroup, {
      panel: this.privateIdenOthr, // signal controlling private iden expansion
      controls: [], // no top-level controls in this example
      formArrayControls: [
        {
          arrayName: 'dbtrPrivtIdenOthr',
          fieldNames: ['dbtrPrivateIdOthrId', 'dbtrPrivateIdOthrScmNm'] // or whatever fields are required
        }
      ],
      validators: [Validators.required]
    });

    this.setupDynamicValidators(this.frmGroup, {
      panel: this.orgIdenOthr, // signal controlling org iden expansion
      controls: [],
      formArrayControls: [
        {
          arrayName: 'dbtrOrgIdOthr',
          fieldNames: ['dbtrOrgIdOthrId']
        }
      ],
      validators: [Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('Initial form status:', this.frmGroup.status);
    this.frmGroup.statusChanges.subscribe(status => {
      console.log('Form status changed:', status);
      this.logValidationErrors(this.frmGroup); // logs invalid fields
    });
  }
  logValidationErrors(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.logValidationErrors(control);
      } else if (control && control.invalid) {
        console.warn(`Control "${key}" is invalid.`, control.errors);
      }
    });
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
      creDt: [new Date(), Validators.required],
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
      creDtTm: [new Date(), Validators.required],
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
      instgRmbrsmntgAgt: this.getAgentGroup(this.agentValidator()),

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
      instdRmbrsmntgAgt: this.getAgentGroup(this.agentValidator()),

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
      intrBkSttlmDt: [new Date(), Validators.required],
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
      prvsInstgAgt1: this.getAgentGroup(this.agentValidator()),

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
      prvsInstgAgt2: this.getAgentGroup(this.agentValidator()),

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
      prvsInstgAgt3: this.getAgentGroup(this.agentValidator()),

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
      intrmyAgt1: this.getAgentGroup(this.agentValidator()),

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
      intrmyAgt2: this.getAgentGroup(this.agentValidator()),

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
      intrmyAgt3: this.getAgentGroup(this.agentValidator()),

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
      dbtrNm: [''],
      dbtrCtryOfRes: [''],

      //postal address
      dbtrDept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      dbtrSubDept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      dbtrStrtNm: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      dbtrBldgNb: ['', [Validators.maxLength(16)]],
      dbtrBldgNm: ['', [Validators.maxLength(35)]],
      dbtrFlr: ['', [Validators.maxLength(70)]],
      dbtrPstBx: ['', [Validators.maxLength(16)]],
      dbtrRoom: ['', [Validators.maxLength(70)]],
      dbtrPstCd: ['', [Validators.maxLength(16)]],
      dbtrTwnNm: ['', [Validators.maxLength(35)]],
      dbtrTwnLctnNm: ['', [Validators.maxLength(35)]],
      dbtrDstrctNm: ['', [Validators.maxLength(35)]],
      dbtrCtrySubDvsn: ['', [Validators.maxLength(35)]],
      dbtrCtry: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      dbtrAdrLine1: ['', [Validators.maxLength(70)]],
      dbtrAdrLine2: ['', [Validators.maxLength(70)]],
      dbtrAdrLine3: ['', [Validators.maxLength(70)]],
      dbtrTp: ['Cd'],

      //Identification starts

      //Organisation Identification starts
      dbtrAnyBic: [''],
      dbtrLei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      //Other
      dbtrOrgIdOthr: this.formBuilder.array([]),
      //Organisation Identification ends


      //PrivateIdentification starts

      //DateAndPlaceOfBirth
      dbtrBirthDt: [''],
      dbtrPrvcOfBirth: [''],
      dbtrCityOfBirth: [''],
      dbtrCtryOfBirth: [''],
      //Other
      dbtrPrivtIdenOthr: this.formBuilder.array([]),

      //PrivateIdentification ends

      //Identification ends


      // Debtor Account (flat)
      IBAN:[''],
      dbAccOthrId: [''],
      dbAccOthrScmNm: [''],
      dbOthrIssr: [''],
      dbtrAcctTp: [''],
      dbtrAcctCcy: [''],
      dbtrAcctNm: [''],
      dbtrAcctProxyCd: [''],
      dbtrAcctProxyPrtry: [''],
      dbtrAcctProxyId: [''],

      // Debtor Agent (flat)
      dbtrAgt: this.getAgentGroup(this.agentValidator()),

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
      ultDbtrNm: [''],
      ultDbtrCtryOfRes: [''],

      //postal address
      ultDbtrDept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      ultDbtrSubDept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      ultDbtrStrtNm: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      ultDbtrBldgNb: ['', [Validators.maxLength(16)]],
      ultDbtrBldgNm: ['', [Validators.maxLength(35)]],
      ultDbtrFlr: ['', Validators.maxLength(70)],
      ultDbtrPstBx: ['', [Validators.maxLength(16)]],
      ultDbtrRoom: ['', [Validators.maxLength(70)]],
      ultDbtrPstCd: ['', [Validators.maxLength(16)]],
      ultDbtrTwnNm: ['', [Validators.maxLength(35)]],
      ultDbtrTwnLctnNm: ['', [Validators.maxLength(35)]],
      ultDbtrDstrctNm: ['', [Validators.maxLength(35)]],
      ultDbtrCtrySubDvsn: ['', [Validators.maxLength(35)]],
      ultDbtrCtry: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      ultDbtrAdrLine1: ['', [Validators.maxLength(70)]],
      ultDbtrAdrLine2: ['', [Validators.maxLength(70)]],
      ultDbtrAdrLine3: ['', [Validators.maxLength(70)]],
      ultDbtrTp: ['Cd'],

      //Identification starts
      //Organisation Identification starts
      ultDbtrAnyBic: [''],
      ultDbtrLei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],

      ultDbtrOrgIdOthr: this.formBuilder.array([]),

      //Private Identification starts
      //DateAndPlaceOfBirth
      ultDbtrBirthDt: [''],
      ultDbtrPrvcOfBirth: [''],
      ultDbtrCityOfBirth: [''],
      ultDbtrCtryOfBirth: [''],

      ultDbtrPrivtIdenOthr: this.formBuilder.array([]),

      // Ultimate Debtor ends

// Initiating Party
      initgPrtyNm: [''],
      initgPrtyCtryOfRes: [''],

// Postal address
      initgPrtyDept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      initgPrtysubDept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      initgPrtySubDept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      initgPrtyStrtNm: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      initgPrtyBldgNb: ['', [Validators.maxLength(16)]],
      initgPrtyBldgNm: ['', [Validators.maxLength(35)]],
      initgPrtyFlr: ['', Validators.maxLength(70)],
      initgPrtyPstBx: ['', [Validators.maxLength(16)]],
      initgPrtyRoom: ['', [Validators.maxLength(70)]],
      initgPrtyPstCd: ['', [Validators.maxLength(16)]],
      initgPrtyTwnNm: ['', [Validators.maxLength(35)]],
      initgPrtyTwnLctnNm: ['', [Validators.maxLength(35)]],
      initgPrtyDstrctNm: ['', [Validators.maxLength(35)]],
      initgPrtyCtrySubDvsn: ['', [Validators.maxLength(35)]],
      initgPrtyCtry: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      initgPrtyAdrLine1: ['', [Validators.maxLength(70)]],
      initgPrtyAdrLine2: ['', [Validators.maxLength(70)]],
      initgPrtyAdrLine3: ['', [Validators.maxLength(70)]],
      initgPrtyTp: ['Cd'],

// Identification starts
// Organisation Identification
      initgPrtyAnyBic: [''],
      initgPrtyLei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      initgPrtyOrgIdOthr: this.formBuilder.array([]),

// Private Identification
      initgPrtyBirthDt: [''],
      initgPrtyPrvcOfBirth: [''],
      initgPrtyCityOfBirth: [''],
      initgPrtyCtryOfBirth: [''],
      initgPrtyPrivtId: [''],
      initgPrtySchmNm: [''],
      initgPrtyIssr: [''],
      initgPrtyPrivtIdenOthr: this.formBuilder.array([]),


      // Creditor Starts
      crdtrNm: [''],
      crdtrCtryOfRes: [''],

      //postal address
      cdtrDept: [''],
      cdtrSubDept: [''],
      cdtrStrtNm: [''],
      cdtrBldgNb: [''],
      cdtrBldgNm: [''],
      cdtrFlr: [''],
      cdtrPstBx: [''],
      cdtrRoom: [''],
      cdtrPstCd: [''],
      cdtrTwnNm: [''],
      cdtrTwnLctnNm: [''],
      cdtrDstrctNm: [''],
      cdtrCtrySubDvsn: [''],
      crdtrCtry: [''],
      crdtrAdrLine1: [''],
      crdtrAdrLine2: [''],
      crdtrAdrLine3: [''],

      //Identification starts

      //Organisation Identification starts
      crdtrAnyBic: [''],
      crdtrLei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      //Other
      crdtrOrgIdOthr: this.formBuilder.array([]),
      //Organisation Identification ends


      //PrivateIdentification starts

      //DateAndPlaceOfBirth
      crdtrBirthDt: [''],
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
      crdtrAgt: this.getAgentGroup(this.agentValidator()),

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


      // Ultimate Creditor
      ultCrdtrNm: [''],
      ultCrdtrCtryOfRes: [''],

      //postal address
      ultCrdtrDept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      ultCrdtrSubDept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      ultCrdtrStrtNm: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      ultCrdtrBldgNb: ['', [Validators.maxLength(16)]],
      ultCrdtrBldgNm: ['', [Validators.maxLength(35)]],
      ultCrdtrFlr: ['', Validators.maxLength(70)],
      ultCrdtrPstBx: ['', [Validators.maxLength(16)]],
      ultCrdtrRoom: ['', [Validators.maxLength(70)]],
      ultCrdtrPstCd: ['', [Validators.maxLength(16)]],
      ultCrdtrTwnNm: ['', [Validators.maxLength(35)]],
      ultCrdtrTwnLctnNm: ['', [Validators.maxLength(35)]],
      ultCrdtrDtrctNm: ['', [Validators.maxLength(35)]],
      ultCrdtrCtrySubDvsn: ['', [Validators.maxLength(35)]],
      ultCrdtrCtry: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      ultCrdtrAdrLine1: ['', [Validators.maxLength(70)]],
      ultCrdtrAdrLine2: ['', [Validators.maxLength(70)]],
      ultCrdtrAdrLine3: ['', [Validators.maxLength(70)]],
      ultCrdtrTp: ['Cd'],

      //Identification starts
      //Organisation Identification starts
      ultCrdtrAnyBic: [''],
      ultCrdtrLei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],

      ultCrdtrOrgIdOthr: this.formBuilder.array([]),

      //Private Identification starts
      //DateAndPlaceOfBirth
      ultCrdtrBirthDt: [''],
      ultCrdtrPrvcOfBirth: [''],
      ultCrdtrCityOfBirth: [''],
      ultCrdtrCtryOfBirth: [''],

      ultCrdtrPrivtIdenOthr: this.formBuilder.array([]),

      // Creditor ends


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
        this.validateSettlementMethod(),
        this.partyIdentificationValidator('crdtr', true),
        this.partyIdentificationValidator('dbtr', true),
        this.partyIdentificationValidator('ultDbtr', false),
        this.partyIdentificationValidator('ultCrdtr', false),
        this.partyIdentificationValidator('initgPrty', false)
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
      const group = frm[pfx] || {};

      return {
        bicfi: group['Bicfi'],
        clrSysIdCd: group['ClrSysIdCd'],
        mmbId: group['MmbId'],
        lei: group['Lei'],
        nm: group['Nm'],
        adr: {
          dept: group['Dept'],
          subDept: group['SubDept'],
          strtNm: group['StrtNm'],
          bldgNb: group['BldgNb'],
          bldgNm: group['BldgNm'],
          flr: group['Flr'],
          pstBx: group['PstBx'],
          room: group['Room'],
          pstCd: group['PstCd'],
          twnNm: group['TwnNm'],
          twnLctnNm: group['TwnLctnNm'],
          dstrctNm: group['DstrctNm'],
          ctrySubDvsn: group['CtrySubDvsn'],
          ctry: group['Ctry'],
          adrLine: [
            group['AdrLine1'],
            group['AdrLine2'],
            group['AdrLine3'],
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
      "instgRmbrsmntgAgt","instdRmbrsmntgAgt",
      "dbtrAgt","crdtrAgt"
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

    // 8. Debtor
    const buildPartyDetails = (frm: any, pfx: string) => {
      return {
        nm: frm[`${pfx}Nm`],
        ctryOfRes: frm[`${pfx}CtryOfRes`],
        address: {
          dept: frm[`${pfx}dept`],
          subDept: frm[`${pfx}subDept`],
          strtNm: frm[`${pfx}strtNm`],
          bldgNb: frm[`${pfx}bldgNb`],
          bldgNm: frm[`${pfx}bldgNm`],
          flr: frm[`${pfx}flr`],
          pstBx: frm[`${pfx}pstBx`],
          room: frm[`${pfx}room`],
          pstCd: frm[`${pfx}pstCd`],
          twnNm: frm[`${pfx}twnNm`],
          twnLctnNm: frm[`${pfx}twnLctnNm`],
          dstrctNm: frm[`${pfx}dstrctNm`],
          ctrySubDvsn: frm[`${pfx}ctrySubDvsn`],
          ctry: frm[`${pfx}ctry`],
          adrLine: [
            frm[`${pfx}AdrLine1`],
            frm[`${pfx}AdrLine2`],
            frm[`${pfx}AdrLine3`],
          ].filter(Boolean),
        },
        orgIdBic: frm[`${pfx}AnyBic`],
        orgIdLEI: frm[`${pfx}Lei`],
        orgOtherList: (frm[`${pfx}OrgIdOthr`] || []).map((e: any) => ({
          orgIdOthrID: e[`${pfx}OrgIdOthrId`],
          orgIdOthrScNmCD: e[`${pfx}OrgIdOthrScmNm`],
          orgIdOthrIssr: e[`${pfx}OrgIdOthrIssr`],
        })),
        birthDt: frm[`${pfx}BirthDt`],
        prvcOfBirth: frm[`${pfx}PrvcOfBirth`],
        cityOfBirth: frm[`${pfx}CityOfBirth`],
        ctryOfBirth: frm[`${pfx}CtryOfBirth`],
        prvtOtherList: (frm[`${pfx}PrivtIdenOthr`] || []).map((e: any) => ({
          prvtOthId: e[`${pfx}PrivateIdOthrId`],
          prvtOthIdSchNmCD: e[`${pfx}PrivateIdOthrScmNm`],
          prvtOthIdIssr: e[`${pfx}PrivateIdOthrIssr`],
        })),
      };
    };
    [
      "dbtr",
      "ultDbtr",
      "initgPrty",
      "crdtr",
      "ultmtCrdtr",

    ].forEach(pfx => {
      payload[pfx] = buildPartyDetails(frm, pfx);
    });

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

  openBicSelectionModal(
    grpNm: string,
    ctrlNm: string,
    nameControlName: string
  ): void {
    const val = {
      bicField: ctrlNm,
      defaultValue: 'SCBLBDDX',
    };

    this.bicSelectionService.openBicSelectionModal(this.frmGroup, val).subscribe(selectedData => {
      if (!selectedData) return;

      const { swiftCode, branchName } = selectedData;

      if (grpNm !== '') {
        const group = this.frmGroup.get(grpNm) as FormGroup;
        if (group) {
          group.patchValue({ [ctrlNm]: swiftCode });
          if (nameControlName !== '') {
            group.patchValue({ [nameControlName]: branchName });
          }
        }
      } else {
        this.frmGroup.patchValue({ [ctrlNm]: swiftCode });
        if (nameControlName !== '') {
          this.frmGroup.patchValue({ [nameControlName]: branchName });
        }

        if (ctrlNm === 'fromBicfi') {
          this.frmGroup.patchValue({ instgAgtBicfi: swiftCode });
          this.frmGroup.patchValue({ instgAgtNm: branchName });
        }
        if (ctrlNm === 'toBicfi') {
          this.frmGroup.patchValue({ instdAgtBicfi: swiftCode });
          this.frmGroup.patchValue({ instdAgtNm: branchName });
        }
        if(ctrlNm==='chrgInfAgtBicfi' ){
          const chrgInfoFormArray = this.frmGroup.get('chrgInfoForm') as FormArray;
          const firstGroup = chrgInfoFormArray.at(0) as FormGroup;
          firstGroup.patchValue({ chrgInfAgtBicfi: swiftCode });
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
    return this.frmGroup.get('dbtrOrgIdOthr') as FormArray;
  }

  getOrgIdenOthr(index: number): FormGroup {
    return this.orgIdenOthrGetter.at(index) as FormGroup;
  }

  addOrgIdenOthrRow() {
    if (this.orgIdenOthrGetter.length < 2) { // Max 6 as per spec
      const OrgIdenOthr = this.formBuilder.group({
        dbtrOrgIdOthrId: [''],
        dbtrOrgIdOthrScmNm: [''],
        dbtrOrgIdOthrIssr: [''],
      });
      this.orgIdenOthrGetter.push(OrgIdenOthr);
    } else {
      this.toastr.warning('Maximum 2 is allowed', 'Limit Reached');
    }
    this.frmGroup.updateValueAndValidity();
  }

  // Remove service level row
  removeOrgIdenOthrRow(index: number) {
    this.orgIdenOthrGetter.removeAt(index);
  }


  get privateIdenOthrGetter() {
    return this.frmGroup.get('dbtrPrivtIdenOthr') as FormArray;
  }

  getPrivateIdenOthr(index: number): FormGroup {
    return this.privateIdenOthrGetter.at(index) as FormGroup;
  }

  addPrivateIdenOthrRow() {
    if (this.privateIdenOthrGetter.length < 2) { // Max 6 as per spec
      const PrivtIdenOther = this.formBuilder.group({
        dbtrPrivateIdOthrId: [''],
        dbtrPrivateIdOthrScmNm: [''],
        dbtrPrivateIdOthrIssr: [''],
      });
      this.privateIdenOthrGetter.push(PrivtIdenOther);
    } else {
      this.toastr.warning('Maximum 2 is allowed', 'Limit Reached');
    }
    this.frmGroup.updateValueAndValidity();
  }

  // Remove service level row
  removePrivateIdenOthrRow(index: number) {
    this.privateIdenOthrGetter.removeAt(index);
  }

  get ultorgIdenOthrGetter() {
    return this.frmGroup.get('ultDbtrOrgIdOthr') as FormArray;
  }

  // Get service level group at specific index
  getultOrgIdenOthr(index: number): FormGroup {
    return this.ultorgIdenOthrGetter.at(index) as FormGroup;
  }

  // Add service level row
  addultOrgIdenOthrRow() {
    const serviceGroup = this.formBuilder.group({
      ultDbtrOrgIdOthrId: [''],
      ultDbtrOrgIdOthrScmNm: [''],
      ultDbtrOrgIdOthrIssr: [''],
    });
    this.ultorgIdenOthrGetter.push(serviceGroup);
  }

  // Remove service level row
  removeultOrgIdenOthrRow(index: number) {
    this.ultorgIdenOthrGetter.removeAt(index);
  }

  get ultprivateIdenOthrGetter() {
    return this.frmGroup.get('ultDbtrPrivtIdenOthr') as FormArray;
  }

  getultPrivateIdenOthr(index: number): FormGroup {
    return this.ultprivateIdenOthrGetter.at(index) as FormGroup;
  }

  ultaddPrivateIdenOthrRow() {
    const ultPrivtIdenOther = this.formBuilder.group({
      ultDbtrPrivateIdOthrId: [''],
      ultDbtrPrivateIdOthrScmNm: [''],
      ultDbtrPrivateIdOthrIssr: [''],
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
    return this.frmGroup.get('initgPrtyOrgIdOthr') as FormArray;
  }

  getIniPrtyOrgIden(index: number): FormGroup {
    return this.iniPrtyOrgIdenGetter.at(index) as FormGroup;
  }

  addIniPrtyOrgIdenRow() {
    const serviceGroup = this.formBuilder.group({
      initgPrtyOrgIdOthrId: [''],
      initgPrtyOrgIdOthrScmNm: [''],
      initgPrtyOrgIdOthrIssr: [''],
    });
    this.iniPrtyOrgIdenGetter.push(serviceGroup);
  }

// Remove Organisation Identification Other row
  rmvIniPrtyOrgIdenRow(index: number) {
    this.iniPrtyOrgIdenGetter.removeAt(index);
  }

// Get Private Identification Other List
  get iniPrtyPrvtIdGetter() {
    return this.frmGroup.get('initgPrtyPrivtIdenOthr') as FormArray;
  }

// Get Private Identification Other at specific index
  getIniPrtyPrvtId(index: number): FormGroup {
    return this.iniPrtyPrvtIdGetter.at(index) as FormGroup;
  }

  iniPrtyAddPrivtIdRow() {
    const row = this.formBuilder.group({
      initgPrtyPrivateIdOthrId: [''],
      initgPrtyPrivateIdOthrScmNm: [''],
      initgPrtyPrivateIdOthrIssr: [''],
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
    return this.frmGroup.get('crdtrOrgIdOthr') as FormArray;
  }

  getcrdtrOrgIdenOthr(index: number): FormGroup {
    return this.crdtrorgIdenOthrGetter.at(index) as FormGroup;
  }

  addcrdtrOrgIdenOthrRow() {
    if (this.crdtrorgIdenOthrGetter.length < 2) { // Max 6 as per spec
      const OrgIdenOthr = this.formBuilder.group({
        crdtrOrgIdOthrId: [''],
        crdtrOrgIdOthrScmNm: [''],
        crdtrOrgIdOthrIssr: [''],
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
        crdtrPrivateIdOthrId: [''],
        crdtrPrivateIdOthrScmNm: [''],
        crdtrPrivateIdOthrIssr: [''],
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
    return this.frmGroup.get('ultCrdtrOrgIdOthr') as FormArray;
  }

  // Get service level group at specific index
  getultcrdtrOrgIdenOthr(index: number): FormGroup {
    return this.ultcrdtrorgIdenOthrGetter.at(index) as FormGroup;
  }

  // Add service level row
  addultcrdtrOrgIdenOthrRow() {
    const serviceGroup = this.formBuilder.group({
      ultCrdtrOrgIdOthrId: [''],
      ultCrdtrOrgIdOthrScmNm: [''],
      ultCrdtrOrgIdOthrIssr: [''],
    });
    this.ultcrdtrorgIdenOthrGetter.push(serviceGroup);
  }

  // Remove service level row
  removeultcrdtrOrgIdenOthrRow(index: number) {
    this.ultcrdtrorgIdenOthrGetter.removeAt(index);
  }

  get ultcrdtrprivateIdenOthrGetter() {
    return this.frmGroup.get('ultCrdtrPrivtIdenOthr') as FormArray;
  }

  getultcrdtrPrivateIdenOthr(index: number): FormGroup {
    return this.ultcrdtrprivateIdenOthrGetter.at(index) as FormGroup;
  }

  ultcrdtraddPrivateIdenOthrRow() {
    const ultcrdtrPrivtIdenOthr = this.formBuilder.group({
      ultCrdtrPrivateIdOthrId: [''],
      ultCrdtrPrivateIdOthrScmNm: [''],
      ultCrdtrPrivateIdOthrIssr: [''],
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

  getAgentGroup(validator?: ValidatorFn): FormGroup {
    const group = this.formBuilder.group({
      // Agent Identification Fields
      Bicfi: [''],
      ClrSysIdCd: [''],
      MmbId: [''],
      Lei: ['', [Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      Nm: [''],

      // Postal Address Fields
      Dept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      SubDept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      StrtNm: ['', [Validators.minLength(1), Validators.maxLength(70)]],
      BldgNb: ['', [Validators.maxLength(16)]],
      BldgNm: ['', [Validators.maxLength(35)]],
      Flr: ['', [Validators.maxLength(70)]],
      PstBx: ['', [Validators.maxLength(16)]],
      Room: ['', [Validators.maxLength(70)]],
      PstCd: ['', [Validators.maxLength(16)]],
      TwnNm: ['', [Validators.maxLength(35)]],
      TwnLctnNm: ['', [Validators.maxLength(35)]],
      DstrctNm: ['', [Validators.maxLength(35)]],
      CtrySubDvsn: ['', [Validators.maxLength(35)]],
      Ctry: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      AdrLine1: ['', [Validators.maxLength(70)]],
      AdrLine2: ['', [Validators.maxLength(70)]],
      AdrLine3: ['', [Validators.maxLength(70)]],
    });

    if (validator) {
      group.setValidators(validator);
    }

    return group;
  }

  get instgRmbrsmntgAgtGroup(): FormGroup {
    return this.frmGroup.get('instgRmbrsmntgAgt') as FormGroup;
  }

  get instdRmbrsmntAgtGroup(): FormGroup {
    return this.frmGroup.get('instdRmbrsmntgAgt') as FormGroup;
  }

  get prvsInstgAgt1Group(): FormGroup {
    return this.frmGroup.get('prvsInstgAgt1') as FormGroup;
  }

  get prvsInstgAgt2Group(): FormGroup {
    return this.frmGroup.get('prvsInstgAgt2') as FormGroup;
  }

  get prvsInstgAgt3Group(): FormGroup {
    return this.frmGroup.get('prvsInstgAgt3') as FormGroup;
  }
  get intrmyAgt1Group(): FormGroup {
    return this.frmGroup.get('intrmyAgt1') as FormGroup;
  }

  get intrmyAgt2Group(): FormGroup {
    return this.frmGroup.get('intrmyAgt2') as FormGroup;
  }

  get intrmyAgt3Group(): FormGroup {
    return this.frmGroup.get('intrmyAgt3') as FormGroup;
  }

  get dbtrAgtGroup(): FormGroup {
    return this.frmGroup.get('dbtrAgt') as FormGroup;
  }

  get crdtrAgtGroup(): FormGroup {
    return this.frmGroup.get('crdtrAgt') as FormGroup;
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

    if (!instdAmtValue || !instdAmtCcy || !intrBkSttlmAmtCcy) {
      return false;
    }

    const isInstdAmtPresent = Number(instdAmtValue) !== 0;
    const isSameCurrency = instdAmtCcy === intrBkSttlmAmtCcy;

    return isInstdAmtPresent && isSameCurrency;
  }

  agentValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const g = group as FormGroup;

      const get = (field: string) => g.get(field)?.value?.toString().trim() || '';

      const bicfi = get('Bicfi');
      const name = get('Nm');

      const adrLines = ['AdrLine1', 'AdrLine2', 'AdrLine3'].map(get).filter(v => v.length > 0);
      const townName = get('TwnNm');
      const country = get('Ctry');

      const postalFields = [
        'Dept', 'SubDept', 'StrtNm', 'BldgNb', 'BldgNm', 'Flr', 'PstBx',
        'Room', 'PstCd', 'TwnNm', 'TwnLctnNm', 'DstrctNm', 'CtrySubDvsn', 'Ctry',
        'AdrLine1', 'AdrLine2', 'AdrLine3'
      ];
      console.log(this.frmGroup.get('dbtrAgt')?.errors);
      const addressHasData = postalFields.some(field => get(field).length > 0);

      const errors: ValidationErrors = {};

      // Rule 1: If everything is empty → VALID
      if (!bicfi && !name && !addressHasData) {
        return null;
      }

      // Rule 2: If BICFI present, name & postal must be empty
      if (bicfi) {
        if (name || addressHasData) {
          errors['bicfiConflict'] = true;
        }
      } else {
        // Rule 3: If no BICFI → Name and Postal are mandatory
        if (!name) {
          errors['missingNameOrPostalOrBicfi'] = true;
        }

        if (!addressHasData) {
          errors['missingNameOrPostalOrBicfi'] = true;
        } else {
          // Postal Address-specific validation

          if (adrLines.length > 2) {
            errors['tooManyAddressLines'] = true;
          }

          const otherPostalFieldsUsed = postalFields
            .filter(f => !['AdrLine1', 'AdrLine2', 'AdrLine3'].includes(f))
            .some(f => get(f).length > 0);

          const townAndCountryMissing = !townName || !country;

          // Address Lines present + other postal fields used → town and country required
          if (adrLines.length > 0 && otherPostalFieldsUsed && townAndCountryMissing) {
            errors['missingTownAndCountry'] = true;
          }

          // Address Lines NOT present → town and country required
          if (adrLines.length === 0 && townAndCountryMissing) {
            errors['missingTownAndCountry'] = true;
          }
        }
      }

      return Object.keys(errors).length > 0 ? errors : null;
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

  partyIdentificationValidator(prefix: string, isRequired: boolean) {
    return (form: AbstractControl): ValidationErrors | null => {
      const group = form as FormGroup;

      const field = (suffix: string) => group.get(`${prefix}${suffix}`);
      const fieldValue = (suffix: string) => {
        const val = field(suffix)?.value;
        return typeof val === 'string' ? val.trim() : val;
      };

      const anyBIC = fieldValue('AnyBic');
      const name = fieldValue('Nm');
      const lei = fieldValue('Lei');
      const birthDate = fieldValue('BirthDt');

      const postalFields = [
        'Dept', 'SubDept', 'StrtNm', 'BldgNb', 'BldgNm',
        'Flr', 'PstBx', 'Room', 'PstCd', 'TwnNm',
        'TwnLctnNm', 'DstrctNm', 'CtrySubDvsn', 'Ctry',
        'AdrLine1', 'AdrLine2', 'AdrLine3'
      ];

      const hasPostalAddress = postalFields.some(fieldName => !!fieldValue(fieldName));

      const orgIdOthrArray = group.get(`${prefix}OrgIdOthr`) as FormArray;
      const prvtIdOthrArray = group.get(`${prefix}PrivtIdenOthr`) as FormArray;

      const hasOrgIdOthr = !!orgIdOthrArray?.length && orgIdOthrArray.controls.some(ctrl => {
        const id = ctrl.get(`${prefix}OrgIdOthrId`)?.value?.toString().trim();
        return !!id;
      });

      const hasPrvtIdOthr = !!prvtIdOthrArray?.length && prvtIdOthrArray.controls.some(ctrl => {
        const id = ctrl.get(`${prefix}PrivateIdOthrId`)?.value?.toString().trim();
        return !!id;
      });


      const hasOrgId = !!anyBIC || !!lei || hasOrgIdOthr;
      const hasPrvtId = !!birthDate || hasPrvtIdOthr;

      const isEmpty =
        !name &&
        !anyBIC &&
        !lei &&
        !birthDate &&
        !hasPostalAddress &&
        !hasOrgIdOthr &&
        !hasPrvtIdOthr;

      if (!isRequired && isEmpty) {
        return null;
      }

      const errors: ValidationErrors = {};

      // 1. If BIC is present, it must be alone
      if (anyBIC && (name || hasPostalAddress || hasOrgIdOthr || hasPrvtIdOthr || lei || birthDate)) {
        errors[`${prefix}AnyBicConflict`] = true;
      }

      // 6. Private Identification rules
      if (hasPrvtIdOthr && !birthDate) {
        errors[`${prefix}PrivtId_BirthDateMissing`] = true;
      }

      // 2. Organisation and Private ID are mutually exclusive
      if (hasOrgId && hasPrvtId) {
        errors[`${prefix}OrgPrvtMutuallyExclusive`] = true;
      }

      // 3. If neither name nor any ID present, error
      if (!name && !hasOrgId && !hasPrvtId) {
        errors[`${prefix}NameOrIdRequired`] = true;
      }

      // 4. Postal Address rules
      const adrLines = ['AdrLine1', 'AdrLine2', 'AdrLine3']
        .map(s => fieldValue(s))
        .filter(v => !!v);

      if (adrLines.length > 2) {
        errors[`${prefix}Postal_MaxTwoAdrLines`] = true;
      }

      const townName = fieldValue('TwnNm');
      const country = fieldValue('Ctry');

      if (hasPostalAddress && adrLines.length === 0 && (!townName || !country)) {
        errors[`${prefix}NoAdrLine`] = true;
      }

      const otherPostalFields = postalFields.filter(f =>
        !['TwnNm', 'Ctry', 'AdrLine1', 'AdrLine2', 'AdrLine3'].includes(f)
      );
      const otherPostalPresent = otherPostalFields.some(f => !!fieldValue(f));

      if (adrLines.length > 0 && otherPostalPresent && (!townName || !country)) {
        errors[`${prefix}AdrLineAndOthers`] = true;
      }

      // 5. Organisation ID and Postal Address cannot be used together
      if ((anyBIC || lei || hasOrgIdOthr) && hasPostalAddress) {
        errors[`${prefix}OrgIdAndPostalAddressConflict`] = true;
      }

      // 7. Private Identification and Postal Address cannot be used together
      if (hasPrvtId && hasPostalAddress) {
        errors[`${prefix}PrivtId_CannotCombineWithAddress`] = true;
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  setupDynamicValidators(
    form: FormGroup,
    config: {
      panel: Signal<boolean>;
      controls: string[];
      formArrayControls?: {
        arrayName: string;
        fieldNames: string[];
      }[];
      validators: ValidatorFn[];
    }
  ) {
    effect(() => {
      const isOpen = config.panel();

      // Regular controls
      config.controls.forEach(controlName => {
        const control = form.get(controlName);
        if (control) {
          control.setValidators(isOpen ? config.validators : []);
          control.updateValueAndValidity();
        } else {
          console.warn(`Control '${controlName}' not found in form.`);
        }
      });

      // FormArray controls
      if (config.formArrayControls) {
        config.formArrayControls.forEach(arrayCfg => {
          const arr = form.get(arrayCfg.arrayName);
          if (!arr) {
            console.warn(`FormArray '${arrayCfg.arrayName}' not found on form.`);
            return;
          }
          if (!(arr instanceof FormArray)) {
            console.warn(`'${arrayCfg.arrayName}' is not a FormArray.`);
            return;
          }
          if (arr.controls.length === 0) {
            console.warn(`FormArray '${arrayCfg.arrayName}' has no controls.`);
            return;
          }

          arr.controls.forEach((group, idx) => {
            if (!(group instanceof FormGroup)) {
              console.warn(`Expected FormGroup in FormArray '${arrayCfg.arrayName}' at index ${idx}, but got`, group);
              return;
            }
            arrayCfg.fieldNames.forEach(fieldName => {
              const ctrl = group.get(fieldName);
              if (ctrl) {
                ctrl.setValidators(isOpen ? config.validators : []);
                ctrl.updateValueAndValidity();
              } else {
                console.warn(`Field '${fieldName}' not found in FormGroup inside '${arrayCfg.arrayName}' at index ${idx}.`);
              }
            });
          });
        });
      }
    });
  }


}
