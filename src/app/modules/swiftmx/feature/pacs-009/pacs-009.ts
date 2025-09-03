import {
  Component,
  effect,
  inject,
  OnInit,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import {
  BUTTON_VISIBILITY,
  FormGroupSignal,
  ONCLICK_RESET,
  ONCLICK_SAVE,
} from '../../../../shared/constant/button-signals.constant';
import { SelectOptionsModel } from '../../../../shared/models/select-options-model';
import { TextBaseInput } from '../../../../shared/components/input-types/text-base-input/text-base-input';
import { Pacs009Service } from '../../service/pacs009.service';
import { Mx009Model } from '../../model/mx009.model';
import { SelectOptionField } from '../../../../shared/components/input-types/select-option-field/select-option-field';
import { TimeInput } from '../../../../shared/components/input-types/time-input/time-input';
import { AmountToWordInput } from '../../../../shared/components/input-types/amount-to-word-input/amount-to-word-input';
import { ExpansionPanelHeader } from '../../../../shared/components/expansion-panel-header/expansion-panel-header';
import { ExpansionSubPanelHeader } from '../../../../shared/components/expansion-sub-panel-header/expansion-sub-panel-header';
import { DialogUtils } from '../../../../shared/service/dialog-utils';
import { BicSelectionService } from '../../../../shared/services/bic-selection.service';
import { ExternalCodeService } from '../../../../shared/services/external-code.service';
import { CurrencyService } from '../../../../shared/services/currency.service';
import { CurrencyModel } from '../../../../shared/models/currency.model';
import { LookupService } from '../../../../shared/services/lookup.service';
import { MessageTypeService } from '../../../../shared/services/message-type.service';
import { DateInput } from '../../../../shared/components/input-types/date-input/date-input';
import { LEI_PATTERN } from '../../../../shared/constant/value-patterns.constant';


@Component({
  selector: 'app-pacs-009',
  imports: [
    ReactiveFormsModule,
    TextBaseInput,
    SelectOptionField,
    DateInput,
    TimeInput,
    AmountToWordInput,
    ExpansionPanelHeader,
    ExpansionSubPanelHeader,
    CommonModule
],
  templateUrl: './pacs-009.html',
  standalone: true,
  styleUrl: './pacs-009.scss',
})
export class Pacs009 implements OnInit, OnDestroy {
  dialogUtils = inject(DialogUtils);
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  pacs009Service = inject(Pacs009Service);
  externalCodeService = inject(ExternalCodeService);
  currencyService = inject(CurrencyService);
  lookupService = inject(LookupService);
  messageTypeService = inject(MessageTypeService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
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

  currencyOptions: SelectOptionsModel[] = [];

  instructionCodeOptions: SelectOptionsModel[] = [
    { key: 'PHOB', value: 'PhoneBeneficiary - Please advise/contact (ultimate) creditor/claimant by phone.' },
    { key: 'TELB', value: 'Telecom - Please advise/contact (ultimate) creditor/claimant by the most efficient means of telecommunication.' },
  ];

  // Panel visibility signals
  timeDatePanel: WritableSignal<boolean> = signal(true);
  fromBicPanel: WritableSignal<boolean> = signal(true);
  toBicPanel: WritableSignal<boolean> = signal(true);
  subPanelOpen: WritableSignal<boolean> = signal(true);
  businessHeaderPanel: WritableSignal<boolean> = signal(true);
  businessApplicationHeaderPanel: WritableSignal<boolean> = signal(true);
  mktPrctcPanel: WritableSignal<boolean> = signal(false);
  relatedInfoPanel: WritableSignal<boolean> = signal(false);
  rltdFromBicPanel: WritableSignal<boolean> = signal(false);
  rltdToBicPanel: WritableSignal<boolean> = signal(false);
  groupHeaderPanel: WritableSignal<boolean> = signal(true);
  settlementPanel: WritableSignal<boolean> = signal(true);
  sttlmAccountPanel: WritableSignal<boolean> = signal(false);
  instructingReimbursementAgentPanel: WritableSignal<boolean> = signal(false);
  instructingReimbursementAgentAddressPanel: WritableSignal<boolean> = signal(false);
  instructingReimbursementAgentAccountPanel: WritableSignal<boolean> = signal(false);
  instructedReimbursementAgentPanel: WritableSignal<boolean> = signal(false);
  instructedReimbursementAgentAddressPanel: WritableSignal<boolean> = signal(false);
  instructedReimbursementAgentAccountPanel: WritableSignal<boolean> = signal(false);
  financialInstitutionCreditTransferPanel: WritableSignal<boolean> =
    signal(true);
  paymentIdPanel: WritableSignal<boolean> = signal(true);
  paymentTypePanel: WritableSignal<boolean> = signal(false);
  serviceLevelPanel: WritableSignal<boolean> = signal(true);
  interbankPanel: WritableSignal<boolean> = signal(true);
  interbankSettlementTimeIndicationPanel: WritableSignal<boolean> = signal(false);
  interbankSettlementTimeRequestPanel: WritableSignal<boolean> = signal(false);
  previousAgentsPanel: WritableSignal<boolean> = signal(true);
  prevAgent1Panel: WritableSignal<boolean> = signal(false);
  prevAgent1AddressPanel: WritableSignal<boolean> = signal(false);
  prevAgent1AccountPanel:  WritableSignal<boolean> = signal(false);
  prevAgent2Panel: WritableSignal<boolean> = signal(false);
  prevAgent2AddressPanel:  WritableSignal<boolean> = signal(false);
  prevAgent2AccountPanel:  WritableSignal<boolean> = signal(false);
  prevAgent3Panel: WritableSignal<boolean> = signal(false);
  prevAgent3AddressPanel:  WritableSignal<boolean> = signal(false);
  prevAgent3AccountPanel:  WritableSignal<boolean> = signal(false);
  agentsPanel: WritableSignal<boolean> = signal(true);
  instructingAgentPanel: WritableSignal<boolean> = signal(true);
  instructedAgentPanel: WritableSignal<boolean> = signal(true);
  intermediaryAgentsPanel: WritableSignal<boolean> = signal(true);
  intermediary1Panel: WritableSignal<boolean> = signal(false);
  intermediary1AddressPanel: WritableSignal<boolean> = signal(false);
  intermediary1AccountPanel: WritableSignal<boolean> = signal(false);
  intermediary2Panel: WritableSignal<boolean> = signal(false);
  intermediary2AddressPanel: WritableSignal<boolean> = signal(false);
  intermediary2AccountPanel: WritableSignal<boolean> = signal(false);
  intermediary3Panel: WritableSignal<boolean> = signal(false);
  intermediary3AddressPanel: WritableSignal<boolean> = signal(false);
  intermediary3AccountPanel: WritableSignal<boolean> = signal(false);
  debtorPanel: WritableSignal<boolean> = signal(true);
  dbtrAddressPanel: WritableSignal<boolean> = signal(false);
  dbtrAccountPanel: WritableSignal<boolean> = signal(false);
  dbtrAgentPanel: WritableSignal<boolean> = signal(false);
  dbtrAgentAddressPanel: WritableSignal<boolean> = signal(false);
  dbtrAgentAccountPanel: WritableSignal<boolean> = signal(false);
  creditTransferTransactionPanel: WritableSignal<boolean> = signal(true);
  creditorPanel: WritableSignal<boolean> = signal(true);
  cdtrAddressPanel: WritableSignal<boolean> = signal(false);
  cdtrAccountPanel: WritableSignal<boolean> = signal(false);
  cdtrAgentPanel: WritableSignal<boolean> = signal(false);
  cdtrAgentAddressPanel: WritableSignal<boolean> = signal(false);
  cdtrAgentAccountPanel: WritableSignal<boolean> = signal(false);
  instructionsPanel: WritableSignal<boolean> = signal(true);
  instructionForCreditorAgentPanel: WritableSignal<boolean> = signal(false);
  instructionForNextAgentPanel: WritableSignal<boolean> = signal(false);
  purposePanel: WritableSignal<boolean> = signal(true);
  authorizationPanel: WritableSignal<boolean> = signal(true);
  otherInfoPanel: WritableSignal<boolean> = signal(true);
  swiftCodesFrom: any;
  swiftCodesTo: any;

  serviceLevelCodeOptions: SelectOptionsModel[] = [];

  currencies: CurrencyModel[] = [];

  settlementOptions: SelectOptionsModel[] = [];

  // Additional options for reimbursement agents
  accountTypeOptions: SelectOptionsModel[] = [];
  rmbrsmntAgtPrxyCdOptions: SelectOptionsModel[] = [];
  purposeCodeOptions: SelectOptionsModel[] = [];
  clearingSystemIdOptions: SelectOptionsModel[] = [];

  cbsData: any = null;
  private destroy$ = new Subject<void>();

  constructor(
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
      if(this.relatedInfoPanel()){
        this.rltdFromBicPanel.set(true);
        this.rltdToBicPanel.set(true);
      }else if(!this.relatedInfoPanel()){
        this.rltdFromBicPanel.set(false);
        this.rltdToBicPanel.set(false);
      }
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
      this.loadCurrencies();
      this.loadServiceLevelCodes();
      this.loadSettlementOptions();
      this.loadAccountTypeOptions();
      this.loadReimbursementAgentProxyCodeOptions();
      this.loadPurposeCodeOptions();
      this.loadClearingSystemIdOptions();
      FormGroupSignal.set(this.frmGroup);
      this.setupPurposeMutualExclusivity();
      this.setupBicAgentSynchronization();
      this.setupConditionalValidation();
      this.activatedRoute.queryParams.pipe(
        takeUntil(this.destroy$)
      ).subscribe(params => {
        if (history.state?.cbsData) {
          try {
            this.cbsData = history.state?.cbsData;
            // Call service to get message data
            const payload = {
              msgType: 202,
              msgRefNo: this.cbsData.msgRefNo
            };

            this.messageTypeService.getMessageByRefNo(payload).pipe(
              takeUntil(this.destroy$)
            ).subscribe({
              next: (response: any) => {
                if (response.payload && response.payload.length > 0) {
                  const data = response.payload[0];
                  this.mapServiceDataToForm(data);
                }
              },
              error: (error: any) => {
                console.error('Error fetching message data:', error);
              }
            });

          } catch (error) {
            console.warn('Could not parse CBS data from query params:', error);
          }
        }
      });
    } catch (error) {
      this.toastr.error('Error during form initialization', 'Error');
    }
  }

    ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupConditionalValidation(): void {
    // Simple conditional validation for all clearing system and member ID pairs
    this.setupFieldPairValidation('fromClrSysIdCd', 'fromMmbId');
    this.setupFieldPairValidation('toClrSysIdCd', 'toMmbId');
    this.setupFieldPairValidation('rltdFromClrSysIdCd', 'rltdFromMmbId');
    this.setupFieldPairValidation('rltdToClrSysIdCd', 'rltdToMmbId');
    this.setupFieldPairValidation('instgRmbrsmntAgtClrSysIdCd', 'instgRmbrsmntAgtMmbId');
    this.setupFieldPairValidation('instdRmbrsmntAgtClrSysIdCd', 'instdRmbrsmntAgtMmbId');
    this.setupFieldPairValidation('prvsInstgAgt1ClrSysIdCd', 'prvsInstgAgt1MmbId');
    this.setupFieldPairValidation('prvsInstgAgt2ClrSysIdCd', 'prvsInstgAgt2MmbId');
    this.setupFieldPairValidation('prvsInstgAgt3ClrSysIdCd', 'prvsInstgAgt3MmbId');
    this.setupFieldPairValidation('instgAgtClrSysIdCd', 'instgAgtMmbId');
    this.setupFieldPairValidation('instdAgtClrSysIdCd', 'instdAgtMmbId');
    this.setupFieldPairValidation('intrmyAgt1ClrSysIdCd', 'intrmyAgt1MmbId');
    this.setupFieldPairValidation('intrmyAgt2ClrSysIdCd', 'intrmyAgt2MmbId');
    this.setupFieldPairValidation('intrmyAgt3ClrSysIdCd', 'intrmyAgt3MmbId');
    this.setupFieldPairValidation('dbtrClrSysIdCd', 'dbtrMmbId');
    this.setupFieldPairValidation('dbtrAgtClrSysIdCd', 'dbtrAgtMmbId');
    this.setupFieldPairValidation('cdtrClrSysIdCd', 'cdtrMmbId');
    this.setupFieldPairValidation('cdtrAgtClrSysIdCd', 'cdtrAgtMmbId');
    
    // Market Practice conditional validation
    this.setupFieldPairValidation('mktPrctcRegy', 'mktPrctcId');
  }

  private setupFieldPairValidation(clearingSystemField: string, memberIdField: string): void {
    const clearingSystemControl = this.frmGroup.get(clearingSystemField);
    const memberIdControl = this.frmGroup.get(memberIdField);

    if (!clearingSystemControl || !memberIdControl) return;

    // Listen to clearing system field changes
    clearingSystemControl.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      const hasValue = value && value.toString().trim() !== '';
      if (hasValue) {
        // Add required to member ID
        memberIdControl.setValidators([Validators.required]);
      } else {
        // Remove required from member ID
        memberIdControl.setValidators([]);
      }
      memberIdControl.updateValueAndValidity({ emitEvent: false });
    });

    // Listen to member ID field changes
    memberIdControl.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      const hasValue = value && value.toString().trim() !== '';
      if (hasValue) {
        // Add required to clearing system
        clearingSystemControl.setValidators([Validators.required]);
      } else {
        // Remove required from clearing system
        clearingSystemControl.setValidators([]);
      }
      clearingSystemControl.updateValueAndValidity({ emitEvent: false });
    });
  }

  private setupPurposeMutualExclusivity(): void {
    // Subscribe to purpCD changes and clear purpPrtry when purpCD is selected
    this.frmGroup.get('purpCD')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      if (value && value.trim() !== '') {
        this.frmGroup.get('purpPrtry')?.setValue('', { emitEvent: false });
      }
    });

    // Subscribe to purpPrtry changes and clear purpCD immediately when user starts typing
    this.frmGroup.get('purpPrtry')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      // Clear purpCD as soon as user starts typing (even if just one character)
      if (value && value.length > 0) {
        this.frmGroup.get('purpCD')?.setValue('', { emitEvent: false });
      }
    });
  }

  private setupBicAgentSynchronization(): void {
    // FROM BIC Panel -> Instructing Agent Panel synchronization
    this.frmGroup.get('fromBicfi')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.frmGroup.get('instgAgtBicfi')?.setValue(value, { emitEvent: false });
    });

    this.frmGroup.get('fromClrSysIdCd')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.frmGroup.get('instgAgtClrSysIdCd')?.setValue(value, { emitEvent: false });
    });

    this.frmGroup.get('fromMmbId')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.frmGroup.get('instgAgtMmbId')?.setValue(value, { emitEvent: false });
    });

    this.frmGroup.get('fromLei')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.frmGroup.get('instgAgtLei')?.setValue(value, { emitEvent: false });
    });

    // TO BIC Panel -> Instructed Agent Panel synchronization
    this.frmGroup.get('toBicfi')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.frmGroup.get('instdAgtBicfi')?.setValue(value, { emitEvent: false });
    });

    this.frmGroup.get('toClrSysIdCd')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.frmGroup.get('instdAgtClrSysIdCd')?.setValue(value, { emitEvent: false });
    });

    this.frmGroup.get('toMmbId')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.frmGroup.get('instdAgtMmbId')?.setValue(value, { emitEvent: false });
    });

    this.frmGroup.get('toLei')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.frmGroup.get('instdAgtLei')?.setValue(value, { emitEvent: false });
    });

    // REVERSE SYNCHRONIZATION: Agent Panels -> BIC Panels
    
    // Instructing Agent Panel -> FROM BIC Panel synchronization
    this.frmGroup.get('instgAgtBicfi')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.frmGroup.get('fromBicfi')?.setValue(value, { emitEvent: false });
    });

    this.frmGroup.get('instgAgtClrSysIdCd')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.frmGroup.get('fromClrSysIdCd')?.setValue(value, { emitEvent: false });
    });

    this.frmGroup.get('instgAgtMmbId')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.frmGroup.get('fromMmbId')?.setValue(value, { emitEvent: false });
    });

    this.frmGroup.get('instgAgtLei')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.frmGroup.get('fromLei')?.setValue(value, { emitEvent: false });
    });

    // Instructed Agent Panel -> TO BIC Panel synchronization
    this.frmGroup.get('instdAgtBicfi')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.frmGroup.get('toBicfi')?.setValue(value, { emitEvent: false });
    });

    this.frmGroup.get('instdAgtClrSysIdCd')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.frmGroup.get('toClrSysIdCd')?.setValue(value, { emitEvent: false });
    });

    this.frmGroup.get('instdAgtMmbId')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.frmGroup.get('toMmbId')?.setValue(value, { emitEvent: false });
    });

    this.frmGroup.get('instdAgtLei')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.frmGroup.get('toLei')?.setValue(value, { emitEvent: false });
    });
  }

  private mapServiceDataToForm(data: any): void {
    if (!this.frmGroup) return;

    // Ensure currencies are loaded before mapping
    if (this.currencyOptions.length === 0) {
      this.loadCurrencies();
      // Wait for currencies to load then map data
      setTimeout(() => {
        this.mapServiceDataToForm(data);
      }, 100);
      return;
    }

    // Find the correct currency option
    const currencyOption = this.currencyOptions.find(option =>
      option.key.toLowerCase() === data.isoSwiftCode.toLowerCase()
    );

    this.frmGroup.patchValue({
      bizMsgIdr: data.relatedRef21,
      instrId: data.trnRefNo20,
      endToEndId: data.relatedRef21,
      intrBkSttlmAmt: data.valAmt32a,
      intrBkSttlmAmtCcy: currencyOption ? currencyOption.key : data.isoSwiftCode,
      instgAgtAdrLine: data.benfInstNmAddrs58d,
      fromBicfi: data.senderBic,
      instgAgtBicfi: data.senderBic,
    });
  }

  private loadServiceLevelCodes(): void {
    const codeSet = 'ExternalServiceLevel1Code';
    this.externalCodeService.getSwiftExternalCodes(codeSet).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
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

  private loadCurrencies(): void {
    this.currencyService.getAllCurrency().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        if (response.payload && response.payload.length > 0) {
          this.currencies = response.payload;
          // Map CurrencyModel[] to SelectOptionsModel[]
          this.currencyOptions = this.currencies.map(c => ({
            key: c.isoSwiftCode,
            value: `${c.isoSwiftCode} - ${c.currencyFullNm}`
          }));
        }
      },
      error: (err: any) => {
        console.error('Failed to load currencies', err);
        this.toastr.error('Failed to load currencies', 'Error');
        this.currencyOptions = [];
      }
    });
  }

  private loadSettlementOptions(): void {
    // Assuming typeId 1 is for settlement methods - adjust as needed based on your backend
    this.lookupService.getListByTypeId(16).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        if (response.payload && response.payload.length > 0) {
          // Map the response to SelectOptionsModel format
          this.settlementOptions = response.payload.map((item: any) => ({
            key: item.lookDescription,
            value: item.lookName
          }));
        }
      },
      error: (err) => {
        console.error('Failed to load settlement options', err);
        this.toastr.error('Failed to load settlement options', 'Error');
        // Fallback to default options if API fails
        this.settlementOptions = [
          { key: 'CLRG', value: 'CLRG' },
          { key: 'COVE', value: 'COVE' },
          { key: 'INDA', value: 'INDA' },
          { key: 'INGA', value: 'INGA' },
        ];
      }
    });
  }

  private loadAccountTypeOptions(): void {
    // Load account type options - adjust typeId as needed based on your backend
    this.externalCodeService.getSwiftExternalCodes('ExternalCashAccountType1Code').pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        if (response.payload && response.payload.length > 0) {
          this.accountTypeOptions = response.payload.map((item: any) => ({
            key: item.codeValue,
            value: item.codeName ? `${item.codeValue} - ${item.codeName}` : item.codeValue,
          }));
        }
      },
      error: (err) => {
        console.error('Failed to load account type options', err);
        this.toastr.error('Failed to load account type options', 'Error');
        // Fallback to default options if API fails
        this.accountTypeOptions = [
          { key: 'CACC', value: 'Current Account' },
          { key: 'SVGS', value: 'Savings Account' },
          { key: 'TRAN', value: 'Transactional Account' },
        ];
      }
    });
  }

  private loadReimbursementAgentProxyCodeOptions(): void {
    // Load reimbursement agent proxy code options - adjust typeId as needed based on your backend
    this.externalCodeService.getSwiftExternalCodes('ExternalProxyAccountType1Code').pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        if (response.payload && response.payload.length > 0) {
          this.rmbrsmntAgtPrxyCdOptions = response.payload.map((item: any) => ({
            key: item.codeValue,
            value: item.codeName ? `${item.codeValue} - ${item.codeName}` : item.codeValue,
          }));
        }
      },
      error: (err) => {
        console.error('Failed to load reimbursement agent proxy code options', err);
        this.toastr.error('Failed to load reimbursement agent proxy code options', 'Error');
        // Fallback to default options if API fails
        this.rmbrsmntAgtPrxyCdOptions = [
          { key: 'BANK', value: 'Bank' },
          { key: 'CUST', value: 'Customer' },
          { key: 'EMPL', value: 'Employee' },
        ];
      }
    });
  }

  private loadPurposeCodeOptions(): void {
    // Load purpose code options using ExternalPurpose1Code type
    this.externalCodeService.getSwiftExternalCodes('ExternalPurpose1Code').pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        if (response.payload && response.payload.length > 0) {
          this.purposeCodeOptions = response.payload.map((item: any) => ({
            key: item.codeValue,
            value: item.codeName ? `${item.codeValue} - ${item.codeName}` : item.codeValue,
          }));
        }
      },
      error: (err) => {
        console.error('Failed to load purpose code options', err);
        this.toastr.error('Failed to load purpose code options', 'Error');
        // Fallback to default options if API fails
        this.purposeCodeOptions = [
          { key: 'IPRT', value: 'IPRT - Instant Payments Return' },
          { key: 'IPU2', value: 'IPU2 - Instant Payments Unattended Vending Machine With 2FA' },
          { key: 'IPUW', value: 'IPUW - Instant Payments Unattended Vending Machine Without 2FA' },
          { key: 'ANNI', value: 'ANNI - Annuity' },
          { key: 'CAFI', value: 'CAFI - Custodian Management Fee Inhouse' },
          { key: 'CFDI', value: 'CFDI - Capital Falling Due Inhouse' },
          { key: 'CMDT', value: 'CMDT - Commodity Transfer' },
          { key: 'DERI', value: 'DERI - Derivatives' },
          { key: 'DIVI', value: 'DIVI - Dividend' },
          { key: 'FREX', value: 'FREX - Foreign Exchange' },
          { key: 'HEDG', value: 'HEDG - Hedging' },
          { key: 'INVS', value: 'INVS - Investment And Securities' },
          { key: 'PRME', value: 'PRME - Precious Metal' },
          { key: 'SAVG', value: 'SAVG - Savings' },
          { key: 'SECU', value: 'SECU - Securities' },
          { key: 'SEPI', value: 'SEPI - Securities Purchase Inhouse' },
          { key: 'TREA', value: 'TREA - Treasury Payment' },
        ];
      }
    });
  }

  private loadClearingSystemIdOptions(): void {
    // Load clearing system identification options using ExternalClearingSystemIdentification1Code type
    this.externalCodeService.getSwiftExternalCodes('ExternalClearingSystemIdentification1Code').pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        if (response.payload && response.payload.length > 0) {
          this.clearingSystemIdOptions = response.payload.map((item: any) => ({
            key: item.codeValue,
            value: item.codeName ? `${item.codeValue} - ${item.codeName}` : item.codeValue,
          }));
        }
      },
      error: (err) => {
        console.error('Failed to load clearing system ID options', err);
        this.toastr.error('Failed to load clearing system ID options', 'Error');
        // Fallback to default options if API fails
        this.clearingSystemIdOptions = [
          { key: 'BD', value: 'BD - Bangladesh Clearing System ID' },
          { key: 'USABA', value: 'USABA - US Domestic ABA Routing Number' },
          { key: 'GBDSC', value: 'GBDSC - UK Domestic Sort Code' },
          { key: 'CACPA', value: 'CACPA - Canadian Payments Association Routing Number' },
          { key: 'CHBCC', value: 'CHBCC - Swiss Bank Code' },
          { key: 'DEBLZ', value: 'DEBLZ - German Bankleitzahl' },
          { key: 'FRRIB', value: 'FRRIB - French RIB' },
          { key: 'ZANCC', value: 'ZANCC - South African National Clearing Code' },
          { key: 'HKNCC', value: 'HKNCC - Hong Kong Bank Code' },
          { key: 'AUSBP', value: 'AUSBP - Australian BSB Code' },
          { key: 'JPZGN', value: 'JPZGN - Japanese Zengin Code' },
          { key: 'INFSC', value: 'INFSC - Indian Financial System Code' },
          { key: 'SGIBG', value: 'SGIBG - Singapore Interbank GIRO' },
        ];
      }
    });
  }

  initForm(): void {
    this.frmGroup = this.formBuilder.group({
      // Business Message Header
      charSet: [''],
      fromBicfi: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
      fromMmbId: [''],
      fromClrSysIdCd: ['', Validators.maxLength(10)],
      fromLei: ['',[Validators.minLength(20), Validators.maxLength(20), Validators.pattern(LEI_PATTERN)]],
      toMmbId: [''],
      toBicfi: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
      toClrSysIdCd: ['', Validators.maxLength(10)],
      toLei: ['', [Validators.minLength(20), Validators.maxLength(20), Validators.pattern(LEI_PATTERN)]],
      bizMsgIdr: ['PACS009' + new Date().getTime(),
        [Validators.required, Validators.minLength(1), 
          Validators.maxLength(35)]],
      msgDefIdr: ['pacs.009.001.08', Validators.required],
      bizSvc: ['swift.cbprplus.02', Validators.required],

      mktPrctcRegy: ['', Validators.maxLength(350)],
      mktPrctcId: ['', Validators.maxLength(2048)],

      creDt: ['', Validators.required],

      // Related (flat)
      rltdCharSet: [''],
      rltdFromBicfi: ['', [Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
      rltdFromClrSysIdCd: ['', Validators.maxLength(10)],
      rltdFromMmbId: [''],
      rltdFromLei: ['', [Validators.minLength(20), Validators.maxLength(20), Validators.pattern(LEI_PATTERN)]],
      rltdFromNm: [''],
      rltdFromAdrLine1: [''],
      rltdFromAdrLine2: [''],
      rltdFromAdrLine3: [''],
      rltdFromAdrDept: [''],
      rltdFromAdrSubDept: [''],
      rltdFromAdrStrtNm: [''],
      rltdFromAdrBldgNb: [''],
      rltdFromAdrBldgNm: [''],
      rltdFromAdrFlr: [''],
      rltdFromAdrPstBx: [''],
      rltdFromAdrRoom: [''],
      rltdFromAdrPstCd: [''],
      rltdFromAdrTwnNm: [''],
      rltdFromAdrTwnLctnNm: [''],
      rltdFromAdrDstrctNm: [''],
      rltdFromAdrCtrySubDvsn: [''],
      rltdFromAdrCtry: ['', Validators.maxLength(3)],
      rltdFromAdrLine: [''],
      rltdToLei: ['', [Validators.minLength(20), Validators.maxLength(20), Validators.pattern(LEI_PATTERN)]],
      rltdToBicfi: ['', [Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
      rltdToClrSysIdCd: ['', Validators.maxLength(10)],
      rltdToMmbId: [''],
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
      rltdToAdrCtry: ['', Validators.maxLength(3)],
      rltdToAdrLine: [''],
      rltdCpyDplct: [null],
      rltdPrty: [null],
      
      rltdBizMsgIdr: ['', Validators.maxLength(35)],
      rltdMsgDefIdr: [''],
      rltdBizSvc: [''],
      rltdCreDt: [''],

      cpyDplct: [null],
      pssblDplct: [null],
      priority: ['NORM'],
      msgId: ['MSG' + new Date().getTime(), [
        Validators.required,
        Validators.maxLength(35),
        Validators.minLength(1),
        Validators.pattern(/^[0-9a-zA-Z/\-\?:\(\)\.,'\+ ]+$/)
      ]],
      creDtTm: [new Date().toISOString(), Validators.required],
      nbOfTxs: ['1', Validators.required],

      // Settlement Information
      sttlmMtd: [null, Validators.required],
      // Settlement Account (flat)
      sttlmAcctId: [''],
      sttlmAcctCcy: [null],
      sttlmAcctTp: [''],
      sttlmAcctNm: [''],
      sttlmAgtAcctPrxyCd: [''],
      sttlmAgtAcctPrxyId: [''],
      sttlmAcctSchmeNm: [''],
      sttlmAcctIssr: [''],

      // Instructing Reimbursement Agent
      instgRmbrsmntAgtBicfi: ['', [Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
      instgRmbrsmntAgtClrSysIdCd: ['', Validators.maxLength(10)],
      instgRmbrsmntAgtMmbId: [''],
      instgRmbrsmntAgtLei: ['', [Validators.minLength(20), Validators.maxLength(20), Validators.pattern(LEI_PATTERN)]],
      instgRmbrsmntAgtNm: [''],
      instgRmbrsmntAgtAdrLine1: [''],
      instgRmbrsmntAgtAdrLine2: [''],
      instgRmbrsmntAgtAdrLine3: [''],
      instgRmbrsmntAgtAdrDept: [''],
      instgRmbrsmntAgtAdrSubDept: [''],
      instgRmbrsmntAgtAdrStrtNm: [''],
      instgRmbrsmntAgtAdrBldgNb: [''],
      instgRmbrsmntAgtAdrBldgNm: [''],
      instgRmbrsmntAgtAdrFlr: [''],
      instgRmbrsmntAgtAdrPstBx: [''],
      instgRmbrsmntAgtAdrRoom: [''],
      instgRmbrsmntAgtAdrPstCd: [''],
      instgRmbrsmntAgtAdrTwnNm: [''],
      instgRmbrsmntAgtAdrTwnLctnNm: [''],
      instgRmbrsmntAgtAdrDstrctNm: [''],
      instgRmbrsmntAgtAdrCtrySubDvsn: [''],
      instgRmbrsmntAgtAdrCtry: ['', Validators.maxLength(3)],
      instgRmbrsmntAgtAdrLine: [''],
      instgRmbrsmntAgtAcctId: [''],
      instgRmbrsmntAgtAcctTp: [null],
      instgRmbrsmntAgtAcctCcy: [null],
      instgRmbrsmntAgtAcctNm: [''],
      instgRmbrsmntAgtPrxyCd: [''],
      instgRmbrsmntAgtPrxyId: [''],

      // Instructed Reimbursement Agent
      instdRmbrsmntAgtBicfi: ['', [Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
      instdRmbrsmntAgtClrSysIdCd: ['', Validators.maxLength(10)],
      instdRmbrsmntAgtMmbId: [''],
      instdRmbrsmntAgtLei: ['', [Validators.minLength(20), Validators.maxLength(20), Validators.pattern(LEI_PATTERN)]],
      instdRmbrsmntAgtNm: [''],
      instdRmbrsmntAgtAdrLine1: [''],
      instdRmbrsmntAgtAdrLine2: [''],
      instdRmbrsmntAgtAdrLine3: [''],
      instdRmbrsmntAgtAdrDept: [''],
      instdRmbrsmntAgtAdrSubDept: [''],
      instdRmbrsmntAgtAdrStrtNm: [''],
      instdRmbrsmntAgtAdrBldgNb: [''],
      instdRmbrsmntAgtAdrBldgNm: [''],
      instdRmbrsmntAgtAdrFlr: [''],
      instdRmbrsmntAgtAdrPstBx: [''],
      instdRmbrsmntAgtAdrRoom: [''],
      instdRmbrsmntAgtAdrPstCd: [''],
      instdRmbrsmntAgtAdrTwnNm: [''],
      instdRmbrsmntAgtAdrTwnLctnNm: [''],
      instdRmbrsmntAgtAdrDstrctNm: [''],
      instdRmbrsmntAgtAdrCtrySubDvsn: [''],
      instdRmbrsmntAgtAdrCtry: ['', Validators.maxLength(3)],
      instdRmbrsmntAgtAdrLine: [''],
      instdRmbrsmntAgtAcctId: [''],
      instdRmbrsmntAgtAcctTp: [null],
      instdRmbrsmntAgtAcctCcy: [null],
      instdRmbrsmntAgtAcctNm: [''],
      instdRmbrsmntAgtPrxyCd: [''],
      instdRmbrsmntAgtPrxyId: [''],

      // Payment Identification
      instrId: ['',Validators.required],
      endToEndId: ['', Validators.required],
      txId: ['TX' + new Date().getTime()],
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
      intrBkSttlmAmt: ['', [Validators.required, Validators.pattern(/^\d{1,14}(\.\d{1,5})?$/)]],
      intrBkSttlmDt: [new Date().toISOString().split('T')[0], Validators.required],
      intrBkSttlmDbtDtTm: [''],
      intrBkSttlmCdtDtTm: [''],
      sttlmPrty: [null],

      // Settlement Time Request
      clstm: [''],
      tilltm: [''],
      frtm: [''],
      rjcttm: [''],

      // Previous Instructing Agent 1 (flat)
      prvsInstgAgt1Bicfi: ['', [Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
      prvsInstgAgt1ClrSysIdCd: ['', Validators.maxLength(10)],
      prvsInstgAgt1MmbId: [''],
      prvsInstgAgt1Lei: ['', [Validators.minLength(20), Validators.maxLength(20), Validators.pattern(LEI_PATTERN)]],
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
      prvsInstgAgt1AdrCtry: ['', Validators.maxLength(3)],
      prvsInstgAgt1AdrLine: [''],
      // Previous Instructing Agent 1 Account (flat)
      prvsInstgAgt1AcctId: [''],
      prvsInstgAgt1AcctCcy: [null],
      prvsInstgAgt1AcctTp: [''],
      prvsInstgAgt1AcctNm: [''],
      prvsInstgAgt1AcctSchmeNm: [''],
      prvsInstgAgt1AcctIssr: [''],
      prvsInstgAgt1PrxyCd: [''],
      prvsInstgAgt1PrxyId: [''],

      // Previous Instructing Agent 2 (flat)
      prvsInstgAgt2Bicfi: ['', [Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
      prvsInstgAgt2ClrSysIdCd: ['', Validators.maxLength(10)],
      prvsInstgAgt2MmbId: [''],
      prvsInstgAgt2Lei: ['', [Validators.minLength(20), Validators.maxLength(20), Validators.pattern(LEI_PATTERN)]],
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
      prvsInstgAgt2AdrCtry: ['', Validators.maxLength(3)],
      prvsInstgAgt2AdrLine: [''],
      // Previous Instructing Agent 2 Account (flat)
      prvsInstgAgt2AcctId: [''],
      prvsInstgAgt2AcctCcy: [null],
      prvsInstgAgt2AcctTp: [''],
      prvsInstgAgt2AcctNm: [''],
      prvsInstgAgt2AcctSchmeNm: [''],
      prvsInstgAgt2AcctIssr: [''],
      prvsInstgAgt2PrxyCd: [''],
      prvsInstgAgt2PrxyId: [''],

      // Previous Instructing Agent 3 (flat)
      prvsInstgAgt3Bicfi: ['', [Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
      prvsInstgAgt3ClrSysIdCd: ['', Validators.maxLength(10)],
      prvsInstgAgt3MmbId: [''],
      prvsInstgAgt3Lei: ['', [Validators.minLength(20), Validators.maxLength(20), Validators.pattern(LEI_PATTERN)]],
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
      prvsInstgAgt3AdrCtry: ['', Validators.maxLength(3)],
      prvsInstgAgt3AdrLine: [''],
      // Previous Instructing Agent 3 Account (flat)
      prvsInstgAgt3AcctId: [''],
      prvsInstgAgt3AcctCcy: [null],
      prvsInstgAgt3AcctTp: [''],
      prvsInstgAgt3AcctNm: [''],
      prvsInstgAgt3AcctSchmeNm: [''],
      prvsInstgAgt3AcctIssr: [''],
      prvsInstgAgt3PrxyCd: [''],
      prvsInstgAgt3PrxyId: [''],

      // Agents (flat)
      instgAgtBicfi: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
      instgAgtClrSysIdCd: ['', Validators.maxLength(10)],
      instgAgtMmbId: [''],
      instgAgtLei: ['', [Validators.minLength(20), Validators.maxLength(20), Validators.pattern(LEI_PATTERN)]],
      instgAgtNm: [''],

      instdAgtBicfi: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
      instdAgtClrSysIdCd: ['', Validators.maxLength(10)],
      instdAgtMmbId: [''],
      instdAgtLei: ['', [Validators.minLength(20), Validators.maxLength(20), Validators.pattern(LEI_PATTERN)]],
      instdAgtNm: [''],

      // Intermediary Agent 1 (flat)
      intrmyAgt1Bicfi: ['', [Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
      intrmyAgt1ClrSysIdCd: ['', Validators.maxLength(10)],
      intrmyAgt1MmbId: [''],
      intrmyAgt1Lei: ['', [Validators.minLength(20), Validators.maxLength(20), Validators.pattern(LEI_PATTERN)]],
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
      intrmyAgt1AdrCtry: ['', Validators.maxLength(3)],
      intrmyAgt1AdrLine: [''],
      // Intermediary Agent 1 Account (flat)
      intrmyAgt1AcctId: [''],
      intrmyAgt1AcctCcy: [null],
      intrmyAgt1AcctTp: [''],
      intrmyAgt1AcctNm: [''],
      intrmyAgt1AcctSchmeNm: [''],
      intrmyAgt1AcctIssr: [''],
      intrmyAgt1PrxyCd: [''],
      intrmyAgt1PrxyId: [''],

      // Intermediary Agent 2 (flat)
      intrmyAgt2Bicfi: ['', [Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
      intrmyAgt2ClrSysIdCd: ['', Validators.maxLength(10)],
      intrmyAgt2MmbId: [''],
      intrmyAgt2Lei: ['', [Validators.minLength(20), Validators.maxLength(20), Validators.pattern(LEI_PATTERN)]],
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
      intrmyAgt2AdrCtry: ['', Validators.maxLength(3)],
      intrmyAgt2AdrLine: [''],
      // Intermediary Agent 2 Account (flat)
      intrmyAgt2AcctId: [''],
      intrmyAgt2AcctCcy: [null],
      intrmyAgt2AcctTp: [''],
      intrmyAgt2AcctNm: [''],
      intrmyAgt2AcctSchmeNm: [''],
      intrmyAgt2AcctIssr: [''],
      intrmyAgt2PrxyCd: [''],
      intrmyAgt2PrxyId: [''],

      // Intermediary Agent 3 (flat)
      intrmyAgt3Bicfi: ['', [Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
      intrmyAgt3ClrSysIdCd: ['', Validators.maxLength(10)],
      intrmyAgt3MmbId: [''],
      intrmyAgt3Lei: ['', [Validators.minLength(20), Validators.maxLength(20), Validators.pattern(LEI_PATTERN)]],
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
      intrmyAgt3AdrCtry: ['', Validators.maxLength(3)],
      intrmyAgt3AdrLine: [''],
      // Intermediary Agent 3 Account (flat)
      intrmyAgt3AcctId: [''],
      intrmyAgt3AcctCcy: [null],
      intrmyAgt3AcctTp: [''],
      intrmyAgt3AcctNm: [''],
      intrmyAgt3AcctSchmeNm: [''],
      intrmyAgt3AcctIssr: [''],
      intrmyAgt3PrxyCd: [''],
      intrmyAgt3PrxyId: [''],

      // Debtor (flat)
      dbtrNm: [''],
      dbtrBicfi: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
      dbtrClrSysIdCd: ['', Validators.maxLength(10)],
      dbtrMmbId: [''],
      dbtrLei: ['', [Validators.minLength(20), Validators.maxLength(20), Validators.pattern(LEI_PATTERN)]],
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
      dbtrAdrCtry: ['', Validators.maxLength(3)],
      dbtrAdrLine: [''],
      dbtrAdrLine1: [''],
      dbtrAdrLine2: [''],
      dbtrAdrLine3: [''],
      // Debtor Account (flat)
      dbtrAcctId: [''],
      dbtrAcctCcy: [null],
      dbtrAcctTp: [''],
      dbtrAcctNm: [''],
      dbtrAcctSchmeNm: [''],
      dbtrAcctIssr: [''],
      dbtrAcctPrxyCd: [''],
      dbtrAcctPrxyId: [''],

      // Debtor Agent (flat)
      dbtrAgtBicfi: ['', [Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
      dbtrAgtClrSysIdCd: ['', Validators.maxLength(10)],
      dbtrAgtMmbId: [''],
      dbtrAgtLei: ['', [Validators.minLength(20), Validators.maxLength(20), Validators.pattern(LEI_PATTERN)]],
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
      dbtrAgtAdrCtry: ['', Validators.maxLength(3)],
      dbtrAgtAdrLine: [''],
      // Debtor Agent Account (flat)
      dbtrAgtAcctId: [''],
      dbtrAgtAcctCcy: [null],
      dbtrAgtAcctTp: [''],
      dbtrAgtAcctNm: [''],
      dbtrAgtAcctSchmeNm: [''],
      dbtrAgtAcctIssr: [''],
      dbtrAgtAcctPrxyCd: [''],
      dbtrAgtAcctPrxyId: [''],

      // Creditor Agent (flat)
      cdtrAgtBicfi: ['', [Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
      cdtrAgtClrSysIdCd: ['', Validators.maxLength(10)],
      cdtrAgtMmbId: [''],
      cdtrAgtLei: ['', [Validators.minLength(20), Validators.maxLength(20), Validators.pattern(LEI_PATTERN)]],
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
      cdtrAgtAdrCtry: ['', Validators.maxLength(3)],
      cdtrAgtAdrLine: [''],
      // Creditor Agent Account (flat)
      cdtrAgtAcctId: [''],
      cdtrAgtAcctCcy: [null],
      cdtrAgtAcctTp: [''],
      cdtrAgtAcctNm: [''],
      cdtrAgtAcctSchmeNm: [''],
      cdtrAgtAcctIssr: [''],
      cdtrAgtAcctPrxyCd: [''],
      cdtrAgtAcctPrxyId: [''],

      // Creditor (flat)
      cdtrNm: [''],
      cdtrBicfi: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)]],
      cdtrClrSysIdCd: ['', Validators.maxLength(10)],
      cdtrMmbId: [''],
      cdtrLei: ['', [Validators.minLength(20), Validators.maxLength(20), Validators.pattern(LEI_PATTERN)]],
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
      cdtrAdrCtry: ['', Validators.maxLength(3)],
      cdtrAdrLine: [''],
      cdtrAdrLine1: [''],
      cdtrAdrLine2: [''],
      cdtrAdrLine3: [''],
      // Creditor Account (flat)
      cdtrAcctId: [''],
      cdtrAcctCcy: [null],
      cdtrAcctTp: [''],
      cdtrAcctNm: [''],
      cdtrAcctSchmeNm: [''],
      cdtrAcctIssr: [''],
      cdtrAcctPrxyCd: [''],
      cdtrAcctPrxyId: [''],

      // Instructions
      instructionForCreditorAgent: this.formBuilder.array([]),
      instructionForNextAgent: this.formBuilder.array([]),

      // Purpose
      purpCD: ['', Validators.maxLength(4)], // Purpose ExternalPurpose1Code max 4
      purpPrtry: ['', Validators.maxLength(35)], // Purpose Proprietary max 35

      // Remittance
      rmtInf: [''],
      // Other
      lastAction: [''],
      branchId: [''],
      trnRefNo20: [''],
      relatedRef21: [''],
    });

    // Ensure the form is properly initialized
    if (this.frmGroup) {
      // Use setTimeout to ensure form is fully initialized
      setTimeout(() => {
        FormGroupSignal.set(this.frmGroup);
      }, 0);
      // Initialize with one service level row
      this.addServiceRow();
      // Initialize with one instruction for creditor agent row
      this.addInstructionForCreditorAgentRow();
      // Initialize with one instruction for next agent row
      this.addInstructionForNextAgentRow();
    }
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
        if(ctrlNm==='fromBicfi' ){
          this.frmGroup.patchValue({'instgAgtBicfi': swiftCode});
          this.frmGroup.patchValue({'instgAgtNm': branchName});
        }
        if(ctrlNm==='toBicfi' ){
          this.frmGroup.patchValue({'instdAgtBicfi': swiftCode});
          this.frmGroup.patchValue({'instdAgtNm': branchName});
        }
        if(ctrlNm==='dbtrBicfi' ){
          this.frmGroup.patchValue({'dbtrAgtBicfi': swiftCode});
          this.frmGroup.patchValue({'dbtrAgtNm': branchName});
        }
        if(ctrlNm==='cdtrBicfi' ){
          this.frmGroup.patchValue({'cdtrAgtBicfi': swiftCode});
          this.frmGroup.patchValue({'cdtrAgtNm': branchName});
        }
      }
    });
  }

  resetForm(): void {
    if (this.frmGroup) {
      this.frmGroup.reset();
      // Set default values for required fields
      this.frmGroup.patchValue({
        bizMsgIdr: 'PACS009' + new Date().getTime(),
        msgDefIdr: 'pacs.009.001.08',
        bizSvc: 'swift.cbprplus.02',
        mktPrctcRegy: '',
        mktPrctcId: '',
        creDt: new Date().toISOString().split('T')[0],
        cpyDplct: null,
        priority: null,
        msgId: 'MSG' + new Date().getTime(),
        creDtTm: new Date().toISOString(),
        nbOfTxs: '1',
        sttlmMtd: null,
        fromBicfi: '',
        toBicfi: '',
        txId: 'TX' + new Date().getTime(),
        intrBkSttlmAmtCcy: null,
        intrBkSttlmAmt: '1000.00',
        intrBkSttlmDt: new Date().toISOString().split('T')[0],
        intrBkSttlmDbtDtTm: '',
        intrBkSttlmCdtDtTm: '',
        clstm: '',
        tilltm: '',
        frtm: '',
        rjcttm: '',
        // Reset reimbursement agent address fields
        instgRmbrsmntAgtAdrLine1: '',
        instgRmbrsmntAgtAdrLine2: '',
        instgRmbrsmntAgtAdrLine3: '',
        instgRmbrsmntAgtAdrDept: '',
        instgRmbrsmntAgtAdrSubDept: '',
        instgRmbrsmntAgtAdrStrtNm: '',
        instgRmbrsmntAgtAdrBldgNb: '',
        instgRmbrsmntAgtAdrBldgNm: '',
        instgRmbrsmntAgtAdrFlr: '',
        instgRmbrsmntAgtAdrPstBx: '',
        instgRmbrsmntAgtAdrRoom: '',
        instgRmbrsmntAgtAdrPstCd: '',
        instgRmbrsmntAgtAdrTwnNm: '',
        instgRmbrsmntAgtAdrTwnLctnNm: '',
        instgRmbrsmntAgtAdrDstrctNm: '',
        instgRmbrsmntAgtAdrCtrySubDvsn: '',
        instgRmbrsmntAgtAdrCtry: '',
        instgRmbrsmntAgtAdrLine: '',
        instdRmbrsmntAgtAdrLine1: '',
        instdRmbrsmntAgtAdrLine2: '',
        instdRmbrsmntAgtAdrLine3: '',
        instdRmbrsmntAgtAdrDept: '',
        instdRmbrsmntAgtAdrSubDept: '',
        instdRmbrsmntAgtAdrStrtNm: '',
        instdRmbrsmntAgtAdrBldgNb: '',
        instdRmbrsmntAgtAdrBldgNm: '',
        instdRmbrsmntAgtAdrFlr: '',
        instdRmbrsmntAgtAdrPstBx: '',
        instdRmbrsmntAgtAdrRoom: '',
        instdRmbrsmntAgtAdrPstCd: '',
        instdRmbrsmntAgtAdrTwnNm: '',
        instdRmbrsmntAgtAdrTwnLctnNm: '',
        instdRmbrsmntAgtAdrDstrctNm: '',
        instdRmbrsmntAgtAdrCtrySubDvsn: '',
        instdRmbrsmntAgtAdrCtry: '',
        instdRmbrsmntAgtAdrLine: ''
      });
      // Clear service levels and add one default row
      this.serviceLevels.clear();
      this.addServiceRow();

      // Clear instruction arrays and add one default row each
      this.instructionForCreditorAgent.clear();
      this.addInstructionForCreditorAgentRow();

      this.instructionForNextAgent.clear();
      this.addInstructionForNextAgentRow();

      // Clear stored CBS data
      this.clearStoredCBSData();
    }
  }

  /**
   * Clear stored CBS data from session storage
   */
  private clearStoredCBSData(): void {
    try {
      sessionStorage.removeItem('pacs009_cbsData');
      this.cbsData = null;
    } catch (error) {
      console.warn('Could not clear stored CBS data:', error);
    }
  }

  /**
   * Public method to manually clear CBS data
   */
  public clearCBSData(): void {
    this.clearStoredCBSData();
    this.toastr.info('CBS data cleared successfully', 'Data Cleared');
  }

  /**
   * Check if CBS data is available
   */
  public hasCBSData(): boolean {
    return this.cbsData !== null && this.cbsData !== undefined;
  }

  /**
   * Get current CBS data
   */
  public getCBSData(): any {
    return this.cbsData;
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

  // Helper method to get form validation errors
  getFormValidationErrors(): any {
    const errors: any = {};
    Object.keys(this.frmGroup.controls).forEach(key => {
      const control = this.frmGroup.get(key);
      if (control && control.invalid) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  generatePayload(): Mx009Model {
    let payload: any = {};
    let frmValue = this.frmGroup.value;

    // Business Message Header - Only fields that exist in DTO
    payload.charSet = frmValue.charSet;
    payload.bizMsgIdr = frmValue.bizMsgIdr;
    payload.msgDefIdr = frmValue.msgDefIdr;
    payload.bizSvc = frmValue.bizSvc;
    payload.mktPrctcRegy = frmValue.mktPrctcRegy;
    payload.mktPrctcId = frmValue.mktPrctcId;
    // Ensure date is in YYYY-MM-DD format only (no time/timezone)
    payload.creDt = frmValue.creDt 
      ? (typeof frmValue.creDt === 'string' 
          ? frmValue.creDt.split('T')[0] 
          : new Date(frmValue.creDt).toISOString().split('T')[0])
      : null;
    payload.cpyDplct = frmValue.cpyDplct;
    payload.pssblDplct = frmValue.pssblDplct;
    payload.priority = frmValue.priority;
    payload.msgId = frmValue.msgId;
    payload.creDtTm = frmValue.creDtTm;
    payload.nbOfTxs = frmValue.nbOfTxs;

    // Settlement Information
    payload.sttlmMtd = frmValue.sttlmMtd;

    // Map flat settlement account to nested structure
    payload.sttlmAcct = {
      id: frmValue.sttlmAcctId,
      iban: frmValue.sttlmAcctIban,
      ccy: frmValue.sttlmAcctCcy,
      tp: frmValue.sttlmAcctTp,
      tpCd: frmValue.sttlmAcctTpCd,
      tpPrtry: frmValue.sttlmAcctTpPrtry,
      nm: frmValue.sttlmAcctNm,
      prxyTpPrtry: frmValue.sttlmAcctPrxyTpPrtry,
      prxyTpCd: frmValue.sttlmAcctPrxyTpCd,
      prxyId: frmValue.sttlmAcctPrxyId,
      schmeNmCd: frmValue.sttlmAcctSchmeNmCd,
      schmeNmPrtry: frmValue.sttlmAcctSchmeNmPrtry,
      issr: frmValue.sttlmAcctIssr,
    };

    // Payment Identification
    payload.instrId = frmValue.instrId;
    payload.endToEndId = frmValue.endToEndId;
    payload.txId = frmValue.txId;
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
    // Ensure date is in YYYY-MM-DD format only (no time/timezone)
    payload.intrBkSttlmDt = frmValue.intrBkSttlmDt 
      ? (typeof frmValue.intrBkSttlmDt === 'string' 
          ? frmValue.intrBkSttlmDt.split('T')[0] 
          : new Date(frmValue.intrBkSttlmDt).toISOString().split('T')[0])
      : null;
    payload.intrBkSttlmDbtDtTm = frmValue.intrBkSttlmDbtDtTm;
    payload.intrBkSttlmCdtDtTm = frmValue.intrBkSttlmCdtDtTm;
    payload.sttlmPrty = frmValue.sttlmPrty;

    // Settlement Time Request
    const sttlmTmReq = {
      clsTm: frmValue.clstm || null,
      tillTm: frmValue.tilltm || null,
      frTm: frmValue.frtm || null,
      rjctTm: frmValue.rjcttm || null,
    };

    // Only add if at least one time field has a value
    if (sttlmTmReq.clsTm || sttlmTmReq.tillTm || sttlmTmReq.frTm || sttlmTmReq.rjctTm) {
      payload.sttlmTmReq = sttlmTmReq;
    } 

    // Agent BIC fields as per DTO
    payload.instgAgtBic = frmValue.instgAgtBicfi;
    payload.instdAgtBic = frmValue.instdAgtBicfi;

    // Map flat agents to nested structure - Fix field name from bIcfi to bicfi
    payload.instgAgt = {
      bicfi: frmValue.instgAgtBicfi,
      clrSysIdCd: frmValue.instgAgtClrSysIdCd,
      mmbId: frmValue.instgAgtMmbId,
      lei: frmValue.instgAgtLei || frmValue.fromLei,
    };

    payload.instdAgt = {
      bicfi: frmValue.instdAgtBicfi,
      clrSysIdCd: frmValue.instdAgtClrSysIdCd,
      mmbId: frmValue.instdAgtMmbId,
      lei: frmValue.instdAgtLei || frmValue.toLei,
    };

    // Map flat previous instructing agent 1 to nested structure - Fix field name from bIcfi to bicfi
    payload.prvsInstgAgt1 = {
      bicfi: frmValue.prvsInstgAgt1Bicfi,
      clrSysIdCd: frmValue.prvsInstgAgt1ClrSysIdCd,
      mmbId: frmValue.prvsInstgAgt1MmbId,
      lei: frmValue.prvsInstgAgt1Lei,
      nm: frmValue.prvsInstgAgt1Nm,
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
        adrLine: Array.isArray(frmValue.prvsInstgAgt1AdrLine) ? frmValue.prvsInstgAgt1AdrLine.filter(
          (line: string) => line && line.trim() !== ''
        ) : [frmValue.prvsInstgAgt1AdrLine1, frmValue.prvsInstgAgt1AdrLine2, frmValue.prvsInstgAgt1AdrLine3],
      },
    };

    payload.prvsInstgAgt1Acct = {
      id: frmValue.prvsInstgAgt1AcctId,
      ccy: frmValue.prvsInstgAgt1AcctCcy,
      tp: frmValue.prvsInstgAgt1AcctTp,
      nm: frmValue.prvsInstgAgt1AcctNm,
      schmeNm: frmValue.prvsInstgAgt1AcctSchmeNm,
      issr: frmValue.prvsInstgAgt1AcctIssr,
      prxy: {
        tp: frmValue.prvsInstgAgt1PrxyCd,
        id: frmValue.prvsInstgAgt1PrxyId
      }
    };

    // Map flat previous instructing agent 2 to nested structure - Fix field name from bIcfi to bicfi
    payload.prvsInstgAgt2 = {
      bicfi: frmValue.prvsInstgAgt2Bicfi,
      clrSysIdCd: frmValue.prvsInstgAgt2ClrSysIdCd,
      mmbId: frmValue.prvsInstgAgt2MmbId,
      lei: frmValue.prvsInstgAgt2Lei,
      nm: frmValue.prvsInstgAgt2Nm,
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
        adrLine: Array.isArray(frmValue.prvsInstgAgt2AdrLine) ? frmValue.prvsInstgAgt2AdrLine.filter(
          (line: string) => line && line.trim() !== ''
        ) : [frmValue.prvsInstgAgt2AdrLine1, frmValue.prvsInstgAgt2AdrLine2, frmValue.prvsInstgAgt2AdrLine3],
      },
    };

    payload.prvsInstgAgt2Acct = {
      id: frmValue.prvsInstgAgt2AcctId,
      ccy: frmValue.prvsInstgAgt2AcctCcy,
      tp: frmValue.prvsInstgAgt2AcctTp,
      nm: frmValue.prvsInstgAgt2AcctNm,
      schmeNm: frmValue.prvsInstgAgt2AcctSchmeNm,
      issr: frmValue.prvsInstgAgt2AcctIssr,
      prxy: {
        tp: frmValue.prvsInstgAgt2PrxyCd,
        id: frmValue.prvsInstgAgt2PrxyId
      }
    };

    // Map flat previous instructing agent 3 to nested structure - Fix field name from bIcfi to bicfi
    payload.prvsInstgAgt3 = {
      bicfi: frmValue.prvsInstgAgt3Bicfi,
      clrSysIdCd: frmValue.prvsInstgAgt3ClrSysIdCd,
      mmbId: frmValue.prvsInstgAgt3MmbId,
      lei: frmValue.prvsInstgAgt3Lei,
      nm: frmValue.prvsInstgAgt3Nm,
      
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
        adrLine: Array.isArray(frmValue.prvsInstgAgt3AdrLine) ? frmValue.prvsInstgAgt3AdrLine.filter(
          (line: string) => line && line.trim() !== ''
        ) : [frmValue.prvsInstgAgt3AdrLine1, frmValue.prvsInstgAgt3AdrLine2, frmValue.prvsInstgAgt3AdrLine3],
      },
    };

    payload.prvsInstgAgt3Acct = {
      id: frmValue.prvsInstgAgt3AcctId,
      ccy: frmValue.prvsInstgAgt3AcctCcy,
      tp: frmValue.prvsInstgAgt3AcctTp,
      nm: frmValue.prvsInstgAgt3AcctNm,
      schmeNm: frmValue.prvsInstgAgt3AcctSchmeNm,
      issr: frmValue.prvsInstgAgt3AcctIssr,
      prxy: {
        tp: frmValue.prvsInstgAgt3PrxyCd,
        id: frmValue.prvsInstgAgt3PrxyId
      }
    };

    // Map flat intermediary agents to nested structure - Fix field name from bIcfi to bicfi
    payload.intrmyAgt1 = {
      bicfi: frmValue.intrmyAgt1Bicfi,
      clrSysIdCd: frmValue.intrmyAgt1ClrSysIdCd,
      mmbId: frmValue.intrmyAgt1MmbId,
      lei: frmValue.intrmyAgt1Lei,
      nm: frmValue.intrmyAgt1Nm,
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
        adrLine: Array.isArray(frmValue.intrmyAgt1AdrLine) ? frmValue.intrmyAgt1AdrLine.filter(
          (line: string) => line && line.trim() !== ''
        ) : [frmValue.intrmyAgt1AdrLine1, frmValue.intrmyAgt1AdrLine2, frmValue.intrmyAgt1AdrLine3],
      },
    };

    payload.intrmyAgt1Acct = {
      id: frmValue.intrmyAgt1AcctId,
      ccy: frmValue.intrmyAgt1AcctCcy,
      tp: frmValue.intrmyAgt1AcctTp,
      nm: frmValue.intrmyAgt1AcctNm,
      schmeNm: frmValue.intrmyAgt1AcctSchmeNm,
      issr: frmValue.intrmyAgt1AcctIssr,
      prxy: {
        tp: frmValue.intrmyAgt1PrxyCd,
        id: frmValue.intrmyAgt1PrxyId
      }
    };

    payload.intrmyAgt2 = {
      bicfi: frmValue.intrmyAgt2Bicfi,
      clrSysIdCd: frmValue.intrmyAgt2ClrSysIdCd,
      mmbId: frmValue.intrmyAgt2MmbId,
      lei: frmValue.intrmyAgt2Lei,
      nm: frmValue.intrmyAgt2Nm,
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
        adrLine: Array.isArray(frmValue.intrmyAgt2AdrLine) ? frmValue.intrmyAgt2AdrLine.filter(
          (line: string) => line && line.trim() !== ''
        ) : [frmValue.intrmyAgt2AdrLine1, frmValue.intrmyAgt2AdrLine2, frmValue.intrmyAgt2AdrLine3],
      },
    };

    payload.intrmyAgt2Acct = {
      id: frmValue.intrmyAgt2AcctId,
      ccy: frmValue.intrmyAgt2AcctCcy,
      tp: frmValue.intrmyAgt2AcctTp,
      nm: frmValue.intrmyAgt2AcctNm,
      schmeNm: frmValue.intrmyAgt2AcctSchmeNm,
      issr: frmValue.intrmyAgt2AcctIssr,
      prxy: {
        tp: frmValue.intrmyAgt2PrxyCd,
        id: frmValue.intrmyAgt2PrxyId
      }
    };

    payload.intrmyAgt3 = {
      bicfi: frmValue.intrmyAgt3Bicfi,
      clrSysIdCd: frmValue.intrmyAgt3ClrSysIdCd,
      mmbId: frmValue.intrmyAgt3MmbId,
      lei: frmValue.intrmyAgt3Lei,
      nm: frmValue.intrmyAgt3Nm,
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
        adrLine: Array.isArray(frmValue.intrmyAgt3AdrLine) ? frmValue.intrmyAgt3AdrLine.filter(
          (line: string) => line && line.trim() !== ''
        ) : [frmValue.intrmyAgt3AdrLine1, frmValue.intrmyAgt3AdrLine2, frmValue.intrmyAgt3AdrLine3],
      },
    };

    payload.intrmyAgt3Acct = {
      id: frmValue.intrmyAgt3AcctId,
      ccy: frmValue.intrmyAgt3AcctCcy,
      tp: frmValue.intrmyAgt3AcctTp,
      nm: frmValue.intrmyAgt3AcctNm,
      schmeNm: frmValue.intrmyAgt3AcctSchmeNm,
      issr: frmValue.intrmyAgt3AcctIssr,
      prxy: {
        tp: frmValue.intrmyAgt3PrxyCd,
        id: frmValue.intrmyAgt3PrxyId
      }
    };

    // Map flat debtor to nested structure - Fix field name from bIcfi to bicfi
    payload.dbtr = {
      bicfi: frmValue.dbtrBicfi || '',
      clrSysIdCd: frmValue.dbtrClrSysIdCd || '',
      mmbId: frmValue.dbtrMmbId || '',
      lei: frmValue.dbtrLei || '',
      nm: frmValue.dbtrNm,
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
        adrLine: Array.isArray(frmValue.dbtrAdrLine) ? frmValue.dbtrAdrLine.filter(
          (line: string) => line && line.trim() !== ''
        ) : [frmValue.dbtrAdrLine1, frmValue.dbtrAdrLine2, frmValue.dbtrAdrLine3],
      },
    };

    payload.dbtrAcct = {
      id: frmValue.dbtrAcctId,
      ccy: frmValue.dbtrAcctCcy,
      tp: frmValue.dbtrAcctTp,
      nm: frmValue.dbtrAcctNm,
      schmeNm: frmValue.dbtrAcctSchmeNm,
      issr: frmValue.dbtrAcctIssr,
      prxy: {
        tp: frmValue.dbtrAcctPrxyCd,
        id: frmValue.dbtrAcctPrxyId
      }
    };

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
        adrLine: Array.isArray(frmValue.dbtrAgtAdrLine) ? frmValue.dbtrAgtAdrLine.filter(
          (line: string) => line && line.trim() !== ''
        ) : [frmValue.dbtrAgtAdrLine1, frmValue.dbtrAgtAdrLine2, frmValue.dbtrAgtAdrLine3],
      },
    };

    payload.dbtrAgtAcct = {
      id: frmValue.dbtrAgtAcctId,
      ccy: frmValue.dbtrAgtAcctCcy,
      tp: frmValue.dbtrAgtAcctTp,
      nm: frmValue.dbtrAgtAcctNm,
      schmeNm: frmValue.dbtrAgtAcctSchmeNm,
      issr: frmValue.dbtrAgtAcctIssr,
      prxy: {
        tp: frmValue.dbtrAgtAcctPrxyCd,
        id: frmValue.dbtrAgtAcctPrxyId
      }
    };

    // Map flat creditor agent to nested structure - Fix field name from bIcfi to bicfi
    payload.cdtrAgt = {
      bicfi: frmValue.cdtrAgtBicfi,
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
        adrLine: Array.isArray(frmValue.cdtrAgtAdrLine) ? frmValue.cdtrAgtAdrLine.filter(
          (line: string) => line && line.trim() !== ''
        ) : [],
      },
    };

    payload.cdtrAgtAcct = {
      id: frmValue.cdtrAgtAcctId,
      ccy: frmValue.cdtrAgtAcctCcy,
      tp: frmValue.cdtrAgtAcctTp,
      nm: frmValue.cdtrAgtAcctNm,
      schmeNm: frmValue.cdtrAgtAcctSchmeNm,
      issr: frmValue.cdtrAgtAcctIssr,
      prxy: {
        tp: frmValue.cdtrAgtAcctPrxyCd,
        id: frmValue.cdtrAgtAcctPrxyId
      }
    };

    // Map flat creditor to nested structure - Fix field name from bIcfi to bicfi
    payload.cdtr = {
      bicfi: frmValue.cdtrBicfi || '',
      clrSysIdCd: frmValue.cdtrClrSysIdCd || '',
      mmbId: frmValue.cdtrMmbId || '',
      lei: frmValue.cdtrLei || '',
      nm: frmValue.cdtrNm,
      adrLine1: frmValue.cdtrAdrLine1 || '',
      adrLine2: frmValue.cdtrAdrLine2 || '',
      adrLine3: frmValue.cdtrAdrLine3 || '',
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
        adrLine: Array.isArray(frmValue.cdtrAdrLine) ? frmValue.cdtrAdrLine.filter(
          (line: string) => line && line.trim() !== ''
        ) : [],
      },
    };

    payload.cdtrAcct = {
      id: frmValue.cdtrAcctId,
      ccy: frmValue.cdtrAcctCcy,
      tp: frmValue.cdtrAcctTp,
      nm: frmValue.cdtrAcctNm,
      schmeNm: frmValue.cdtrAcctSchmeNm,
      issr: frmValue.cdtrAcctIssr,
      prxy: {
        tp: frmValue.cdtrAcctPrxyCd,
        id: frmValue.cdtrAcctPrxyId
      }
    };

    // Instructions
    // Map instruction for creditor agent FormArray to individual fields as per DTO
    const creditorAgentInstructions = frmValue.instructionForCreditorAgent || [];
    // First instruction (CD1/Inf1)
    payload.instrForCdtrAgtCD = creditorAgentInstructions[0]?.code || '';
    payload.instrForCdtrAgtInf = creditorAgentInstructions[0]?.info || '';
    // Second instruction (CD2/Inf2)
    payload.instrForCdtrAgtCD2 = creditorAgentInstructions[1]?.code || '';
    payload.instrForCdtrAgtInf2 = creditorAgentInstructions[1]?.info || '';

    // Map instruction for next agent FormArray to individual fields as per DTO
    const nextAgentInstructions = frmValue.instructionForNextAgent || [];
    payload.instrForNxtAgt1 = nextAgentInstructions[0]?.instruction || '';
    payload.instrForNxtAgt2 = nextAgentInstructions[1]?.instruction || '';
    payload.instrForNxtAgt3 = nextAgentInstructions[2]?.instruction || '';
    payload.instrForNxtAgt4 = nextAgentInstructions[3]?.instruction || '';
    payload.instrForNxtAgt5 = nextAgentInstructions[4]?.instruction || '';
    payload.instrForNxtAgt6 = nextAgentInstructions[5]?.instruction || '';

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
    payload.trnRefNo20 = frmValue.trnRefNo20 || '';
    payload.relatedRef21 = frmValue.relatedRef21;

    // Related (flat)
    payload.rltd = {
      charSet: frmValue.rltdCharSet,
      fr: {
        bicfi: frmValue.rltdFromBicfi,
        clrSysIdCd: frmValue.rltdFromClrSysIdCd,
        mmbId: frmValue.rltdFromMmbId,
        lei: frmValue.rltdFromLei,
      },
      to: {
        bicfi: frmValue.rltdToBicfi,
        clrSysIdCd: frmValue.rltdToClrSysIdCd,
        mmbId: frmValue.rltdToMmbId,
        lei: frmValue.rltdToLei,
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

    // Map flat reimbursement agents to nested structure
    payload.instgRmbrsmntAgt = {
      bicfi: frmValue.instgRmbrsmntAgtBicfi,
      clrSysIdCd: frmValue.instgRmbrsmntAgtClrSysIdCd,
      mmbId: frmValue.instgRmbrsmntAgtMmbId,
      lei: frmValue.instgRmbrsmntAgtLei,
      nm: frmValue.instgRmbrsmntAgtNm,
      adr: {
        dept: frmValue.instgRmbrsmntAgtAdrDept,
        subDept: frmValue.instgRmbrsmntAgtAdrSubDept,
        strtNm: frmValue.instgRmbrsmntAgtAdrStrtNm,
        bldgNb: frmValue.instgRmbrsmntAgtAdrBldgNb,
        bldgNm: frmValue.instgRmbrsmntAgtAdrBldgNm,
        flr: frmValue.instgRmbrsmntAgtAdrFlr,
        pstBx: frmValue.instgRmbrsmntAgtAdrPstBx,
        room: frmValue.instgRmbrsmntAgtAdrRoom,
        pstCd: frmValue.instgRmbrsmntAgtAdrPstCd,
        twnNm: frmValue.instgRmbrsmntAgtAdrTwnNm,
        twnLctnNm: frmValue.instgRmbrsmntAgtAdrTwnLctnNm,
        dstrctNm: frmValue.instgRmbrsmntAgtAdrDstrctNm,
        ctrySubDvsn: frmValue.instgRmbrsmntAgtAdrCtrySubDvsn,
        ctry: frmValue.instgRmbrsmntAgtAdrCtry,
        adrLine: Array.isArray(frmValue.instgRmbrsmntAgtAdrLine) ? frmValue.instgRmbrsmntAgtAdrLine.filter(
          (line: string) => line && line.trim() !== ''
        ) : [frmValue.instgRmbrsmntAgtAdrLine1, frmValue.instgRmbrsmntAgtAdrLine2, frmValue.instgRmbrsmntAgtAdrLine3],
      },
    };

    payload.instgRmbrsmntAgtAcct = {
      id: frmValue.instgRmbrsmntAgtAcctId,
      ccy: frmValue.instgRmbrsmntAgtAcctCcy,
      tp: frmValue.instgRmbrsmntAgtAcctTp,
      nm: frmValue.instgRmbrsmntAgtAcctNm,
      prxy: {
        tp: frmValue.instgRmbrsmntAgtPrxyCd,
        id: frmValue.instgRmbrsmntAgtPrxyId
      }
    };

    payload.instdRmbrsmntAgt = {
      bicfi: frmValue.instdRmbrsmntAgtBicfi,
      clrSysIdCd: frmValue.instdRmbrsmntAgtClrSysIdCd,
      mmbId: frmValue.instdRmbrsmntAgtMmbId,
      lei: frmValue.instdRmbrsmntAgtLei,
      nm: frmValue.instdRmbrsmntAgtNm,
      adr: {
        dept: frmValue.instdRmbrsmntAgtAdrDept,
        subDept: frmValue.instdRmbrsmntAgtAdrSubDept,
        strtNm: frmValue.instdRmbrsmntAgtAdrStrtNm,
        bldgNb: frmValue.instdRmbrsmntAgtAdrBldgNb,
        bldgNm: frmValue.instdRmbrsmntAgtAdrBldgNm,
        flr: frmValue.instdRmbrsmntAgtAdrFlr,
        pstBx: frmValue.instdRmbrsmntAgtAdrPstBx,
        room: frmValue.instdRmbrsmntAgtAdrRoom,
        pstCd: frmValue.instdRmbrsmntAgtAdrPstCd,
        twnNm: frmValue.instdRmbrsmntAgtAdrTwnNm,
        twnLctnNm: frmValue.instdRmbrsmntAgtAdrTwnLctnNm,
        dstrctNm: frmValue.instdRmbrsmntAgtAdrDstrctNm,
        ctrySubDvsn: frmValue.instdRmbrsmntAgtAdrCtrySubDvsn,
        ctry: frmValue.instdRmbrsmntAgtAdrCtry,
        adrLine: Array.isArray(frmValue.instdRmbrsmntAgtAdrLine) ? frmValue.instdRmbrsmntAgtAdrLine.filter(
          (line: string) => line && line.trim() !== ''
        ) : [ frmValue.instdRmbrsmntAgtAdrLine1, frmValue.instdRmbrsmntAgtAdrLine2, frmValue.instdRmbrsmntAgtAdrLine3],
      },
    };

    payload.instdRmbrsmntAgtAcct = {
      id: frmValue.instdRmbrsmntAgtAcctId,
      ccy: frmValue.instdRmbrsmntAgtAcctCcy,
      tp: frmValue.instdRmbrsmntAgtAcctTp,
      nm: frmValue.instdRmbrsmntAgtAcctNm,
      prxy: {
        tp: frmValue.instdRmbrsmntAgtPrxyCd,
        id: frmValue.instdRmbrsmntAgtPrxyId
      }
    };

    return payload as Mx009Model;
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

    this.pacs009Service.save(payload).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.toastr.success('PACS.009 message saved successfully!', 'Success');
      },
      error: (error) => {
        let errorMessage = 'Failed to save PACS.009 message';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        this.toastr.error(errorMessage, 'Error');
      },
    });
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
        instruction: ['', Validators.maxLength(35)],
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
}
