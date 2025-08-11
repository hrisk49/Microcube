import {Component, effect, inject, OnInit} from '@angular/core';
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
import {Mx055Service} from '../../service/mx055.service';

@Component({
selector: 'app-pacs-055',
imports: [
ReactiveFormsModule,
SelectOptionField,
TextBaseInput,
DateInput,
PanelHeader,
SubPanelHeader,
AmountToWordInput,
],
templateUrl: './pacs-055.html',
standalone: true,
styleUrl: './pacs-055.scss'
})
export class Pacs055 implements OnInit {

formBuilder = inject(FormBuilder);
toastr = inject(ToastrService);
mx055Service = inject(Mx055Service);
frmGroup: FormGroup;
onClickReset = ONCLICK_RESET;
onClickSave = ONCLICK_SAVE;
priorityOptions: SelectOptionsModel[] = [
{key: 'high', value: 'High'},
{key: 'normal', value: 'Normal'}
];

duplicateOptions: SelectOptionsModel[] = [
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
AssgnmtAssgnePtyPstlAdrCtryOptions: SelectOptionsModel[] = [
{key: '010', value: 'Bangladesh'},
{key: '011', value: 'India'},
{key: '012', value: 'USA'}
];

UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrIdPrvtIdDtAndPlcOfBirthCtryOfBirthOptions: SelectOptionsModel[] = [
{key: '010', value: 'Bangladesh'},
{key: '011', value: 'India'},
{key: '012', value: 'USA'}
];

UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCaseCretrPtyPstlAdrCtryOptions: SelectOptionsModel[] = [
{key: '010', value: 'Bangladesh'},
{key: '011', value: 'India'},
{key: '012', value: 'USA'}
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
               // this.save();
                ONCLICK_SAVE.set(false);
            }
        });
    }

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        this.frmGroup = this.formBuilder.group({

            // Business Application Header
            amountToText: ['',],
            // fromBic: ['', Validators.required],
            fromBic: [''],
            // toBic: ['', Validators.required],
            toBic: [''],
            businessMessageIdentifier: [''],
            messageDefinitionIdentifier: [''],
            // businessService: ['', Validators.required],
            businessService: [''],
            copyDuplicate: ['codu'],
            priority: ['high'],

            // Business Application Header -> related
            // relatedFromBic: ['', Validators.required],
            relatedFromBic: [''],
            // relatedToBic: ['', Validators.required],
            relatedToBic: [''],
            relatedBusinessMessageIdentifier: [''],
            relatedMessageDefinitionIdentifier: [''],
            // relatedBusinessService: ['', Validators.required],
            relatedBusinessService: [''],
            relatedCopyDuplicate: ['codu'],
            relatedPriority: ['high'],

            // Customer Payment Cancellation Request V08
           // Customer Payment Cancellation Request V08 ->Assignment
            Identification: [''],
            AssgnmtAssgnr: [],
            AssgnmtId: [],
            AssgnmtAssgneAgtFinInstnIdBICFI: [],
            AssgnmtAssgneAgtFinInstnIdClrSysMmbIdClrSysIdCd: [],
            AssgnmtAssgneAgtFinInstnIdClrSysMmbIdMmbId: [],
            AssgnmtAssgneAgtFinInstnIdLEI: [],
            AssgnmtCreDtTm: [],

            // Customer Payment Cancellation Request V08 ->Underlying

            UndrlygOrgnlPmtInfAndCxlOrgnlPmtInfId: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlGrpInfOrgnlMsgId: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlGrpInfOrgnlOrgnlMsgNmId: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlGrpInfOrgnlOrgnlOrgnlCreDtTm: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlTxInfCxlId: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCaseId: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCaseCretrPtyNm: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCaseCretrPtyPstlAdrDept: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCaseCretrPtyPstlAdrSubDept: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCaseCretrPtyPstlAdrStrtNm: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCaseCretrPtyPstlAdrBldgNb: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCaseCretrPtyPstlAdrBldgNm: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCaseCretrPtyPstlAdrFlr: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCaseCretrPtyPstlAdrPstBx: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCaseCretrPtyPstlAdrRoom: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCaseCretrPtyPstlAdrPstCd: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCaseCretrPtyPstlAdrTwnNm: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCaseCretrPtyPstlAdrTwnLctnNm: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCaseCretrPtyPstlAdrDstrctNm: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCaseCretrPtyPstlAdrCtrySubDvsn: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCaseCretrPtyPstlAdrCtry: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCaseCretrPtyPstlAdrAdrLine: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlOrgnlInstrId: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlOrgnlEndToEndId: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlOrgnlUETR: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlOrgnlInstdAmt: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlOrgnlReqdExctnDtDt: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlOrgnlReqdExctnDtDtTm: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlOrgnlOrgnlReqdColltnDt: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrNm: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrPstlAdrDept: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrPstlAdrSubDept: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrPstlAdrStrtNm: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrPstlAdrBldgNb: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrPstlAdrBldgNm: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrPstlAdrFlr: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrPstlAdrPstBx: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrPstlAdrRoom: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrPstlAdrPstCd: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrPstlAdrTwnNm: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrPstlAdrTwnLctnNm: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrPstlAdrDstrctNm: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrPstlAdrCtrySubDvsn: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrPstlAdrCtry: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrPstlAdrAdrLine: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrIdOrgId: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrIdLEI: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrIdPrvtIdDtAndPlcOfBirthBirthDt: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrIdPrvtIdDtAndPlcOfBirthPrvcOfBirth: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrIdPrvtIdDtAndPlcOfBirthCityOfBirth: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrIdPrvtIdDtAndPlcOfBirthCtryOfBirth: ['010'],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrIdPrvtIdOthrId: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrIdPrvtIdOthrSchmeNmCd: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrIdPrvtIdOthrIssr: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnInfOrgtrCtryOfRes: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnRsnCd: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlOrgnlCxlRsnAddtlInf: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlGrpInfOrgnlMsgId: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlGrpInfOrgnlOrgnlMsgNmId: [],
            UndrlygOrgnlPmtInfAndCxlOrgnlGrpInfOrgnlOrgnlCreDtTm: [],


            // Payment Type Info -> Service Level

            serviceLevels: this.formBuilder.array([
                this.createServiceLevelGroup()
            ]),

            serviceCode: [''],
            servicePriority: ['high'],

            // Credit Transfer -> Normal
            instructingAgentBic1: [''],
            instructingAccountId1: [''],
            instructingIban1: [''],
            instructingLei1: [''],
            instructingAgentBic2: [''],
            instructingAccountId2: [''],
            instructingIban2: [''],
            instructingLei2: [''],
            instructingAgentBic3: [''],
            instructingAccountId3: [''],
            instructingIban3: [''],
            instructingLei3: [''],

            // Credit Transfer -> Debitor
            // debitorName: ['', Validators.required],
            debitorName: [''],
            debitorPostalAddress: [''],
            debitorOrganisationIdentification: [''],
            debitorPrivateIdentification: [''],
            debitorCountryOfResidence: [''],
            debitorAgentBic: [''],
            debitorAccountId: [''],
            debitorIban: [''],
            debitorLei: [''],
        });

        FormGroupSignal.set(this.frmGroup);
    }

    createServiceLevelGroup(): FormGroup {
        return this.formBuilder.group({
            serviceCode: [''],
            servicePriority: ['high']
        });
    }

    get serviceLevels(): FormArray<FormGroup> {
        return this.frmGroup.get('serviceLevels') as FormArray<FormGroup>;
    }

    addServiceRow(): void {
        if (this.serviceLevels.length === 3) {
            this.toastr.warning("You can't be add more then 3..!!", 'WARN');
            return;
        }
        this.serviceLevels.push(this.createServiceLevelGroup());
    }

    removeServiceRow(index: number): void {
        this.serviceLevels.removeAt(index);
    }

    resetForm(): void {
        this.frmGroup.reset();
        this.frmGroup.patchValue({
            date: new Date(),
        });
    }

    //save() {
     //   this.mx008Service.save(this.frmGroup.value).subscribe(res => {
      //      console.log(res);
    //    })
  //  }

}
