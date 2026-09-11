import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoDark from '../../assets/logo-dark.jpg'
import logoLight from '../../assets/logo-light.jpg'
import { useAuth } from '../../app/AuthProvider'
import { useCart } from '../../app/CartProvider'
import { useCompare } from '../../app/CompareProvider'
import { useFavorites } from '../../app/FavoritesProvider'
import { useTheme } from '../../app/ThemeProvider'
import { AccountModal } from './AccountModal'
import { SearchBox } from './SearchBox'

export function Header() {
  const { user } = useAuth()
  const { lines } = useCart()
  const { favoriteIds } = useFavorites()
  const { compareIds } = useCompare()
  const { resolvedTheme } = useTheme()
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
          <img
            src={resolvedTheme === 'dark' ? logoDark : logoLight}
            alt="Arion"
            className="header__logo-img"
          />
        </Link>

        <SearchBox onNavigate={closeMenu} />

        <div className={menuOpen ? 'header__panel header__panel--open' : 'header__panel'}>
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
