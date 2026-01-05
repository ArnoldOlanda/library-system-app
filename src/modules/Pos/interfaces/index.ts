import type { Pagination } from "@/interfaces";
import type { Cliente } from "@/modules/Customers/interfaces";
import type { Producto } from "@/modules/Products/interfaces";

export enum FormaPago {
  EFECTIVO = 'Efectivo',
  TARJETA = 'Tarjeta',
  TRANSFERENCIA = 'Transferencia',
  YAPE = 'Yape',
  PLIN = 'Plin',
}

export interface DetalleVenta {
  id: string;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
}

export interface Venta {
  id: string;
  cliente: Cliente | null;
  fechaVenta: string;
  total: number;
  formaPago: FormaPago;
  detalles: DetalleVenta[];
  createdAt: string;
  updatedAt: string;
}

export interface VentaResponse extends Pagination {
  ventas: Venta[];
}

export interface CreateDetalleVentaDto {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
}

export interface CreateVentaDto {
  clienteId?: string;
  fechaVenta: string;
  formaPago: FormaPago;
  detalles: CreateDetalleVentaDto[];
}

export interface UpdateVentaDto extends Partial<CreateVentaDto> {}

// Interfaces para el carrito de compras del POS
export interface CartItem {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
