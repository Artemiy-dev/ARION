import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../api/client'
import type { Cart } from '../types/cart'
import { useAuth } from './AuthProvider'

interface CartContextValue {
  cart: Cart | null
  loading: boolean
  addToCart: (slug: string, quantity?: number) => Promise<void>
  updateItem: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  refresh: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setCart(null)
      return
    }
    setLoading(true)
    api
      .get<Cart>('/cart/')
      .then(setCart)
      .finally(() => setLoading(false))
  }, [user])

  async function addToCart(slug: string, quantity = 1) {
    const data = await api.post<Cart>('/cart/add/', { product_slug: slug, quantity })
    setCart(data)
  }

  async function updateItem(itemId: number, quantity: number) {
    const data = await api.patch<Cart>(`/cart/items/${itemId}/`, { quantity })
    setCart(data)
  }

  async function removeItem(itemId: number) {
    const data = await api.delete<Cart>(`/cart/items/${itemId}/`)
    setCart(data)
  }

  async function refresh() {
    const data = await api.get<Cart>('/cart/')
    setCart(data)
  }

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateItem, removeItem, refresh }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart должен использоваться внутри CartProvider')
  return ctx
}
