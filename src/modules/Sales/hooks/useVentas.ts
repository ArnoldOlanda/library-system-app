import { useQuery } from '@tanstack/react-query';
import { ventasService } from '../services/ventas.service';

export const useVentas = (page: number = 1, limit: number = 10, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['ventas', page, limit, startDate, endDate],
    queryFn: () => ventasService.getAll(page, limit, startDate, endDate),
  });
};
