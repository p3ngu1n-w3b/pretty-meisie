import { useEffect, useMemo, useState } from 'react'
import { categories, products, type ProductCategory } from '../data/products'
import { ProductCard } from './ProductCard'
import styles from './ProductGrid.module.css'

const PAGE_SIZE = 6

export function ProductGrid() {
  const [active, setActive] = useState<'All' | ProductCategory>('All')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filtered = useMemo(
    () => (active === 'All' ? products : products.filter((p) => p.category === active)),
    [active],
  )

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [active])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  return (
    <section className={styles.section} id="catalogue">
      <div className={styles.head}>
        <h2 className={styles.title}>Catalogue</h2>
        <p className={styles.sub}>
          Nov–Dec beauty edit — complexion, skincare, colour, hair and more.
        </p>
      </div>

      <div className={styles.filters} role="tablist" aria-label="Product categories">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={active === cat}
            className={active === cat ? styles.filterActive : styles.filter}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {visible.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {hasMore ? (
        <div className={styles.moreRow}>
          <button
            type="button"
            className={styles.moreBtn}
            onClick={() => setVisibleCount((n) => Math.min(n + PAGE_SIZE, filtered.length))}
          >
            Show more
          </button>
          <button
            type="button"
            className={styles.allBtn}
            onClick={() => setVisibleCount(filtered.length)}
          >
            Show all
          </button>
        </div>
      ) : null}
    </section>
  )
}
