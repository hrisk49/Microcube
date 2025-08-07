import { Component, OnInit } from '@angular/core';
import { AlertErrorComponent } from '../../../shared/components/alert-error/alert-error';
import { AlertInfoComponent } from '../../../shared/components/alert-info/alert-info';
import { AlertSuccessComponent } from '../../../shared/components/alert-success/alert-success';
import { AlertWarningComponent } from '../../../shared/components/alert-warning/alert-warning';
import { TextArea } from '../../../shared/components/input-types/text-area/text-area';
import { AmountToWordInput } from '../../../shared/components/input-types/amount-to-word-input/amount-to-word-input';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Switch } from "../../../shared/components/input-types/switch/switch";
import { Label } from "../../../shared/components/input-types/label/label";
import { DeleteConfirmationDialogue } from '../../../shared/components/delete-confirmation-dialogue/delete-confirmation-dialogue';

@Component({
  selector: 'app-alert-example-page',
  imports: [
    AlertSuccessComponent,
    AlertErrorComponent,
    AlertWarningComponent,
    AlertInfoComponent,
    DeleteConfirmationDialogue,
    TextArea,
    AmountToWordInput,
    Switch,
    Label
],
  templateUrl: './alert-example-page.html',
  styleUrl: './alert-example-page.scss'
})
export class AlertExamplePage implements OnInit{

  frmGroup: FormGroup;
showOptionalFields: boolean;

  constructor(private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.frmGroup = this.formBuilder.group({
      amount: ['', Validators.required],
      description: ['', Validators.required],
      notifications: [false]
    });
  }

  isSuccessModalOpen = false;
  successModalTitle = 'Success!';
  successModalMessage = 'Your action was completed successfully. This is a success modal with green styling and a checkmark icon.';

  // Error Modal
  isErrorModalOpen = false;
  errorModalTitle = 'Error!';
  errorModalMessage = 'Something went wrong while processing your request. Please try again or contact support if the problem persists.';

  // Warning Modal
  isWarningModalOpen = false;
  warningModalTitle = 'Warning!';
  warningModalMessage = 'Please review your input before proceeding. Some fields may need attention.';

  // Info Modal
  isInfoModalOpen = false;
  infoModalTitle = 'Information';
  infoModalMessage = 'This is an informational modal. It provides helpful context or guidance to the user.';
  isDeleteConfirmationModalOpen: boolean;

  // Success Modal Methods
  showSuccessModal() {
    this.isSuccessModalOpen = true;
  }

  closeSuccessModal() {
    this.isSuccessModalOpen = false;
  }

  onSuccessModalButtonClick(event: { action: string; button: any }) {
    console.log('Success modal button clicked:', event.action);
    this.closeSuccessModal();
  }

  onSwitchChanged(event: any) {
    console.log('Switch changed:', event);
    this.showOptionalFields = !event;
  }
  getLabelText() {
    return this.showOptionalFields ? 'Optional Field' : 'Required Field';
  }
  // Error Modal Methods
  showErrorModal() {
    this.isErrorModalOpen = true;
  }

  closeErrorModal() {
    this.isErrorModalOpen = false;
  }

  onErrorModalButtonClick(event: { action: string; button: any }) {
    console.log('Error modal button clicked:', event.action);
    this.closeErrorModal();
  }

  // Warning Modal Methods
  showWarningModal() {
    this.isWarningModalOpen = true;
  }

  closeWarningModal() {
    this.isWarningModalOpen = false;
  }

  onWarningModalButtonClick(event: { action: string; button: any }) {
    console.log('Warning modal button clicked:', event.action);
    this.closeWarningModal();
  }

  // Info Modal Methods
  showInfoModal() {
    this.isInfoModalOpen = true;
  }

  closeInfoModal() {
    this.isInfoModalOpen = false;
  }

  onInfoModalButtonClick(event: { action: string; button: any }) {
    console.log('Info modal button clicked:', event.action);
    this.closeInfoModal();
  }  
  
  onDeleteConfirmationModalButtonClick(event: { action: string; button: any }) {
    console.log('Delete confirmation modal button clicked:', event.action);
    this.closeDeleteConfirmationModal();
  }

  // Delete Confirmation Modal Methods
  showDeleteConfirmationModal() {
    this.isDeleteConfirmationModalOpen = true;
  }

  closeDeleteConfirmationModal() {
    this.isDeleteConfirmationModalOpen = false;
  }

  // Custom Examples
  showLargeSuccessModal() {
    this.successModalTitle = 'Large Success Modal';
    this.successModalMessage = 'This is a large success modal (lg size) that can accommodate more content. It\'s useful for detailed success messages or complex information.';
    this.showSuccessModal();
  }

  showCustomErrorModal() {
    this.errorModalTitle = 'Custom Error Modal';
    this.errorModalMessage = 'This is a custom error modal with specific styling and behavior. You can customize the title, message, and size as needed.';
    this.showErrorModal();
  }

  onTextAreaChanged(event: any) {
    console.log('Text area changed:', event);
  }

  onAmountToWordInputValueChange(event: any) {
    console.log('Amount to word input value changed:', event);
  }
}
