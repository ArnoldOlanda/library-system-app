// Tipos
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  isActive: boolean;
  isSocialLogin: boolean;
  socialProvider?: string;
  roles: Role[];
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  permissions: string[];
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}