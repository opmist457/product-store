import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useProductStore } from '../store/productStore'
import styles from './CreatePage.module.css'

export default function CreatePage() {
  const navigate = useNavigate()
  const { createProduct } = useProductStore()
  const [form, setForm] = useState({ name: '', price: '', image: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await createProduct(form)
    setLoading(false)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.message || 'Failed to create product. Please try again.')
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.back}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Inventory
          </Link>
        </div>

        <div className={styles.layout}>
          <div className={styles.leftCol}>
            <h1 className={styles.title}>New<br/>Product</h1>
            <p className={styles.desc}>
              Add a new item to your store inventory. Fill in the details and
              provide an image URL to get started.
            </p>

            <div className={styles.tips}>
              <div className={styles.tip}>
                <span className={styles.tipDot} />
                Use a stable, publicly accessible image URL
              </div>
              <div className={styles.tip}>
                <span className={styles.tipDot} />
                Price should be a number without currency symbol
              </div>
            </div>
          </div>

          <div className={styles.card}>
            {error && (
              <div className={styles.errorBanner}>
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Product Name</label>
                <input
                  className={styles.input}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Wireless Headphones"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Price (USD)</label>
                <div className={styles.priceWrap}>
                  <span className={styles.priceSign}>$</span>
                  <input
                    className={`${styles.input} ${styles.priceInput}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Image URL</label>
                <input
                  className={styles.input}
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              {form.image && (
                <div className={styles.previewWrap}>
                  <p className={styles.previewLabel}>Preview</p>
                  <img
                    src={form.image}
                    alt="Preview"
                    className={styles.preview}
                    onError={(e) => {
                      e.target.src = `https://placehold.co/600x300/1c1c20/555?text=Invalid+URL`
                    }}
                  />
                </div>
              )}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner} />
                    Creating...
                  </>
                ) : (
                  'Create Product'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}