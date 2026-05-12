import { Component, OnInit, signal } from '@angular/core';
import { CreateSupplyCategoryRequest, SupplyCategory, SupplyCategorySearchQuery, UpdateSupplyCategoryRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplyCategoryUseCase } from '../../../domain/usecase/supply-categories/supply-category.usecase';
import { CommonModule, DatePipe } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-supply-categories',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './supply-categories.html',
  styleUrl: './supply-categories.css',
})
export class SupplyCategories implements OnInit {

  supplyCategories: SupplyCategory[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading                = signal(false);
  modalMode              = signal<ModalMode>(null);
  selectedSupplyCategory = signal<SupplyCategory | null>(null);
  modalErrorMessage      = signal<string | null>(null);
  filterEstado = '';

  form: FormGroup;

  constructor(
    private readonly supplyCategoryUseCase: SupplyCategoryUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      cinsNombre: ['', [Validators.required, Validators.maxLength(100)]],
      cinsImagen: ['', Validators.maxLength(255)],
      cinsEstado: [1, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadSupplyCategories();
  }

  loadSupplyCategories(): void {
    this.loading.set(true);
    const query: SupplyCategorySearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'cinsId', order: 'asc' },
      ...(this.filterEstado !== '' && { cinsEstado: +this.filterEstado }),
    };
    this.supplyCategoryUseCase.getAll(query).subscribe({
      next: (res) => {
        this.supplyCategories = res?.results ?? [];
        this.totalRecords     = res?.total   ?? 0;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFilterChange(field: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (field === 'cinsEstado') this.filterEstado = value;
    this.currentPage = 1;
    this.loadSupplyCategories();
  }

  openCreate(): void {
    this.form.reset({ cinsEstado: 1 });
    this.selectedSupplyCategory.set(null);
    this.modalMode.set('create');
  }

  openEdit(category: SupplyCategory): void {
    this.selectedSupplyCategory.set(category);
    this.form.patchValue({
      cinsNombre: category.cinsNombre,
      cinsImagen: category.cinsImagen ?? '',
      cinsEstado: category.cinsEstado,
    });
    this.modalMode.set('edit');
  }

  openDelete(category: SupplyCategory): void {
    this.selectedSupplyCategory.set(category);
    this.modalMode.set('delete');
  }

  closeModal(): void {
    this.modalMode.set(null);
    this.selectedSupplyCategory.set(null);
    this.form.reset();
    this.modalErrorMessage.set(null);
  }

  submitForm(): void {
    if (this.form.invalid) return;
    this.modalErrorMessage.set(null);

    if (this.modalMode() === 'create') {
      const request: CreateSupplyCategoryRequest = this.form.value;
      this.supplyCategoryUseCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadSupplyCategories(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear categoría'),
      });

    } else if (this.modalMode() === 'edit' && this.selectedSupplyCategory()) {
      const raw = this.form.getRawValue();
      const request: UpdateSupplyCategoryRequest = {
        cinsNombre: raw.cinsNombre,
        cinsImagen: raw.cinsImagen,
        cinsEstado: raw.cinsEstado,
      };
      this.supplyCategoryUseCase.update(this.selectedSupplyCategory()!.cinsId, request).subscribe({
        next: () => { this.closeModal(); this.loadSupplyCategories(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar categoría'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedSupplyCategory()) return;
    this.modalErrorMessage.set(null);
    this.supplyCategoryUseCase.delete(this.selectedSupplyCategory()!.cinsId).subscribe({
      next: () => { this.closeModal(); this.loadSupplyCategories(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar categoría'),
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.loadSupplyCategories(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.loadSupplyCategories(); }
  }
}
