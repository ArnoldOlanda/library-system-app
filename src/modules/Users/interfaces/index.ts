import type { Pagination } from '@/interfaces';

export interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roles: Role[];
  isActive: boolean;
  isSocialLogin: boolean;
  socialProvider?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse extends Pagination {
  users: User[];
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface AssignRoleDto {
  roleId: string;
}
