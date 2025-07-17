import {Component, effect, inject, OnInit} from '@angular/core';
import {FormPanel} from "../../../../shared/components/form-panel/form-panel";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SelectOptionField} from "../../../../shared/components/input-types/select-option-field/select-option-field";
import {TextBaseInput} from "../../../../shared/components/input-types/text-base-input/text-base-input";
import {RESET_CLICK} from '../../../../shared/constant/button-click';
import {SelectOptions} from '../../../../shared/models/select-options';
import {ButtonActions} from '../../../../shared/constant/button-actions';
import {DateInput} from '../../../../shared/components/input-types/date-input/date-input';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-pacs-008',
  imports: [
    FormPanel,
    ReactiveFormsModule,
    SelectOptionField,
    TextBaseInput,
    DateInput,
  ],
  templateUrl: './pacs-008.html',
  styleUrl: './pacs-008.scss'
})
export class Pacs008 implements OnInit {

  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  frmGroup: FormGroup;
  resetClick = RESET_CLICK;
  priorityOptions: SelectOptions[] = [
    {key: 'high', value: 'High'},
    {key: 'normal', value: 'Normal'}
  ];

  duplicateOptions: SelectOptions[] = [
    {key: 'codu', value: 'CODU'},
    {key: 'copy', value: 'COPY'},
    {key: 'dupl', value: 'DUPL'}
  ];

  settlementOptions: SelectOptions[] = [
    {key: 'clrg', value: 'CLRG'},
    {key: 'cove', value: 'COVE'},
    {key: 'inda', value: 'INDA'},
    {key: 'inga', value: 'INGA'}
  ];

  chargeBearerOptions: SelectOptions[] = [
    {key: 'debt', value: 'Debitor'},
    {key: 'cred', value: 'Creditor'},
    {key: 'shar', value: 'Shared'}
  ];

  constructor() {
    ButtonActions.set({
      save: true,
      update: false,
      view: true,
      delete: true,
      exit: true,
      reset: true
    });

    effect(() => {
      if (this.resetClick()) {
        this.resetForm();
        RESET_CLICK.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.frmGroup = this.formBuilder.group({

      // Business Application Header
      fromBic: ['', Validators.required],
      toBic: ['', Validators.required],
      businessMessageIdentifier: [''],
      messageDefinitionIdentifier: [''],
      businessService: ['', Validators.required],
      copyDuplicate: ['codu'],
      priority: ['high'],

      // Business Application Header -> related
      relatedFromBic: ['', Validators.required],
      relatedToBic: ['', Validators.required],
      relatedBusinessMessageIdentifier: [''],
      relatedMessageDefinitionIdentifier: [''],
      relatedBusinessService: ['', Validators.required],
      relatedCopyDuplicate: ['codu'],
      relatedPriority: ['high'],

      // FI To FI Customer Credit Transfer
      // FI To FI Customer -> Group Header
      messageIdentification: [''],
      creationDate: [new Date()],

      // FI To FI Customer -> Settlement Information
      settlementMethod: ['clrg'],
      settleAccountId: [''],
      settleIban: [''],
      settleLei: [''],
      instructingReimbursementAgent: [''],
      instructingAccountId: [''],
      instructingIban: [''],
      instructingLei: [''],
      instructedReimbursementAgent: [''],
      instructedAccountId: [''],
      instructedIban: [''],
      instructedLei: [''],
      thirdReimbursementAgent: [''],
      thirdAccountId: [''],
      thirdIban: [''],
      thirdLei: [''],

      //  Credit Transfer Transaction Information
      interbankSettlementAmount: [''],
      settlementDate: ['', Validators.required],
      settlementPriority: [''],
      settlementTimeIndication: [''],
      settlementTimeRequest: [''],
      instructedAmount: [''],
      chargeBearer: ['debt'],
      exchangeRate: [''],

      // Credit Transfer -> Payment Identification
      instructionIdentification: ['', Validators.required],
      endToEndIdentification: [''],
      transactionIdentification: [''],
      clearingSystemReference: [''],

      // Credit Transfer -> Payment Type Info
      instructionPriority: ['high'],
      clearingChannel: [''],
      localInstrument: [''],
      categoryPurpose: [''],

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
      debitorName: ['', Validators.required],
      debitorPostalAddress: [''],
      debitorOrganisationIdentification: [''],
      debitorPrivateIdentification: [''],
      debitorCountryOfResidence: [''],
      debitorAgentBic: [''],
      debitorAccountId: [''],
      debitorIban: [''],
      debitorLei: [''],

    });
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

}
