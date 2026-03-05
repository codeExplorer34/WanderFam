import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Users, Calendar, Clock, Check, ArrowRight, ArrowLeft, ChevronDown, Gamepad2, Navigation, AlertCircle, Plus, Lock } from 'lucide-react'
import { toast } from 'react-hot-toast'
import PageWrapper from '../components/PageWrapper'
import styles from './SetupPage.module.css'

const INTEREST_OPTIONS = [
    { label: 'Planes', emoji: '✈️' },
    { label: 'Dinos', emoji: '🦕' },
    { label: 'Puzzles', emoji: '🧩' },
    { label: 'Art', emoji: '🎨' },
    { label: 'Music', emoji: '🎵' },
    { label: 'Games', emoji: '🎮' },
]

function calcTimeDiff(from, to) {
    if (!from || !to) return null
    const [fh, fm] = from.split(':').map(Number)
    const [th, tm] = to.split(':').map(Number)
    const diffMin = (th * 60 + tm) - (fh * 60 + fm)
    if (diffMin <= 0) return null
    const h = Math.floor(diffMin / 60)
    const m = diffMin % 60
    if (h === 0) return `${m} min`
    if (m === 0) return `${h}h`
    return `${h}h ${m}m`
}

const defaultData = {
    departure: 'Dubai (DXB)',
    destination: 'London (LHR)',
    travellers: [
        { name: 'Sarah', age: '32', type: 'Adult', likes: 'Quiet, Coffee', needs: [] },
        { name: 'Leo', age: '5', type: 'Child', likes: 'Puzzles, Planes', needs: ['Stroller'] }
    ],
    flightNumber: 'EK 501',
    boardingTime: '16:00',
    arrivalAtAirport: '13:30',
    priorities: ['Keep kids busy', 'Stay calm'],
}

const NEEDS_OPTIONS = [
    { label: 'Stroller-friendly', icon: Gamepad2 }, // Reuse icons for simplicity
    { label: 'Quiet Zone', icon: AlertCircle },
    { label: 'Fast Route', icon: Navigation }
]

export default function SetupPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [data, setData] = useState(defaultData)
    const [isMagic, setIsMagic] = useState(false)
    const [hasSynced, setHasSynced] = useState(false)
    const [activeSection, setActiveSection] = useState('explorers')

    // Bridge data from BookingPage if available
    useEffect(() => {
        if (location.state?.passengers && location.state?.flight) {
            const { passengers, flight } = location.state
            const bookingTravellers = passengers.map(p => {
                const parts = p.dob.split('/')
                let age = (parts.length === 3) ? (new Date().getFullYear() - parseInt(parts[2])).toString() : (p.type === 'Adult' ? '30' : '5')
                return {
                    name: `${p.firstName} ${p.lastName}`,
                    age: age,
                    type: p.type,
                    likes: p.meal || '',
                    needs: []
                }
            })

            const bTime = flight.depart.time
            let [h, m] = bTime.split(':').map(Number)
            let ah = h - 2, am = m - 30
            if (am < 0) { am += 60; ah -= 1 }
            if (ah < 0) ah += 24
            const recommendedArrival = `${ah.toString().padStart(2, '0')}:${am.toString().padStart(2, '0')}`

            setData({
                departure: `${flight.from.city} (${flight.from.code})`,
                destination: `${flight.to.city} (${flight.to.code})`,
                flightNumber: flight.flightNo,
                boardingTime: bTime,
                arrivalAtAirport: recommendedArrival,
                travellers: bookingTravellers,
                priorities: ['Keep kids busy', 'Stay calm'],
            })
            setHasSynced(true)
        }
    }, [location.state])

    const update = (k, v) => setData(prev => ({ ...prev, [k]: v }))

    const handleLaunch = () => {
        const errors = data.travellers.map(t => !t.name.trim() || t.name.includes('New'))
        if (errors.some(Boolean)) {
            toast.error('Please name all travellers!')
            return
        }
        localStorage.setItem('familyTripData', JSON.stringify(data))
        setIsMagic(true)
        setTimeout(() => navigate('/dashboard'), 2200)
    }

    const timeDiff = calcTimeDiff(data.arrivalAtAirport, data.boardingTime) || '2h 30m'

    return (
        <PageWrapper>
            {/* ── Progress Navigation (Desktop Only) ── */}
            <nav className={styles.progressNav}>
                {[
                    { id: 'explorers', label: 'Explorers', icon: Users },
                    { id: 'flight', label: 'Flight', icon: Plane },
                    { id: 'priorities', label: 'Priorities', icon: AlertCircle }
                ].map(s => (
                    <div
                        key={s.id}
                        className={`${styles.progressItem} ${activeSection === s.id ? styles.progressItemActive : ''}`}
                        onClick={() => {
                            setActiveSection(s.id)
                            document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })
                        }}
                    >
                        <div className={styles.progressDot} />
                        <span>{s.label}</span>
                    </div>
                ))}
            </nav>

            <div className={`container ${styles.wrapper}`}>
                <div className={styles.header}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="section-label">Seamless Setup</div>
                        <h2 className="hero-title-cinematic" style={{ fontSize: 'clamp(2.5rem, 8vw, 3.8rem)', marginBottom: 16 }}>Personalise Your Journey</h2>
                        <p style={{ color: 'var(--text-body)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                            We've synced your family trip. Just confirm your preferences to build your custom timeline.
                        </p>
                    </motion.div>
                </div>

                <div className={styles.wizardContainer}>
                    <div className={styles.unifiedForm}>
                        <div className={styles.mainForm}>
                            {/* Section 1: Explorers */}
                            <section id="explorers" className={styles.formSection}>
                                <div className={styles.sectionHeader}>
                                    <h3><Users size={22} color="var(--sky)" /> Explorers</h3>
                                    {hasSynced && (
                                        <div className={styles.linkedBadge}>
                                            <Check size={10} /> LINKED FROM BOOKING
                                        </div>
                                    )}
                                </div>
                                <div className={styles.childCards}>
                                    {data.travellers.map((traveller, idx) => (
                                        <div key={idx} className={`glass ${styles.childCard}`}>
                                            <div className={styles.childAvatar} style={{
                                                background: traveller.type === 'Adult'
                                                    ? 'linear-gradient(135deg, var(--iris), var(--sky))'
                                                    : 'linear-gradient(135deg, var(--sky), var(--mint))',
                                                border: '2px solid rgba(255,255,255,0.1)'
                                            }}>
                                                {traveller.name ? traveller.name[0] : '?'}
                                            </div>
                                            <div className={styles.childInfo}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                                    <input
                                                        className={styles.childNameInput}
                                                        value={traveller.name}
                                                        placeholder="Traveller Name"
                                                        onChange={e => {
                                                            const newT = [...data.travellers]
                                                            newT[idx].name = e.target.value
                                                            update('travellers', newT)
                                                        }}
                                                    />
                                                    <span className="badge" style={{ fontSize: '10px', opacity: 0.8 }}>{traveller.type}</span>
                                                </div>
                                                <div className={styles.childFields}>
                                                    <div className={styles.miniField}>
                                                        <label>Age</label>
                                                        <div className={styles.stepper}>
                                                            <button className={styles.stepBtn} onClick={() => {
                                                                const newT = [...data.travellers]
                                                                newT[idx].age = Math.max(1, parseInt(traveller.age) - 1).toString()
                                                                update('travellers', newT)
                                                            }}>−</button>
                                                            <div className={styles.stepValue}>{traveller.age}</div>
                                                            <button className={styles.stepBtn} onClick={() => {
                                                                const newT = [...data.travellers]
                                                                newT[idx].age = Math.min(99, parseInt(traveller.age) + 1).toString()
                                                                update('travellers', newT)
                                                            }}>+</button>
                                                        </div>
                                                    </div>
                                                    <div className={styles.miniField} style={{ flex: 2 }}>
                                                        <label>{traveller.type === 'Adult' ? 'Focus / Needs' : 'Interests'}</label>
                                                        <div className={styles.interestGrid}>
                                                            {(traveller.type === 'Adult' ? ['Relaxing', 'Monitoring', 'Accessibility'] : INTEREST_OPTIONS.map(o => o.label)).map(opt => (
                                                                <button
                                                                    key={opt}
                                                                    className={`${styles.interestChip} ${traveller.likes.includes(opt) ? styles.interestChipActive : ''}`}
                                                                    onClick={() => {
                                                                        const likes = traveller.likes.split(', ').filter(x => x)
                                                                        const newL = likes.includes(opt) ? likes.filter(x => x !== opt) : [...likes, opt]
                                                                        const newT = [...data.travellers]
                                                                        newT[idx].likes = newL.join(', ')
                                                                        update('travellers', newT)
                                                                    }}
                                                                >
                                                                    {opt}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button className={styles.addChildBtn} onClick={() => update('travellers', [...data.travellers, { name: 'New Traveller', age: '30', type: 'Adult', likes: '', needs: [] }])}>
                                        <Plus size={20} /> Add Family Member
                                    </button>
                                </div>
                            </section>

                            {/* Section 2: Flight */}
                            <section id="flight" className={styles.formSection}>
                                <div className={styles.sectionHeader}>
                                    <h3><Plane size={22} color="var(--sky)" /> Flight Details</h3>
                                    {hasSynced && <div className={styles.linkedBadge}><Check size={10} /> SYNCED</div>}
                                </div>
                                <div className={`glass ${styles.flightCard}`}>
                                    <div className={styles.fieldRow}>
                                        <div className={styles.lockedField}>
                                            <label><Navigation size={12} /> From</label>
                                            <input className={`${styles.input} ${styles.lockedInput}`} value={data.departure} readOnly />
                                            <div className={styles.lockedIcon}><Lock size={14} /></div>
                                        </div>
                                        <div className={styles.lockedField}>
                                            <label><Plane size={12} /> To</label>
                                            <input className={`${styles.input} ${styles.lockedInput}`} value={data.destination} readOnly />
                                            <div className={styles.lockedIcon}><Lock size={14} /></div>
                                        </div>
                                    </div>
                                    <div className={styles.fieldRow}>
                                        <div className={styles.lockedField}>
                                            <label>Flight No</label>
                                            <input className={`${styles.input} ${styles.lockedInput}`} value={data.flightNumber} readOnly />
                                            <div className={styles.lockedIcon}><Lock size={14} /></div>
                                        </div>
                                        <div className={styles.lockedField}>
                                            <label><Clock size={12} /> Boarding at</label>
                                            <input className={`${styles.input} ${styles.lockedInput}`} value={data.boardingTime} readOnly />
                                            <div className={styles.lockedIcon}><Lock size={14} /></div>
                                        </div>
                                    </div>
                                    <div className={styles.miniField}>
                                        <label><Clock size={12} /> Recommended Airport Arrival</label>
                                        <div className={styles.timePickerContainer}>
                                            <div className={styles.stepper} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px' }}>
                                                <button className={styles.stepBtn} onClick={() => {
                                                    let [h, m] = data.arrivalAtAirport.split(':').map(Number)
                                                    h = (h - 1 + 24) % 24
                                                    update('arrivalAtAirport', `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
                                                }}>−</button>
                                                <div className={styles.timeInput} style={{ background: 'none', border: 'none', width: '40px' }}>{data.arrivalAtAirport.split(':')[0]}</div>
                                                <button className={styles.stepBtn} onClick={() => {
                                                    let [h, m] = data.arrivalAtAirport.split(':').map(Number)
                                                    h = (h + 1) % 24
                                                    update('arrivalAtAirport', `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
                                                }}>+</button>
                                            </div>
                                            <span style={{ color: 'var(--text-muted)', fontWeight: 800 }}>:</span>
                                            <div className={styles.stepper} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px' }}>
                                                <button className={styles.stepBtn} onClick={() => {
                                                    let [h, m] = data.arrivalAtAirport.split(':').map(Number)
                                                    m = (m - 15 + 60) % 60
                                                    update('arrivalAtAirport', `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
                                                }}>−</button>
                                                <div className={styles.timeInput} style={{ background: 'none', border: 'none', width: '40px' }}>{data.arrivalAtAirport.split(':')[1]}</div>
                                                <button className={styles.stepBtn} onClick={() => {
                                                    let [h, m] = data.arrivalAtAirport.split(':').map(Number)
                                                    m = (m + 15) % 60
                                                    update('arrivalAtAirport', `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
                                                }}>+</button>
                                            </div>
                                            <div style={{ marginLeft: '12px', fontSize: '11px', color: 'var(--sky)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Adjust Arrival
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.timingSummary}>
                                        <div className={styles.timeIcon}><Clock size={16} /></div>
                                        <span>We've scheduled <strong>{timeDiff}</strong> at the airport. This ensures Leo and the family have a calm, stress-free transition.</span>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Priorities */}
                            <section id="priorities" className={styles.formSection}>
                                <div className={styles.sectionHeader}>
                                    <h3><AlertCircle size={22} color="var(--sky)" /> Journey Priorities</h3>
                                </div>
                                <div className={styles.priorityGrid}>
                                    {[
                                        { id: 'calm', label: 'Stay calm', desc: 'Prioritise quiet lounges', emoji: '🧘' },
                                        { id: 'busy', label: 'Keep kids busy', desc: 'Path via play zones', emoji: '🎮' },
                                        { id: 'walk', label: 'Walk less', desc: 'Shortest gate routes', emoji: '🚼' },
                                        { id: 'queue', label: 'Queue less', desc: 'Priority lane alerts', emoji: '⚡' }
                                    ].map(p => (
                                        <button
                                            key={p.id}
                                            className={`${styles.priorityCard} ${data.priorities.includes(p.label) ? styles.priorityActive : ''}`}
                                            onClick={() => {
                                                const cur = data.priorities
                                                update('priorities', cur.includes(p.label) ? cur.filter(x => x !== p.label) : [...cur, p.label])
                                            }}
                                        >
                                            <div className={styles.priorityCheck}>
                                                {data.priorities.includes(p.label) ? <Check size={14} /> : null}
                                            </div>
                                            <div style={{ fontSize: '2rem', marginBottom: 16 }}>{p.emoji}</div>
                                            <div className={styles.priorityLabel}>{p.label}</div>
                                            <div className={styles.priorityDesc}>{p.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Final CTA for Mobile/Standard Flow */}
                            <button className={`btn btn-primary ${styles.mainCTA}`} onClick={handleLaunch}>
                                Generate My Family Hub <ArrowRight size={24} />
                            </button>
                        </div>

                        {/* ── Right: Preview Sidebar ── */}
                        <aside className={styles.timelineSidebar}>
                            <div className={`glass-elevated ${styles.overviewCard}`} style={{ position: 'sticky', top: '120px', padding: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div className={styles.overviewHeader}>
                                    <div className={styles.overviewBadge}>Draft Hub</div>
                                    <h4 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 800 }}>Journey Preview</h4>
                                    <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', marginTop: '6px' }}>
                                        Customised for {data.travellers.map(t => t.name.split(' ')[0]).join(' & ')}
                                    </p>
                                </div>
                                <div className={styles.overviewTimeline} style={{ margin: '32px 0' }}>
                                    {[
                                        { time: data.arrivalAtAirport, label: 'Airport Arrival', tag: 'STRESS-FREE' },
                                        { time: '...', label: 'Security & Play', tag: 'FAST TRACK' },
                                        { time: data.boardingTime, label: 'Flight Boarding', tag: data.flightNumber },
                                    ].map((t, i) => (
                                        <div key={i} className={styles.timelineItem}>
                                            <div className={styles.timeLabel} style={{ width: '45px', fontSize: '13px' }}>{t.time}</div>
                                            <div className={styles.timelinePoint} />
                                            <div className={styles.timelineText} style={{ paddingBottom: '24px' }}>
                                                <strong style={{ fontSize: '1rem' }}>{t.label}</strong>
                                                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{t.tag}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
                                    Launching your hub will sync this timeline to all family devices instantly.
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMagic && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.magicOverlay}>
                        <div className={styles.magicLoader} />
                        <h2 className="hero-title-cinematic">Generating Family Hub…</h2>
                        <p style={{ marginTop: 16, fontSize: '1.2rem', opacity: 0.8 }}>Personalising every step for your adventure ✈️</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageWrapper>
    )
}
