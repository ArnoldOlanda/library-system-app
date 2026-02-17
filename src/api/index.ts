import axios from "axios"
import type { RefreshTokenResponse } from "@/interfaces";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1"

export const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Manejar error 401 (No autorizado) y la ruta es distinta a /auth/refresh-token y /login
    if (error.response?.status === 401 && !error.config.url?.includes('/auth/refresh-token') && !error.config.url?.includes('/auth/login')) {
      
      const { useAuthStore } = await import('@/stores/authStore');
      //Llamar al enpoint de revalidacion de token
      try {
        const { data } = await API.post<RefreshTokenResponse>('/auth/refresh-token');
        const currentUser = useAuthStore.getState().user;
        const permissions = useAuthStore.getState().permissions;
        useAuthStore.getState().setAuth(currentUser as any, data.data.token, permissions);
        // Reintentar la solicitud original con el nuevo token
        const originalRequest = error.config;
        originalRequest.headers['Authorization'] = `Bearer ${data.data.token}`;
        return API.request(originalRequest);
      } catch (error) {
        console.log(error);
        useAuthStore.getState().clearAuth();
      }

    }
    return Promise.reject(error)
  }
)

API.interceptors.request.use(
  (config) => {
    // Agregar token de autorización si existe
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const authData = JSON.parse(token);
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth token:', error);
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)