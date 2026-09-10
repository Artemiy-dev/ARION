import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface FavoritesContextValue {
  favoriteIds: number[]
  isFavorite: (id: number) => boolean
  toggleFavorite: (id: number) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useLocalStorage<number[]>('arion:favorites', [])

  function isFavorite(id: number) {
    return favoriteIds.includes(id)
  }

  function toggleFavorite(id: number) {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites должен использоваться внутри FavoritesProvider')
  return ctx
}
