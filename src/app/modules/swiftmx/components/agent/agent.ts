import { Component, input, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextBaseInput } from '../../../../shared/components/input-types/text-base-input/text-base-input';
import { SubPanelHeader } from '../../../../shared/components/sub-panel-header/sub-panel-header';
import { DataSelectionModal } from '../../../../shared/components/data-selection-modal/data-selection-modal';
import {
  DataSelectionConfig,
  DataSelectionItem,
  DataSelectionResult,
} from '../../../../shared/models/data-selection.interface';
import { BranchInfoService } from '../../../../shared/services/branch-info.service';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule, TextBaseInput, SubPanelHeader, DataSelectionModal],
  templateUrl: './agent.html',
  styleUrl: './agent.scss',
})
export class AgentComponent {
  readonly frmGroup = input.required<FormGroup>();
  readonly prefix = input<string>(''); // For different agent types like 'InstgAgt', 'InstdAgt', etc.
  readonly title = input<string>('Agent Details');
  readonly isOptional = input<boolean>(false);
  isModalOpen = signal<boolean>(false);
  modalConfig = signal<DataSelectionConfig | null>(null);
  selectedData = signal<DataSelectionItem | null>(null);

  constructor(private branchInfoService: BranchInfoService) {}
  get controlPrefix(): string {
    return this.prefix() ? `${this.prefix()}` : '';
  }

  // Debug method to check if a control exists
  controlExists(controlName: string): boolean {
    const fullControlName = this.controlPrefix + controlName;
    const control = this.frmGroup().get(fullControlName);
    if (!control) {
    }
    return !!control;
  }

  // Method to get all required control names for this agent
  getRequiredControlNames(): string[] {
    return [
      'Bic',
      'ClrSysIdCd',
      'MmbId',
      'Lei',
      'Nm',
      'AdrLine1',
      'AdrLine2',
      'AdrLine3',
      'AdrDept',
      'AdrSubDept',
      'AdrStrtNm',
      'AdrBldgNb',
      'AdrBldgNm',
      'AdrFlr',
      'AdrPstBx',
      'AdrRoom',
      'AdrPstCd',
      'AdrTwnNm',
      'AdrTwnLctnNm',
      'AdrDstrctNm',
      'AdrCtrySubDvsn',
      'AdrCtry',
      'AdrAdrLine1',
      'AdrAdrLine2',
      'AdrAdrLine3',
    ];
  }

  // Method to validate all controls exist
  validateControls(): void {
    const missingControls = this.getRequiredControlNames().filter(
      (controlName) => !this.controlExists(controlName)
    );

    if (missingControls.length > 0) {
      console.error(
        `Missing controls for prefix '${this.controlPrefix}':`,
        missingControls
      );
      console.log('Form group structure:', this.frmGroup().value);
    }
  }

  onBizMsgIdrDblClick(): void {
    this.isModalOpen.set(true);
    this.showAgentModal();
    console.log('BizMsgIdr double clicked');
  }

  showAgentModal() {
    this.modalConfig.set({
      title: 'Select Agent',
      service: this.branchInfoService,
      serviceMethod: 'getBySwiftCodePrefix',
      serviceParams: { 
        swiftCode: 'MTBLBDDH',
      },
      columns: [
        {
          field: 'branchId',
          header: 'Branch ID',
          width: '200px',
          sortable: true,
          filterable: true,
        },
        {
          field: 'branchName',
          header: 'Branch Name',
          width: '250px',
          sortable: true,
          filterable: true,
        },
        {
          field: 'swift',
          header: 'Swift Code',
          width: '100px',
          sortable: true,
          filterable: true,
        },
        {
          field: 'address',
          header: 'Address',
          width: '100px',
          sortable: true,
          filterable: true,
        },
      ],
      pageSize: 10,
      enablePagination: true,
      enableSorting: true,
      enableFiltering: true,
      enableSelection: true,
      enableSearch: true,
      searchPlaceholder: 'Search agents...',
      noDataMessage: 'No agents found',
      loadingMessage: 'Loading agents...',
      errorMessage: 'Error loading agents',
      showSelectIcon: true,
      selectIconText: 'Select this agent',
      showCloseButton: true,
      closeButtonText: 'Close'
    });
    this.isModalOpen.set(true);
  }

  onDataSelected(result: DataSelectionResult) {
    console.log('Selection result:', result);

    if (result.action === 'select' || result.action === 'insert') {
      this.selectedData.set(result.selectedItem || null);

      // Update form with selected agent data
      if (result.selectedItem) {
        console.log('Selected agent:', result.selectedItem);
        
        // Update form fields based on selected agent
        const selectedAgent = result.selectedItem;
        this.frmGroup().patchValue({
          [this.controlPrefix + 'Bic']: selectedAgent['swift'] || '',
          [this.controlPrefix + 'Nm']: selectedAgent['branchName'] || '',
          // Add more field mappings as needed
        });
      }
    }

    this.closeModal();
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}
