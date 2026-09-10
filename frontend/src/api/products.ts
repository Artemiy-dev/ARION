import { api } from './client'
import type { Category, Product } from '../types/product'

export function fetchProducts() {
  return api.get<Product[]>('/products/')
}

export function fetchProduct(slug: string) {
  return api.get<Product>(`/products/${slug}/`)
}

export function fetchCategories() {
  return api.get<Category[]>('/categories/')
}
