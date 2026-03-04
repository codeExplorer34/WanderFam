import styles from './SupportPage.module.css'
import PageWrapper from '../components/PageWrapper'

export default function PrivacyPage() {
    return (
        <PageWrapper>
            <div className={`container ${styles.wrapper}`}>
                <div className="section-label">Support</div>
                <h1 className="hero-title-cinematic">Privacy <span>Policy</span></h1>
                <div className={styles.content}>
                    <p className={styles.intro}>
                        Your family's privacy is our highest priority. As a travel co-pilot, WanderFam is designed to be a local-first, secure companion.
                    </p>

                    <section className={styles.section}>
                        <h2>1. Data Minimization</h2>
                        <p>We only collect the data necessary to provide trip assistance. Your children's names and ages are stored locally on your device unless you explicitly enable Cloud Sync.</p>
                    </section>

                    <section className={styles.section}>
                        <h2>2. Location Privacy</h2>
                        <p>Airport mapping features use your location only while the app is active and in use. We do not track your location in the background or sell your movement data to third parties.</p>
                    </section>

                    <section className={styles.section}>
                        <h2>3. AI Ethics</h2>
                        <p>Our proactive stress-detection AI operates on-device to ensure your family's emotional sentiment data never leaves your secure environment.</p>
                    </section>

                    <div className={styles.demoNotice}>
                        <strong>Note:</strong> This is a WanderFam MVP Prototype. For legal questions, please contact hello@wanderfam.ai.
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}
