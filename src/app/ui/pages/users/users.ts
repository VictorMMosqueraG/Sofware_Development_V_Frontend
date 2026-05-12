import { Component, OnInit, signal } from '@angular/core';
import { CreateUserRequest, User, UserSearchQuery, UpdateUserRequest } from '../../../domain/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserUseCase } from '../../../domain/usecase/users/user.usecase';
import { CommonModule, DatePipe } from '@angular/common';

type ModalMode = 'create' | 'edit' | 'delete' | null;

const optionalEmailValidator = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(control.value) ? null : { email: true };
};

@Component({
  selector: 'app-users',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {

  users: User[] = [];
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  loading           = signal(false);
  modalMode         = signal<ModalMode>(null);
  selectedUser      = signal<User | null>(null);
  modalErrorMessage = signal<string | null>(null);
  filterEstado = '';

  form: FormGroup;

  constructor(
    private readonly userUseCase: UserUseCase,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      usuNombre:    ['', [Validators.required, Validators.maxLength(60)]],
      usuApellido:  ['', [Validators.required, Validators.maxLength(60)]],
      usuDireccion: ['', [Validators.required, Validators.maxLength(200)]],
      usuTelefono:  ['', [Validators.required, Validators.maxLength(20)]],
      usuCorreo:    ['', [Validators.required, optionalEmailValidator, Validators.maxLength(100)]],
      perfId:       [null],
      usuLogin:     ['', [Validators.required, Validators.maxLength(50)]],
      usuPass:      ['', [Validators.required, Validators.maxLength(100)]],
      usuEstado:    ['ACTIVO', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    const query: UserSearchQuery = {
      pagination: { page: this.currentPage, pageSize: this.pageSize, sort: 'usuId', order: 'asc' },
      ...(this.filterEstado && { usuEstado: this.filterEstado }),
    };
    this.userUseCase.getAll(query).subscribe({
      next: (res) => {
        this.users        = res?.results ?? [];
        this.totalRecords = res?.total   ?? 0;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFilterChange(field: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (field === 'usuEstado') this.filterEstado = value;
    this.currentPage = 1;
    this.loadUsers();
  }

  openCreate(): void {
    this.form.reset({ usuEstado: 'ACTIVO' });
    this.form.get('usuLogin')?.enable();
    this.form.get('usuPass')?.enable();
    this.selectedUser.set(null);
    this.modalMode.set('create');
  }

  openEdit(user: User): void {
    this.selectedUser.set(user);
    this.form.patchValue({
      usuNombre:    user.usuNombre,
      usuApellido:  user.usuApellido,
      usuDireccion: user.usuDireccion,
      usuTelefono:  user.usuTelefono,
      usuCorreo:    user.usuCorreo,
      perfId:       user.perfId ?? null,
      usuLogin:     user.usuLogin,
      usuPass:      '',
      usuEstado:    user.usuEstado,
    });
    this.form.get('usuLogin')?.disable();
    this.form.get('usuPass')?.disable();
    this.modalMode.set('edit');
  }

  openDelete(user: User): void {
    this.selectedUser.set(user);
    this.modalMode.set('delete');
  }

  closeModal(): void {
    this.form.get('usuLogin')?.enable();
    this.form.get('usuPass')?.enable();
    this.modalMode.set(null);
    this.selectedUser.set(null);
    this.form.reset();
    this.modalErrorMessage.set(null);
  }

  submitForm(): void {
    if (this.form.invalid) return;
    this.modalErrorMessage.set(null);

    if (this.modalMode() === 'create') {
      const request: CreateUserRequest = this.form.value;
      this.userUseCase.create(request).subscribe({
        next: () => { this.closeModal(); this.loadUsers(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al crear usuario'),
      });

    } else if (this.modalMode() === 'edit' && this.selectedUser()) {
      const raw = this.form.getRawValue();
      const request: UpdateUserRequest = {
        usuNombre:    raw.usuNombre,
        usuApellido:  raw.usuApellido,
        usuDireccion: raw.usuDireccion,
        usuTelefono:  raw.usuTelefono,
        usuCorreo:    raw.usuCorreo,
        perfId:       raw.perfId,
        usuEstado:    raw.usuEstado,
      };
      this.userUseCase.update(this.selectedUser()!.usuId, request).subscribe({
        next: () => { this.closeModal(); this.loadUsers(); },
        error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al actualizar usuario'),
      });
    }
  }

  confirmDelete(): void {
    if (!this.selectedUser()) return;
    this.modalErrorMessage.set(null);
    this.userUseCase.delete(this.selectedUser()!.usuId).subscribe({
      next: () => { this.closeModal(); this.loadUsers(); },
      error: (err) => this.modalErrorMessage.set(err?.error?.detail ?? 'Error al eliminar usuario'),
    });
  }

  getInitials(u: User): string {
    return `${u.usuNombre?.[0] ?? ''}${u.usuApellido?.[0] ?? ''}`.toUpperCase();
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.loadUsers(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.loadUsers(); }
  }
}
