import { Component, OnInit, signal } from '@angular/core';
import { CreatePqrsRequest, Pqrs, PqrsSearchQuery, UpdatePqrsRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PqrsUseCase } from '../../../domain/usecase/pqrs/pqrs.usecase';
import { CommonModule, DatePipe } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-pqrs',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './pqrs.html',
  styleUrl: './pqrs.css',
})
export class PqrsPage implements OnInit {

  items: Pqrs[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading           = signal(false);
  modalMode         = signal<ModalMode>(null);
  selectedItem      = signal<Pqrs | null>(null);
  modalErrorMessage = signal<string | null>(null);
  filterEstId   = '';
  filterTpqrsId = '';

  form: FormGroup;

  constructor(
    private readonly useCase: PqrsUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      pqrsFecha:       ['', Validators.required],
      pqrsDescripcion: ['', [Validators.required, Validators.maxLength(500)]],
      pqrsCorreo:      ['', [Validators.required, Validators.email]],
      pqrsTelefono:    ['', Validators.required],
      tpqrsId:         [null, Validators.required],
      estId:           [1, Validators.required],
      pqrsRespuesta:   [''],
      usuIdResponde:   [null],
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    const query: PqrsSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'pqrsId', order: 'asc' },
      ...(this.filterEstId   && { estId:   +this.filterEstId }),
      ...(this.filterTpqrsId && { tpqrsId: +this.filterTpqrsId }),
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
    if (field === 'estId')   this.filterEstId   = value;
    if (field === 'tpqrsId') this.filterTpqrsId = value;
    this.currentPage = 1;
    this.loadItems();
  }

  openCreate(): void {
    this.form.reset({ estId: 1 });
    this.selectedItem.set(null);
    this.modalMode.set('create');
  }

  openEdit(item: Pqrs): void {
    this.selectedItem.set(item);
    this.form.patchValue({
      pqrsFecha:       item.pqrsFecha,
      pqrsDescripcion: item.pqrsDescripcion,
      pqrsCorreo:      item.pqrsCorreo,
      pqrsTelefono:    item.pqrsTelefono,
      tpqrsId:         item.tpqrsId,
      estId:           item.estId,
      pqrsRespuesta:   item.pqrsRespuesta ?? '',
      usuIdResponde:   item.usuIdResponde,
    });
    this.modalMode.set('edit');
  }

  openDelete(item: Pqrs): void {
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
      const request: CreatePqrsRequest = this.form.value;
      this.useCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear PQRS'),
      });
    } else if (this.modalMode() === 'edit' && this.selectedItem()) {
      const request: UpdatePqrsRequest = this.form.value;
      this.useCase.update(this.selectedItem()!.pqrsId, request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar PQRS'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedItem()) return;
    this.modalErrorMessage.set(null);
    this.useCase.delete(this.selectedItem()!.pqrsId).subscribe({
      next: () => { this.closeModal(); this.loadItems(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar PQRS'),
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
