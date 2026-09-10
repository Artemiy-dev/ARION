import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckoutModal } from '../components/cart/CheckoutModal'
import { useAuth } from '../app/AuthProvider'
import { useCart } from '../app/CartProvider'
import { getIncludedVat, KZ_VAT_RATE } from '../utils/vat'

export function CartPage() {
  const { user } = useAuth()
  const { cart, loading, updateItem, removeItem, refresh } = useCart()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  if (!user) {
    return (
      <div className="state-message">
        <p>Войдите, чтобы посмотреть корзину</p>
        <p>
          <Link to="/login">Войти</Link> или <Link to="/register">зарегистрироваться</Link>
        </p>
      </div>
    )
  }

  if (loading || !cart) return <p className="state-message">Загрузка...</p>

  if (cart.items.length === 0) {
    return (
      <div className="state-message">
        <p>Ваша корзина пуста</p>
        <p>
          <Link to="/catalog">Перейти в каталог</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Корзина</h1>

      <div className="cart-page__list">
        {cart.items.map((item) => (
          <div className="cart-item" key={item.id}>
            {item.product.image ? (
              <img className="cart-item__image" src={item.product.image} alt={item.product.name} />
            ) : (
              <div className="cart-item__image cart-item__image--placeholder" aria-hidden="true" />
            )}

            <div className="cart-item__info">
              <Link to={`/product/${item.product.slug}`} className="cart-item__name">
                {item.product.name}
              </Link>
              <span className="cart-item__price">
                {item.product.price.toLocaleString('ru-RU')} ₸
              </span>
            </div>

            <div className="cart-item__quantity">
              <button type="button" onClick={() => updateItem(item.id, item.quantity - 1)}>
                −
              </button>
              <span>{item.quantity}</span>
              <button type="button" onClick={() => updateItem(item.id, item.quantity + 1)}>
                +
              </button>
            </div>

            <span className="cart-item__subtotal">
              {item.subtotal.toLocaleString('ru-RU')} ₸
            </span>

            <button
              type="button"
              className="cart-item__remove"
              onClick={() => removeItem(item.id)}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>

      <div className="cart-page__total">
        <span>Итого</span>
        <span>{cart.total.toLocaleString('ru-RU')} ₸</span>
      </div>
      <p className="cart-page__vat">
        в т.ч. НДС {Math.round(KZ_VAT_RATE * 100)}%: {getIncludedVat(cart.total).toLocaleString('ru-RU')} ₸
      </p>

      <button
        type="button"
        className="cart-page__checkout"
        onClick={() => setCheckoutOpen(true)}
      >
        Оформить заявку
      </button>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        onSuccess={refresh}
      />
    </div>
  )
}
