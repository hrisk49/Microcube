import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

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
export class DataSelectionModal implements OnInit {

  protected readonly Object = Object;
  dataSource: any[] = [];
  filteredDataSource: any[] = [];
  paginatedDataSource: any[] = [];
  searchTerm: string = '';
  pickTablePair: Map<string, string> = new Map<string, string>();

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];

  // result = output<any | undefined>();

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataSource = data?.pickTableDataSource ?? [];
    this.filteredDataSource = [...this.dataSource];
    this.pickTablePair = data?.pickTablePair ?? new Map<string, string>();
    this.updatePagination();
  }

  ngOnInit(): void {
  }

  dialogClose(value: any) {
    // this.result.emit(value);
    this.dialogRef.close(value);
  }

  isPresentHead(key: string): boolean {
    return this.pickTablePair.has(key);
  }

  getHead(key: string): string {
    return this.pickTablePair.get(key) || key;
  }

  // Filter data based on search term
  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase().trim();
    this.filterData();
  }

  // Filter the data source based on search term
  private filterData(): void {
    if (!this.searchTerm) {
      this.filteredDataSource = [...this.dataSource];
    } else {
      this.filteredDataSource = this.dataSource.filter(item => {
        // Search in all visible columns
        return Object.keys(item).some(key => {
          if (this.isPresentHead(key)) {
            const value = item[key];
            return value && value.toString().toLowerCase().includes(this.searchTerm);
          }
          return false;
        });
      });
    }
    
    // Reset to first page after filtering
    this.currentPage = 1;
    this.updatePagination();
  }

  // Clear search and filters
  clearFilters(): void {
    this.searchTerm = '';
    this.filteredDataSource = [...this.dataSource];
    this.currentPage = 1;
    this.updatePagination();
  }

  // Update pagination after data changes
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredDataSource.length / this.pageSize);
    this.paginateData();
  }

  // Apply pagination to filtered data
  private paginateData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedDataSource = this.filteredDataSource.slice(startIndex, endIndex);
  }

  // Change page size
  onPageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.currentPage = 1; // Reset to first page
    this.updatePagination();
  }

  // Go to previous page
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateData();
    }
  }

  // Go to next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateData();
    }
  }

  // Check if previous page is available
  canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  // Check if next page is available
  canGoNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  // Get pagination info text
  getPaginationInfo(): string {
    if (this.filteredDataSource.length === 0) {
      return 'No results to show';
    }
    
    const startItem = (this.currentPage - 1) * this.pageSize + 1;
    const endItem = Math.min(this.currentPage * this.pageSize, this.filteredDataSource.length);
    return `Showing ${startItem} to ${endItem} of ${this.filteredDataSource.length} results`;
  }

}
