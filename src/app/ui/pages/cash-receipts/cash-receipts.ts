// src/app/ui/pages/cash-receipts/cash-receipts.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CashReceiptUseCase } from '../../../domain/usecase/cash-receipt/cash-receipt.usecase';
import { CashReceipt, CashReceiptSearchQuery, CreateCashReceiptRequest, UpdateCashReceiptRequest } from '../../../domain/models';


type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-cash-receipts',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './cash-receipts.html',
  styleUrl: './cash-receipts.css',
})
export class CashReceipts implements OnInit {

  receipts:     CashReceipt[] = [];
  totalRecords  = 0;
  currentPage   = 1;
  pageSize      = 10;
  loading       = signal(false);
  modalMode     = signal<ModalMode>(null);
  selected      = signal<CashReceipt | null>(null);
  errorMessage  = signal<string | null>(null);
  filterEstado  = '';

  form: FormGroup;

  constructor(
    private readonly cashReceiptUseCase: CashReceiptUseCase,
    private readonly fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      usuId:         ['', [Validators.required, Validators.min(1)]],
      rcFecha:       ['', Validators.required],
      pedId:         ['', [Validators.required, Validators.min(1)]],
      cliId:         ['', [Validators.required, Validators.min(1)]],
      rcTotal:       ['', [Validators.required, Validators.min(0.01)]],
      rcObservacion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(360)]],
      rcEstado:      ['ACTIVO', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadReceipts();
  }

  loadReceipts(): void {
    this.loading.set(true);
    const query: CashReceiptSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'rcNum', order: 'asc' },
      ...(this.filterEstado && { rcEstado: this.filterEstado }),
    };
    this.cashReceiptUseCase.getAll(query).subscribe({
      next: (res) => {
        this.receipts     = res?.results ?? [];
        this.totalRecords = res?.total   ?? 0;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFilterChange(event: Event): void {
    this.filterEstado = (event.target as HTMLSelectElement).value;
    this.currentPage  = 1;
    this.loadReceipts();
  }

  openCreate(): void {
    this.form.reset({ rcEstado: 'ACTIVO' });
    this.selected.set(null);
    this.modalMode.set('create');
  }

  openEdit(receipt: CashReceipt): void {
    this.selected.set(receipt);
    this.form.patchValue(receipt);
    this.modalMode.set('edit');
  }

  openDelete(receipt: CashReceipt): void {
    this.selected.set(receipt);
    this.modalMode.set('delete');
  }

  closeModal(): void {
    this.modalMode.set(null);
    this.selected.set(null);
    this.form.reset();
  }

  submitForm(): void {
    if (this.form.invalid) return;

    if (this.modalMode() === 'create') {
      const request: CreateCashReceiptRequest = this.form.value;
      this.cashReceiptUseCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadReceipts(); },
        error: (err) => this.errorMessage.set(err?.error?.detail ?? 'Error al crear recibo'),
      });
    } else if (this.modalMode() === 'edit' && this.selected()) {
      const request: UpdateCashReceiptRequest = this.form.value;
      this.cashReceiptUseCase.update(this.selected()!.rcNum, request).subscribe({
        next: () => { this.closeModal(); this.loadReceipts(); },
        error: (err) => this.errorMessage.set(err?.error?.detail ?? 'Error al actualizar recibo'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selected()) return;
    this.cashReceiptUseCase.delete(this.selected()!.rcNum).subscribe({
      next: () => { this.closeModal(); this.loadReceipts(); },
      error: (err) => {
        this.closeModal();
        this.errorMessage.set(err?.error?.detail ?? 'Error al eliminar recibo');
      },
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.loadReceipts(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.loadReceipts(); }
  }
}
