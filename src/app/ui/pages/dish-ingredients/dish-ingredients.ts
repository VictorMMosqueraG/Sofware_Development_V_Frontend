import { Component, OnInit, signal } from '@angular/core';
import { CreateDishIngredientRequest, DishIngredient, DishIngredientSearchQuery, UpdateDishIngredientRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DishIngredientUseCase } from '../../../domain/usecase/dish-ingredients/dish-ingredient.usecase';
import { CommonModule, DatePipe } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-dish-ingredients',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './dish-ingredients.html',
  styleUrl: './dish-ingredients.css',
})
export class DishIngredients implements OnInit {

  items: DishIngredient[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading           = signal(false);
  modalMode         = signal<ModalMode>(null);
  selectedItem      = signal<DishIngredient | null>(null);
  modalErrorMessage = signal<string | null>(null);
  filterPlaId = '';
  filterInsId = '';

  form: FormGroup;

  constructor(
    private readonly useCase: DishIngredientUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      plaId:      [null, Validators.required],
      insId:      [null, Validators.required],
      piCantidad: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    const query: DishIngredientSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'piId', order: 'asc' },
      ...(this.filterPlaId && { plaId: +this.filterPlaId }),
      ...(this.filterInsId && { insId: +this.filterInsId }),
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
    const value = (event.target as HTMLInputElement).value;
    if (field === 'plaId') this.filterPlaId = value;
    if (field === 'insId') this.filterInsId = value;
    this.currentPage = 1;
    this.loadItems();
  }

  openCreate(): void {
    this.form.reset({ piCantidad: 0 });
    this.selectedItem.set(null);
    this.modalMode.set('create');
  }

  openEdit(item: DishIngredient): void {
    this.selectedItem.set(item);
    this.form.patchValue({
      plaId:      item.plaId,
      insId:      item.insId,
      piCantidad: item.piCantidad,
    });
    this.modalMode.set('edit');
  }

  openDelete(item: DishIngredient): void {
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
      const request: CreateDishIngredientRequest = this.form.value;
      this.useCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear ingrediente'),
      });
    } else if (this.modalMode() === 'edit' && this.selectedItem()) {
      const request: UpdateDishIngredientRequest = this.form.value;
      this.useCase.update(this.selectedItem()!.piId, request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar ingrediente'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedItem()) return;
    this.modalErrorMessage.set(null);
    this.useCase.delete(this.selectedItem()!.piId).subscribe({
      next: () => { this.closeModal(); this.loadItems(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar ingrediente'),
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
