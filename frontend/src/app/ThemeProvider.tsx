import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // По умолчанию — светлая тема (не "system"), чтобы сайт всегда открывался
  // светлым независимо от настроек ОС; переключить на тёмную можно вручную
  // в личном кабинете.
  const [theme, setTheme] = useLocalStorage<Theme>('arion:theme', 'light')
  const [prefersDark, setPrefersDark] = useState(systemPrefersDark)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setPrefersDark(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', theme)
    }
  }, [theme])

  const resolvedTheme: 'light' | 'dark' = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme должен использоваться внутри ThemeProvider')
  return ctx
}
