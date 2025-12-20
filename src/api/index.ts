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
  (error) => {
    // You can handle global errors here
    return Promise.reject(error)
  }
)

API.interceptors.request.use(
  (config) => {
    // You can add authorization headers or other configurations here
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)