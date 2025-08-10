import { Component, input, output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'lds-btn',
  imports: [
    NgClass
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
    const baseClasses = 'px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    const stateClasses = this.isDisabled 
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60' 
      : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800';
    const customClasses = this.cssClass() || '';
    
    return `${baseClasses} ${stateClasses} ${customClasses}`;
  }

  onButtonClick(event: MouseEvent) {
    if (!this.isDisabled) {
      this.onClick.emit(event);
      this.valueChanged.emit(this.value());
    }
  }
} 