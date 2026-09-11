import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span>© {new Date().getFullYear()} Arion</span>
        <nav className="footer__nav">
          <Link to="/catalog">Каталог</Link>
          <Link to="/about">О нас</Link>
          <Link to="/contacts">Контакты</Link>
          <Link to="/terms">Правила использования</Link>
          <Link to="/privacy">Политика конфиденциальности</Link>
        </nav>
      </div>
    </footer>
  )
}
