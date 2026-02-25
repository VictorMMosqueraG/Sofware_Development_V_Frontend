import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-success-dialog',
  imports: [MatDialogModule,MatButtonModule,MatIconModule],
  templateUrl: './success-dialog.html',
  styleUrl: './success-dialog.css',
})
export class SuccessDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; message: string; icon?: string }
  ) { }
}
