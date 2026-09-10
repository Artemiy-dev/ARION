interface PaginationProps {
  page: number
  pageCount: number
  onChange: (page: number) => void
}

export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  if (pageCount <= 1) return null

  return (
    <div className="pagination">
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          type="button"
          className={num === page ? 'pagination__page pagination__page--active' : 'pagination__page'}
          onClick={() => onChange(num)}
        >
          {num}
        </button>
      ))}
    </div>
  )
}
