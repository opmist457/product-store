import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const location = useLocation()

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>■</span>
          <span className={styles.logoText}>STOCKD</span>
        </Link>

        <nav className={styles.nav}>
          <Link
            to="/"
            className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
          >
            Inventory
          </Link>
          <Link
            to="/create"
            className={`${styles.navLink} ${location.pathname === '/create' ? styles.active : ''}`}
          >
            + New Product
          </Link>
        </nav>
      </div>
    </header>
  )
}