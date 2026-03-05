import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  // ✅ FIX: Do NOT set withCredentials — we use JWT, not cookies
  withCredentials: false,
})

// Attach Bearer token from the auth store on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('khi_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // ✅ FIX: Prevent browser from caching authenticated responses
  config.headers['Cache-Control'] = 'no-cache'
  return config
})

// Redirect to login on 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401 || status === 403) {
      // ✅ FIX: Clear ALL stored auth data
      localStorage.removeItem('khi_token')
      localStorage.removeItem('khi_user')
      sessionStorage.clear()
      // Only redirect if not already on login page
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?expired=1'
      }
    }
    return Promise.reject(error)
  }
)

export default api