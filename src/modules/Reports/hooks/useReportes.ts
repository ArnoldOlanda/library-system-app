import { useQuery } from '@tanstack/react-query';
import { reportesService } from '../services/reportes.service';

export const useReporteInventario = (categoriaId?: string, stockBajo?: boolean) => {
  return useQuery({
    queryKey: ['reporte-inventario', categoriaId, stockBajo],
    queryFn: () => reportesService.getReporteInventario(categoriaId, stockBajo),
  });
};

export const useReporteVentas = (startDate?: string, endDate?: string, clienteId?: string) => {
  return useQuery({
    queryKey: ['reporte-ventas', startDate, endDate, clienteId],
    queryFn: () => reportesService.getReporteVentas(startDate, endDate, clienteId),
  });
};

export const useReporteCompras = (startDate?: string, endDate?: string, proveedorId?: string) => {
  return useQuery({
    queryKey: ['reporte-compras', startDate, endDate, proveedorId],
    queryFn: () => reportesService.getReporteCompras(startDate, endDate, proveedorId),
  });
};
