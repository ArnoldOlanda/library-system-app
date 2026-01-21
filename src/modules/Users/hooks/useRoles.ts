import { useQuery } from '@tanstack/react-query';
import { rolesService } from '@/modules/Users/services/roles.service';

// Query Keys
const QUERY_KEY = 'roles';

// Hook para obtener todos los roles
export function useRoles() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => rolesService.getAll(),
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });
}
