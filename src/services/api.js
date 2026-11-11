const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

async function request(path, { method = 'GET', token, body } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  let json = null
  try {
    json = await res.json()
  } catch {
    json = null
  }

  if (!res.ok) {
    const error = new Error(json?.message ?? `Request gagal (${res.status})`)
    error.status = res.status
    error.errors = json?.errors ?? null
    throw error
  }

  return json
}

export const api = {
  captcha: () => request('/captcha'),
  encryptPayload: (payload) =>
    request('/security/encrypt', { method: 'POST', body: payload }),
  login: (payload) =>
    request('/login', { method: 'POST', body: payload }),
  me: (token) => request('/me', { token }),
  logout: (token) => request('/logout', { method: 'POST', token }),
  getPasien: (token) => request('/pasien', { token }),
  createPasien: (token, data) =>
    request('/pasien', { method: 'POST', token, body: data }),
  searchPasien: (token, noRekamMedik) =>
    request(`/pasien/search/${encodeURIComponent(noRekamMedik)}`, { token }),
  createKunjungan: (token, data) =>
    request('/kunjungan', { method: 'POST', token, body: data }),
}
