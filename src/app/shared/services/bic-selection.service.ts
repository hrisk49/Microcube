import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { BranchInfoService } from './branch-info.service';
import { DataSelectionModal } from '../components/data-selection-modal/data-selection-modal';
import { DialogUtils } from '../service/dialog-utils';
  // Define interface for field mapping
  interface BicFieldMapping {
    bicField: string;
    nameField?: string;
    defaultValue?: string;
  }
@Injectable({
  providedIn: 'root'
})
export class BicSelectionService {
  constructor(
    private branchInfoService: BranchInfoService,
    private dialogUtils: DialogUtils
  ) {}

  // Generic function to handle BIC selection
  openBicSelectionModal(
    form: FormGroup,
    sourceFields: BicFieldMapping,
    tableHeaders?: Map<string, string>
  ): Observable<any> {
    const defaultHeaders = new Map<string, string>([
      ['swift', 'SWIFT Code'],
      ['branchName', 'Branch Name'],
      ['address', 'Address']
    ]);

    const prefix = (form.get(sourceFields.bicField)?.value || '').toString().trim();
    
    // Return Observable that always waits for user selection
    return new Observable((subscriber) => {
      // Define openModal function first
      const openModal = (initialData: any[]) => {
        const modalData = {
          pickTableDataSource: initialData,
          pickTablePair: tableHeaders || defaultHeaders,
          apiSearchPlaceholder: prefix ? 'Enter SWIFT code prefix to search...' : 'SWIFT code search...',
          findButtonText: prefix ? 'Find SWIFT Code' : 'Find',
          loadingText: 'Searching...',
          noDataMessage: 'No data available. Use the search field above to find SWIFT codes.',
          loadingMessage: 'Searching for SWIFT codes...'
        };

        const dialogRef = this.dialogUtils.openDialog(
          DataSelectionModal,
          modalData.pickTablePair,
          modalData.pickTableDataSource
        );

        // Pass the configurable text data to the modal instance
        setTimeout(() => {
          if (dialogRef.componentInstance) {
            dialogRef.componentInstance.apiSearchPlaceholder = modalData.apiSearchPlaceholder;
            dialogRef.componentInstance.findButtonText = modalData.findButtonText;
            dialogRef.componentInstance.loadingText = modalData.loadingText;
            dialogRef.componentInstance.noDataMessage = modalData.noDataMessage;
            dialogRef.componentInstance.loadingMessage = modalData.loadingMessage;
          }
        }, 0);

        // Listen for Find clicks emitted from modal and fetch
        dialogRef.componentInstance.onFindClicked.subscribe((term: string) => {
          const q = (term || '').trim();
          if (!q) {
            dialogRef.componentInstance.dataSource = [];
            dialogRef.componentInstance.filteredDataSource = [];
            dialogRef.componentInstance.updatePagination();
            return;
          }

          // Set loading state
          dialogRef.componentInstance.setLoading(true);

          this.branchInfoService.getBySwiftCodePrefix(q).subscribe({
            next: (res: any) => {
              const searchResults = res?.payload || [];
              dialogRef.componentInstance.dataSource = searchResults;
              dialogRef.componentInstance.filteredDataSource = [...searchResults];
              dialogRef.componentInstance.updatePagination();
              // Clear API search field after successful search
              dialogRef.componentInstance.clearApiSearch();
              // Clear loading state
              dialogRef.componentInstance.setLoading(false);
            },
            error: (err: any) => {
              console.error('Error fetching SWIFT codes:', err);
              dialogRef.componentInstance.dataSource = [];
              dialogRef.componentInstance.filteredDataSource = [];
              dialogRef.componentInstance.updatePagination();
              // Clear loading state
              dialogRef.componentInstance.setLoading(false);
            }
          });
        });

        // Wait for modal to close and emit selected data
        dialogRef.afterClosed().subscribe((selectedBank: any) => {
          if (selectedBank) {
            const selectedData = {
              swiftCode: selectedBank.swift,
              branchName: selectedBank.branchName
            };
            subscriber.next(selectedData);
          }
          subscriber.complete();
        });
      };

      // Now use the function
      if (prefix) {
        this.branchInfoService.getBySwiftCodePrefix(prefix).subscribe({
          next: (res: any) => {
            const swiftCodes = res?.payload || [];
            openModal(swiftCodes);
          },
          error: (err: any) => {
            console.error('Error fetching initial SWIFT codes:', err);
            openModal([]);
          }
        });
      } else {
        openModal([]);
      }
    });
  }
}
