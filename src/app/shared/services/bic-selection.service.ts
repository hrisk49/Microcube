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
    targetFields?: BicFieldMapping,
    tableHeaders?: Map<string, string>
  ): Observable<any> {
    const defaultHeaders = new Map<string, string>([
      ['swift', 'SWIFT Code'],
      ['branchName', 'Branch Name'],
      ['address', 'Address']
    ]);

    const prefix = (form.get(sourceFields.bicField)?.value || '').toString().trim();

    if (!prefix) {
      // No user input: open modal with empty data, allow user to use Find button inside modal
      const modalData = {
        pickTableDataSource: [],
        pickTablePair: tableHeaders || defaultHeaders,
        // Additional configurable text properties
        apiSearchPlaceholder: 'SWIFT code search...',
        findButtonText: 'Find',
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
            const swiftCodes = res?.payload || [];
            dialogRef.componentInstance.dataSource = swiftCodes;
            dialogRef.componentInstance.filteredDataSource = [...swiftCodes];
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

      // Handle double click selection already closes via dialogClose(row)
      dialogRef.afterClosed().subscribe((selectedBank: any) => {
        if (selectedBank) {
          const sourceUpdate = {
            [sourceFields.bicField]: selectedBank.swift,
            [sourceFields?.nameField || '']: selectedBank.branchName
          };
          form.patchValue(sourceUpdate);

          if (targetFields) {
            const targetUpdate = {
              [targetFields.bicField]: selectedBank.swift,
              [targetFields?.nameField || '']: selectedBank.branchName
            };
            form.patchValue(targetUpdate);
          }
        }
      });

      return new Observable((subscriber) => {
        subscriber.next(dialogRef);
        subscriber.complete();
      });
    }

    return this.branchInfoService
      .getBySwiftCodePrefix(prefix)
      .pipe(
        map(res => {
          const swiftCodes = res?.payload;
          const modalData = {
            pickTableDataSource: swiftCodes,
            pickTablePair: tableHeaders || defaultHeaders,
            // Additional configurable text properties
            apiSearchPlaceholder: 'Enter SWIFT code prefix to search...',
            findButtonText: 'Find SWIFT Code',
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

          dialogRef.afterClosed().subscribe((selectedBank: any) => {
            if (selectedBank) {
              // Update source fields
              const sourceUpdate = {
                [sourceFields.bicField]: selectedBank.swift,
                [sourceFields?.nameField || '']: selectedBank.branchName
              };
              form.patchValue(sourceUpdate);

              // Update target fields if provided
              if (targetFields) {
                const targetUpdate = {
                  [targetFields.bicField]: selectedBank.swift,
                  [targetFields?.nameField || '']: selectedBank.branchName
                };
                form.patchValue(targetUpdate);
              }
            }
          });

          return dialogRef;
        })
      );
  }
}
