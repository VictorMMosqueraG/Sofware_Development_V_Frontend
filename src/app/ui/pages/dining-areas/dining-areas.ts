import { Component, OnInit, signal } from '@angular/core';
import { CreateDiningAreaRequest, DiningArea, DiningAreaSearchQuery, UpdateDiningAreaRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DiningAreaUseCase } from '../../../domain/usecase/dining-areas/dining-area.usecase';
import { CommonModule, DatePipe } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-dining-areas',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './dining-areas.html',
  styleUrl: './dining-areas.css',
})
export class DiningAreas implements OnInit {

  diningAreas: DiningArea[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading            = signal(false);
  modalMode          = signal<ModalMode>(null);
  selectedDiningArea = signal<DiningArea | null>(null);
  modalErrorMessage  = signal<string | null>(null);
  filterEstado = '';
  filterSedeId = '';

  form: FormGroup;

  constructor(
    private readonly diningAreaUseCase: DiningAreaUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      sedeId:     [null, [Validators.required, Validators.min(1)]],
      areaNombre: ['', [Validators.required, Validators.maxLength(100)]],
      areaEstado: ['ACTIVO', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadDiningAreas();
  }

  loadDiningAreas(): void {
    this.loading.set(true);
    const query: DiningAreaSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'areaId', order: 'asc' },
      ...(this.filterEstado && { areaEstado: this.filterEstado }),
      ...(this.filterSedeId && { sedeId: +this.filterSedeId }),
    };
    this.diningAreaUseCase.getAll(query).subscribe({
      next: (res) => {
        this.diningAreas  = res?.results ?? [];
        this.totalRecords = res?.total   ?? 0;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFilterChange(field: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (field === 'areaEstado') this.filterEstado = value;
    if (field === 'sedeId')     this.filterSedeId = value;
    this.currentPage = 1;
    this.loadDiningAreas();
  }

  openCreate(): void {
    this.form.reset({ areaEstado: 'ACTIVO' });
    this.selectedDiningArea.set(null);
    this.modalMode.set('create');
  }

  openEdit(area: DiningArea): void {
    this.selectedDiningArea.set(area);
    this.form.patchValue({
      sedeId:     area.sedeId,
      areaNombre: area.areaNombre,
      areaEstado: area.areaEstado,
    });
    this.modalMode.set('edit');
  }

  openDelete(area: DiningArea): void {
    this.selectedDiningArea.set(area);
    this.modalMode.set('delete');
  }

  closeModal(): void {
    this.modalMode.set(null);
    this.selectedDiningArea.set(null);
    this.form.reset();
    this.modalErrorMessage.set(null);
  }

  submitForm(): void {
    if (this.form.invalid) return;
    this.modalErrorMessage.set(null);

    if (this.modalMode() === 'create') {
      const request: CreateDiningAreaRequest = this.form.value;
      this.diningAreaUseCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadDiningAreas(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear área de mesa'),
      });

    } else if (this.modalMode() === 'edit' && this.selectedDiningArea()) {
      const raw = this.form.getRawValue();
      const request: UpdateDiningAreaRequest = {
        sedeId:     raw.sedeId,
        areaNombre: raw.areaNombre,
        areaEstado: raw.areaEstado,
      };
      this.diningAreaUseCase.update(this.selectedDiningArea()!.areaId, request).subscribe({
        next: () => { this.closeModal(); this.loadDiningAreas(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar área de mesa'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedDiningArea()) return;
    this.modalErrorMessage.set(null);
    this.diningAreaUseCase.delete(this.selectedDiningArea()!.areaId).subscribe({
      next: () => { this.closeModal(); this.loadDiningAreas(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar área de mesa'),
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.loadDiningAreas(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.loadDiningAreas(); }
  }
}
