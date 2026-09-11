import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Pagination } from '../components/catalog/Pagination'
import { ProductCard } from '../components/catalog/ProductCard'
import { FilterSidebar, type Filters } from '../components/catalog/FilterSidebar'
import { SortDropdown, type SortOption } from '../components/catalog/SortDropdown'
import { useFetch } from '../hooks/useFetch'
import type { Category, Product } from '../types/product'

const PAGE_SIZE = 6

export function CatalogPage() {
  const { data: products, error, loading } = useFetch<Product[]>('/products/')
  const { data: categories } = useFetch<Category[]>('/categories/')
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('q') ?? '').trim().toLowerCase()

  const priceLimit = useMemo(() => {
    if (!products || products.length === 0) return 100000
    return Math.max(...products.map((p) => p.price))
  }, [products])

  const [filters, setFilters] = useState<Filters>({
    categorySlug: null,
    maxPrice: null,
    inStockOnly: false,
  })
  const [sort, setSort] = useState<SortOption>('name')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [query])

  const filtered = useMemo(() => {
    if (!products) return []

    let result = products.filter((p) => {
      if (filters.categorySlug && p.category.slug !== filters.categorySlug) return false
      if (filters.maxPrice !== null && p.price > filters.maxPrice) return false
      if (filters.inStockOnly && !p.in_stock) return false
      if (query) {
        const haystack = `${p.name} ${p.brand} ${p.description}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })

    result = [...result].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return a.name.localeCompare(b.name)
    })

    return result
  }, [products, filters, sort, query])

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE)
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleFiltersChange(next: Filters) {
    setFilters(next)
    setPage(1)
  }

  function handleReset() {
    setFilters({ categorySlug: null, maxPrice: null, inStockOnly: false })
    setPage(1)
  }

  if (loading) return <p className="state-message">Загрузка...</p>
  if (error) return <p className="state-message">Не удалось загрузить каталог</p>

  return (
    <div className="catalog">
      <p className="catalog__breadcrumbs">Главная / Принтеры</p>

      {query && (
        <p className="catalog__search-info">
          Результаты по запросу «{searchParams.get('q')}»
        </p>
      )}

      <div className="catalog__layout">
        <FilterSidebar
          categories={categories ?? []}
          priceLimit={priceLimit}
          filters={filters}
          onChange={handleFiltersChange}
          onReset={handleReset}
        />

        <div className="catalog__main">
          <div className="catalog__toolbar">
            <span>{filtered.length} товаров</span>
            <SortDropdown value={sort} onChange={setSort} />
          </div>

          {pageItems.length > 0 ? (
            <div className="catalog__grid">
              {pageItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p>Товары не найдены</p>
          )}

          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
