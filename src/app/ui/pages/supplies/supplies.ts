import { Component, OnInit, signal } from '@angular/core';
import { CreateSupplyRequest, Supply, SupplySearchQuery, UpdateSupplyRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplyUseCase } from '../../../domain/usecase/supplies/supply.usecase';
import { CommonModule } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-supplies',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './supplies.html',
  styleUrl: './supplies.css',
})
export class Supplies implements OnInit {

  items: Supply[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading           = signal(false);
  modalMode         = signal<ModalMode>(null);
  selectedItem      = signal<Supply | null>(null);
  modalErrorMessage = signal<string | null>(null);
  filterEstado = '';
  filterSedeId = '';

  form: FormGroup;

  constructor(
    private readonly useCase: SupplyUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      sedeId:          [null, Validators.required],
      cinsId:          [null, Validators.required],
      presId:          [null, Validators.required],
      insNombre:       ['', [Validators.required, Validators.maxLength(100)]],
      insCodigo:       [''],
      insCodigoBarras: [''],
      insPrecioCompra: [null],
      insStock:        [0, [Validators.required, Validators.min(0)]],
      insStockMin:     [0, [Validators.required, Validators.min(0)]],
      insVendible:     [0, Validators.required],
      insImagen:       [''],
      insEstado:       [1, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    const query: SupplySearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'insId', order: 'asc' },
      ...(this.filterEstado !== '' && { insEstado: +this.filterEstado }),
      ...(this.filterSedeId && { sedeId: +this.filterSedeId }),
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
    if (field === 'insEstado') this.filterEstado = value;
    if (field === 'sedeId')    this.filterSedeId = value;
    this.currentPage = 1;
    this.loadItems();
  }

  openCreate(): void {
    this.form.reset({ insEstado: 1, insStock: 0, insStockMin: 0, insVendible: 0 });
    this.selectedItem.set(null);
    this.modalMode.set('create');
  }

  openEdit(item: Supply): void {
    this.selectedItem.set(item);
    this.form.patchValue({
      sedeId:          item.sedeId,
      cinsId:          item.cinsId,
      presId:          item.presId,
      insNombre:       item.insNombre,
      insCodigo:       item.insCodigo ?? '',
      insCodigoBarras: item.insCodigoBarras ?? '',
      insPrecioCompra: item.insPrecioCompra,
      insStock:        item.insStock,
      insStockMin:     item.insStockMin,
      insVendible:     item.insVendible,
      insImagen:       item.insImagen ?? '',
      insEstado:       item.insEstado,
    });
    this.modalMode.set('edit');
  }

  openDelete(item: Supply): void {
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
      const request: CreateSupplyRequest = this.form.value;
      this.useCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear insumo'),
      });
    } else if (this.modalMode() === 'edit' && this.selectedItem()) {
      const request: UpdateSupplyRequest = this.form.value;
      this.useCase.update(this.selectedItem()!.insId, request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar insumo'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedItem()) return;
    this.modalErrorMessage.set(null);
    this.useCase.delete(this.selectedItem()!.insId).subscribe({
      next: () => { this.closeModal(); this.loadItems(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar insumo'),
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
