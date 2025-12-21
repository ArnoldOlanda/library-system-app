import type { Pagination } from '@/interfaces';
import type { Categoria } from '@/modules/Categories/interfaces';

export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  categoria: Categoria;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  descripcion?: string;
  estado: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductResponse extends Pagination {
  productos: Producto[];
}

export interface CreateProductoDto {
  codigo: string;
  nombre: string;
  categoriaId: string;
  precioCompra: number;
  precioVenta: number;
  stock?: number;
  stockMinimo?: number;
  descripcion?: string;
  estado?: boolean;
}

export interface UpdateProductoDto extends Partial<CreateProductoDto> {}
