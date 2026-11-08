import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getProductById, type Product } from '../data/products'
import { getSellPrice } from '../utils/pricing'

export interface CartLine {
  productId: string
  quantity: number
}

interface CartContextValue {
  lines: CartLine[]
  itemCount: number
  subtotal: number
  isOpen: boolean
  checkoutOpen: boolean
  openCart: () => void
  closeCart: () => void
  openCheckout: () => void
  closeCheckout: () => void
  addItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  getLineProduct: (productId: string) => (Product & { price: number }) | undefined
}

const STORAGE_KEY = 'pretty-meisie-cart'

const CartContext = createContext<CartContextValue | null>(null)

function loadLines(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartLine[]
    return Array.isArray(parsed) ? parsed.filter((l) => l.productId && l.quantity > 0) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => loadLines())
  const [isOpen, setIsOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines])

  const addItem = useCallback((productId: string) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId)
      if (existing) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, quantity: l.quantity + 1 } : l,
        )
      }
      return [...prev, { productId, quantity: 1 }]
    })
    setIsOpen(true)
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) return prev.filter((l) => l.productId !== productId)
      return prev.map((l) => (l.productId === productId ? { ...l, quantity } : l))
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId))
  }, [])

  const clearCart = useCallback(() => setLines([]), [])

  const getLineProduct = useCallback((productId: string) => getProductById(productId), [])

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  )

  const subtotal = useMemo(
    () =>
      lines.reduce((sum, line) => {
        const product = getProductById(line.productId)
        if (!product) return sum
        return sum + getSellPrice(product.basePrice) * line.quantity
      }, 0),
    [lines],
  )

  const value: CartContextValue = {
    lines,
    itemCount,
    subtotal,
    isOpen,
    checkoutOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    openCheckout: () => {
      setIsOpen(false)
      setCheckoutOpen(true)
    },
    closeCheckout: () => setCheckoutOpen(false),
    addItem,
    setQuantity,
    removeItem,
    clearCart,
    getLineProduct,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
