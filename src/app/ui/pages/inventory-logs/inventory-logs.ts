import { Component, OnInit, signal } from '@angular/core';
import { CreateInventoryLogRequest, InventoryLog, InventoryLogSearchQuery, UpdateInventoryLogRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryLogUseCase } from '../../../domain/usecase/inventory-logs/inventory-log.usecase';
import { CommonModule } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-inventory-logs',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventory-logs.html',
  styleUrl: './inventory-logs.css',
})
export class InventoryLogs implements OnInit {

  items: InventoryLog[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading           = signal(false);
  modalMode         = signal<ModalMode>(null);
  selectedItem      = signal<InventoryLog | null>(null);
  modalErrorMessage = signal<string | null>(null);
  filterTipo  = '';
  filterInsId = '';

  form: FormGroup;

  constructor(
    private readonly useCase: InventoryLogUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      insId:       [null, Validators.required],
      usuId:       [null, Validators.required],
      logTipo:     ['ENTRADA', Validators.required],
      logCantidad: [0, [Validators.required, Validators.min(0)]],
      logStockAnt: [null],
      logStockNvo: [null],
      logNota:     [''],
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    const query: InventoryLogSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'logId', order: 'asc' },
      ...(this.filterTipo  && { logTipo: this.filterTipo }),
      ...(this.filterInsId && { insId:   +this.filterInsId }),
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
    if (field === 'logTipo') this.filterTipo  = value;
    if (field === 'insId')   this.filterInsId = value;
    this.currentPage = 1;
    this.loadItems();
  }

  openCreate(): void {
    this.form.reset({ logTipo: 'ENTRADA', logCantidad: 0 });
    this.selectedItem.set(null);
    this.modalMode.set('create');
  }

  openEdit(item: InventoryLog): void {
    this.selectedItem.set(item);
    this.form.patchValue({
      insId:       item.insId,
      usuId:       item.usuId,
      logTipo:     item.logTipo,
      logCantidad: item.logCantidad,
      logStockAnt: item.logStockAnt,
      logStockNvo: item.logStockNvo,
      logNota:     item.logNota ?? '',
    });
    this.modalMode.set('edit');
  }

  openDelete(item: InventoryLog): void {
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
      const request: CreateInventoryLogRequest = this.form.value;
      this.useCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear movimiento'),
      });
    } else if (this.modalMode() === 'edit' && this.selectedItem()) {
      const request: UpdateInventoryLogRequest = this.form.value;
      this.useCase.update(this.selectedItem()!.logId, request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar movimiento'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedItem()) return;
    this.modalErrorMessage.set(null);
    this.useCase.delete(this.selectedItem()!.logId).subscribe({
      next: () => { this.closeModal(); this.loadItems(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar movimiento'),
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
