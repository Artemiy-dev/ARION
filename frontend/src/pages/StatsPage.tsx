import { Navigate } from 'react-router-dom'
import { useAuth } from '../app/AuthProvider'
import { useFetch } from '../hooks/useFetch'

interface DayVisit {
  day: string
  count: number
}

interface TopPage {
  path: string
  count: number
}

interface OrderStatusCount {
  status: string
  label: string
  count: number
}

interface OrderStats {
  total: number
  last_14_days_total: number
  by_status: OrderStatusCount[]
  revenue_done: number
  revenue_pending: number
}

interface Stats {
  total: number
  last_14_days_total: number
  unique_visitors: number
  by_day: DayVisit[]
  top_pages: TopPage[]
  orders: OrderStats
}

function formatDay(iso: string) {
  const date = new Date(iso)
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
}

function formatMoney(value: number) {
  return `${Math.round(value).toLocaleString('ru-RU')} ₸`
}

export function StatsPage() {
  const { user, loading: authLoading } = useAuth()
  const { data: stats, loading, error } = useFetch<Stats>('/analytics/stats/', Boolean(user?.is_staff))

  if (authLoading) return <p className="state-message">Загрузка...</p>
  if (!user?.is_staff) return <Navigate to="/" replace />
  if (loading) return <p className="state-message">Загрузка статистики...</p>
  if (error || !stats) return <p className="state-message">Не удалось загрузить статистику</p>

  const maxCount = Math.max(1, ...stats.by_day.map((d) => d.count))

  return (
    <div className="stats-page">
      <h1>Статистика посещений</h1>

      <div className="stats-tiles">
        <div className="stat-tile">
          <span className="stat-tile__label">Всего посещений</span>
          <span className="stat-tile__value">{stats.total.toLocaleString('ru-RU')}</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__label">За последние 14 дней</span>
          <span className="stat-tile__value">{stats.last_14_days_total.toLocaleString('ru-RU')}</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__label">Уникальных посетителей</span>
          <span className="stat-tile__value">{stats.unique_visitors.toLocaleString('ru-RU')}</span>
        </div>
      </div>

      <section className="stats-chart">
        <h2>Посещения по дням</h2>
        {stats.by_day.length === 0 ? (
          <p className="state-message">Пока нет данных</p>
        ) : (
          <div className="stats-chart__bars">
            {stats.by_day.map((d) => (
              <div className="stats-chart__col" key={d.day} title={`${formatDay(d.day)}: ${d.count}`}>
                <div
                  className="stats-chart__bar"
                  style={{ height: `${Math.max(4, (d.count / maxCount) * 100)}%` }}
                />
                <span className="stats-chart__label">{formatDay(d.day)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="stats-table">
        <h2>Популярные страницы</h2>
        {stats.top_pages.length === 0 ? (
          <p className="state-message">Пока нет данных</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Страница</th>
                <th>Посещений</th>
              </tr>
            </thead>
            <tbody>
              {stats.top_pages.map((p) => (
                <tr key={p.path}>
                  <td>{p.path}</td>
                  <td>{p.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <h2 className="stats-section-title">Заявки и продажи</h2>

      <div className="stats-tiles">
        <div className="stat-tile">
          <span className="stat-tile__label">Всего заявок</span>
          <span className="stat-tile__value">{stats.orders.total.toLocaleString('ru-RU')}</span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__label">Заявок за 14 дней</span>
          <span className="stat-tile__value">
            {stats.orders.last_14_days_total.toLocaleString('ru-RU')}
          </span>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__label">Сумма выполненных заявок</span>
          <span className="stat-tile__value">{formatMoney(stats.orders.revenue_done)}</span>
        </div>
      </div>

      <section className="stats-table">
        <h2>Заявки по статусам</h2>
        {stats.orders.by_status.length === 0 ? (
          <p className="state-message">Заявок пока нет</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Статус</th>
                <th>Заявок</th>
              </tr>
            </thead>
            <tbody>
              {stats.orders.by_status.map((s) => (
                <tr key={s.status}>
                  <td>{s.label}</td>
                  <td>{s.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {stats.orders.revenue_pending > 0 && (
          <p className="stats-note">
            В необработанных заявках (новые + в обработке) на сумму{' '}
            {formatMoney(stats.orders.revenue_pending)}
          </p>
        )}
      </section>
    </div>
  )
}
