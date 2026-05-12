import { Component, OnInit, signal } from '@angular/core';
import { CreateOrderRequest, Order, OrderSearchQuery, UpdateOrderRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderUseCase } from '../../../domain/usecase/orders/order.usecase';
import { CommonModule, DatePipe } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-orders',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {

  items: Order[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading           = signal(false);
  modalMode         = signal<ModalMode>(null);
  selectedItem      = signal<Order | null>(null);
  modalErrorMessage = signal<string | null>(null);
  filterEstId  = '';
  filterSedeId = '';

  form: FormGroup;

  constructor(
    private readonly useCase: OrderUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      sedeId:   [null, Validators.required],
      pedFecha: ['', Validators.required],
      usuId:    [null, Validators.required],
      mesaId:   [null],
      estId:    [1, Validators.required],
      pedObs:   [''],
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    const query: OrderSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'pedId', order: 'asc' },
      ...(this.filterEstId  && { estId:  +this.filterEstId }),
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
    if (field === 'estId')  this.filterEstId  = value;
    if (field === 'sedeId') this.filterSedeId = value;
    this.currentPage = 1;
    this.loadItems();
  }

  openCreate(): void {
    this.form.reset({ estId: 1 });
    this.selectedItem.set(null);
    this.modalMode.set('create');
  }

  openEdit(item: Order): void {
    this.selectedItem.set(item);
    this.form.patchValue({
      sedeId:   item.sedeId,
      pedFecha: item.pedFecha,
      usuId:    item.usuId,
      mesaId:   item.mesaId,
      estId:    item.estId,
      pedObs:   item.pedObs ?? '',
    });
    this.modalMode.set('edit');
  }

  openDelete(item: Order): void {
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
      const request: CreateOrderRequest = this.form.value;
      this.useCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear pedido'),
      });
    } else if (this.modalMode() === 'edit' && this.selectedItem()) {
      const request: UpdateOrderRequest = this.form.value;
      this.useCase.update(this.selectedItem()!.pedId, request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar pedido'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedItem()) return;
    this.modalErrorMessage.set(null);
    this.useCase.delete(this.selectedItem()!.pedId).subscribe({
      next: () => { this.closeModal(); this.loadItems(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar pedido'),
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
