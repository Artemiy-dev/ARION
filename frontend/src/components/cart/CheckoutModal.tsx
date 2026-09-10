import { useState, type FormEvent } from 'react'
import { Modal } from '../ui/Modal'
import { createOrder } from '../../api/orders'
import type { Cart } from '../../types/cart'
import { getIncludedVat, KZ_VAT_RATE } from '../../utils/vat'

interface CheckoutModalProps {
  open: boolean
  onClose: () => void
  cart: Cart
  onSuccess: () => void
}

export function CheckoutModal({ open, onClose, cart, onSuccess }: CheckoutModalProps) {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<number | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const order = await createOrder({ full_name: fullName, phone, comment })
      setOrderId(order.id)
    } catch {
      setError('Не удалось отправить заявку. Попробуйте ещё раз.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleClose() {
    const hadOrder = orderId !== null
    onClose()
    setTimeout(() => {
      setFullName('')
      setPhone('')
      setComment('')
      setOrderId(null)
      setError(null)
      if (hadOrder) onSuccess()
    }, 200)
  }

  if (orderId !== null) {
    return (
      <Modal open={open} onClose={handleClose} title="Заявка отправлена">
        <div className="checkout-success">
          <p>Заявка №{orderId} принята. Мы свяжемся с вами по указанному телефону.</p>
          <button type="button" className="auth-submit" onClick={handleClose}>
            Готово
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal open={open} onClose={handleClose} title="Оформить заявку">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="checkout-form__items">
          {cart.items.map((item) => (
            <div className="checkout-form__item" key={item.id}>
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>{item.subtotal.toLocaleString('ru-RU')} ₸</span>
            </div>
          ))}
        </div>
        <div className="checkout-form__total">
          <span>Итого</span>
          <span>{cart.total.toLocaleString('ru-RU')} ₸</span>
        </div>
        <p className="checkout-form__vat">
          в т.ч. НДС {Math.round(KZ_VAT_RATE * 100)}%: {getIncludedVat(cart.total).toLocaleString('ru-RU')} ₸
        </p>

        {error && <p className="auth-card__error">{error}</p>}

        <label className="auth-field">
          <span>Имя</span>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </label>

        <label className="auth-field">
          <span>Телефон</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="+7 (7XX) XXX-XX-XX"
          />
        </label>

        <label className="auth-field">
          <span>Комментарий (необязательно)</span>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
        </label>

        <button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? 'Отправляем...' : 'Отправить заявку'}
        </button>
      </form>
    </Modal>
  )
}
