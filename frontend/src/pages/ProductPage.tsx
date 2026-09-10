import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../app/AuthProvider'
import { useCart } from '../app/CartProvider'
import { useFavorites } from '../app/FavoritesProvider'
import { useFetch } from '../hooks/useFetch'
import type { Product } from '../types/product'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, error, loading } = useFetch<Product>(`/products/${slug}/`)
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const navigate = useNavigate()

  if (loading) return <p className="state-message">Загрузка...</p>
  if (error || !product) return <p className="state-message">Товар не найден</p>

  function handleAddToCart() {
    if (!user) {
      sessionStorage.setItem('pendingCartProduct', product!.slug)
      navigate('/register')
      return
    }
    addToCart(product!.slug)
  }

  const favorite = isFavorite(product.id)

  return (
    <div className="product-page">
      <Link to="/catalog" className="product-page__back">
        ← Назад в каталог
      </Link>

      <div className="product-page__layout">
        {product.image ? (
          <img className="product-page__image" src={product.image} alt={product.name} />
        ) : (
          <div className="product-page__image product-page__image--placeholder" aria-hidden="true" />
        )}

        <div className="product-page__info">
          <p className="product-page__category">{product.category.name}</p>
          <h1>{product.name}</h1>
          <p className="product-page__description">{product.description}</p>
          <p className="product-page__stock">
            {product.in_stock ? 'В наличии' : 'Под заказ'}
          </p>

          {product.characteristics.length > 0 && (
            <table className="product-page__specs">
              <tbody>
                {product.characteristics.map((c) => (
                  <tr key={c.name}>
                    <th>{c.name}</th>
                    <td>{c.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="product-page__footer">
            <span className="product-page__price">
              {product.price.toLocaleString('ru-RU')} ₸
            </span>
            <button type="button" className="product-card__button" onClick={handleAddToCart}>
              В корзину
            </button>
            <button
              type="button"
              className={
                favorite
                  ? 'product-page__favorite product-page__favorite--active'
                  : 'product-page__favorite'
              }
              onClick={() => toggleFavorite(product.id)}
            >
              ♥ {favorite ? 'В избранном' : 'В избранное'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
