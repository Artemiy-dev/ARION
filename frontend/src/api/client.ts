const BASE_URL = '/api'

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(status: number, message: string, data?: unknown) {
    super(message)
    this.status = status
    this.data = data
  }
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const method = options?.method ?? 'GET'
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }

  if (method !== 'GET') {
    const csrfToken = getCookie('csrftoken')
    if (csrfToken) headers['X-CSRFToken'] = csrfToken
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'same-origin',
    headers,
    ...options,
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new ApiError(res.status, `Request to ${path} failed with ${res.status}`, data)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

async function upload<T>(path: string, formData: FormData): Promise<T> {
  const csrfToken = getCookie('csrftoken')
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: csrfToken ? { 'X-CSRFToken': csrfToken } : undefined,
    body: formData,
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new ApiError(res.status, `Request to ${path} failed with ${res.status}`, data)
  }

  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  upload,
}
