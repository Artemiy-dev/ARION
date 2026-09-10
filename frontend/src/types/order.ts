import type { Product } from './product'

export interface OrderItem {
  product: Product
  quantity: number
  price: number
}

export interface Order {
  id: number
  full_name: string
  phone: string
  comment: string
  status: string
  created_at: string
  items: OrderItem[]
  total: number
}
