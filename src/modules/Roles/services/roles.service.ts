import type { ApiResponse } from '@/interfaces';
import { API } from '../../../api/index';
import type { RoleResponse, Role, CreateRoleDto, UpdateRoleDto, AssignPermissionsDto, Permission } from '../interfaces';

export const rolesService = {
  getAll: async () => {
    const { data } = await API.get<ApiResponse<Role[]>>('/roles');
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await API.get<ApiResponse<Role>>(`/roles/${id}`);
    return data.data;
  },

  create: async (role: CreateRoleDto) => {
    const { data } = await API.post<ApiResponse<Role>>('/roles', role);
    return data.data;
  },

  update: async (id: string, role: UpdateRoleDto) => {
    const { data } = await API.patch<ApiResponse<Role>>(`/roles/${id}`, role);
    return data.data;
  },

  delete: async (id: string) => {
    const { data } = await API.delete<ApiResponse<any>>(`/roles/${id}`);
    return data;
  },

  // Obtener permisos de un rol
  getPermissions: async (roleId: string) => {
    const { data } = await API.get<ApiResponse<Permission[]>>(`/roles/${roleId}/permissions`);
    return data.data;
  },

  // Asignar permisos a un rol
  assignPermissions: async (roleId: string, payload: AssignPermissionsDto) => {
    const { data } = await API.post<ApiResponse<Role>>(`/roles/${roleId}/permissions`, payload);
    return data.data;
  },

  // Remover permisos de un rol
  removePermissions: async (roleId: string, payload: AssignPermissionsDto) => {
    const { data } = await API.delete<ApiResponse<Role>>(`/roles/${roleId}/permissions`, { data: payload });
    return data.data;
  },
};
