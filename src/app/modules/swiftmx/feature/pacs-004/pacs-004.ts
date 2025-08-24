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
import {Mx004Service} from '../../service/mx004.service';
import {AmountToWordInput} from "../../../../shared/components/input-types/amount-to-word-input/amount-to-word-input";
import {AgentComponent} from '../../components/agent/agent';
import {BusinessApplicationHeader} from '../../components/business-application-header/business-application-header';
import {DataSelectionModal} from '../../../../shared/components/data-selection-modal/data-selection-modal';
import {BranchInfoService} from '../../../../shared/services/branch-info.service';
import {ExpansionPanelHeader} from '../../../../shared/components/expansion-panel-header/expansion-panel-header';
import {
  ExpansionSubPanelHeader
} from '../../../../shared/components/expansion-sub-panel-header/expansion-sub-panel-header';

@Component({
  selector: 'app-pacs-004',
  imports: [
    ReactiveFormsModule,
    SelectOptionField,
    TextBaseInput,
    DateInput,

    BusinessApplicationHeader,
    ExpansionPanelHeader,
    ExpansionSubPanelHeader
  ],
  templateUrl: './pacs-004.html',
  standalone: true,
  styleUrl: './pacs-004.scss'
})
export class Pacs004 implements OnInit {
  branchInfoService = inject(BranchInfoService);
  formBuilder = inject(FormBuilder);
  mx004Service = inject(Mx004Service);
  toastr = inject(ToastrService);
  frmGroup : FormGroup;

  onClickReset = ONCLICK_RESET;
  onClickSave = ONCLICK_SAVE;

  isPickTableDialogOpen = signal<boolean>(false);
  pickTablePair = signal<Map<string, string>>(new Map());
  pickTableDataSource = signal<any[]>([]);

  businessAppHeader: WritableSignal<boolean> = signal(true);
  rltdPanelOpen: WritableSignal<boolean> = signal(true);
  pmtRtr : WritableSignal<boolean> = signal(true);
  orgnlGrpInfAndSts : WritableSignal<boolean> = signal(true);
  GrpHdr : WritableSignal<boolean> = signal(true);
  SttlmInf : WritableSignal<boolean> = signal(true);
  SttlmAcct : WritableSignal<boolean> = signal(true);
  SttlmAcctId : WritableSignal<boolean> = signal(true);
  SttlmAcctIdOthr : WritableSignal<boolean> = signal(true);
  SttlmAcctIdOthrSchmeNm : WritableSignal<boolean> = signal(true);
  SttlmAcctTp : WritableSignal<boolean> = signal(true);
  SttlmAcctPrxy : WritableSignal<boolean> = signal(true);
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
    {key: 'high', value: 'High'},
    {key: 'low', value: 'Low'},
    {key: 'normal', value: 'Normal'},
    {key: 'urgent', value: 'Urgent'}
  ];

  duplicateOptions : SelectOptionsModel[] = [
    {key: 'codu', value: 'CODU'},
    {key: 'copy', value: 'COPY'},
    {key: 'dupl', value: 'DUPL'}
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

  TxInfInstgAgtFinInstnPstlAdrStrtCtryOptions: SelectOptionsModel[] = [
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
  TypeOptions: SelectOptionsModel[] =[
    {key: 'Cd', value: 'Code'},
    {key: 'Prtry', value: 'Proprietary'}
  ];

  SttlmInfSttlmMtdOptions: SelectOptionsModel[] =[
    {key: 'CLRG', value: 'Clearing System'},
    {key: 'COVE', value: 'Cover Method'},
    {key: 'INDA', value: 'Instructed Agent'},
    {key: 'INGA', value: 'Instructing Agent'}
  ];

  TxInfChrgBrOptions: SelectOptionsModel[] =[
    {key: 'CRED', value: 'Borne By Creditor'},
    {key: 'DEBT', value: 'Borne By Debtor'},
    {key: 'SHAR', value: 'Shared'},
    {key: 'SLEV', value: 'Following Service Level'},
  ];

  SttlmAcctCcyOptions: SelectOptionsModel[] =[
    {key: '001', value: 'USD'},
    {key: '000', value: 'BDT'}
  ];
  TxInfSttlmPrtyOptions: SelectOptionsModel[] =[
    {key: 'HIGH', value: 'High'},
    {key: 'NORM', value: 'Normal'},
    {key: 'URGT', value: 'Urgent'}
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
        //this.save();
        ONCLICK_SAVE.set(false);
      }
    });
  }



  ngOnInit():void {
    this.initForm();
  }

  initForm(): void {
    this.frmGroup = this.formBuilder.group({
      // Business Application Header
      fromBic:['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
      toBic: ['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
      bizMsgIdr: ['',[Validators.required, Validators.minLength(1),Validators.maxLength(35)]],
      msgDefIdr: ['',[Validators.required, Validators.minLength(1),Validators.maxLength(35)]],
      bizSvc: ['',[Validators.required, Validators.minLength(6),Validators.maxLength(35),Validators.pattern(/^[a-z0-9]{1,10}(\.[a-z0-9]{1,10})+\.\d\d$/)]],
      CreDt: ['', [Validators.required,Validators.pattern(/^(\+|-)((0[0-9])|(1[0-3])):[0-5][0-9]$/)]],

      cpyDplct: [null],
      psblDplct: [null],
      prty: ['high'],

      // Business Application Header -> related
      rltdFrBic: ['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
      rltdToBic: ['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
      rltdBizMsgIdr: ['',[Validators.required, Validators.minLength(1),Validators.maxLength(35)]],
      rltdMsgDefIdr: [''],
      rltdBizSvc: ['',[Validators.required, Validators.minLength(6),Validators.maxLength(35),Validators.pattern(/^[a-z0-9]{1,10}(\.[a-z0-9]{1,10})+\.\d\d$/)]],
      rltdCpyDplct: ['codu'],
      rltdPrty: ['high'],



      //  Payment Return V09
      //  Payment Return V09 -> Group Header
      GrpHdrmsgId: ['', [Validators.required, Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]], // MessageIdentification //0-9 a-z A-Z / - ? : ( ) . , ' +
      GrpHdrcreDtTm: ['', [Validators.required,Validators.pattern(/^(\+|-)((0[0-9])|(1[0-3])):[0-5][0-9]$/)]],
      GrpHdrNbOfTxs: ['', [Validators.required, Validators.pattern(/^[0-9]{1,15}$/)]],
      //  Payment Return V09 -> Group Header -> Settlement Information
      SttlmInfSttlmMtd: ['CLRG', [Validators.required]],
      // Payment Return V09 -> Group Header -> Settlement Information -> Settlement Account
      SttlmAcctCcy:['001'],
      SttlmAcctNm: ['', [Validators.minLength(1),Validators.maxLength(70),Validators.pattern(/^[0-9a-zA-Z\/\-\?:\(\)\.,'\+ ]+$/)]],
      // Payment Return V09 -> Group Header -> Settlement Information -> Settlement Account ->Identification
      SttlmAcctIdIBAN: ['', [Validators.required,Validators.pattern(/^[A-Z]{2,2}[0-9]{2,2}[a-zA-Z0-9]{1,30}$/)]],


      // Payment Return V09 -> Group Header -> Settlement Information -> Settlement Account ->Proxy
      SttlmAcctPrxyId: ['', [Validators.required,Validators.minLength(1),Validators.maxLength(320),Validators.pattern(/^[0-9a-zA-Z/\-\?:\(\)\.,'\+ !#$%&\*=^_`\{\|\}~";<>@\[\\\]]+$/)]],


      // Payment Return V09 -> Group Header -> Settlement Information -> Settlement Account ->Identification -> Other
      SttlmAcctIdOthrId: ['',
        [Validators.required,
          Validators.minLength(1),
          Validators.maxLength(34),
          Validators.pattern(/^([0-9a-zA-Z\-?:(),.'+ ]([0-9a-zA-Z\-?:(),.'+ ]*(\/[0-9a-zA-Z\-?:(),.'+ ])?)*)$/)]],
      SttlmAcctIdOthrIssr: ['',
        [
          Validators.minLength(1),
          Validators.maxLength(35),
          Validators.pattern(/^[0-9a-zA-Z\/\-\?:\(\)\.,'\+ ]+$/)]],


      // Payment Return V09 -> Group Header -> Settlement Information -> Settlement Account ->Identification -> Other -> SchemeName
      SttlmAcctIdOthrSchmeNmCd: ['',
        [Validators.required,
          Validators.minLength(1),
          Validators.maxLength(35)]],
      SttlmAcctIdOthrSchmeNmPrtry: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(34),
          Validators.pattern(/^[0-9a-zA-Z\/\-\?:\(\)\.,'\+ ]+$/)
        ]
      ],


      // Payment Return V09 -> Group Header -> Settlement Information -> Settlement Account ->Type
      SttlmAcctTpCd: ['',[Validators.required,Validators.minLength(1),Validators.maxLength(4)]],
      SttlmAcctTpPrtry: ['',[Validators.required,Validators.minLength(1),Validators.maxLength(4),Validators.pattern(/^[0-9a-zA-Z\/\-\?:\(\)\.,'\+ ]+$/)]],


      // Payment Return V09 -> Group Header -> Settlement Information -> Settlement Account -> Proxy ->Type
      SttlmAcctPrxyTpCd: ['',[Validators.required,Validators.minLength(1),Validators.maxLength(4)]],
      SttlmAcctPrxyTpPrtry: ['',[Validators.required,Validators.minLength(1),Validators.maxLength(35),Validators.pattern(/^[0-9a-zA-Z\/\-\?:\(\)\.,'\+ ]+$/)]],



      // Payment Return V09 ->  Transaction Information
      TxInfRtrId: ['',[Validators.minLength(1),Validators.maxLength(30),Validators.pattern(/^[0-9a-zA-Z\/\-\?:\(\)\.,'\+ ]+$/)]],
      TxInfOrgnlInstrId:  ['',[Validators.minLength(1),Validators.maxLength(35),Validators.pattern(/^[0-9a-zA-Z\/\-\?:\(\)\.,'\+ ]+$/)]],
      TxInfOrgnlEndToEndId:  ['',[Validators.required,Validators.minLength(1),Validators.maxLength(35),Validators.pattern(/^[0-9a-zA-Z\/\-\?:\(\)\.,'\+ ]+$/)]],
      TxInfOrgnlTxId:  ['',[Validators.minLength(1),Validators.maxLength(35),Validators.pattern(/^[0-9a-zA-Z\/\-\?:\(\)\.,'\+ ]+$/)]],
      TxInfOrgnlUETR:  ['',[Validators.pattern(/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/)]],
      TxInfOrgnlClrSysRef: ['',[Validators.minLength(1),Validators.maxLength(35),Validators.pattern(/^[0-9a-zA-Z\/\-\?:\(\)\.,'\+ ]+$/)]],
      TxInfOrgnlIntrBkSttlmAmt: [],
      TxInfOrgnlIntrBkSttlmDt: [],
      TxInfSttlmPrty: ['HIGH'],
      TxInfRtrdInstdAmt: [],
      TxInfXchgRate: [],
      TxInfChrgBr: ['CRED',Validators.required],

      // Payment Return V09 -> Transaction Information->Original Group Information
      TxInforgnlMsgId:['', [Validators.minLength(1),Validators.maxLength(35),Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]], // MessageIdentification //0-9 a-z A-Z / - ? : ( ) . , ' +
      TxInforgnlMsgNmId:['', [Validators.minLength(1),Validators.maxLength(35),Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]], // MessageIdentification //0-9 a-z A-Z / - ? : ( ) . , ' +
      TxInforgnlCreDtTm: ['', [Validators.pattern(/^(\+|-)((0[0-9])|(1[0-3])):[0-5][0-9]$/)]],
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
      TxInfChrgsInfAgtFinInstnIdPstlAdrStrtCtry: ['001'],
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
      TxInfRtrChainUltmtDbtrPtyPstlAdrCtry: ['001'],

      TxInfRtrChainUltmtDbtrPtyIdOrgIdAnyBIC: [],
      TxInfRtrChainUltmtDbtrPtyIdOrgIdLEI: [],

      TxInfRtrChainUltmtDbtrPtyIdOrgIdOthrId: [],
      TxInfRtrChainUltmtDbtrPtyIdOrgIdOthrSchmeNmCd: [],
      TxInfRtrChainUltmtDbtrPtyIdOrgIdOthrSchmeNmPrtry: [],
      TxInfRtrChainUltmtDbtrPtyIdOrgIdOthrIssr: [],

    });

    this.frmGroup.get('rsnCd')?.valueChanges.subscribe(value => {
      const prtryControl = this.frmGroup.get('rsnPrtry');
      if (value) {
        prtryControl?.setValue('');
        prtryControl?.clearValidators();
      } else {
        prtryControl?.setValidators(Validators.required);
      }
      prtryControl?.updateValueAndValidity({ emitEvent: false });
    });

    this.frmGroup.get('rsnPrtry')?.valueChanges.subscribe(value => {
      const cdControl = this.frmGroup.get('rsnCd');
      if (value) {
        cdControl?.setValue('');
        cdControl?.clearValidators();
      } else {
        cdControl?.setValidators(Validators.required);
      }
      cdControl?.updateValueAndValidity({ emitEvent: false });
    });
  }

  resetForm(): void{
    this.frmGroup.reset();
    this.frmGroup.patchValue({
      date: new Date()
    });
  }

  // save() {
  //   this.mx002Service.save(this.frmGroup.value).subscribe(res => {
  //     console.log(res);
  //   })
  // }

  protected readonly DataSelectionModal = DataSelectionModal;
}
