import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

const QUERY_KEY = 'dashboard';

export function useDashboardSummary() {
  return useQuery({
    queryKey: [QUERY_KEY, 'summary'],
    queryFn: dashboardService.getSummary,
  });
}

export function useSalesChart() {
  return useQuery({
    queryKey: [QUERY_KEY, 'sales-chart'],
    queryFn: dashboardService.getSalesChart,
  });
}

export function useTopProducts() {
  return useQuery({
    queryKey: [QUERY_KEY, 'top-products'],
    queryFn: dashboardService.getTopProducts,
  });
}

export function useRecentSales() {
  return useQuery({
    queryKey: [QUERY_KEY, 'recent-sales'],
    queryFn: dashboardService.getRecentSales,
  });
}
