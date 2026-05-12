import { Component, OnInit, signal } from '@angular/core';
import { CreatePqrsTypeRequest, PqrsType, PqrsTypeSearchQuery, UpdatePqrsTypeRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PqrsTypeUseCase } from '../../../domain/usecase/pqrsTypes/pqrs-type.usecase';
import { CommonModule, DatePipe } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-pqrs-types',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './pqrs-types.html',
  styleUrl: './pqrs-types.css',
})
export class PqrsTypes implements OnInit {

  items: PqrsType[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading           = signal(false);
  modalMode         = signal<ModalMode>(null);
  selectedItem      = signal<PqrsType | null>(null);
  modalErrorMessage = signal<string | null>(null);
  filterEstado = '';

  form: FormGroup;

  constructor(
    private readonly useCase: PqrsTypeUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      tpqrsDescripcion: ['', [Validators.required, Validators.maxLength(100)]],
      tpqrsEstado:      ['ACTIVO', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    const query: PqrsTypeSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'tpqrsId', order: 'asc' },
      ...(this.filterEstado && { tpqrsEstado: this.filterEstado }),
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

  onFilterChange(event: Event): void {
    this.filterEstado = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.loadItems();
  }

  openCreate(): void {
    this.form.reset({ tpqrsEstado: 'ACTIVO' });
    this.selectedItem.set(null);
    this.modalMode.set('create');
  }

  openEdit(item: PqrsType): void {
    this.selectedItem.set(item);
    this.form.patchValue({
      tpqrsDescripcion: item.tpqrsDescripcion,
      tpqrsEstado:      item.tpqrsEstado,
    });
    this.modalMode.set('edit');
  }

  openDelete(item: PqrsType): void {
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
      const request: CreatePqrsTypeRequest = this.form.value;
      this.useCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear registro'),
      });

    } else if (this.modalMode() === 'edit' && this.selectedItem()) {
      const request: UpdatePqrsTypeRequest = this.form.value;
      this.useCase.update(this.selectedItem()!.tpqrsId, request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar registro'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedItem()) return;
    this.modalErrorMessage.set(null);
    this.useCase.delete(this.selectedItem()!.tpqrsId).subscribe({
      next: () => { this.closeModal(); this.loadItems(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar registro'),
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
