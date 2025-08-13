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
    selector: 'app-pacs-052',
    imports: [
        ReactiveFormsModule,
        SelectOptionField,
        TextBaseInput,
        DateInput,
        PanelHeader,
        SubPanelHeader,
        AmountToWordInput,
    ],
    templateUrl: './pacs-052.html',
    standalone: true,
    styleUrl: './pacs-052.scss'
})
export class Pacs052 implements OnInit {

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

    accountTypeOptions: SelectOptionsModel[] = [
        {key: 'cacc', value: 'Current Account'},
        {key: 'sacc', value: 'Savings Account'},
        {key: 'card', value: 'Card Account'},
        {key: 'loan', value: 'Loan Account'}
    ];

    balanceTypeOptions: SelectOptionsModel[] = [
        {key: 'clbd', value: 'Closing Booked'},
        {key: 'opbd', value: 'Opening Booked'},
        {key: 'prcd', value: 'Previously Closed Booked'},
        {key: 'info', value: 'Information'}
    ];

    creditDebitOptions: SelectOptionsModel[] = [
        {key: 'crdt', value: 'Credit'},
        {key: 'dbit', value: 'Debit'}
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

            // Bank To Customer Account Report V08 -> Group Header
            messageIdentification: ['', Validators.required],
            creationDateTime: ['', Validators.required],
            messageRecipient: [''],
            messagePagination: [''],
            originalBusinessQuery: [''],
            additionalInformation: [''],

            // Report Array
            reports: this.formBuilder.array([
                this.createReportGroup()
            ])
        });

        FormGroupSignal.set(this.frmGroup);
    }

    createReportGroup(): FormGroup {
        return this.formBuilder.group({
            // Report Identification
            reportIdentification: ['', Validators.required],
            
            // Report Pagination
            reportPagination: [''],
            
            // Electronic Sequence Number
            electronicSequenceNumber: [''],
            
            // Reporting Sequence
            reportingSequence: [''],
            
            // Legal Sequence Number
            legalSequenceNumber: [''],
            
            // Creation Date Time
            reportCreationDateTime: [''],
            
            // From To Date
            fromDate: [''],
            toDate: [''],
            
            // Copy Duplicate Indicator
            copyDuplicateIndicator: [''],
            
            // Reporting Source
            reportingSource: [''],
            
            // Account
            accountId: ['', Validators.required],
            accountType: ['cacc', Validators.required],
            accountCurrency: [''],
            accountName: [''],
            accountOwner: [''],
            
            // Related Account
            relatedAccountId: [''],
            relatedAccountType: [''],
            
            // Interest Array
            interests: this.formBuilder.array([
                this.createInterestGroup()
            ]),
            
            // Balance Array
            balances: this.formBuilder.array([
                this.createBalanceGroup()
            ]),
            
            // Transactions Summary
            totalCreditEntries: [''],
            totalDebitEntries: [''],
            totalCreditAmount: [''],
            totalDebitAmount: [''],
            
            // Entry Array
            entries: this.formBuilder.array([
                this.createEntryGroup()
            ]),
            
            // Additional Report Information
            additionalReportInformation: ['']
        });
    }

    createInterestGroup(): FormGroup {
        return this.formBuilder.group({
            interestType: [''],
            interestRate: [''],
            interestAmount: [''],
            interestCurrency: [''],
            interestDate: ['']
        });
    }

    createBalanceGroup(): FormGroup {
        return this.formBuilder.group({
            balanceType: ['clbd', Validators.required],
            balanceAmount: ['', Validators.required],
            balanceCurrency: ['', Validators.required],
            balanceDate: ['', Validators.required],
            creditDebitIndicator: ['crdt', Validators.required]
        });
    }

    createEntryGroup(): FormGroup {
        return this.formBuilder.group({
            entryReference: [''],
            entryAmount: [''],
            entryCurrency: [''],
            creditDebitIndicator: ['crdt'],
            entryStatus: [''],
            entryDate: [''],
            entryValueDate: [''],
            entryDescription: [''],
            entryType: [''],
            entryCode: [''],
            entryAdditionalInfo: ['']
        });
    }

    get reports(): FormArray<FormGroup> {
        return this.frmGroup.get('reports') as FormArray<FormGroup>;
    }

    getInterestsArray(reportIndex: number): FormArray<FormGroup> {
        return this.reports.at(reportIndex).get('interests') as FormArray<FormGroup>;
    }

    getBalancesArray(reportIndex: number): FormArray<FormGroup> {
        return this.reports.at(reportIndex).get('balances') as FormArray<FormGroup>;
    }

    getEntriesArray(reportIndex: number): FormArray<FormGroup> {
        return this.reports.at(reportIndex).get('entries') as FormArray<FormGroup>;
    }

    addReport(): void {
        if (this.reports.length >= 10) {
            this.toastr.warning("You can't add more than 10 reports!", 'WARN');
            return;
        }
        this.reports.push(this.createReportGroup());
    }

    removeReport(index: number): void {
        if (this.reports.length > 1) {
            this.reports.removeAt(index);
        } else {
            this.toastr.warning("At least one report is required!", 'WARN');
        }
    }

    addInterest(reportIndex: number): void {
        const interestArray = this.getInterestsArray(reportIndex);
        if (interestArray.length >= 5) {
            this.toastr.warning("You can't add more than 5 interest records per report!", 'WARN');
            return;
        }
        interestArray.push(this.createInterestGroup());
    }

    removeInterest(reportIndex: number, interestIndex: number): void {
        const interestArray = this.getInterestsArray(reportIndex);
        if (interestArray.length > 1) {
            interestArray.removeAt(interestIndex);
        } else {
            this.toastr.warning("At least one interest record is required!", 'WARN');
        }
    }

    addBalance(reportIndex: number): void {
        const balanceArray = this.getBalancesArray(reportIndex);
        if (balanceArray.length >= 10) {
            this.toastr.warning("You can't add more than 10 balance records per report!", 'WARN');
            return;
        }
        balanceArray.push(this.createBalanceGroup());
    }

    removeBalance(reportIndex: number, balanceIndex: number): void {
        const balanceArray = this.getBalancesArray(reportIndex);
        if (balanceArray.length > 1) {
            balanceArray.removeAt(balanceIndex);
        } else {
            this.toastr.warning("At least one balance record is required!", 'WARN');
        }
    }

    addEntry(reportIndex: number): void {
        const entryArray = this.getEntriesArray(reportIndex);
        if (entryArray.length >= 100) {
            this.toastr.warning("You can't add more than 100 entries per report!", 'WARN');
            return;
        }
        entryArray.push(this.createEntryGroup());
    }

    removeEntry(reportIndex: number, entryIndex: number): void {
        const entryArray = this.getEntriesArray(reportIndex);
        if (entryArray.length > 1) {
            entryArray.removeAt(entryIndex);
        } else {
            this.toastr.warning("At least one entry is required!", 'WARN');
        }
    }

    resetForm(): void {
        this.frmGroup.reset();
        this.frmGroup.patchValue({
            creationDate: new Date(),
            creationDateTime: new Date()
        });
    }

    save(): void {
        if (this.frmGroup.valid) {
            console.log('Form Data:', this.frmGroup.value);
            this.toastr.success('Bank to Customer Account Report saved successfully!', 'SUCCESS');
            // Add service call here when service is available
        } else {
            this.toastr.error('Please fill all required fields!', 'ERROR');
        }
    }
}
