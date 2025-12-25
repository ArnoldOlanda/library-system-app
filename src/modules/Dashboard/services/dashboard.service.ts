import { API } from '@/api';
import type { ApiResponse } from '@/interfaces';

export interface DashboardSummary {
  totalProducts: number;
  totalClients: number;
  salesToday: number;
  revenueMonth: number;
}

export interface SalesChartData {
  date: string;
  total: number;
}

export interface TopProduct {
  nombre: string;
  totalvendido: string;
}

export interface RecentSale {
  id: string;
  total: number;
  fechaVenta: string;
  cliente: {
    nombre: string;
  } | null;
}

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const { data } = await API.get<ApiResponse<DashboardSummary>>('/dashboard/summary');
    return data.data;
  },

  getSalesChart: async (): Promise<SalesChartData[]> => {
    const { data } = await API.get<ApiResponse<SalesChartData[]>>('/dashboard/sales-chart');
    return data.data;
  },

  getTopProducts: async (): Promise<TopProduct[]> => {
    const { data } = await API.get<ApiResponse<TopProduct[]>>('/dashboard/top-products');
    return data.data;
  },

  getRecentSales: async (): Promise<RecentSale[]> => {
    const { data } = await API.get<ApiResponse<RecentSale[]>>('/dashboard/recent-sales');
    return data.data;
  },
};
