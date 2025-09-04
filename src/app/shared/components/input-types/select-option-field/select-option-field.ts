// select-option-field.component.ts
import {Component, input, signal, effect, ElementRef, ViewChild, output, AfterViewInit, OnInit} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import {startWith} from 'rxjs';

type Option = { key: any; value: string };

@Component({
  selector: 'app-select-option-field',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    NgClass
  ],
  templateUrl: './select-option-field.html',
  standalone: true,
  styleUrls: ['./select-option-field.scss']
})
export class SelectOptionField implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  readonly frmGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly label = input.required<string>();
  readonly isReadonly = input<boolean>();
  readonly options = input<Option[] | null>(null);
  readonly isVertical = input<boolean>(false);
  readonly searchable = input<boolean>(true); // NEW: Toggle searchability
  readonly tooltip = input<string>();
  readonly tooltipPosition = input<'above' | 'below' | 'left' | 'right'>('above');
  readonly tooltipDelay = input<number>(500);
  readonly tooltipClass = input<string>('custom-tooltip');

  // Output event for when an option is selected
  readonly onSelect = output<{
    selectedOption: Option;
    selectedKey: any;
    selectedValue: string;
    formControl: any;
  }>();

  // Component state
  searchTerm = signal('');
  isOpen = signal(false);
  highlightedIndex = signal(-1);
  selectedValue = signal<any>('');
  filteredOptions = signal<Option[]>([]);
  displayText = signal<string>(''); // NEW: For display in non-searchable mode

  private _lastControlValue: any = '';
  private _lastOptionsRef: Option[] | null = null;

  constructor() {
    // Update filtered options when search term or options change
    effect(() => {
      const opts = this.options() || [];
      const optionsChanged = this._lastOptionsRef !== opts; // <-- NEW
      this._lastOptionsRef = opts;

      if (!this.searchable()) {
        // Non-searchable mode: show all options
        this.filteredOptions.set(opts);
      } else {
        // Searchable mode: filter by search term
        const term = this.searchTerm().toLowerCase();
        if (!term) {
          this.filteredOptions.set(opts);
        } else {
          this.filteredOptions.set(
            opts.filter(option =>
              option.value.toLowerCase().includes(term)
            )
          );
        }
      }
      this.highlightedIndex.set(-1);

      if (optionsChanged) {
        this._syncDisplayFromValue(this._lastControlValue);
      }
    });

    // Sync with form control value
    // effect(() => {
    //   const control = this.frmGroup().get(this.controlName());
    //   if (control) {
    //     this.selectedValue.set(control.value || '');
    //     // Update display based on mode
    //     if (control.value) {
    //       const selectedOption = this.options()?.find(opt => opt.key === control.value);
    //       if (selectedOption) {
    //         this.displayText.set(selectedOption.value);
    //         if (this.searchable()) {
    //           this.searchTerm.set(selectedOption.value);
    //         }
    //       }
    //     } else {
    //       this.displayText.set('');
    //       if (this.searchable()) {
    //         this.searchTerm.set('');
    //       }
    //     }
    //   }
    // });
  }

  ngOnInit(): void {
    const control = this.frmGroup().get(this.controlName());
    if (!control) return;

    control.valueChanges
      .pipe(startWith(control.value))
      .subscribe(val => {
        this._lastControlValue = val ?? '';
        this.selectedValue.set(this._lastControlValue);
        // display/searchTerm আপডেট
        this._syncDisplayFromValue(this._lastControlValue);
      });
  }

  private _syncDisplayFromValue(val: any) {
    const opts = this.options() || [];
    const selected = opts.find(o => o.key === val);
    if (selected) {
      this.displayText.set(selected.value);
      if (this.searchable()) this.searchTerm.set(selected.value);
    } else {
      this.displayText.set('');
      if (this.searchable()) this.searchTerm.set('');
    }
  }

  compareFN(item1:any ,item2 :any):boolean{
    return item1 && item2 ? item1.key === item2.key : item1 === item2;
  }

  isRequired(): boolean {
    const control = this.frmGroup().get(this.controlName());
    if (!control?.validator) return false;
    const validation = control.validator({} as any);
    return !!validation?.['required'];
  }

  onSearchInput(event: Event): void {
    if (!this.searchable()) return; // Skip if not searchable

    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    if (!this.isOpen()) {
      this.openDropdown();
    }

    // Clear selection if search doesn't match current selection
    const currentControl = this.frmGroup().get(this.controlName());
    if (currentControl && currentControl.value) {
      const selectedOption = this.options()?.find(opt => opt.key === currentControl.value);
      if (selectedOption && selectedOption.value !== input.value) {
        currentControl.setValue('');
      }
    }
  }

  onInputClick(): void {
    if (!this.searchable()) {
      // In non-searchable mode, clicking input opens dropdown
      this.toggleDropdown();
    }
  }

  onInputBlur(): void {
    // Delay closing to allow option clicks
    setTimeout(() => {
      this.closeDropdown();
      // Reset based on mode
      if (this.searchable()) {
        const control = this.frmGroup().get(this.controlName());
        if (control?.value) {
          const selectedOption = this.options()?.find(opt => opt.key === control.value);
          if (selectedOption) {
            this.searchTerm.set(selectedOption.value);
          }
        } else {
          this.searchTerm.set('');
        }
      }
    }, 200);
  }

  onKeyDown(event: KeyboardEvent): void {
    const filteredOpts = this.filteredOptions();
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.openDropdown();
        } else {
          const nextIndex = this.highlightedIndex() < filteredOpts.length - 1
            ? this.highlightedIndex() + 1
            : 0;
          this.highlightedIndex.set(nextIndex);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen()) {
          const prevIndex = this.highlightedIndex() > 0
            ? this.highlightedIndex() - 1
            : filteredOpts.length - 1;
          this.highlightedIndex.set(prevIndex);
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (this.isOpen()) {
          const indexToSelect = this.highlightedIndex() >= 0 ? this.highlightedIndex() : 0;
          const option = filteredOpts[indexToSelect];
          if (option) {
            this.selectOption(option);
          }
        }
        break;

      case 'Escape':
        this.closeDropdown();
        this.searchInput.nativeElement.blur();
        break;
    }
  }

  openDropdown(): void {
    if (!this.isReadonly()) {
      this.isOpen.set(true);
    }
  }

  closeDropdown(): void {
    this.isOpen.set(false);
    this.highlightedIndex.set(-1);
  }

  toggleDropdown(): void {
    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
      if (this.searchable()) {
        this.searchInput.nativeElement.focus();
      }
    }
  }

  selectOption(option: Option): void {
    const control = this.frmGroup().get(this.controlName());
    if (control) {
      control.setValue(option.key);
      control.markAsTouched();
    }

    this.displayText.set(option.value);
    if (this.searchable()) {
      this.searchTerm.set(option.value);
    }
    this.closeDropdown();

    // Emit the onSelect event with comprehensive data
    this.onSelect.emit({
      selectedOption: option,
      selectedKey: option.key,
      selectedValue: option.value,
      formControl: control
    });
  }
}
