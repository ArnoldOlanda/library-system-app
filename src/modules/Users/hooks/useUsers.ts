import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/modules/Users/services/users.service';
import type { CreateUserDto, UpdateUserDto } from '../interfaces';

// Query Keys
const QUERY_KEY = 'users';

// Hooks para queries (GET)
export function useUsers(page?: number, limit?: number, search?: string) {
  return useQuery({
    queryKey: [QUERY_KEY, page, limit, search],
    queryFn: () => usersService.getAll(page, limit, search),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => usersService.getById(id),
    enabled: !!id,
  });
}

// Hooks para mutaciones (POST, PUT, DELETE)
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: CreateUserDto) => usersService.create(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      usersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      usersService.assignRole(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useRemoveRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      usersService.removeRole(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
