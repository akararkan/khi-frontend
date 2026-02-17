import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
})

// Attach Bearer token from the auth store on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('khi_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Redirect to login on 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401 || status === 403) {
      localStorage.removeItem('khi_token')
      localStorage.removeItem('khi_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api