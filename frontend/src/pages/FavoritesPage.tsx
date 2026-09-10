import { Link } from 'react-router-dom'
import { ProductCard } from '../components/catalog/ProductCard'
import { useFavorites } from '../app/FavoritesProvider'
import { useFetch } from '../hooks/useFetch'
import type { Product } from '../types/product'

export function FavoritesPage() {
  const { favoriteIds } = useFavorites()
  const { data: products, loading, error } = useFetch<Product[]>('/products/')

  if (loading) return <p className="state-message">Загрузка...</p>
  if (error) return <p className="state-message">Не удалось загрузить товары</p>

  const favorites = (products ?? []).filter((p) => favoriteIds.includes(p.id))

  if (favorites.length === 0) {
    return (
      <div className="state-message">
        <p>В избранном пока пусто</p>
        <p>
          <Link to="/catalog">Перейти в каталог</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="catalog">
      <h1>Избранное</h1>
      <div className="catalog__grid">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
