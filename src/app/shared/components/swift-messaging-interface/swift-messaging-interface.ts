import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SwiftMessage } from '../prime-table-out/prime-table-out';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ELEMENT_DATA } from '../prime-table-out/prime-table-out';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Button } from '../input-types/button/button';
import { SelectOptionField } from '../input-types/select-option-field/select-option-field';
import { BranchInfoService } from '../../services/branch-info.service';
import { MessageTypeService } from '../../services/message-type.service';
import { SwiftMessageService, SwiftMessageRequest, CBSData } from '../../services/swift-message.service';

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
    SelectOptionField,
    FormsModule,
    ReactiveFormsModule,
    RouterModule],
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
  cbsDataSource = new MatTableDataSource<CBSData>([]);
  
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
    { key: 'pacs-003', value: 'pacs 003 - Direct Debit' },
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

  // Loading states
  isLoadingMessages: boolean = false;
  isLoadingCBS: boolean = false;
  isLoadingSwiftLink: boolean = false;

  constructor(
    private dialog: MatDialog, 
    private fb: FormBuilder,
    private branchInfoService: BranchInfoService,
    private messageTypeService: MessageTypeService,
    private swiftMessageService: SwiftMessageService,
    private router: Router
  ) {
    this.initializeForm();
    this.applyPagination();
  }

  ngOnInit() {
    this.loadBranchData();
    
    // Set up filter predicate for CBS data table
    this.cbsDataSource.filterPredicate = (data: CBSData, filter: string) => {
      const searchTerm = filter.toLowerCase();
      return (
        data.msgRefNo.toLowerCase().includes(searchTerm) ||
        data.makeBy.toLowerCase().includes(searchTerm) ||
        data.auth1stBy.toLowerCase().includes(searchTerm) ||
        data.makeDate.toLowerCase().includes(searchTerm) ||
        data.issueDate.toLowerCase().includes(searchTerm)
      );
    };
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
            key: branch.homeBranchId,
            value: `${branch.branchName} (${branch.homeBranchId})`
          }));
          this.fullBranchData = response; // Store full data
        } else if (response && response.data && Array.isArray(response.data)) {
          // Handle case where response is wrapped in a data property
          this.branchOptions = response.data.map((branch: any) => ({
            key: branch.homeBranchId,
            value: `${branch.branchName} (${branch.homeBranchId})`
          }));
          this.fullBranchData = response.data; // Store full data
        } else if (response && response.result && Array.isArray(response.result)) {
          // Handle case where response is wrapped in a result property
          this.branchOptions = response.result.map((branch: any) => ({
            key: branch.homeBranchId,
            value: `${branch.branchName} (${branch.homeBranchId})`
          }));
          this.fullBranchData = response.data; // Store full data
        } else if (response && response.payload && Array.isArray(response.payload)) {
          // Handle case where response is wrapped in a payload property
          this.branchOptions = response.payload.map((branch: any) => ({
            key: branch.homeBranchId,
            value: `${branch.branchName} (${branch.homeBranchId})`
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
  getBranchInfo(homeBranchId: string): any {
    // This method can be used to get additional branch details
    // You can extend this to fetch from a cache or make additional API calls
    return this.branchOptions.find(branch => branch.key === homeBranchId);
  }

  /**
   * Get branch name by branch ID
   */
  getBranchName(homeBranchId: string): string {
    const branch = this.getBranchInfo(homeBranchId);
    return branch ? branch.value : 'Unknown Branch';
  }

  /**
   * Get full branch details by branch ID
   */
  getFullBranchDetails(homeBranchId: string): any {
    return this.fullBranchData.find((branch: any) => branch.homeBranchId === homeBranchId);
  }

  /**
   * Get branch address by branch ID
   */
  getBranchAddress(homeBranchId: string): string {
    const branch = this.getFullBranchDetails(homeBranchId);
    return branch ? branch.address : 'Address not available';
  }

  /**
   * Get branch SWIFT code by branch ID
   */
  getBranchSwiftCode(homeBranchId: string): string {
    const branch = this.getFullBranchDetails(homeBranchId);
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
        branch.homeBranchId || '',
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
            key: branch.homeBranchId,
            value: `${branch.branchName} (${branch.swift})`
          }));
          this.fullBranchData = response; // Store full data
        } else if (response && response.data && Array.isArray(response.data)) {
          this.branchOptions = response.data.map((branch: any) => ({
            key: branch.homeBranchId,
            value: `${branch.branchName} (${branch.swift})`
          }));
          this.fullBranchData = response.data; // Store full data
        } else if (response && response.result && Array.isArray(response.result)) {
          this.branchOptions = response.result.map((branch: any) => ({
            key: branch.homeBranchId,
            value: `${branch.branchName} (${branch.swift})`
          }));
          this.fullBranchData = response.result; // Store full data
        } else if (response && response.payload && Array.isArray(response.payload)) {
          // Handle case where response is wrapped in a payload property
          this.branchOptions = response.payload.map((branch: any) => ({
            key: branch.homeBranchId,
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
    
    // Reset paginator to first page when searching
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  /**
   * Clear search results and reset form
   */
  clearSearch(): void {
    this.cbsDataSource.data = [];
    this.swiftForm.reset();
    console.log('Search cleared and form reset');
  }

  /**
   * Populate form with sample values for testing
   */
  populateSampleData(): void {
    this.swiftForm.patchValue({
      messageType: 'pacs-009',
      fromDate: '2020-01-01',
      toDate: '2025-12-01',
      branch: '0031', // This should match a homeBranchId from your branch options
      messageRefNo: ''
    });
    console.log('Form populated with sample data for testing');
  }

  // CBS specific methods
  /**
   * Find messages from CBS based on search criteria
   */
  findFromCBS(): void {
    if (!this.validateSearchForm()) {
      return;
    }

    this.isLoadingCBS = true;
    const request = this.buildSearchRequest();
    
    console.log('Searching CBS for messages with criteria:', request);
    console.log('Request payload for backend:', JSON.stringify(request, null, 2));
    
    this.messageTypeService.getList(request).subscribe({
      next: (response: any) => {
        this.isLoadingCBS = false;
        console.log('CBS response:', response);
        console.log('Response structure:', {
          isArray: Array.isArray(response),
          hasData: response && response.data,
          hasPayload: response && response.payload,
          responseKeys: response ? Object.keys(response) : []
        });
        
        let messages: CBSData[] = [];
        
        if (response && Array.isArray(response)) {
          messages = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          messages = response.data;
        } else if (response && response.payload && Array.isArray(response.payload)) {
          messages = response.payload;
        } else {
          console.warn('Unexpected CBS response format:', response);
          messages = [];
        }
        
        console.log('Processed messages:', messages);
        console.log('First message structure:', messages.length > 0 ? messages[0] : 'No messages');
        
        this.cbsDataSource.data = messages;
        console.log(`Loaded ${messages.length} messages from CBS`);
        
        if (messages.length === 0) {
          alert('No messages found in CBS for the selected criteria.');
        }
        
        // Update paginator
        if (this.paginator) {
          this.paginator.firstPage();
        }
      },
      error: (error) => {
        this.isLoadingCBS = false;
        console.error('Error loading CBS messages:', error);
        alert('Failed to load messages from CBS. Please try again.');
        this.cbsDataSource.data = [];
      }
    });
  }

  /**
   * Find messages from SWIFTLINK based on search criteria
   */
  findFromSwiftLink(): void {
    if (!this.validateSearchForm()) {
      return;
    }

    this.isLoadingSwiftLink = true;
    const request = this.buildSearchRequest();
    
    this.messageTypeService.getList(request).subscribe({
      next: (response: any) => {
        this.isLoadingSwiftLink = false;
        
        let messages: CBSData[] = [];
        
        if (response && Array.isArray(response)) {
          messages = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          messages = response.data;
        } else if (response && response.payload && Array.isArray(response.payload)) {
          messages = response.payload;
        } else {
          console.warn('Unexpected SWIFTLINK response format:', response);
          messages = [];
        }
        
        console.log('Processed messages:', messages);
        console.log('First message structure:', messages.length > 0 ? messages[0] : 'No messages');
        
        this.cbsDataSource.data = messages;
        console.log(`Loaded ${messages.length} messages from SWIFTLINK`);
        
        if (messages.length === 0) {
          alert('No messages found in SWIFTLINK for the selected criteria.');
        }
        
        // Update paginator
        if (this.paginator) {
          this.paginator.firstPage();
        }
      },
      error: (error) => {
        this.isLoadingSwiftLink = false;
        console.error('Error loading SWIFTLINK messages:', error);
        alert('Failed to load messages from SWIFTLINK. Please try again.');
        this.cbsDataSource.data = [];
      }
    });
  }

  /**
   * Build search request object from form values
   */
  private buildSearchRequest(): SwiftMessageRequest {
    const formValue = this.swiftForm.value;
    
    return {
      branchId: formValue.branch || '',
      msgType: this.getMessageTypeNumber(formValue.messageType),
      refNo: formValue.messageRefNo || null,
      msgFromDate: this.formatDateForBackend(formValue.fromDate),
      msgToDate: this.formatDateForBackend(formValue.toDate),
      orgnBrId: formValue.branch || null // Using branch as organization branch ID
    };
  }

  /**
   * Format date to backend expected format (e.g., "01jan2020")
   */
  private formatDateForBackend(dateString: string | null): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
      const year = date.getFullYear();
      
      return `${day}${month}${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original if formatting fails
    }
  }

  /**
   * Format backend date string for display (e.g., "2022-08-28T15:45:08.000+00:00" -> "Aug 28, 2022")
   */
  private formatDateForDisplay(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting display date:', error);
      return dateString; // Return original if formatting fails
    }
  }

  /**
   * Convert message type string to number for backend
   */
  private getMessageTypeNumber(messageType: string): number {
    if (!messageType) return 0;
    
    // Extract the number from message type (e.g., 'pacs-009' -> 9)
    const match = messageType.match(/pacs-(\d+)/);
    if (match) {
      const number = parseInt(match[1], 10);
      return number;
    }
    
    // Handle other message type formats if needed
    return 0;
  }

  /**
   * Validate search form before submitting
   */
  private validateSearchForm(): boolean {
    const formValue = this.swiftForm.value;
    
    if (!formValue.branch) {
      alert('Please select a branch.');
      return false;
    }
    
    if (!formValue.messageType) {
      alert('Please select a message type.');
      return false;
    }
    
    if (!formValue.fromDate && !formValue.toDate && !formValue.messageRefNo) {
      alert('Please provide at least one search criteria (date range or message reference number).');
      return false;
    }
    
    // Validate date format if dates are provided
    if (formValue.fromDate && !this.isValidDate(formValue.fromDate)) {
      alert('Please enter a valid from date.');
      return false;
    }
    
    if (formValue.toDate && !this.isValidDate(formValue.toDate)) {
      alert('Please enter a valid to date.');
      return false;
    }
    
    // Validate date range if both dates are provided
    if (formValue.fromDate && formValue.toDate) {
      const fromDate = new Date(formValue.fromDate);
      const toDate = new Date(formValue.toDate);
      
      if (fromDate > toDate) {
        alert('From date cannot be later than to date.');
        return false;
      }
    }
    
    return true;
  }

  /**
   * Validate if a date string is valid
   */
  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  // CBS specific methods
  /**
   * Filter CBS data
   */
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
    this.currentPage = 1; // Reset to first page
    this.filterData();
  }

  // Filter data based on all criteria
  filterData() {
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
   * This method routes to different PACS components based on the selected message type.
   * Currently supports routing to:
   * - pacs-009: Financial Institution Credit Transfer Return
   * - pacs-003: Direct Debit (newly added)
   * - pacs-008: F1 to F1 Customer Credit Transfer
   * - pacs-002: F1 to F1 Payment
   * 
   * The CBS data is passed to the target component via router state.
   */
  processCBSData(data: CBSData) {
    
    // Get the selected message type from the form
    const selectedMessageType = this.swiftForm.get('messageType')?.value;
    
    if (!selectedMessageType) {
      // Show user-friendly error message
      alert('Please select a message type before processing the data.');
      return;
    }
    
    // Route to appropriate component based on message type
    switch (selectedMessageType) {
      case 'pacs-009':
        this.router.navigate(['/mx/pacs-009'], {
          state: { cbsData: data }
        });
        break;
      case 'pacs-003':
        console.log('Navigating to pacs-003 with data:', data);
        this.router.navigate(['/mx/pacs-003'], {
          state: { cbsData: data }
        });
        break;
      case 'pacs-008':
        console.log('Navigating to pacs-008 with data:', data);
        this.router.navigate(['/mx/pacs-008'], {
          state: { cbsData: data }
        });
        break;
      case 'pacs-002':
        console.log('Navigating to pacs-002 with data:', data);
        this.router.navigate(['/mx/pacs-002'], {
          state: { cbsData: data }
        });
        break;
      default:
        console.warn(`Routing not implemented for message type: ${selectedMessageType}`);
        // Show user-friendly error message
        alert(`Routing not implemented for message type: ${selectedMessageType}. Please contact support.`);
        break;
    }
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
}
