import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  route: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() open = true;
  @Output() toggle = new EventEmitter<void>();

  openGroup = signal<string | null>('Facturación');

  constructor(private router: Router) {}

  groups: NavGroup[] = [
    {
      title: 'Núcleo',
      items: [
        { label: 'Perfiles',  route: '/profiles' },
        { label: 'Usuarios',  route: '/users' },
        { label: 'Sedes',     route: '/branches' },
      ],
    },
    {
      title: 'Pedidos y Comandas',
      items: [
        { label: 'Áreas',          route: '/dining-areas' },
        { label: 'Mesas',          route: '/dining-tables' },
        { label: 'Categ. Plato',   route: '/dish-categories' },
        { label: 'Platos',         route: '/dishes' },
        { label: 'Pedidos',        route: '/orders' },
        { label: 'Detalle Pedido', route: '/order-details' },
        { label: 'Reservaciones',  route: '/reservations' },
      ],
    },
    {
      title: 'Inventario',
      items: [
        { label: 'Unid. Medida',    route: '/presentations' },
        { label: 'Categ. Insumo',   route: '/supply-categories' },
        { label: 'Insumos',         route: '/supplies' },
        { label: 'Movimientos',     route: '/inventory-logs' },
        { label: 'Ingredientes',    route: '/dish-ingredients' },
      ],
    },
    {
      title: 'Facturación',
      items: [
        { label: 'Clientes',        route: '/customers' },
        { label: 'Recibos de Caja', route: '/cash-receipts' },
        { label: 'Detalle Recibos', route: '/cash-receipt-details' },
      ],
    },
    {
      title: 'Egresos',
      items: [
        { label: 'Formas de Pago',  route: '/payment-methods' },
        { label: 'Conceptos',       route: '/expense-concepts' },
        { label: 'Registro',        route: '/expense-headers' },
      ],
    },
    {
      title: 'PQRS',
      items: [
        { label: 'Tipos',  route: '/pqrs-types' },
        { label: 'Casos',  route: '/pqrs' },
      ],
    },
    {
      title: 'Reportes',
      items: [
        { label: 'Ventas de Platos', route: '/reports' },
      ],
    },
    {
      title: 'Sistema',
      items: [
        { label: 'Tipos de Estado', route: '/status-types' },
        { label: 'Estados',         route: '/statuses' },
        { label: 'Configuración',   route: '/configurations' },
      ],
    },
  ];

  toggleGroup(title: string): void {
    this.openGroup.update(current => current === title ? null : title);
  }

  isExpanded(title: string): boolean {
    return this.openGroup() === title;
  }

  isGroupActive(group: NavGroup): boolean {
    const url = this.router.url;
    return group.items.some(item => url.startsWith(item.route));
  }
}
