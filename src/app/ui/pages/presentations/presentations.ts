import { Component, OnInit, signal } from '@angular/core';
import { CreatePresentationRequest, Presentation, PresentationSearchQuery, UpdatePresentationRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PresentationUseCase } from '../../../domain/usecase/presentations/presentation.usecase';
import { CommonModule, DatePipe } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-presentations',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './presentations.html',
  styleUrl: './presentations.css',
})
export class Presentations implements OnInit {

  items: Presentation[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading           = signal(false);
  modalMode         = signal<ModalMode>(null);
  selectedItem      = signal<Presentation | null>(null);
  modalErrorMessage = signal<string | null>(null);
  filterEstado = '';

  form: FormGroup;

  constructor(
    private readonly useCase: PresentationUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      presDescripcion:  ['', [Validators.required, Validators.maxLength(100)]],
      presAbreviatura:  ['', [Validators.required, Validators.maxLength(20)]],
      presEstado:       ['ACTIVO', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    const query: PresentationSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'presId', order: 'asc' },
      ...(this.filterEstado && { presEstado: this.filterEstado }),
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
    this.form.reset({ presEstado: 'ACTIVO' });
    this.selectedItem.set(null);
    this.modalMode.set('create');
  }

  openEdit(item: Presentation): void {
    this.selectedItem.set(item);
    this.form.patchValue({
      presDescripcion: item.presDescripcion,
      presAbreviatura: item.presAbreviatura,
      presEstado:      item.presEstado,
    });
    this.modalMode.set('edit');
  }

  openDelete(item: Presentation): void {
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
      const request: CreatePresentationRequest = this.form.value;
      this.useCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear registro'),
      });

    } else if (this.modalMode() === 'edit' && this.selectedItem()) {
      const request: UpdatePresentationRequest = this.form.value;
      this.useCase.update(this.selectedItem()!.presId, request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar registro'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedItem()) return;
    this.modalErrorMessage.set(null);
    this.useCase.delete(this.selectedItem()!.presId).subscribe({
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
