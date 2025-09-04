import {ChangeDetectionStrategy, Component, input, signal, effect, ElementRef, ViewChild, ChangeDetectorRef} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatInput, MatSuffix} from '@angular/material/input';
import {NgClass} from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {CustomDateAdapter} from '../../../adapter/custom-date.adapter';
import {AppDateFormatsConstant} from '../../../constant/app-date-formats.constant';

@Component({
  selector: 'app-date-input',
  imports: [
    FormsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatInput,
    ReactiveFormsModule,
    MatSuffix,
    NgClass
  ],
  template: `
    <div [formGroup]="frmGroup()" [ngClass]="isVertical() ? 'input-container-vertical': 'input-container-horizontal'">
      <label class="input-label">
        {{ label() }}
        @if (isRequired()) {
          <span class="text-red-500">*</span>
        }
      </label>

      <div class="relative">
        <!-- Hidden input for MatDatepicker -->
        <input
          matInput
          [matDatepicker]="dobPicker"
          [formControlName]="controlName()"
          style="position: absolute; left: -9999px; opacity: 0;"
          readonly
        />
        
        <!-- Visible masked input -->
        <input
          #dateInput
          [ngClass]="{'readonly-input': isReadonly() }"
          matInput
          [readonly]="isReadonly()"
          [value]="displayValue()"
          (keypress)="onKeyPress($event)"
          (keydown)="onKeyDown($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          class="custom-input"
          maxlength="10"
          style="letter-spacing: 1px;"
        />
        <mat-datepicker-toggle
          [disabled]="isReadonly()"
          matSuffix
          [for]="dobPicker"
          (click)="openDatePicker()"
          class="absolute top-1/2 right-2 -translate-y-1/2"
        ></mat-datepicker-toggle>
        <mat-datepicker 
          #dobPicker 
          (closed)="onDatePickerClosed()"
          (dateChange)="onDateSelected($event)"
        ></mat-datepicker>
      </div>
      
      @if (frmGroup().get(controlName())?.invalid && (frmGroup().get(controlName())?.touched || frmGroup().get(controlName())?.dirty)) {
        <div class="text-red-500 text-xs mt-1">
          @if (hasValidationError('required')) {
            {{ label() }} is required..!
          }
          @if (hasValidationError('invalidDate')) {
            Please enter a valid date
          }
          @if (hasValidationError('invalidMonth')) {
            Month must be between 01 and 12
          }
          @if (hasValidationError('invalidDay')) {
            Day must be between 01 and 31
          }
        
        </div>
      }
    </div>
  `,
  standalone: true,
  styleUrl: './date-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: AppDateFormatsConstant}
  ],
})
export class DateInput {
  @ViewChild('dateInput') dateInputRef!: ElementRef<HTMLInputElement>;

  readonly frmGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly label = input.required<string>();
  readonly isReadonly = input<boolean>(false);
  readonly placeholder = input<any>();
  readonly isVertical = input<boolean>(false);

  // Signals for reactive state
  private userInput = signal<string>('');
  readonly displayValue = signal<string>('DD/MM/YYYY');

  constructor(private cdr: ChangeDetectorRef) {
    // Update display when user input changes
    effect(() => {
      this.updateDisplayValue();
    });

    // Listen to form control changes (including datepicker selection)
    effect(() => {
      const control = this.frmGroup().get(this.controlName());
      if (control?.value) {
        const date = new Date(control.value);
        if (!isNaN(date.getTime())) {
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear().toString();
          const newInput = day + month + year;
          
          // Only update if different to avoid infinite loops
          if (this.userInput() !== newInput) {
            this.userInput.set(newInput);
          }
        }
      } else if (control?.value === null || control?.value === '') {
        // Clear input when form control is cleared
        if (this.userInput() !== '') {
          this.userInput.set('');
        }
      }
    });
  }

  onKeyPress(event: KeyboardEvent): void {
    const key = event.key;
    
    // Allow numbers and dots
    if (!/[0-9.]/.test(key)) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    let input = this.userInput();

    // Handle dot - move to next section
    if (key === '.') {
      if (input.length < 2) {
        // Pad day to 2 digits
        input = input.padStart(2, '0');
      } else if (input.length < 4) {
        // Pad month to 4 digits
        input = input.padEnd(4, '0');
      }
      this.userInput.set(input);
      return;
    }

    // Handle number input
    if (input.length < 8) {
      const newInput = input + key;
      
      // Validate as we type
      if (this.isValidInput(newInput)) {
        this.userInput.set(newInput);
        this.updateFormControl();
      }
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      event.preventDefault();
      const input = this.userInput();
      if (input.length > 0) {
        this.userInput.set(input.slice(0, -1));
        this.updateFormControl();
      }
    }
  }

  onFocus(): void {
    // Set cursor position based on current input
    setTimeout(() => {
      const input = this.userInput();
      let cursorPos = input.length;
      
      // Adjust cursor position for slashes
      if (cursorPos >= 2) cursorPos++;
      if (cursorPos >= 5) cursorPos++;
      
      cursorPos = Math.min(cursorPos, 10);
      this.dateInputRef.nativeElement.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  }

  onBlur(): void {
    const control = this.frmGroup().get(this.controlName());
    control?.markAsTouched();
  }

  onDateSelected(event: any): void {
    if (event.value) {
      const date = new Date(event.value);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      
      // Update user input and display immediately
      this.userInput.set(day + month + year);
      
      // Manually trigger display update to ensure it happens
      setTimeout(() => {
        this.updateDisplayValue();
        this.cdr.markForCheck();
      }, 0);
      
      // Clear any existing errors
      const control = this.frmGroup().get(this.controlName());
      control?.setErrors(null);
    }
  }

  onDatePickerClosed(): void {
    // Re-focus masked input after picker closes
    setTimeout(() => {
      this.dateInputRef?.nativeElement.focus();
    }, 100);
  }

  openDatePicker(): void {
    // Programmatically open the datepicker
    const hiddenInput = this.dateInputRef.nativeElement.parentElement?.querySelector('input[matDatepicker]') as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.click();
    }
  }

  private updateDisplayValue(): void {
    const input = this.userInput();
    const template = 'DD/MM/YYYY';
    let result = '';
    let inputIndex = 0;

    for (let i = 0; i < template.length; i++) {
      const char = template[i];
      if (char === '/') {
        result += char;
      } else if (inputIndex < input.length) {
        result += input[inputIndex];
        inputIndex++;
      } else {
        result += char;
      }
    }

    this.displayValue.set(result);
  }

  private updateFormControl(): void {
    const input = this.userInput();
    const control = this.frmGroup().get(this.controlName());
    
    if (input.length === 8) {
      const day = input.substring(0, 2);
      const month = input.substring(2, 4);
      const year = input.substring(4, 8);
      const dateString = `${day}/${month}/${year}`;
      
      // Validate the complete date
      const date = this.parseDate(dateString);
      if (date && this.isValidDate(date, parseInt(day), parseInt(month), parseInt(year))) {
        control?.setValue(date);
        control?.setErrors(null);
      } else {
        control?.setValue(null);
        control?.setErrors({ invalidDate: true });
      }
    } else {
      control?.setValue(null);
      if (input.length > 0) {
        control?.setErrors({ incompleteDate: true });
      } else {
        control?.setErrors(null);
      }
    }
  }

  private isValidInput(input: string): boolean {
    // Validate day (first 2 digits)
    if (input.length >= 1) {
      const firstDigit = parseInt(input[0]);
      if (firstDigit > 3) return false;
    }
    
    if (input.length >= 2) {
      const day = parseInt(input.substring(0, 2));
      if (day > 31 || day < 1) return false;
    }

    // Validate month (digits 3-4)
    if (input.length >= 3) {
      const monthFirstDigit = parseInt(input[2]);
      if (monthFirstDigit > 1) return false;
    }
    
    if (input.length >= 4) {
      const month = parseInt(input.substring(2, 4));
      if (month > 12 || month < 1) return false;
    }

    return true;
  }

  private parseDate(dateStr: string): Date | null {
    if (!dateStr || dateStr.length !== 10) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    return new Date(year, month - 1, day);
  }

  private isValidDate(date: Date, day: number, month: number, year: number): boolean {
    // Check if the date is valid and matches input
    return date.getDate() === day && 
           date.getMonth() === month - 1 && 
           date.getFullYear() === year &&
           year >= 1900 && 
           year <= 2100;
  }

  isRequired(): boolean {
    const control = this.frmGroup().get(this.controlName());
    if (!control?.validator) return false;
    const validation = control.validator({} as any);
    return !!validation?.['required'];
  }

  hasValidationError(errorType: string): boolean {
    const control = this.frmGroup().get(this.controlName());
    return !!(control?.errors?.[errorType] && (control?.touched || control?.dirty));
  }
}