import type { Pagination } from "@/interfaces";

export interface Caja {
  id: string;
  fechaArqueo: string;
  montoInicial: number;
  totalRecaudado: number;
  totalEfectivo: number;
  totalTarjeta: number;
  diferencia: number;
  createdAt: string;
  updatedAt: string;
}

export interface CajaResponse extends Pagination {
  arqueos: Caja[];
}

export interface CreateCajaDto {
  fechaArqueo: string;
  montoInicial: number;
  totalRecaudado: number;
  totalEfectivo: number;
  totalTarjeta: number;
  diferencia: number;
  open: boolean;
}

export type UpdateCajaDto = Partial<CreateCajaDto>;
