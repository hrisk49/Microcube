import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DeleteConfirmationModalConfig {
  title?: string;
  message?: string;
  showCloseButton?: boolean;
  showBackdrop?: boolean;
  customClass?: string;
  buttons?: DeleteConfirmationModalButton[];
}

export interface DeleteConfirmationModalButton {
  text: string;
  action?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-delete-confirmation-dialogue',
  imports: [CommonModule],
  templateUrl: './delete-confirmation-dialogue.html',
  standalone: true,
  styleUrl: './delete-confirmation-dialogue.scss'
})
export class DeleteConfirmationDialogue {

  @Input() isOpen: boolean = false;
  @Input() config: DeleteConfirmationModalConfig = {};
  @Input() title: string = 'Delete Confirmation';
  @Input() message: string = 'Are you sure you want to delete this item? This action cannot be undone.';
  @Input() showCloseButton: boolean = true;
  @Input() showBackdrop: boolean = true;
  @Input() customClass: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() buttonClick = new EventEmitter<{ action: string; button: DeleteConfirmationModalButton }>();

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DeleteConfirmationModalConfig,
    @Optional() public dialogRef: MatDialogRef<DeleteConfirmationDialogue>
  ) {
    // If used as MatDialog, merge data with config
    if (this.data) {
      this.config = { ...this.config, ...this.data };
      this.isOpen = true; // Always open when used as dialog
    }
  }

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

  get buttons(): DeleteConfirmationModalButton[] {
    return this.config.buttons || this.getDefaultButtons();
  }

  getButtonClasses(button: DeleteConfirmationModalButton, index: number): string {
    // Primary button (first button) - red for delete confirmation
    if (index === 0) {
      return 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500';
    }
    
    // Secondary button (second button) - gray border for cancel/close
    return 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500';
  }

  private getDefaultButtons(): DeleteConfirmationModalButton[] {
    return [
      { text: 'Delete', action: 'confirm' },
      { text: 'Cancel', action: 'cancel' }
    ];
  }

  onClose(): void {
    if (this.dialogRef) {
      // Used as MatDialog
      this.dialogRef.close(false);
    } else {
      // Used as regular component
      this.close.emit();
    }
  }

  onButtonClick(button: DeleteConfirmationModalButton): void {
    if (!button.disabled) {
      if (this.dialogRef) {
        // Used as MatDialog
        const result = button.action === 'confirm' || button.action === 'delete';
        this.dialogRef.close(result);
      } else {
        // Used as regular component
        this.buttonClick.emit({ action: button.action || 'click', button });
      }
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget && this.showBackdropValue) {
      this.onClose();
    }
  }
}
