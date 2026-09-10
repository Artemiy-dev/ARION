export type SortOption = 'name' | 'price-asc' | 'price-desc'

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'name', label: 'По названию' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
]

interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <select
      className="sort-dropdown"
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
    >
      {OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
