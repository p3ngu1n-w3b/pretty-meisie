/** 15% markup on PDF catalogue base price, rounded to nearest rand. */
export function getSellPrice(basePrice: number): number {
  return Math.round(basePrice * 1.15)
}

export function formatZar(amount: number): string {
  return `R${amount.toLocaleString('en-ZA')}`
}
