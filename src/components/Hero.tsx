import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero} id="top" aria-label="Pretty Meisie">
      <div className={styles.veil} />
      <div className={styles.content}>
        <p className={styles.eyebrow}>Beauty catalogue</p>
        <h1 className={styles.brand}>Pretty Meisie</h1>
        <p className={styles.tagline}>
          Slim picks in blush and lilac — curated glow, delivered through WhatsApp.
        </p>
        <a className={styles.cta} href="#catalogue">
          Shop catalogue
        </a>
      </div>
    </section>
  )
}
