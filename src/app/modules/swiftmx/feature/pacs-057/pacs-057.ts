import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectOptionField } from '../../../../shared/components/input-types/select-option-field/select-option-field';
import { TextBaseInput } from '../../../../shared/components/input-types/text-base-input/text-base-input';
import { DateInput } from '../../../../shared/components/input-types/date-input/date-input';
import { PanelHeader } from '../../../../shared/components/panel-header/panel-header';
import { SubPanelHeader } from '../../../../shared/components/sub-panel-header/sub-panel-header';
import { AmountToWordInput } from '../../../../shared/components/input-types/amount-to-word-input/amount-to-word-input';
import { AccountComponent } from '../../components/account/account';
import { AgentComponent } from '../../components/agent/agent';
import { ToastrService } from 'ngx-toastr';
import { ONCLICK_RESET, ONCLICK_SAVE } from '../../../../shared/constant/button-signals.constant';
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
  styleUrl: './pacs-057.scss'
})
export class Pacs057 implements OnInit {
    formBuilder = inject(FormBuilder);
    toastr = inject(ToastrService);
    frmGroup: FormGroup;
    onClickReset = ONCLICK_RESET;
    onClickSave = ONCLICK_SAVE;

    ngOnInit(): void {
        this.frmGroup = this.formBuilder.group({
            BizMsgIdr: [''],
            MsgDefIdr: [''],
            BizSvc: [''],
            CreDt: [''],
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
            MsgId: [''],
            CreDtTm: [''],
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
            Agt: ['']
        });
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
}
