import { useCart } from '../context/CartContext'
import styles from './Header.module.css'

export function Header() {
  const { itemCount, openCart } = useCart()

  return (
    <header className={styles.header}>
      <a href="#top" className={styles.brand}>
        Pretty Meisie
      </a>
      <nav className={styles.nav}>
        <a href="#catalogue">Catalogue</a>
        <button type="button" className={styles.cartBtn} onClick={openCart}>
          Bag
          {itemCount > 0 ? <span className={styles.badge}>{itemCount}</span> : null}
        </button>
      </nav>
    </header>
  )
}
