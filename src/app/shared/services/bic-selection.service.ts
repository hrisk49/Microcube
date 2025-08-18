import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { BranchInfoService } from './branch-info.service';
import { DataSelectionModal } from '../components/data-selection-modal/data-selection-modal';
import { DialogUtils } from '../service/dialog-utils';
  // Define interface for field mapping
  interface BicFieldMapping {
    bicField: string;
    nameField: string;
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

    return this.branchInfoService
      .getBySwiftCodePrefix(
        form.get(sourceFields.bicField)?.value
          ? form.get(sourceFields.bicField)?.value.trim()
          : sourceFields.defaultValue || ''
      )
      .pipe(
        map(res => {
          const swiftCodes = res?.payload;
          const dialogRef = this.dialogUtils.openDialog(
            DataSelectionModal,
            tableHeaders || defaultHeaders,
            swiftCodes
          );

          dialogRef.afterClosed().subscribe((selectedBank: any) => {
            if (selectedBank) {
              // Update source fields
              const sourceUpdate = {
                [sourceFields.bicField]: selectedBank.swift,
                [sourceFields.nameField]: selectedBank.branchName
              };
              form.patchValue(sourceUpdate);

              // Update target fields if provided
              if (targetFields) {
                const targetUpdate = {
                  [targetFields.bicField]: selectedBank.swift,
                  [targetFields.nameField]: selectedBank.branchName
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