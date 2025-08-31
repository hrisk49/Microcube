import { Component, inject, OnInit, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
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
import { NumberInput } from '../input-types/number-input/number-input';
import { DropdownOption } from '../data-grid/data-grid';
import { LdsStepperComponent, Step } from '../lds-stepper/lds-stepper';
import { MultiSelectOptionField } from '../multi-select-option-field/multi-select-option-field';

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
    MultiSelectOptionField,
    LdsStepperComponent,
    DateInputComponent,
    FileComponent,
    OfficeBoxComponent,
    NumberInput,
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


  @ViewChild('step1Template', { static: true }) step1Template!: TemplateRef<any>;
  @ViewChild('step2Template', { static: true }) step2Template!: TemplateRef<any>;
  @ViewChild('step3Template', { static: true }) step3Template!: TemplateRef<any>;

  // Sample data for dropdowns and grid
  dropdownOptions = [
    { key: 'option1', value: 'Option 1' },
    { key: 'option2', value: 'Option 2' },
    { key: 'option3', value: 'Option 3' },
    { key: 'option4', value: 'Option 4' },
    { key: 'option5', value: 'Option 5' },
    { key: 'option6', value: 'Option 6' },
    { key: 'option7', value: 'Option 7' },
    { key: 'option8', value: 'Option 8' },
    { key: 'option9', value: 'Option 9' },
    { key: 'option10', value: 'Option 10' },
    { key: 'option11', value: 'Option 11' },
    { key: 'option12', value: 'Option 12' },
    { key: 'option13', value: 'Option 13' },
    { key: 'option14', value: 'Option 14' },
    { key: 'option15', value: 'Option 15' },
    { key: 'option16', value: 'Option 16' },
    { key: 'option17', value: 'Option 17' },
    { key: 'option18', value: 'Option 18' },
    { key: 'option19', value: 'Option 19' },
    { key: 'option20', value: 'Option 20' },
    { key: 'option21', value: 'Option 21' },
    { key: 'option22', value: 'Option 22' },
    { key: 'option23', value: 'Option 23' },
    { key: 'option24', value: 'Option 24' },
    { key: 'option25', value: 'Option 25' },
    { key: 'option26', value: 'Option 26' },
    { key: 'option27', value: 'Option 27' },
    { key: 'option28', value: 'Option 28' },
    { key: 'option29', value: 'Option 29' },
    { key: 'option30', value: 'Option 30' },
    { key: 'option31', value: 'Option 31' },
    { key: 'option32', value: 'Option 32' },
    { key: 'option33', value: 'Option 33' },
    { key: 'option34', value: 'Option 34' },
    { key: 'option35', value: 'Option 35' },
    { key: 'option36', value: 'Option 36' },
    { key: 'option37', value: 'Option 37' },
    { key: 'option38', value: 'Option 38' },
    { key: 'option39', value: 'Option 39' },
    { key: 'option40', value: 'Option 40' },
    { key: 'option41', value: 'Option 41' },
    { key: 'option42', value: 'Option 42' },
    { key: 'option43', value: 'Option 43' },
    { key: 'option44', value: 'Option 44' },
    { key: 'option45', value: 'Option 45' },
    { key: 'option46', value: 'Option 46' },
    { key: 'option47', value: 'Option 47' },
    { key: 'option48', value: 'Option 48' },
    { key: 'option49', value: 'Option 49' },
    { key: 'option50', value: 'Option 50' },
    { key: 'option51', value: 'Option 51' },
    { key: 'option52', value: 'Option 52' },
    { key: 'option53', value: 'Option 53' },
    { key: 'option54', value: 'Option 54' },
    { key: 'option55', value: 'Option 55' },
    { key: 'option56', value: 'Option 56' },
    { key: 'option', value: 'Option 3' },
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
  steps: Step[] = [];

  // Sample data for data grid demonstration
sampleTransactions = signal([
    {
      id: 'TXN001',
      transactionType: 'PACS.008',
      amount: 50000.00,
      currency: 'USD',
      status: 'pending',
      fromAccount: '1234567890',
      toAccount: '0987654321',
      date: '2024-01-15',
      priority: 'high',
      department: 'sales',
      category: 'international',
      // Dynamic dropdown source for roles
      availableRoles: [
        { value: 'admin', label: 'Administrator' },
        { value: 'approver', label: 'Transaction Approver' },
        { value: 'viewer', label: 'View Only' }
      ],
      assignedRole: 'approver'
    },
    {
      id: 'TXN002',
      transactionType: 'PACS.008',
      amount: 25000.00,
      currency: 'EUR',
      status: 'completed',
      fromAccount: '1111111111',
      toAccount: '2222222222',
      date: '2024-01-14',
      priority: 'normal',
      department: 'finance',
      category: 'domestic',
      availableRoles: [
        { value: 'admin', label: 'Administrator' },
        { value: 'viewer', label: 'View Only' }
      ],
      assignedRole: 'viewer'
    },
    {
      id: 'TXN003',
      transactionType: 'PACS.008',
      amount: 100000.00,
      currency: 'GBP',
      status: 'failed',
      fromAccount: '3333333333',
      toAccount: '4444444444',
      date: '2024-01-13',
      priority: 'high',
      department: 'operations',
      category: 'urgent',
      availableRoles: [
        { value: 'admin', label: 'Administrator' },
        { value: 'approver', label: 'Transaction Approver' },
        { value: 'specialist', label: 'Operations Specialist' }
      ],
      assignedRole: 'specialist'
    },
    {
      id: 'TXN004',
      transactionType: 'PACS.008',
      amount: 75000.00,
      currency: 'USD',
      status: 'pending',
      fromAccount: '5555555555',
      toAccount: '6666666666',
      date: '2024-01-12',
      priority: 'normal',
      department: 'sales',
      category: 'corporate',
      availableRoles: [
        { value: 'admin', label: 'Administrator' },
        { value: 'approver', label: 'Transaction Approver' }
      ],
      assignedRole: 'approver'
    },
    {
      id: 'TXN005',
      transactionType: 'PACS.008',
      amount: 30000.00,
      currency: 'JPY',
      status: 'completed',
      fromAccount: '7777777777',
      toAccount: '8888888888',
      date: '2024-01-11',
      priority: 'high',
      department: 'treasury',
      category: 'fx_trade',
      availableRoles: [
        { value: 'admin', label: 'Administrator' },
        { value: 'trader', label: 'FX Trader' },
        { value: 'risk_officer', label: 'Risk Officer' }
      ],
      assignedRole: 'trader'
    },
    {
      id: 'TXN006',
      transactionType: 'PACS.008',
      amount: 30000.00,
      currency: 'JPY',
      status: 'completed',
      fromAccount: '7777777777',
      toAccount: '8888888888',
      date: '2024-01-11',
      priority: 'high',
      department: 'treasury',
      category: 'fx_trade',
      availableRoles: [
        { value: 'admin', label: 'Administrator' },
        { value: 'viewer', label: 'View Only' }
      ],
      assignedRole: 'admin'
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
    'department': 'Department',
    'category': 'Category',
    'assignedRole': 'Assigned Role'
  });


  transactionDropdownOptions = signal<Record<string, DropdownOption[]>>({
    status: [
      { value: 'pending', label: 'Pending Review' },
      { value: 'completed', label: 'Completed' },
      { value: 'failed', label: 'Failed' },
      { value: 'cancelled', label: 'Cancelled' },
      { value: 'in_progress', label: 'In Progress' }
    ],
    priority: [
      { value: 'low', label: 'Low Priority' },
      { value: 'normal', label: 'Normal Priority' },
      { value: 'high', label: 'High Priority' },
      { value: 'urgent', label: 'Urgent' }
    ],
    department: [
      { value: 'sales', label: 'Sales Department' },
      { value: 'finance', label: 'Finance Department' },
      { value: 'operations', label: 'Operations' },
      { value: 'treasury', label: 'Treasury' },
      { value: 'compliance', label: 'Compliance' },
      { value: 'risk', label: 'Risk Management' }
    ],
    category: [
      { value: 'domestic', label: 'Domestic Transfer' },
      { value: 'international', label: 'International Transfer' },
      { value: 'corporate', label: 'Corporate Payment' },
      { value: 'retail', label: 'Retail Payment' },
      { value: 'fx_trade', label: 'FX Trade Settlement' },
      { value: 'urgent', label: 'Urgent Payment' }
    ]
  });

  //which column should have dropdown
    transactionDropdownColumns = signal(['status', 'priority', 'department', 'category', 'assignedRole']);
      
  
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
  

    //   Define dynamic dropdown sources (options from row data)
  transactionDynamicDropdownSources = signal<Record<string, string>>({
    assignedRole: 'availableRoles' 
  });


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
      {
        bicField: 'instgAgtBicfi',
        nameField: 'instgAgtNm'
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
      categories: [[], Validators.required],
      date: ['', Validators.required],
      number: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      officeCode: ['', Validators.required],
      fileUpload: [null],
    });
  }


  ngAfterViewInit(): void {
    // Initialize steps after view templates are available
    setTimeout(() => {
      this.steps = [
        {
          title: 'Personal Information',
          subtitle: 'Enter your basic details',
          form: 'personalInfoForm',
          formContent: this.step1Template
        },
        {
          title: 'Contact Details',
          subtitle: 'Add your contact information',
          form: 'contactForm',
          formContent: this.step2Template
        },
        {
          title: 'Review & Submit',
          subtitle: 'Review your information',
          form: 'reviewForm',
          formContent: this.step3Template
        }
      ];
    });
  }
  handleFileChange(files: File[]): void {
    console.log('Selected files:', files);
  }

  handleGridAction(action: string, rowData: any): void {
    console.log(`Grid action: ${action}`, rowData);
  }

    onStepperSubmit() {
    console.log('Stepper submitted!');
    // Handle final submission logic here
    // e.g., send data to API, show success message, etc.
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