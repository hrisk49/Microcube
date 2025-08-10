import { Component, input, output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DataSelectionConfig, DataSelectionItem, DataSelectionResult, DataSelectionColumn, DataSelectionFilter, DataSelectionSort, DataSelectionPagination } from '../../models/data-selection.interface';

@Component({
  selector: 'app-data-selection-modal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule
  ],
  templateUrl: './data-selection-modal.html',
  styleUrls: ['./data-selection-modal.scss']
})
export class DataSelectionModal implements OnInit, OnDestroy {
  isOpen = input<boolean>(false);
  config = input.required<DataSelectionConfig>();
  close = output<void>();
  result = output<DataSelectionResult>();

  // Data properties
  data: DataSelectionItem[] = [];
  filteredData: DataSelectionItem[] = [];
  selectedItems: DataSelectionItem[] = [];
  loading: boolean = false;
  error: string | null = null;

  // Search and filter
  searchForm: FormGroup;
  searchTerm: string = '';
  activeFilters: DataSelectionFilter[] = [];

  // Form controls
  get searchTermControl() { return this.searchForm.get('searchTerm') as FormControl; }
  get filterFieldControl() { return this.searchForm.get('filterField') as FormControl; }
  get filterValueControl() { return this.searchForm.get('filterValue') as FormControl; }
  get filterOperatorControl() { return this.searchForm.get('filterOperator') as FormControl; }

  // Sorting
  currentSort: DataSelectionSort | null = null;

  // Pagination
  pagination: DataSelectionPagination = {
    page: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 0
  };

  // UI state
  showFilters: boolean = false;
  showAdvancedSearch: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.searchForm = this.formBuilder.group({
      searchTerm: [''],
      filterField: [''],
      filterValue: [''],
      filterOperator: ['contains']
    });
  }

  ngOnInit(): void {
    this.initializeConfig();
    this.setupSearchForm();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private initializeConfig(): void {
    const config = this.config();
    if (!config) {
      return;
    }

    // Set default values
    const updatedConfig = {
      ...config,
      pageSize: config.pageSize || 10,
      enablePagination: config.enablePagination ?? true,
      enableSorting: config.enableSorting ?? true,
      enableFiltering: config.enableFiltering ?? true,
      enableSelection: config.enableSelection ?? true,
      enableSearch: config.enableSearch ?? true,
      showInsertButton: config.showInsertButton ?? true,
      showCloseButton: config.showCloseButton ?? true,
      showSelectIcon: config.showSelectIcon ?? true,
      insertButtonText: config.insertButtonText || 'Insert',
      closeButtonText: config.closeButtonText || 'Close',
      selectIconText: config.selectIconText || 'Insert this item',
      searchPlaceholder: config.searchPlaceholder || 'Search...',
      noDataMessage: config.noDataMessage || 'No data available',
      loadingMessage: config.loadingMessage || 'Loading...',
      errorMessage: config.errorMessage || 'Error loading data'
    };

    // Reset pagination with config values
    this.pagination = {
      page: 1,
      pageSize: updatedConfig.pageSize,
      totalRecords: 0,
      totalPages: 0
    };

    // Force change detection to update the select element
    this.cdr.detectChanges();
    
    // Additional delay to ensure DOM is updated
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 50);
  }

  private getDefaultConfig(): DataSelectionConfig {
    return {
      title: 'Select Data',
      service: null,
      serviceMethod: '',
      columns: [],
      fallbackData: []
    };
  }

  private setupSearchForm(): void {
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(value => {
      this.searchTerm = value;
      this.applyFilters();
    });
  }

  // Open modal and load data
  openModal(): void {
    if (this.isOpen()) {
      this.initializeConfig();
      this.loadData();
      // Force update of pagination display
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 100);
    }
  }

  // Load data from service
  private async loadData(): Promise<void> {
    const config = this.config();
    if (!config.service || !config.serviceMethod) {
      this.handleError('Service or service method not configured');
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const serviceParams = {
        ...config.serviceParams,
        page: this.pagination.page,
        pageSize: this.pagination.pageSize,
        search: this.searchTerm,
        filters: this.activeFilters,
        sort: this.currentSort
      };

      const result = await config.service[config.serviceMethod](serviceParams);
      
      if (result && Array.isArray(result.data)) {
        this.data = result.data;
        this.pagination.totalRecords = result.totalRecords || result.data.length;
        this.pagination.totalPages = Math.ceil(this.pagination.totalRecords / this.pagination.pageSize);
        this.applyFilters();
        
        if (config.onSuccess) {
          config.onSuccess(this.data);
        }
      } else if (result && Array.isArray(result)) {
        // Direct array response
        this.data = result;
        this.pagination.totalRecords = result.length;
        this.pagination.totalPages = Math.ceil(this.pagination.totalRecords / this.pagination.pageSize);
        this.applyFilters();
      } else {
        throw new Error('Invalid data format received from service');
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private handleError(error: any): void {
    console.error('Data selection modal error:', error);
    const config = this.config();
    this.error = config.errorMessage || 'Error loading data';
    
    // Use fallback data if available
    if (config.fallbackData && config.fallbackData.length > 0) {
      this.data = config.fallbackData;
      this.pagination.totalRecords = this.data.length;
      this.pagination.totalPages = Math.ceil(this.pagination.totalRecords / this.pagination.pageSize);
      this.applyFilters();
      this.error = null;
    }

    if (config.onError) {
      config.onError(error);
    }
  }

  // Apply filters and search
  private applyFilters(): void {
    let filtered = [...this.data];
    const config = this.config();

    // Apply search term
    if (this.searchTerm) {
      filtered = filtered.filter(item => {
        return config.columns.some((column: DataSelectionColumn) => {
          const value = item[column.field];
          if (value == null) return false;
          return value.toString().toLowerCase().includes(this.searchTerm.toLowerCase());
        });
      });
    }

    // Apply active filters
    this.activeFilters.forEach(filter => {
      filtered = filtered.filter(item => {
        const value = item[filter.field];
        if (value == null) return false;

        switch (filter.operator) {
          case 'equals':
            return value == filter.value;
          case 'contains':
            return value.toString().toLowerCase().includes(filter.value.toString().toLowerCase());
          case 'startsWith':
            return value.toString().toLowerCase().startsWith(filter.value.toString().toLowerCase());
          case 'endsWith':
            return value.toString().toLowerCase().endsWith(filter.value.toString().toLowerCase());
          case 'greaterThan':
            return value > filter.value;
          case 'lessThan':
            return value < filter.value;
          default:
            return true;
        }
      });
    });

    // Apply sorting
    if (this.currentSort) {
      filtered.sort((a: DataSelectionItem, b: DataSelectionItem) => {
        const aValue = a[this.currentSort!.field];
        const bValue = b[this.currentSort!.field];
        
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return this.currentSort!.direction === 'desc' ? -comparison : comparison;
      });
    }

    this.filteredData = filtered;
  }

  // Row selection
  onRowClick(item: DataSelectionItem): void {
    const config = this.config();
    if (config.enableSelection) {
      this.selectedItems = [item];
    }
  }

  onRowDoubleClick(item: DataSelectionItem): void {
    this.selectItem(item);
  }

  onCheckboxChange(item: DataSelectionItem, checked: boolean): void {
    if (checked) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems = this.selectedItems.filter(selected => selected !== item);
    }
  }

  // Select item and close modal
  selectItem(item: DataSelectionItem): void {
    const result: DataSelectionResult = {
      selectedItem: item,
      action: 'select'
    };
    this.result.emit(result);
    this.closeModal();
  }

  // Insert selected items
  insertSelected(): void {
    if (this.selectedItems.length === 0) {
      return;
    }

    const result: DataSelectionResult = {
      selectedItems: this.selectedItems,
      action: 'insert'
    };
    this.result.emit(result);
    this.closeModal();
  }

  // Close modal
  closeModal(): void {
    const result: DataSelectionResult = {
      action: 'close'
    };
    this.result.emit(result);
    this.close.emit();
  }

  // Sorting
  onSort(column: DataSelectionColumn): void {
    if (!column.sortable) return;

    if (this.currentSort?.field === column.field) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = { field: column.field, direction: 'asc' };
    }

    this.applyFilters();
  }

  // Pagination
  onPageChange(pageIndex: number): void {
    this.pagination.page = pageIndex + 1;
    this.loadData();
  }

  onPageSizeChange(event: any): void {
    this.pagination.pageSize = event.pageSize;
    this.pagination.page = 1;
    this.loadData();
  }

  // Filtering
  addFilter(): void {
    const filterField = this.searchForm.get('filterField')?.value;
    const filterValue = this.searchForm.get('filterValue')?.value;
    const filterOperator = this.searchForm.get('filterOperator')?.value;

    if (filterField && filterValue !== '') {
      this.activeFilters.push({
        field: filterField,
        value: filterValue,
        operator: filterOperator
      });

      this.searchForm.patchValue({
        filterField: '',
        filterValue: '',
        filterOperator: 'contains'
      });

      this.applyFilters();
    }
  }

  removeFilter(index: number): void {
    this.activeFilters.splice(index, 1);
    this.applyFilters();
  }

  clearFilters(): void {
    this.activeFilters = [];
    this.searchForm.patchValue({
      searchTerm: '',
      filterField: '',
      filterValue: '',
      filterOperator: 'contains'
    });
    this.applyFilters();
  }

  // Utility methods
  getVisibleColumns(): DataSelectionColumn[] {
    const config = this.config();
    return config.columns
      .filter((col: DataSelectionColumn) => col.visible !== false)
      .sort((a: DataSelectionColumn, b: DataSelectionColumn) => (a.order || 0) - (b.order || 0));
  }

  getCellValue(item: DataSelectionItem, column: DataSelectionColumn): any {
    const value = item[column.field];
    
    if (value == null) return '';

    switch (column.type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return value;
    }
  }

  isSelected(item: DataSelectionItem): boolean {
    return this.selectedItems.includes(item);
  }

  getSortIcon(column: DataSelectionColumn): string {
    if (this.currentSort?.field !== column.field) return '';
    return this.currentSort.direction === 'asc' ? '↑' : '↓';
  }

  // Watch for modal open state changes
  ngOnChanges(): void {
    if (this.isOpen()) {
      this.initializeConfig();
      this.openModal();
    }
  }

  // Get displayed columns for Material table
  getDisplayedColumns(): string[] {
    const columns: string[] = [];
    const config = this.config();
    
    if (config.enableSelection) {
      columns.push('select');
    }
    
    columns.push(...this.getVisibleColumns().map(col => col.field));
    
    return columns;
  }

  onSelectAllChange(event: any): void {
    const checked = event.target.checked;
    if (checked) {
      this.selectedItems = [...this.filteredData];
    } else {
      this.selectedItems = [];
    }
  }

  trackByItem(index: number, item: DataSelectionItem): any {
    return item.id || index;
  }

  // Make Math available in template
  get Math(): Math {
    return Math;
  }

  // Getter for current page size to ensure proper binding
  get currentPageSize(): number {
    return this.pagination.pageSize || 10;
  }
} 