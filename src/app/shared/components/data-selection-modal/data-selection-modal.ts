import {Component, input, OnInit, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

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
  dataSource = input<any>();
  pickTablePair = input<Map<string, string>>();
  result = output<any | undefined>();
  isPickTableDialogOpen = input<boolean>();

  ngOnInit(): void {
  }

  dialogClose(value: any) {
    this.result.emit(value);
  }

  isPresentHead(key: string): boolean {
    const map = this.pickTablePair();
    return map ? map.has(key) : false;
  }

  getHead(key: string): string {
    const map = this.pickTablePair();
    return map?.get(key) || key;
  }

}
