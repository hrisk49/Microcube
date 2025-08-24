import { Component, input, output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lds-btn',
  imports: [
    NgClass,
    MatIconModule
  ],
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class Button {
  // Inputs
  readonly id = input<string>('');
  readonly value = input<string>('');
  readonly cssClass = input<string>('');
  readonly styles = input<string>('');
  readonly enable = input<boolean>(true);
  readonly visible = input<boolean>(true);
  readonly labelText = input<string>('');
  readonly icon = input<string>('');

  // Outputs
  readonly valueChanged = output<string>();
  readonly onClick = output<MouseEvent>();

  get isDisabled(): boolean {
    return !this.enable();
  }

  get isHidden(): boolean {
    return !this.visible();
  }

  get buttonClasses(): string {
    const baseClasses = 'py-3 px-4 text-sm font-medium cursor-pointer outline-none focus:outline-none rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[32px] h-8';
    const stateClasses = this.isDisabled 
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60' 
      : 'bg-blue-600 text-white hover:bg-blue-700';
    const customClasses = this.cssClass() || '';
    
    // If custom classes are provided, use them completely; otherwise use default state classes
    if (customClasses) {
      return `${baseClasses} ${customClasses}`;
    } else {
      return `${baseClasses} ${stateClasses}`;
    }
  }

  onButtonClick(event: MouseEvent) {
    if (!this.isDisabled) {
      this.onClick.emit(event);
      this.valueChanged.emit(this.value());
    }
  }
} 