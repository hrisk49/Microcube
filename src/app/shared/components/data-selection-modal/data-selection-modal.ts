import {Component, effect, input, OnInit, output} from '@angular/core';
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

  dataSource = input<any>();
  pickTablePair = input<Map<string, string>>();
  result = output<any | undefined>();
  isPickTableDialogOpen = input<boolean>();


  constructor() {
    effect(() => {
      console.log(' dataSource:', this.dataSource());
      console.log(' pickTablePair:', this.pickTablePair());
    });
  }

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
    return map?.get(key) || key; // Map এ value না থাকলে key দেখাবে
  }

  protected readonly Object = Object;
}
