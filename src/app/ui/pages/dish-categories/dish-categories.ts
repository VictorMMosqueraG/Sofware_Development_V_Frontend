import { Component, OnInit, signal } from '@angular/core';
import { CreateDishCategoryRequest, DishCategory, DishCategorySearchQuery, UpdateDishCategoryRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DishCategoryUseCase } from '../../../domain/usecase/dishCategories/dish-category.usecase';
import { CommonModule, DatePipe } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-dish-categories',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './dish-categories.html',
  styleUrl: './dish-categories.css',
})
export class DishCategories implements OnInit {

  items: DishCategory[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading           = signal(false);
  modalMode         = signal<ModalMode>(null);
  selectedItem      = signal<DishCategory | null>(null);
  modalErrorMessage = signal<string | null>(null);
  filterEstado = '';

  form: FormGroup;

  constructor(
    private readonly useCase: DishCategoryUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      catNombre: ['', [Validators.required, Validators.maxLength(100)]],
      catImagen: [''],
      catEstado: [1, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    const query: DishCategorySearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'catId', order: 'asc' },
      ...(this.filterEstado && { catEstado: this.filterEstado }),
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
    this.form.reset({ catEstado: 1 });
    this.selectedItem.set(null);
    this.modalMode.set('create');
  }

  openEdit(item: DishCategory): void {
    this.selectedItem.set(item);
    this.form.patchValue({
      catNombre: item.catNombre,
      catImagen: item.catImagen ?? '',
      catEstado: item.catEstado,
    });
    this.modalMode.set('edit');
  }

  openDelete(item: DishCategory): void {
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

    const raw = this.form.value;
    raw.catEstado = Number(raw.catEstado);

    if (this.modalMode() === 'create') {
      const request: CreateDishCategoryRequest = raw;
      this.useCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear registro'),
      });

    } else if (this.modalMode() === 'edit' && this.selectedItem()) {
      const request: UpdateDishCategoryRequest = raw;
      this.useCase.update(this.selectedItem()!.catId, request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar registro'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedItem()) return;
    this.modalErrorMessage.set(null);
    this.useCase.delete(this.selectedItem()!.catId).subscribe({
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
