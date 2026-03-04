import { motion } from 'framer-motion'
import { Plane, Star, Zap, ShieldCheck, Map, Gamepad2, Bell } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import styles from './SystemPage.module.css'

const colors = [
    { name: 'Sky', value: '#7DD3FC', token: '--sky', role: 'Primary accent / CTAs' },
    { name: 'Iris', value: '#A78BFA', token: '--iris', role: 'Secondary accent / alerts' },
    { name: 'Mint', value: '#6EE7B7', token: '--mint', role: 'Success / confirmation' },
    { name: 'Peach', value: '#FDBA74', token: '--peach', role: 'Warning / snack reminders' },
    { name: 'Urgent', value: '#FB7185', token: '--urgent', role: 'Urgent alerts (soft)' },
    { name: 'Base 0', value: '#070A12', token: '--base-0', role: 'Page background' },
    { name: 'Base 1', value: '#0B1020', token: '--base-1', role: 'Card background' },
    { name: 'Surface', value: 'rgba(255,255,255,0.05)', token: '--surface', role: 'Glass surface' },
]

const typeSamples = [
    { label: 'H1 — Hero Heading', size: 56, weight: 700, family: 'Space Grotesk', text: 'Travel calmer.' },
    { label: 'H2 — Section Title', size: 40, weight: 700, family: 'Space Grotesk', text: 'Smart Timeline' },
    { label: 'H3 — Card Title', size: 24, weight: 600, family: 'Space Grotesk', text: 'Coloring Pack' },
    { label: 'Body — Default', size: 16, weight: 400, family: 'Inter', text: 'Plan your family journey with intelligent alerts.' },
    { label: 'Caption / Label', size: 12, weight: 600, family: 'Inter', text: 'SMART TIMELINE · BOARDING IN 90 MIN' },
]

const chipVariants = [
    { label: 'Sky', class: 'chip-sky' },
    { label: 'Iris', class: 'chip-iris' },
    { label: 'Mint', class: 'chip-mint' },
    { label: 'Peach', class: 'chip-peach' },
    { label: 'Urgent', class: 'chip-urgent' },
]

export default function SystemPage() {
    return (
        <PageWrapper>
            <div className={`container ${styles.wrapper}`}>
                <div style={{ marginBottom: 60 }}>
                    <div className="section-label">Design System</div>
                    <h2>WanderFam Design System</h2>
                    <p style={{ marginTop: 8 }}>Tokens, components, and patterns that power the WanderFam experience.</p>
                </div>

                {/* Colors */}
                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Color Palette</h3>
                    <div className={styles.colorGrid}>
                        {colors.map(c => (
                            <div key={c.name} className={`glass ${styles.colorCard}`}>
                                <div className={styles.colorSwatch} style={{ background: c.value, boxShadow: `0 8px 24px ${c.value}44` }} />
                                <div className={styles.colorInfo}>
                                    <div className={styles.colorName}>{c.name}</div>
                                    <div className={styles.colorToken}>{c.token}</div>
                                    <div className={styles.colorRole}>{c.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Typography */}
                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Typography Scale</h3>
                    <div className={`glass ${styles.typoCard}`}>
                        {typeSamples.map((t, i) => (
                            <div key={i} className={styles.typoRow}>
                                <div className={styles.typoMeta}>
                                    <span>{t.label}</span>
                                    <span className={styles.typoSpec}>{t.family} · {t.size}px · {t.weight}</span>
                                </div>
                                <div
                                    className={styles.typoSample}
                                    style={{
                                        fontSize: Math.min(t.size, 40),
                                        fontWeight: t.weight,
                                        fontFamily: t.family === 'Space Grotesk' ? 'var(--font-heading)' : 'var(--font-body)',
                                        letterSpacing: t.weight >= 700 ? '-0.02em' : '0.06em',
                                        textTransform: t.label.includes('Caption') ? 'uppercase' : 'none',
                                    }}
                                >
                                    {t.text}
                                </div>
                                {i < typeSamples.length - 1 && <div className="divider" />}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Buttons */}
                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Button System</h3>
                    <div className={`glass ${styles.componentCard}`}>
                        <div className={styles.componentRow}>
                            <div className={styles.componentLabel}>Primary</div>
                            <div className={styles.componentSamples}>
                                <button className="btn btn-primary btn-sm">Small</button>
                                <button className="btn btn-primary">Default</button>
                                <button className="btn btn-primary btn-lg">Large</button>
                            </div>
                        </div>
                        <div className="divider" />
                        <div className={styles.componentRow}>
                            <div className={styles.componentLabel}>Secondary</div>
                            <div className={styles.componentSamples}>
                                <button className="btn btn-secondary btn-sm">Small</button>
                                <button className="btn btn-secondary">Default</button>
                                <button className="btn btn-secondary btn-lg">Large</button>
                            </div>
                        </div>
                        <div className="divider" />
                        <div className={styles.componentRow}>
                            <div className={styles.componentLabel}>Ghost</div>
                            <div className={styles.componentSamples}>
                                <button className="btn btn-ghost btn-sm">Small</button>
                                <button className="btn btn-ghost">Default</button>
                                <button className="btn btn-ghost btn-lg">Large</button>
                            </div>
                        </div>
                        <div className="divider" />
                        <div className={styles.componentRow}>
                            <div className={styles.componentLabel}>With Icons</div>
                            <div className={styles.componentSamples}>
                                <button className="btn btn-primary"><Plane size={14} /> Start Trip</button>
                                <button className="btn btn-secondary"><Map size={14} /> View Map</button>
                                <button className="btn btn-ghost"><Bell size={14} /> Alerts</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Chips */}
                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Chips & Tags</h3>
                    <div className={`glass ${styles.componentCard}`}>
                        <div className={styles.chipRow}>
                            {chipVariants.map(c => (
                                <span key={c.class} className={`chip ${c.class}`}>{c.label}</span>
                            ))}
                        </div>
                        <div className="divider" style={{ margin: '20px 0' }} />
                        <div className={styles.chipRow}>
                            <span className="chip chip-sky"><Plane size={11} /> Smart Travel</span>
                            <span className="chip chip-mint"><ShieldCheck size={11} /> Security Clear</span>
                            <span className="chip chip-iris"><Gamepad2 size={11} /> Activity Time</span>
                            <span className="chip chip-peach"><Star size={11} /> Priority</span>
                            <span className="chip chip-urgent"><Zap size={11} /> Alert</span>
                        </div>
                    </div>
                </section>

                {/* Glass Cards */}
                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Glass Card Variants</h3>
                    <div className={styles.cardRow}>
                        <div className={`glass ${styles.sampleCard}`}>
                            <div style={{ fontSize: 11, color: 'var(--sky)', fontWeight: 600, marginBottom: 8, fontFamily: 'var(--font-heading)', letterSpacing: '0.06em' }}>glass</div>
                            <h4>Standard Card</h4>
                            <p style={{ fontSize: 13 }}>5% opacity surface with soft border. Default container for all content blocks.</p>
                        </div>
                        <div className={`glass-elevated ${styles.sampleCard}`}>
                            <div style={{ fontSize: 11, color: 'var(--iris)', fontWeight: 600, marginBottom: 8, fontFamily: 'var(--font-heading)', letterSpacing: '0.06em' }}>glass-elevated</div>
                            <h4>Elevated Card</h4>
                            <p style={{ fontSize: 13 }}>9% opacity with stronger border. Used for CTAs and highlighted panels.</p>
                        </div>
                        <div className={`glass ${styles.sampleCard} aurora-sky`}>
                            <div style={{ fontSize: 11, color: 'var(--sky)', fontWeight: 600, marginBottom: 8, fontFamily: 'var(--font-heading)', letterSpacing: '0.06em' }}>aurora-sky</div>
                            <h4>Aurora Glow</h4>
                            <p style={{ fontSize: 13 }}>Glass with sky aurora glow. Used for primary action emphasis.</p>
                        </div>
                    </div>
                </section>

                {/* Progress */}
                <section className={styles.section}>
                    <h3 className={styles.sectionTitle}>Progress Indicators</h3>
                    <div className={`glass ${styles.componentCard}`}>
                        {[25, 50, 75, 100].map(v => (
                            <div key={v} style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                                    <span>Progress</span><span style={{ color: v === 100 ? 'var(--mint)' : 'var(--sky)' }}>{v}%</span>
                                </div>
                                <div className="progress-bar">
                                    <motion.div
                                        className="progress-fill"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${v}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: 0.1 }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </PageWrapper>
    )
}
