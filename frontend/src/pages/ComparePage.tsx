import { Link } from 'react-router-dom'
import { useCart } from '../app/CartProvider'
import { useCompare } from '../app/CompareProvider'
import { useFetch } from '../hooks/useFetch'
import type { Product } from '../types/product'

export function ComparePage() {
  const { compareIds, toggleCompare, clearCompare } = useCompare()
  const { addToCart } = useCart()
  const { data: products, loading, error } = useFetch<Product[]>('/products/')

  if (loading) return <p className="state-message">Загрузка...</p>
  if (error) return <p className="state-message">Не удалось загрузить товары</p>

  const items = (products ?? []).filter((p) => compareIds.includes(p.id))

  if (items.length < 2) {
    return (
      <div className="state-message">
        <p>Выберите минимум два товара для сравнения</p>
        <p>
          На карточке товара в каталоге нажмите «Сравнить» — здесь появится таблица с
          характеристиками рядом.
        </p>
        <p>
          <Link to="/catalog">Перейти в каталог</Link>
        </p>
      </div>
    )
  }

  const characteristicNames: string[] = []
  for (const item of items) {
    for (const c of item.characteristics) {
      if (!characteristicNames.includes(c.name)) characteristicNames.push(c.name)
    }
  }

  return (
    <div className="compare-page">
      <div className="compare-page__header">
        <h1>Сравнение товаров</h1>
        <button type="button" className="filters__reset" onClick={clearCompare}>
          Очистить сравнение
        </button>
      </div>

      <div className="compare-table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th />
              {items.map((item) => (
                <th key={item.id}>
                  <button
                    type="button"
                    className="compare-table__remove"
                    onClick={() => toggleCompare(item.id)}
                    aria-label="Убрать из сравнения"
                  >
                    ×
                  </button>
                  {item.image ? (
                    <img className="compare-table__image" src={item.image} alt={item.name} />
                  ) : (
                    <div className="compare-table__image compare-table__image--placeholder" aria-hidden="true" />
                  )}
                  <Link to={`/product/${item.slug}`} className="compare-table__name">
                    {item.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Цена</th>
              {items.map((item) => (
                <td key={item.id}>{item.price.toLocaleString('ru-RU')} ₸</td>
              ))}
            </tr>
            <tr>
              <th>Категория</th>
              {items.map((item) => (
                <td key={item.id}>{item.category.name}</td>
              ))}
            </tr>
            <tr>
              <th>Бренд</th>
              {items.map((item) => (
                <td key={item.id}>{item.brand}</td>
              ))}
            </tr>
            <tr>
              <th>Наличие</th>
              {items.map((item) => (
                <td key={item.id}>{item.in_stock ? 'В наличии' : 'Под заказ'}</td>
              ))}
            </tr>
            {characteristicNames.map((name) => (
              <tr key={name}>
                <th>{name}</th>
                {items.map((item) => {
                  const c = item.characteristics.find((c) => c.name === name)
                  return <td key={item.id}>{c ? c.value : '—'}</td>
                })}
              </tr>
            ))}
            <tr>
              <th />
              {items.map((item) => (
                <td key={item.id}>
                  <button
                    type="button"
                    className="product-card__button"
                    onClick={() => addToCart(item.id)}
                  >
                    В корзину
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
