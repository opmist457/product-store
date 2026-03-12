import { useState } from 'react'
import { useProductStore } from '../store/productStore'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const { deleteProduct, updateProduct } = useProductStore()
  const [isEditing, setIsEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    image: product.image,
  })

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const handleDelete = async () => {
    setDeleting(true)
    const result = await deleteProduct(product._id)
    if (!result.success) {
      showToast(result.message || 'Delete failed', 'error')
      setDeleting(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    const result = await updateProduct(product._id, form)
    setSaving(false)
    if (result.success) {
      setIsEditing(false)
      showToast('Product updated!')
    } else {
      showToast(result.message || 'Update failed', 'error')
    }
  }

  return (
    <>
      <article className={styles.card}>
        <div className={styles.imageWrap}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.image}
            onError={(e) => {
              e.target.src = `https://placehold.co/400x300/1c1c20/555?text=No+Image`
            }}
          />
          <div className={styles.overlay}>
            <button
              className={styles.overlayBtn}
              onClick={() => setIsEditing(true)}
              title="Edit"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit
            </button>
            <button
              className={`${styles.overlayBtn} ${styles.deleteBtn}`}
              onClick={handleDelete}
              disabled={deleting}
              title="Delete"
            >
              {deleting ? (
                <span className={styles.spinner} />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              )}
              Delete
            </button>
          </div>
        </div>

        <div className={styles.info}>
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.price}>${Number(product.price).toFixed(2)}</p>
        </div>
      </article>

      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.msg}
        </div>
      )}

      {isEditing && (
        <div className={styles.modalBackdrop} onClick={() => setIsEditing(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Edit Product</h2>
              <button className={styles.closeBtn} onClick={() => setIsEditing(false)}>✕</button>
            </div>

            <form onSubmit={handleUpdate} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Product Name</label>
                <input
                  className={styles.input}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Enter product name"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Price (USD)</label>
                <input
                  className={styles.input}
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  placeholder="0.00"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Image URL</label>
                <input
                  className={styles.input}
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  required
                  placeholder="https://..."
                />
              </div>

              {form.image && (
                <div className={styles.previewWrap}>
                  <img
                    src={form.image}
                    alt="Preview"
                    className={styles.preview}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
              )}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={saving}
                >
                  {saving ? <span className={styles.spinner} /> : null}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}