import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-data-selection-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './data-selection-modal.html',
  styleUrls: ['./data-selection-modal.scss']
})
export class DataSelectionModal implements OnInit {

  protected readonly Object = Object;
  dataSource: any[] = [];
  pickTablePair: Map<string, string> = new Map<string, string>();

  // result = output<any | undefined>();

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataSource = data?.pickTableDataSource ?? [];
    this.pickTablePair = data?.pickTablePair ?? new Map<string, string>();
  }

  ngOnInit(): void {
  }

  dialogClose(value: any) {
    // this.result.emit(value);
    this.dialogRef.close(value);
  }

  isPresentHead(key: string): boolean {
    return this.pickTablePair.has(key);
  }

  getHead(key: string): string {
    return this.pickTablePair.get(key) || key;
  }

}
