import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { SwiftMessage } from '../prime-table-out/prime-table-out';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ELEMENT_DATA } from '../prime-table-out/prime-table-out';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Button } from '../input-types/button/button';
import { TextBaseInput } from '../input-types/text-base-input/text-base-input';
import { SelectOptionField } from '../input-types/select-option-field/select-option-field';
import { DateInput } from '../input-types/date-input/date-input';
import { BranchInfoService } from '../../services/branch-info.service';

// CBS Data Interface
interface CBSData {
  messageRefNo: string;
  makerName: string;
  authorizerName: string;
  issueDate: string;
}

@Component({
  selector: 'app-swift-messaging-interface',
  standalone: true,
  imports: [CommonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatPaginatorModule,
    Button,
    TextBaseInput,
    SelectOptionField,
    DateInput,
    FormsModule,
    ReactiveFormsModule],
  templateUrl: './swift-messaging-interface.html',
  styleUrl: './swift-messaging-interface.scss'
})
export class SwiftMessagingInterface implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  // Form for the interface
  swiftForm: FormGroup;
  
  displayedColumns = ['position', 'msgRefNo', 'mtId', 'senderBic', 'makeBy', 'makeDt', 'actions'];
  
  // Original data source
  private originalDataSource: SwiftMessage[] = ELEMENT_DATA;
  dataSource: SwiftMessage[] = [...this.originalDataSource];
  
  // CBS Data Source with MatTableDataSource
  cbsDataSource = new MatTableDataSource<CBSData>([
    {
      messageRefNo: '135122160008-111111111--220008',
      makerName: 'rafia1',
      authorizerName: 'rafia1',
      issueDate: '08/09/2022'
    },
    {
      messageRefNo: '135122160009-111111111--220009',
      makerName: 'rafia1',
      authorizerName: 'rafia1',
      issueDate: '08/09/2022'
    },
    {
      messageRefNo: '135122210002-rrfff',
      makerName: 'shawon',
      authorizerName: 'shawon',
      issueDate: '08/09/2022'
    },
    {
      messageRefNo: '135122210003-test123',
      makerName: 'rafia2',
      authorizerName: 'rafia2',
      issueDate: '08/09/2022'
    },
    {
      messageRefNo: '135122210004-sample456',
      makerName: 'rafia1',
      authorizerName: 'rafia1',
      issueDate: '08/09/2022'
    },
    {
      messageRefNo: '135122210005-sample789',
      makerName: 'rafia3',
      authorizerName: 'rafia3',
      issueDate: '08/09/2022'
    },
    {
      messageRefNo: '135122210006-sample101',
      makerName: 'rafia4',
      authorizerName: 'rafia4',
      issueDate: '08/09/2022'
    },
    {
      messageRefNo: '135122210007-sample202',
      makerName: 'rafia5',
      authorizerName: 'rafia5',
      issueDate: '08/09/2022'
    },
    {
      messageRefNo: '135122210008-sample303',
      makerName: 'rafia6',
      authorizerName: 'rafia6',
      issueDate: '08/09/2022'
    },
    {
      messageRefNo: '135122210009-sample404',
      makerName: 'rafia7',
      authorizerName: 'rafia7',
      issueDate: '08/09/2022'
    },
    {
      messageRefNo: '135122210010-sample505',
      makerName: 'rafia8',
      authorizerName: 'rafia8',
      issueDate: '08/09/2022'
    },
    {
      messageRefNo: '135122210011-sample606',
      makerName: 'rafia9',
      authorizerName: 'rafia9',
      issueDate: '08/09/2022'
    }
  ]);
  
  // Filter properties (kept for backward compatibility)
  startDate: Date | null = null;
  endDate: Date | null = null;
  fromDate: Date | null = null;
  toDate: Date | null = null;
  selectedMessageType: string = '';
  selectedStatus: string = '';
  selectedBranch: string = '';
  messageRefNo: string = '';
  
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  private searchTerm: string = '';
  
  // Message types for dropdown (MT types)
  messageTypes: any[] = [
    { key: 'pacs-008', value: 'pacs 008 - F1 to F1 Customer Credit Transfer' },
    { key: 'pacs-009', value: 'pacs 009 - Financial Institution Credit Transfer Return' },
    { key: 'pacs-002', value: 'pacs 002 - F1 to F1 Payment' },
    { key: 'pacs-010', value: 'pacs 010 - Payment Return' },
    { key: 'pacs-011', value: 'pacs 011 - Request for Investigation' },
    { key: 'pacs-012', value: 'pacs 012 - Request for Investigation Return' },
    { key: 'pacs-013', value: 'pacs 013 - Resolution of Investigation' },
    { key: 'pacs-014', value: 'pacs 014 - Additional Payment Information' },
    { key: 'pacs-015', value: 'pacs 015 - Account Switching Information Request' },
    { key: 'pacs-016', value: 'pacs 016 - Intra-Position Movement Instruction' },
    { key: 'pacs-017', value: 'pacs 017 - Intra-Position Movement Confirmation' },
    { key: 'pacs-018', value: 'pacs 018 - Intra-Position Movement Status Report' },
    { key: 'pacs-019', value: 'pacs 019 - Intra-Position Movement Cancellation Request' }
  ];

  // Status options for dropdown
  statusOptions: any[] = [
    { key: '', value: 'All Status' },
    { key: 'ACK', value: 'ACK' },
    { key: 'NACK', value: 'NACK' }
  ];

  // Branch options - will be populated from API
  branchOptions: any[] = [];
  isLoadingBranches: boolean = false;
  
  // Store full branch data for additional information
  private fullBranchData: any[] = [];

  constructor(
    private dialog: MatDialog, 
    private fb: FormBuilder,
    private branchInfoService: BranchInfoService
  ) {
    this.initializeForm();
    this.applyPagination();
  }

  ngOnInit() {
    this.loadBranchData();
  }

  private initializeForm() {
    this.swiftForm = this.fb.group({
      messageType: [null],
      fromDate: [null as string | null],
      toDate: [null as string | null],
      branch: [null],
      messageRefNo: ['']
    });
  }

  /**
   * Load branch data from the API using BranchInfoService
   */
  private loadBranchData() {
    this.isLoadingBranches = true;
    console.log('Loading branch data from API...');
    
    this.branchInfoService.getBranchList().subscribe({
      next: (response) => {
        this.isLoadingBranches = false;
        
        if (response && Array.isArray(response)) {
          // Transform the API response to match the expected format
          this.branchOptions = response.map((branch: any) => ({
            key: branch.branchId,
            value: `${branch.branchName} (${branch.swift})`
          }));
          this.fullBranchData = response; // Store full data
        } else if (response && response.data && Array.isArray(response.data)) {
          // Handle case where response is wrapped in a data property
          this.branchOptions = response.data.map((branch: any) => ({
            key: branch.branchId,
            value: `${branch.branchName} (${branch.swift})`
          }));
          this.fullBranchData = response.data; // Store full data
        } else if (response && response.result && Array.isArray(response.result)) {
          // Handle case where response is wrapped in a result property
          this.branchOptions = response.result.map((branch: any) => ({
            key: branch.branchId,
            value: `${branch.branchName} (${branch.swift})`
          }));
          this.fullBranchData = response.result; // Store full data
        } else if (response && response.payload && Array.isArray(response.payload)) {
          // Handle case where response is wrapped in a payload property
          this.branchOptions = response.payload.map((branch: any) => ({
            key: branch.branchId,
            value: `${branch.branchName} (${branch.swift})`
          }));
        } else {
          console.warn('Unexpected branch data format:', response);
          // Fallback to empty array
          this.branchOptions = [];
        }
        
        console.log(`Loaded ${this.branchOptions.length} branches`);
        
        // If no branches loaded, set fallback options
        if (this.branchOptions.length === 0) {
          this.setFallbackBranchOptions();
        }
      },
      error: (error) => {
        console.error('Error loading branch data:', error);
        this.isLoadingBranches = false;
        this.setFallbackBranchOptions();
      }
    });
  }

  /**
   * Set fallback branch options when API fails
   */
  private setFallbackBranchOptions() {
    console.log('Setting fallback branch options');
    this.branchOptions = [
      { key: '000035', value: 'HEAD OFFICE, SOUTHEAST BANK LIMITED (SEBDBDDH)' },
      { key: '086153', value: 'PRINCIPAL BRANCH, SOUTHEAST BANK LIMITED (SEBDBDDHSPB)' }
    ];
  }

  /**
   * Get additional branch information by branch ID
   */
  getBranchInfo(branchId: string): any {
    // This method can be used to get additional branch details
    // You can extend this to fetch from a cache or make additional API calls
    return this.branchOptions.find(branch => branch.key === branchId);
  }

  /**
   * Get branch name by branch ID
   */
  getBranchName(branchId: string): string {
    const branch = this.getBranchInfo(branchId);
    return branch ? branch.value : 'Unknown Branch';
  }

  /**
   * Get full branch details by branch ID
   */
  getFullBranchDetails(branchId: string): any {
    return this.fullBranchData.find((branch: any) => branch.branchId === branchId);
  }

  /**
   * Get branch address by branch ID
   */
  getBranchAddress(branchId: string): string {
    const branch = this.getFullBranchDetails(branchId);
    return branch ? branch.address : 'Address not available';
  }

  /**
   * Get branch SWIFT code by branch ID
   */
  getBranchSwiftCode(branchId: string): string {
    const branch = this.getFullBranchDetails(branchId);
    return branch ? branch.swift : 'SWIFT code not available';
  }

  /**
   * Get all branches that match a SWIFT code pattern
   */
  getBranchesBySwiftPattern(pattern: string): any[] {
    if (!pattern || pattern.trim() === '') {
      return this.fullBranchData;
    }
    
    const regex = new RegExp(pattern.trim(), 'i'); // Case-insensitive search
    return this.fullBranchData.filter((branch: any) => 
      branch.swift && regex.test(branch.swift)
    );
  }

  /**
   * Get all branches by country ID
   */
  getBranchesByCountry(countryId: string): any[] {
    if (!countryId) {
      return this.fullBranchData;
    }
    
    return this.fullBranchData.filter((branch: any) => 
      branch.countryId === countryId
    );
  }

  /**
   * Export branch data as CSV string
   */
  exportBranchesAsCSV(): string {
    if (this.fullBranchData.length === 0) {
      return 'No branch data available';
    }

    const headers = ['Branch ID', 'Branch Name', 'SWIFT Code', 'Address', 'Country ID', 'Branch Type', 'Open Date'];
    const csvRows = [headers.join(',')];

    this.fullBranchData.forEach((branch: any) => {
      const row = [
        branch.branchId || '',
        `"${(branch.branchName || '').replace(/"/g, '""')}"`, // Escape quotes in branch name
        branch.swift || '',
        `"${(branch.address || '').replace(/"/g, '""')}"`, // Escape quotes in address
        branch.countryId || '',
        branch.branchTypeId || '',
        branch.branchOpenDate || ''
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  /**
   * Get branch statistics
   */
  getBranchStatistics(): any {
    if (this.fullBranchData.length === 0) {
      return {
        totalBranches: 0,
        countries: 0,
        branchTypes: 0
      };
    }

    const countries = new Set(this.fullBranchData.map((b: any) => b.countryId));
    const branchTypes = new Set(this.fullBranchData.map((b: any) => b.branchTypeId));

    return {
      totalBranches: this.fullBranchData.length,
      countries: countries.size,
      branchTypes: branchTypes.size
    };
  }

  /**
   * Export branch data as CSV and trigger download
   */
  exportBranchData() {
    const csvData = this.exportBranchesAsCSV();
    if (csvData === 'No branch data available') {
      console.warn('No branch data to export');
      return;
    }

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `branch_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Branch data exported successfully');
  }

  /**
   * Show branch statistics in console and alert
   */
  showBranchStatistics() {
    const stats = this.getBranchStatistics();
    console.log('Branch Statistics:', stats);
    
    const message = `Branch Statistics:
    Total Branches: ${stats.totalBranches}
    Countries: ${stats.countries}
    Branch Types: ${stats.branchTypes}`;
    
    alert(message);
  }

  /**
   * Check if branches are loaded
   */
  get hasBranches(): boolean {
    return this.branchOptions.length > 0;
  }

  /**
   * Get the number of loaded branches
   */
  get branchCount(): number {
    return this.branchOptions.length;
  }

  /**
   * Refresh branch data from the API
   */
  refreshBranchData() {
    this.loadBranchData();
  }

  /**
   * Handle branch selection change
   */
  onBranchChange(event: any) {
    console.log('Branch selected:', event);
    this.selectedBranch = event;
    // You can add additional logic here if needed when branch changes
  }

  /**
   * Search for branches by SWIFT code prefix
   */
  searchBranchesBySwiftCode(swiftCode: string) {
    if (!swiftCode || swiftCode.trim() === '') {
      console.log('Empty SWIFT code, loading all branches');
      this.loadBranchData();
      return;
    }

    console.log(`Searching branches by SWIFT code prefix: ${swiftCode}`);
    this.isLoadingBranches = true;

    this.branchInfoService.getBySwiftCodePrefix(swiftCode.trim()).subscribe({
      next: (response) => {
        console.log('Branch search results:', response);
        this.isLoadingBranches = false;
        
        if (response && Array.isArray(response)) {
          this.branchOptions = response.map((branch: any) => ({
            key: branch.branchId,
            value: `${branch.branchName} (${branch.swift})`
          }));
          this.fullBranchData = response; // Store full data
        } else if (response && response.data && Array.isArray(response.data)) {
          this.branchOptions = response.data.map((branch: any) => ({
            key: branch.branchId,
            value: `${branch.branchName} (${branch.swift})`
          }));
          this.fullBranchData = response.data; // Store full data
        } else if (response && response.result && Array.isArray(response.result)) {
          this.branchOptions = response.result.map((branch: any) => ({
            key: branch.branchId,
            value: `${branch.branchName} (${branch.swift})`
          }));
          this.fullBranchData = response.result; // Store full data
        } else if (response && response.payload && Array.isArray(response.payload)) {
          // Handle case where response is wrapped in a payload property
          this.branchOptions = response.payload.map((branch: any) => ({
            key: branch.branchId,
            value: `${branch.branchName} (${branch.swift})`
          }));
          this.fullBranchData = response.payload; // Store full data
        } else {
          console.warn('No branches found for SWIFT code prefix:', swiftCode);
          this.branchOptions = [];
        }
        
        console.log(`Found ${this.branchOptions.length} branches for SWIFT code prefix: ${swiftCode}`);
        
        if (this.branchOptions.length === 0) {
          this.setFallbackBranchOptions();
        }
      },
      error: (error) => {
        console.error('Error searching branches by SWIFT code:', error);
        this.isLoadingBranches = false;
        this.setFallbackBranchOptions();
      }
    });
  }

  /**
   * Clear SWIFT code search and load all branches
   */
  clearSwiftCodeSearch(swiftCodeInput: HTMLInputElement) {
    swiftCodeInput.value = '';
    this.loadBranchData();
  }

  ngAfterViewInit() {
    this.cbsDataSource.paginator = this.paginator;
  }

  // Track function for ngFor
  trackByFn(index: number, item: any): any {
    return item.messageRefNo || index;
  }

  // Search filter functionality
  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue.trim().toLowerCase();
    this.cbsDataSource.filter = filterValue.trim().toLowerCase();
    this.currentPage = 1; // Reset to first page when searching
  }

  // CBS specific methods
  findFromCBS() {
    console.log('Find from CBS clicked');
    const formValue = this.swiftForm.value;
    console.log('From Date:', formValue.fromDate);
    console.log('To Date:', formValue.toDate);
    console.log('Branch:', formValue.branch);
    console.log('Message Ref No:', formValue.messageRefNo);
    
    // Filter CBS data based on criteria
    this.filterCBSData();
  }

  findFromSwiftLink() {
    console.log('Find from SWIFTLINK clicked');
    const formValue = this.swiftForm.value;
    console.log('From Date:', formValue.fromDate);
    console.log('To Date:', formValue.toDate);
    console.log('Branch:', formValue.branch);
    console.log('Message Ref No:', formValue.messageRefNo);
    
    // Filter CBS data based on criteria
    this.filterCBSData();
  }

  filterCBSData() {
    // Implementation for filtering CBS data
    console.log('Filtering CBS data...');
    // TODO: Implement actual filtering logic
  }

  saveData(data: CBSData) {
    console.log('Saving data:', data);
    // TODO: Implement save functionality
  }

  viewDetails(data: CBSData) {
    console.log('Viewing details for:', data);
    // TODO: Implement view details functionality
  }

  // Main filter button action
  onFindClick() {
    console.log('Find button clicked');
    const formValue = this.swiftForm.value;
    console.log('Message Type:', formValue.messageType);
    
    this.currentPage = 1; // Reset to first page
    this.filterData();
  }

  // Filter data based on all criteria
  filterData() {
    const formValue = this.swiftForm.value;
    console.log('Filtering data with:', {
      messageType: formValue.messageType,
      fromDate: formValue.fromDate,
      toDate: formValue.toDate,
      branch: formValue.branch,
      messageRefNo: formValue.messageRefNo,
      searchTerm: this.searchTerm
    });
    
    this.filterAndPaginate();
  }

  // Clear all filters
  clearFilters() {
    this.swiftForm.reset();
    this.searchTerm = '';
    this.currentPage = 1;
    this.dataSource = [...this.originalDataSource];
    this.cbsDataSource.filter = '';
    this.applyPagination();
  }

  // Combined filter and pagination method
  private filterAndPaginate() {
    let filteredData = [...this.originalDataSource];

    // Filter by date range
    if (this.fromDate || this.toDate) {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.makeDt);
        
        if (this.fromDate && this.toDate) {
          return itemDate >= this.fromDate! && itemDate <= this.toDate!;
        } else if (this.fromDate) {
          return itemDate >= this.fromDate!;
        } else if (this.toDate) {
          return itemDate <= this.toDate!;
        }
        return true;
      });
    }

    // Filter by message type
    if (this.selectedMessageType) {
      filteredData = filteredData.filter(item => 
        item.mtId.toString() === this.selectedMessageType
      );
    }

    // Filter by status
    if (this.selectedStatus) {
      filteredData = filteredData.filter(item => 
        item.status === this.selectedStatus
      );
    }

    // Filter by search term
    if (this.searchTerm) {
      filteredData = filteredData.filter(item => 
        item.msgRefNo.toLowerCase().includes(this.searchTerm) ||
        item.senderBic.toLowerCase().includes(this.searchTerm) ||
        item.makeBy.toLowerCase().includes(this.searchTerm) ||
        item.mtId.toString().includes(this.searchTerm)
      );
    }
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSource = filteredData.slice(startIndex, endIndex);
    
    // Store filtered data count for pagination info
    this.filteredDataCount = filteredData.length;
  }

  private filteredDataCount: number = this.originalDataSource.length;

  // Pagination methods
  onPageSizeChange() {
    this.currentPage = 1;
    this.filterAndPaginate();
  }

  goToFirstPage() {
    this.currentPage = 1;
    this.filterAndPaginate();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterAndPaginate();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.filterAndPaginate();
    }
  }

  goToLastPage() {
    this.currentPage = this.getTotalPages();
    this.filterAndPaginate();
  }

  // Pagination info methods
  getTotalPages(): number {
    return Math.ceil(this.filteredDataCount / this.pageSize);
  }

  getStartIndex(): number {
    if (this.filteredDataCount === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndIndex(): number {
    const endIndex = this.currentPage * this.pageSize;
    return Math.min(endIndex, this.filteredDataCount);
  }

  getTotalResults(): number {
    return this.filteredDataCount;
  }

  private applyPagination() {
    this.filterAndPaginate();
  }

  // Action methods for view, email and PDF
  sendEmail(data: SwiftMessage) {
    console.log('Sending email for:', data);
    // TODO: Implement email functionality
    // Example: this.emailService.sendEmail(data);
  }

  downloadPdf(data: SwiftMessage) {
    console.log('Downloading PDF for:', data);
    // TODO: Implement PDF download functionality
    // Example: this.pdfService.generatePdf(data);
  }

  processData(data: SwiftMessage) {
    console.log('Processing data for:', data);
    // TODO: Implement process functionality
    // Example: this.processService.processMessage(data);
  }

  /**
   * Process CBS data specifically
   */
  processCBSData(data: CBSData) {
    console.log('Processing CBS data for:', data);
    // TODO: Implement CBS data processing functionality
    // Example: this.cbsService.processMessage(data);
  }

  /**
   * Edit CBS data
   */
  editCBSData(data: CBSData) {
    console.log('Editing CBS data for:', data);
    // TODO: Implement CBS data editing functionality
    // Example: this.cbsService.editMessage(data);
  }

  /**
   * Delete CBS data
   */
  deleteCBSData(data: CBSData) {
    console.log('Deleting CBS data for:', data);
    // TODO: Implement CBS data deletion functionality
    // Example: this.cbsService.deleteMessage(data);
  }

  /**
   * Download CBS data as PDF
   */
  downloadCBSDataPDF(data: CBSData) {
    console.log('Downloading CBS data as PDF for:', data);
    // TODO: Implement CBS data PDF download functionality
    // Example: this.pdfService.generateCBSDataPDF(data);
  }

  /**
   * Send CBS data via email
   */
  sendCBSDataEmail(data: CBSData) {
    console.log('Sending CBS data via email for:', data);
    // TODO: Implement CBS data email functionality
    // Example: this.emailService.sendCBSDataEmail(data);
  }

  /**
   * Copy CBS data to clipboard
   */
  copyCBSData(data: CBSData) {
    console.log('Copying CBS data to clipboard for:', data);
    // TODO: Implement CBS data copy to clipboard functionality
    // Example: this.clipboardService.copyCBSData(data);
  }

  /**
   * Print CBS data
   */
  printCBSData(data: CBSData) {
    console.log('Printing CBS data for:', data);
    // TODO: Implement CBS data printing functionality
    // Example: this.printService.printCBSData(data);
  }

  /**
   * Share CBS data
   */
  shareCBSData(data: CBSData) {
    console.log('Sharing CBS data for:', data);
    // TODO: Implement CBS data sharing functionality
    // Example: this.shareService.shareCBSData(data);
  }

  /**
   * Archive CBS data
   */
  archiveCBSData(data: CBSData) {
    console.log('Archiving CBS data for:', data);
    // TODO: Implement CBS data archiving functionality
    // Example: this.archiveService.archiveCBSData(data);
  }
}
