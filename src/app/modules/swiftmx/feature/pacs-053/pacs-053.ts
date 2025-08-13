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
    selector: 'app-pacs-053',
    imports: [
        ReactiveFormsModule,
        SelectOptionField,
        TextBaseInput,
        DateInput,
        PanelHeader,
        SubPanelHeader,
        AmountToWordInput,
    ],
    templateUrl: './pacs-053.html',
    standalone: true,
    styleUrl: './pacs-053.scss'
})
export class Pacs053 implements OnInit {

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

            // Bank To Customer Statement V08 -> Group Header
            messageIdentification: ['', Validators.required],
            creationDateTime: ['', Validators.required],
            messageRecipient: [''],
            messagePagination: [''],
            originalBusinessQuery: [''],
            additionalInformation: [''],

            // Statement Array
            statements: this.formBuilder.array([
                this.createStatementGroup()
            ])
        });

        FormGroupSignal.set(this.frmGroup);
    }

    createStatementGroup(): FormGroup {
        return this.formBuilder.group({
            // Statement Identification
            statementIdentification: ['', Validators.required],
            
            // Statement Pagination
            statementPagination: [''],
            
            // Electronic Sequence Number
            electronicSequenceNumber: [''],
            
            // Reporting Sequence
            reportingSequence: [''],
            
            // Legal Sequence Number
            legalSequenceNumber: [''],
            
            // Creation Date Time
            statementCreationDateTime: [''],
            
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
            
            // Additional Statement Information
            additionalStatementInformation: ['']
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

    get statements(): FormArray<FormGroup> {
        return this.frmGroup.get('statements') as FormArray<FormGroup>;
    }

    getInterestsArray(statementIndex: number): FormArray<FormGroup> {
        return this.statements.at(statementIndex).get('interests') as FormArray<FormGroup>;
    }

    getBalancesArray(statementIndex: number): FormArray<FormGroup> {
        return this.statements.at(statementIndex).get('balances') as FormArray<FormGroup>;
    }

    getEntriesArray(statementIndex: number): FormArray<FormGroup> {
        return this.statements.at(statementIndex).get('entries') as FormArray<FormGroup>;
    }

    addStatement(): void {
        if (this.statements.length >= 10) {
            this.toastr.warning("You can't add more than 10 statements!", 'WARN');
            return;
        }
        this.statements.push(this.createStatementGroup());
    }

    removeStatement(index: number): void {
        if (this.statements.length > 1) {
            this.statements.removeAt(index);
        } else {
            this.toastr.warning("At least one statement is required!", 'WARN');
        }
    }

    addInterest(statementIndex: number): void {
        const interestArray = this.getInterestsArray(statementIndex);
        if (interestArray.length >= 5) {
            this.toastr.warning("You can't add more than 5 interest records per statement!", 'WARN');
            return;
        }
        interestArray.push(this.createInterestGroup());
    }

    removeInterest(statementIndex: number, interestIndex: number): void {
        const interestArray = this.getInterestsArray(statementIndex);
        if (interestArray.length > 1) {
            interestArray.removeAt(interestIndex);
        } else {
            this.toastr.warning("At least one interest record is required!", 'WARN');
        }
    }

    addBalance(statementIndex: number): void {
        const balanceArray = this.getBalancesArray(statementIndex);
        if (balanceArray.length >= 10) {
            this.toastr.warning("You can't add more than 10 balance records per statement!", 'WARN');
            return;
        }
        balanceArray.push(this.createBalanceGroup());
    }

    removeBalance(statementIndex: number, balanceIndex: number): void {
        const balanceArray = this.getBalancesArray(statementIndex);
        if (balanceArray.length > 1) {
            balanceArray.removeAt(balanceIndex);
        } else {
            this.toastr.warning("At least one balance record is required!", 'WARN');
        }
    }

    addEntry(statementIndex: number): void {
        const entryArray = this.getEntriesArray(statementIndex);
        if (entryArray.length >= 100) {
            this.toastr.warning("You can't add more than 100 entries per statement!", 'WARN');
            return;
        }
        entryArray.push(this.createEntryGroup());
    }

    removeEntry(statementIndex: number, entryIndex: number): void {
        const entryArray = this.getEntriesArray(statementIndex);
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
            this.toastr.success('Bank to Customer Statement saved successfully!', 'SUCCESS');
            // Add service call here when service is available
        } else {
            this.toastr.error('Please fill all required fields!', 'ERROR');
        }
    }
}
