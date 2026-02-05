import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/modules/Auth/interfaces';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  permissions: string[];
  
  // Actions
  setAuth: (user: User, token: string, permissions: string[]) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      permissions: [],

      setAuth: (user, token, permissions) => {
        set({
          user,
          token,
          isAuthenticated: true,
          permissions,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          permissions: [],
        });

        //Limpiar ssesion ID del scanner al cerrar sesion
        localStorage.removeItem('scanner-session-id');
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'auth-storage', // nombre de la key en localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
      }),
    }
  )
);
