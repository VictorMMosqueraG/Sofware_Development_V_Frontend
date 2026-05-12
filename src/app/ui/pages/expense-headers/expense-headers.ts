import { Component, OnInit, signal } from '@angular/core';
import { CreateExpenseHeaderRequest, ExpenseHeader, ExpenseHeaderSearchQuery, UpdateExpenseHeaderRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseHeaderUseCase } from '../../../domain/usecase/expense-headers/expense-header.usecase';
import { CommonModule, DatePipe } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-expense-headers',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './expense-headers.html',
  styleUrl: './expense-headers.css',
})
export class ExpenseHeaders implements OnInit {

  items: ExpenseHeader[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading           = signal(false);
  modalMode         = signal<ModalMode>(null);
  selectedItem      = signal<ExpenseHeader | null>(null);
  modalErrorMessage = signal<string | null>(null);
  filterEstado = '';
  filterSedeId = '';

  form: FormGroup;

  constructor(
    private readonly useCase: ExpenseHeaderUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      sedeId:                 [null, Validators.required],
      noEgreso:               [null, Validators.required],
      fechaDocumento:         ['', Validators.required],
      terceroIdentificacion:  ['', [Validators.required, Validators.maxLength(30)]],
      terceroNombre:          [''],
      detalle:                ['', [Validators.required, Validators.maxLength(300)]],
      fpId:                   [null, Validators.required],
      conId:                  [null, Validators.required],
      noDocumento:            ['', Validators.required],
      valorEgreso:            [0, [Validators.required, Validators.min(0)]],
      usuId:                  [null, Validators.required],
      egrEstado:              ['ACTIVO', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    const query: ExpenseHeaderSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'egrId', order: 'asc' },
      ...(this.filterEstado && { egrEstado: this.filterEstado }),
      ...(this.filterSedeId && { sedeId:    +this.filterSedeId }),
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
    if (field === 'egrEstado') this.filterEstado = value;
    if (field === 'sedeId')    this.filterSedeId = value;
    this.currentPage = 1;
    this.loadItems();
  }

  openCreate(): void {
    this.form.reset({ egrEstado: 'ACTIVO', valorEgreso: 0 });
    this.selectedItem.set(null);
    this.modalMode.set('create');
  }

  openEdit(item: ExpenseHeader): void {
    this.selectedItem.set(item);
    this.form.patchValue({
      sedeId:                item.sedeId,
      noEgreso:              item.noEgreso,
      fechaDocumento:        item.fechaDocumento,
      terceroIdentificacion: item.terceroIdentificacion,
      terceroNombre:         item.terceroNombre ?? '',
      detalle:               item.detalle,
      fpId:                  item.fpId,
      conId:                 item.conId,
      noDocumento:           item.noDocumento,
      valorEgreso:           item.valorEgreso,
      usuId:                 item.usuId,
      egrEstado:             item.egrEstado,
    });
    this.modalMode.set('edit');
  }

  openDelete(item: ExpenseHeader): void {
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
      const request: CreateExpenseHeaderRequest = this.form.value;
      this.useCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear egreso'),
      });
    } else if (this.modalMode() === 'edit' && this.selectedItem()) {
      const request: UpdateExpenseHeaderRequest = this.form.value;
      this.useCase.update(this.selectedItem()!.egrId, request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar egreso'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedItem()) return;
    this.modalErrorMessage.set(null);
    this.useCase.delete(this.selectedItem()!.egrId).subscribe({
      next: () => { this.closeModal(); this.loadItems(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar egreso'),
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
