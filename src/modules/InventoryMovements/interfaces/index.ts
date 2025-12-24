import type { Pagination } from '@/interfaces';

export const TipoMovimiento = {
  ENTRADA: 'Entrada',
  SALIDA: 'Salida',
  AJUSTE_ENTRADA: 'Ajuste Entrada',
  AJUSTE_SALIDA: 'Ajuste Salida',
} as const;

export type TipoMovimiento = typeof TipoMovimiento[keyof typeof TipoMovimiento];

export const OrigenMovimiento = {
  COMPRA: 'Compra',
  VENTA: 'Venta',
  AJUSTE_MANUAL: 'Ajuste Manual',
  DEVOLUCION_COMPRA: 'Devolución Compra',
  DEVOLUCION_VENTA: 'Devolución Venta',
} as const;

export type OrigenMovimiento = typeof OrigenMovimiento[keyof typeof OrigenMovimiento];

export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  categoria: {
    id: string;
    nombre: string;
  };
}

export interface Usuario {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface MovimientoAlmacen {
  id: string;
  producto: Producto;
  tipoMovimiento: TipoMovimiento;
  origenMovimiento: OrigenMovimiento;
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  referenciaId?: string;
  observaciones?: string;
  usuario: Usuario;
  fechaMovimiento: string;
  createdAt: string;
}

export interface MovimientoAlmacenResponse extends Pagination {
  movimientos: MovimientoAlmacen[];
}

export interface CreateMovimientoAlmacenDto {
  productoId: string;
  tipoMovimiento: TipoMovimiento;
  origenMovimiento: OrigenMovimiento;
  cantidad: number;
  referenciaId?: string;
  observaciones?: string;
}

export interface QueryMovimientoAlmacenDto {
  limit?: number;
  offset?: number;
  productoId?: string;
  tipoMovimiento?: TipoMovimiento;
  origenMovimiento?: OrigenMovimiento;
  referenciaId?: string;
}
