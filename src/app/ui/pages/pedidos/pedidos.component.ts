import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
}

interface ItemPedido {
  id: number;
  producto: Producto;
  cantidad: number;
  notas?: string;
}

interface Mesa {
  id: number;
  numero: number;
  ocupada: boolean;
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent {
  
  readonly mesas = signal<Mesa[]>([
    { id: 1, numero: 1, ocupada: false },
    { id: 2, numero: 2, ocupada: true },
    { id: 3, numero: 3, ocupada: false },
    { id: 4, numero: 4, ocupada: false },
    { id: 5, numero: 5, ocupada: true },
    { id: 6, numero: 6, ocupada: false },
  ]);

  readonly menu: Producto[] = [
    { id: 1, nombre: 'Ensalada César', precio: 8500, categoria: 'Entradas' },
    { id: 2, nombre: 'Sopa del día', precio: 6000, categoria: 'Entradas' },
    { id: 3, nombre: 'Nachos con Guacamole', precio: 9500, categoria: 'Entradas' },
    { id: 4, nombre: 'Lomo de Res', precio: 28000, categoria: 'Platos Principales' },
    { id: 5, nombre: 'Pollo a la Parrilla', precio: 18500, categoria: 'Platos Principales' },
    { id: 6, nombre: 'Pasta Carbonara', precio: 16000, categoria: 'Platos Principales' },
    { id: 7, nombre: 'Salmón a la Plancha', precio: 32000, categoria: 'Platos Principales' },
    { id: 8, nombre: 'Hamburguesa Clásica', precio: 15000, categoria: 'Platos Principales' },
    { id: 9, nombre: 'Tiramisú', precio: 9000, categoria: 'Postres' },
    { id: 10, nombre: 'Cheesecake', precio: 8500, categoria: 'Postres' },
    { id: 11, nombre: 'Helado Artesanal', precio: 7000, categoria: 'Postres' },
    { id: 12, nombre: 'Coca-Cola', precio: 3500, categoria: 'Bebidas' },
    { id: 13, nombre: 'Jugo Natural', precio: 5000, categoria: 'Bebidas' },
    { id: 14, nombre: 'Agua Mineral', precio: 2500, categoria: 'Bebidas' },
    { id: 15, nombre: 'Cerveza Artesanal', precio: 8000, categoria: 'Bebidas' },
  ];

  readonly categorias = ['Entradas', 'Platos Principales', 'Postres', 'Bebidas'];
  
  mesaSeleccionada = signal<Mesa | null>(null);
  categoriaActiva = signal<string>('Entradas');
  itemsPedido = signal<ItemPedido[]>([]);
  notaItem = signal<string>('');
  private nextItemId = 1;

  readonly productosFiltrados = computed(() => 
    this.menu.filter(p => p.categoria === this.categoriaActiva())
  );

  readonly total = computed(() => 
    this.itemsPedido().reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0)
  );

  seleccionarMesa(mesa: Mesa): void {
    this.mesaSeleccionada.set(mesa);
    this.itemsPedido.set([]);
  }

  seleccionarCategoria(categoria: string): void {
    this.categoriaActiva.set(categoria);
  }

  agregarProducto(producto: Producto): void {
    const items = this.itemsPedido();
    const existente = items.find(i => i.producto.id === producto.id);
    
    if (existente) {
      this.itemsPedido.set(items.map(i => 
        i.id === existente.id ? { ...i, cantidad: i.cantidad + 1 } : i
      ));
    } else {
      this.itemsPedido.set([...items, {
        id: this.nextItemId++,
        producto,
        cantidad: 1
      }]);
    }
  }

  incrementarCantidad(itemId: number): void {
    this.itemsPedido.update(items => 
      items.map(i => i.id === itemId ? { ...i, cantidad: i.cantidad + 1 } : i)
    );
  }

  decrementarCantidad(itemId: number): void {
    const item = this.itemsPedido().find(i => i.id === itemId);
    if (item && item.cantidad > 1) {
      this.itemsPedido.update(items => 
        items.map(i => i.id === itemId ? { ...i, cantidad: i.cantidad - 1 } : i)
      );
    } else {
      this.eliminarItem(itemId);
    }
  }

  eliminarItem(itemId: number): void {
    this.itemsPedido.update(items => items.filter(i => i.id !== itemId));
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  }

  enviarPedido(): void {
    if (this.itemsPedido().length > 0 && this.mesaSeleccionada()) {
      alert(`Pedido enviado para Mesa ${this.mesaSeleccionada()?.numero}\nTotal: ${this.formatearPrecio(this.total())}`);
      this.mesas.update(mesas => 
        mesas.map(m => m.id === this.mesaSeleccionada()?.id ? { ...m, ocupada: true } : m)
      );
      this.itemsPedido.set([]);
      this.mesaSeleccionada.set(null);
    }
  }

  cancelarPedido(): void {
    this.itemsPedido.set([]);
  }

  volverAMesas(): void {
    this.mesaSeleccionada.set(null);
    this.itemsPedido.set([]);
  }
}
