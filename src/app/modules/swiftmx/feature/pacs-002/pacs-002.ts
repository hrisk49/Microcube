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
import {Mx002Service} from '../../service/mx002.service';
import {AmountToWordInput} from "../../../../shared/components/input-types/amount-to-word-input/amount-to-word-input";
import {AgentComponent} from '../../components/agent/agent';
import {BusinessApplicationHeader} from '../../components/business-application-header/business-application-header';
import {DataSelectionModal} from '../../../../shared/components/data-selection-modal/data-selection-modal';
import {BranchInfoService} from '../../../../shared/services/branch-info.service';
import {ExpansionPanelHeader} from '../../../../shared/components/expansion-panel-header/expansion-panel-header';
import {
  ExpansionSubPanelHeader
} from '../../../../shared/components/expansion-sub-panel-header/expansion-sub-panel-header';
import {Mx002Model} from '../../model/mx002.model';

@Component({
  selector: 'app-pacs-002',
  imports: [
    ReactiveFormsModule,
    SelectOptionField,
    TextBaseInput,
    DateInput,

    BusinessApplicationHeader,
    ExpansionPanelHeader,
    ExpansionSubPanelHeader
  ],
  templateUrl: './pacs-002.html',
  standalone: true,
  styleUrl: './pacs-002.scss'
})
export class Pacs002 implements OnInit {
  branchInfoService = inject(BranchInfoService);
  formBuilder = inject(FormBuilder);
  mx002Service = inject(Mx002Service);
  toastr = inject(ToastrService);
  frmGroup : FormGroup;

  onClickReset = ONCLICK_RESET;
  onClickSave = ONCLICK_SAVE;

  isPickTableDialogOpen = signal<boolean>(false);
  pickTablePair = signal<Map<string, string>>(new Map());
  pickTableDataSource = signal<any[]>([]);

  businessAppHeader: WritableSignal<boolean> = signal(true);
  rltdPanelOpen: WritableSignal<boolean> = signal(true);
  fiToFiPaymntSts : WritableSignal<boolean> = signal(true);
  orgnlGrpInfAndSts : WritableSignal<boolean> = signal(true);
  grpHeadr : WritableSignal<boolean> = signal(true);
  stsRsInfo : WritableSignal<boolean> = signal(true);
  adrsInfo : WritableSignal<boolean> = signal(true);
  orgId : WritableSignal<boolean> = signal(true);
  ctctDtls : WritableSignal<boolean> = signal(true);
  orgOthr : WritableSignal<boolean> = signal(true);
  ctDtlsOthr : WritableSignal<boolean> = signal(true);
  orgPrvtId : WritableSignal<boolean> = signal(true);
  dtAndPlcOfBirth : WritableSignal<boolean> = signal(true);
  orgOthrPrvtId : WritableSignal<boolean> = signal(true);
  efftvIntrBankStllmnt : WritableSignal<boolean> = signal(true);
  clrSysRef : WritableSignal<boolean> = signal(true);
  instgAgntBicfi : WritableSignal<boolean> = signal(true);
  instdAgntBicfi : WritableSignal<boolean> = signal(true);
  nbOfTxsPerSts : WritableSignal<boolean> = signal(true);

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

  NamePrefixOptions: SelectOptionsModel[] = [
    {key:'DOCT',value: 'Dr.'},
    {key: 'MADM', value: 'Madam'},
    {key: 'MIKS', value: 'Mx'},
    {key: 'MISS', value: 'Miss'},
    {key: 'MIST', value: 'Mister'}
  ]

  PreferredMthdOptions: SelectOptionsModel[] = [
    {key: 'CELL', value: 'Cell'},
    {key: 'MAIL', value: 'Mail'},
    {key: 'FAXX', value: 'Fax'},
    {key:'LETT', value: 'Letter'},
    {key: 'PHONE', value: 'Phone'}
  ]

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



  ngOnInit():void {
    this.initForm();
  }

  initForm(): void {
    this.frmGroup = this.formBuilder.group({
      // Business Application Header
      charSet: [''],
      fromBicfi:['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
      fromMembId: [''],
      fromClrSysIdCd: [''],
      fromLei: [''],
      toMembId: [''],
      toBicfi: ['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
      toClrSysIdCd: [''],
      toLei: [''],
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

      //  FI To FI Payment Status Report
      msgId: ['', [Validators.required, Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]], // MessageIdentification //0-9 a-z A-Z / - ? : ( ) . , ' +
      creDtTm: ['', [Validators.required,Validators.pattern(/^(\+|-)((0[0-9])|(1[0-3])):[0-5][0-9]$/)]],

      // Transaction Information And Status

      // -> original Group Information orgnlGrpInf
      orgnlMsgId:['', [Validators.minLength(1),Validators.maxLength(35),Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]], // MessageIdentification //0-9 a-z A-Z / - ? : ( ) . , ' +
      orgnlMsgNmId:['', [Validators.minLength(1),Validators.maxLength(35),Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]], // MessageIdentification //0-9 a-z A-Z / - ? : ( ) . , ' +
      orgnlCreDtTm: ['', [Validators.required,Validators.pattern(/^(\+|-)((0[0-9])|(1[0-3])):[0-5][0-9]$/)]],

      orgnlNbOfTxs:['',[Validators.pattern(/^[0-9]{1,15}$/)]],
      orgnlCtrlSum :[Validators.pattern(/^d\d{1,17}\.\{1,18}?$/)],

      orgnlInstrId: ['',[Validators.minLength(1),Validators.maxLength(16)]],
      orgnlEndToEndId: ['',[Validators.required,Validators.minLength(1),Validators.maxLength(35),Validators.pattern(/^[0-9a-zA-Z/\-\?:\(\)\.,'\+ ]+$/)]],
      orgnlTxId: ['', [Validators.minLength(1),Validators.maxLength(35),Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]],
      orgnlUETR: ['', [Validators.required,Validators.minLength(1),Validators.maxLength(35),Validators.pattern(/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/)]],
      txSts: ['', [Validators.required],Validators.minLength(1),Validators.maxLength(4)],

      // Status Reason Information block StsRsnInf
      orgtrNm: ['', [Validators.minLength(1), Validators.maxLength(140)]],
      addrTp: ['', Validators.required],
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
      adrLine: ['', [Validators.maxLength(70)]],
      ctryOfRes: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
      Tp: ['Cd'],

      // Contact Details
      ctDtlsNmPrfx: ['DOCT'], // Should this be dynamic? If yes, use ['']
      ctDtlsNm: ['', [Validators.maxLength(140)]],
      ctDtlsPhneNb: ['', Validators.pattern(/^\+[0-9]{1,3}-[0-9()+\-]{1,30}/)],
      ctDtlsMobNb: ['', Validators.pattern(/^\+[0-9]{1,3}-[0-9()+\-]{1,30}/)],
      ctDtlsFaxNb: ['', Validators.pattern(/^\+[0-9]{1,3}-[0-9()+\-]{1,30}/)],
      ctDtlsEmailAdr: ['', [Validators.email, Validators.maxLength(2048)]], // Fixed: Validators in array
      ctDtlsEmailPurp: ['', Validators.maxLength(35)],
      ctDtlsJobTitl: ['', Validators.maxLength(35)],
      ctDtlsRspnsblty: ['', Validators.maxLength(35)],
      ctDtlsDept: ['', Validators.maxLength(70)],
      ctDtlsJobTitlctctDtls:['', Validators.maxLength(35)],
      ctDtlsSubDept: [''],

      // Contact Details -> Other
      ctDtlsothrChanlTp: ['', Validators.maxLength(4)],
      ctDtlsothrChanlId: ['', Validators.maxLength(140)],
      ctctDtlsPrefrdMtd: ['MAIL'],

      //  Number of transaction per status
      dtldNbOfTxs:['',Validators.required],
      dtldSts : ['',Validators.required],
      dtldCtrlSum: [],


      orgIdBic:['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
      orgIdLei:['',Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)],
      orgScmNm:['Cd'],
      orgIdOthrScNmCd:[''],
      orgIdOthrId:[''],
      orgIdOthrIssr:[''],
      orgIdOthrCd:['',[Validators.maxLength(4)]], // added
      orgIdOthrIssrPtry:['',[Validators.maxLength(35)]], // added

      birthDt:['',Validators.required],
      prvcOfBirth:['',[Validators.maxLength(35)]],
      cityOfBirth:['',[Validators.maxLength(35)]],
      ctryOfBirth:['',[Validators.pattern(/^[A-Z]{2}$/)]],
      prvtOthId1:[''],
      prvtOthIdSchNmCd1:[''],
      prvtOthIdIssr1:[''],
      prvtOthId2:[''],
      prvtOthIdSchNmCd2:[''],
      prvtOthIdIssr2:[''],

      // Status Reason Information block StsRsnInf
      StsRsnInf: [''],
      rsnCd:['',[Validators.required,Validators.maxLength(4)]],
      rsnPrtry :['',[Validators.required,Validators.maxLength(35)]],
      addtlInf1:['',[Validators.maxLength(105),Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]],
      addtlInf2:['',[Validators.maxLength(105),Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]],

      fctvIntrBkSttlmDt :[],
      clrSysRef: ['',[Validators.pattern(/^[0-9a-zA-Z/\-\?:\(\)\.,'\+ ]+$/)]],
      instgAgtBicfi: ['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],

      // Agent Information
      instdAgtBicfi:['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
      clrSysIdCd:[''],
      mmbId:[''],
      lei:[''],
      agentNm:[''],
      adrLine1:[''],
      adrLine2:[''],
      adrLine3:[''],
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

  generatePayload(): Mx002Model
  {
   let payload : any = {};
   let frmValue = this.frmGroup.value;



   return  payload as Mx002Model;
  }

  save() {
    this.mx002Service.save(this.frmGroup.value).subscribe(res => {
      console.log(res);
    })
  }


  protected readonly DataSelectionModal = DataSelectionModal;
}
