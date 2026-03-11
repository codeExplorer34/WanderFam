import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plane,
    Navigation,
    ShieldCheck,
    Utensils,
    Gamepad2,
    ChevronRight,
    Clock,
    AlertCircle,
    Wind
} from 'lucide-react'
import { usePhase, PHASES } from '../context/PhaseContext'
import PageWrapper from '../components/PageWrapper'
import styles from './DashboardPage.module.css'

const allTimelineData = {
    [PHASES.PRE_FLIGHT]: [
        { id: 1, time: '09:00', label: 'Smart Packing', icon: Plane, status: 'done', desc: 'Luggage synchronized with partner', remaining: 'Done' },
        { id: 2, time: '11:00', label: 'Airport Transit', icon: Navigation, status: 'now', desc: 'Estimated 45 min to airport', remaining: 'Current' },
        { id: 3, time: '13:30', label: 'Check-in Open', icon: ShieldCheck, status: 'upcoming', desc: 'Door-to-gate guidance ready', remaining: 'In 2h' },
    ],
    [PHASES.TERMINAL]: [
        { id: 1, time: '13:30', label: 'Terminal Arrived', icon: Plane, status: 'done', desc: 'Family checked in — Bag drop complete', remaining: 'Done' },
        { id: 2, time: '14:30', label: 'Family Lounge', icon: Utensils, status: 'now', desc: 'Relaxing before the final stretch', remaining: 'Active' },
        { id: 3, time: '15:15', label: 'Gate Walk', icon: Navigation, status: 'upcoming', desc: 'Stroller-friendly, quiet route', remaining: 'In 45m' },
    ],
    [PHASES.IN_FLIGHT]: [
        { id: 1, time: '16:00', label: 'Takeoff Success', icon: Plane, status: 'done', desc: 'Smooth departure — Cruising at 35k ft', remaining: 'Done' },
        { id: 2, time: '17:00', label: 'Sky Stories', icon: Gamepad2, status: 'now', desc: 'Kids engaged in Story Mode', remaining: '20m left' },
        { id: 3, time: '20:30', label: 'Arrival Prep', icon: Navigation, status: 'upcoming', desc: 'Immigration & Bag retrieval tips', remaining: 'In 3h' },
    ]
}

const suggestions = {
    [PHASES.PRE_FLIGHT]: { title: 'Security Prep', desc: 'Review the 5-step family security guide now to save time later.', to: '/security' },
    [PHASES.TERMINAL]: { title: 'Kids Activity Pack', desc: 'Suggested now to keep kids calm during the gate wait.', to: '/activities' },
    [PHASES.IN_FLIGHT]: { title: 'Calm Mode', desc: 'Perfect time for a guided breathing session before descent.', to: '/activities' }
}

function getTripData() {
    try {
        const saved = localStorage.getItem('familyTripData')
        if (saved) return JSON.parse(saved)
    } catch (e) { }
    return null
}

function getDateString() {
    const d = new Date()
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function DashboardPage() {
    const { phase, setPhase, sentiment, setSentiment } = usePhase()
    const timeline = allTimelineData[phase] || allTimelineData[PHASES.TERMINAL]
    const sug = suggestions[phase] || suggestions[PHASES.TERMINAL]
    const tripData = getTripData()
    const travellers = tripData?.travellers || [
        { name: 'Sarah', type: 'Adult' },
        { name: 'Leo', type: 'Child' }
    ]
    const familyName = `${travellers[0].name.split(' ')[0]}'s Family Hub`
    const flightNum = tripData?.flightNumber || 'EK 501'
    const boardingTime = tripData?.boardingTime || '16:00'

    return (
        <PageWrapper>
            <div className={`container ${styles.wrapper}`}>
                {/* Floating Demo Controls Pill */}
                <div className={styles.demoControlsPill}>
                    <div className={styles.demoPillLabel}>Demo Controls</div>
                    <button onClick={() => setSentiment(0.4)}>Simulate Stress</button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('familyTripData');
                            window.location.href = '/setup';
                        }}
                        style={{ color: 'var(--mint)' }}
                    >Full Reset</button>
                </div>

                {/* Phase Switcher */}
                <div className={styles.phaseSwitcher}>
                    {Object.values(PHASES).map(p => (
                        <button
                            key={p}
                            className={`${styles.phaseBtn} ${phase === p ? styles.phaseBtnActive : ''}`}
                            onClick={() => setPhase(p)}
                        >
                            {p.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className="section-label">AI Managed Journey · {getDateString()}</div>
                        <h1 className="hero-title-cinematic">{familyName}</h1>
                    </div>
                    <div className={styles.headerRight}>
                        <div className={styles.flightBadge}>
                            <Plane size={14} /> {flightNum} · Boarding {boardingTime}
                        </div>
                    </div>
                </header>

                {/* Stress Alert */}
                <AnimatePresence>
                    {sentiment < 0.5 && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={styles.sentimentAlert}
                        >
                            <AlertCircle size={18} />
                            Stress level elevated for {travellers.map(t => t.name.split(' ')[0]).join(' & ')}. Suggesting immediate Calm Mode or the nearest Quiet Zone.
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={styles.grid}>
                    {/* Left: Timeline */}
                    <div className={styles.timelineColumn}>
                        <div className={`glass ${styles.timelineCard}`}>
                            <div className={styles.timelineHeader}>
                                <h3>Adaptive Timeline</h3>
                                <div className={styles.liveIndicator}>
                                    <div className={styles.pulseDot} /> AI Prediction Active
                                </div>
                            </div>

                            <div className={styles.timelineRows}>
                                {timeline.map((item, i) => {
                                    const Icon = item.icon
                                    const isNow = item.status === 'now'
                                    const isDone = item.status === 'done'
                                    return (
                                        <motion.div
                                            key={item.id}
                                            className={`${styles.timelineRow} ${isNow ? styles.rowNow : ''}`}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <div className={styles.rowMetadata}>
                                                <div className={styles.rowTime}>{item.time}</div>
                                                <div className={`${styles.rowStatus} ${isNow ? styles.now : isDone ? styles.done : ''}`} />
                                            </div>
                                            <div className={`${styles.rowContent} glass`}>
                                                <div className={styles.rowIcon}><Icon size={16} /></div>
                                                <div className={styles.rowText}>
                                                    <h4>{item.label}</h4>
                                                    <p>{item.desc}</p>
                                                </div>
                                                {isNow && <div className={styles.nowBadge}>Live</div>}
                                                {!isNow && <div className={styles.remainingTag} style={{ color: isDone ? 'var(--text-muted)' : 'var(--sky)' }}>{item.remaining}</div>}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className={styles.statusColumn}>
                        {/* Family Mood Widget */}
                        <div className={`glass-elevated ${styles.familyWidget}`}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <h3>Family Sentiment</h3>
                                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>Click to toggle</span>
                            </div>
                            <div className={styles.memberMoods}>
                                {travellers.slice(0, 2).map((member, i) => {
                                    const moods = [
                                        { happy: 'Happy 😊', sad: 'Restless 🌪️', levelH: 90, levelS: 30, colorH: 'var(--mint)', colorS: 'var(--urgent)' },
                                        { happy: 'Calm 🌸', sad: 'Tired 😴', levelH: 75, levelS: 45, colorH: 'var(--iris)', colorS: 'var(--urgent)' }
                                    ][i] || { happy: 'Happy 😊', sad: 'Restless 🌪️', levelH: 80, levelS: 35, colorH: 'var(--mint)', colorS: 'var(--urgent)' }
                                    const isStressed = sentiment < 0.5
                                    return (
                                        <div
                                            key={i}
                                            className={styles.memberCard}
                                            style={{ cursor: 'pointer' }}
                                            title="Click to toggle stress simulation"
                                            onClick={() => setSentiment(sentiment < 0.5 ? 1.0 : 0.4)}
                                        >
                                            <div className={styles.memberMeta}>
                                                <strong>{member.name.split(' ')[0]}</strong>
                                                <span style={{ color: isStressed ? moods.colorS : moods.colorH, fontSize: 13 }}>
                                                    {isStressed ? moods.sad : moods.happy}
                                                </span>
                                            </div>
                                            <div className={styles.moodBar}>
                                                <motion.div
                                                    className={styles.moodFill}
                                                    animate={{ width: `${isStressed ? moods.levelS : moods.levelH}%`, background: isStressed ? moods.colorS : moods.colorH }}
                                                    transition={{ duration: 0.8 }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Family Badges */}
                        <div className={`glass ${styles.badgesWidget}`}>
                            <div className={styles.widgetHeader}>
                                <h3>Family Badges</h3>
                                <div className={styles.badgeCount}>
                                    <span className={styles.pulseDotSmall} /> 3 Unlocked
                                </div>
                            </div>
                            <div className={styles.badgeGrid}>
                                {[
                                    { name: 'Security Pro', icon: '🛡️', unlocked: true, color: 'var(--sky)' },
                                    { name: 'Patience Master', icon: '🧘', unlocked: true, color: 'var(--mint)' },
                                    { name: 'Explorer', icon: '🌍', unlocked: true, color: 'var(--iris)' },
                                    { name: 'Cloud Sleeper', icon: '😴', unlocked: false, color: 'var(--text-muted)' },
                                ].map((b, i) => (
                                    <div key={i} className={`${styles.badgeCard} ${!b.unlocked ? styles.badgeLocked : ''}`}>
                                        <div className={styles.badgeIcon} style={{ background: b.unlocked ? `${b.color}22` : 'rgba(255,255,255,0.03)' }}>
                                            <span style={{ filter: b.unlocked ? 'none' : 'grayscale(1) opacity(0.5)' }}>{b.icon}</span>
                                        </div>
                                        <span className={styles.badgeName}>{b.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Next Move Card */}
                        <div className={`glass ${styles.nextMoveCard}`} style={sentiment < 0.5 ? { background: 'rgba(244, 63, 94, 0.08)', borderColor: 'rgba(244, 63, 94, 0.3)' } : {}}>
                            <div className={styles.nextMoveBadge} style={sentiment < 0.5 ? { background: 'var(--urgent)', color: '#fff' } : {}}>
                                {sentiment < 0.5 ? 'Urgent Action' : 'Next Move'}
                            </div>
                            <h3>{sentiment < 0.5 ? 'Activate Calm Mode' : sug.title}</h3>
                            <p>{sentiment < 0.5 ? `Sentiment analysis indicates tension for ${travellers[0].name.split(' ')[0]}. Open Calm Mode for 2 minutes of guided breathing.` : sug.desc}</p>
                            <Link
                                to={sentiment < 0.5 ? "/activities" : sug.to}
                                className={`btn ${sentiment < 0.5 ? 'btn-urgent' : 'btn-primary'}`}
                                style={{ marginTop: 16, display: 'inline-flex', width: 'auto' }}
                            >
                                {sentiment < 0.5 ? <><Wind size={16} /> Open Calm Mode</> : <>View Action <ChevronRight size={16} /></>}
                            </Link>
                        </div>

                        {/* Quick Actions Grid */}
                        <div className={styles.quickGrid}>
                            {[
                                { label: 'Airport Map', sub: 'Adaptive Route', to: '/map', icon: Navigation, color: '#818cf8', bg: 'rgba(129,140,248,0.1)' },
                                { label: 'Security Prep', sub: 'Family Fast-Track', to: '/security', icon: ShieldCheck, color: '#38bdf8', bg: 'rgba(56,189,248,0.1)' },
                                { label: 'Packing List', sub: 'Luggage Sync', to: '/packing', icon: Clock, color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
                                { label: 'Activities', sub: 'Boredom Killers', to: '/activities', icon: Gamepad2, color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
                            ].map((q, i) => (
                                <Link key={i} to={q.to} className={`${styles.qaCard}`} style={{ '--qa-color': q.color, '--qa-bg': q.bg }}>
                                    <div className={styles.qaIcon} style={{ background: q.bg, color: q.color }}>
                                        <q.icon size={16} />
                                    </div>
                                    <div className={styles.qaText}>
                                        <span className={styles.qaLabel}>{q.label}</span>
                                        <div className={styles.qaSub}>{q.sub}</div>
                                    </div>
                                    <ChevronRight size={14} style={{ color: 'var(--text-muted)', marginLeft: 'auto', flexShrink: 0 }} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}
