import {Component, input, output} from '@angular/core';
import {MatInput} from "@angular/material/input";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-amount-to-word-input',
  imports: [
    MatInput,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './amount-to-word-input.html',
  standalone: true,
  styleUrl: './amount-to-word-input.scss'
})
export class AmountToWordInput {

  readonly frmGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly label = input.required<string>();
  readonly isReadonly = input<boolean>();
  readonly placeholder = input<any>();
  readonly valueChange = output<any>();

  isRequired(): boolean {
    const control = this.frmGroup().get(this.controlName());
    if (!control?.validator) return false;
    const validation = control.validator({} as any);
    return !!validation?.['required'];
  }

  isInvalid(): boolean {
    const control = this.frmGroup().get(this.controlName());
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  hasError(errorCode: string): boolean {
    const control = this.frmGroup().get(this.controlName());
    // console.log(!!control?.hasError(errorCode));
    return !!control?.hasError(errorCode);
  }

  getErrorValue(errorCode: string): any {
    const control = this.frmGroup().get(this.controlName());
    const error = control?.getError(errorCode);
    // For min and max errors, Angular returns an object {min: x, actual: y}
    if (typeof error === 'object' && error !== null) {
      console.log(error[errorCode])
      return error[errorCode];
    }
    return error;
  }


  amountToWord() {
    const value = this.frmGroup().get(this.controlName())?.value;

    if (!value || isNaN(value)) return '';

    const [wholeStr, decimalStr] = value.toString().split('.');

    const wholeNumber = parseInt(wholeStr, 10);
    const decimalNumber = parseInt(decimalStr?.padEnd(2, '0') ?? '0', 10); // max 2 digits

    const words = this.convertNumberToWords(wholeNumber);
    const paisa = decimalNumber > 0 ? ' and ' + this.convertNumberToWords(decimalNumber) + ' Paisa' : '';

    return words + paisa;
  }

  convertNumberToWords(num: number): string {
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];

    if ((num = num || 0) === 0) return 'Zero';

    if (num < 20) return a[num];
    if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? ' ' + a[num % 10] : '');
    if (num < 1000) return a[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + this.convertNumberToWords(num % 100) : '');
    if (num < 100000) return this.convertNumberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + this.convertNumberToWords(num % 1000) : '');
    if (num < 10000000) return this.convertNumberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + this.convertNumberToWords(num % 100000) : '');
    return this.convertNumberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + this.convertNumberToWords(num % 10000000) : '');
  }

  onChangeInput() {
    this.valueChange.emit(10);
  }
}
