import { api } from './client'
import type { Order } from '../types/order'

export interface CreateOrderPayload {
  full_name: string
  phone: string
  comment?: string
}

export function createOrder(payload: CreateOrderPayload) {
  return api.post<Order>('/orders/', payload)
}
