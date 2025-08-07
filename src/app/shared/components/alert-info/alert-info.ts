import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface InfoModalConfig {
  title?: string;
  message?: string;
  showCloseButton?: boolean;
  showBackdrop?: boolean;
  customClass?: string;
  buttons?: InfoModalButton[];
}

export interface InfoModalButton {
  text: string;
  action?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-alert-info',
  imports: [CommonModule],
  templateUrl: './alert-info.html'
})
export class AlertInfoComponent {
  @Input() isOpen: boolean = false;
  @Input() config: InfoModalConfig = {};
  @Input() title: string = 'Information';
  @Input() message: string = '';
  @Input() showCloseButton: boolean = true;
  @Input() showBackdrop: boolean = true;
  @Input() customClass: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() buttonClick = new EventEmitter<{ action: string; button: InfoModalButton }>();

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

  get buttons(): InfoModalButton[] {
    return this.config.buttons || this.getDefaultButtons();
  }

  getButtonClasses(button: InfoModalButton, index: number): string {
    // Primary button (first button) - blue for info (like Delete button)
    if (index === 0) {
      return 'border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
    
    // Secondary button (second button) - gray border (like Cancel button)
    return 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500';
  }

  private getDefaultButtons(): InfoModalButton[] {
    return [
      { text: 'Close', action: 'ok' }
    ];
  }

  onClose(): void {
    this.close.emit();
  }

  onButtonClick(button: InfoModalButton): void {
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