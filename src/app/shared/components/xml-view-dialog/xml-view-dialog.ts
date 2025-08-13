import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-xml-view-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './xml-view-dialog.html',
  styleUrl: './xml-view-dialog.scss'
})
export class XmlViewDialog {
  xmlData: string;

  constructor(
    public dialogRef: MatDialogRef<XmlViewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { xmlData: string }
  ) {
    this.xmlData = data.xmlData;
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.xmlData).then(() => {
      // You could add a toast notification here
      console.log('XML copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy XML: ', err);
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
