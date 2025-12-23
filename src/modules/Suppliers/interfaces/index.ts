import type { Pagination } from "@/interfaces";

export interface Proveedor {
  id: string;
  nombre: string;
  contacto?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProveedorResponse extends Pagination {
  proveedores: Proveedor[];
}

export interface CreateProveedorDto {
  nombre: string;
  contacto?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
}

export interface UpdateProveedorDto {
  nombre?: string;
  contacto?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
}
