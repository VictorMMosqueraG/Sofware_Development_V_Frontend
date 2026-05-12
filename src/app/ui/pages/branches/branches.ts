import { Component, OnInit, signal } from '@angular/core';
import { CreateBranchRequest, Branch, BranchSearchQuery, UpdateBranchRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BranchUseCase } from '../../../domain/usecase/branches/branch.usecase';
import { CommonModule, DatePipe } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

@Component({
  selector: 'app-branches',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './branches.html',
  styleUrl: './branches.css',
})
export class Branches implements OnInit {

  branches: Branch[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading           = signal(false);
  modalMode         = signal<ModalMode>(null);
  selectedBranch    = signal<Branch | null>(null);
  modalErrorMessage = signal<string | null>(null);
  filterEstado = '';

  form: FormGroup;

  constructor(
    private readonly branchUseCase: BranchUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      sedeNombre:    ['', [Validators.required, Validators.maxLength(100)]],
      sedeDireccion: ['', Validators.maxLength(200)],
      sedeTelefono:  ['', Validators.maxLength(20)],
      sedeEstado:    ['ACTIVO', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): void {
    this.loading.set(true);
    const query: BranchSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'sedeId', order: 'asc' },
      ...(this.filterEstado && { sedeEstado: this.filterEstado }),
    };
    this.branchUseCase.getAll(query).subscribe({
      next: (res) => {
        this.branches    = res?.results ?? [];
        this.totalRecords = res?.total   ?? 0;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFilterChange(field: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (field === 'sedeEstado') this.filterEstado = value;
    this.currentPage = 1;
    this.loadBranches();
  }

  openCreate(): void {
    this.form.reset({ sedeEstado: 'ACTIVO' });
    this.selectedBranch.set(null);
    this.modalMode.set('create');
  }

  openEdit(branch: Branch): void {
    this.selectedBranch.set(branch);
    this.form.patchValue({
      sedeNombre:    branch.sedeNombre,
      sedeDireccion: branch.sedeDireccion ?? '',
      sedeTelefono:  branch.sedeTelefono  ?? '',
      sedeEstado:    branch.sedeEstado,
    });
    this.modalMode.set('edit');
  }

  openDelete(branch: Branch): void {
    this.selectedBranch.set(branch);
    this.modalMode.set('delete');
  }

  closeModal(): void {
    this.modalMode.set(null);
    this.selectedBranch.set(null);
    this.form.reset();
    this.modalErrorMessage.set(null);
  }

  submitForm(): void {
    if (this.form.invalid) return;
    this.modalErrorMessage.set(null);

    if (this.modalMode() === 'create') {
      const request: CreateBranchRequest = this.form.value;
      this.branchUseCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadBranches(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear sede'),
      });

    } else if (this.modalMode() === 'edit' && this.selectedBranch()) {
      const raw = this.form.getRawValue();
      const request: UpdateBranchRequest = {
        sedeNombre:    raw.sedeNombre,
        sedeDireccion: raw.sedeDireccion,
        sedeTelefono:  raw.sedeTelefono,
        sedeEstado:    raw.sedeEstado,
      };
      this.branchUseCase.update(this.selectedBranch()!.sedeId, request).subscribe({
        next: () => { this.closeModal(); this.loadBranches(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar sede'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedBranch()) return;
    this.modalErrorMessage.set(null);
    this.branchUseCase.delete(this.selectedBranch()!.sedeId).subscribe({
      next: () => { this.closeModal(); this.loadBranches(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar sede'),
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.loadBranches(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.loadBranches(); }
  }
}
