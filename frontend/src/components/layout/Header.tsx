import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../app/AuthProvider'
import { useCart } from '../../app/CartProvider'
import { useCompare } from '../../app/CompareProvider'
import { useFavorites } from '../../app/FavoritesProvider'
import { AccountModal } from './AccountModal'
import { SearchBox } from './SearchBox'

export function Header() {
  const { user } = useAuth()
  const { lines } = useCart()
  const { favoriteIds } = useFavorites()
  const { compareIds } = useCompare()
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const cartCount = lines.reduce((sum, line) => sum + line.quantity, 0)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo" onClick={closeMenu}>
          Arion
        </Link>

        <SearchBox onNavigate={closeMenu} />

        <div className={menuOpen ? 'header__panel header__panel--open' : 'header__panel'}>
          <nav className="header__nav">
            <Link to="/catalog" onClick={closeMenu}>
              Каталог
            </Link>
            <Link to="/about" onClick={closeMenu}>
              О нас
            </Link>
            <Link to="/contacts" onClick={closeMenu}>
              Контакты
            </Link>
          </nav>

          <div className="header__actions">
            <Link to="/compare" className="header__icon-btn" onClick={closeMenu}>
              Сравнение{compareIds.length > 0 ? ` (${compareIds.length})` : ''}
            </Link>
            <Link to="/favorites" className="header__icon-btn" onClick={closeMenu}>
              Избранное{favoriteIds.length > 0 ? ` (${favoriteIds.length})` : ''}
            </Link>
            <Link to="/cart" className="header__icon-btn" onClick={closeMenu}>
              Корзина{cartCount > 0 ? ` (${cartCount})` : ''}
            </Link>
          </div>
        </div>

        <div className="header__persistent">
          {user ? (
            <button
              type="button"
              className="header__avatar"
              onClick={() => setAccountOpen(true)}
              aria-label="Личный кабинет"
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <span>{user.username.slice(0, 2).toUpperCase()}</span>
              )}
            </button>
          ) : (
            <Link to="/login" className="header__icon-btn header__icon-btn--primary" onClick={closeMenu}>
              Войти
            </Link>
          )}

          <button
            type="button"
            className="header__burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Меню"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} />
    </header>
  )
}
