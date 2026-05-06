import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CashReceiptDetailUseCase } from '../../../domain/usecase/cash-receipt-detail/cash-receipt-detail.usecase';
import { LookupHttpService } from '../../../infrastructure/driven-adapter/lookup-http.service';
import {
  CashReceiptDetail, CashReceiptDetailSearchQuery,
  CreateCashReceiptDetailRequest, UpdateCashReceiptDetailRequest,
  CashReceipt, PlatoLookup
} from '../../../domain/models';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-cash-receipt-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cash-receipt-details.html',
  styleUrl: './cash-receipt-details.css',
})
export class CashReceiptDetails implements OnInit {

  details:      CashReceiptDetail[] = [];
  recibos:      CashReceipt[] = [];
  platos:       PlatoLookup[] = [];
  totalRecords  = 0;
  currentPage   = 1;
  pageSize      = 10;
  loading       = signal(false);
  modalMode     = signal<ModalMode>(null);
  selected      = signal<CashReceiptDetail | null>(null);
  errorMessage  = signal<string | null>(null);
  modalErrorMessage = signal<string | null>(null);
  filterRcNum   = '';

  form: FormGroup;

  constructor(
    private readonly detailUseCase: CashReceiptDetailUseCase,
    private readonly lookupService: LookupHttpService,
    private readonly fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      rcNum:        ['', [Validators.required, Validators.min(1)]],
      plaId:        ['', [Validators.required, Validators.min(1)]],
      rcdCantidad:  ['', [Validators.required, Validators.min(1)]],
      rcdPrecio:    ['', [Validators.required, Validators.min(0.01)]],
      rcdDescuento: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadLookups();
    this.loadDetails();
  }

  private loadLookups(): void {
    this.lookupService.getRecibos().subscribe({
      next: (res) => this.recibos = res?.results ?? [],
    });
    this.lookupService.getPlatos().subscribe({
      next: (res) => this.platos = res?.results ?? [],
    });
  }

  getPlatoNombre(id: number): string {
    return this.platos.find(p => p.plaId === id)?.plaDescripcion || `Plato #${id}`;
  }

  loadDetails(): void {
    this.loading.set(true);
    const query: CashReceiptDetailSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'rcdId', order: 'asc' },
      ...(this.filterRcNum && { rcNum: Number(this.filterRcNum) }),
    };
    this.detailUseCase.getAll(query).subscribe({
      next: (res) => {
        this.details = res?.results ?? [];
        this.totalRecords = res?.total ?? 0;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFilterChange(event: Event): void {
    this.filterRcNum = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.loadDetails();
  }

  onPlatoChange(): void {
    const plaId = Number(this.form.get('plaId')?.value);
    const plato = this.platos.find(p => p.plaId === plaId);
    if (plato) {
      this.form.patchValue({ rcdPrecio: plato.plaPrecio });
    }
  }

  openCreate(): void {
    this.form.reset({ rcdDescuento: 0 });
    this.selected.set(null);
    this.modalMode.set('create');
  }

  openEdit(detail: CashReceiptDetail): void {
    this.selected.set(detail);
    this.form.patchValue(detail);
    this.modalMode.set('edit');
  }

  openDelete(detail: CashReceiptDetail): void {
    this.selected.set(detail);
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
      const request: CreateCashReceiptDetailRequest = this.form.value;
      this.detailUseCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadDetails(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear detalle'),
      });
    } else if (this.modalMode() === 'edit' && this.selected()) {
      const request: UpdateCashReceiptDetailRequest = this.form.value;
      this.detailUseCase.update(this.selected()!.rcdId, request).subscribe({
        next: () => { this.closeModal(); this.loadDetails(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar detalle'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selected()) return;
    this.modalErrorMessage.set(null);
    this.detailUseCase.delete(this.selected()!.rcdId).subscribe({
      next: () => { this.closeModal(); this.loadDetails(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar detalle'),
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.loadDetails(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.loadDetails(); }
  }
}
