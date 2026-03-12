import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../store/productStore'
import ProductCard from '../components/ProductCard'
import styles from './HomePage.module.css'

export default function HomePage() {
  const { products, loading, error, fetchProducts } = useProductStore()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Inventory</h1>
            <p className={styles.subtitle}>
              {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} in store`}
            </p>
          </div>
          <Link to="/create" className={styles.addBtn}>
            + Add Product
          </Link>
        </div>

        {error && (
          <div className={styles.errorBanner}>
            <span>⚠</span> {error}
          </div>
        )}

        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>◫</div>
            <h2 className={styles.emptyTitle}>No products yet</h2>
            <p className={styles.emptyText}>Start building your inventory by adding your first product.</p>
            <Link to="/create" className={styles.emptyBtn}>Create First Product</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map((product, i) => (
              <div key={product._id} style={{ animationDelay: `${i * 0.05}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}