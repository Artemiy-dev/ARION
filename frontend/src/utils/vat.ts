// Ставка НДС в Казахстане с 1 января 2026 года (новый Налоговый кодекс РК, повышена с 12% до 16%).
export const KZ_VAT_RATE = 0.16

// Цены в каталоге указаны с учётом НДС — функция выделяет сумму налога из итоговой суммы.
export function getIncludedVat(totalWithVat: number, rate: number = KZ_VAT_RATE): number {
  return Math.round((totalWithVat * rate) / (1 + rate))
}
