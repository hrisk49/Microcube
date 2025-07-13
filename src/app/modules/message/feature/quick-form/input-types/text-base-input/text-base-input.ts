import {Component, Input} from '@angular/core';
import {FormControlName, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-text-base-input',
    imports: [
        FormsModule,
        MatInput,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './text-base-input.html',
  styleUrl: './text-base-input.scss'
})
export class TextBaseInput {

  @Input() frmGroup!: FormGroup;

  @Input() controlName!: string;

}
