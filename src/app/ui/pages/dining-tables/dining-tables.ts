import { Component, OnInit, signal } from '@angular/core';
import { CreateDiningTableRequest, DiningTable, DiningTableSearchQuery, UpdateDiningTableRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DiningTableUseCase } from '../../../domain/usecase/dining-tables/dining-table.usecase';
import { CommonModule, DatePipe } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-dining-tables',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './dining-tables.html',
  styleUrl: './dining-tables.css',
})
export class DiningTables implements OnInit {

  diningTables: DiningTable[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading             = signal(false);
  modalMode           = signal<ModalMode>(null);
  selectedDiningTable = signal<DiningTable | null>(null);
  modalErrorMessage   = signal<string | null>(null);
  filterEstado = '';
  filterSedeId = '';

  form: FormGroup;

  constructor(
    private readonly diningTableUseCase: DiningTableUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      sedeId:     [null, [Validators.required, Validators.min(1)]],
      areaId:     [null],
      mesaNumero: ['', [Validators.required, Validators.maxLength(20)]],
      capacidad:  [null, [Validators.required, Validators.min(1)]],
      xPos:       [0, Validators.required],
      yPos:       [0, Validators.required],
      estado:     ['DISPONIBLE', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadDiningTables();
  }

  loadDiningTables(): void {
    this.loading.set(true);
    const query: DiningTableSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'mesaId', order: 'asc' },
      ...(this.filterEstado && { estado: this.filterEstado }),
      ...(this.filterSedeId && { sedeId: +this.filterSedeId }),
    };
    this.diningTableUseCase.getAll(query).subscribe({
      next: (res) => {
        this.diningTables = res?.results ?? [];
        this.totalRecords = res?.total   ?? 0;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFilterChange(field: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (field === 'estado') this.filterEstado = value;
    if (field === 'sedeId') this.filterSedeId = value;
    this.currentPage = 1;
    this.loadDiningTables();
  }

  openCreate(): void {
    this.form.reset({ estado: 'DISPONIBLE', xPos: 0, yPos: 0 });
    this.selectedDiningTable.set(null);
    this.modalMode.set('create');
  }

  openEdit(table: DiningTable): void {
    this.selectedDiningTable.set(table);
    this.form.patchValue({
      sedeId:     table.sedeId,
      areaId:     table.areaId ?? null,
      mesaNumero: table.mesaNumero,
      capacidad:  table.capacidad,
      xPos:       table.xPos,
      yPos:       table.yPos,
      estado:     table.estado,
    });
    this.modalMode.set('edit');
  }

  openDelete(table: DiningTable): void {
    this.selectedDiningTable.set(table);
    this.modalMode.set('delete');
  }

  closeModal(): void {
    this.modalMode.set(null);
    this.selectedDiningTable.set(null);
    this.form.reset();
    this.modalErrorMessage.set(null);
  }

  submitForm(): void {
    if (this.form.invalid) return;
    this.modalErrorMessage.set(null);

    if (this.modalMode() === 'create') {
      const request: CreateDiningTableRequest = this.form.value;
      this.diningTableUseCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadDiningTables(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear mesa'),
      });

    } else if (this.modalMode() === 'edit' && this.selectedDiningTable()) {
      const raw = this.form.getRawValue();
      const request: UpdateDiningTableRequest = {
        sedeId:     raw.sedeId,
        areaId:     raw.areaId,
        mesaNumero: raw.mesaNumero,
        capacidad:  raw.capacidad,
        xPos:       raw.xPos,
        yPos:       raw.yPos,
        estado:     raw.estado,
      };
      this.diningTableUseCase.update(this.selectedDiningTable()!.mesaId, request).subscribe({
        next: () => { this.closeModal(); this.loadDiningTables(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar mesa'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedDiningTable()) return;
    this.modalErrorMessage.set(null);
    this.diningTableUseCase.delete(this.selectedDiningTable()!.mesaId).subscribe({
      next: () => { this.closeModal(); this.loadDiningTables(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar mesa'),
    });
  }

  getEstadoClass(estado: string): string {
    if (estado === 'DISPONIBLE') return 'active';
    if (estado === 'INACTIVA')   return 'inactive';
    return '';
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.loadDiningTables(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.loadDiningTables(); }
  }
}
