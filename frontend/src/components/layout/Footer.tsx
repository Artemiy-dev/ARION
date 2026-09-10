export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span>© {new Date().getFullYear()} Arion</span>
        <nav className="footer__nav">
          <a href="#">Доставка</a>
          <a href="#">Гарантия</a>
          <a href="#">Контакты</a>
        </nav>
      </div>
    </footer>
  )
}
