import { useCart } from '../context/CartContext'
import { formatZar } from '../utils/pricing'
import styles from './CartDrawer.module.css'

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    lines,
    subtotal,
    setQuantity,
    removeItem,
    openCheckout,
    getLineProduct,
  } = useCart()

  return (
    <>
      <div
        className={isOpen ? styles.backdropOpen : styles.backdrop}
        onClick={closeCart}
        aria-hidden={!isOpen}
      />
      <aside
        className={isOpen ? styles.drawerOpen : styles.drawer}
        aria-hidden={!isOpen}
        aria-label="Shopping bag"
      >
        <div className={styles.top}>
          <h2>Your bag</h2>
          <button type="button" className={styles.close} onClick={closeCart}>
            Close
          </button>
        </div>

        {lines.length === 0 ? (
          <p className={styles.empty}>Your bag is empty. Add something pretty.</p>
        ) : (
          <ul className={styles.list}>
            {lines.map((line) => {
              const product = getLineProduct(line.productId)
              if (!product) return null
              return (
                <li key={line.productId} className={styles.item}>
                  <img src={product.image} alt="" className={styles.thumb} />
                  <div className={styles.itemBody}>
                    <p className={styles.itemName}>{product.name}</p>
                    <p className={styles.itemPrice}>{formatZar(product.price)}</p>
                    <div className={styles.qtyRow}>
                      <button
                        type="button"
                        onClick={() => setQuantity(line.productId, line.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(line.productId, line.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className={styles.remove}
                        onClick={() => removeItem(line.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <div className={styles.footer}>
          <div className={styles.total}>
            <span>Total</span>
            <strong>{formatZar(subtotal)}</strong>
          </div>
          <button
            type="button"
            className={styles.checkout}
            disabled={lines.length === 0}
            onClick={openCheckout}
          >
            Checkout
          </button>
        </div>
      </aside>
    </>
  )
}
