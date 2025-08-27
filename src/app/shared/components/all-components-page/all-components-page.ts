import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextBaseInput } from '../input-types/text-base-input/text-base-input';
import { IdBoxComponent } from '../input-types/id-box/id-box';
import { AmountInput } from '../input-types/amount-input/amount-input';
import { AmountToWordInput } from '../input-types/amount-to-word-input/amount-to-word-input';
import { SelectOptionField } from '../input-types/select-option-field/select-option-field';
import { DateInput } from '../input-types/date-input/date-input';
import { FileComponent } from '../input-types/file-input/file-input';
import { OfficeBoxComponent } from '../input-types/office-box/office-box';
import { DataGridComponent, TableRowDesigner } from '../data-grid';
import { ExpansionPanelHeader } from '../expansion-panel-header/expansion-panel-header';
import { ExpansionSubPanelHeader } from '../expansion-sub-panel-header/expansion-sub-panel-header';
import { Switch } from '../input-types/switch/switch';
import { TextArea } from '../input-types/text-area/text-area';
import { ToastrService } from 'ngx-toastr';
import { BicSelectionService } from '../../services/bic-selection.service';
import { DateFormat, DateInputComponent } from '../input-types/date-input.component/date-input.component';

@Component({
  selector: 'app-all-components-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TextBaseInput,
    IdBoxComponent,
    AmountInput,
    Switch,
    TextArea,
    AmountToWordInput,
    SelectOptionField,
    // DateInput,
    DateInputComponent,
    FileComponent,
    OfficeBoxComponent,
    DataGridComponent,
    ExpansionPanelHeader,
    ExpansionSubPanelHeader,
  ],
  templateUrl: './all-components-page.html',
  styleUrls: ['./all-components-page.scss'],
})
export class AllComponentsPage implements OnInit {
  frmGroup: FormGroup;
  toastr = inject(ToastrService);
  businessHeaderPanel: WritableSignal<boolean> = signal(true);
  // Sample data for dropdowns and grid
  dropdownOptions = [
    { key: 'option1', value: 'Option 1' },
    { key: 'option2', value: 'Option 2' },
    { key: 'option3', value: 'Option 3' },
  ];

  gridData = [
    { id: '1', name: 'Item 1', value: 'Value 1' },
    { id: '2', name: 'Item 2', value: 'Value 2' },
    { id: '3', name: 'Item 3', value: 'Value 3' },
  ];

    // File upload demo state
  showAnyFileUpload: boolean = true;
  pdfFiles: File[] = [];
  imageFiles: File[] = [];
  anyFiles: File[] = [];
  documentFiles: File[] = [];
  profilePicFile?: File;


  // Sample data for data grid demonstration
    sampleTransactions = signal([
      {
        id: 'TXN001',
        transactionType: 'PACS.008',
        amount: 50000.00,
        currency: 'USD',
        status: 'Pending',
        fromAccount: '1234567890',
        toAccount: '0987654321',
        date: '2024-01-15',
        priority: 'HIGH',
  
      },
      {
        id: 'TXN002',
        transactionType: 'PACS.008',
        amount: 25000.00,
        currency: 'EUR',
        status: 'Completed',
        fromAccount: '1111111111',
        toAccount: '2222222222',
        date: '2024-01-14',
        priority: 'NORM',
      },
      {
        id: 'TXN003',
        transactionType: 'PACS.008',
        amount: 100000.00,
        currency: 'GBP',
        status: 'Failed',
        fromAccount: '3333333333',
        toAccount: '4444444444',
        date: '2024-01-13',
        priority: 'HIGH',
      
      },
      {
        id: 'TXN004',
        transactionType: 'PACS.008',
        amount: 75000.00,
        currency: 'USD',
        status: 'Pending',
        fromAccount: '5555555555',
        toAccount: '6666666666',
        date: '2024-01-12',
        priority: 'NORM',
      
      },
      {
        id: 'TXN005',
        transactionType: 'PACS.008',
        amount: 30000.00,
        currency: 'JPY',
        status: 'Completed',
        fromAccount: '7777777777',
        toAccount: '8888888888',
        date: '2024-01-11',
        priority: 'HIGH',
       
      },
        {
        id: 'TXN006',
        transactionType: 'PACS.008',
        amount: 30000.00,
        currency: 'JPY',
        status: 'Completed',
        fromAccount: '7777777777',
        toAccount: '8888888888',
        date: '2024-01-11',
        priority: 'HIGH',
       
      }
    ]);
  
    // Custom column names for the data grid
    transactionColumnNames = signal({
      'id': 'Transaction ID',
      'transactionType': 'Type',
      'amount': 'Amount',
      'currency': 'Currency',
      'status': 'Status',
      'fromAccount': 'From Account',
      'toAccount': 'To Account',
      'date': 'Date',
      'priority': 'Priority',
      'priority2': 'Priority 2',
      'priority3': 'Priority 3'
    });
  
    // Row designers for conditional styling
    transactionRowDesigners = signal<TableRowDesigner[]>([
      // {
      //   condition: (item: any) => item.status === 'Failed',
      //   backgroundColor: '#fff5f5',
      //   textColor: '#c53030',
      //   borderColor: '#fed7d7'
      // },
      // {
      //   condition: (item: any) => item.status === 'Completed',
      //   backgroundColor: '#f0fff4',
      //   textColor: '#22543d',
      //   borderColor: '#c6f6d5'
      // },
      // {
      //   condition: (item: any) => item.priority === 'HIGH',
      //   backgroundColor: '#fef5e7',
      //   textColor: '#c05621',
      //   borderColor: '#faf089'
      // }
  
      {
      condition: (item:any) => true,
      backgroundColor: '#f9fafb',
      textColor: '#111827',
      borderColor: '#e5e7eb'
    },
    {
      condition: (item:any) => true,
      backgroundColor: '#c7bbbbff',
      textColor: '#111827',
      borderColor: '#d1d5db'
    }
    ]);
  

  constructor(
    private formBuilder: FormBuilder,
   private bicSelectionService: BicSelectionService
  ) {}

  bicTableHeaders = new Map<string, string>([
    ['swift', 'SWIFT Code'],
    ['branchName', 'Branch Name'],
    ['address', 'Address']
  ]);
  openFromBicSelectionModal(): void {
    this.bicSelectionService.openBicSelectionModal(
      this.frmGroup,
      {
        bicField: 'fromBicfi',
        nameField: 'fromNm',
        defaultValue: 'SCBLBDDX'
      },
      this.bicTableHeaders
    ).subscribe();
  }

  ngOnInit(): void {
    this.frmGroup = this.formBuilder.group({
      textBox: ['', Validators.required],
      textArea: ['', Validators.required],
      switch: [false],
      id: ['', Validators.required],
      amount: ['', [Validators.required, Validators.max(200),Validators.min(2)]],
      amountToWord: ['', Validators.required],
      dropdown: ['', Validators.required],
      date: ['', Validators.required],
      number: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      officeCode: ['', Validators.required],
      fileUpload: [null],
    });
  }

  handleFileChange(files: File[]): void {
    console.log('Selected files:', files);
  }

  handleGridAction(action: string, rowData: any): void {
    console.log(`Grid action: ${action}`, rowData);
  }


  
  // File input handlers used by the template examples
onPdfSelected(files: File[]): void {
  this.pdfFiles = files || [];
  this.toastr.info(`${this.pdfFiles.length} PDF file(s) selected`, 'Files');
  
  // Now you can access the files via this.pdfFiles
  console.log('Current PDF files:', this.pdfFiles);
  
 
}

  onImagesSelected(files: File[]): void {
    this.imageFiles = files || [];
    this.toastr.info(`${this.imageFiles.length} image file(s) selected`, 'Files');
  }

  onAnyFilesSelected(files: File[]): void {
    this.anyFiles = files || [];
    this.toastr.info(`${this.anyFiles.length} file(s) selected`, 'Files');
  }

  onDocumentsSelected(files: File[]): void {
    this.documentFiles = files || [];
    this.toastr.info(`${this.documentFiles.length} document(s) selected`, 'Files');
  }

  onProfilePicSelected(files: File[]): void {
    this.profilePicFile = files && files.length > 0 ? files[0] : undefined;
    this.toastr.success(this.profilePicFile ? `Selected: ${this.profilePicFile.name}` : 'No file selected', 'Profile Picture');
  }

  onFileInputChanged(context: string): void {
    // Context string helps distinguish which input fired, e.g., 'PDF', 'Images'
    this.toastr.show(`File input changed: ${context}`, 'Notice');
  }


   // Data Grid Event Handlers
  onTransactionEdit(serializedData: string): void {
    console.log('edit');
    const transaction = JSON.parse(serializedData);
    console.log('Edit transaction:', transaction);
    this.toastr.info(`Editing transaction: ${transaction.id}`, 'Edit Mode');
    // Add your edit logic here - open modal, navigate to edit page, etc.
  }

  onTransactionDelete(serializedData: string): void {
    const transaction = JSON.parse(serializedData);
    console.log('Delete transaction:', transaction);
    this.toastr.warning(`Deleting transaction: ${transaction.id}`, 'Delete Confirmation');
    // Add your delete logic here - show confirmation dialog, call delete API, etc.
  }

  onTransactionView(serializedData: string): void {
    const transaction = JSON.parse(serializedData);
    console.log('View transaction:', transaction);
    this.toastr.info(`Viewing transaction: ${transaction.id}`, 'View Mode');
    // Add your view logic here - open modal, navigate to view page, etc.
  }

  onTransactionPrint(serializedData: string): void {
    const transaction = JSON.parse(serializedData);
    console.log('Print transaction:', transaction);
    this.toastr.success(`Printing transaction: ${transaction.id}`, 'Print');
    // Add your print logic here - generate PDF, open print dialog, etc.
  }

  onTransactionRowSelect(serializedData: string): void {
    const transaction = JSON.parse(serializedData);
    console.log('Row selected:', transaction);
    // Add your row selection logic here
  }

  onTransactionSelectAll(checked: boolean): void {
    console.log('Select all transactions:', checked);
    // Add your select all logic here
  }

  onTransactionDataChanged(newData: any[]): void {
    console.log('Transaction data changed:', newData);
    this.sampleTransactions.set(newData);
    this.toastr.success('Transaction data updated successfully', 'Data Updated');
    // Add your data change logic here - save to backend, update local state, etc.
  }
}