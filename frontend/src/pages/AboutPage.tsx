export function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <p className="about-hero__eyebrow">С 2015 года</p>
        <h1>Печатная техника без компромиссов</h1>
        <p className="about-hero__lead">
          Arion — казахстанский поставщик принтеров, МФУ и офисной техники.
          Мы отбираем оборудование, которое реально работает годами, и берём
          на себя всё остальное: доставку, настройку и сервис.
        </p>
      </section>

      <section className="about-stats">
        <div className="about-stat">
          <span className="about-stat__value">10 лет</span>
          <span className="about-stat__label">на рынке Казахстана</span>
        </div>
        <div className="about-stat">
          <span className="about-stat__value">5000+</span>
          <span className="about-stat__label">выполненных заказов</span>
        </div>
        <div className="about-stat">
          <span className="about-stat__value">24 месяца</span>
          <span className="about-stat__label">гарантии на технику</span>
        </div>
      </section>

      <section className="about-values">
        <div className="about-value">
          <h2>Проверенный выбор</h2>
          <p>
            В каталоге только модели, которые прошли проверку в реальной
            эксплуатации — без случайных позиций и заведомо проблемных линеек.
          </p>
        </div>
        <div className="about-value">
          <h2>Честная цена</h2>
          <p>
            Цена на сайте — это цена в чеке. Никаких скрытых доплат за
            доставку по городу или базовую настройку.
          </p>
        </div>
        <div className="about-value">
          <h2>Сервис после продажи</h2>
          <p>
            Помогаем с расходными материалами и обслуживанием на всём сроке
            службы техники, а не только в день покупки.
          </p>
        </div>
      </section>
    </div>
  )
}
