import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const MAX_COMPARE = 4

interface CompareContextValue {
  compareIds: number[]
  isComparing: (id: number) => boolean
  toggleCompare: (id: number) => void
  clearCompare: () => void
}

const CompareContext = createContext<CompareContextValue | null>(null)

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useLocalStorage<number[]>('arion:compare', [])

  function isComparing(id: number) {
    return compareIds.includes(id)
  }

  function toggleCompare(id: number) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, id]
    })
  }

  function clearCompare() {
    setCompareIds([])
  }

  return (
    <CompareContext.Provider value={{ compareIds, isComparing, toggleCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare должен использоваться внутри CompareProvider')
  return ctx
}
