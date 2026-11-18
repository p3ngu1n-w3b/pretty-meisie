import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero} id="top" aria-label="Pretty Meisie">
      <div className={styles.veil} />
      <div className={styles.content}>
        <p className={styles.eyebrow}>Beauty, chosen with care</p>
        <h1 className={styles.brand}>
          Pretty <span className={styles.brandAccent}>Meisie</span>
        </h1>
        <p className={styles.lead}>
          Your trusted South African beauty edit — handpicked skincare, makeup and haircare,
          ordered personally on WhatsApp.
        </p>
        <p className={styles.description}>
          Skip the endless shelves. Every product is curated for glow, quality and real results,
          then ordered straight with Chanese so you get guidance, care and a shopping experience
          that feels personal — not like another marketplace cart.
        </p>
        <a className={styles.cta} href="#catalogue">
          Shop catalogue
        </a>
      </div>
    </section>
  )
}
