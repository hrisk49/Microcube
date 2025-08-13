import {Component, effect, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SelectOptionField} from "../../../../shared/components/input-types/select-option-field/select-option-field";
import {TextBaseInput} from "../../../../shared/components/input-types/text-base-input/text-base-input";
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
import { SelectOptionsModel } from '../../../../shared/models/select-options-model';

@Component({
    selector: 'app-pacs-029',
    imports: [
        ReactiveFormsModule,
        SelectOptionField,
        TextBaseInput,
        DateInput,
        PanelHeader,
        SubPanelHeader,
        AmountToWordInput,
    ],
    templateUrl: './pacs-029.html',
    standalone: true,
    styleUrl: './pacs-029.scss'
})
export class Pacs029 implements OnInit {

    formBuilder = inject(FormBuilder);
    toastr = inject(ToastrService);
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

    statusOptions: SelectOptionsModel[] = [
        {key: 'conf', value: 'Confirmation'},
        {key: 'rjctd', value: 'Rejected Modification'},
        {key: 'dplct', value: 'Duplicate Of'},
        {key: 'assgn_cxl', value: 'Assignment Cancellation Confirmation'}
    ];

    investigationStatusOptions: SelectOptionsModel[] = [
        {key: 'accptd', value: 'Accepted'},
        {key: 'rjctd', value: 'Rejected'}
    ];

    clearingChannelOptions: SelectOptionsModel[] = [
        {key: 'rtgs', value: 'RTGS'},
        {key: 'rtns', value: 'RTNS'},
        {key: 'mpns', value: 'MPNS'},
        {key: 'book', value: 'BOOK'}
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

            // Business Application Header V02
            characterSet: [''],
            fromBic: ['', Validators.required],
            toBic: ['', Validators.required],
            businessMessageIdentifier: ['', Validators.required],
            messageDefinitionIdentifier: ['', Validators.required],
            businessService: [''],
            marketPractice: [''],
            registryIdentification: ['', Validators.required],
            creationDate: ['', Validators.required],
            businessProcessingDate: [''],
            copyDuplicate: [''],
            possibleDuplicate: [''],
            priority: [''],
            signature: [''],

            // Business Application Header -> Related
            relatedCharacterSet: [''],
            relatedFromBic: ['', Validators.required],
            relatedToBic: ['', Validators.required],
            relatedBusinessMessageIdentifier: ['', Validators.required],
            relatedMessageDefinitionIdentifier: ['', Validators.required],
            relatedBusinessService: [''],
            relatedCreationDate: ['', Validators.required],
            relatedCopyDuplicate: [''],
            relatedPossibleDuplicate: [''],
            relatedPriority: [''],
            relatedSignature: [''],

            // Resolution Of Investigation V09 -> Assignment
            assignmentIdentification: ['', Validators.required],
            assignerBIC: ['', Validators.required],
            assigneeBIC: ['', Validators.required],
            assignmentCreationDateTime: ['', Validators.required],

            // Resolved Case
            resolvedCaseIdentification: ['', Validators.required],
            resolvedCaseCreator: ['', Validators.required],
            reopenCaseIndication: [''],

            // Status
            statusType: ['conf', Validators.required],

            // Cancellation Details Array
            cancellationDetails: this.formBuilder.array([
                this.createCancellationDetailsGroup()
            ]),

            // Modification Details
            modificationStatusIdentification: [''],
            modificationResolvedCaseId: [''],
            originalGroupInformation: [''],
            originalPaymentInformationIdentification: [''],
            originalInstructionIdentification: [''],
            originalEndToEndIdentification: [''],
            originalTransactionIdentification: [''],
            originalClearingSystemReference: [''],
            originalUETR: [''],
            originalInterbankSettlementAmount: [''],
            originalInterbankSettlementDate: [''],
            modificationAssigner: [''],
            modificationAssignee: [''],

            // Claim Non Receipt Details
            claimNonReceiptStatus: [''],

            // Statement Details
            statementOriginalGroupInformation: [''],
            statementOriginalStatementIdentification: [''],
            statementUETR: [''],
            statementAccountServicerReference: [''],
            statementCorrectedAmount: [''],
            statementPurpose: [''],

            // Correction Transaction
            correctionTransactionType: [''],

            // Resolution Related Information
            resolutionEndToEndIdentification: [''],
            resolutionTransactionIdentification: [''],
            resolutionUETR: [''],
            resolutionInterbankSettlementAmount: [''],
            resolutionInterbankSettlementDate: [''],
            resolutionClearingChannel: [''],
            resolutionCompensation: ['']
        });

        FormGroupSignal.set(this.frmGroup);
    }

    createCancellationDetailsGroup(): FormGroup {
        return this.formBuilder.group({
            // Original Group Information And Status
            originalGroupInformationAndStatus: [''],
            
            // Transaction Information And Status Array
            transactionInformationAndStatus: this.formBuilder.array([
                this.createTransactionInfoGroup()
            ])
        });
    }

    createTransactionInfoGroup(): FormGroup {
        return this.formBuilder.group({
            originalInstructionId: [''],
            originalEndToEndId: [''],
            originalTransactionId: [''],
            originalUETR: [''],
            transactionStatus: [''],
            statusReasonCode: [''],
            additionalStatusReasonInformation: ['']
        });
    }

    createChargesGroup(): FormGroup {
        return this.formBuilder.group({
            chargeAmount: [''],
            chargeCurrency: [''],
            chargeBearer: [''],
            chargeType: ['']
        });
    }

    get cancellationDetails(): FormArray<FormGroup> {
        return this.frmGroup.get('cancellationDetails') as FormArray<FormGroup>;
    }

    getTransactionInfoArray(cancellationIndex: number): FormArray<FormGroup> {
        return this.cancellationDetails.at(cancellationIndex).get('transactionInformationAndStatus') as FormArray<FormGroup>;
    }

    addCancellationDetail(): void {
        if (this.cancellationDetails.length >= 10) {
            this.toastr.warning("You can't add more than 10 cancellation details!", 'WARN');
            return;
        }
        this.cancellationDetails.push(this.createCancellationDetailsGroup());
    }

    removeCancellationDetail(index: number): void {
        if (this.cancellationDetails.length > 1) {
            this.cancellationDetails.removeAt(index);
        } else {
            this.toastr.warning("At least one cancellation detail is required!", 'WARN');
        }
    }

    addTransactionInfo(cancellationIndex: number): void {
        const transactionArray = this.getTransactionInfoArray(cancellationIndex);
        if (transactionArray.length >= 5) {
            this.toastr.warning("You can't add more than 5 transactions per cancellation detail!", 'WARN');
            return;
        }
        transactionArray.push(this.createTransactionInfoGroup());
    }

    removeTransactionInfo(cancellationIndex: number, transactionIndex: number): void {
        const transactionArray = this.getTransactionInfoArray(cancellationIndex);
        if (transactionArray.length > 1) {
            transactionArray.removeAt(transactionIndex);
        } else {
            this.toastr.warning("At least one transaction is required!", 'WARN');
        }
    }

    resetForm(): void {
        this.frmGroup.reset();
        this.frmGroup.patchValue({
            creationDate: new Date(),
            assignmentCreationDateTime: new Date(),
            statusType: 'conf'
        });
    }

    save(): void {
        if (this.frmGroup.valid) {
            console.log('Form Data:', this.frmGroup.value);
            this.toastr.success('Resolution of Investigation saved successfully!', 'SUCCESS');
            // Add service call here when service is available
        } else {
            this.toastr.error('Please fill all required fields!', 'ERROR');
        }
    }
}
