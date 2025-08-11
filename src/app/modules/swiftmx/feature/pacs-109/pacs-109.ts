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
import {Mx054Service} from '../../service/mx054.service';
import {BusinessApplicationHeader} from '../../components/business-application-header/business-application-header';

@Component({
  selector: 'app-pacs-109',
  imports: [
    ReactiveFormsModule,
    SelectOptionField,
    TextBaseInput,
    DateInput,
    PanelHeader,
    SubPanelHeader,
    AmountToWordInput,
    BusinessApplicationHeader,
  ],
  templateUrl: './pacs-109.html',
  standalone: true,
  styleUrl: './pacs-109.scss'
})
export class Pacs109 implements OnInit {

  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  mx054Service = inject(Mx054Service);
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


  currencyOptions : SelectOptionsModel[] = [
    {key:'000', value: 'BDT'},
    {key:'001', value: 'USD'},
    {key:'002', value: 'EUR'},
    {key:'003', value: 'AED'}
  ];

  StsOptions: SelectOptionsModel[] =[
    {key: 'Cd', value: 'Code'},
    {key: 'Prtry', value: 'Proprietary'}
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

      // Cheque Cancellation Or Stop Report
      // -> Group Header
      messageIdentification: [''],
      creDtTm: [new  Date()],
      nbOfChqs :['',Validators.required],
      ctrlSum : [Validators.required],

      // -> Cheque information
      instrId:[''],
      orgnlInstrId:[''],
      chqNb :['',Validators.required],
      isseDt :[new Date(), Validators.required],
      stlDt: [''],
      amt:[],
      fctvDt:[],
      drwrAgt:[],
      drwrAgtAcct:[],

      // Payee Information
      payeeNm:[''],
      // Payee Information -> Postal Address
      adrTp :[''],
      dept:[''],
      subDept:[''],
      strtNm:[''],

      BldgNb:[''],
      bldgNm:[''],
      flr:[''],
      pstBx:[''],
      room:[''],
      pstCd:[''],
      twnNm:[''],
      twnLctnNm:[''],
      dstrctNm:[''],
      ctrySubDvsn:[''],
      ctry:[''],
      addtlInf1:[''],
      addtlInf2:[''],
      // Organization Identification

      orgIdBic:[''],
      orgIdLei:[''],
      orgIdOthrId:[''],
      orgIdOthrScNmCd:[''],
      orgIdOthrIssr:[''],
      orgIdOthrCd:[''], // added by developer
      orgIdOthrIssrPtry:[''], // added by developer

      //   Private Information
      birthDt:[''],
      prvcOfBirth:[''],
      cityOfBirth:[''],
      ctryOfBirth:[''],
      prvtOthId1:[''],
      prvtOthIdSchNmCd1:[''],
      prvtOthIdIssr1:[''],
      prvtOthId2:[''],
      prvtOthIdSchNmCd2:[''],
      prvtOthIdIssr2:[''],
      ctryOfRes:[''],


      //  Cheque Cancellation Or Stop Status
      orgtr : [''],
      sts :['Cd'],
      addtlInf:[''],



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
