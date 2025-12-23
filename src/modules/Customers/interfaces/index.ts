import type { Pagination } from "@/interfaces";

export interface Cliente {
  id: string;
  nombre: string;
  dni?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClienteResponse extends Pagination {
  clientes: Cliente[];
}

export interface CreateClienteDto {
  nombre: string;
  dni?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
}

export interface UpdateClienteDto {
  nombre?: string;
  dni?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
}
