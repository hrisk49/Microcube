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
import {PanelHeader} from '../../../../shared/components/panel-header/panel-header';
import {SubPanelHeader} from '../../../../shared/components/sub-panel-header/sub-panel-header';
import {AmountToWordInput} from '../../../../shared/components/input-types/amount-to-word-input/amount-to-word-input';
import { SelectOptionsModel } from '../../../../shared/models/select-options-model';
import {BusinessApplicationHeader} from '../../components/business-application-header/business-application-header';
import {ExpansionPanelHeader} from '../../../../shared/components/expansion-panel-header/expansion-panel-header';
import {
  ExpansionSubPanelHeader
} from '../../../../shared/components/expansion-sub-panel-header/expansion-sub-panel-header';
import {Mx009Model} from '../../model/mx009.model';
import {Mx053Model} from '../../model/mx053.model';
import {Pacs053Service} from '../../service/pacs053.service';
import {PostalAddressModel} from '../../model/postal-address.model';

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
    BusinessApplicationHeader,
    ExpansionPanelHeader,
    ExpansionSubPanelHeader,
  ],
    templateUrl: './pacs-053.html',
    standalone: true,
    styleUrl: './pacs-053.scss'
})
export class Pacs053 implements OnInit {
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  frmGroup: FormGroup;
  pacs053Service = inject(Pacs053Service);

  onClickReset = ONCLICK_RESET;
  onClickSave = ONCLICK_SAVE;

  businessAppHeader: WritableSignal<boolean> = signal(true);
  rltdPanelOpen: WritableSignal<boolean> = signal(true);
  bankToCustomerStatement : WritableSignal<boolean> = signal(true);
  grpHeadr : WritableSignal<boolean> = signal(true);
  messageRecipient : WritableSignal<boolean> = signal(true);
  postalAddrs : WritableSignal<boolean> = signal(true);
  identification : WritableSignal<boolean> = signal(true);
  orgIden : WritableSignal<boolean> = signal(true);
  orgIdenOthr : WritableSignal<boolean> = signal(true);
  privateIden : WritableSignal<boolean> = signal(true);
  dateNPlaceOfBirth : WritableSignal<boolean> = signal(true);
  privateIdenOthr : WritableSignal<boolean> = signal(true);
  contactDetails : WritableSignal<boolean> = signal(true);
  orgnlBizQry : WritableSignal<boolean> = signal(true);
  statement : WritableSignal<boolean> = signal(true);
  account : WritableSignal<boolean> = signal(true);
  rltdAcct : WritableSignal<boolean> = signal(true);
  intrst : WritableSignal<boolean> = signal(true);
  balance : WritableSignal<boolean> = signal(true);
  txsSummry : WritableSignal<boolean> = signal(true);
  ntry : WritableSignal<boolean> = signal(true);
  addtlStmtInf : WritableSignal<boolean> = signal(true);


    TypeOptions: SelectOptionsModel[] =[
      {key: 'Cd', value: 'Code'},
      {key: 'Prtry', value: 'Proprietary'}
    ];

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

          // Business Application Header
          charSet: [''],
          fromBicfi:['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
          fromMembId: [''],
          fromClrSysIdCd: [''],
          fromLei: [''],
          toMembId: [''],
          toBicfi: ['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
          toClrSysIdCd: [''],
          toLei: [''],
          bizMsgIdr: ['',[Validators.required, Validators.minLength(1),Validators.maxLength(35)]],
          msgDefIdr: ['',[Validators.required, Validators.minLength(1),Validators.maxLength(35)]],
          bizSvc: ['',[Validators.required, Validators.minLength(6),Validators.maxLength(35),Validators.pattern(/^[a-z0-9]{1,10}(\.[a-z0-9]{1,10})+\.\d\d$/)]],
          creDt: ['', [Validators.required,Validators.pattern(/^(\+|-)((0[0-9])|(1[0-3])):[0-5][0-9]$/)]],

          cpyDplct: [null],
          psblDplct: [null],
          prty: ['high'],

          // Business Application Header -> related
          rltdFrBic: ['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
          rltdToBic: ['',Validators.required,Validators.pattern(/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/)],
          rltdBizMsgIdr: ['',[Validators.required, Validators.minLength(1),Validators.maxLength(35)]],
          rltdMsgDefIdr: [''],
          rltdBizSvc: ['',[Validators.required, Validators.minLength(6),Validators.maxLength(35),Validators.pattern(/^[a-z0-9]{1,10}(\.[a-z0-9]{1,10})+\.\d\d$/)]],
          rltdCpyDplct: ['codu'],
          rltdPrty: ['high'],


          // Bank To Customer Statement V08

          // Group Header starts
            msgId: ['', [Validators.required, Validators.pattern(/^[0-9a-zA-Z\/\-\?\:\(\)\.\,\'\+\s]+$/)]], // MessageIdentification //0-9 a-z A-Z / - ? : ( ) . , ' +
            creDtTm: ['', [Validators.required,Validators.pattern(/^(\+|-)((0[0-9])|(1[0-3])):[0-5][0-9]$/)]],

            //Message Recipient starts
            name: [''],

            //postal address
            orgtrNm: ['', [Validators.minLength(1), Validators.maxLength(140)]],
            addrTp: ['', Validators.required],
            dept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
            subDept: ['', [Validators.minLength(1), Validators.maxLength(70)]],
            strtNm: ['', [Validators.minLength(1), Validators.maxLength(70)]],
            bldgNb: ['', [Validators.maxLength(16)]],
            bldgNm: ['', [Validators.maxLength(35)]],
            flr: ['', Validators.maxLength(70)],
            pstBx: ['', [Validators.maxLength(16)]],
            room: ['', [Validators.maxLength(70)]],
            pstCd: ['', [Validators.maxLength(16)]],
            twnNm: ['', [Validators.maxLength(35)]],
            twnLctnNm: ['', [Validators.maxLength(35)]],
            dstrctNm: ['', [Validators.maxLength(35)]],
            ctrySubDvsn: ['', [Validators.maxLength(35)]],
            ctry: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
            adrLine: ['', [Validators.maxLength(70)]],
            ctryOfRes: ['', [Validators.pattern(/^[A-Z]{2}$/)]],
            Tp: ['Cd'],

          //Identification starts

          //Organisation Identification starts
            anyBIC: [''],
            LEI: [''],
            //Other
            orgIdOthrId: ['', Validators.required],
            orgIdOthrScmNm: [''],
            orgIdOthrIssr: [''],
          //Organisation Identification ends


          //PrivateIdentification starts

            //DateAndPlaceOfBirth
            birthDt: [''],
            prvcOfBirth: [''],
            cityOfBirth: [''],
            ctryOfBirth: [''],
            //Other
            privateIdOthrId: ['', Validators.required],
            privateIdOthrScmNm: [''],
            privateIdOthrIssr: [''],

          //PrivateIdentification ends

          //Identification ends

          //ContactDetails
            nm: [''],

          //Message Recipient ends

          //OriginalBusinessQuery starts

          orgnlBizQryMsgId: ['', Validators.required],
          orgnlBizQryMsgNmId: [''],
          orgnlBizQryCreDtTm: [''],

          //OriginalBusinessQuery ends
          addtlInf: [''],

          // Statement Array
          statements: this.formBuilder.array([
              this.createStatementGroup()
          ])
        });

        //FormGroupSignal.set(this.frmGroup);
    }


createStatementGroup(): FormGroup {
    return this.formBuilder.group({
        // Statement Identification
        statementIdentification: ['', Validators.required],

        // Statement Pagination
        statementPagination: ['', Validators.required],

        // Electronic Sequence Number
        electronicSequenceNumber: [''],

        // Reporting Sequence
        reportingSequence: [''],

        // Legal Sequence Number
        legalSequenceNumber: [''],

        // Creation Date Time
        statementCreationDateTime: [''],

        // From To Date
        fromDate: ['', Validators.required],
        toDate: ['', Validators.required],

        // Copy Duplicate Indicator
        copyDuplicateIndicator: [''],

        // Reporting Source
        reportingSource: [''],

        // Account
        accountId: ['', Validators.required],
        accountType: ['cacc', Validators.required],
        accountCurrency: ['', Validators.required],
        accountName: [''],
        accountPrxy: [''],
        accountOwner: [''],
        accountSvcr: [''],

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
    const array = this.statements.at(statementIndex)?.get('interests');
    if (array instanceof FormArray) {
      return array as FormArray<FormGroup>;
    }
    return this.formBuilder.array([]) as unknown as FormArray<FormGroup>; // fallback
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
        console.log('interestArray', interestArray);
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

  generatePayload(): Mx053Model {
    let payload: any = {};
    let frmValue = this.frmGroup.value;

    // Business Message Header
    payload.fromBicfi = frmValue.fromBicfi;
    payload.toBicfi = frmValue.toBicfi;
    payload.bizMsgIdr = frmValue.bizMsgIdr;
    payload.msgDefIdr = frmValue.msgDefIdr;
    payload.bizSvc = frmValue.bizSvc;
    payload.cpyDplct = frmValue.cpyDplct;
    payload.psblDplct = frmValue.psblDplct;
    payload.priority = frmValue.prty;
    payload.creDt = frmValue.CreDt;

    payload.rltd = {
      charSet: frmValue.rltdCharSet,
      fr: {
        FIId: frmValue.rltdFrBicfi,
        clrSysIdCd: frmValue.rltdFrClrSysIdCd,
        mmbId: frmValue.rltdFrMmbId,
        lei: frmValue.rltdFrLei,
        nm: frmValue.rltdFrNm,
        adrLine1: frmValue.rltdFrAdrLine1,
        adrLine2: frmValue.rltdFrAdrLine2,
        adrLine3: frmValue.rltdFrAdrLine3,
        adr: {
          dept: frmValue.rltdFrAdrDept,
          subDept: frmValue.rltdFrAdrSubDept,
          strtNm: frmValue.rltdFrAdrStrtNm,
          bldgNb: frmValue.rltdFrAdrBldgNb,
          bldgNm: frmValue.rltdFrAdrBldgNm,
          flr: frmValue.rltdFrAdrFlr,
          pstBx: frmValue.rltdFrAdrPstBx,
          room: frmValue.rltdFrAdrRoom,
          pstCd: frmValue.rltdFrAdrPstCd,
          twnNm: frmValue.rltdFrAdrTwnNm,
          twnLctnNm: frmValue.rltdFrAdrTwnLctnNm,
          dstrctNm: frmValue.rltdFrAdrDstrctNm,
          ctrySubDvsn: frmValue.rltdFrAdrCtrySubDvsn,
          ctry: frmValue.rltdFrAdrCtry,
          adrLine: (frmValue.rltdFrAdrLine || []).filter(
            (line: string) => line && line.trim() !== ''
          ),
        },
      },
      to: {
        bIcfi: frmValue.rltdToBicfi,
        clrSysIdCd: frmValue.rltdToClrSysIdCd,
        mmbId: frmValue.rltdToMmbId,
        lei: frmValue.rltdToLei,
        nm: frmValue.rltdToNm,
        adrLine1: frmValue.rltdToAdrLine1,
        adrLine2: frmValue.rltdToAdrLine2,
        adrLine3: frmValue.rltdToAdrLine3,
        adr: {
          dept: frmValue.rltdToAdrDept,
          subDept: frmValue.rltdToAdrSubDept,
          strtNm: frmValue.rltdToAdrStrtNm,
          bldgNb: frmValue.rltdToAdrBldgNb,
          bldgNm: frmValue.rltdToAdrBldgNm,
          flr: frmValue.rltdToAdrFlr,
          pstBx: frmValue.rltdToAdrPstBx,
          room: frmValue.rltdToAdrRoom,
          pstCd: frmValue.rltdToAdrPstCd,
          twnNm: frmValue.rltdToAdrTwnNm,
          twnLctnNm: frmValue.rltdToAdrTwnLctnNm,
          dstrctNm: frmValue.rltdToAdrDstrctNm,
          ctrySubDvsn: frmValue.rltdToAdrCtrySubDvsn,
          ctry: frmValue.rltdToAdrCtry,
          adrLine: (frmValue.rltdToAdrLine || []).filter(
            (line: string) => line && line.trim() !== ''
          ),
        },
      },
      bizMsgIdr: frmValue.rltdBizMsgIdr,
      msgDefIdr: frmValue.rltdMsgDefIdr,
      bizSvc: frmValue.rltdBizSvc,
      creDt: frmValue.rltdCreDt,
      cpyDplct: frmValue.rltdCpyDplct,
      prty:
        frmValue.rltdPrty === 'HIGH' || frmValue.rltdPrty === 'NORM'
          ? frmValue.rltdPrty
          : 'NORM',
    };

    //GroupHeader
    payload.msgId = frmValue.msgId;
    payload.creDtTm = frmValue.creDtTm;
    payload.msgRcpt = {
      nm: frmValue.name,
      pstlAdr: {
        adrTp:frmValue.addrTp,
        dept: frmValue.dept,
        subDept: frmValue.subDept,
        strtNm: frmValue.strtNm,
        bldgNb: frmValue.bldgNb,
        bldgNm: frmValue.bldgNm,
        flr: frmValue.flr,
        pstBx: frmValue.pstBx,
        room: frmValue.room,
        pstCd: frmValue.pstCd,
        twnNm: frmValue.twnNm,
        twnLctnNm: frmValue.twnLctnNm,
        dstrctNm: frmValue.dstrctNm,
        ctrySubDvsn: frmValue.ctrySubDvsn,
        ctry: frmValue.ctry,
        adrLine: frmValue.adrLine,
      },
      id: {
        orgId:{
          anyBIC: frmValue.anyBIC,
          LEI: frmValue.LEI,
          othr:{
            ctry: frmValue.orgIdOthrId,
          }
        },
        prvtId:{},
      },
    };

    return payload as Mx053Model;
  }

    save(): void {
      console.log('Form Data:', this.frmGroup.value);
      this.toastr.success('Bank to Customer Statement saved successfully!', 'SUCCESS');

      /*if (this.frmGroup.valid) {
        console.log('Form Data:', this.frmGroup.value);
        this.toastr.success('Bank to Customer Statement saved successfully!', 'SUCCESS');
        // Add service call here when service is available
      } else {
        this.toastr.error('Please fill all required fields!', 'ERROR');
      }*/

      const payload = this.generatePayload();
      console.log('Generated Payload:', payload);

      this.pacs053Service.save(payload).subscribe({
        next: (res) => {
          console.log('Success response:', res);
          this.toastr.success('PACS.009 message saved successfully!', 'Success');
          // Optionally reset form after successful save
          // this.resetForm();
        },
        error: (error) => {
          console.error('Error saving PACS.009:', error);
          let errorMessage = 'Failed to save PACS.009 message';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          this.toastr.error(errorMessage, 'Error');
        },
      });
    }
}
