import {Component, inject, input, signal} from '@angular/core';
import {SelectOptionField} from "../../../../shared/components/input-types/select-option-field/select-option-field";
import {TextBaseInput} from "../../../../shared/components/input-types/text-base-input/text-base-input";
import {FormGroup} from '@angular/forms';
import {BranchInfoService} from '../../../../shared/services/branch-info.service';
import {DataSelectionModal} from '../../../../shared/components/data-selection-modal/data-selection-modal';
import {DateInput} from '../../../../shared/components/input-types/date-input/date-input';
import {DialogUtils} from '../../../../shared/service/dialog-utils';

type Option = { key: any; value: string };

@Component({
  selector: 'app-business-application-header',
  imports: [
    SelectOptionField,
    TextBaseInput,
    DateInput
  ],
  templateUrl: './business-application-header.html',
  styleUrl: './business-application-header.scss'
})
export class BusinessApplicationHeader {

  dialog = inject(DialogUtils);
  branchInfoService = inject(BranchInfoService);
  readonly frmGroup = input.required<FormGroup>();
  readonly duplicateOptions = input<Option[] | null>(null);
  readonly priorityOptions = input<Option[] | null>(null);

  isPickTableDialogOpen = signal<boolean>(false);
  // pickTablePair: Map<string, string> = new Map<string, string>;
  // pickTableDataSource: any[] = [];

  onPickClick(): void {
    // this.pickTableDataSource = []
    // this.pickTablePair = new Map<string, string>;

    this.branchInfoService.getBySwiftCodePrefix('MTBLBDDH').subscribe({
      next: response => {
        if (response.status) {
          let pickTablePair = new Map<string, string>([
            ['branchId', 'Branch Id'],
            ['branchName', 'Branch Name'],
            ['swift', 'Swift']
          ]);
          let pickTableDataSource = response?.payload;
          const dialogRef = this.dialog.openDialog(DataSelectionModal, pickTablePair, pickTableDataSource);
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.frmGroup().get('toBic')?.setValue(result?.swift);
            }
          });
        }

      }, error: err => {
        console.error('Error:', err);
      }
    });
  }


}
