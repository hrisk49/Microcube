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
import { BUTTON_VISIBILITY, FormGroupSignal, ONCLICK_RESET, ONCLICK_SAVE } from '../../../../shared/constant/button-signals.constant';
import { SelectOptionsModel } from '../../../../shared/models/select-options-model';

@Component({
  selector: 'app-pacs-057',
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
  templateUrl: './pacs-057.html',
  standalone: true,
  styleUrl: './pacs-057.scss'
})
export class Pacs057 implements OnInit {
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
        this.frmGroup = this.formBuilder.group({
            BizMsgIdr: ['', Validators.required],
            MsgDefIdr: ['camt.057.001.06', Validators.required],
            BizSvc: ['swift.cbprplus.02', Validators.required],
            CreDt: ['', Validators.required],
            ReqdColltnDt: [''],
            cpyDplct: [''],
            PsblDplct: [''],
            Priority: [''],
            // Related section form controls
            RltdBizMsgIdr: [''],
            RltdMsgDefIdr: [''],
            RltdBizSvc: [''],
            RltdCreDt: [''],
            RltdcpyDplct: [''],
            RltdPsblDplct: [''],
            RltdPriority: [''],
            // Group Header section form controls
            MsgId: ['', Validators.required],
            CreDtTm: ['', Validators.required],
            MsgSndr: [''],
            // Financial Institution section form controls
            FinInstnId: [''],
            BICFI: [''],
            ClrgSysMmbId: [''],
            LEI: [''],
            // Additional Business Application Header fields
            MktPrctc: [''],
            Regy: [''],
            Id: [''],
            // Notification section form controls
            Acct: [''],
            AcctOwnr: [''],
            // Additional Group Header form controls
            Pty: [''],
            Nm: [''],
            PstlAdr: [''],
            AdrTp: [''],
            Dept: [''],
            SubDept: [''],
            StrtNm: [''],
            BldgNb: [''],
            BldgNm: [''],
            Flr: [''],
            PstBx: [''],
            Room: [''],
            PstCd: [''],
            TwnLctnNm: [''],
            DstrctNm: [''],
            CtrySubDvsn: [''],
            Ctry: [''],
            AdrLine: [''],
            OrgId: [''],
            AnyBIC: [''],
            Othr: [''],
            PrvtId: [''],
            Agt: [''],
            // Added to match updated HTML fields
            IBAN: [''],
            Cd: [''],
            Code: [''],
            MmId: [''],
            Mmbid: [''],
            Prtry: [''],
            Issr: [''],
            TtlAmt: [''],
            XpctdValDt: [''],
            Amt: [''],
            EndToEndId: [''],
            UETR: [''],
            Ccy: [''],
            SchmeNm: [''],
            BirthDt: [''],
            PrvcOfBirth: [''],
            CityOfBirth: [''],
            CtryOfBirth: [''],
            TwnNm: ['']
        });
    }

    resetForm(): void {
      this.frmGroup.reset();
    }

    save(): void {
      // No dedicated service wired for pacs-057 yet; logging the payload.
      // Integrate with API/service when available.
      console.log('pacs-057 save payload:', this.frmGroup.value);
      this.toastr.success('Saved pacs-057 form');
    }
  


        priorityOptions: SelectOptionsModel[] = [
            {key: 'HIGH', value: 'High'},
            {key: 'NORM', value: 'Normal'}
        ];
    
        duplicateOptions: SelectOptionsModel[] = [
            {key: 'CODU', value: 'CODU'},
            {key: 'COPY', value: 'COPY'},
            {key: 'DUPL', value: 'DUPL'}
        ];
    
        possibleDuplicateOptions: SelectOptionsModel[] = [
            {key: 'YES', value: 'Yes'},
            {key: 'NO', value: 'No'}
        ];

        bizSvcOptions: SelectOptionsModel[] = [
            { key: 'swift.cbprplus.02', value: 'swift.cbprplus.02' }
        ];
}
