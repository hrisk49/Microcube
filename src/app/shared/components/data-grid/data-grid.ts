import { Component, input, output, signal, computed, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface TableRowDesigner {
  condition: (item: any) => boolean;
  backgroundColor?: string;
  textColor?: string;
  fontWeight?: string;
  borderColor?: string;
}

export interface GridColumn {
  property: string;
  header: string;
  isEditable: boolean;
  isNumeric: boolean;
  isVisible: boolean;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface GridAction {
  type: 'edit' | 'delete' | 'view' | 'print';
  icon: string;
  tooltip: string;
  visible: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'lds-data-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.scss'
})
export class DataGridComponent<T extends Record<string, any> = any> implements OnInit, OnDestroy {
  // Inputs
  readonly id = input<string>('');
  readonly showEditButton = input<boolean>(false);
  readonly showDeleteButton = input<boolean>(false);
  readonly showViewButton = input<boolean>(false);
  readonly showPrintButton = input<boolean>(false);
  readonly enableSelection = input<boolean>(false);
  readonly tblClass = input<string>('');
  readonly customColumnNames = input<Record<string, string>>({});
  readonly selectedColumns = input<string[]>([]);
  readonly editableColumns = input<string[]>([]);
  readonly numberColumns = input<string[]>([]);
  readonly rowDesignerList = input<TableRowDesigner[]>([]);
  readonly dataSource = input<T[]>([]);
  readonly initPageSize = input<number>(5);
  readonly useInlineEdit = input<boolean>(true);
// In DataGridComponent
  // Outputs
  readonly onSelectAllChange = output<boolean>();
  readonly onFHEditClick = output<string>();
  readonly onFHDeleteClick = output<string>();
  readonly onFHViewClick = output<string>();
  readonly onChecked = output<string>();
  readonly onPrint = output<string>();
  readonly dataSourceChanged = output<T[]>();

  // Internal state
  public _dataSource = signal<T[]>([]);
  public _filteredData = signal<T[]>([]);
  public _currentPage = signal<number>(0);
  public _pageSize = signal<number>(5);
  public _sortColumn = signal<string>('');
  public _sortDirection = signal<'asc' | 'desc'>('asc');
  public _searchTerm = signal<string>('');
  public _selectedRows = signal<Set<number>>(new Set());
  public _selectAll = signal<boolean>(false);
  public _editingRow = signal<number | null>(null);
  public _editingData = signal<Partial<T>>({});

  // Computed values
  columns = computed(() => this.buildColumns());
  displayedData = computed(() => this.getDisplayedData());
  totalPages = computed(() => Math.ceil(this._filteredData().length / this._pageSize()));
  hasNextPage = computed(() => this._currentPage() < this.totalPages() - 1);
  hasPrevPage = computed(() => this._currentPage() > 0);
  selectedCount = computed(() => this._selectedRows().size);
  isAllSelected = computed(() => this._selectedRows().size === this.displayedData().length);

  constructor() {
    // Move effect to constructor - this ensures it runs after input signals are bound
    effect(() => {
      const data = this.dataSource();
      
      console.log('DataGridComponent: dataSource changed:', data);
      if (data && data.length > 0) {
        this._dataSource.set([...data]); // Create a copy
        this.applyFilters();
      } else {
        this._dataSource.set([]);
        this._filteredData.set([]);
      }
    });

    // Set initial page size effect
    effect(() => {
      const pageSize = this.initPageSize();
      if (pageSize > 0) {
        this._pageSize.set(pageSize);
      }
    });
  }

  ngOnInit() {
    // Initial setup if needed
    console.log('DataGridComponent initialized');
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  // Column management
private buildColumns(): GridColumn[] {
  const allProperties = this._dataSource().length > 0 ? Object.keys(this._dataSource()[0]) : [];
  const propertiesToShow = this.selectedColumns().length > 0 ? this.selectedColumns() : allProperties;

  return propertiesToShow.map(prop => ({
    property: prop,
    header: this.customColumnNames()[prop] || this.formatColumnHeader(prop),
    isEditable: this.editableColumns().includes(prop),
    isNumeric: this.numberColumns().includes(prop),
    isVisible: true,
    sortable: true,
    filterable: true,
    width: this.getColumnWidth(prop) // Add width calculation
  }));
}

private getColumnWidth(property: string): string {
  // Example: Define widths based on property or use a default
  const widthMap: Record<string, string> = {
    id: '100px',
    name: '200px',
    // Add more properties as needed
  };
  return widthMap[property] || '150px'; // Default width
}


  private formatColumnHeader(property: string): string {
    return property
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  // Data filtering and sorting
  private applyFilters(): void {
    console.log('Applying filters to data:', this._dataSource().length, 'items');
    let filtered = [...this._dataSource()];

    // Apply search filter
    if (this._searchTerm()) {
      filtered = filtered.filter(item => 
        Object.values(item as Record<string, any>).some(value => 
          String(value).toLowerCase().includes(this._searchTerm().toLowerCase())
        )
      );
    }

    // Apply sorting
    if (this._sortColumn()) {
      filtered.sort((a, b) => {
        const aVal = this.getPropertyValue(a, this._sortColumn());
        const bVal = this.getPropertyValue(b, this._sortColumn());
        
        if (this._sortDirection() === 'asc') {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
      });
    }

    this._filteredData.set(filtered);
    console.log('Filtered data set:', filtered.length, 'items');
    
    // Reset to first page when filtering, but don't reset if it's initial load
    if (this._searchTerm() || this._sortColumn()) {
      this._currentPage.set(0);
    }
  }

  public getPropertyValue(item: T, property: string): any {
    return property.split('.').reduce((obj: any, key) => obj?.[key], item);
  }

  private getDisplayedData(): T[] {
    const startIndex = this._currentPage() * this._pageSize();
    const endIndex = startIndex + this._pageSize();
    const displayed = this._filteredData().slice(startIndex, endIndex);
    console.log('Getting displayed data:', displayed.length, 'items');
    return displayed;
  }

  // Sorting
  onSort(column: string): void {
    if (this._sortColumn() === column) {
      this._sortDirection.set(this._sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this._sortColumn.set(column);
      this._sortDirection.set('asc');
    }
    this.applyFilters();
  }

  // Pagination
  onPageChange(event: PageEvent): void {
    this._currentPage.set(event.pageIndex);
    this._pageSize.set(event.pageSize);
    console.log('Page changed:', event.pageIndex, 'Page size:', event.pageSize);
  }

  // Search
  onSearch(term: string): void {
    this._searchTerm.set(term);
    this.applyFilters();
  }

  // Row selection
  onRowSelect(index: number, checked: boolean): void {
    const actualIndex = this._currentPage() * this._pageSize() + index;
    const newSelected = new Set(this._selectedRows());
    
    if (checked) {
      newSelected.add(actualIndex);
    } else {
      newSelected.delete(actualIndex);
    }
    
    this._selectedRows.set(newSelected);
    this.onChecked.emit(JSON.stringify(this._filteredData()[actualIndex]));
  }

  onSelectAll(checked: boolean): void {
    this._selectAll.set(checked);
    
    if (checked) {
      const newSelected = new Set<number>();
      this.displayedData().forEach((_, index) => {
        newSelected.add(this._currentPage() * this._pageSize() + index);
      });
      this._selectedRows.set(newSelected);
    } else {
      this._selectedRows.set(new Set());
    }
    
    this.onSelectAllChange.emit(checked);
  }

  // Row editing
  startEdit(index: number): void {
    this._editingRow.set(index);
    this._editingData.set({ ...this.displayedData()[index] });
  }

  saveEdit(index: number): void {
    const actualIndex = this._currentPage() * this._pageSize() + index;
    const sourceIndex = this._dataSource().findIndex((item, i) => i === actualIndex);
    
    if (sourceIndex !== -1) {
      const updatedData = [...this._dataSource()];
      updatedData[sourceIndex] = { ...updatedData[sourceIndex], ...this._editingData() };
      
      this._dataSource.set(updatedData);
      this._editingRow.set(null);
      this._editingData.set({});
      this.applyFilters();
      this.dataSourceChanged.emit(updatedData);
    }
  }

  cancelEdit(): void {
    this._editingRow.set(null);
    this._editingData.set({});
  }

  // Actions
  onEditClick(item: T): void {
    this.onFHEditClick.emit(JSON.stringify(item));
  }

  onDeleteClick(item: T): void {

    this.onFHDeleteClick.emit(JSON.stringify(item));
  }

  onViewClick(item: T): void {
    this.onFHViewClick.emit(JSON.stringify(item));
  }

  onPrintClick(item: T): void {
    this.onPrint.emit(JSON.stringify(item));
  }

  // Row styling
  getRowStyle(item: T): any {
    for (const designer of this.rowDesignerList()) {
      if (designer.condition(item)) {
        return {
          // backgroundColor: designer.backgroundColor,
          // color: designer.textColor,
          // fontWeight: designer.fontWeight,
          // borderColor: designer.borderColor
        };
      }
    }
    return {};
  }

  // Utility methods
  isRowSelected(index: number): boolean {
    const actualIndex = this._currentPage() * this._pageSize() + index;
    return this._selectedRows().has(actualIndex);
  }

  isRowEditing(index: number): boolean {
    return this._editingRow() === index;
  }

  getEditingValue(property: string): any {
    return (this._editingData() as Record<string, any>)[property] || '';
  }

  setEditingValue(property: string, value: any): void {
    this._editingData.set({ ...this._editingData(), [property]: value } as Partial<T>);
  }

  // Public methods for external access
  getSelectedRows(): T[] {
    return Array.from(this._selectedRows()).map(index => this._filteredData()[index]);
  }

  clearSelection(): void {
    this._selectedRows.set(new Set());
    this._selectAll.set(false);
  }

  refreshData(): void {
    this.applyFilters();
  }

  // Get displayed columns for the table
  getDisplayedColumns(): string[] {
    const columns: string[] = [];
    
    if (this.enableSelection()) {
      columns.push('selection');
    }

    if (this.showEditButton() || this.showDeleteButton() || this.showViewButton() || this.showPrintButton()) {
      columns.push('actions');
    }
     
    const dataColumns = this.columns().map(col => col.property);
    columns.push(...dataColumns);
    


    // console.log('Displayed columns:', columns);
    return columns;
  }

  // Math utility for template
  Math = Math;
}