import type { Product } from '../data/products'
import { useCart } from '../context/CartContext'
import { formatZar } from '../utils/pricing'
import styles from './ProductCard.module.css'

interface Props {
  product: Product & { price: number }
  index: number
}

export function ProductCard({ product, index }: Props) {
  const { addItem } = useCart()

  return (
    <article
      className={styles.card}
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className={styles.media}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={styles.image}
        />
        <span className={styles.price}>{formatZar(product.price)}</span>
      </div>
      <div className={styles.meta}>
        <p className={styles.category}>{product.category}</p>
        <h3 className={styles.name}>{product.name}</h3>
        {product.size ? <p className={styles.size}>{product.size}</p> : null}
        <button type="button" className={styles.add} onClick={() => addItem(product.id)}>
          Add to bag
        </button>
      </div>
    </article>
  )
}
