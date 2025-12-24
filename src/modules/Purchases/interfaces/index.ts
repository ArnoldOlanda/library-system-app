import type { Pagination } from '@/interfaces';

export interface Proveedor {
  id: string;
  nombre: string;
  contacto?: string;
  telefono?: string;
}

export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  precioCompra: number;
  stock: number;
}

export interface DetalleCompra {
  id: string;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
}

export interface Compra {
  id: string;
  proveedor: Proveedor;
  fechaCompra: string;
  total: number;
  detalles: DetalleCompra[];
  createdAt: string;
  updatedAt: string;
}

export interface CompraResponse extends Pagination {
  compras: Compra[];
}

export interface DetalleCompraDto {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
}

export interface CreateCompraDto {
  proveedorId: string;
  fechaCompra: string;
  detalles: DetalleCompraDto[];
}
