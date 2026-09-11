import { api } from './client'
import type { Order } from '../types/order'

export interface CreateOrderPayload {
  full_name: string
  phone: string
  comment?: string
  items: { product_slug: string; quantity: number }[]
}

export function createOrder(payload: CreateOrderPayload) {
  return api.post<Order>('/orders/', payload)
}
