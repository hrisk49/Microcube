import {Component, effect, inject, OnInit, signal, WritableSignal} from '@angular/core';
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
import {ExpansionPanelHeader} from '../../../../shared/components/expansion-panel-header/expansion-panel-header';
import {ExpansionSubPanelHeader} from '../../../../shared/components/expansion-sub-panel-header/expansion-sub-panel-header';
import {AmountToWordInput} from '../../../../shared/components/input-types/amount-to-word-input/amount-to-word-input';
import {CommonModule} from '@angular/common';
import { SelectOptionsModel } from '../../../../shared/models/select-options-model';


@Component({
    selector: 'app-pacs-003',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SelectOptionField,
        TextBaseInput,
        DateInput,
        ExpansionPanelHeader,
        ExpansionSubPanelHeader,
        AmountToWordInput,
    ],
    templateUrl: './pacs-003.html',
    standalone: true,
    styleUrl: './pacs-003.scss'
})
export class Pacs003 implements OnInit {

    formBuilder = inject(FormBuilder);
    toastr = inject(ToastrService);
    frmGroup: FormGroup;
    onClickReset = ONCLICK_RESET;
    onClickSave = ONCLICK_SAVE;

    // Panel state signals for expansion panels
    businessHeaderPanel: WritableSignal<boolean> = signal(true);
    relatedPanel: WritableSignal<boolean> = signal(false);
    directDebitPanel: WritableSignal<boolean> = signal(true);
    groupHeaderPanel: WritableSignal<boolean> = signal(true);
    settlementInfoPanel: WritableSignal<boolean> = signal(true);
    paymentIdentificationPanel: WritableSignal<boolean> = signal(true);
    paymentTypeInfoPanel: WritableSignal<boolean> = signal(true);
    settlementInfo2Panel: WritableSignal<boolean> = signal(true);
    previousAgentsPanel: WritableSignal<boolean> = signal(true);
    prevAgent1Panel: WritableSignal<boolean> = signal(false);
    prevAgent2Panel: WritableSignal<boolean> = signal(false);
    prevAgent3Panel: WritableSignal<boolean> = signal(false);
    agentsPanel: WritableSignal<boolean> = signal(true);
    instructingAgentPanel: WritableSignal<boolean> = signal(true);
    instructedAgentPanel: WritableSignal<boolean> = signal(true);
    intermediaryAgentsPanel: WritableSignal<boolean> = signal(true);
    intermediary1Panel: WritableSignal<boolean> = signal(false);
    intermediary2Panel: WritableSignal<boolean> = signal(false);
    intermediary3Panel: WritableSignal<boolean> = signal(false);
    debtorPanel: WritableSignal<boolean> = signal(true);
    creditorPanel: WritableSignal<boolean> = signal(true);
    instructionsPanel: WritableSignal<boolean> = signal(true);
    purposeRemittancePanel: WritableSignal<boolean> = signal(true);
    chargesPanel: WritableSignal<boolean> = signal(true);
  
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

    settlementMethodOptions: SelectOptionsModel[] = [
        {key: 'COVE', value: 'COVE'},
        {key: 'INDA', value: 'INDA'},
        {key: 'INGA', value: 'INGA'}
    ];

    clearingChannelOptions: SelectOptionsModel[] = [
        {key: 'BOOK', value: 'BOOK'},
        {key: 'MPNS', value: 'MPNS'},
        {key: 'RTGS', value: 'RTGS'},
        {key: 'RTNS', value: 'RTNS'}
    ];

    settlementPriorityOptions: SelectOptionsModel[] = [
        {key: 'HIGH', value: 'High'},
        {key: 'NORM', value: 'Normal'},
        {key: 'URGT', value: 'Urgent'}
    ];

    chargeBearerOptions: SelectOptionsModel[] = [
        {key: 'CRED', value: 'BorneByCreditor'},
        {key: 'DEBT', value: 'BorneByDebtor'},
        {key: 'SHAR', value: 'Shared'},
        {key: 'SLEV', value: 'FollowingServiceLevel'}
    ];

    instructionForCreditorAgentOptions: SelectOptionsModel[] = [
        {key: 'TELB', value: 'Telephone Beneficiary'},
        {key: 'PHOB', value: 'Phone Beneficiary'}
    ];

    sequenceTypeOptions: SelectOptionsModel[] = [
        {key: 'Final', value: 'FNAL'},
        {key: 'first', value: 'FRST'},
        {key: 'oneOff', value: 'OOFF'},
        {key: 'recurring', value: 'RCUR'},
        {key: 'represented', value: 'RPRE'},
    ];

    currencyOptions: SelectOptionsModel[] = [
        { key: 'USD', value: 'USD - US Dollar' },
        { key: 'EUR', value: 'EUR - Euro' },
        { key: 'GBP', value: 'GBP - British Pound' },
        { key: 'JPY', value: 'JPY - Japanese Yen' },
        { key: 'CHF', value: 'CHF - Swiss Franc' },
        { key: 'CAD', value: 'CAD - Canadian Dollar' },
        { key: 'AUD', value: 'AUD - Australian Dollar' },
        { key: 'CNY', value: 'CNY - Chinese Yuan' },
        { key: 'HKD', value: 'HKD - Hong Kong Dollar' },
        { key: 'SGD', value: 'SGD - Singapore Dollar' },
        { key: 'SEK', value: 'SEK - Swedish Krona' },
        { key: 'NOK', value: 'NOK - Norwegian Krone' },
        { key: 'DKK', value: 'DKK - Danish Krone' },
        { key: 'NZD', value: 'NZD - New Zealand Dollar' },
        { key: 'MXN', value: 'MXN - Mexican Peso' },
        { key: 'BRL', value: 'BRL - Brazilian Real' },
        { key: 'INR', value: 'INR - Indian Rupee' },
        { key: 'KRW', value: 'KRW - South Korean Won' },
        { key: 'TRY', value: 'TRY - Turkish Lira' },
        { key: 'RUB', value: 'RUB - Russian Ruble' },
        { key: 'ZAR', value: 'ZAR - South African Rand' },
        { key: 'PLN', value: 'PLN - Polish Zloty' },
        { key: 'CZK', value: 'CZK - Czech Koruna' },
        { key: 'HUF', value: 'HUF - Hungarian Forint' },
        { key: 'ILS', value: 'ILS - Israeli Shekel' },
        { key: 'CLP', value: 'CLP - Chilean Peso' },
        { key: 'PHP', value: 'PHP - Philippine Peso' },
        { key: 'AED', value: 'AED - UAE Dirham' },
        { key: 'SAR', value: 'SAR - Saudi Riyal' },
        { key: 'THB', value: 'THB - Thai Baht' },
        { key: 'MYR', value: 'MYR - Malaysian Ringgit' },
        { key: 'IDR', value: 'IDR - Indonesian Rupiah' },
        { key: 'VND', value: 'VND - Vietnamese Dong' },
        { key: 'EGP', value: 'EGP - Egyptian Pound' },
        { key: 'NGN', value: 'NGN - Nigerian Naira' },
        { key: 'KES', value: 'KES - Kenyan Shilling' },
        { key: 'GHS', value: 'GHS - Ghanaian Cedi' }
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
            }
        });

        effect(() => {
            if (this.onClickSave()) {
                this.saveForm();
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
            BizMsgIdr: ['', [Validators.required, Validators.maxLength(35)]], // BusinessMessageIdentifier max 35
            MsgDefIdr: ['', Validators.required], // MessageDefinitionIdentifier example - camt.001.001.03
            BizSvc: ['swift.cbprplus.02'], // BusinessService The value "swift.cbprplus.02" must be used.
            CreDt: ['', Validators.required],
            ReqdColltnDt: ['', Validators.required], // RequestedCollectionDate Mandatory

            // Header block
            cpyDplct: [null], // values can be only - CODU,COPY,DUPL
            PsblDplct: [null], // PossibleDuplicate Values Can only be - YES/NO
            Priority: [null], // Header block Priority values can only be - HIGH,NORM
            MsgId: ['', [Validators.required, Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]], // MessageIdentification //0-9 a-z A-Z / - ? : ( ) . , ' +
            CreDtTm: ['', Validators.required], // CreationDateTime
            NbOfTxs: ['', Validators.required], // Number of transactions
            SttlmMtd: [null], // SettlementMethod value - COVE,INDA,INGA

            // Settlement Account - Detailed Account Model
            SttlmAcctIban: ['', Validators.maxLength(30)],
            SttlmAcctId: ['', Validators.maxLength(34)],
            SttlmAcctSchmeNmCd: ['', Validators.maxLength(4)],
            SttlmAcctSchmeNmPrtry: [''],
            SttlmAcctIssr: ['', Validators.maxLength(35)],
            SttlmAcctTpCd: [''],
            SttlmAcctTpPrtry: [''],
            SttlmAcctCcy: ['', Validators.maxLength(3)],
            SttlmAcctNm: ['', [Validators.maxLength(70), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]],
            SttlmAcctPrxyTpCd: [''],
            SttlmAcctPrxyTpPrtry: [''],
            SttlmAcctPrxyId: ['', Validators.maxLength(320)],
            // PaymentIdentification Tag
            InstrId: ['', [Validators.maxLength(16), Validators.pattern(/^[0-9a-zA-Z\-\?\:\(\)\.\,\'\+\s]+$/)]], // InstructionIdentification Max 16 pattern 0-9 a-z A-Z - ? : ( ) . , ' +
            EndToEndId: ['', Validators.maxLength(35)], // EndToEndIdentification max 35
            TxId: ['', [Validators.required, Validators.maxLength(35)]], // TransactionIdentification max 35 Mandatory
            UETR: ['', Validators.required], // Mandatory
            ClrSysRef: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]], // ClearingSystemReference max 35 pattern [0-9a-zA-Z/\-\?:\(\)\.,'\+ ]+

            // PaymentTypeInformation
            InstrPrty: [null], // InstructionPriority value can be HIGH/NORM
            ClrChanl: [null], // ClearingChannel values can be BOOK/MPNS/RTGS/RTNS
            SvcLvlCD: [''], // Service Level Code
            SvcLvlPrtry: [''], // Service Level Proprietary
            LclInstrmCD: [''], // LocalInstrument
            LclInstrmPrtry: [''], // LocalInstrument Proprietary
            CtgyPurpCd: [''], // CategoryPurpose Code
            CtgyPurpPrtry: [''], // CategoryPurpose

            // Settlement Information
            IntrBkSttlmAmtCcy: ['', Validators.maxLength(3)], // InterbankSettlementAmount max 3 char
            IntrBkSttlmAmt: ['', [Validators.required, Validators.pattern(/^\d{1,14}(\.\d{1,5})?$/)]], // InterbankSettlementAmount size 14,5
            IntrBkSttlmDt: [''], // InterbankSettlementDate
            SttlmPrty: [null], // SettlementPriority values HIGH/NORM/URGT

            // Previous Instructing Agents - Detailed Agent Model
            PrvsInstgAgt1Bic: [''],
            PrvsInstgAgt1ClrSysIdCd: [''],
            PrvsInstgAgt1MmbId: ['', [Validators.maxLength(28), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]],
            PrvsInstgAgt1Lei: ['', [Validators.maxLength(20), Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
            PrvsInstgAgt1Nm: ['', Validators.maxLength(140)],
            PrvsInstgAgt1AdrLine1: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            PrvsInstgAgt1AdrLine2: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            PrvsInstgAgt1AdrLine3: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            PrvsInstgAgt1AdrDept: ['', Validators.maxLength(70)],
            PrvsInstgAgt1AdrSubDept: ['', Validators.maxLength(70)],
            PrvsInstgAgt1AdrStrtNm: ['', Validators.maxLength(70)],
            PrvsInstgAgt1AdrBldgNb: ['', Validators.maxLength(16)],
            PrvsInstgAgt1AdrBldgNm: ['', Validators.maxLength(35)],
            PrvsInstgAgt1AdrFlr: [''],
            PrvsInstgAgt1AdrPstBx: ['', Validators.maxLength(16)],
            PrvsInstgAgt1AdrRoom: ['', Validators.maxLength(70)],
            PrvsInstgAgt1AdrPstCd: ['', Validators.maxLength(16)],
            PrvsInstgAgt1AdrTwnNm: ['', Validators.maxLength(35)],
            PrvsInstgAgt1AdrTwnLctnNm: ['', Validators.maxLength(35)],
            PrvsInstgAgt1AdrDstrctNm: ['', Validators.maxLength(35)],
            PrvsInstgAgt1AdrCtrySubDvsn: ['', Validators.maxLength(35)],
            PrvsInstgAgt1AdrCtry: [''],
            PrvsInstgAgt1PstlAdr: [''],
            PrvsInstgAgt1CtryOfRes: [''],
            PrvsInstgAgt1AcctId: [''],
            PrvsInstgAgt1AcctTp: [''],
            PrvsInstgAgt1AcctCcy: [''],
            PrvsInstgAgt1AcctNm: [''],
            PrvsInstgAgt1AcctOwnr: [''],
            PrvsInstgAgt1AcctIban: [''],
            PrvsInstgAgt1AcctLei: [''],

            PrvsInstgAgt2Bic: [''],
            PrvsInstgAgt2ClrSysIdCd: [''],
            PrvsInstgAgt2MmbId: ['', [Validators.maxLength(28), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]],
            PrvsInstgAgt2Lei: ['', [Validators.maxLength(20), Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
            PrvsInstgAgt2Nm: ['', Validators.maxLength(140)],
            PrvsInstgAgt2AdrLine1: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            PrvsInstgAgt2AdrLine2: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            PrvsInstgAgt2AdrLine3: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            PrvsInstgAgt2AdrDept: ['', Validators.maxLength(70)],
            PrvsInstgAgt2AdrSubDept: ['', Validators.maxLength(70)],
            PrvsInstgAgt2AdrStrtNm: ['', Validators.maxLength(70)],
            PrvsInstgAgt2AdrBldgNb: ['', Validators.maxLength(16)],
            PrvsInstgAgt2AdrBldgNm: ['', Validators.maxLength(35)],
            PrvsInstgAgt2AdrFlr: [''],
            PrvsInstgAgt2AdrPstBx: ['', Validators.maxLength(16)],
            PrvsInstgAgt2AdrRoom: ['', Validators.maxLength(70)],
            PrvsInstgAgt2AdrPstCd: ['', Validators.maxLength(16)],
            PrvsInstgAgt2AdrTwnNm: ['', Validators.maxLength(35)],
            PrvsInstgAgt2AdrTwnLctnNm: ['', Validators.maxLength(35)],
            PrvsInstgAgt2AdrDstrctNm: ['', Validators.maxLength(35)],
            PrvsInstgAgt2AdrCtrySubDvsn: ['', Validators.maxLength(35)],
            PrvsInstgAgt2AdrCtry: [''],
            PrvsInstgAgt2PstlAdr: [''],
            PrvsInstgAgt2CtryOfRes: [''],
            PrvsInstgAgt2AcctId: [''],
            PrvsInstgAgt2AcctTp: [''],
            PrvsInstgAgt2AcctCcy: [''],
            PrvsInstgAgt2AcctNm: [''],
            PrvsInstgAgt2AcctOwnr: [''],
            PrvsInstgAgt2AcctIban: [''],
            PrvsInstgAgt2AcctLei: [''],

            PrvsInstgAgt3Bic: [''],
            PrvsInstgAgt3ClrSysIdCd: [''],
            PrvsInstgAgt3MmbId: ['', [Validators.maxLength(28), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]],
            PrvsInstgAgt3Lei: ['', [Validators.maxLength(20), Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
            PrvsInstgAgt3Nm: ['', Validators.maxLength(140)],
            PrvsInstgAgt3AdrLine1: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            PrvsInstgAgt3AdrLine2: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            PrvsInstgAgt3AdrLine3: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            PrvsInstgAgt3AdrDept: ['', Validators.maxLength(70)],
            PrvsInstgAgt3AdrSubDept: ['', Validators.maxLength(70)],
            PrvsInstgAgt3AdrStrtNm: ['', Validators.maxLength(70)],
            PrvsInstgAgt3AdrBldgNb: ['', Validators.maxLength(16)],
            PrvsInstgAgt3AdrBldgNm: ['', Validators.maxLength(35)],
            PrvsInstgAgt3AdrFlr: [''],
            PrvsInstgAgt3AdrPstBx: ['', Validators.maxLength(16)],
            PrvsInstgAgt3AdrRoom: ['', Validators.maxLength(70)],
            PrvsInstgAgt3AdrPstCd: ['', Validators.maxLength(16)],
            PrvsInstgAgt3AdrTwnNm: ['', Validators.maxLength(35)],
            PrvsInstgAgt3AdrTwnLctnNm: ['', Validators.maxLength(35)],
            PrvsInstgAgt3AdrDstrctNm: ['', Validators.maxLength(35)],
            PrvsInstgAgt3AdrCtrySubDvsn: ['', Validators.maxLength(35)],
            PrvsInstgAgt3AdrCtry: [''],
            PrvsInstgAgt3PstlAdr: [''],
            PrvsInstgAgt3CtryOfRes: [''],
            PrvsInstgAgt3AcctId: [''],
            PrvsInstgAgt3AcctTp: [''],
            PrvsInstgAgt3AcctCcy: [''],
            PrvsInstgAgt3AcctNm: [''],
            PrvsInstgAgt3AcctOwnr: [''],
            PrvsInstgAgt3AcctIban: [''],
            PrvsInstgAgt3AcctLei: [''],

            // Agents - Detailed Agent Model
            InstgAgtBIcfi: ['', Validators.maxLength(12)],
            InstgAgtClrSysIdCd: [''],
            InstgAgtMmbId: ['', [Validators.maxLength(28), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]],
            InstgAgtLei: ['', [Validators.maxLength(20), Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
            InstgAgtNm: ['', Validators.maxLength(140)],
            InstgAgtAdrLine1: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            InstgAgtAdrLine2: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            InstgAgtAdrLine3: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            InstgAgtAdrDept: ['', Validators.maxLength(70)],
            InstgAgtAdrSubDept: ['', Validators.maxLength(70)],
            InstgAgtAdrStrtNm: ['', Validators.maxLength(70)],
            InstgAgtAdrBldgNb: ['', Validators.maxLength(16)],
            InstgAgtAdrBldgNm: ['', Validators.maxLength(35)],
            InstgAgtAdrFlr: [''],
            InstgAgtAdrPstBx: ['', Validators.maxLength(16)],
            InstgAgtAdrRoom: ['', Validators.maxLength(70)],
            InstgAgtAdrPstCd: ['', Validators.maxLength(16)],
            InstgAgtAdrTwnNm: ['', Validators.maxLength(35)],
            InstgAgtAdrTwnLctnNm: ['', Validators.maxLength(35)],
            InstgAgtAdrDstrctNm: ['', Validators.maxLength(35)],
            InstgAgtAdrCtrySubDvsn: ['', Validators.maxLength(35)],
            InstgAgtAdrCtry: [''],

            InstdAgtBIcfi: ['', Validators.maxLength(12)],
            InstdAgtClrSysIdCd: [''],
            InstdAgtMmbId: ['', [Validators.maxLength(28), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]],
            InstdAgtLei: ['', [Validators.maxLength(20), Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
            InstdAgtNm: ['', Validators.maxLength(140)],
            InstdAgtAdrLine1: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            InstdAgtAdrLine2: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            InstdAgtAdrLine3: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            InstdAgtAdrDept: ['', Validators.maxLength(70)],
            InstdAgtAdrSubDept: ['', Validators.maxLength(70)],
            InstdAgtAdrStrtNm: ['', Validators.maxLength(70)],
            InstdAgtAdrBldgNb: ['', Validators.maxLength(16)],
            InstdAgtAdrBldgNm: ['', Validators.maxLength(35)],
            InstdAgtAdrFlr: [''],
            InstdAgtAdrPstBx: ['', Validators.maxLength(16)],
            InstdAgtAdrRoom: ['', Validators.maxLength(70)],
            InstdAgtAdrPstCd: ['', Validators.maxLength(16)],
            InstdAgtAdrTwnNm: ['', Validators.maxLength(35)],
            InstdAgtAdrTwnLctnNm: ['', Validators.maxLength(35)],
            InstdAgtAdrDstrctNm: ['', Validators.maxLength(35)],
            InstdAgtAdrCtrySubDvsn: ['', Validators.maxLength(35)],
            InstdAgtAdrCtry: [''],

            // Intermediary Agents - Detailed Agent Model
            IntrmyAgt1Bic: [''],
            IntrmyAgt1ClrSysIdCd: [''],
            IntrmyAgt1MmbId: ['', [Validators.maxLength(28), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]],
            IntrmyAgt1Lei: ['', [Validators.maxLength(20), Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
            IntrmyAgt1Nm: ['', Validators.maxLength(140)],
            IntrmyAgt1AdrLine1: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            IntrmyAgt1AdrLine2: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            IntrmyAgt1AdrLine3: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            IntrmyAgt1AdrDept: ['', Validators.maxLength(70)],
            IntrmyAgt1AdrSubDept: ['', Validators.maxLength(70)],
            IntrmyAgt1AdrStrtNm: ['', Validators.maxLength(70)],
            IntrmyAgt1AdrBldgNb: ['', Validators.maxLength(16)],
            IntrmyAgt1AdrBldgNm: ['', Validators.maxLength(35)],
            IntrmyAgt1AdrFlr: [''],
            IntrmyAgt1AdrPstBx: ['', Validators.maxLength(16)],
            IntrmyAgt1AdrRoom: ['', Validators.maxLength(70)],
            IntrmyAgt1AdrPstCd: ['', Validators.maxLength(16)],
            IntrmyAgt1AdrTwnNm: ['', Validators.maxLength(35)],
            IntrmyAgt1AdrTwnLctnNm: ['', Validators.maxLength(35)],
            IntrmyAgt1AdrDstrctNm: ['', Validators.maxLength(35)],
            IntrmyAgt1AdrCtrySubDvsn: ['', Validators.maxLength(35)],
            IntrmyAgt1AdrCtry: [''],
            IntrmyAgt1PstlAdr: [''],
            IntrmyAgt1CtryOfRes: [''],
            IntrmyAgt1AcctId: [''],
            IntrmyAgt1AcctTp: [''],
            IntrmyAgt1AcctCcy: [''],
            IntrmyAgt1AcctNm: [''],
            IntrmyAgt1AcctOwnr: [''],
            IntrmyAgt1AcctIban: [''],
            IntrmyAgt1AcctLei: [''],

            IntrmyAgt2Bic: [''],
            IntrmyAgt2ClrSysIdCd: [''],
            IntrmyAgt2MmbId: ['', [Validators.maxLength(28), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]],
            IntrmyAgt2Lei: ['', [Validators.maxLength(20), Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
            IntrmyAgt2Nm: ['', Validators.maxLength(140)],
            IntrmyAgt2AdrLine1: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            IntrmyAgt2AdrLine2: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            IntrmyAgt2AdrLine3: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            IntrmyAgt2AdrDept: ['', Validators.maxLength(70)],
            IntrmyAgt2AdrSubDept: ['', Validators.maxLength(70)],
            IntrmyAgt2AdrStrtNm: ['', Validators.maxLength(70)],
            IntrmyAgt2AdrBldgNb: ['', Validators.maxLength(16)],
            IntrmyAgt2AdrBldgNm: ['', Validators.maxLength(35)],
            IntrmyAgt2AdrFlr: [''],
            IntrmyAgt2AdrPstBx: ['', Validators.maxLength(16)],
            IntrmyAgt2AdrRoom: ['', Validators.maxLength(70)],
            IntrmyAgt2AdrPstCd: ['', Validators.maxLength(16)],
            IntrmyAgt2AdrTwnNm: ['', Validators.maxLength(35)],
            IntrmyAgt2AdrTwnLctnNm: ['', Validators.maxLength(35)],
            IntrmyAgt2AdrDstrctNm: ['', Validators.maxLength(35)],
            IntrmyAgt2AdrCtrySubDvsn: ['', Validators.maxLength(35)],
            IntrmyAgt2AdrCtry: [''],
            IntrmyAgt2PstlAdr: [''],
            IntrmyAgt2CtryOfRes: [''],
            IntrmyAgt2AcctId: [''],
            IntrmyAgt2AcctTp: [''],
            IntrmyAgt2AcctCcy: [''],
            IntrmyAgt2AcctNm: [''],
            IntrmyAgt2AcctOwnr: [''],
            IntrmyAgt2AcctIban: [''],
            IntrmyAgt2AcctLei: [''],

            IntrmyAgt3Bic: [''],
            IntrmyAgt3ClrSysIdCd: [''],
            IntrmyAgt3MmbId: ['', [Validators.maxLength(28), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]],
            IntrmyAgt3Lei: ['', [Validators.maxLength(20), Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
            IntrmyAgt3Nm: ['', Validators.maxLength(140)],
            IntrmyAgt3AdrLine1: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            IntrmyAgt3AdrLine2: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            IntrmyAgt3AdrLine3: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            IntrmyAgt3AdrDept: ['', Validators.maxLength(70)],
            IntrmyAgt3AdrSubDept: ['', Validators.maxLength(70)],
            IntrmyAgt3AdrStrtNm: ['', Validators.maxLength(70)],
            IntrmyAgt3AdrBldgNb: ['', Validators.maxLength(16)],
            IntrmyAgt3AdrBldgNm: ['', Validators.maxLength(35)],
            IntrmyAgt3AdrFlr: [''],
            IntrmyAgt3AdrPstBx: ['', Validators.maxLength(16)],
            IntrmyAgt3AdrRoom: ['', Validators.maxLength(70)],
            IntrmyAgt3AdrPstCd: ['', Validators.maxLength(16)],
            IntrmyAgt3AdrTwnNm: ['', Validators.maxLength(35)],
            IntrmyAgt3AdrTwnLctnNm: ['', Validators.maxLength(35)],
            IntrmyAgt3AdrDstrctNm: ['', Validators.maxLength(35)],
            IntrmyAgt3AdrCtrySubDvsn: ['', Validators.maxLength(35)],
            IntrmyAgt3AdrCtry: [''],
            IntrmyAgt3PstlAdr: [''],
            IntrmyAgt3CtryOfRes: [''],
            IntrmyAgt3AcctId: [''],
            IntrmyAgt3AcctTp: [''],
            IntrmyAgt3AcctCcy: [''],
            IntrmyAgt3AcctNm: [''],
            IntrmyAgt3AcctOwnr: [''],
            IntrmyAgt3AcctIban: [''],
            IntrmyAgt3AcctLei: [''],

            // Debtor - Detailed Party Model
            DbtrNm: ['', [Validators.required, Validators.maxLength(140), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            DbtrCtryOfRes: [''],
            // Debtor Address
            DbtrAdrDept: ['', Validators.maxLength(70)],
            DbtrAdrSubDept: ['', Validators.maxLength(70)],
            DbtrAdrStrtNm: ['', Validators.maxLength(70)],
            DbtrAdrBldgNb: ['', Validators.maxLength(16)],
            DbtrAdrBldgNm: ['', Validators.maxLength(35)],
            DbtrAdrFlr: [''],
            DbtrAdrPstBx: ['', Validators.maxLength(16)],
            DbtrAdrRoom: ['', Validators.maxLength(70)],
            DbtrAdrPstCd: ['', Validators.maxLength(16)],
            DbtrAdrTwnNm: ['', Validators.maxLength(35)],
            DbtrAdrTwnLctnNm: ['', Validators.maxLength(35)],
            DbtrAdrDstrctNm: ['', Validators.maxLength(35)],
            DbtrAdrCtrySubDvsn: ['', Validators.maxLength(35)],
            DbtrAdrCtry: [''],
            DbtrAdrLine1: ['', Validators.maxLength(35)],
            DbtrAdrLine2: ['', Validators.maxLength(35)],
            DbtrAdrLine3: ['', Validators.maxLength(35)],
            // Debtor Organisation Identification
            DbtrOrgIdBic: ['', Validators.maxLength(12)],
            DbtrOrgIdLEI: ['', Validators.maxLength(20)],
            DbtrOrgIdOthrID: ['', Validators.maxLength(35)],
            DbtrOrgIdOthrScNmCD: ['', Validators.maxLength(4)],
            DbtrOrgIdOthrIssr: ['', Validators.maxLength(35)],
            // Debtor Private Identification
            DbtrBirthDt: [''],
            DbtrPrvcOfBirth: ['', Validators.maxLength(35)],
            DbtrCityOfBirth: ['', Validators.maxLength(35)],
            DbtrCtryOfBirth: ['', Validators.maxLength(2)],
            DbtrPrvtOthId1: ['', Validators.maxLength(35)],
            DbtrPrvtOthIdSchNmCD1: [''],
            DbtrPrvtOthIdIssr1: ['', Validators.maxLength(35)],
            DbtrPrvtOthId2: ['', Validators.maxLength(35)],
            DbtrPrvtOthIdSchNmCD2: [''],
            DbtrPrvtOthIdIssr2: ['', Validators.maxLength(35)],
            // Debtor Account
            DbtrAcctIban: ['', Validators.maxLength(30)],
            DbtrAcctId: ['', [Validators.required, Validators.maxLength(34)]],
            DbtrAcctSchmeNmCd: ['', Validators.maxLength(4)],
            DbtrAcctSchmeNmPrtry: [''],
            DbtrAcctIssr: ['', Validators.maxLength(35)],
            DbtrAcctTpCd: [''],
            DbtrAcctTpPrtry: [''],
            DbtrAcctCcy: ['', Validators.maxLength(3)],
            DbtrAcctNm: ['', [Validators.maxLength(70), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]],
            DbtrAcctPrxyTpCd: [''],
            DbtrAcctPrxyTpPrtry: [''],
            DbtrAcctPrxyId: ['', Validators.maxLength(320)],
            // Debtor Agent
            DbtrAgtBIcfi: ['', [Validators.required, Validators.maxLength(12)]],
            DbtrAgtClrSysIdCd: [''],
            DbtrAgtMmbId: ['', [Validators.maxLength(28), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]],
            DbtrAgtLei: ['', [Validators.maxLength(20), Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
            DbtrAgtNm: ['', Validators.maxLength(140)],
            DbtrAgtAdrLine1: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            DbtrAgtAdrLine2: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            DbtrAgtAdrLine3: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            DbtrAgtAdrDept: ['', Validators.maxLength(70)],
            DbtrAgtAdrSubDept: ['', Validators.maxLength(70)],
            DbtrAgtAdrStrtNm: ['', Validators.maxLength(70)],
            DbtrAgtAdrBldgNb: ['', Validators.maxLength(16)],
            DbtrAgtAdrBldgNm: ['', Validators.maxLength(35)],
            DbtrAgtAdrFlr: [''],
            DbtrAgtAdrPstBx: ['', Validators.maxLength(16)],
            DbtrAgtAdrRoom: ['', Validators.maxLength(70)],
            DbtrAgtAdrPstCd: ['', Validators.maxLength(16)],
            DbtrAgtAdrTwnNm: ['', Validators.maxLength(35)],
            DbtrAgtAdrTwnLctnNm: ['', Validators.maxLength(35)],
            DbtrAgtAdrDstrctNm: ['', Validators.maxLength(35)],
            DbtrAgtAdrCtrySubDvsn: ['', Validators.maxLength(35)],
            DbtrAgtAdrCtry: [''],

            // Creditor Agent
            CdtrAgtBIcfi: ['', [Validators.required, Validators.maxLength(12)]],
            CdtrAgtClrSysIdCd: [''],
            CdtrAgtMmbId: ['', [Validators.maxLength(28), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]],
            CdtrAgtLei: ['', [Validators.maxLength(20), Validators.pattern(/^[A-Z0-9]{18}[0-9]{2}$/)]],
            CdtrAgtNm: ['', Validators.maxLength(140)],
            CdtrAgtAdrLine1: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            CdtrAgtAdrLine2: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            CdtrAgtAdrLine3: ['', [Validators.maxLength(35), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            CdtrAgtAdrDept: ['', Validators.maxLength(70)],
            CdtrAgtAdrSubDept: ['', Validators.maxLength(70)],
            CdtrAgtAdrStrtNm: ['', Validators.maxLength(70)],
            CdtrAgtAdrBldgNb: ['', Validators.maxLength(16)],
            CdtrAgtAdrBldgNm: ['', Validators.maxLength(35)],
            CdtrAgtAdrFlr: [''],
            CdtrAgtAdrPstBx: ['', Validators.maxLength(16)],
            CdtrAgtAdrRoom: ['', Validators.maxLength(70)],
            CdtrAgtAdrPstCd: ['', Validators.maxLength(16)],
            CdtrAgtAdrTwnNm: ['', Validators.maxLength(35)],
            CdtrAgtAdrTwnLctnNm: ['', Validators.maxLength(35)],
            CdtrAgtAdrDstrctNm: ['', Validators.maxLength(35)],
            CdtrAgtAdrCtrySubDvsn: ['', Validators.maxLength(35)],
            CdtrAgtAdrCtry: [''],

            // Creditor - Detailed Party Model
            CdtrNm: ['', [Validators.required, Validators.maxLength(140), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]],
            CdtrCtryOfRes: [''],
            // Creditor Address
            CdtrAdrDept: ['', Validators.maxLength(70)],
            CdtrAdrSubDept: ['', Validators.maxLength(70)],
            CdtrAdrStrtNm: ['', Validators.maxLength(70)],
            CdtrAdrBldgNb: ['', Validators.maxLength(16)],
            CdtrAdrBldgNm: ['', Validators.maxLength(35)],
            CdtrAdrFlr: [''],
            CdtrAdrPstBx: ['', Validators.maxLength(16)],
            CdtrAdrRoom: ['', Validators.maxLength(70)],
            CdtrAdrPstCd: ['', Validators.maxLength(16)],
            CdtrAdrTwnNm: ['', Validators.maxLength(35)],
            CdtrAdrTwnLctnNm: ['', Validators.maxLength(35)],
            CdtrAdrDstrctNm: ['', Validators.maxLength(35)],
            CdtrAdrCtrySubDvsn: ['', Validators.maxLength(35)],
            CdtrAdrCtry: [''],
            CdtrAdrLine1: ['', Validators.maxLength(35)],
            CdtrAdrLine2: ['', Validators.maxLength(35)],
            CdtrAdrLine3: ['', Validators.maxLength(35)],
            // Creditor Organisation Identification
            CdtrOrgIdBic: ['', Validators.maxLength(12)],
            CdtrOrgIdLEI: ['', Validators.maxLength(20)],
            CdtrOrgIdOthrID: ['', Validators.maxLength(35)],
            CdtrOrgIdOthrScNmCD: ['', Validators.maxLength(4)],
            CdtrOrgIdOthrIssr: ['', Validators.maxLength(35)],
            // Creditor Private Identification
            CdtrBirthDt: [''],
            CdtrPrvcOfBirth: ['', Validators.maxLength(35)],
            CdtrCityOfBirth: ['', Validators.maxLength(35)],
            CdtrCtryOfBirth: ['', Validators.maxLength(2)],
            CdtrPrvtOthId1: ['', Validators.maxLength(35)],
            CdtrPrvtOthIdSchNmCD1: [''],
            CdtrPrvtOthIdIssr1: ['', Validators.maxLength(35)],
            CdtrPrvtOthId2: ['', Validators.maxLength(35)],
            CdtrPrvtOthIdSchNmCD2: [''],
            CdtrPrvtOthIdIssr2: ['', Validators.maxLength(35)],
            // Creditor Account
            CdtrAcctIban: ['', Validators.maxLength(30)],
            CdtrAcctId: ['', Validators.maxLength(34)],
            CdtrAcctSchmeNmCd: ['', Validators.maxLength(4)],
            CdtrAcctSchmeNmPrtry: [''],
            CdtrAcctIssr: ['', Validators.maxLength(35)],
            CdtrAcctTpCd: [''],
            CdtrAcctTpPrtry: [''],
            CdtrAcctCcy: ['', Validators.maxLength(3)],
            CdtrAcctNm: ['', [Validators.maxLength(70), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]],
            CdtrAcctPrxyTpCd: [''],
            CdtrAcctPrxyTpPrtry: [''],
            CdtrAcctPrxyId: ['', Validators.maxLength(320)],

            // Instructions
            InstrForCdtrAgtCD: [null], // InstructionForCreditorAgent 4//value TELB/PHOB PhoneBeneficiary
            InstrForCdtrAgtInf: ['', Validators.maxLength(140)], // InstructionForCreditorAgent 140
            InstrForNxtAgt1: ['', Validators.maxLength(35)], // InstructionForNextAgent Max35
            InstrForNxtAgt2: ['', Validators.maxLength(35)], // InstructionForNextAgent Max35
            InstrForNxtAgt3: ['', Validators.maxLength(35)], // InstructionForNextAgent Max35
            InstrForNxtAgt4: ['', Validators.maxLength(35)], // InstructionForNextAgent Max35
            InstrForNxtAgt5: ['', Validators.maxLength(35)], // InstructionForNextAgent Max35
            InstrForNxtAgt6: ['', Validators.maxLength(35)], // InstructionForNextAgent Max35

            // Purpose and Remittance
            PurpCD: ['', Validators.maxLength(4)], // Purpose ExternalPurpose1Code max 4
            PurpPrtry: ['', Validators.maxLength(35)], // Purpose ExternalPurpose1Code max 35
            RmtInf: ['', [Validators.maxLength(140), Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s\!\#\$\%\&\*\=\^\_\`\{\|\}\~\"\;\<\>\@\[\\\]\s]+$/)]], // RemittanceInformation Max140 [0-9a-zA-Z/\-\?:\(\)\.,'\+ !#$%&\*=^_`\{\|\}~";<>@\[\\\]]+

            // Authorization and Audit
            auth1stBy: [''],
            makeDt: [''],
            auth1stDt: [''],
            auth2ndBy: [''],
            auth2ndDt: [''],
            lastAction: [''],
            branchId: [''],
            trnRefNo20: [''],
            relatedRef21: [''],

            // Related
            RltdBizMsgIdr: [''],
            RltdMsgDefIdr: [''],
            RltdBizSvc: [''],
            RltdCreDt: [''],
            RltdcpyDplct: [null],
            RltdPsblDplct: [null],
            RltdPriority: [null],

            // Ultimate Parties
            UltmtCdtrNm: [''],
            UltmtCdtrPstlAdr: [''],
            UltmtCdtrOrgId: [''],
            UltmtCdtrPrvtId: [''],
            UltmtCdtrCtryOfRes: [''],

            UltmtDbtrNm: [''],
            UltmtDbtrPstlAdr: [''],
            UltmtDbtrOrgId: [''],
            UltmtDbtrPrvtId: [''],
            UltmtDbtrCtryOfRes: [''],

            InitgPtyNm: [''],
            InitgPtyPstlAdr: [''],
            InitgPtyOrgId: [''],
            InitgPtyPrvtId: [''],
            InitgPtyCtryOfRes: [''],

            // Charges
            ChrgBr: [null, Validators.required], // ChargeBearer Mandatory values CRED/DEBT/SHAR/SLEV
            ChrgsInfAgntBic: [''],
            ChrgsInfAgntNm: [''],
            ChrgsInfAgntPstlAdr: [''],
            ChrgsInfAgntCtryOfRes: [''],
            ChrgsInfAgntAcctId: [''],
            ChrgsInfAgntAcctTp: [''],
            ChrgsInfAgntAcctCcy: [''],
            ChrgsInfAgntAcctNm: [''],
            ChrgsInfAgntAcctOwnr: [''],
            ChrgsInfAgntAcctIban: [''],
            ChrgsInfAgntAcctLei: [''],
            ChgCcy: [''],
            ChgAmt: ['', Validators.pattern(/^\d{1,14}(\.\d{1,5})?$/)]
        });

        FormGroupSignal.set(this.frmGroup);
    }

    resetForm(): void {
        this.frmGroup.reset();
        this.frmGroup.patchValue({
            CreDt: new Date(),
            CreDtTm: new Date(),
            BizSvc: 'swift.cbprplus.02'
        });
    }

    saveForm(): void {
        if (this.frmGroup.valid) {
            console.log('Form Data:', this.frmGroup.value);
            this.toastr.success('Form saved successfully!', 'SUCCESS');
        } else {
            this.toastr.error('Please fill all required fields!', 'ERROR');
        }
    }
}
