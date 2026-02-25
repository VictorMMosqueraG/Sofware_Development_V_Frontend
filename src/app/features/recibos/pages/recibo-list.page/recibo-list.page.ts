import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReciboCajaService } from '../../../../core';

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

  recibos$ = this.service.recibos$;

  remove(id: number): void {
    if (confirm('¿Eliminar recibo?')) {
      this.service.delete(id);
    }
  }
}
