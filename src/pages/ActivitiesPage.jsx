import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Puzzle, BookOpen, Play, Wind, X, ShieldCheck } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import styles from './ActivitiesPage.module.css'

const packs = [
    {
        id: 'coloring',
        icon: Palette,
        color: 'var(--sky)',
        label: 'Coloring World',
        age: '3–8 yrs',
        duration: '20 min',
        desc: 'Interactive digital canvas with magical brushes. Perfect for the waiting lounge.',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop',
        challenge: '15m Challenge',
        features: ['Digital Brushes', 'Magic Fill', 'Sticker Packs']
    },
    {
        id: 'puzzles',
        icon: Puzzle,
        color: 'var(--sky)',
        label: 'Brain Quest',
        age: '5–12 yrs',
        duration: '25 min',
        desc: 'Logic puzzles and memory games that adapt to your child\'s progress. Fully offline.',
        image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=2070&auto=format&fit=crop',
        challenge: 'New Levels',
        features: ['Pattern Match', 'Grid Logic', 'Daily Streak']
    },
    {
        id: 'stories',
        icon: BookOpen,
        color: 'var(--sky)',
        label: 'Sky Stories',
        age: '4–9 yrs',
        duration: '15 min',
        desc: 'Cinematic read-along stories explaining the airport journey. Immersive audio-visuals.',
        image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2070&auto=format&fit=crop',
        challenge: 'Read Along',
        features: ['Immersive Audio', 'Animated Pages', 'Airport Guide']
    },
    {
        id: 'security-explorer',
        icon: ShieldCheck,
        color: 'var(--iris)',
        label: 'Security Explorer',
        age: '4–10 yrs',
        duration: '10 min',
        desc: 'A playful "X-ray" mini-game that explains security procedures to kids before they arrive.',
        image: 'https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=2070&auto=format&fit=crop',
        challenge: 'Junior Agent',
        features: ['Magic X-Ray', 'Step-by-Step Guide', 'Earn a Badge']
    },
]

// Breathing phases: 4s inhale, 1s hold, 4s exhale, 1s hold
const PHASES = [
    { label: 'Breathe in…', duration: 4000, scale: 1 },
    { label: 'Hold', duration: 1000, scale: 1 },
    { label: 'Breathe out…', duration: 4000, scale: 0 },
    { label: 'Hold', duration: 1000, scale: 0 },
]

function CalmOverlay({ onClose }) {
    const [phase, setPhase] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => {
            setPhase(p => (p + 1) % PHASES.length)
        }, PHASES[phase].duration)
        return () => clearTimeout(timer)
    }, [phase])

    const current = PHASES[phase]

    return (
        <motion.div
            className={styles.calmOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Close */}
            <button className={styles.calmClose} onClick={onClose} aria-label="Exit Calm Mode">
                <X size={20} />
            </button>

            <div className={styles.calmBadge}>🌿 Calm Mode Active</div>

            {/* Breathing rings */}
            <div className={styles.breatheRings}>
                {[120, 160, 200, 240].map((size, i) => (
                    <motion.div
                        key={i}
                        className={styles.breatheRing}
                        style={{ width: size, height: size }}
                        animate={{
                            scale: current.scale === 1 ? 1 + i * 0.08 : 0.85 - i * 0.04,
                            opacity: current.scale === 1 ? 0.6 - i * 0.12 : 0.3 - i * 0.05,
                        }}
                        transition={{
                            duration: current.duration / 1000,
                            ease: 'easeInOut',
                            delay: i * 0.08,
                        }}
                    />
                ))}
                <div className={styles.breatheCenter}>
                    <span>🌿</span>
                </div>
            </div>

            {/* Phase label */}
            <AnimatePresence mode="wait">
                <motion.p
                    key={phase}
                    className={styles.breatheLabel}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                >
                    {current.label}
                </motion.p>
            </AnimatePresence>

            <p className={styles.breatheHint}>4 seconds in · 4 seconds out · repeat</p>
        </motion.div>
    )
}

function ActivityModal({ pack, onClose }) {
    const [step, setStep] = useState(0)
    const contentMap = {
        'coloring': (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                <p style={{ color: 'var(--text-body)', textAlign: 'center' }}>Tap a colour to paint the sky!</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
                    {['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#01aaa4', '#f368e0', '#ff9f43', '#10ac84', '#341f97'].map((c, i) => (
                        <button key={i} onClick={() => { }} style={{ width: 48, height: 48, borderRadius: 12, background: c, border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.target.style.transform = 'scale(1.2)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                    ))}
                </div>
                <div style={{ width: 200, height: 200, borderRadius: 24, background: 'linear-gradient(135deg, rgba(125,211,252,0.1), rgba(167,139,250,0.1))', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>🎨</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Interactive canvas coming to mobile app!</p>
            </div>
        ),
        'puzzles': (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                <p style={{ color: 'var(--text-body)' }}>Tap pairs to match them!</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                    {['✈️', '🌍', '✈️', '🎒', '🌍', '🦕', '🎒', '🦕'].map((e, i) => (
                        <button key={i} style={{ width: 64, height: 64, fontSize: 28, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 12, cursor: 'pointer' }}>{e}</button>
                    ))}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>3 pairs matched · Score: 180</p>
            </div>
        ),
        'stories': (
            <div style={{ maxWidth: 400, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{['✈️', '🛂', '🎡', '🌤️'][step]}</div>
                <p style={{ color: '#fff', fontSize: 18, lineHeight: 1.7, marginBottom: 20 }}>
                    {[
                        '"Once upon a time, a little family arrived at the magical airport…"',
                        '"They showed their passports at a friendly booth. The officer smiled and stamped: APPROVED!"',
                        '"Inside, they found a play zone with slides and climbing walls. Leo squealed with joy!"',
                        '"Finally, they boarded the plane. Clouds whooshed past the window. The adventure had begun!"'
                    ][step]}
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    {step > 0 && <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>← Back</button>}
                    {step < 3 && <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Next →</button>}
                    {step === 3 && <button className="btn btn-primary" onClick={onClose}>The End 🎉</button>}
                </div>
            </div>
        ),
        'security-explorer': (
            <div style={{ maxWidth: 400 }}>
                <p style={{ color: 'var(--text-body)', textAlign: 'center', marginBottom: 20 }}>Which items go in the TRAY at security?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[{ label: '💻 Laptop', correct: true }, { label: '👟 Kids Shoes', correct: false }, { label: '📱 Phone', correct: true }, { label: '🍎 Apple', correct: false }].map((q, i) => (
                        <button key={i} style={{ padding: '14px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: '#fff', cursor: 'pointer', textAlign: 'left', fontSize: 15 }}
                            onClick={e => { e.target.style.background = q.correct ? 'rgba(52,211,153,0.15)' : 'rgba(244,63,94,0.12)'; e.target.style.borderColor = q.correct ? 'var(--mint)' : 'var(--urgent)' }}
                        >{q.label}</button>
                    ))}
                </div>
            </div>
        )
    }
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(4,6,11,0.96)', backdropFilter: 'blur(20px)', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}
        >
            <button onClick={onClose} style={{ position: 'absolute', top: 24, right: 24, background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border)', color: '#fff', borderRadius: 10, width: 40, height: 40, cursor: 'pointer', fontSize: 20 }} aria-label="Close activity">×</button>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div className="section-label" style={{ marginBottom: 8 }}>Activity in Progress</div>
                <h2 style={{ fontSize: 28 }}>{pack.label}</h2>
            </div>
            {contentMap[pack.id] || <p style={{ color: 'var(--text-body)' }}>Loading activity…</p>}
        </motion.div>
    )
}

export default function ActivitiesPage() {
    const [selected, setSelected] = useState(null)
    const [kidsView, setKidsView] = useState(false)
    const [calmOpen, setCalmOpen] = useState(false)
    const [activeActivity, setActiveActivity] = useState(null)

    return (
        <PageWrapper>
            <div className={`${styles.wrapper} ${kidsView ? styles.kidsView : ''}`}>
                <div className="container">
                    {/* Page header with centered Kids View toggle */}
                    <header className={styles.header}>
                        <div>
                            {!kidsView && <div className="section-label">Engagement Hub</div>}
                            <h1 className="hero-title-cinematic">
                                {kidsView ? '🎮 Pick Your Activity!' : <>Keep them <span>Inspired</span></>}
                            </h1>
                            {!kidsView && <p style={{ color: 'var(--text-body)', marginTop: 8 }}>Age-matched activities to keep kids calm and engaged at any airport stage.</p>}
                        </div>

                        {/* Centered tabs-style toggle */}
                        <div className={styles.viewToggle}>
                            <button
                                className={`${styles.toggleTab} ${!kidsView ? styles.toggleActive : ''}`}
                                onClick={() => setKidsView(false)}
                            >
                                👨‍👩‍👧 Parent View
                            </button>
                            <button
                                className={`${styles.toggleTab} ${kidsView ? styles.toggleActive : ''}`}
                                onClick={() => setKidsView(true)}
                            >
                                👦 Kids View
                            </button>
                        </div>
                    </header>

                    {/* 2-column card grid */}
                    <div className={styles.cardsGrid}>
                        {/* ── Calm Mode Card ── */}
                        <motion.div
                            className={`${styles.packCard} ${styles.calmCard}`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ y: -6 }}
                        >
                            {/* Animated preview header instead of photo */}
                            <div className={styles.calmCardHeader}>
                                <div className={styles.calmBadgePill}>CALM MODE</div>
                                {/* Mini breathing rings preview */}
                                <div className={styles.calmPreviewRings}>
                                    {[56, 80, 104].map((s, i) => (
                                        <div
                                            key={i}
                                            className={styles.previewRing}
                                            style={{
                                                width: s, height: s,
                                                animationDelay: `${i * 0.4}s`
                                            }}
                                        />
                                    ))}
                                    <span className={styles.calmEmoji}>🌿</span>
                                </div>
                                <p className={styles.calmCardHeaderLabel}>
                                    {kidsView ? 'Feeling scared? Breathe!' : 'Calm Down Mode'}
                                </p>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.cardTitleRow}>
                                    <div className={`${styles.cardIconWrap} ${styles.calmIconWrap}`}>
                                        <Wind size={18} color="var(--mint)" />
                                    </div>
                                    <div>
                                        <h2 className={`${styles.cardTitle} ${styles.calmTitle}`}>
                                            {kidsView ? 'Calm Down' : 'Breathing Space'}
                                        </h2>
                                        <div className={`${styles.cardDuration} ${styles.calmDuration}`}>
                                            Guided · Any age
                                        </div>
                                    </div>
                                </div>
                                <p className={styles.cardDesc}>
                                    {kidsView
                                        ? 'Breathe with the glowing circle. In… and out… you\'ve got this! 🌿'
                                        : 'A gentle guided breathing exercise for kids who feel overwhelmed at the airport. One tap to open a quiet, calming space.'}
                                </p>

                                <div className={styles.featuresRow}>
                                    {['Guided Breathing', 'No Screens', 'Instant Calm'].map((f, j) => (
                                        <span key={j} className={`${styles.featureChip} ${styles.calmChip}`}>{f}</span>
                                    ))}
                                </div>

                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={() => setCalmOpen(true)}
                                    style={{ width: 'fit-content', background: 'var(--mint)', color: '#000', border: 'none' }}
                                >
                                    <Wind size={18} />
                                    {kidsView ? 'Breathe With Me 🌬️' : 'Start Calm Mode'}
                                </button>
                            </div>
                        </motion.div>

                        {packs.map((p, i) => {
                            const Icon = p.icon
                            return (
                                <motion.div
                                    key={p.id}
                                    className={`${styles.packCard} ${selected === p.id ? styles.packActive : ''}`}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (i + 1) * 0.1 }}
                                    whileHover={{ y: -6 }}
                                >
                                    {/* Image as card header */}
                                    <div className={styles.cardImage}>
                                        <img
                                            src={p.image.replace('auto=format', 'auto=format&fm=webp&q=75')}
                                            alt={p.label}
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <div className={styles.imageOverlay} />
                                        <div className={styles.challengeBadge}>{p.challenge}</div>
                                        <div className={styles.ageBadge}>{p.age}</div>
                                    </div>

                                    {/* Content below image */}
                                    <div className={styles.cardBody}>
                                        <div className={styles.cardTitleRow}>
                                            <div className={styles.cardIconWrap}>
                                                <Icon size={18} color="var(--sky)" />
                                            </div>
                                            <div>
                                                <h2 className={styles.cardTitle}>{p.label}</h2>
                                                <div className={styles.cardDuration}>{p.duration}</div>
                                            </div>
                                        </div>
                                        <p className={styles.cardDesc}>{p.desc}</p>

                                        <div className={styles.featuresRow}>
                                            {p.features.map((f, j) => (
                                                <span key={j} className={styles.featureChip}>{f}</span>
                                            ))}
                                        </div>

                                        <button
                                            className={`btn btn-primary ${styles.startBtn}`}
                                            onClick={() => { setSelected(p.id); setActiveActivity(p) }}
                                        >
                                            <Play size={15} />
                                            {kidsView ? 'TAP TO START! 🚀' : 'Start Activity'}
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Active activity banner */}
                    <AnimatePresence>
                        {selected && (
                            <motion.div
                                className={styles.activeBanner}
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 100, opacity: 0 }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div className={styles.pulseDot} />
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--mint)' }}>Activity in Progress</div>
                                        <div style={{ color: '#fff' }}>{packs.find(p => p.id === selected)?.label}</div>
                                    </div>
                                </div>
                                <button className="btn btn-ghost" onClick={() => setSelected(null)}>End Session</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Activity Modal */}
            <AnimatePresence>
                {activeActivity && (
                    <ActivityModal
                        pack={activeActivity}
                        onClose={() => { setActiveActivity(null); setSelected(null) }}
                    />
                )}
            </AnimatePresence>

            {/* Full-screen Calm Mode overlay */}
            <AnimatePresence>
                {calmOpen && <CalmOverlay onClose={() => setCalmOpen(false)} />}
            </AnimatePresence>
        </PageWrapper>
    )
}
