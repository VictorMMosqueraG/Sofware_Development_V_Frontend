import { Component, OnInit, signal } from '@angular/core';
import { CreateStatusRequest, Status, StatusSearchQuery, UpdateStatusRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatusUseCase } from '../../../domain/usecase/statuses/status.usecase';
import { CommonModule, DatePipe } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-statuses',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './statuses.html',
  styleUrl: './statuses.css',
})
export class Statuses implements OnInit {

  statuses: Status[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading           = signal(false);
  modalMode         = signal<ModalMode>(null);
  selectedStatus    = signal<Status | null>(null);
  modalErrorMessage = signal<string | null>(null);
  filterEstado = '';
  filterTesId  = '';

  form: FormGroup;

  constructor(
    private readonly statusUseCase: StatusUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      estDescripcion: ['', [Validators.required, Validators.maxLength(100)]],
      tesId:          [null, [Validators.required, Validators.min(1)]],
      estEstado:      ['ACTIVO', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadStatuses();
  }

  loadStatuses(): void {
    this.loading.set(true);
    const query: StatusSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'estId', order: 'asc' },
      ...(this.filterEstado && { estEstado: this.filterEstado }),
      ...(this.filterTesId  && { tesId: +this.filterTesId }),
    };
    this.statusUseCase.getAll(query).subscribe({
      next: (res) => {
        this.statuses     = res?.results ?? [];
        this.totalRecords = res?.total   ?? 0;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFilterChange(field: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (field === 'estEstado') this.filterEstado = value;
    if (field === 'tesId')     this.filterTesId  = value;
    this.currentPage = 1;
    this.loadStatuses();
  }

  openCreate(): void {
    this.form.reset({ estEstado: 'ACTIVO' });
    this.selectedStatus.set(null);
    this.modalMode.set('create');
  }

  openEdit(status: Status): void {
    this.selectedStatus.set(status);
    this.form.patchValue({
      estDescripcion: status.estDescripcion,
      tesId:          status.tesId,
      estEstado:      status.estEstado,
    });
    this.modalMode.set('edit');
  }

  openDelete(status: Status): void {
    this.selectedStatus.set(status);
    this.modalMode.set('delete');
  }

  closeModal(): void {
    this.modalMode.set(null);
    this.selectedStatus.set(null);
    this.form.reset();
    this.modalErrorMessage.set(null);
  }

  submitForm(): void {
    if (this.form.invalid) return;
    this.modalErrorMessage.set(null);

    if (this.modalMode() === 'create') {
      const request: CreateStatusRequest = this.form.value;
      this.statusUseCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadStatuses(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear estado'),
      });

    } else if (this.modalMode() === 'edit' && this.selectedStatus()) {
      const raw = this.form.getRawValue();
      const request: UpdateStatusRequest = {
        estDescripcion: raw.estDescripcion,
        tesId:          raw.tesId,
        estEstado:      raw.estEstado,
      };
      this.statusUseCase.update(this.selectedStatus()!.estId, request).subscribe({
        next: () => { this.closeModal(); this.loadStatuses(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar estado'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedStatus()) return;
    this.modalErrorMessage.set(null);
    this.statusUseCase.delete(this.selectedStatus()!.estId).subscribe({
      next: () => { this.closeModal(); this.loadStatuses(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar estado'),
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.loadStatuses(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.loadStatuses(); }
  }
}
