import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useAuth } from '../app/AuthProvider'
import { useCart } from '../app/CartProvider'

type FieldErrors = Partial<Record<'username' | 'email' | 'first_name' | 'password', string>>

export function RegisterPage() {
  const { register } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', email: '', first_name: '', password: '' })
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const pendingSlug = sessionStorage.getItem('pendingCartProduct')

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors({})
    setFormError(null)

    if (form.password !== passwordConfirm) {
      setErrors({ password: 'Пароли не совпадают' })
      return
    }

    setSubmitting(true)
    try {
      await register(form)

      if (pendingSlug) {
        sessionStorage.removeItem('pendingCartProduct')
        await addToCart(pendingSlug)
        navigate('/cart')
      } else {
        navigate('/')
      }
    } catch (err) {
      if (err instanceof ApiError && err.data && typeof err.data === 'object') {
        const data = err.data as Record<string, string[]>
        const fieldErrors: FieldErrors = {}
        for (const key of ['username', 'email', 'first_name', 'password'] as const) {
          if (data[key]?.[0]) fieldErrors[key] = data[key][0]
        }
        setErrors(fieldErrors)
        if (Object.keys(fieldErrors).length === 0) {
          setFormError('Не удалось зарегистрироваться')
        }
      } else {
        setFormError('Не удалось зарегистрироваться')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Регистрация</h1>
        <p className="auth-card__subtitle">
          {pendingSlug
            ? 'Создайте аккаунт, чтобы добавить товар в корзину'
            : 'Создайте аккаунт Arion за минуту'}
        </p>

        {formError && <p className="auth-card__error">{formError}</p>}

        <label className="auth-field">
          <span>Имя</span>
          <input
            value={form.first_name}
            onChange={(e) => update('first_name', e.target.value)}
            autoComplete="given-name"
          />
        </label>

        <label className="auth-field">
          <span>Логин</span>
          <input
            value={form.username}
            onChange={(e) => update('username', e.target.value)}
            required
            autoComplete="username"
          />
          {errors.username && <span className="auth-field__error">{errors.username}</span>}
        </label>

        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
            autoComplete="email"
          />
          {errors.email && <span className="auth-field__error">{errors.email}</span>}
        </label>

        <label className="auth-field">
          <span>Пароль</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            required
            autoComplete="new-password"
          />
        </label>

        <label className="auth-field">
          <span>Повторите пароль</span>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            autoComplete="new-password"
          />
          {errors.password && <span className="auth-field__error">{errors.password}</span>}
        </label>

        <button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
        </button>

        <p className="auth-card__footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </div>
  )
}
