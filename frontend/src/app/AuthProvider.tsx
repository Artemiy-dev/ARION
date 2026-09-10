import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../api/client'
import type { User } from '../types/user'

export interface RegisterPayload {
  username: string
  email: string
  first_name: string
  password: string
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  uploadAvatar: (file: File) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<User | null>('/auth/me/')
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(username: string, password: string) {
    const data = await api.post<User>('/auth/login/', { username, password })
    setUser(data)
  }

  async function register(payload: RegisterPayload) {
    const data = await api.post<User>('/auth/register/', payload)
    setUser(data)
  }

  async function logout() {
    await api.post('/auth/logout/')
    setUser(null)
  }

  async function uploadAvatar(file: File) {
    const formData = new FormData()
    formData.append('avatar', file)
    const data = await api.upload<User>('/auth/avatar/', formData)
    setUser(data)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, uploadAvatar }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth должен использоваться внутри AuthProvider')
  return ctx
}
