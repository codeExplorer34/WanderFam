import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Plane, Map, Gamepad2, ShieldCheck, ChevronRight, Star, Zap, Globe, Building, Castle, Wind, Shield, Navigation } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import ParallaxHero from '../components/ParallaxHero'
import { useDemoMode } from '../App'
import styles from './LandingPage.module.css'

const phoneScreens = [
    {
        label: 'Dashboard',
        bg: 'linear-gradient(135deg, rgba(125,211,252,0.08) 0%, rgba(7,10,18,0) 100%)',
        content: (
            <div style={{ padding: '20px 16px' }}>
                <div style={{ fontSize: 11, color: 'var(--sky)', fontFamily: 'var(--font-heading)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Today's Timeline</div>
                {[
                    { time: '14:30', label: 'Snack Break', color: 'var(--peach)', active: true },
                    { time: '15:00', label: 'Activity: Coloring Pack', color: 'var(--mint)' },
                    { time: '15:30', label: 'Head to Gate B22', color: 'var(--sky)' },
                    { time: '16:00', label: '✈ Boarding Begins', color: 'var(--iris)' },
                ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', width: 32, flexShrink: 0, textAlign: 'right' }}>{item.time}</div>
                        <div style={{ width: 3, height: 36, borderRadius: 4, background: item.color, flexShrink: 0, opacity: item.active ? 1 : 0.4 }} />
                        <div style={{ background: item.active ? `${item.color}18` : 'transparent', borderRadius: 8, padding: '6px 10px', flex: 1, border: item.active ? `1px solid ${item.color}44` : '1px solid transparent' }}>
                            <div style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-heading)', color: item.active ? item.color : 'var(--text-heading)' }}>{item.label}</div>
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        label: 'Map',
        bg: 'linear-gradient(135deg, rgba(167,139,250,0.08) 0%, rgba(7,10,18,0) 100%)',
        content: (
            <div style={{ padding: '20px 16px' }}>
                <div style={{ fontSize: 11, color: 'var(--iris)', fontFamily: 'var(--font-heading)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Terminal B — Level 2</div>
                <div style={{ background: 'rgba(167,139,250,0.06)', borderRadius: 16, padding: '16px', border: '1px solid rgba(167,139,250,0.15)', marginBottom: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {[
                            { label: '🚻 Restroom', time: '2 min' },
                            { label: '☕ Café', time: '4 min' },
                            { label: '🎮 Play Zone', time: '6 min' },
                            { label: '🚪 Gate B22', time: '12 min' },
                        ].map((p, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', padding: '8px 10px', borderRadius: 10 }}>
                                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 2 }}>{p.label}</div>
                                <div style={{ fontSize: 10, color: 'var(--iris)' }}>{p.time} walk</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ background: 'rgba(125,211,252,0.08)', border: '1px solid rgba(125,211,252,0.2)', borderRadius: 10, padding: '10px 12px', fontSize: 11, color: 'var(--sky)' }}>
                    📍 Stroller-friendly route active
                </div>
            </div>
        ),
    },
    {
        label: 'Calm Mode',
        bg: 'linear-gradient(135deg, rgba(110,231,183,0.08) 0%, rgba(7,10,18,0) 100%)',
        content: (
            <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--mint)', fontFamily: 'var(--font-heading)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Calm Mode Active</div>
                <div style={{ position: 'relative', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: 'rgba(110,231,183,0.08)', border: '1px solid rgba(110,231,183,0.2)', animation: 'breathe 4s ease-in-out infinite' }} />
                    <div style={{ position: 'absolute', width: 70, height: 70, borderRadius: '50%', background: 'rgba(110,231,183,0.12)', border: '1px solid rgba(110,231,183,0.3)', animation: 'breathe 4s ease-in-out infinite 0.5s' }} />
                    <div style={{ fontSize: 28 }}>🌿</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 4 }}>Breathe with me</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>4 seconds in · 4 out</div>
                </div>
            </div>
        ),
    },
]



export default function LandingPage() {
    const [activeScreen, setActiveScreen] = useState(0)
    const { setDemoMode } = useDemoMode()
    const navigate = useNavigate()

    const handleTryDemo = () => {
        setDemoMode(true)
        const dummyData = {
            departure: 'Dubai (DXB)',
            destination: 'London (LHR)',
            children: [{ name: 'Leo', age: '5', likes: 'Puzzles, Planes' }],
            flightNumber: 'EK 501',
            boardingTime: '16:00',
            arrivalAtAirport: '13:30',
            priorities: ['Keep kids busy', 'Stay calm'],
        }
        localStorage.setItem('familyTripData', JSON.stringify(dummyData))
        setTimeout(() => navigate('/dashboard'), 100)
    }


    useEffect(() => {
        const interval = setInterval(() => {
            setActiveScreen(s => (s + 1) % phoneScreens.length)
        }, 3500)
        return () => clearInterval(interval)
    }, [])

    return (
        <PageWrapper>
            {/* ── Parallax Hero ────────────────────────────────────── */}
            <ParallaxHero />

            {/* Interactive Journey Timeline */}
            <section className={styles.journeySection}>
                <div className="container">
                    <div className={styles.journeyLayout}>
                        <div className={styles.journeyText}>
                            <div className="section-label">A Parent's Peace of Mind</div>
                            <h2 className="hero-title-cinematic">From home to gate, sorted in seconds.</h2>
                            <p style={{ marginTop: '24px', opacity: 0.7, maxWidth: '400px' }}>
                                We've mapped every friction point of family travel. WanderFam doesn't just show a map; it shows you the path of least resistance.
                            </p>
                        </div>

                        <div className={styles.journeyVisual}>
                            <div className={styles.journeyTrack}>
                                <motion.div
                                    className={styles.journeyProgress}
                                    initial={{ height: 0 }}
                                    whileInView={{ height: '100%' }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                />
                            </div>

                            {[
                                { label: 'T-Minus 2 Hours', title: 'Smart Packing', desc: 'Auto-sync luggage lists with your partner so nothing gets left behind.', color: 'var(--blue-soft)' },
                                { label: 'Arrival', title: 'Fast-Track Security', desc: 'Live Wait times and child-friendly lane guidance at 50+ airports.', color: 'var(--iris)' },
                                { label: 'Wait Time', title: 'Sky-Lounge Guide', desc: 'Find the nearest play area or quiet zone with one tap.', color: 'var(--mint)' },
                                { label: 'Boarding', title: 'Perfect Timing', desc: 'Smart alerts when your specific zone is called, not just the flight.', color: 'var(--peach)' }
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    className={styles.journeyStep + ' ' + styles.stepActive}
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-50px' }}
                                    transition={{ delay: i * 0.2, duration: 0.6 }}
                                >
                                    <div className={styles.stepIndicator} />
                                    <div className={styles.stepCard}>
                                        <div className={styles.stepLabel}>{step.label}</div>
                                        <div className={styles.stepTitle}>{step.title}</div>
                                        <div className={styles.stepDesc}>{step.desc}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className={`section ${styles.ctaSection}`}>
                <div className="container">
                    <motion.div
                        className={`glass-elevated ${styles.ctaCard}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className={styles.ctaGlow} />
                        <h2 style={{ position: 'relative' }}>Ready for your next<br />family adventure?</h2>
                        <p style={{ position: 'relative', marginTop: 12, color: 'var(--text-body)' }}>Set up your trip in under 2 minutes. Start instantly, no sign-up.</p>
                        <div style={{ position: 'relative', display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link to="/plan-trip" className="btn btn-primary btn-lg">Plan a Trip <ArrowRight size={18} /></Link>
                            <button onClick={handleTryDemo} className="btn btn-ghost btn-lg">Try Demo</button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </PageWrapper>
    )
}
