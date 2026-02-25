import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReciboCajaService } from '../../../../core';
import { SuccessDialog } from '../../../../shared/components/success-dialog/success-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-recibo-list.page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './recibo-list.page.html',
  styleUrl: './recibo-list.page.css',
})
export class ReciboListPage {

  private service = inject(ReciboCajaService);
  private dialog = inject(MatDialog);

  recibos$ = this.service.recibos$;

  remove(id: number) {

    this.service.delete(id);

    this.dialog.open(SuccessDialog, {
      data: {
        title: 'Eliminación exitosa',
        message: 'El recibo fue eliminado correctamente.',
        icon: 'delete'
      }
    });
  }
}
