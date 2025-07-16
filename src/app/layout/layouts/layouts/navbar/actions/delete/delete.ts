import {Component, inject} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {
  DeleteConfirmationDialogue
} from '../../../../../../shared/components/delete-confirmation-dialogue/delete-confirmation-dialogue';

@Component({
  selector: 'app-delete',
  imports: [
    MatIcon
  ],
  templateUrl: './delete.html',
  standalone: true,
  styleUrl: './delete.scss'
})
export class Delete {

  private dialog = inject(MatDialog);

  delete() {
    let dialogRef = this.dialog.open(DeleteConfirmationDialogue, {
      // width: '450px',
      // height: '300px',
      // data: { name: this.name, animal: this.animal }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.animal = result;
    // });

  }
}
