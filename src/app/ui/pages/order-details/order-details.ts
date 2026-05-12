import { Component, OnInit, signal } from '@angular/core';
import { CreateOrderDetailRequest, OrderDetail, OrderDetailSearchQuery, UpdateOrderDetailRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderDetailUseCase } from '../../../domain/usecase/order-details/order-detail.usecase';
import { CommonModule } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails implements OnInit {

  items: OrderDetail[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading           = signal(false);
  modalMode         = signal<ModalMode>(null);
  selectedItem      = signal<OrderDetail | null>(null);
  modalErrorMessage = signal<string | null>(null);
  filterPedId = '';
  filterPlaId = '';

  form: FormGroup;

  constructor(
    private readonly useCase: OrderDetailUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      pedId:        [null, Validators.required],
      plaId:        [null, Validators.required],
      pedDetCant:   [1, [Validators.required, Validators.min(1)]],
      pedDetPrecio: [0, [Validators.required, Validators.min(0)]],
      pedDetObser:  [''],
      estId:        [1, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    const query: OrderDetailSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'pedDetId', order: 'asc' },
      ...(this.filterPedId && { pedId: +this.filterPedId }),
      ...(this.filterPlaId && { plaId: +this.filterPlaId }),
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
    if (field === 'pedId') this.filterPedId = value;
    if (field === 'plaId') this.filterPlaId = value;
    this.currentPage = 1;
    this.loadItems();
  }

  openCreate(): void {
    this.form.reset({ estId: 1, pedDetCant: 1 });
    this.selectedItem.set(null);
    this.modalMode.set('create');
  }

  openEdit(item: OrderDetail): void {
    this.selectedItem.set(item);
    this.form.patchValue({
      pedId:        item.pedId,
      plaId:        item.plaId,
      pedDetCant:   item.pedDetCant,
      pedDetPrecio: item.pedDetPrecio,
      pedDetObser:  item.pedDetObser ?? '',
      estId:        item.estId,
    });
    this.modalMode.set('edit');
  }

  openDelete(item: OrderDetail): void {
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
      const request: CreateOrderDetailRequest = this.form.value;
      this.useCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear detalle'),
      });
    } else if (this.modalMode() === 'edit' && this.selectedItem()) {
      const request: UpdateOrderDetailRequest = this.form.value;
      this.useCase.update(this.selectedItem()!.pedDetId, request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar detalle'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedItem()) return;
    this.modalErrorMessage.set(null);
    this.useCase.delete(this.selectedItem()!.pedDetId).subscribe({
      next: () => { this.closeModal(); this.loadItems(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar detalle'),
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
