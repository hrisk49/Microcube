// select-option-field.component.ts
import {Component, input, signal, effect, ElementRef, ViewChild} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';

type Option = { key: any; value: string };

@Component({
  selector: 'app-select-option-field',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './select-option-field.html',
  standalone: true,
  styleUrls: ['./select-option-field.scss']
})
export class SelectOptionField {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  readonly frmGroup = input.required<FormGroup>();
  readonly controlName = input.required<string>();
  readonly label = input.required<string>();
  readonly isReadonly = input<boolean>();
  readonly options = input<Option[] | null>(null);

  // Component state
  searchTerm = signal('');
  isOpen = signal(false);
  highlightedIndex = signal(-1);
  selectedValue = signal<any>('');
  filteredOptions = signal<Option[]>([]);

  constructor() {
    // Update filtered options when search term or options change
    effect(() => {
      const opts = this.options() || [];
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
      this.highlightedIndex.set(-1);
    });

    // Sync with form control value
    effect(() => {
      const control = this.frmGroup().get(this.controlName());
      if (control) {
        this.selectedValue.set(control.value || '');
        
        // Update search input with selected option text
        if (control.value) {
          const selectedOption = this.options()?.find(opt => opt.key === control.value);
          if (selectedOption) {
            this.searchTerm.set(selectedOption.value);
          }
        } else {
          this.searchTerm.set('');
        }
      }
    });
  }

  isRequired(): boolean {
    const control = this.frmGroup().get(this.controlName());
    if (!control?.validator) return false;
    const validation = control.validator({} as any);
    return !!validation?.['required'];
  }

  onSearchInput(event: Event): void {
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

  onInputBlur(): void {
    // Delay closing to allow option clicks
    setTimeout(() => {
      this.closeDropdown();
      
      // Reset search term to selected option if no selection was made
      const control = this.frmGroup().get(this.controlName());
      if (control?.value) {
        const selectedOption = this.options()?.find(opt => opt.key === control.value);
        if (selectedOption) {
          this.searchTerm.set(selectedOption.value);
        }
      } else {
        this.searchTerm.set('');
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
        if (this.isOpen() && this.highlightedIndex() >= 0) {
          const option = filteredOpts[this.highlightedIndex()];
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
      this.searchInput.nativeElement.focus();
    }
  }

  selectOption(option: Option): void {
    const control = this.frmGroup().get(this.controlName());
    if (control) {
      control.setValue(option.key);
      control.markAsTouched();
    }
    
    this.searchTerm.set(option.value);
    this.closeDropdown();
  }
}