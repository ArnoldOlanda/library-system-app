import axios from "axios"

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Manejar error 401 (No autorizado)
    if (error.response?.status === 401) {
      // Limpiar auth store y redirigir al login
      const { useAuthStore } = await import('@/stores/authStore');
      useAuthStore.getState().clearAuth();
      // window.location.href = '/login';
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