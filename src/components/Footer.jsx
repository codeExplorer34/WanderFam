import { Link } from 'react-router-dom'
import styles from './Footer.module.css'
import { toast } from 'react-hot-toast'

import { useLocation } from 'react-router-dom'

export default function Footer() {
    const { pathname } = useLocation()



    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.inner}`}>
                <div className={styles.brand}>
                    <Link to="/" className={styles.logo}>
                        <span className={styles.logoText}>Wander<span className={styles.italic}>Fam</span></span>
                    </Link>
                    <p className={styles.brandDesc}>
                        The intelligent family travel companion. Keeping you organized and your children inspired from check-in to touchdown.
                    </p>
                    <div className={styles.statusBadge}>
                        <div className={styles.pulse} />
                        All Systems Normal
                    </div>
                </div>

                <div className={styles.links}>
                    <div className={styles.col}>
                        <div className={styles.colLabel}>Experience</div>
                        <Link to="/setup">Start Your Journey</Link>
                        <Link to="/dashboard">Family Dashboard</Link>
                        <Link to="/map" className={styles.premiumLink}>Airport Map</Link>
                    </div>
                    <div className={styles.col}>
                        <div className={styles.colLabel}>Resources</div>
                        <Link to="/security">Security Guide</Link>
                        <Link to="/packing">Packing List</Link>
                        <Link to="/activities">Activity Hub</Link>
                    </div>
                    <div className={styles.col}>
                        <div className={styles.colLabel}>Support</div>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <a href="mailto:hello@wanderfam.ai">Contact Us</a>
                    </div>
                </div>
            </div>

            <div className={styles.bottomWrapper}>
                <div className={`container ${styles.bottom}`}>
                    <div className={styles.copyright}>
                        © 2026 WanderFam. Designed for the modern family.
                    </div>
                </div>
            </div>
        </footer>
    )
}
