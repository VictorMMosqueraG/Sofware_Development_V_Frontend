import { Component, OnInit, signal } from '@angular/core';
import { CreateCustomerRequest, Customer, CustomerSearchQuery, UpdateCustomerRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CustomerUseCase } from '../../../domain/usecase/customers/customer.usecase';
import { CommonModule, DatePipe } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

const optionalEmailValidator = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(control.value) ? null : { email: true };
};

const READONLY_FIELDS = ['cliNumDocumento', 'cliCorreo', 'cliTipoDocumento'];

@Component({
  selector: 'app-customers',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers implements OnInit {

  customers: Customer[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading           = signal(false);
  modalMode         = signal<ModalMode>(null);
  selectedCustomer  = signal<Customer | null>(null);
  modalErrorMessage = signal<string | null>(null);
  filterEstado  = '';
  filterTipoDoc = '';

  form: FormGroup;

  constructor(
    private readonly customerUseCase: CustomerUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      cliNombre:        ['', [Validators.required, Validators.maxLength(60)]],
      cliApellidos:     ['', [Validators.required, Validators.maxLength(60)]],
      cliTipoDocumento: ['CC', Validators.required],
      cliNumDocumento:  ['', Validators.maxLength(30)],
      cliDireccion:     ['', Validators.maxLength(100)],
      cliTelefono:      ['', Validators.maxLength(20)],
      cliCorreo:        ['', [optionalEmailValidator, Validators.maxLength(100)]],
      cliEstado:        ['ACTIVO', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  private setReadonlyFields(disabled: boolean): void {
    READONLY_FIELDS.forEach(field =>
      disabled
        ? this.form.get(field)?.disable()
        : this.form.get(field)?.enable()
    );
  }

  loadCustomers(): void {
    this.loading.set(true);
    const query: CustomerSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'cliId', order: 'asc' },
      ...(this.filterEstado  && { cliEstado:        this.filterEstado }),
      ...(this.filterTipoDoc && { cliTipoDocumento: this.filterTipoDoc }),
    };
    this.customerUseCase.getAll(query).subscribe({
      next: (res) => {
        this.customers    = res?.results ?? [];
        this.totalRecords = res?.total   ?? 0;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFilterChange(field: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (field === 'cliEstado')        this.filterEstado  = value;
    if (field === 'cliTipoDocumento') this.filterTipoDoc = value;
    this.currentPage = 1;
    this.loadCustomers();
  }

  openCreate(): void {
    this.setReadonlyFields(false);
    this.form.reset({ cliTipoDocumento: 'CC', cliEstado: 'ACTIVO' });
    this.selectedCustomer.set(null);
    this.modalMode.set('create');
  }

  openEdit(customer: Customer): void {
    this.selectedCustomer.set(customer);
    this.form.patchValue({
      cliNombre:        customer.cliNombre,
      cliApellidos:     customer.cliApellidos,
      cliTipoDocumento: customer.cliTipoDocumento,
      cliNumDocumento:  customer.cliNumDocumento ?? '',
      cliDireccion:     customer.cliDireccion    ?? '',
      cliTelefono:      customer.cliTelefono     ?? '',
      cliCorreo:        customer.cliCorreo       ?? '',
      cliEstado:        customer.cliEstado,
    });
    this.setReadonlyFields(true);
    this.modalMode.set('edit');
  }

  openDelete(customer: Customer): void {
    this.selectedCustomer.set(customer);
    this.modalMode.set('delete');
  }

  closeModal(): void {
    this.setReadonlyFields(false);
    this.modalMode.set(null);
    this.selectedCustomer.set(null);
    this.form.reset();
    this.modalErrorMessage.set(null);
  }

  submitForm(): void {
    if (this.form.invalid) return;
    this.modalErrorMessage.set(null);

    if (this.modalMode() === 'create') {
      const request: CreateCustomerRequest = this.form.value;
      this.customerUseCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadCustomers(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear cliente'),
      });

    } else if (this.modalMode() === 'edit' && this.selectedCustomer()) {
      const request: UpdateCustomerRequest = {
        cliNombre:    this.form.get('cliNombre')?.value,
        cliApellidos: this.form.get('cliApellidos')?.value,
        cliDireccion: this.form.get('cliDireccion')?.value,
        cliTelefono:  this.form.get('cliTelefono')?.value,
        cliEstado:    this.form.get('cliEstado')?.value,
      };
      this.customerUseCase.update(this.selectedCustomer()!.cliId, request).subscribe({
        next: () => { this.closeModal(); this.loadCustomers(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar cliente'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedCustomer()) return;
    this.modalErrorMessage.set(null);
    this.customerUseCase.delete(this.selectedCustomer()!.cliId).subscribe({
      next: () => { this.closeModal(); this.loadCustomers(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar cliente'),
    });
  }

  getInitials(c: Customer): string {
    return `${c.cliNombre?.[0] ?? ''}${c.cliApellidos?.[0] ?? ''}`.toUpperCase();
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.loadCustomers(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.loadCustomers(); }
  }
}
