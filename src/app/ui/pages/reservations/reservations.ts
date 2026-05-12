import { Component, OnInit, signal } from '@angular/core';
import { CreateReservationRequest, Reservation, ReservationSearchQuery, UpdateReservationRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationUseCase } from '../../../domain/usecase/reservations/reservation.usecase';
import { CommonModule, DatePipe } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-reservations',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css',
})
export class Reservations implements OnInit {

  items: Reservation[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading           = signal(false);
  modalMode         = signal<ModalMode>(null);
  selectedItem      = signal<Reservation | null>(null);
  modalErrorMessage = signal<string | null>(null);
  filterEstado = '';
  filterSedeId = '';

  form: FormGroup;

  constructor(
    private readonly useCase: ReservationUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      sedeId:       [null, Validators.required],
      resNombreCli: ['', [Validators.required, Validators.maxLength(100)]],
      resTelefono:  [''],
      resFechaHora: ['', Validators.required],
      resPersonas:  [1, [Validators.required, Validators.min(1)]],
      mesaId:       [null],
      resNota:      [''],
      resEstado:    ['PENDIENTE', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    const query: ReservationSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'resId', order: 'asc' },
      ...(this.filterEstado && { resEstado: this.filterEstado }),
      ...(this.filterSedeId && { sedeId:    +this.filterSedeId }),
    };
    this.useCase.getAll(query).subscribe({
      next: (res) => {
        this.items        = res?.results ?? [];
        this.totalRecords = res?.total   ?? 0;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFilterChange(field: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (field === 'resEstado') this.filterEstado = value;
    if (field === 'sedeId')    this.filterSedeId = value;
    this.currentPage = 1;
    this.loadItems();
  }

  openCreate(): void {
    this.form.reset({ resEstado: 'PENDIENTE', resPersonas: 1 });
    this.selectedItem.set(null);
    this.modalMode.set('create');
  }

  openEdit(item: Reservation): void {
    this.selectedItem.set(item);
    this.form.patchValue({
      sedeId:       item.sedeId,
      resNombreCli: item.resNombreCli,
      resTelefono:  item.resTelefono ?? '',
      resFechaHora: item.resFechaHora,
      resPersonas:  item.resPersonas,
      mesaId:       item.mesaId,
      resNota:      item.resNota ?? '',
      resEstado:    item.resEstado,
    });
    this.modalMode.set('edit');
  }

  openDelete(item: Reservation): void {
    this.selectedItem.set(item);
    this.modalMode.set('delete');
  }

  closeModal(): void {
    this.modalMode.set(null);
    this.selectedItem.set(null);
    this.form.reset();
    this.modalErrorMessage.set(null);
  }

  submitForm(): void {
    if (this.form.invalid) return;
    this.modalErrorMessage.set(null);

    if (this.modalMode() === 'create') {
      const request: CreateReservationRequest = this.form.value;
      this.useCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear reservacion'),
      });
    } else if (this.modalMode() === 'edit' && this.selectedItem()) {
      const request: UpdateReservationRequest = this.form.value;
      this.useCase.update(this.selectedItem()!.resId, request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar reservacion'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedItem()) return;
    this.modalErrorMessage.set(null);
    this.useCase.delete(this.selectedItem()!.resId).subscribe({
      next: () => { this.closeModal(); this.loadItems(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar reservacion'),
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.loadItems(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.loadItems(); }
  }
}
