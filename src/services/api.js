const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

function safeJsonParse(text) {
  try { return JSON.parse(text) } catch { return null }
}

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Accept': 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  const data = safeJsonParse(text) ?? text

  // بەهۆی ئەوەی هەندێ جار backend 200 دەگەڕێنێت بەڵام CORS block دەکات،
  // ئەمە لە browser دا هەڵەی network دەبێت (هیچ response ناتەوێتە JS).
  // بۆیە ئەمە تەنها لەو کاتە کار دەکات کە CORS ڕاست بێت.

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      (typeof data === 'string' && data) ||
      'هەڵەیەک ڕوویدا'
    throw new Error(msg)
  }

  return data
}

export const AuthApi = {
  login(payload) {
    return apiRequest('/api/auth/login', { method: 'POST', body: payload })
  },
  registerGuest(payload) {
    return apiRequest('/api/auth/register', { method: 'POST', body: payload })
  },
}
