import { CartProvider } from './context/CartContext'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProductGrid } from './components/ProductGrid'
import { CartDrawer } from './components/CartDrawer'
import { CheckoutForm } from './components/CheckoutForm'
import styles from './App.module.css'

export default function App() {
  return (
    <CartProvider>
      <div className={styles.app}>
        <Header />
        <main>
          <Hero />
          <ProductGrid />
        </main>
        <footer className={styles.footer}>
          <img src="/logo.jpg" alt="Pretty Meisie" className={styles.footerLogo} />
          <p>Orders via WhatsApp with Chanese Van Der Berg · 061 343 8441</p>
          <div className={styles.credit}>
            <p>
              This website was built by{' '}
              <a href="https://jacoroux.co.za" target="_blank" rel="noreferrer">
                jacoroux.co.za
              </a>
            </p>
            <p>
              For any website requirements:{' '}
              <a href="tel:+27615140414">061 514 0414</a>
              {' | '}
              <a href="mailto:jaco.roux9@gmail.com">jaco.roux9@gmail.com</a>
            </p>
          </div>
        </footer>
        <CartDrawer />
        <CheckoutForm />
      </div>
    </CartProvider>
  )
}
