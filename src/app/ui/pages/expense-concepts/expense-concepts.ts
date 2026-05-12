import { Component, OnInit, signal } from '@angular/core';
import { CreateExpenseConceptRequest, ExpenseConcept, ExpenseConceptSearchQuery, UpdateExpenseConceptRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseConceptUseCase } from '../../../domain/usecase/expenseConcepts/expense-concept.usecase';
import { CommonModule, DatePipe } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-expense-concepts',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './expense-concepts.html',
  styleUrl: './expense-concepts.css',
})
export class ExpenseConcepts implements OnInit {

  items: ExpenseConcept[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading           = signal(false);
  modalMode         = signal<ModalMode>(null);
  selectedItem      = signal<ExpenseConcept | null>(null);
  modalErrorMessage = signal<string | null>(null);
  filterEstado = '';

  form: FormGroup;

  constructor(
    private readonly useCase: ExpenseConceptUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      conDescripcion: ['', [Validators.required, Validators.maxLength(100)]],
      conEstado:      ['ACTIVO', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    const query: ExpenseConceptSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'conId', order: 'asc' },
      ...(this.filterEstado && { conEstado: this.filterEstado }),
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

  onFilterChange(event: Event): void {
    this.filterEstado = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.loadItems();
  }

  openCreate(): void {
    this.form.reset({ conEstado: 'ACTIVO' });
    this.selectedItem.set(null);
    this.modalMode.set('create');
  }

  openEdit(item: ExpenseConcept): void {
    this.selectedItem.set(item);
    this.form.patchValue({
      conDescripcion: item.conDescripcion,
      conEstado:      item.conEstado,
    });
    this.modalMode.set('edit');
  }

  openDelete(item: ExpenseConcept): void {
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
      const request: CreateExpenseConceptRequest = this.form.value;
      this.useCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear registro'),
      });

    } else if (this.modalMode() === 'edit' && this.selectedItem()) {
      const request: UpdateExpenseConceptRequest = this.form.value;
      this.useCase.update(this.selectedItem()!.conId, request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar registro'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedItem()) return;
    this.modalErrorMessage.set(null);
    this.useCase.delete(this.selectedItem()!.conId).subscribe({
      next: () => { this.closeModal(); this.loadItems(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar registro'),
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
