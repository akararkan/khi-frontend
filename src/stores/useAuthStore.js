import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API_BASE } from '@/components/consts.js'

const ADMIN_ROLES = ['EMPLOYEE', 'ADMIN', 'SUPER_ADMIN']

function nukeAllCookies() {
  const paths = ['/', '/api', '/oauth2', '']
  document.cookie.split(';').forEach(c => {
    const name = c.split('=')[0].trim()
    if (!name) return
    paths.forEach(p => {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${p}`
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${p};domain=${window.location.hostname}`
    })
  })
}

export const useAuthStore = defineStore('auth', () => {
  const token   = ref(null)
  const user    = ref(null)
  const loading = ref(false)
  const error   = ref(null)
  let expirationTimer = null

  const isAuthenticated = computed(() => !!token.value)
  const username        = computed(() => user.value?.username || null)
  const role            = computed(() => user.value?.role || null)
  const hasAdminAccess  = computed(() => role.value && ADMIN_ROLES.includes(role.value))
  const isGuest         = computed(() => role.value === 'GUEST')
  const isEmployee      = computed(() => role.value === 'EMPLOYEE')
  const isAdmin         = computed(() => role.value === 'ADMIN')
  const isSuperAdmin    = computed(() => role.value === 'SUPER_ADMIN')

  const profileImage = computed(() => {
    const local = user.value?.profileImage
    const oauth = user.value?.imageUrl
    if (local) return local.startsWith('http') ? local : `${API_BASE}/${local}`
    if (oauth)  return oauth
    return null
  })

  async function fetchMe() {
    if (!token.value) return null
    try {
      const res = await fetch(`${API_BASE}/api/user/me`, {
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
      })
      if (!res.ok) {
        logger.error('fetchMe failed:', res.status)
        return null
      }
      const data = await res.json()
      const jwtRole   = user.value?.role
      const jwtUserId = user.value?.userId
      user.value = {
        ...data,
        role:   data.role   || jwtRole,
        userId: data.userId || data.id || jwtUserId,
      }
      localStorage.setItem('khi_user', JSON.stringify(user.value))
      logger.debug('fetchMe: user replaced from server', user.value)
      return data
    } catch (err) {
      logger.error('fetchMe error:', err)
      return null
    }
  }

  function updateUserData(partial) {
    if (!user.value) return
    user.value = { ...user.value, ...partial }
    localStorage.setItem('khi_user', JSON.stringify(user.value))
    logger.debug('updateUserData:', partial)
  }

  function hydrate() {
    try {
      const storedToken = localStorage.getItem('khi_token')
      const storedUser  = localStorage.getItem('khi_user')

      if (storedToken && storedUser) {
        const payload = parseJwtPayload(storedToken)

        if (payload?.exp && Date.now() >= payload.exp * 1000) {
          logger.log('Token expired during hydration')
          handleExpiration(payload?.ROLE || payload?.role || 'GUEST')
          return false
        }

        token.value = storedToken
        user.value  = JSON.parse(storedUser)

        if (payload?.exp) setupExpirationTimer(payload.exp, user.value?.role)

        fetchMe()

        return true
      }
      return false
    } catch (err) {
      logger.error('Hydration failed:', err)
      _clearSession()
      return false
    }
  }

  function setupExpirationTimer(expirationTimestamp, userRole) {
    if (expirationTimer) { clearTimeout(expirationTimer); expirationTimer = null }

    const timeUntilExpiry = (expirationTimestamp * 1000) - Date.now()
    if (timeUntilExpiry <= 0) { handleExpiration(userRole); return }

    expirationTimer = setTimeout(() => handleExpiration(userRole), timeUntilExpiry)
    logger.debug(`Auto-logout in ${Math.floor(timeUntilExpiry / 1000)}s for role: ${userRole}`)
  }

  function handleExpiration(userRole) {
    const wasAdmin = ADMIN_ROLES.includes(userRole)
    _clearSession()
    if (wasAdmin) {
      logger.info('Admin session expired → /login')
      window.location.href = '/login?expired=1&required=true'
    } else {
      logger.info('Guest session expired → silent logout')
      if (window.location.pathname.startsWith('/admin')) window.location.href = '/'
    }
  }

  function setToken(rawToken) {
    if (!rawToken) return false

    const payload = parseJwtPayload(rawToken)
    if (!payload) { error.value = 'Token نادروستە'; return false }

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      error.value = 'Token بەسەرچووە، تکایە دووبارە چوونەژوورەوە بکە'
      return false
    }

    token.value = rawToken
    user.value  = {
      username: payload?.sub || payload?.username || null,
      role:     payload?.ROLE || payload?.role || payload?.authorities?.[0] || 'GUEST',
      userId:   payload?.id || payload?.userId || null,
    }

    localStorage.setItem('khi_token', rawToken)
    localStorage.setItem('khi_user', JSON.stringify(user.value))

    if (payload?.exp) setupExpirationTimer(payload.exp, user.value.role)

    return true
  }

  async function login(usernameInput, password) {
    _clearSession()

    loading.value = true
    error.value   = null

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password }),
      })

      if (res.status === 401) {
        const data = await res.json().catch(() => ({}))
        if (data.error === 'TOKEN_EXPIRED') {
          error.value = 'کاتی چوونەژوورەوە بەسەرچووە، تکایە دووبارە هەوڵبدە'
          return { ok: false, expired: true }
        }
      }

      if (!res.ok) {
        let data
        try   { data = await res.json() }
        catch { data = { message: `هەڵەی سێرڤەر: ${res.status}` } }

        if      (res.status === 401) throw new Error('ناوی بەکارهێنەر یان وشەی نهێنی هەڵەیە')
        else if (res.status === 403) throw new Error('دەستگەیشتن قەدەغەیە')
        else if (res.status === 404) throw new Error('API نەدۆزرایەوە')
        else if (res.status === 500) throw new Error(data.message || 'هەڵەی ناوخۆی سێرڤەر')
        else                         throw new Error(data.message || 'چوونەژوورەوە سەرکەوتوو نەبوو')
      }

      const data = await res.json()
      const tok  = data.token || data?.data?.token
      if (!tok) throw new Error('تۆکن وەرنەگیرا')

      nukeAllCookies()

      setToken(tok)

      await fetchMe()

      return { ok: true }

    } catch (err) {
      error.value = err.message || 'هەڵەیەک ڕوویدا'
      return { ok: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function registerGuest(payload) {
    _clearSession()

    loading.value = true
    error.value   = null

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        let data
        try   { data = await res.json() }
        catch { data = { message: `هەڵەی سێرڤەر: ${res.status}` } }

        if      (res.status === 400) throw new Error(data.message || 'زانیاری نادروستەیە')
        else if (res.status === 409) throw new Error('ئەم بەکارهێنەرە پێشتر تۆمارکراوە')
        else                         throw new Error(data.message || 'تۆمارکردن سەرکەوتوو نەبوو')
      }

      const data = await res.json()
      const tok  = data.token || data?.data?.token

      if (tok) {
        nukeAllCookies()
        setToken(tok)
        await fetchMe()
        return { ok: true, authed: true }
      }

      return { ok: true, authed: false }
    } catch (err) {
      error.value = err.message || 'هەڵەیەک ڕوویدا'
      return { ok: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    if (expirationTimer) { clearTimeout(expirationTimer); expirationTimer = null }

    const savedToken = token.value

    _clearSession()

    if (savedToken) {
      try {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${savedToken}`, 'Content-Type': 'application/json' },
        })
      } catch (err) {
        console.warn('Logout request failed (ignored):', err)
      }
    }
  }

  function _clearSession() {
    if (expirationTimer) { clearTimeout(expirationTimer); expirationTimer = null }

    token.value   = null
    user.value    = null
    error.value   = null
    loading.value = false

    localStorage.removeItem('khi_token')
    localStorage.removeItem('khi_user')
    sessionStorage.clear()

    nukeAllCookies()

    logger.debug('Session cleared completely')
  }

  function clearError() { error.value = null }

  function authHeader() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  return {
    token, user, loading, error,
    isAuthenticated, username, role, profileImage,
    hasAdminAccess, isGuest, isEmployee, isAdmin, isSuperAdmin,
    hydrate, setToken, login, registerGuest, logout, clearError, authHeader,
    updateUserData, fetchMe, _clearSession,
    setupExpirationTimer, handleExpiration,
  }
})

const logger = {
  debug: (...args) => console.debug('[Auth]', ...args),
  log:   (...args) => console.log('[Auth]',   ...args),
  error: (...args) => console.error('[Auth]', ...args),
  info:  (...args) => console.info('[Auth]',  ...args),
}

function parseJwtPayload(jwt) {
  try {
    const base64 = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    )
    return JSON.parse(json)
  } catch (err) {
    console.error('Failed to parse JWT:', err)
    return null
  }
}