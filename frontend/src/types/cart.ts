import type { Product } from './product'

export interface CartLine {
  productId: number
  quantity: number
}

export interface CartItem {
  id: number
  product: Product
  quantity: number
  subtotal: number
}

export interface Cart {
  items: CartItem[]
  total: number
}
