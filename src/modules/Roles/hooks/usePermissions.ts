import { useQuery } from '@tanstack/react-query';
import { permissionsService } from '../services/permissions.service';

export function usePermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: permissionsService.getAll,
  });
}

export function usePermission(id: string) {
  return useQuery({
    queryKey: ['permissions', id],
    queryFn: () => permissionsService.getById(id),
    enabled: !!id,
  });
}
