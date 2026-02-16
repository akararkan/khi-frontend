// stores/useAuthStore.js
// Pinia auth store — handles login, register, logout, and token persistence
// ✅ Fixed: Content-Type headers for backend compatibility
// ✅ Fixed: Admin role detection for all admin types

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// Admin roles that have access to dashboard
const ADMIN_ROLES = ['EMPLOYEE', 'ADMIN', 'SUPER_ADMIN']

export const useAuthStore = defineStore('auth', () => {
  // ─── State ───────────────────────────────────────────────────────────
  const token = ref(null)
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // ─── Computed ────────────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!token.value)
  const username = computed(() => user.value?.username || null)
  const role = computed(() => user.value?.role || null)
  
  // ✅ Check if user is any type of admin
  const hasAdminAccess = computed(() => {
    return role.value && ADMIN_ROLES.includes(role.value)
  })
  
  // Individual role checks
  const isGuest = computed(() => role.value === 'GUEST')
  const isEmployee = computed(() => role.value === 'EMPLOYEE')
  const isAdmin = computed(() => role.value === 'ADMIN')
  const isSuperAdmin = computed(() => role.value === 'SUPER_ADMIN')

  // ─── Actions ─────────────────────────────────────────────────────────

  /**
   * ✨ Hydrate auth state from localStorage on app init
   */
  function hydrate() {
    try {
      const storedToken = localStorage.getItem('khi_token')
      const storedUser = localStorage.getItem('khi_user')

      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        
        // Validate token expiry
        const payload = parseJwtPayload(storedToken)
        if (payload?.exp) {
          const isExpired = Date.now() >= payload.exp * 1000
          if (isExpired) {
            console.log('Token expired, clearing session')
            _clearSession()
            return false
          }
        }
        return true
      }
      return false
    } catch (err) {
      console.error('Hydration failed:', err)
      _clearSession()
      return false
    }
  }

  /**
   * POST /api/auth/login
   * ✅ CRITICAL FIX: Explicitly set Content-Type to application/json
   */
  async function login(username, password) {
    loading.value = true
    error.value = null

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // ✅ Explicit JSON content type
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      // Handle network errors
      if (!res.ok) {
        let data
        try {
          data = await res.json()
        } catch {
          // If response isn't JSON, create error object
          data = { message: `هەڵەی سێرڤەر: ${res.status} ${res.statusText}` }
        }

        // Handle specific error cases
        if (res.status === 401) {
          throw new Error('ناوی بەکارهێنەر یان وشەی نهێنی هەڵەیە')
        } else if (res.status === 403) {
          throw new Error('دەستگەیشتن قەدەغەیە')
        } else if (res.status === 404) {
          throw new Error('API نەدۆزرایەوە - تکایە بەرپرسی سیستەم پێ بڵێ')
        } else if (res.status === 500) {
          throw new Error(data.message || 'هەڵەی ناوخۆی سێرڤەر')
        } else {
          throw new Error(data.message || data.response || 'چوونەژوورەوە سەرکەوتوو نەبوو')
        }
      }

      const data = await res.json()

      // Extract token from various possible locations
      const tok = data.token || data?.data?.token || data?.accessToken
      if (!tok) {
        throw new Error('تۆکن وەرنەگیرا — دیسان هەوڵ بدەوە')
      }

      const payload = parseJwtPayload(tok)

      token.value = tok
      user.value = {
        username: payload?.sub || payload?.username || username,
        role:
          payload?.ROLE ||
          payload?.role ||
          payload?.authorities?.[0] ||
          'GUEST',
        userId: payload?.id || payload?.userId || null,
      }

      localStorage.setItem('khi_token', tok)
      localStorage.setItem('khi_user', JSON.stringify(user.value))

      return { ok: true }
    } catch (err) {
      // Network error (no response from server)
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        error.value = 'نەتوانرا پەیوەندی بە سێرڤەر بکرێت'
      } else {
        error.value = err?.message || 'هەڵەیەک ڕوویدا'
      }
      return { ok: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * POST /api/auth/register
   * ✅ CRITICAL FIX: Explicitly set Content-Type to application/json
   */
  async function registerGuest(payload) {
    loading.value = true
    error.value = null

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // ✅ Explicit JSON content type
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      // Handle network errors
      if (!res.ok) {
        let data
        try {
          data = await res.json()
        } catch {
          data = { message: `هەڵەی سێرڤەر: ${res.status} ${res.statusText}` }
        }

        // Handle specific error cases
        if (res.status === 400) {
          throw new Error(data.message || 'زانیاری نادروستە')
        } else if (res.status === 409) {
          throw new Error('ئەم بەکارهێنەرە پێشتر تۆمارکراوە')
        } else if (res.status === 500) {
          throw new Error(data.message || 'هەڵەی ناوخۆی سێرڤەر')
        } else {
          throw new Error(data.message || data.response || 'تۆمارکردن سەرکەوتوو نەبوو')
        }
      }

      const data = await res.json()

      // if backend returns token on register -> auto login
      const tok = data.token || data?.data?.token || data?.accessToken || null
      if (tok) {
        const payloadJwt = parseJwtPayload(tok)

        token.value = tok
        user.value = {
          username: payloadJwt?.sub || payloadJwt?.username || payload.username,
          role: payloadJwt?.ROLE || payloadJwt?.role || 'GUEST',
          userId: payloadJwt?.id || payloadJwt?.userId || null,
        }

        localStorage.setItem('khi_token', tok)
        localStorage.setItem('khi_user', JSON.stringify(user.value))

        return { ok: true, authed: true }
      }

      return { ok: true, authed: false }
    } catch (err) {
      // Network error
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        error.value = 'نەتوانرا پەیوەندی بە سێرڤەر بکرێت'
      } else {
        error.value = err?.message || 'هەڵەیەک ڕوویدا'
      }
      return { ok: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * POST /api/auth/logout — blacklist token on backend (optional)
   */
  async function logout() {
    if (token.value) {
      try {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.value}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
      } catch (err) {
        console.warn('Logout request failed:', err)
        // Continue with local logout even if server request fails
      }
    }
    _clearSession()
  }

  function _clearSession() {
    token.value = null
    user.value = null
    error.value = null
    localStorage.removeItem('khi_token')
    localStorage.removeItem('khi_user')
  }

  function clearError() {
    error.value = null
  }

  function authHeader() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  /**
   * Check if token is valid (not expired)
   */
  function isTokenValid() {
    if (!token.value) return false
    
    const payload = parseJwtPayload(token.value)
    if (!payload?.exp) return true // No expiry = always valid
    
    return Date.now() < payload.exp * 1000
  }

  return {
    // State
    token,
    user,
    loading,
    error,
    
    // Computed
    isAuthenticated,
    username,
    role,
    hasAdminAccess,  // ✅ NEW: Check if user can access admin dashboard
    isGuest,
    isEmployee,
    isAdmin,
    isSuperAdmin,
    
    // Actions
    hydrate,
    login,
    registerGuest,
    logout,
    clearError,
    authHeader,
    isTokenValid,
  }
})

// ─── Helpers ───────────────────────────────────────────────────────────
function parseJwtPayload(jwt) {
  try {
    const base64 = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch (err) {
    console.error('Failed to parse JWT:', err)
    return null
  }
}