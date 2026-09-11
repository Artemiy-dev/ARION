import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import type { Product } from '../../types/product'

const MAX_SUGGESTIONS = 6

export function SearchBox({ onNavigate }: { onNavigate?: () => void }) {
  const { data: products } = useFetch<Product[]>('/products/')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const q = query.trim().toLowerCase()
  const matches =
    q.length > 0
      ? (products ?? []).filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q),
        )
      : []

  function goToCatalog() {
    if (!q) return
    navigate(`/catalog?q=${encodeURIComponent(query.trim())}`)
    setOpen(false)
    onNavigate?.()
  }

  function goToProduct(slug: string) {
    navigate(`/product/${slug}`)
    setQuery('')
    setOpen(false)
    onNavigate?.()
  }

  return (
    <div className="header__search" ref={rootRef}>
      <form
        className="header__search-form"
        onSubmit={(e) => {
          e.preventDefault()
          goToCatalog()
        }}
      >
        <input
          type="search"
          className="header__search-input"
          placeholder="Поиск товаров..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
        />
        <button type="submit" className="header__search-submit" aria-label="Искать">
          ⌕
        </button>
      </form>

      {open && q.length > 0 && (
        <div className="header__search-dropdown">
          {matches.length === 0 ? (
            <p className="header__search-empty">Ничего не найдено</p>
          ) : (
            <>
              {matches.slice(0, MAX_SUGGESTIONS).map((p) => (
                <button
                  type="button"
                  key={p.id}
                  className="header__search-item"
                  onClick={() => goToProduct(p.slug)}
                >
                  {p.image ? (
                    <img src={p.image} alt="" className="header__search-item__image" />
                  ) : (
                    <span className="header__search-item__image header__search-item__image--placeholder" />
                  )}
                  <span className="header__search-item__info">
                    <span className="header__search-item__name">{p.name}</span>
                    <span className="header__search-item__price">
                      {p.price.toLocaleString('ru-RU')} ₸
                    </span>
                  </span>
                </button>
              ))}
              {matches.length > 0 && (
                <button type="button" className="header__search-all" onClick={goToCatalog}>
                  Все результаты ({matches.length})
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
