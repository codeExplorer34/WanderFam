import styles from './SupportPage.module.css'
import PageWrapper from '../components/PageWrapper'

export default function TermsPage() {
    return (
        <PageWrapper>
            <div className={`container ${styles.wrapper}`}>
                <div className="section-label">Support</div>
                <h1 className="hero-title-cinematic">Terms of <span>Service</span></h1>
                <div className={styles.content}>
                    <p className={styles.intro}>
                        By using the WanderFam prototype, you agree to our initial companion guidelines designed for a safe and stress-free travel experience.
                    </p>

                    <section className={styles.section}>
                        <h2>1. Prototype Usage</h2>
                        <p>WanderFam is currently in MVP Prototype mode. Features like "Adaptive AI" and "Live Sync" are demonstrative and should not be solely relied upon for critical flight safety.</p>
                    </section>

                    <section className={styles.section}>
                        <h2>2. Family Responsibility</h2>
                        <p>While WanderFam provides helpful reminders (snacks, activities), parents remain responsible for their children's safety and well-being at all times during travel.</p>
                    </section>

                    <section className={styles.section}>
                        <h2>3. Intellectual Property</h2>
                        <p>All designs, animations, and the WanderFam brand identity are protected. Unauthorized reproduction of this prototype's experimental UI is prohibited.</p>
                    </section>

                    <div className={styles.demoNotice}>
                        <strong>Note:</strong> This is a WanderFam MVP Prototype. For full terms, please contact hello@wanderfam.ai.
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}
