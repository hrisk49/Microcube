import {Component, input, output, OnInit, signal} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'lds-office-box',
  imports: [
    FormsModule,
    MatInput,
    ReactiveFormsModule,
    NgClass,
    NgIf
  ],
  templateUrl: './office-box.html',
  standalone: true,
  styleUrl: './office-box.scss'
})
export class OfficeBoxComponent implements OnInit {

  // Required inputs
  readonly frmGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly labelText = input.required<string>();

  // Optional inputs
  readonly id = input<string>('');
  readonly placeholder = input<any>('Enter Office Code');
  readonly enable = input<boolean>(true);
  readonly visible = input<boolean>(true);
  readonly tooltip = input<string>('');
  readonly errorMessage = input<string>('Invalid Office Code');
  readonly isReadonly = input<boolean>(false);
  // Outputs
  readonly valueChanged = output<number>();
  readonly onChanged = output<{ officeCode: string; officeName: string }>();

  // Internal state
  readonly officeName = signal('');

  ngOnInit() {
    const control = this.frmGroup().get(this.controlName());
    if (control) {
      control.valueChanges.subscribe(value => {
        this.onOfficeCodeChange(value || '');
      });
    }
  }

  isRequired(): boolean {
    const control = this.frmGroup().get(this.controlName());
    if (!control?.validator) return false;
    const validation = control.validator({} as any);
    return !!validation?.['required'];
  }

onOfficeCodeChange(newCode: string): void {
  const officeName = this.lookupOfficeName(newCode); // Use the lookup logic
  this.officeName.set(officeName);
  this.valueChanged.emit(Number(newCode));
  this.onChanged.emit({ officeCode: newCode, officeName });
}

 // Simulate backend lookup for office name
private lookupOfficeName(code: string): string {
  const officeLookup: { [key: string]: string } = {
    '1001': 'Head Office',
    '1002': 'Dhaka Corporate Office',
    '1003': 'Chittagong Branch',
    '1004': 'Sylhet Branch',
  };
  return officeLookup[code] || '';
}
}