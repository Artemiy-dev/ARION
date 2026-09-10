export interface Category {
  id: number
  name: string
  slug: string
}

export interface Characteristic {
  name: string
  value: string
}

export interface Product {
  id: number
  name: string
  slug: string
  category: Category
  brand: string
  description: string
  price: number
  image: string | null
  in_stock: boolean
  is_hit: boolean
  characteristics: Characteristic[]
}
