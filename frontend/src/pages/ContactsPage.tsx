export function ContactsPage() {
  return (
    <div className="contacts-page">
      <h1>Контакты</h1>

      <div className="contacts-grid">
        <div className="contacts-card">
          <h2>Телефон</h2>
          <p>+7 (700) 123-45-67</p>
          <p className="contacts-card__note">Ежедневно, 9:00–20:00</p>
        </div>

        <div className="contacts-card">
          <h2>Email</h2>
          <p>hello@arion.kz</p>
          <p className="contacts-card__note">Отвечаем в течение рабочего дня</p>
        </div>

        <div className="contacts-card">
          <h2>Шоурум</h2>
          <p>Алматы, ул. Абая 150</p>
          <p className="contacts-card__note">Пн–Сб, 10:00–19:00</p>
        </div>
      </div>
    </div>
  )
}
