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
        </footer>
        <CartDrawer />
        <CheckoutForm />
      </div>
    </CartProvider>
  )
}
