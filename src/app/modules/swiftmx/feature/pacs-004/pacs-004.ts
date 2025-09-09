import {
  Component,
  effect,
  inject,
  OnInit,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';
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
import {Mx004Service} from '../../service/mx004.service';
import {AmountToWordInput} from "../../../../shared/components/input-types/amount-to-word-input/amount-to-word-input";
import {AgentComponent} from '../../components/agent/agent';
import { Mx004Model } from '../../model/mx004.model';
import {BusinessApplicationHeader} from '../../components/business-application-header/business-application-header';
import {DataSelectionModal} from '../../../../shared/components/data-selection-modal/data-selection-modal';
import {BranchInfoService} from '../../../../shared/services/branch-info.service';
import {ExpansionPanelHeader} from '../../../../shared/components/expansion-panel-header/expansion-panel-header';
import { BicSelectionService } from '../../../../shared/services/bic-selection.service';
import {
  ExpansionSubPanelHeader
} from '../../../../shared/components/expansion-sub-panel-header/expansion-sub-panel-header';
import { CurrencyService } from '../../../../shared/services/currency.service';
import { CurrencyModel } from '../../../../shared/models/currency.model';
import {Subject, takeUntil} from 'rxjs';

// @ts-ignore
@Component({
  selector: 'app-pacs-004',
  imports: [
    ReactiveFormsModule,
    SelectOptionField,
    TextBaseInput,
    DateInput,

    //BusinessApplicationHeader,
    ExpansionPanelHeader,
    ExpansionSubPanelHeader
  ],
  templateUrl: './pacs-004.html',
  standalone: true,
  styleUrl: './pacs-004.scss'
})
export class Pacs004 implements OnInit, OnDestroy {
  branchInfoService = inject(BranchInfoService);
  formBuilder = inject(FormBuilder);
  mx004Service = inject(Mx004Service);
  toastr = inject(ToastrService);
  currencyService = inject(CurrencyService);
  frmGroup: FormGroup;

  onClickReset = ONCLICK_RESET;
  onClickSave = ONCLICK_SAVE;

  isPickTableDialogOpen = signal<boolean>(false);
  pickTablePair = signal<Map<string, string>>(new Map());
  pickTableDataSource = signal<any[]>([]);

  businessHeaderPanel: WritableSignal<boolean> = signal(true);
  fromBicPanel: WritableSignal<boolean> = signal(true);
  pmtRtr: WritableSignal<boolean> = signal(true);
  toBicPanel: WritableSignal<boolean> = signal(true);
  relatedInfoPanel: WritableSignal<boolean> = signal(true);
  GrpHdr: WritableSignal<boolean> = signal(true);
  SttlmInf: WritableSignal<boolean> = signal(true);
  SttlmAcct: WritableSignal<boolean> = signal(true);
  SttlmAcctId: WritableSignal<boolean> = signal(true);
  SttlmAcctIdOthr: WritableSignal<boolean> = signal(true);
  SttlmAcctIdOthrSchmeNm: WritableSignal<boolean> = signal(true);
  SttlmAcctTp: WritableSignal<boolean> = signal(true);
  SttlmAcctPrxy: WritableSignal<boolean> = signal(true);
  SttlmAcctPrxyTp: WritableSignal<boolean> = signal(true);
  TxInf: WritableSignal<boolean> = signal(true);
  TxInfOrgnlGrpInf: WritableSignal<boolean> = signal(true);
  TxInfSttlmTmIndctn: WritableSignal<boolean> = signal(true);
  TxInfChrgsInf: WritableSignal<boolean> = signal(true);
  TxInfChrgsInfAgt: WritableSignal<boolean> = signal(true);
  TxInfChrgsInfAgtFinInstnId: WritableSignal<boolean> = signal(true);
  TxInfChrgsInfAgtFinInstnIdClrSysMmbIdClrSysId: WritableSignal<boolean> = signal(true);
  TxInfChrgsInfAgtFinInstnIdClrSysMmbId: WritableSignal<boolean> = signal(true);
  TxInfChrgsInfAgtFinInstnIdPstlAdr: WritableSignal<boolean> = signal(true);
  TxInfInstgAgt: WritableSignal<boolean> = signal(true);
  TxInfInstgAgtFinInstnId: WritableSignal<boolean> = signal(true);
  TxInfInstgAgtFinInstnIdClrSysMmbId: WritableSignal<boolean> = signal(true);
  TxInfInstgAgtFinInstnIdClrSysMmbIdClrSysId: WritableSignal<boolean> = signal(true);
  TxInfInstdAgt: WritableSignal<boolean> = signal(true);
  TxInfInstdAgtFinInstnId: WritableSignal<boolean> = signal(true);
  TxInfInstdAgtFinInstnIdClrSysMmbId: WritableSignal<boolean> = signal(true);
  TxInfInstdAgtFinInstnIdClrSysMmbIdClrSysId: WritableSignal<boolean> = signal(true);
  TxInfRtrChain: WritableSignal<boolean> = signal(true);
  TxInfRtrChainUltmtDbtr: WritableSignal<boolean> = signal(true);
  TxInfRtrChainUltmtDbtrPty: WritableSignal<boolean> = signal(true);
  TxInfRtrChainUltmtDbtrPtyPstlAdr: WritableSignal<boolean> = signal(true);
  TxInfRtrChainUltmtDbtrPtyId: WritableSignal<boolean> = signal(true);
  TxInfRtrChainUltmtDbtrPtyIdOrgId: WritableSignal<boolean> = signal(true);
  TxInfRtrChainUltmtDbtrPtyIdOrgIdOthr: WritableSignal<boolean> = signal(true);
  TxInfRtrChainUltmtDbtrPtyIdOrgIdOthrSchmeNm: WritableSignal<boolean> = signal(true);
  TxInfRtrChainUltmtDbtrPtyIdPrvtId: WritableSignal<boolean> = signal(true);
  TxInfRtrChainUltmtDbtrPtyIdPrvtIdDtAndPlcOfBirth: WritableSignal<boolean> = signal(true);
  TxInfRtrChainUltmtDbtrPtyIdPrvtIdOthr: WritableSignal<boolean> = signal(true);
  TxInfRtrChainUltmtDbtrPtyIdPrvtIdOthrSchmeNm: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtr: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrPty: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrPtyPstlAdr: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrPtyPstlAdrId: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrPtyIdOrgId: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrPtyIdOrgIdOthr: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrPtyIdOrgIdOthrSchmeNm: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrPtyIdPrvtId: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrPtyIdPrvtIdDtAndPlcOfBirth: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrPtyIdPrvtIdOthr: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrPtyIdPrvtIdOthrSchmeNm: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrAgt: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrAgtFinInstnId: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrAgtFinInstnIdClrSysMmbId: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrAgtFinInstnIdClrSysMmbIdClrSysId: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrAgtFinInstnIdPstlAdr: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrAgt1: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrAgt1FinInstnId: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrAgt1FinInstnIdClrSysMmbId: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrAgt1FinInstnIdClrSysMmbIdClrSysId: WritableSignal<boolean> = signal(true);
  TxInfRtrChainDbtrAgt1FinInstnIdPstlAdr: WritableSignal<boolean> = signal(true);
  TxInfRtrChainPrvsInstgAgt1: WritableSignal<boolean> = signal(true);
  TxInfRtrChainPrvsInstgAgt1FinInstnId: WritableSignal<boolean> = signal(true);
  TxInfRtrChainPrvsInstgAgt1FinInstnIdClrSysMmbId: WritableSignal<boolean> = signal(true);
  TxInfRtrChainPrvsInstgAgt1FinInstnIdClrSysMmbIdClrSysId: WritableSignal<boolean> = signal(true);
  TxInfRtrChainPrvsInstgAgt1FinInstnIdPstlAdr: WritableSignal<boolean> = signal(true);
  mktPrctcPanel: WritableSignal<boolean> = signal(true);
  rltdToBicPanel: WritableSignal<boolean> = signal(true);
  rltdFromBicPanel: WritableSignal<boolean> = signal(true);
  TxInfRtrChainInitgPty: WritableSignal<boolean> = signal(true);
  TxInfRtrChainInitgPtyPty: WritableSignal<boolean> = signal(true);
  TxInfRtrChainInitgPtyPtyPstlAdr: WritableSignal<boolean> = signal(true);
  TxInfRtrChainInitgPtyPtyId: WritableSignal<boolean> = signal(true);
  TxInfRtrChainInitgPtyPtyIdOrgId: WritableSignal<boolean> = signal(true);
  TxInfRtrChainInitgPtyPtyIdOthr: WritableSignal<boolean> = signal(true);
  TxInfRtrChainInitgPtyPtyIdOthrSchmeNm: WritableSignal<boolean> = signal(true);
  TxInfRtrChainInitgPtyPtyIdPrvtId: WritableSignal<boolean> = signal(true);
  TxInfRtrChainInitgPtyPtyIdPrvtIdDtAndPlcOfBirth: WritableSignal<boolean> = signal(true);
  TxInfRtrChainInitgPtyPtyIdPrvtIdOthr: WritableSignal<boolean> = signal(true);
  TxInfRtrChainInitgPtyPtyIdPrvtIdOthrSchmeNm: WritableSignal<boolean> = signal(true);
  currencies: CurrencyModel[] = [];
  onPickclick(): void {
    this.isPickTableDialogOpen.set(true);
    this.pickTableDataSource.set([]);
    this.pickTablePair.set(new Map());

    this.branchInfoService.getBySwiftCodePrefix('MTBLBDDH').subscribe({
      next: data => {
        if (data.status) {
          this.pickTablePair.set(new Map([
            ['branchId', 'Branch Id'],
            ['branchName', 'Branch Name'],
            ['swift', 'Swift']
          ]));
          this.pickTableDataSource.set(data?.payload);
        }

      }, error: err => {
        console.error('Error:', err);
      }
    });
  }

  closeDialog(data: any) {
    this.isPickTableDialogOpen.set(false);
    if (data) {
      this.frmGroup.get('toBic')?.setValue(data?.swift);
    }
  }



  priorityOptions: SelectOptionsModel[] = [
    { key: 'HIGH', value: 'High' },
    { key: 'NORM', value: 'Normal' },
  ];

  duplicateOptions: SelectOptionsModel[] = [
    {key: 'CODU', value: 'CODU'},
    {key: 'COPY', value: 'COPY'},
    {key: 'DUPL', value: 'DUPL'}
  ];
  TxInfChrgsInfAgtFinInstnIdPstlAdrStrtCtryOptions: SelectOptionsModel[] = [
    {key: '001', value: 'USA'},
    {key: '002', value: 'Bangladesh'},
    {key: '003', value: 'India'}
  ];
  TxInfRtrChainUltmtDbtrPtyPstlAdrCtryOptions: SelectOptionsModel[] = [
    {key: '001', value: 'USA'},
    {key: '002', value: 'Bangladesh'},
    {key: '003', value: 'India'}
  ];
  TxInfRtrChainUltmtDbtrPtyCtryOfResOptions: SelectOptionsModel[] = [
    {key: '001', value: 'USA'},
    {key: '002', value: 'Bangladesh'},
    {key: '003', value: 'India'}
  ];
  TxInfRtrChainDbtrPtyIdPrvtIdDtAndPlcOfBirthCtryOfBirthOptions: SelectOptionsModel[] = [
    {key: '001', value: 'USA'},
    {key: '002', value: 'Bangladesh'},
    {key: '003', value: 'India'}
  ];
  TxInfRtrChainUltmtDbtrPtyIdPrvtIdDtAndPlcOfBirthCtryOfBirthOptions: SelectOptionsModel[] = [
    {key: '001', value: 'USA'},
    {key: '002', value: 'Bangladesh'},
    {key: '003', value: 'India'}
  ];

  TxInfRtrChainDbtrPtyPstlAdrCtryOptions: SelectOptionsModel[] = [
    {key: '001', value: 'USA'},
    {key: '002', value: 'Bangladesh'},
    {key: '003', value: 'India'}
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

  possibleDuplicateOptions: SelectOptionsModel[] = [
    {key: 'YES', value: 'Yes'},
    {key: 'NO', value: 'No'}
  ];
  TypeOptions: SelectOptionsModel[] = [
    {key: 'Cd', value: 'Code'},
    {key: 'Prtry', value: 'Proprietary'}
  ];

  sttlmMtdOptions: SelectOptionsModel[] = [

    {key: 'COVE', value: 'Cover Method'},
    {key: 'INDA', value: 'Instructed Agent'},
    {key: 'INGA', value: 'Instructing Agent'}
  ];

  TxInfChrgBrOptions: SelectOptionsModel[] = [
    {key: 'CRED', value: 'Borne By Creditor'},
    {key: 'DEBT', value: 'Borne By Debtor'},
    {key: 'SHAR', value: 'Shared'},
    {key: 'SLEV', value: 'Following Service Level'},
  ];

  SttlmAcctCcyOptions: SelectOptionsModel[] = [
    {key: '001', value: 'USD'},
    {key: '000', value: 'BDT'}
  ];
  TxInfSttlmPrtyOptions: SelectOptionsModel[] = [
    {key: 'HIGH', value: 'High'},
    {key: 'NORM', value: 'Normal'},
    {key: 'URGT', value: 'Urgent'}
  ];
  currencyOptions: SelectOptionsModel[] = [];
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

  ngOnDestroy(): void {
        this.destroy$.next();
      this.destroy$.complete();
    }


  ngOnInit(): void {
    this.initForm();
    this.loadCurrencies();
  }

  initForm(): void {
    this.frmGroup = this.formBuilder.group({
      // Business Message Header
      charSet: [''],
      fromBicfi: ['', Validators.required],
      fromMembId: [''],
      fromClrSysIdCd: [''],
      fromLei: ['',[Validators.minLength(20), Validators.maxLength(20), Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      toMembId: [''],
      toBicfi: ['', Validators.required],
      toClrSysIdCd: [''],
      toLei: ['',[Validators.minLength(20), Validators.maxLength(20), Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      bizMsgIdr: ['PACS009_' + new Date().getTime(), Validators.required],
      msgDefIdr: ['pacs.009.001.08', Validators.required],
      bizSvc: ['swift.cbprplus.02', Validators.required],
      creDt: [new Date()],


      cpyDplct: [null],
      psblDplct: [null],
      priority: ['NORM'],
      msgId: ['MSG_' + new Date().getTime(), Validators.required],
      creDtTm: [new Date().toISOString(), Validators.required],
      //Market Practice Start
      mktPrctcRegy: [],
      mktPrctcId: [],
      //Market Practice End

      //Related Information Start
      rltdCharSet: [],
      rltdFromBicfi:['',Validators.required],
      rltdFromMembId:[''],
      rltdFromLei: ['',[Validators.minLength(20), Validators.maxLength(20), Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      rltdToBicfi: ['',Validators.required],
      rltdToMembId: [''],
      rltdToLei: ['',[Validators.minLength(20), Validators.maxLength(20), Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
      rltdBizMsgIdr: ['',Validators.required],
      rltdMsgDefIdr: ['',Validators.required],
      rltdBizSvc: [''],
      rltdCreDt: ['',Validators.required],
      rltdCpyDplct: [''],
      rltdPrty: [''],
      //Related Information End

      //  Payment Return V09
      //  Payment Return V09 -> Group Header
      GrpHdrmsgId: ['', Validators.required], // MessageIdentification //0-9 a-z A-Z / - ? : ( ) . , ' +
      GrpHdrcreDtTm: [''],
      GrpHdrNbOfTxs: [''],
      //  Payment Return V09 -> Group Header -> Settlement Information
      sttlmMtd: [null, [Validators.required]],
      // Payment Return V09 -> Group Header -> Settlement Information -> Settlement Account
      // Payment Return V09 -> Group Header -> Settlement Information -> Settlement Account ->Identification
      SttlmAcctiban: ['', Validators.required],

      SttlmAcctCcy: [null],
      SttlmAcctNm: [''],



      // Payment Return V09 -> Group Header -> Settlement Information -> Settlement Account ->Proxy
      SttlmAcctPrxyId: [''],


      // Payment Return V09 -> Group Header -> Settlement Information -> Settlement Account ->Identification -> Other
      SttlmAcctIdOthrId: [''],
      SttlmAcctIdOthrIssr: [''],


      // Payment Return V09 -> Group Header -> Settlement Information -> Settlement Account ->Identification -> Other -> SchemeName
      SttlmAcctIdOthrSchmeNmCd: [''],
      SttlmAcctIdOthrSchmeNmPrtry: [''],


      // Payment Return V09 -> Group Header -> Settlement Information -> Settlement Account ->Type
      SttlmAcctTpCd: [''],
      SttlmAcctTpPrtry: [''],


      // Payment Return V09 -> Group Header -> Settlement Information -> Settlement Account -> Proxy ->Type
      SttlmAcctPrxyTpCd: [''],
      SttlmAcctPrxyTpPrtry: [''],


      // Payment Return V09 ->  Transaction Information
      TxInfRtrId: ['',],
      TxInfOrgnlInstrId: ['',],
      TxInfOrgnlEndToEndId: [''],
      TxInfOrgnlTxId: [''],
      TxInfOrgnlUETR: [''],
      TxInfOrgnlClrSysRef: [''],
      TxInfOrgnlIntrBkSttlmAmt: [],
      TxInfRtrdIntrBkSttlmAmt: [],
      TxInfOrgnlIntrBkSttlmDt: [],
      TxInfSttlmPrty: ['HIGH'],
      TxInfRtrdInstdAmt: [],
      TxInfXchgRate: [],
      TxInfChrgBr: ['CRED', Validators.required],

      // Payment Return V09 -> Transaction Information->Original Group Information
      TxInforgnlMsgId: [''], // MessageIdentification //0-9 a-z A-Z / - ? : ( ) . , ' +
      TxInforgnlMsgNmId: [''], // MessageIdentification //0-9 a-z A-Z / - ? : ( ) . , ' +
      TxInforgnlCreDtTm: [''],
      TxInfChrgsInfAgtFinInstnIdPstlAdrDept: [],
      TxInfChrgsInfAgtFinInstnIdPstlAdrSubDept: [],
      TxInfChrgsInfAgtFinInstnIdPstlAdrStrtNm: [],
      TxInfChrgsInfAgtFinInstnIdPstlAdrStrtBldgNb: [],
      TxInfChrgsInfAgtFinInstnIdPstlAdrStrtBldgNm: [],
      TxInfChrgsInfAgtFinInstnIdPstlAdrStrtFlr: [],
      TxInfChrgsInfAgtFinInstnIdPstlAdrStrtPstBx: [],
      TxInfChrgsInfAgtFinInstnIdPstlAdrStrtRoom: [],
      TxInfChrgsInfAgtFinInstnIdPstlAdrStrtPstCd: [],
      TxInfChrgsInfAgtFinInstnIdPstlAdrStrtTwnNm: [],
      TxInfChrgsInfAgtFinInstnIdPstlAdrStrtTwnLctnNm: [],
      TxInfChrgsInfAgtFinInstnIdPstlAdrStrtDstrctNm: [],
      TxInfChrgsInfAgtFinInstnIdPstlAdrStrtCtrySubDvsn: [],
      TxInfChrgsInfAgtFinInstnIdPstlAdrStrtCtry: [null],
      TxInfChrgsInfAgtFinInstnIdPstlAdrStrtAdrLine: [],
      TxInfClrSysRef: [],


      // Payment Return V09 -> Transaction Information->Original Group Information -> Settlement Time Indication
      TxInfSttlmTmIndctnDbtDtTm: [],
      TxInfSttlmTmIndctnCdtDtTm: [],

      TxInfChrgsInfAgtFinInstnIdBICFI: [],
      TxInfChrgsInfAgtFinInstnIdLEI: [],
      TxInfChrgsInfAgtFinInstnIdNm: [],
      TxInfChrgsInfAgtFinInstnIdClrSysIdCd: [],
      TxInfChrgsInfAgtFinInstnIdClrSysMmbIdMmbId: [],
      // Payment Return V09 -> Transaction Information->Original Group Information -> Charges Information
      TxInfChrgsInfAmt: [],

      TxInfInstgAgtFinInstnIdBICFI: [],
      TxInfInstgAgtFinInstnIdLEI: [],
      TxInfInstgAgtFinInstnIdClrSysMmbIdClrSysIdCd: [],
      TxInfInstgAgtFinInstnIdClrSysMmbIdMmbId: [],


      TxInfInstdAgtFinInstnIdBICFI: [],
      TxInfInstdAgtFinInstnIdClrSysMmbIdClrSysIdCd: [],
      TxInfInstdAgtFinInstnIdClrSysMmbIdMmbId: [],
      TxInfInstdAgtFinInstnIdLEI: [],


      TxInfRtrChainUltmtDbtrPtyNm: [],
      TxInfRtrChainUltmtDbtrPtyPstlAdrDept: [],
      TxInfRtrChainUltmtDbtrPtyPstlAdrSubDept: [],
      TxInfRtrChainUltmtDbtrPtyPstlAdrStrtNm: [],
      TxInfRtrChainUltmtDbtrPtyPstlAdrBldgNb: [],
      TxInfRtrChainUltmtDbtrPtyPstlAdrBldgNm: [],
      TxInfRtrChainUltmtDbtrPtyPstlAdrFlr: [],
      TxInfRtrChainUltmtDbtrPtyPstlAdrPstBx: [],
      TxInfRtrChainUltmtDbtrPtyPstlAdrRoom: [],
      TxInfRtrChainUltmtDbtrPtyPstlAdrPstCd: [],
      TxInfRtrChainUltmtDbtrPtyPstlAdrTwnNm: [],
      TxInfRtrChainUltmtDbtrPtyPstlAdrTwnLctnNm: [],
      TxInfRtrChainUltmtDbtrPtyPstlAdrDstrctNm: [],
      TxInfRtrChainUltmtDbtrPtyPstlAdrCtrySubDvsn: [],
      TxInfRtrChainUltmtDbtrPtyPstlAdrCtry: [null],

      TxInfRtrChainUltmtDbtrPtyIdOrgIdAnyBIC: [],
      TxInfRtrChainUltmtDbtrPtyIdOrgIdLEI: [],

      TxInfRtrChainUltmtDbtrPtyIdOrgIdOthrId: [],
      TxInfRtrChainUltmtDbtrPtyIdOrgIdOthrSchmeNmCd: [],
      TxInfRtrChainUltmtDbtrPtyIdOrgIdOthrSchmeNmPrtry: [],
      TxInfRtrChainUltmtDbtrPtyIdOrgIdOthrIssr: [],

      TxInfRtrChainUltmtDbtrPtyIdPrvtIdDtAndPlcOfBirthBirthDt: [],
      TxInfRtrChainUltmtDbtrPtyIdPrvtIdDtAndPlcOfBirthPrvcOfBirth: [],
      TxInfRtrChainUltmtDbtrPtyIdPrvtIdDtAndPlcOfBirthCityOfBirth: [],
      TxInfRtrChainUltmtDbtrPtyIdPrvtIdDtAndPlcOfBirthCtryOfBirth: [null],
      TxInfRtrChainUltmtDbtrPtyIdPrvtIdOthrId: [],

      TxInfRtrChainUltmtDbtrPtyIdPrvtIdOthrIssr: [],
      TxInfRtrChainUltmtDbtrPtyCtryOfRes: [null],


      TxInfRtrChainDbtrPtyNm: [],
      TxInfRtrChainDbtrPtyPstlAdrDept: [],
      TxInfRtrChainDbtrPtyPstlAdrSubDept: [],
      TxInfRtrChainDbtrPtyPstlAdrBldgNb: [],
      TxInfRtrChainDbtrPtyPstlAdrBldgNm: [],
      TxInfRtrChainDbtrPtyPstlAdrFlr: [],
      TxInfRtrChainDbtrPtyPstlAdrPstBx: [],
      TxInfRtrChainDbtrPtyPstlAdrRoom: [],
      TxInfRtrChainDbtrPtyPstlAdrPstCd: [],
      TxInfRtrChainDbtrPtyPstlAdrTwnNm: [],
      TxInfRtrChainDbtrPtyPstlAdrTwnLctnNm: [],
      TxInfRtrChainDbtrPtyPstlAdrDstrctNm: [],
      TxInfRtrChainDbtrPtyPstlAdrCtrySubDvsn: [],
      TxInfRtrChainDbtrPtyPstlAdrCtry: [null],
      TxInfRtrChainDbtrPtyPstlAdrAdrLine: [],
      TxInfRtrChainDbtrPtyIdOrgIdAnyBIC: [],
      TxInfRtrChainDbtrPtyIdOrgIdLEI: [],
      TxInfRtrChainDbtrPtyIdOrgIdOthrId: [],
      TxInfRtrChainDbtrPtyIdOrgIdOthrSchmeNmCd: [],
      TxInfRtrChainDbtrPtyIdOrgIdOthrSchmeNmPrtry: [],
      TxInfRtrChainDbtrPtyIdOrgIdOthrIssr: [],

      TxInfRtrChainDbtrPtyIdPrvtIdDtAndPlcOfBirthBirthDt: [],
      TxInfRtrChainDbtrPtyIdPrvtIdDtAndPlcOfBirthPrvcOfBirth: [],
      TxInfRtrChainDbtrPtyIdPrvtIdDtAndPlcOfBirthCityOfBirth: [],
      TxInfRtrChainDbtrPtyIdPrvtIdDtAndPlcOfBirthCtryOfBirth: [null],
      TxInfRtrChainDbtrPtyIdPrvtIdOthrId: [],
      TxInfRtrChainDbtrPtyIdPrvtIdOthrSchmeNmCd: [],
      TxInfRtrChainDbtrPtyIdPrvtIdOthrSchmeNmPrtry: [],
      TxInfRtrChainDbtrPtyIdPrvtIdOthrIssr: [],
      TxInfRtrChainDbtrPtyCtryOfRes: [],
      TxInfRtrChainDbtrAgtFinInstnIdBICFI: [],
      TxInfRtrChainDbtrAgtFinInstnIdClrSysMmbIdClrSysIdCd: [],
      TxInfRtrChainDbtrAgtFinInstnIdClrSysMmbIdMmbId: [],
      TxInfRtrChainDbtrAgtFinInstnIdLEI: [],
      TxInfRtrChainDbtrAgtFinInstnIdNm: [],
      TxInfRtrChainDbtrAgtFinInstnIdPstlAdrDept: [],
      TxInfRtrChainDbtrAgtFinInstnIdPstlAdrSubDept: [],
      TxInfRtrChainDbtrAgtFinInstnIdPstlAdrStrtNm: [],
      TxInfRtrChainDbtrAgtFinInstnIdPstlAdrBldgNb: [],
      TxInfRtrChainDbtrAgtFinInstnIdPstlAdrBldgNm: [],
      TxInfRtrChainDbtrAgtFinInstnIdPstlAdrFlr: [],
      TxInfRtrChainDbtrAgtFinInstnIdPstlAdrPstBx: [],
      TxInfRtrChainDbtrAgtFinInstnIdPstlAdrRoom: [],
      TxInfRtrChainDbtrAgtFinInstnIdPstlAdrPstCd: [],
      TxInfRtrChainDbtrAgtFinInstnIdPstlAdrTwnNm: [],
      TxInfRtrChainDbtrAgtFinInstnIdPstlAdrTwnLctnNm: [],
      TxInfRtrChainDbtrAgtFinInstnIdPstlAdrDstrctNm: [],
      TxInfRtrChainDbtrAgtFinInstnIdPstlAdrCtrySubDvsn: [],
      TxInfRtrChainDbtrAgtFinInstnIdPstlAdrCtry: [null],
      TxInfRtrChainDbtrAgtFinInstnIdPstlAdrAdrLine: [],
      // TxInfRtrChainInitgPty: [],
      TxInfRtrChainDbtrAgt1FinInstnIdBICFI: [],
      TxInfRtrChainDbtrAgt1FinInstnIdLEI: [],
      TxInfRtrChainDbtrAgt1FinInstnIdNm: [],
      TxInfRtrChainDbtrAgt1FinInstnIdClrSysMmbIdClrSysIdCd: [],
      TxInfRtrChainDbtrAgt1FinInstnIdClrSysMmbIdMmbId: [],
      TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrDept: [],
      TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrSubDept: [],
      TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrStrtNm: [],
      TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrBldgNb: [],
      TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrBldgNm: [],
      TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrFlr: [],
      TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrPstBx: [],
      TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrRoom: [],
      TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrPstCd: [],
      TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrTwnNm: [],
      TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrTwnLctnNm: [],
      TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrDstrctNm: [],
      TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrCtrySubDvsn: [],
      TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrCtry: [],
      TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrAdrLine: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdBICFI: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdClrSysMmbIdMmbId: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdClrSysMmbIdClrSysIdCd: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdLEI: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdNm: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdPstlAdrDept: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdPstlAdrSubDept: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdPstlAdrStrtNm: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdPstlAdrBldgNb: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdPstlAdrBldgNm: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdPstlAdrFlr: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdPstlAdrPstBx: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdPstlAdrRoom: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdPstlAdrPstCd: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdPstlAdrTwnNm: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdPstlAdrTwnLctnNm: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdPstlAdrDstrctNm: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdPstlAdrCtrySubDvsn: [],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdPstlAdrCtry: [null],
      TxInfRtrChainPrvsInstgAgt1FinInstnIdPstlAdrAdrLine: [],

      TxInfRtrChainUltmtDbtrPtyIdPrvtIdOthrSchmeNmPrtry: [],
      TxInfRtrChainDbtrPtyPstlAdrStrtNm: [],
      TxInfRtrChainUltmtDbtrPtyIdPrvtIdOthrSchmeNmCd: [],
      TxInfOrgnlIntrBkSttlmAmtCcy:[null],
      TxInfRtrdIntrBkSttlmAmtCcy:[null],
      TxInfRtrdInstdAmtCcy:[null],
      TxInfChrgsInfAmtCcy:[null],


      TxInfRtrChainInitgPtyPtyNm: [],
      TxInfRtrChainInitgPtyPtyPstlAdrDept: [],
      TxInfRtrChainInitgPtyPtyPstlAdrSubDept: [],
      TxInfRtrChainInitgPtyPtyPstlAdrStrtNm: [],
      TxInfRtrChainInitgPtyPtyPstlAdrBldgNb: [],
      TxInfRtrChainInitgPtyPtyPstlAdrBldgNm: [],
      TxInfRtrChainInitgPtyPtyPstlAdrFlr: [],
      TxInfRtrChainInitgPtyPtyPstlAdrPstBx: [],
      TxInfRtrChainInitgPtyPtyPstlAdrRoom: [],
      TxInfRtrChainInitgPtyPtyPstlAdrPstCd: [],
      TxInfRtrChainInitgPtyPtyPstlAdrTwnNm: [],
      TxInfRtrChainInitgPtyPtyPstlAdrTwnLctnNm: [],
      TxInfRtrChainInitgPtyPtyPstlAdrDstrctNm: [],
      TxInfRtrChainInitgPtyPtyPstlAdrCtrySubDvsn: [],
      TxInfRtrChainInitgPtyPtyPstlAdrCtry: [null],
      TxInfRtrChainInitgPtyPtyPstlAdrAdrLine: [],
      TxInfRtrChainInitgPtyPtyIdOrgIdAnyBIC: [],
      TxInfRtrChainInitgPtyPtyIdOrgIdLEI: [],
      TxInfRtrChainInitgPtyPtyIdOthrId: [],
      TxInfRtrChainInitgPtyPtyIdOthrSchmeNmCd: [],
      TxInfRtrChainInitgPtyPtyIdOthrSchmeNmPrtry: [],
      TxInfRtrChainInitgPtyPtyIdOthrIssr: [],
      TxInfRtrChainInitgPtyPtyIdPrvtIdDtAndPlcOfBirthBirthDt: [],
      TxInfRtrChainInitgPtyPtyIdPrvtIdDtAndPlcOfBirthPrvcOfBirth: [],
      TxInfRtrChainInitgPtyPtyIdPrvtIdDtAndPlcOfBirthCityOfBirth: [],
      TxInfRtrChainInitgPtyPtyIdPrvtIdDtAndPlcOfBirthCtryOfBirth: [null],
      TxInfRtrChainInitgPtyPtyIdPrvtIdOthrId: [],
      TxInfRtrChainInitgPtyPtyIdPrvtIdOthrSchmeNmCd: [],
      TxInfRtrChainInitgPtyPtyIdPrvtIdOthrSchmeNmPrtry: [],
      TxInfRtrChainInitgPtyPtyIdPrvtIdOthrIssr: [],
      TxInfRtrChainInitgPtyPtyCtryOfRes: [null],



    });






    this.frmGroup.get('rsnCd')?.valueChanges.subscribe(value => {
      const prtryControl = this.frmGroup.get('rsnPrtry');
      if (value) {
        prtryControl?.setValue('');
        prtryControl?.clearValidators();
      } else {
        prtryControl?.setValidators(Validators.required);
      }
      prtryControl?.updateValueAndValidity({emitEvent: false});
    });

    this.frmGroup.get('rsnPrtry')?.valueChanges.subscribe(value => {
      const cdControl = this.frmGroup.get('rsnCd');
      if (value) {
        cdControl?.setValue('');
        cdControl?.clearValidators();
      } else {
        cdControl?.setValidators(Validators.required);
      }
      cdControl?.updateValueAndValidity({emitEvent: false});
    });
  }

  generatePayload(): Mx004Model {
    debugger;
    let payload: any = {};
    let frmValue = this.frmGroup.value;

    // Business Message Header - Only fields that exist in DTO Statrt
    // FROM Start
    payload.charSet = frmValue.payload;
    payload.fromBicfi = frmValue.fromBicfi;
    payload.fromMembId = frmValue.fromMembId;
    payload.fromLei = frmValue.fromLei;
    // FROM end
    // TO Start
    payload.toBicfi = frmValue.toBicfi;
    payload.toMembId = frmValue.toMembId;
    payload.toLei = frmValue.toLei;
    // TO end
    payload.bizMsgIdr = frmValue.bizMsgIdr;
    payload.msgDefIdr = frmValue.msgDefIdr;
    payload.bizSvc = frmValue.bizSvc;
    payload.creDt = frmValue.creDt;
    payload.cpyDplct = frmValue.cpyDplct;
    payload.pssblDplct = frmValue.pssblDplct;
    payload.priority = frmValue.priority;
    //payload.msgId = frmValue.msgId;
    payload.creDtTm = frmValue.creDtTm;
    //payload.nbOfTxs = frmValue.nbOfTxs;
    payload.fromBicfi=frmValue.fromBicfi ;
    payload.fromMembId=frmValue.fromMembId ;

    //Market Practice Start
    payload.mktPrctcRegy=frmValue.mktPrctcRegy ;
    payload.mktPrctcId=frmValue.fromMembId ;
    //Market Practice End

    // Related Information Start
    payload.rltd = {
      charSet: frmValue.charSet,
      fr:{
        bicfi:frmValue.rltdFromBicfi,
        clrSysIdCd:frmValue.fromClrSysIdCd,
        mmbId:frmValue.rltdFromMembId,
        lei:frmValue.rltdFromLei,
      },
      to:{
        bicfi:frmValue.rltdToBicfi,
        clrSysIdCd:frmValue.toClrSysIdCd,
        mmbId:frmValue.rltdFromMembId,
        lei:frmValue.rltdToLei,
      },
      bizMsgIdr: frmValue.rltdBizMsgIdr,
      msgDefIdr: frmValue.rltdMsgDefIdr,
      bizSvc: frmValue.rltdBizSvc,
      creDt: frmValue.rltdCreDt,
      cpyDplct: frmValue.rltdCpyDplct,
      prty: frmValue.rltdPrty,

    };
    // Business Message Header - Only fields that exist in DTO END

    // Group Header  Information
    payload.grpHdrmsgId = frmValue.GrpHdrmsgId;
    payload.grpHdrNbOfTxs = frmValue.GrpHdrNbOfTxs;
    payload.grpHdrcreDtTm = frmValue.GrpHdrcreDtTm;

    // Settlement Information
    payload.sttlmMtd = frmValue.sttlmMtd;

    // // Map flat settlement account to nested structure
    payload.sttlmAcct = {
      iban: frmValue.SttlmAcctiban,
      id:frmValue.SttlmAcctIdOthrId,
      issr: frmValue.SttlmAcctIdOthrIssr,
      schmeNmCd:frmValue.SttlmAcctIdOthrSchmeNmCd,
      schmeNmPrtry:frmValue.SttlmAcctIdOthrSchmeNmPrtry,
      tpCd: frmValue.SttlmAcctTpCd,
      tpPrtry: frmValue.SttlmAcctTpPrtry,
      ccy: frmValue.SttlmAcctCcy,
      nm: frmValue.SttlmAcctNm,
      prxyTpCd: frmValue.SttlmAcctPrxyTpCd,
      prxyTpPrtry: frmValue.SttlmAcctPrxyTpPrtry,
      prxyId: frmValue.SttlmAcctPrxyId,
    };
    //
    // // Payment Return V09 -> Transaction Information

    payload.rtrId = frmValue.TxInfRtrId;
    payload.orgnlMsgId = frmValue.TxInforgnlMsgId;
    payload.orgnlMsgNmId = frmValue.TxInforgnlMsgNmId;
    payload.orgnlCreDtTm = frmValue.TxInforgnlCreDtTm;
    payload.orgnlInstrId = frmValue.TxInfOrgnlInstrId;
    payload.orgnlEndToEndId = frmValue.TxInfOrgnlEndToEndId;
    payload.orgnlTxId = frmValue.TxInfOrgnlTxId;
    payload.orgnlUETR = frmValue.TxInfOrgnlUETR;
    payload.orgnlClrSysRef = frmValue.TxInfOrgnlClrSysRef;
    payload.orgnlIntrBkSttlmCcy = frmValue.TxInfOrgnlIntrBkSttlmAmtCcy;
    payload.orgnlIntrBkSttlmAmt = frmValue.TxInfOrgnlIntrBkSttlmAmt;
    payload.orgnlIntrBkSttlmDt = frmValue.TxInfOrgnlIntrBkSttlmDt;
    payload.rtrdIntrBkSttlmAmt = frmValue.TxInfRtrdIntrBkSttlmAmt;
    payload.rtrdIntrBkSttlmCcy = frmValue.TxInfRtrdIntrBkSttlmAmtCcy;
    payload.sttlmPrty = frmValue.TxInfSttlmPrty;
    payload.rtrdInstdCcy = frmValue.TxInfRtrdInstdAmtCcy;
    payload.rtrdInstdAmt = frmValue.TxInfRtrdInstdAmt;
    payload.xchgRate = frmValue.TxInfXchgRate;
    payload.chrgBr = frmValue.TxInfChrgBr;
    payload.clrSysRef = frmValue.TxInfClrSysRef;

    //Payment Return V09 -> Transaction Information->Original Group Information -> Settlement Time Indication
    payload.dbtDtTm = frmValue.TxInfSttlmTmIndctnDbtDtTm;
    payload.cdtDtTm = frmValue.TxInfSttlmTmIndctnCdtDtTm;

    //Payment Return V09 -> Transaction Information->Original Group Information -> Charges Information
    payload.chgCcy = frmValue.TxInfChrgsInfAmtCcy;
    payload.chgAmt = frmValue.TxInfChrgsInfAmt;
    //Payment Return V09 -> Transaction Information->Original Group Information -> Charges Information -> Agent
    payload.chrgsInfAgnt = {
      bicfi: frmValue.TxInfChrgsInfAgtFinInstnIdBICFI,
      clrSysIdCd: frmValue.TxInfChrgsInfAgtFinInstnIdClrSysIdCd,
      mmbId: frmValue.TxInfChrgsInfAgtFinInstnIdClrSysMmbIdMmbId,
      lei: frmValue.TxInfChrgsInfAgtFinInstnIdLEI,
      nm: frmValue.TxInfChrgsInfAgtFinInstnIdNm,
        adr: {
          dept: frmValue.TxInfChrgsInfAgtFinInstnIdPstlAdrDept,
          subDept: frmValue.TxInfChrgsInfAgtFinInstnIdPstlAdrSubDept,
          strtNm: frmValue.TxInfChrgsInfAgtFinInstnIdPstlAdrStrtNm,
          bldgNb: frmValue.TxInfChrgsInfAgtFinInstnIdPstlAdrStrtBldgNb,
          bldgNm: frmValue.TxInfChrgsInfAgtFinInstnIdPstlAdrStrtBldgNm,
          flr: frmValue.TxInfChrgsInfAgtFinInstnIdPstlAdrStrtFlr,
          pstBx: frmValue.TxInfChrgsInfAgtFinInstnIdPstlAdrStrtPstBx,
          room: frmValue.TxInfChrgsInfAgtFinInstnIdPstlAdrStrtRoom,
          pstCd: frmValue.TxInfChrgsInfAgtFinInstnIdPstlAdrStrtPstCd,
          twnNm: frmValue.TxInfChrgsInfAgtFinInstnIdPstlAdrStrtTwnNm,
          twnLctnNm: frmValue.TxInfChrgsInfAgtFinInstnIdPstlAdrStrtTwnLctnNm,
          dstrctNm: frmValue.TxInfChrgsInfAgtFinInstnIdPstlAdrStrtDstrctNm,
          ctrySubDvsn: frmValue.TxInfChrgsInfAgtFinInstnIdPstlAdrStrtCtrySubDvsn,
          ctry: frmValue.TxInfChrgsInfAgtFinInstnIdPstlAdrStrtCtry,
          adrLine: Array.isArray(frmValue.TxInfChrgsInfAgtFinInstnIdPstlAdrStrtAdrLine) ? frmValue.TxInfChrgsInfAgtFinInstnIdPstlAdrStrtAdrLine.filter(
            (line: string) => line && line.trim() !== ''
          ) : [],
        },
    };
    //Payment Return V09 -> Transaction Information->Charges Information -> Instructing Agent
    payload.instgAgt = {
      bicfi: frmValue.TxInfInstgAgtFinInstnIdBICFI,
      clrSysIdCd: frmValue.TxInfInstgAgtFinInstnIdClrSysMmbIdClrSysIdCd,
      mmbId: frmValue.TxInfInstgAgtFinInstnIdClrSysMmbIdMmbId,
      lei: frmValue.TxInfInstgAgtFinInstnIdLEI,

    };
    //Payment Return V09 -> Transaction Information->Charges Information -> Instructed Agent
    payload.instdAgt = {
      bicfi: frmValue.TxInfInstdAgtFinInstnIdBICFI,
      clrSysIdCd: frmValue.TxInfInstdAgtFinInstnIdClrSysMmbIdClrSysIdCd,
      mmbId: frmValue.TxInfInstdAgtFinInstnIdClrSysMmbIdMmbId,
      lei: frmValue.TxInfInstdAgtFinInstnIdLEI,

    };
    //Payment Return V09 -> Transaction Information->ReturnChain
    payload.ultmtDbtr ={
      nm: frmValue.TxInfRtrChainUltmtDbtrPtyNm,
      address:{
        dept: frmValue.TxInfRtrChainUltmtDbtrPtyPstlAdrDept,
        subDept: frmValue.TxInfRtrChainUltmtDbtrPtyPstlAdrSubDept,
        strtNm: frmValue.TxInfRtrChainUltmtDbtrPtyPstlAdrStrtNm,
        bldgNb: frmValue.TxInfRtrChainUltmtDbtrPtyPstlAdrBldgNb,
        bldgNm: frmValue.TxInfRtrChainUltmtDbtrPtyPstlAdrBldgNm,
        flr: frmValue.TxInfRtrChainUltmtDbtrPtyPstlAdrFlr,
        pstBx: frmValue.TxInfRtrChainUltmtDbtrPtyPstlAdrPstBx,
        room: frmValue.TxInfRtrChainUltmtDbtrPtyPstlAdrRoom,
        pstCd: frmValue.TxInfRtrChainUltmtDbtrPtyPstlAdrPstCd,
        twnNm: frmValue.TxInfRtrChainUltmtDbtrPtyPstlAdrTwnNm,
        twnLctnNm: frmValue.TxInfRtrChainUltmtDbtrPtyPstlAdrTwnLctnNm,
        dstrctNm: frmValue.TxInfRtrChainUltmtDbtrPtyPstlAdrDstrctNm,
        ctrySubDvsn: frmValue.TxInfRtrChainUltmtDbtrPtyPstlAdrCtrySubDvsn,
        ctry: frmValue.TxInfRtrChainUltmtDbtrPtyPstlAdrCtry,

      },
      orgIdBic:frmValue.TxInfRtrChainUltmtDbtrPtyIdOrgIdAnyBIC,
      orgIdLEI:frmValue.TxInfRtrChainUltmtDbtrPtyIdOrgIdLEI,
      orgOtherList:[{ orgIdOthrId:frmValue.TxInfRtrChainUltmtDbtrPtyIdOrgIdOthrId,
        orgIdOthrScNmCd:frmValue.TxInfRtrChainUltmtDbtrPtyIdOrgIdOthrSchmeNmCd,
        orgIdOthrScNmPrty:frmValue.TxInfRtrChainUltmtDbtrPtyIdOrgIdOthrSchmeNmPrtry,
        orgIdOthrIssr:frmValue.TxInfRtrChainUltmtDbtrPtyIdOrgIdOthrIssr}],

      ctryOfRes:frmValue.TxInfRtrChainUltmtDbtrPtyCtryOfRes,
      birthDt:frmValue.TxInfRtrChainUltmtDbtrPtyIdPrvtIdDtAndPlcOfBirthBirthDt,
      prvcOfBirth:frmValue.TxInfRtrChainUltmtDbtrPtyIdPrvtIdDtAndPlcOfBirthPrvcOfBirth,
      cityOfBirth:frmValue.TxInfRtrChainUltmtDbtrPtyIdPrvtIdDtAndPlcOfBirthCityOfBirth,
      ctryOfBirth:frmValue.TxInfRtrChainUltmtDbtrPtyIdPrvtIdDtAndPlcOfBirthCtryOfBirth,


    };

    payload.dbtr ={
      Nm: frmValue.TxInfRtrChainDbtrPtyNm,
      address:{
        dept: frmValue.TxInfRtrChainDbtrPtyPstlAdrDept,
        subDept: frmValue.TxInfRtrChainDbtrPtyPstlAdrSubDept,
        strtNm: frmValue.TxInfRtrChainDbtrPtyPstlAdrStrtNm,
        bldgNb: frmValue.TxInfRtrChainDbtrPtyPstlAdrBldgNb,
        bldgNm: frmValue.TxInfRtrChainDbtrPtyPstlAdrBldgNm,
        flr: frmValue.TxInfRtrChainDbtrPtyPstlAdrFlr,
        pstBx: frmValue.TxInfRtrChainDbtrPtyPstlAdrPstBx,
        room: frmValue.TxInfRtrChainDbtrPtyPstlAdrRoom,
        pstCd: frmValue.TxInfRtrChainDbtrPtyPstlAdrPstCd,
        twnNm: frmValue.TxInfRtrChainDbtrPtyPstlAdrTwnNm,
        twnLctnNm: frmValue.TxInfRtrChainDbtrPtyPstlAdrTwnLctnNm,
        dstrctNm: frmValue.TxInfRtrChainDbtrPtyPstlAdrDstrctNm,
        ctrySubDvsn: frmValue.TxInfRtrChainDbtrPtyPstlAdrCtrySubDvsn,
        ctry: frmValue.TxInfRtrChainDbtrPtyPstlAdrCtry,

      },
      orgIdBic:frmValue.TxInfRtrChainDbtrPtyIdOrgIdAnyBIC,
      orgIdLei:frmValue.TxInfRtrChainDbtrPtyIdOrgIdLEI,
      orgIdOthrId:frmValue.TxInfRtrChainDbtrPtyIdOrgIdOthrId,
      orgIdOthrScNmCd:frmValue.TxInfRtrChainDbtrPtyIdOrgIdOthrSchmeNmCd,
      orgIdOthrScNmPrty:frmValue.TxInfRtrChainDbtrPtyIdOrgIdOthrSchmeNmPrtry,
      orgIdOthrIssr:frmValue.TxInfRtrChainDbtrPtyIdOrgIdOthrIssr,
      ctryOfRes:frmValue.TxInfRtrChainDbtrPtyCtryOfRes,
      birthDt:frmValue.TxInfRtrChainDbtrPtyIdPrvtIdDtAndPlcOfBirthBirthDt,
      prvcOfBirth:frmValue.TxInfRtrChainDbtrPtyIdPrvtIdDtAndPlcOfBirthPrvcOfBirth,
      cityOfBirth:frmValue.TxInfRtrChainDbtrPtyIdPrvtIdDtAndPlcOfBirthCityOfBirth,
      ctryOfBirth:frmValue.TxInfRtrChainDbtrPtyIdPrvtIdDtAndPlcOfBirthCtryOfBirth,
      prvtOthId1:frmValue.TxInfRtrChainDbtrPtyIdOrgIdOthrId,
      prvtOthIdSchNmCd1:frmValue.TxInfRtrChainDbtrPtyIdOrgIdOthrSchmeNmCd,
      prvtOthIdSchNmPrtry1:frmValue.TxInfRtrChainDbtrPtyIdOrgIdOthrSchmeNmPrtry,
      prvtOthIdIssr1:frmValue.TxInfRtrChainDbtrPtyIdOrgIdOthrIssr,
    };

    payload.initgPty ={
      Nm: frmValue.TxInfRtrChainInitgPtyPtyNm,
      address:{
        dept: frmValue.TxInfRtrChainInitgPtyPtyPstlAdrDept,
        subDept: frmValue.TxInfRtrChainInitgPtyPtyPstlAdrSubDept,
        strtNm: frmValue.TxInfRtrChainInitgPtyPtyPstlAdrStrtNm,
        bldgNb: frmValue.TxInfRtrChainInitgPtyPtyPstlAdrBldgNb,
        bldgNm: frmValue.TxInfRtrChainInitgPtyPtyPstlAdrBldgNm,
        flr: frmValue.TxInfRtrChainInitgPtyPtyPstlAdrFlr,
        pstBx: frmValue.TxInfRtrChainInitgPtyPtyPstlAdrPstBx,
        room: frmValue.TxInfRtrChainInitgPtyPtyPstlAdrRoom,
        pstCd: frmValue.TxInfRtrChainInitgPtyPtyPstlAdrPstCd,
        twnNm: frmValue.TxInfRtrChainInitgPtyPtyPstlAdrTwnNm,
        twnLctnNm: frmValue.TxInfRtrChainInitgPtyPtyPstlAdrTwnLctnNm,
        dstrctNm: frmValue.TxInfRtrChainInitgPtyPtyPstlAdrDstrctNm,
        ctrySubDvsn: frmValue.TxInfRtrChainInitgPtyPtyPstlAdrCtrySubDvsn,
        ctry: frmValue.TxInfRtrChainInitgPtyPtyPstlAdrCtry,


      },
      orgIdBic:frmValue.TxInfRtrChainInitgPtyPtyIdOrgIdAnyBIC,
      orgIdLei:frmValue.TxInfRtrChainInitgPtyPtyIdOrgIdLEI,
      orgIdOthrId:frmValue.TxInfRtrChainInitgPtyPtyIdOthrId,
      orgIdOthrScNmCd:frmValue.TxInfRtrChainInitgPtyPtyIdOthrSchmeNmCd,
      orgIdOthrScNmPrty:frmValue.TxInfRtrChainInitgPtyPtyIdOthrSchmeNmPrtry,
      orgIdOthrIssr:frmValue.TxInfRtrChainInitgPtyPtyIdOthrIssr,
      ctryOfRes:frmValue.TxInfRtrChainInitgPtyPtyCtryOfRes,
      birthDt:frmValue.TxInfRtrChainInitgPtyPtyIdPrvtIdDtAndPlcOfBirthBirthDt,
      prvcOfBirth:frmValue.TxInfRtrChainInitgPtyPtyIdPrvtIdDtAndPlcOfBirthPrvcOfBirth,
      cityOfBirth:frmValue.TxInfRtrChainInitgPtyPtyIdPrvtIdDtAndPlcOfBirthCityOfBirth,
      ctryOfBirth:frmValue.TxInfRtrChainInitgPtyPtyIdPrvtIdDtAndPlcOfBirthCtryOfBirth,
      prvtOthId1:frmValue.TxInfRtrChainInitgPtyPtyIdPrvtIdOthrId,
      prvtOthIdSchNmCd1:frmValue.TxInfRtrChainInitgPtyPtyIdPrvtIdOthrSchmeNmCd,
      prvtOthIdSchNmPrtry1:frmValue.TxInfRtrChainInitgPtyPtyIdPrvtIdOthrSchmeNmPrtry,
      prvtOthIdIssr1:frmValue.TxInfRtrChainInitgPtyPtyIdPrvtIdOthrIssr,
    };

    payload.dbtrAgt = {
      bicfi: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdBICFI,
      clrSysIdCd: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdClrSysMmbIdClrSysIdCd,
      mmbId: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdClrSysMmbIdMmbId,
      lei: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdLEI,
      nm: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdNm,
      adr:{
        dept: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrDept,
        subDept: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrSubDept,
        strtNm: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrStrtNm,
        bldgNb: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrBldgNb,
        bldgNm: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrBldgNm,
        flr: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrFlr,
        pstBx: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrPstBx,
        room: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrRoom,
        pstCd: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrPstCd,
        twnNm: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrTwnNm,
        twnLctnNm: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrTwnLctnNm,
        dstrctNm: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrDstrctNm,
        ctrySubDvsn: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrCtrySubDvsn,
        ctry: frmValue.TxInfRtrChainDbtrAgt1FinInstnIdPstlAdrCtry,


      },
    };

    return payload as Mx004Model;
  }

  save(): void {
    debugger;
    // if (this.frmGroup.invalid) {
    //   this.toastr.error(
    //     'Please fill in all required fields',
    //     'Validation Error'
    //   );
    //   return;
    // }

    // Additional validation for required fields
    if (!this.validateRequiredFields()) {
      return;
    }

    const payload = this.generatePayload();

    this.mx004Service.save(payload).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.toastr.success('PACS.004 message saved successfully!', 'Success');
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



  openBicSelectionModal(ctrlNm :string, nameField:string|null = null) :void{
    const val = {
      bicField : ctrlNm,
      defaultValue : 'SCBLBDDX',
    };

    this.bicSelectionService.openBicSelectionModal(
      this.frmGroup,
      val).subscribe(selectedData => {
      if (selectedData) {
        const { swiftCode, branchName } = selectedData;ctrlNm
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
    this.frmGroup.reset();
    this.frmGroup.patchValue({
      date: new Date()
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

  // private mapServiceDataToForm(data: any): void {
  //   if (!this.frmGroup) return;
  //
  //   // Ensure currencies are loaded before mapping
  //   if (this.currencyOptions.length === 0) {
  //     this.loadCurrencies();
  //     // Wait for currencies to load then map data
  //     setTimeout(() => {
  //       this.mapServiceDataToForm(data);
  //     }, 100);
  //     return;
  //   }
  //
  //   // Find the correct currency option
  //   const currencyOption = this.currencyOptions.find(option =>
  //     option.key.toLowerCase() === data.isoSwiftCode.toLowerCase()
  //   );
  //
  //   this.frmGroup.patchValue({
  //     instrId: data.trnRefNo20,
  //     endToEndId: data.relatedRef21,
  //     intrBkSttlmAmt: data.valAmt32a,
  //     intrBkSttlmAmtCcy: currencyOption ? currencyOption.key : data.isoSwiftCode,
  //     instgAgtAdrLine: data.benfInstNmAddrs58d,
  //     fromBicfi: data.senderBic,
  //     instgAgtBicfi: data.senderBic,
  //   });
  // }

  // save() {
  //   this.mx002Service.save(this.frmGroup.value).subscribe(res => {
  //     console.log(res);
  //   })
  // }

}
