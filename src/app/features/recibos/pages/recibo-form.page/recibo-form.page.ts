import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReciboCajaService } from '../../../../core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialog } from '../../../../shared/components/success-dialog/success-dialog';

@Component({
  selector: 'app-recibo-form.page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './recibo-form.page.html',
  styleUrl: './recibo-form.page.css',
})
export class ReciboFormPage implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private service = inject(ReciboCajaService);
  private dialog = inject(MatDialog);

  editingId: number | null = null;

  form = this.fb.group({
    numero: ['', Validators.required],
    cliente: ['', Validators.required],
    estado: ['Activo', Validators.required],
    detalles: this.fb.array<FormGroup>([])
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editingId = Number(id);
      const recibo = this.service.getById(this.editingId);

      if (recibo) {
        this.form.patchValue({
          numero: String(recibo.numero),
          cliente: recibo.cliente,
          estado: recibo.estado
        });

        recibo.detalles.forEach(d => {
          this.details.push(this.fb.group({
            descripcion: d.descripcion,
            precio: d.precio,
            cantidad: d.cantidad,
            subtotal: [{ value: d.subtotal, disabled: true }]
          }));
        });
      }
    }
  }

  get details(): FormArray<FormGroup> {
    return this.form.get('detalles') as FormArray<FormGroup>;
  }

  addDetails(): void {
    const detalle = this.fb.group({
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      subtotal: [{ value: 0, disabled: true }]
    });

    this.details.push(detalle);
  }

  deleteDetails(index: number): void {
    this.details.removeAt(index);
  }

  calculateSubtotal(index: number): void {
    const row = this.details.at(index);

    const precio = Number(row.get('precio')?.value ?? 0);
    const cantidad = Number(row.get('cantidad')?.value ?? 0);

    row.get('subtotal')?.setValue(precio * cantidad, { emitEvent: false });
  }

  get total(): number {
    return this.details.controls.reduce((acc, control) => {
      return acc + Number(control.get('subtotal')?.value ?? 0);
    }, 0);
  }

  save(): void {

    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const reciboData = {
      numero: Number(raw.numero),
      cliente: raw.cliente!,
      estado: raw.estado as 'Activo' | 'Anulado',
      fecha: new Date(),
      total: this.total,
      detalles: this.details.getRawValue().map((d: any, i: number) => ({
        id: i + 1,
        plaId: i + 1,
        descripcion: d.descripcion,
        precio: Number(d.precio),
        cantidad: Number(d.cantidad),
        subtotal: Number(d.precio) * Number(d.cantidad)
      }))
    };

    if (this.editingId) {
      this.service.update(this.editingId, reciboData);

      this.dialog.open(SuccessDialog, {
        data: {
          title: 'Actualización exitosa',
          message: 'El recibo fue actualizado correctamente.',
          icon: 'check_circle'
        }
      }).afterClosed().subscribe(() => {
        this.router.navigate(['/recibos']);
      });

    } else {

      this.service.create(reciboData);

      this.dialog.open(SuccessDialog, {
        data: {
          title: 'Registro exitoso',
          message: 'El recibo fue creado correctamente.',
          icon: 'check_circle'
        }
      }).afterClosed().subscribe(() => {
        this.router.navigate(['/recibos']);
      });

    }
  }
}
