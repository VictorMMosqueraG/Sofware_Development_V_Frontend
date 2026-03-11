// src/app/ui/pages/cash-receipts/cash-receipts.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CashReceiptUseCase } from '../../../domain/usecase/cash-receipt/cash-receipt.usecase';
import { CustomerUseCase } from '../../../domain/usecase/customers/customer.usecase';
import { CashReceipt, CashReceiptSearchQuery, CashReceiptView, CreateCashReceiptRequest, UpdateCashReceiptRequest, Customer } from '../../../domain/models';
import { forkJoin, map } from 'rxjs';


type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-cash-receipts',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './cash-receipts.html',
  styleUrl: './cash-receipts.css',
})
export class CashReceipts implements OnInit {

  receipts:     CashReceiptView[] = [];
  customers:    Customer[] = [];
  totalRecords  = 0;
  currentPage   = 1;
  pageSize      = 10;
  loading       = signal(false);
  modalMode     = signal<ModalMode>(null);
  selected      = signal<CashReceipt | null>(null);
  errorMessage  = signal<string | null>(null);
  modalErrorMessage = signal<string | null>(null);
  filterEstado  = '';

  private customerCache = new Map<number, string>();

  form: FormGroup;

  constructor(
    private readonly cashReceiptUseCase: CashReceiptUseCase,
    private readonly customerUseCase: CustomerUseCase,
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
    this.loadCustomers();
    this.loadReceipts();
  }

  private loadCustomers(): void {
    const query: any = {
      pagination: { page: 1, pageSize: 1000, sort: 'cliId', order: 'asc' as const },
      cliEstado: 'ACTIVO'
    };
    this.customerUseCase.getAll(query).subscribe({
      next: (res) => {
        this.customers = res?.results ?? [];
      },
      error: (err) => {
        console.error('Error loading customers:', err);
      }
    });
  }

  loadReceipts(): void {
    this.loading.set(true);
    const query: CashReceiptSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'rcNum', order: 'asc' },
      ...(this.filterEstado && { rcEstado: this.filterEstado }),
    };
    this.cashReceiptUseCase.getAll(query).subscribe({
      next: (res) => {
        const receiptsData = res?.results ?? [];
        this.totalRecords = res?.total ?? 0;

        // Si no hay datos, mostrar directamente
        if (receiptsData.length === 0) {
          this.receipts = [];
          this.loading.set(false);
          return;
        }

        this.enrichReceiptsWithCustomerNames(receiptsData);
      },
      error: (err) => {
        console.error('Error loading receipts:', err);
        this.loading.set(false);
      },
    });
  }

  private enrichReceiptsWithCustomerNames(receipts: CashReceipt[]): void {
    const uniqueCliIds = [...new Set(receipts.map(r => r.cliId))];
    const uncachedIds = uniqueCliIds.filter(id => !this.customerCache.has(id));

    // Si todos los clientes están cacheados, mostrar directamente
    if (uncachedIds.length === 0) {
      this.receipts = this.mapReceiptsToView(receipts);
      this.loading.set(false);
      return;
    }

    // Obtener clientes faltantes transformando cada respuesta
    const requests = uncachedIds.map(id =>
      this.customerUseCase.getById(id).pipe(
        map(response => ({
          id,
          name: response?.results ?
            `${response.results.cliNombre} ${response.results.cliApellidos}` :
            `Cliente #${id}`
        }))
      )
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        // Guardar todos los nombres en caché
        results.forEach(result => {
          this.customerCache.set(result.id, result.name);
        });
        this.receipts = this.mapReceiptsToView(receipts);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading customer names:', err);
        // Usar fallback y mostrar de todas formas
        uncachedIds.forEach(id => {
          this.customerCache.set(id, `Cliente #${id}`);
        });
        this.receipts = this.mapReceiptsToView(receipts);
        this.loading.set(false);
      }
    });
  }

  private mapReceiptsToView(receipts: CashReceipt[]): CashReceiptView[] {
    return receipts.map(receipt => ({
      ...receipt,
      clientName: this.customerCache.get(receipt.cliId) || `Cliente #${receipt.cliId}`,
      userName: `Usuario #${receipt.usuId}`,
    }));
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
    this.modalErrorMessage.set(null);
  }

  submitForm(): void {
    if (this.form.invalid) return;

    this.modalErrorMessage.set(null);
    if (this.modalMode() === 'create') {
      const request: CreateCashReceiptRequest = this.form.value;
      this.cashReceiptUseCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadReceipts(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear recibo'),
      });
    } else if (this.modalMode() === 'edit' && this.selected()) {
      const request: UpdateCashReceiptRequest = this.form.value;
      this.cashReceiptUseCase.update(this.selected()!.rcNum, request).subscribe({
        next: () => { this.closeModal(); this.loadReceipts(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar recibo'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selected()) return;
    this.modalErrorMessage.set(null);
    this.cashReceiptUseCase.delete(this.selected()!.rcNum).subscribe({
      next: () => { this.closeModal(); this.loadReceipts(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar recibo'),
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
