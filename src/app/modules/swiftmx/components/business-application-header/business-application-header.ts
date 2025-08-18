import {Component, inject, input, signal, WritableSignal} from '@angular/core';
import {SelectOptionField} from "../../../../shared/components/input-types/select-option-field/select-option-field";
import {TextBaseInput} from "../../../../shared/components/input-types/text-base-input/text-base-input";
import {FormGroup} from '@angular/forms';
import {BranchInfoService} from '../../../../shared/services/branch-info.service';
import {DataSelectionModal} from '../../../../shared/components/data-selection-modal/data-selection-modal';
import {DateInput} from '../../../../shared/components/input-types/date-input/date-input';
import {DialogUtils} from '../../../../shared/service/dialog-utils';
import {
  ExpansionSubPanelHeader
} from '../../../../shared/components/expansion-sub-panel-header/expansion-sub-panel-header';

type Option = { key: any; value: string };

@Component({
  selector: 'app-business-application-header',
  imports: [
    SelectOptionField,
    TextBaseInput,
    DateInput,
    ExpansionSubPanelHeader
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
// expanson panel header
  frmBicPnl : WritableSignal<boolean> = signal(true);
  toBicPnl : WritableSignal<boolean> = signal(true);


  onPickClick(): void {

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
