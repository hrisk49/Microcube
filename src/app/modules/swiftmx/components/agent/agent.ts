import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextBaseInput } from '../../../../shared/components/input-types/text-base-input/text-base-input';
import { SubPanelHeader } from '../../../../shared/components/sub-panel-header/sub-panel-header';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule, TextBaseInput, SubPanelHeader],
  templateUrl: './agent.html',
  styleUrl: './agent.scss'
})
export class AgentComponent {
  readonly frmGroup = input.required<FormGroup>();
  readonly prefix = input<string>(''); // For different agent types like 'InstgAgt', 'InstdAgt', etc.
  readonly title = input<string>('Agent Details');
  readonly isOptional = input<boolean>(false);

  get controlPrefix(): string {
    return this.prefix() ? `${this.prefix()}` : '';
  }

  // Debug method to check if a control exists
  controlExists(controlName: string): boolean {
    const fullControlName = this.controlPrefix + controlName;
    const control = this.frmGroup().get(fullControlName);
    if (!control) {
      console.warn(`Control not found: ${fullControlName}`);
      console.log('Available controls:', Object.keys(this.frmGroup().controls));
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
      'AdrAdrLine3'
    ];
  }

  // Method to validate all controls exist
  validateControls(): void {
    const missingControls = this.getRequiredControlNames().filter(controlName => 
      !this.controlExists(controlName)
    );
    
    if (missingControls.length > 0) {
      console.error(`Missing controls for prefix '${this.controlPrefix}':`, missingControls);
      console.log('Form group structure:', this.frmGroup().value);
    }
  }
} 