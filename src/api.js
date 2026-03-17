import axios from 'axios'
import { getCached, setCache, invalidateCache } from '@/utils/apiCache'
import { API_BASE } from '@/components/consts.js'

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
})

// ── Request interceptor ──────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('khi_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (config.method === 'get' && !config._skipCache) {
    const fullUrl = config.baseURL + config.url + (config.params ? '?' + new URLSearchParams(config.params).toString() : '')
    const cached = getCached(fullUrl)
    if (cached) {
      config.adapter = () => Promise.resolve({
        data: cached,
        status: 200,
        statusText: 'OK (cached)',
        headers: {},
        config,
      })
    }
  }

  return config
})

// ── Response interceptor ──────────
api.interceptors.response.use(
  (response) => {
    const { config } = response

    if (config.method === 'get' && response.status === 200 && !config._skipCache) {
      const fullUrl = config.baseURL + config.url + (config.params ? '?' + new URLSearchParams(config.params).toString() : '')
      setCache(fullUrl, response.data, getCacheTTL(config.url))
    }

    if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
      const basePath = extractBasePath(config.url)
      if (basePath) {
        invalidateCache(config.baseURL + basePath)
      }
    }

    return response
  },
  (error) => {
    const status = error?.response?.status
    if (status === 401 || status === 403) {
      localStorage.removeItem('khi_token')
      localStorage.removeItem('khi_user')
      sessionStorage.clear()
      
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?expired=1'
      }
    }
    return Promise.reject(error)
  }
)

function getCacheTTL(url) {
  if (url.includes('/api/about'))    return 10 * 60 * 1000
  if (url.includes('/api/projects')) return 5 * 60 * 1000
  if (url.includes('/api/news'))     return 3 * 60 * 1000
  if (url.includes('/api/user'))     return 60 * 1000
  return 5 * 60 * 1000
}

function extractBasePath(url) {
  const match = url.match(/^(\/api\/[^/?]+)/)
  return match ? match[1] : null
}

export default api