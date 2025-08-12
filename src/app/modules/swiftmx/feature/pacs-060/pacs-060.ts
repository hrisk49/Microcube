import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectOptionField } from '../../../../shared/components/input-types/select-option-field/select-option-field';
import { TextBaseInput } from '../../../../shared/components/input-types/text-base-input/text-base-input';
import { DateInput } from '../../../../shared/components/input-types/date-input/date-input';
import { PanelHeader } from '../../../../shared/components/panel-header/panel-header';
import { SubPanelHeader } from '../../../../shared/components/sub-panel-header/sub-panel-header';
import { AmountToWordInput } from '../../../../shared/components/input-types/amount-to-word-input/amount-to-word-input';
import { AccountComponent } from '../../components/account/account';
import { AgentComponent } from '../../components/agent/agent';
import { ToastrService } from 'ngx-toastr';
import { BUTTON_VISIBILITY, ONCLICK_RESET, ONCLICK_SAVE } from '../../../../shared/constant/button-signals.constant';
import { SelectOptionsModel } from '../../../../shared/models/select-options-model';

@Component({
  selector: 'app-pacs-060',
    imports: [
    ReactiveFormsModule,
    SelectOptionField,
    TextBaseInput,
    DateInput,
    PanelHeader,
    SubPanelHeader,
    AmountToWordInput,
    AccountComponent,
    AgentComponent,
  ],
  templateUrl: './pacs-060.html',
  standalone: true,
  styleUrl: './pacs-060.scss'
})
export class Pacs060 implements OnInit {
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  frmGroup: FormGroup;
  onClickReset = ONCLICK_RESET;
  onClickSave = ONCLICK_SAVE;

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
    // Common ISO20022/SWIFT patterns
    const BIC_PATTERN = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/; // 8 or 11 chars
    const LEI_PATTERN = /^[A-Z0-9]{18}[0-9]{2}$/; // 20 alphanumerics
    const UETR_PATTERN = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/; // UUID (v4 typical)
    const AMOUNT_PATTERN = /^\d{1,15}(\.\d{1,5})?$/; // up to 15 digits + optional . and up to 5 decimals
    const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD

    this.frmGroup = this.formBuilder.group({
      // Business Application Header V02
      fromBic: ['', [Validators.pattern(BIC_PATTERN)]],
      toBic: ['', [Validators.pattern(BIC_PATTERN)]],
      BizMsgIdr: ['', [Validators.required, Validators.maxLength(35)]],
      MsgDefIdr: ['camt.060.001.05', [Validators.required]],
      BizSvc: ['swift.cbprplus.02', [Validators.required]],
      CreDt: ['', [Validators.required, Validators.pattern(ISO_DATE_PATTERN)]],
      MktPrctc: ['', Validators.maxLength(35)],
      Regy: ['', Validators.maxLength(35)],
      Id: ['', Validators.maxLength(35)],
      // Copy/Duplicate/Priority
      cpyDplct: [''],
      PsblDplct: [''],
      Priority: [''],
      // Related section
      AdrTp: ['', Validators.maxLength(35)],
      RltdBizMsgIdr: ['', Validators.maxLength(35)],
      RltdMsgDefIdr: ['', Validators.maxLength(35)],
      RltdBizSvc: ['', Validators.maxLength(35)],
      RltdCreDt: ['', Validators.pattern(ISO_DATE_PATTERN)],
      RltdcpyDplct: [''],
      RltdPriority: [''],
      // Group Header
      MsgId: ['', [Validators.required, Validators.maxLength(35)]],
      CreDtTm: ['', Validators.required],
      MsgSndr: [''],
      // Party (Message Sender details like pacs-057)
      Nm: ['', Validators.maxLength(140)],
      Dept: ['', Validators.maxLength(70)],
      SubDept: ['', Validators.maxLength(70)],
      StrtNm: ['', Validators.maxLength(70)],
      BldgNb: ['', Validators.maxLength(16)],
      BldgNm: ['', Validators.maxLength(70)],
      Flr: ['', Validators.maxLength(16)],
      PstBx: ['', Validators.maxLength(16)],
      Room: ['', Validators.maxLength(70)],
      PstCd: ['', Validators.maxLength(16)],
      TwnNm: ['', Validators.maxLength(35)],
      TwnLctnNm: ['', Validators.maxLength(35)],
      DstrctNm: ['', Validators.maxLength(35)],
      CtrySubDvsn: ['', Validators.maxLength(35)],
      Ctry: ['', Validators.maxLength(2)],
      AdrLine: ['', Validators.maxLength(70)],
      AnyBIC: ['', Validators.pattern(BIC_PATTERN)],
      LEI: ['', Validators.pattern(LEI_PATTERN)],
      SchmeNm: ['', Validators.maxLength(35)],
      BirthDt: ['', Validators.pattern(ISO_DATE_PATTERN)],
      PrvcOfBirth: ['', Validators.maxLength(35)],
      CityOfBirth: ['', Validators.maxLength(35)],
      CtryOfBirth: ['', Validators.maxLength(2)],
      // Agent
      BICFI: ['', Validators.pattern(BIC_PATTERN)],
      Code: ['', Validators.maxLength(35)],
      Mmbid: ['', Validators.maxLength(35)],
      // Reporting Request
      ReqdMsgNmId: ['', Validators.maxLength(35)],
      // Account (under Reporting Request)
      IBAN: ['', Validators.maxLength(34)],
      Cd: ['', Validators.maxLength(35)],
      Prtry: ['', Validators.maxLength(35)],
      Issr: ['', Validators.maxLength(35)],
      // Reporting Period
      FrDt: ['', Validators.pattern(ISO_DATE_PATTERN)],
      ToDt: ['', Validators.pattern(ISO_DATE_PATTERN)],
      FrTm: [''],
      ToTm: [''],
      Tp: ['', Validators.maxLength(35)],
      // Reporting Sequence
      FrSeq: ['', Validators.maxLength(35)],
      ToSeq: ['', Validators.maxLength(35)],
      EqSeq: ['', Validators.maxLength(35)],
      NEQSeq: ['', Validators.maxLength(35)],
      // Requested Transaction Type
      CdtDbtInd: ['', Validators.maxLength(4)],
      // Original Notification
      OrgnlMsgId: ['', [Validators.required, Validators.maxLength(35)]],
      OrgnlCreDtTm: [''],
      OrgnlNtfctnId: ['', [Validators.required, Validators.maxLength(35)]],
      NtfctnCxl: [''],
      // Original Notification Reference (reduced multiplicity [1..1])
      OrgnlNtfctnRef: ['', [Validators.required, Validators.maxLength(35)]],
      // Original Item
      OrgnlItmId: ['', Validators.maxLength(35)],
      OrgnlEndToEndId: ['', Validators.maxLength(35)],
      UETR: ['', Validators.pattern(UETR_PATTERN)],
      Amt: ['', Validators.pattern(AMOUNT_PATTERN)],
      ExpctdValDt: ['', Validators.pattern(ISO_DATE_PATTERN)],
      // Requested Balance Type (sub type)
      subCd: ['', Validators.maxLength(35)],
      subPrtry: ['', Validators.maxLength(35)],
      // Cancellation Reason (mandatory)
      CxlRsn: ['', Validators.required],
      Orgtr: ['', Validators.maxLength(140)],
      Rsn: ['', Validators.maxLength(35)],
      AddtlInf1: ['', Validators.maxLength(1050)],
      AddtlInf2: ['', Validators.maxLength(1050)],
      // SupplementaryData is removed in guideline
      // Account/Party/Agent/Other fields as needed for UI
      // ... (add more as per UI needs)
    });
  }

  resetForm(): void {
    this.frmGroup.reset();
  }

  save(): void {
    // No dedicated service wired for pacs-060 yet; logging the payload.
    // Integrate with API/service when available.
    console.log('pacs-060 save payload:', this.frmGroup.value);
    this.toastr.success('Saved pacs-060 form');
  }

  priorityOptions: SelectOptionsModel[] = [
    { key: 'HIGH', value: 'High' },
    { key: 'NORM', value: 'Normal' }
  ];

  duplicateOptions: SelectOptionsModel[] = [
    { key: 'CODU', value: 'CODU' },
    { key: 'COPY', value: 'COPY' },
    { key: 'DUPL', value: 'DUPL' }
  ];

  possibleDuplicateOptions: SelectOptionsModel[] = [
    { key: 'YES', value: 'Yes' },
    { key: 'NO', value: 'No' }
  ];

  bizSvcOptions: SelectOptionsModel[] = [
    { key: 'swift.cbprplus.01', value: 'swift.cbprplus.01' }
  ];

}


