import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface WarningModalConfig {
  title?: string;
  message?: string;
  showCloseButton?: boolean;
  showBackdrop?: boolean;
  customClass?: string;
  buttons?: WarningModalButton[];
}

export interface WarningModalButton {
  text: string;
  action?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-alert-warning',
  imports: [CommonModule],
  templateUrl: './alert-warning.html'
})
export class AlertWarningComponent {
  @Input() isOpen: boolean = false;
  @Input() config: WarningModalConfig = {};
  @Input() title: string = 'Warning!';
  @Input() message: string = '';
  @Input() showCloseButton: boolean = true;
  @Input() showBackdrop: boolean = true;
  @Input() customClass: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() buttonClick = new EventEmitter<{ action: string; button: WarningModalButton }>();

  get titleText(): string {
    return this.config.title || this.title;
  }

  get messageText(): string {
    return this.config.message || this.message;
  }

  get showClose(): boolean {
    return this.config.showCloseButton !== undefined ? this.config.showCloseButton : this.showCloseButton;
  }

  get showBackdropValue(): boolean {
    return this.config.showBackdrop !== undefined ? this.config.showBackdrop : this.showBackdrop;
  }

  get buttons(): WarningModalButton[] {
    return this.config.buttons || this.getDefaultButtons();
  }

  getButtonClasses(button: WarningModalButton, index: number): string {
    // Primary button (first button) - yellow for warning (like Delete button)
    if (index === 0) {
      return 'border-transparent text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
    }
    
    // Secondary button (second button) - gray border (like Cancel button)
    return 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500';
  }

  private getDefaultButtons(): WarningModalButton[] {
    return [
      { text: 'OK', action: 'ok' }
    ];
  }

  onClose(): void {
    this.close.emit();
  }

  onButtonClick(button: WarningModalButton): void {
    if (!button.disabled) {
      this.buttonClick.emit({ action: button.action || 'click', button });
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget && this.showBackdropValue) {
      this.onClose();
    }
  }
} 