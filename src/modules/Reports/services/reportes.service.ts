import { API } from '@/api';
import type { ApiResponse } from '@/interfaces';
import type { ReporteInventario, ReporteVentas, ReporteCompras } from '../interfaces';

export const reportesService = {
  getReporteInventario: async (categoriaId?: string, stockBajo?: boolean) => {
    let url = '/reportes/inventario';
    const params = new URLSearchParams();
    
    if (categoriaId) params.append('categoriaId', categoriaId);
    if (stockBajo !== undefined) params.append('stockBajo', String(stockBajo));
    
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await API.get<ApiResponse<ReporteInventario>>(url);
    return response.data.data;
  },

  getReporteVentas: async (startDate?: string, endDate?: string, clienteId?: string) => {
    let url = '/reportes/ventas';
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (clienteId) params.append('clienteId', clienteId);
    
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await API.get<ApiResponse<ReporteVentas>>(url);
    return response.data.data;
  },

  getReporteCompras: async (startDate?: string, endDate?: string, proveedorId?: string) => {
    let url = '/reportes/compras';
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (proveedorId) params.append('proveedorId', proveedorId);
    
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await API.get<ApiResponse<ReporteCompras>>(url);
    return response.data.data;
  },

  getReporteInventarioPDF: (categoriaId?: string, stockBajo?: boolean) => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    const params = new URLSearchParams();
    
    if (categoriaId) params.append('categoriaId', categoriaId);
    if (stockBajo !== undefined) params.append('stockBajo', String(stockBajo));
    
    const queryString = params.toString();
    window.open(`${url}/reportes/inventario/pdf${queryString ? `?${queryString}` : ''}`);
  },

  getReporteVentasPDF: (startDate?: string, endDate?: string, clienteId?: string) => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (clienteId) params.append('clienteId', clienteId);
    
    const queryString = params.toString();
    window.open(`${url}/reportes/ventas/pdf${queryString ? `?${queryString}` : ''}`);
  },

  getReporteComprasPDF: (startDate?: string, endDate?: string, proveedorId?: string) => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (proveedorId) params.append('proveedorId', proveedorId);
    
    const queryString = params.toString();
    window.open(`${url}/reportes/compras/pdf${queryString ? `?${queryString}` : ''}`);
  },
};
