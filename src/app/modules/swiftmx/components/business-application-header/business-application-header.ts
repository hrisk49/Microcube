import {Component, inject, input, signal} from '@angular/core';
import {SelectOptionField} from "../../../../shared/components/input-types/select-option-field/select-option-field";
import {TextBaseInput} from "../../../../shared/components/input-types/text-base-input/text-base-input";
import {FormGroup} from '@angular/forms';
import {BranchInfoService} from '../../../../shared/services/branch-info.service';
import {DataSelectionModal} from '../../../../shared/components/data-selection-modal/data-selection-modal';

type Option = { key: any; value: string };
@Component({
  selector: 'app-business-application-header',
  imports: [
    SelectOptionField,
    TextBaseInput,
    DataSelectionModal
  ],
  templateUrl: './business-application-header.html',
  styleUrl: './business-application-header.scss'
})
export class BusinessApplicationHeader {

  branchInfoService = inject(BranchInfoService);
  readonly frmGroup = input.required<FormGroup>();
  readonly duplicateOptions = input<Option[] | null>(null);
  readonly priorityOptions = input<Option[] | null>(null);

  isPickTableDialogOpen = signal<boolean>(false);
  pickTablePair = signal<Map<string, string>>(new Map());
  pickTableDataSource = signal<any[]>([]);

  onPickclick(): void {
    this.isPickTableDialogOpen.set(true);
    this.pickTableDataSource.set([]);
    this.pickTablePair.set(new Map());

    this.branchInfoService.getBySwiftCodePrefix('MTBLBDDH').subscribe({
      next: data => {
        if (data.status) {
          this.pickTablePair.set(new Map([
            ['branchId', 'Branch Id'],
            ['branchName', 'Branch Name'],
            ['swift', 'Swift']
          ]));
          this.pickTableDataSource.set(data?.payload);
        }

      }, error: err => {
        console.error('Error:', err);
      }
    });
  }

  closeDialog(data: any) {
    this.isPickTableDialogOpen.set(false);
    if (data) {
      this.frmGroup().get('toBic')?.setValue(data?.swift);
    }
  }


}
