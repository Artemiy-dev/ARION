import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { CartLine } from '../types/cart'

interface CartContextValue {
  lines: CartLine[]
  addToCart: (productId: number, quantity?: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useLocalStorage<CartLine[]>('arion:cart', [])

  function addToCart(productId: number, quantity = 1) {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId)
      if (existing) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, quantity: l.quantity + quantity } : l,
        )
      }
      return [...prev, { productId, quantity }]
    })
  }

  function updateQuantity(productId: number, quantity: number) {
    setLines((prev) => {
      if (quantity <= 0) return prev.filter((l) => l.productId !== productId)
      return prev.map((l) => (l.productId === productId ? { ...l, quantity } : l))
    })
  }

  function removeFromCart(productId: number) {
    setLines((prev) => prev.filter((l) => l.productId !== productId))
  }

  function clearCart() {
    setLines([])
  }

  return (
    <CartContext.Provider value={{ lines, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart должен использоваться внутри CartProvider')
  return ctx
}
