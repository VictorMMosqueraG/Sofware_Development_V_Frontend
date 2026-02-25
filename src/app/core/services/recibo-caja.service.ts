import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ReciboCaja } from '../models';

@Injectable({ providedIn: 'root' })
export class ReciboCajaService {

  private storageKey = 'recibos_vm';

  private _recibos = new BehaviorSubject<ReciboCaja[]>(
    JSON.parse(localStorage.getItem(this.storageKey) || '[]')
  );

  recibos$ = this._recibos.asObservable();

  get snapshot(): ReciboCaja[] {
    return this._recibos.value;
  }

  private saveStorage(data: ReciboCaja[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  create(data: Omit<ReciboCaja, 'id'>) {
    const current = this._recibos.value;

    const nuevo: ReciboCaja = {
      id: Date.now(),
      ...data
    };

    const updated = [...current, nuevo];

    this._recibos.next(updated);
    this.saveStorage(updated);
  }

  update(id: number, data: Omit<ReciboCaja, 'id'>) {
    const updated = this._recibos.value.map(recibo =>
      recibo.id === id
        ? { id, ...data }
        : recibo
    );

    this._recibos.next(updated);
    this.saveStorage(updated);
  }

  delete(id: number) {
    const updated = this._recibos.value.filter(r => r.id !== id);
    this._recibos.next(updated);
    this.saveStorage(updated);
  }

  getById(id: number): ReciboCaja | undefined {
    return this._recibos.value.find(r => r.id === id);
  }
}
