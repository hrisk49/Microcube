import {Component, input, signal} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TextBaseInput} from '../../../../shared/components/input-types/text-base-input/text-base-input';
import {SubPanelHeader} from '../../../../shared/components/sub-panel-header/sub-panel-header';
import {DataSelectionModal} from '../../../../shared/components/data-selection-modal/data-selection-modal';
import {BranchInfoService} from '../../../../shared/services/branch-info.service';

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

  constructor(
    private branchInfoService: BranchInfoService
  ) {
  }

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
}
