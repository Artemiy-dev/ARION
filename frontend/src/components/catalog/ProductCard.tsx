import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/AuthProvider'
import { useCart } from '../../app/CartProvider'
import { useFavorites } from '../../app/FavoritesProvider'
import type { Product } from '../../types/product'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const navigate = useNavigate()

  const favorite = isFavorite(product.id)

  function handleAddToCart() {
    if (!user) {
      sessionStorage.setItem('pendingCartProduct', product.slug)
      navigate('/register')
      return
    }
    addToCart(product.slug)
  }

  return (
    <article className="product-card">
      {product.is_hit && <span className="product-card__badge">Хит</span>}

      <button
        type="button"
        className={favorite ? 'product-card__favorite product-card__favorite--active' : 'product-card__favorite'}
        onClick={() => toggleFavorite(product.id)}
        aria-label="В избранное"
      >
        ♥
      </button>

      <Link to={`/product/${product.slug}`} className="product-card__image-link">
        {product.image ? (
          <img className="product-card__image" src={product.image} alt={product.name} />
        ) : (
          <div className="product-card__image product-card__image--placeholder" aria-hidden="true" />
        )}
      </Link>
      <Link to={`/product/${product.slug}`} className="product-card__name">
        {product.name}
      </Link>
      <p className="product-card__description">{product.description}</p>
      <p className="product-card__stock">{product.in_stock ? 'В наличии' : 'Под заказ'}</p>
      <div className="product-card__footer">
        <span className="product-card__price">{product.price.toLocaleString('ru-RU')} ₸</span>
        <button type="button" className="product-card__button" onClick={handleAddToCart}>
          В корзину
        </button>
      </div>
    </article>
  )
}
