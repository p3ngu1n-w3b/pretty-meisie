import { useState, type FormEvent } from 'react'
import { useCart } from '../context/CartContext'
import { formatZar } from '../utils/pricing'
import { buildWhatsAppUrl, type CustomerDetails } from '../utils/whatsapp'
import styles from './CheckoutForm.module.css'

const empty: CustomerDetails = {
  name: '',
  surname: '',
  email: '',
  phone: '',
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 9 && digits.length <= 12
}

export function CheckoutForm() {
  const { checkoutOpen, closeCheckout, lines, subtotal, clearCart } = useCart()
  const [form, setForm] = useState<CustomerDetails>(empty)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')

    if (!form.name.trim() || !form.surname.trim()) {
      setError('Please enter your name and surname.')
      return
    }
    if (!isValidEmail(form.email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    if (!isValidPhone(form.phone.trim())) {
      setError('Please enter a valid phone number.')
      return
    }
    if (lines.length === 0) {
      setError('Your bag is empty.')
      return
    }

    const url = buildWhatsAppUrl(
      {
        name: form.name.trim(),
        surname: form.surname.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      },
      lines,
      subtotal,
    )

    window.open(url, '_blank', 'noopener,noreferrer')
    clearCart()
    setSent(true)
    setForm(empty)
  }

  function handleClose() {
    setSent(false)
    setError('')
    closeCheckout()
  }

  if (!checkoutOpen) return null

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="checkout-title">
      <div className={styles.panel}>
        <div className={styles.top}>
          <h2 id="checkout-title">{sent ? 'Almost there' : 'Checkout'}</h2>
          <button type="button" className={styles.close} onClick={handleClose}>
            Close
          </button>
        </div>

        {sent ? (
          <div className={styles.success}>
            <p>
              WhatsApp should open with your order for Chanese Van Der Berg. Send the message to
              complete your request.
            </p>
            <button type="button" className={styles.submit} onClick={handleClose}>
              Back to shop
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <p className={styles.intro}>
              Complete your details to send the order on WhatsApp. Total:{' '}
              <strong>{formatZar(subtotal)}</strong>
            </p>

            <label>
              Name
              <input
                name="name"
                autoComplete="given-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </label>
            <label>
              Surname
              <input
                name="surname"
                autoComplete="family-name"
                value={form.surname}
                onChange={(e) => setForm((f) => ({ ...f, surname: e.target.value }))}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </label>
            <label>
              Phone number
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="061 000 0000"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
              />
            </label>

            {error ? <p className={styles.error}>{error}</p> : null}

            <button type="submit" className={styles.submit}>
              Send order on WhatsApp
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
