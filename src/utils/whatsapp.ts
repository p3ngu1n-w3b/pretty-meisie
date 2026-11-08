import { formatZar } from './pricing'
import type { CartLine } from '../context/CartContext'
import { getProductById } from '../data/products'
import { getSellPrice } from './pricing'

export const WHATSAPP_NUMBER = '27613438441'

export interface CustomerDetails {
  name: string
  surname: string
  email: string
  phone: string
}

export function buildWhatsAppUrl(customer: CustomerDetails, lines: CartLine[], total: number) {
  const itemLines = lines
    .map((line) => {
      const product = getProductById(line.productId)
      if (!product) return null
      const unit = getSellPrice(product.basePrice)
      const lineTotal = unit * line.quantity
      return `• ${product.name} × ${line.quantity} — ${formatZar(lineTotal)}`
    })
    .filter(Boolean)
    .join('\n')

  const message = [
    'Hi Chanese, I would like to place an order via Pretty Meisie.',
    '',
    'Customer details:',
    `Name: ${customer.name} ${customer.surname}`,
    `Email: ${customer.email}`,
    `Phone: ${customer.phone}`,
    '',
    'Order:',
    itemLines,
    '',
    `Total: ${formatZar(total)}`,
  ].join('\n')

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
