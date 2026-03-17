/**
 * In-memory + localStorage hybrid cache for API responses.
 *
 * - GET requests are cached automatically (configurable TTL).
 * - Mutations (POST/PUT/DELETE) invalidate related cache entries.
 * - Memory cache is fast; localStorage survives page reloads.
 */

const CACHE_PREFIX = 'khi_cache:'
const DEFAULT_TTL = 5 * 60 * 1000  // 5 minutes
const MAX_CACHE_ENTRIES = 100

// Fast in-memory map (lost on refresh, instant access)
const memoryCache = new Map()

// ── Core helpers ────────────────────────────────────────────

function cacheKey(url) {
  return CACHE_PREFIX + url
}

function isExpired(entry) {
  return Date.now() > entry.expiresAt
}

/**
 * Get cached response for a URL.
 * Checks memory first, then localStorage.
 */
export function getCached(url) {
  const key = cacheKey(url)

  // 1. Memory cache (fastest)
  if (memoryCache.has(key)) {
    const entry = memoryCache.get(key)
    if (!isExpired(entry)) return entry.data
    memoryCache.delete(key)
  }

  // 2. localStorage (survives reload)
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const entry = JSON.parse(raw)
      if (!isExpired(entry)) {
        // Promote back to memory cache
        memoryCache.set(key, entry)
        return entry.data
      }
      localStorage.removeItem(key)
    }
  } catch {
    // Corrupted entry — ignore
  }

  return null
}

/**
 * Store response in both memory and localStorage.
 */
export function setCache(url, data, ttl = DEFAULT_TTL) {
  const key = cacheKey(url)
  const entry = {
    data,
    expiresAt: Date.now() + ttl,
    storedAt: Date.now(),
  }

  memoryCache.set(key, entry)

  try {
    // Evict old entries if storage is getting full
    evictIfNeeded()
    localStorage.setItem(key, JSON.stringify(entry))
  } catch {
    // localStorage full — memory cache still works
  }
}

/**
 * Invalidate cache entries that match a URL prefix.
 * Call after POST/PUT/DELETE to keep data fresh.
 *
 * Example: invalidateCache('/api/projects') clears
 *   /api/projects, /api/projects/1, /api/projects?page=2, etc.
 */
export function invalidateCache(urlPrefix) {
  // Memory
  for (const key of memoryCache.keys()) {
    if (key.startsWith(CACHE_PREFIX + urlPrefix)) {
      memoryCache.delete(key)
    }
  }

  // localStorage
  const toRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(CACHE_PREFIX + urlPrefix)) {
      toRemove.push(key)
    }
  }
  toRemove.forEach(k => localStorage.removeItem(k))
}

/**
 * Clear the entire cache.
 */
export function clearAllCache() {
  memoryCache.clear()

  const toRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(CACHE_PREFIX)) {
      toRemove.push(key)
    }
  }
  toRemove.forEach(k => localStorage.removeItem(k))
}

/**
 * Evict oldest cache entries if we exceed MAX_CACHE_ENTRIES.
 */
function evictIfNeeded() {
  const cacheKeys = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(CACHE_PREFIX)) {
      cacheKeys.push(key)
    }
  }

  if (cacheKeys.length < MAX_CACHE_ENTRIES) return

  // Sort by storedAt and remove oldest quarter
  const entries = cacheKeys.map(key => {
    try {
      const raw = localStorage.getItem(key)
      const parsed = JSON.parse(raw)
      return { key, storedAt: parsed.storedAt || 0 }
    } catch {
      return { key, storedAt: 0 }
    }
  })

  entries.sort((a, b) => a.storedAt - b.storedAt)
  const toRemove = entries.slice(0, Math.floor(entries.length / 4))
  toRemove.forEach(e => {
    localStorage.removeItem(e.key)
    memoryCache.delete(e.key)
  })
}
