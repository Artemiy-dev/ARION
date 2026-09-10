import type { Category } from '../../types/product'

export interface Filters {
  categorySlug: string | null
  maxPrice: number | null
  inStockOnly: boolean
}

interface FilterSidebarProps {
  categories: Category[]
  priceLimit: number
  filters: Filters
  onChange: (filters: Filters) => void
  onReset: () => void
}

export function FilterSidebar({
  categories,
  priceLimit,
  filters,
  onChange,
  onReset,
}: FilterSidebarProps) {
  const currentMaxPrice = filters.maxPrice ?? priceLimit

  return (
    <aside className="filters">
      <h2 className="filters__title">Фильтры</h2>

      <div className="filters__group">
        <h3>Категория</h3>
        <label className="filters__option">
          <input
            type="radio"
            name="category"
            checked={filters.categorySlug === null}
            onChange={() => onChange({ ...filters, categorySlug: null })}
          />
          Все категории
        </label>
        {categories.map((category) => (
          <label className="filters__option" key={category.slug}>
            <input
              type="radio"
              name="category"
              checked={filters.categorySlug === category.slug}
              onChange={() => onChange({ ...filters, categorySlug: category.slug })}
            />
            {category.name}
          </label>
        ))}
      </div>

      <div className="filters__group">
        <h3>Цена до</h3>
        <input
          type="range"
          min={0}
          max={priceLimit}
          step={1000}
          value={currentMaxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
        />
        <span>{currentMaxPrice.toLocaleString('ru-RU')} ₸</span>
      </div>

      <div className="filters__group">
        <label className="filters__option">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
          />
          Только в наличии
        </label>
      </div>

      <button type="button" className="filters__reset" onClick={onReset}>
        Сбросить фильтры
      </button>
    </aside>
  )
}
