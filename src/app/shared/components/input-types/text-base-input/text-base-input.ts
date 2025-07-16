import {Component, input} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-text-base-input',
  imports: [
    FormsModule,
    MatInput,
    ReactiveFormsModule
  ],
  templateUrl: './text-base-input.html',
  standalone: true,
  styleUrl: './text-base-input.scss'
})
export class TextBaseInput {

  readonly frmGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly label = input.required<string>();

  isRequired(): boolean {
    const control = this.frmGroup().get(this.controlName());
    if (!control?.validator) return false;
    const validation = control.validator({} as any);
    return !!validation?.['required'];
  }


}
