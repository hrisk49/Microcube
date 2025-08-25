import { Component, input, output, signal, OnInit, OnChanges, computed } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

interface TextareaAttributes {
  rows: number;
  cols?: number;
  style: string;
}

interface RowLimitExceededEvent {
  currentRows: number;
  maxRows: number;
}

interface ColLimitExceededEvent {
  line: number;
  currentCols: number;
  maxCols: number;
}

@Component({
  selector: 'lds-txt-area',
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './text-area.html',
  styleUrl: './text-area.scss'
})
export class TextArea implements OnInit, OnChanges {
  // Form inputs
  readonly frmGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();

  // Inputs
  readonly id = input<string>('');
  readonly cssClass = input<string>('');
  readonly styles = input<string>('');
  readonly rows = input<number>(3);
  readonly cols = input<number | undefined>(undefined); // New: column width
  readonly placeholder = input<string>('');
  readonly required = input<boolean>(false);
  readonly enable = input<boolean>(true);
  readonly visible = input<boolean>(true);
  readonly maxLen = input<number>(2147483647);
  readonly minLen = input<number>(-2147483648);
  readonly maxRows = input<number | undefined>(undefined); // New: maximum rows allowed
  readonly minRows = input<number | undefined>(undefined); // New: minimum rows required
  readonly maxCols = input<number | undefined>(undefined); // New: maximum columns per line
  readonly minCols = input<number | undefined>(undefined); // New: minimum columns per line
  readonly autoResize = input<boolean>(false); // New: auto-resize textarea
  readonly labelText = input<string>('');
  readonly showCharacterCount = input<boolean>(true);
  readonly showRowCount = input<boolean>(false); // New: show row count
  readonly enforceRowLimits = input<boolean>(true); // New: enforce row limits strictly

  // Outputs
  readonly valueChanged = output<string>();
  readonly onChanged = output<Event>();
  readonly onRowLimitExceeded = output<RowLimitExceededEvent>();
  readonly onColLimitExceeded = output<ColLimitExceededEvent>();

  // Internal state
  isInvalidState = signal(false);
  errorMessage = signal('');
  currentRows = signal(0);
  longestLine = signal(0);

  // Computed signals for reactive styling
  inputClasses = computed(() => {
    const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
    const resizeClasses = this.autoResize() ? 'resize-none' : 'resize-vertical';
    const stateClasses = this.isDisabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white';
    const errorClasses = this.isInvalidState() ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-300' : 'border-gray-300';
    const customClasses = this.cssClass() || '';
    
    return `${baseClasses} ${resizeClasses} ${stateClasses} ${errorClasses} ${customClasses}`;
  });

  // Computed textarea attributes
  textareaAttributes = computed((): TextareaAttributes => {
    const attrs: TextareaAttributes = {
      rows: this.getEffectiveRows(),
      style: this.getEffectiveStyles()
    };

    if (this.cols()) {
      attrs.cols = this.cols();
    }

    return attrs;
  });

  ngOnInit() {
    // Set up value change listener
    const control = this.frmGroup().get(this.controlName());
    if (control) {
      control.valueChanges.subscribe(value => {
        this.analyzeText(value || '');
        this.valueChanged.emit(value || '');
        this.validateInput();
      });
      
      // Handle enable/disable state
      this.updateControlState();
      
      // Initial analysis
      this.analyzeText(control.value || '');
    }
  }

  ngOnChanges() {
    this.validateInput();
    this.updateControlState();
    
    // Re-analyze text when inputs change
    const control = this.frmGroup().get(this.controlName());
    if (control) {
      this.analyzeText(control.value || '');
    }
  }

  private analyzeText(text: string): void {
    const lines: string[] = text.split('\n');
    this.currentRows.set(lines.length);
    
    const longest = lines.reduce((max: number, line: string) => Math.max(max, line.length), 0);
    this.longestLine.set(longest);
  }

  private getEffectiveRows(): number {
    if (this.autoResize()) {
      const currentRowCount = this.currentRows();
      const minRows = this.minRows() || this.rows();
      const maxRows = this.maxRows() || Math.max(currentRowCount, minRows);
      
      return Math.max(minRows, Math.min(currentRowCount, maxRows));
    }
    
    return this.rows();
  }

  private getEffectiveStyles(): string {
    let styles = this.styles() || '';
    
    if (this.maxCols()) {
      // Set max-width based on character width (approximate)
      const charWidth = 8; // approximate character width in pixels
      const maxWidth = this.maxCols()! * charWidth + 24; // +24 for padding
      styles += `; max-width: ${maxWidth}px;`;
    }
    
    return styles;
  }

  updateControlState() {
    const control = this.frmGroup().get(this.controlName());
    if (control) {
      if (this.isDisabled) {
        control.disable();
      } else {
        control.enable();
      }
    }
  }

  isRequired(): boolean {
    const control = this.frmGroup().get(this.controlName());
    if (!control?.validator) return false;
    const validation = control.validator({} as any);
    return !!validation?.['required'];
  }

  isInvalid(): boolean {
    const control = this.frmGroup().get(this.controlName());
    const hasFormErrors = !!(control && control.invalid && (control.touched || control.dirty));
    const hasCustomErrors = this.isInvalidState();
    return hasFormErrors || hasCustomErrors;
  }

  hasError(errorCode: string): boolean {
    const control = this.frmGroup().get(this.controlName());
    return !!control?.hasError(errorCode);
  }

  getErrorValue(errorCode: string): any {
    const control = this.frmGroup().get(this.controlName());
    const error = control?.getError(errorCode);
    if (typeof error === 'object' && error !== null) {
      return error[errorCode];
    }
    return error;
  }

  validateInput() {
    const control = this.frmGroup().get(this.controlName());
    if (!control) return;

    const value: string = control.value || '';
    const lines: string[] = value.split('\n');
    let message = '';

    // Check required validation
    if (this.isRequired() && !value.trim()) {
      message = `${this.labelText() || 'This field'} is required!`;
    }
    // Check minimum length
    else if (this.minLen() > -2147483648 && value.length < this.minLen()) {
      message = `Minimum ${this.minLen()} characters required.`;
    }
    // Check maximum length
    else if (this.maxLen() < 2147483647 && value.length > this.maxLen()) {
      message = `Maximum ${this.maxLen()} characters allowed.`;
    }
    // Check minimum rows
    else if (this.minRows() && lines.length < this.minRows()!) {
      message = `Minimum ${this.minRows()} rows required.`;
    }
    // Check maximum rows
    else if (this.maxRows() && lines.length > this.maxRows()!) {
      message = `Maximum ${this.maxRows()} rows allowed.`;
      if (this.enforceRowLimits()) {
        this.onRowLimitExceeded.emit({
          currentRows: lines.length,
          maxRows: this.maxRows()!
        });
      }
    }
    // Check column limits
    else if (this.maxCols()) {
      const violatingLine = lines.findIndex((line: string) => line.length > this.maxCols()!);
      if (violatingLine !== -1) {
        message = `Line ${violatingLine + 1} exceeds maximum ${this.maxCols()} characters per line.`;
        this.onColLimitExceeded.emit({
          line: violatingLine + 1,
          currentCols: lines[violatingLine].length,
          maxCols: this.maxCols()!
        });
      }
    }
    // Check minimum columns
    else if (this.minCols() && value.trim()) {
      const shortLine = lines.find((line: string) => line.trim() && line.length < this.minCols()!);
      if (shortLine !== undefined) {
        message = `Each line must have at least ${this.minCols()} characters.`;
      }
    }

    // Only show validation errors if the field has been touched or is dirty
    const shouldShowError = control.touched || control.dirty;
    this.isInvalidState.set(!!message && shouldShowError);
    this.errorMessage.set(message);
  }

  onInputChange(event: any) {
    const value = event.target.value;
    
    // Enforce row limits by preventing input
    if (this.enforceRowLimits() && this.maxRows()) {
      const lines = value.split('\n');
      if (lines.length > this.maxRows()!) {
        // Prevent adding new lines beyond limit
        const limitedValue = lines.slice(0, this.maxRows()).join('\n');
        event.target.value = limitedValue;
        
        // Update the form control
        const control = this.frmGroup().get(this.controlName());
        if (control) {
          control.setValue(limitedValue);
        }
        return;
      }
    }

    // Enforce column limits by preventing input
    if (this.maxCols()) {
      const lines: string[] = value.split('\n');
      let modified = false;
      
      const limitedLines = lines.map((line: string) => {
        if (line.length > this.maxCols()!) {
          modified = true;
          return line.substring(0, this.maxCols()!);
        }
        return line;
      });

      if (modified) {
        const limitedValue = limitedLines.join('\n');
        event.target.value = limitedValue;
        
        // Update the form control
        const control = this.frmGroup().get(this.controlName());
        if (control) {
          control.setValue(limitedValue);
        }
        return;
      }
    }

    this.onChanged.emit(event);
  }

  get isDisabled(): boolean {
    return !this.enable();
  }

  get isHidden(): boolean {
    return !this.visible();
  }

  get currentValue(): string {
    const control = this.frmGroup().get(this.controlName());
    return control?.value || '';
  }

  get characterCount(): number {
    return this.currentValue.length;
  }

  get rowCount(): number {
    return this.currentRows();
  }

  get longestLineLength(): number {
    return this.longestLine();
  }

  // Helper methods for template
  getRowCountDisplay(): string {
    const current = this.currentRows();
    const max = this.maxRows();
    const min = this.minRows();
    
    let display = `${current} rows`;
    
    if (max && min) {
      display += ` (${min}-${max})`;
    } else if (max) {
      display += ` / ${max}`;
    } else if (min) {
      display += ` (min: ${min})`;
    }
    
    return display;
  }

  getCharacterCountDisplay(): string {
    const current = this.characterCount;
    const max = this.maxLen();
    
    if (max < 2147483647) {
      return `${current} / ${max}`;
    }
    
    return `${current}`;
  }

  // Method to manually trigger resize (for auto-resize)
  triggerResize(): void {
    if (this.autoResize()) {
      const control = this.frmGroup().get(this.controlName());
      if (control) {
        this.analyzeText(control.value || '');
      }
    }
  }
}