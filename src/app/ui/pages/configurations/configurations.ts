import { Component, OnInit, signal } from '@angular/core';
import { CreateConfigurationRequest, Configuration, ConfigurationSearchQuery, UpdateConfigurationRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigurationUseCase } from '../../../domain/usecase/configurations/configuration.usecase';
import { CommonModule, DatePipe } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-configurations',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './configurations.html',
  styleUrl: './configurations.css',
})
export class Configurations implements OnInit {

  items: Configuration[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading           = signal(false);
  modalMode         = signal<ModalMode>(null);
  selectedItem      = signal<Configuration | null>(null);
  modalErrorMessage = signal<string | null>(null);

  form: FormGroup;

  constructor(
    private readonly useCase: ConfigurationUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      cfgClave: ['', [Validators.required, Validators.maxLength(100)]],
      cfgValor: [''],
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    const query: ConfigurationSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'cfgId', order: 'asc' },
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

  openCreate(): void {
    this.form.reset();
    this.selectedItem.set(null);
    this.modalMode.set('create');
  }

  openEdit(item: Configuration): void {
    this.selectedItem.set(item);
    this.form.patchValue({
      cfgClave: item.cfgClave,
      cfgValor: item.cfgValor ?? '',
    });
    this.modalMode.set('edit');
  }

  openDelete(item: Configuration): void {
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
      const request: CreateConfigurationRequest = this.form.value;
      this.useCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear registro'),
      });

    } else if (this.modalMode() === 'edit' && this.selectedItem()) {
      const request: UpdateConfigurationRequest = this.form.value;
      this.useCase.update(this.selectedItem()!.cfgId, request).subscribe({
        next: () => { this.closeModal(); this.loadItems(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar registro'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedItem()) return;
    this.modalErrorMessage.set(null);
    this.useCase.delete(this.selectedItem()!.cfgId).subscribe({
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
