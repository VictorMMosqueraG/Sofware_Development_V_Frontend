import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CashReceiptUseCase } from '../../../domain/usecase/cash-receipt/cash-receipt.usecase';
import { CustomerUseCase } from '../../../domain/usecase/customers/customer.usecase';
import { LookupHttpService } from '../../../infrastructure/driven-adapter/lookup-http.service';
import {
  CashReceipt, CashReceiptSearchQuery, CashReceiptView,
  CreateCashReceiptRequest, UpdateCashReceiptRequest,
  Customer, Sede, UserLookup, OrderLookup, FormaPago
} from '../../../domain/models';
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
  sedes:        Sede[] = [];
  usuarios:     UserLookup[] = [];
  pedidos:      OrderLookup[] = [];
  formasPago:   FormaPago[] = [];
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
    private readonly lookupService: LookupHttpService,
    private readonly fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      sedeId:        ['', [Validators.required, Validators.min(1)]],
      usuId:         ['', [Validators.required, Validators.min(1)]],
      rcFecha:       ['', Validators.required],
      pedId:         ['', [Validators.required, Validators.min(1)]],
      cliId:         [''],
      fpId:          ['', [Validators.required, Validators.min(1)]],
      rcSubtotal:    ['', [Validators.required, Validators.min(0)]],
      rcDescuento:   [0, [Validators.required, Validators.min(0)]],
      rcPropina:     [0, [Validators.required, Validators.min(0)]],
      rcTotal:       ['', [Validators.required, Validators.min(0.01)]],
      rcMontoRec:    [''],
      rcCambio:      [0, [Validators.required, Validators.min(0)]],
      rcObservacion: ['', Validators.maxLength(360)],
      rcEstado:      ['ACTIVO', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadLookups();
    this.loadReceipts();
  }

  private loadLookups(): void {
    this.lookupService.getSedes().subscribe({
      next: (res) => this.sedes = res?.results ?? [],
    });
    this.lookupService.getUsuarios().subscribe({
      next: (res) => this.usuarios = res?.results ?? [],
    });
    this.lookupService.getPedidos().subscribe({
      next: (res) => this.pedidos = res?.results ?? [],
    });
    this.lookupService.getFormasPago().subscribe({
      next: (res) => this.formasPago = res?.results ?? [],
    });
    const query: any = {
      pagination: { page: 1, pageSize: 1000, sort: 'cliId', order: 'asc' as const },
      cliEstado: 'ACTIVO'
    };
    this.customerUseCase.getAll(query).subscribe({
      next: (res) => this.customers = res?.results ?? [],
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
        if (receiptsData.length === 0) {
          this.receipts = [];
          this.loading.set(false);
          return;
        }
        this.enrichReceiptsWithCustomerNames(receiptsData);
      },
      error: () => this.loading.set(false),
    });
  }

  private enrichReceiptsWithCustomerNames(receipts: CashReceipt[]): void {
    const uniqueCliIds = [...new Set(receipts.filter(r => r.cliId != null).map(r => r.cliId as number))];
    const uncachedIds = uniqueCliIds.filter(id => !this.customerCache.has(id));

    if (uncachedIds.length === 0) {
      this.receipts = this.mapReceiptsToView(receipts);
      this.loading.set(false);
      return;
    }

    const requests = uncachedIds.map(id =>
      this.customerUseCase.getById(id).pipe(
        map(response => ({
          id,
          name: response?.results
            ? `${response.results.cliNombre} ${response.results.cliApellidos}`
            : `Cliente #${id}`
        }))
      )
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        results.forEach(r => this.customerCache.set(r.id, r.name));
        this.receipts = this.mapReceiptsToView(receipts);
        this.loading.set(false);
      },
      error: () => {
        uncachedIds.forEach(id => this.customerCache.set(id, `Cliente #${id}`));
        this.receipts = this.mapReceiptsToView(receipts);
        this.loading.set(false);
      }
    });
  }

  private mapReceiptsToView(receipts: CashReceipt[]): CashReceiptView[] {
    return receipts.map(receipt => ({
      ...receipt,
      clientName: receipt.cliId != null
        ? (this.customerCache.get(receipt.cliId) || `Cliente #${receipt.cliId}`)
        : 'Publico General',
      userName: this.usuarios.find(u => u.usuId === receipt.usuId)?.usuNombre || `Usuario #${receipt.usuId}`,
    }));
  }

  getSedeNombre(id: number): string {
    return this.sedes.find(s => s.sedeId === id)?.sedeNombre || `Sede #${id}`;
  }

  getFormaPagoNombre(id: number): string {
    return this.formasPago.find(f => f.fpId === id)?.fpDescripcion || `FP #${id}`;
  }

  onFilterChange(event: Event): void {
    this.filterEstado = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.loadReceipts();
  }

  openCreate(): void {
    this.form.reset({ rcEstado: 'ACTIVO', rcDescuento: 0, rcPropina: 0, rcCambio: 0 });
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

    const raw = this.form.getRawValue();
    const request = {
      ...raw,
      cliId: raw.cliId ? Number(raw.cliId) : null,
      rcMontoRec: raw.rcMontoRec ? Number(raw.rcMontoRec) : null,
    };

    if (this.modalMode() === 'create') {
      this.cashReceiptUseCase.create(request as CreateCashReceiptRequest).subscribe({
        next: () => { this.closeModal(); this.loadReceipts(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear recibo'),
      });
    } else if (this.modalMode() === 'edit' && this.selected()) {
      this.cashReceiptUseCase.update(this.selected()!.rcNum, request as UpdateCashReceiptRequest).subscribe({
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
