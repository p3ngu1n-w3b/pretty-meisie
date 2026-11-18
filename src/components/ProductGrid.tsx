import { useEffect, useMemo, useState } from 'react'
import { categories, products, type ProductCategory } from '../data/products'
import { ProductCard } from './ProductCard'
import styles from './ProductGrid.module.css'

const PAGE_SIZE_MOBILE = 6
const PAGE_SIZE_DESKTOP = 16
const DESKTOP_MQ = '(min-width: 768px)'

function getPageSize() {
  if (typeof window === 'undefined') return PAGE_SIZE_DESKTOP
  return window.matchMedia(DESKTOP_MQ).matches ? PAGE_SIZE_DESKTOP : PAGE_SIZE_MOBILE
}

export function ProductGrid() {
  const [active, setActive] = useState<'All' | ProductCategory>('All')
  const [pageSize, setPageSize] = useState(getPageSize)
  const [visibleCount, setVisibleCount] = useState(getPageSize)

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MQ)
    const sync = () => {
      const next = media.matches ? PAGE_SIZE_DESKTOP : PAGE_SIZE_MOBILE
      setPageSize(next)
      setVisibleCount(next)
    }

    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  const filtered = useMemo(
    () => (active === 'All' ? products : products.filter((p) => p.category === active)),
    [active],
  )

  useEffect(() => {
    setVisibleCount(pageSize)
  }, [active, pageSize])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  return (
    <section className={styles.section} id="catalogue">
      <div className={styles.head}>
        <h2 className={styles.title}>Catalogue</h2>
        <p className={styles.sub}>
          Soft blush favourites — complexion, skincare, colour, hair and more.
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
            onClick={() => setVisibleCount((n) => Math.min(n + pageSize, filtered.length))}
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
