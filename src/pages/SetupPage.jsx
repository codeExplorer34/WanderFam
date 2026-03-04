import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Users, Calendar, Clock, Check, ArrowRight, ArrowLeft, ChevronDown, Gamepad2, Navigation, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import PageWrapper from '../components/PageWrapper'
import styles from './SetupPage.module.css'

const steps = [
    { id: 1, label: 'Family', icon: Users },
    { id: 2, label: 'Flight', icon: Plane },
    { id: 3, label: 'Trip Prep', icon: Clock },
]

const INTEREST_OPTIONS = [
    { label: 'Planes', emoji: '✈️' },
    { label: 'Dinos', emoji: '🦕' },
    { label: 'Puzzles', emoji: '🧩' },
    { label: 'Art', emoji: '🎨' },
    { label: 'Music', emoji: '🎵' },
    { label: 'Games', emoji: '🎮' },
]

const defaultData = {
    departure: 'Dubai (DXB)',
    destination: 'London (LHR)',
    children: [
        { name: 'Leo', age: '5', likes: 'Puzzles, Planes' },
        { name: 'Mia', age: '3', likes: 'Art, Music' }
    ],
    flightNumber: 'EK 501',
    boardingTime: '16:00',
    arrivalAtAirport: '13:30',
    priorities: ['Keep kids busy', 'Stay calm'],
}

function calcTimeDiff(from, to) {
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

export default function SetupPage() {
    const [step, setStep] = useState(1)
    const [data, setData] = useState(defaultData)
    const [done, setDone] = useState(false)
    const [isMagic, setIsMagic] = useState(false)
    const [nameErrors, setNameErrors] = useState([])
    const navigate = useNavigate()

    const update = (k, v) => setData(prev => ({ ...prev, [k]: v }))

    const handleNext = () => {
        if (step === 1) {
            const errors = data.children.map(c => !c.name.trim() || c.name === 'New Explorer')
            if (errors.some(Boolean)) {
                setNameErrors(errors)
                toast.error('Please name all explorers before continuing!', {
                    icon: '✏️',
                    style: { background: 'var(--base-1)', color: '#fff', border: '1px solid rgba(244,63,94,0.4)' }
                })
                return
            }
            setNameErrors([])
        }
        if (step < 3) setStep(s => s + 1)
        else {
            localStorage.setItem('familyTripData', JSON.stringify(data))
            setDone(true)
        }
    }

    const handleBack = () => { if (step > 1) setStep(s => s - 1) }

    const childNames = data.children.map(c => c.name).join(' & ')
    const timeDiff = calcTimeDiff(data.arrivalAtAirport, data.boardingTime)

    return (
        <PageWrapper>
            <div className={`container ${styles.wrapper}`}>
                <div className={styles.header}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="section-label">Step {step} of 3</div>
                            <h2 style={{ fontSize: '2.8rem' }}>
                                {step === 1 ? "Who's traveling with you?" : step === 2 ? 'Your Flight Details' : 'Set Your Priorities'}
                            </h2>
                            <p style={{ marginTop: 8, color: 'var(--text-body)' }}>
                                {step === 1 ? "We'll personalise every feature to your family's specific needs."
                                    : step === 2 ? "We'll build a smart timeline around your exact schedule."
                                        : "Choose what matters most — we'll optimise your experience accordingly."}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Wizard Cards */}
                <div className={styles.wizardContainer}>
                    <div className={styles.progressBar}>
                        {steps.map((s, i) => (
                            <div key={s.id} className={styles.progressSegment}>
                                <motion.div
                                    className={styles.progressFill}
                                    animate={{ width: step >= s.id ? '100%' : '0%' }}
                                />
                                <span className={styles.segmentLabel} style={{ opacity: step >= s.id ? 1 : 0.4 }}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                    <AnimatePresence mode="wait">
                        {!done ? (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className={styles.stepContent}
                            >
                                {step === 1 && (
                                    <div className={styles.childCards}>
                                        <AnimatePresence>
                                            {data.children.map((child, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className={`glass ${styles.childCard}`}
                                                    style={nameErrors[idx] ? { borderColor: 'rgba(244,63,94,0.5)' } : {}}
                                                >
                                                    <div className={styles.childAvatar}>{child.name[0]}</div>
                                                    <div className={styles.childInfo}>
                                                        <div style={{ position: 'relative' }}>
                                                            <input
                                                                className={styles.childNameInput}
                                                                placeholder="Child's Name *"
                                                                value={child.name}
                                                                style={nameErrors[idx] ? { borderColor: 'rgba(244,63,94,0.6)' } : {}}
                                                                onChange={e => {
                                                                    const newChildren = [...data.children]
                                                                    newChildren[idx].name = e.target.value
                                                                    update('children', newChildren)
                                                                    if (nameErrors[idx]) {
                                                                        const errs = [...nameErrors]
                                                                        errs[idx] = false
                                                                        setNameErrors(errs)
                                                                    }
                                                                }}
                                                            />
                                                            {nameErrors[idx] && (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 12, color: 'var(--urgent)' }}>
                                                                    <AlertCircle size={12} /> Name required
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className={styles.childFields}>
                                                            <div className={styles.miniField}>
                                                                <label>Age</label>
                                                                <div className={styles.stepper}>
                                                                    <button className={styles.stepBtn} onClick={() => {
                                                                        const newChildren = [...data.children]
                                                                        newChildren[idx].age = Math.max(1, parseInt(child.age) - 1).toString()
                                                                        update('children', newChildren)
                                                                    }}>−</button>
                                                                    <div className={styles.stepValue}>{child.age}</div>
                                                                    <button className={styles.stepBtn} onClick={() => {
                                                                        const newChildren = [...data.children]
                                                                        newChildren[idx].age = Math.min(18, parseInt(child.age) + 1).toString()
                                                                        update('children', newChildren)
                                                                    }}>+</button>
                                                                </div>
                                                            </div>
                                                            <div className={styles.miniField} style={{ flex: 2 }}>
                                                                <label>Interests</label>
                                                                <div className={styles.interestGrid}>
                                                                    {INTEREST_OPTIONS.map(opt => (
                                                                        <button
                                                                            key={opt.label}
                                                                            className={`${styles.interestChip} ${child.likes.includes(opt.label) ? styles.interestChipActive : ''}`}
                                                                            onClick={() => {
                                                                                const newChildren = [...data.children]
                                                                                const likes = child.likes.split(', ').filter(x => x)
                                                                                const newLikes = likes.includes(opt.label)
                                                                                    ? likes.filter(x => x !== opt.label)
                                                                                    : [...likes, opt.label]
                                                                                newChildren[idx].likes = newLikes.join(', ')
                                                                                update('children', newChildren)
                                                                            }}
                                                                        >
                                                                            {opt.emoji} {opt.label}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        <button
                                            className={styles.addChildBtn}
                                            onClick={() => update('children', [...data.children, { name: '', age: '5', likes: '' }])}
                                        >
                                            + Add another explorer
                                        </button>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className={`glass ${styles.flightCard}`}>
                                        <div className={styles.fieldRow}>
                                            <div className={styles.field}>
                                                <label><Navigation size={12} /> From</label>
                                                <input className={styles.input} value={data.departure} onChange={e => update('departure', e.target.value)} />
                                            </div>
                                            <div className={styles.field}>
                                                <label><Plane size={12} /> To</label>
                                                <input className={styles.input} value={data.destination} onChange={e => update('destination', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className={styles.field}>
                                            <label>Flight Number</label>
                                            <input className={styles.input} value={data.flightNumber} onChange={e => update('flightNumber', e.target.value)} />
                                        </div>
                                        <div className={styles.fieldRow}>
                                            <div className={styles.field}>
                                                <label><Clock size={12} /> Reach Airport</label>
                                                <input type="time" className={styles.input} value={data.arrivalAtAirport} onChange={e => update('arrivalAtAirport', e.target.value)} />
                                            </div>
                                            <div className={styles.field}>
                                                <label><Clock size={12} /> Boarding at</label>
                                                <input type="time" className={styles.input} value={data.boardingTime} onChange={e => update('boardingTime', e.target.value)} />
                                            </div>
                                        </div>
                                        {timeDiff && (
                                            <div className={styles.timingSummary}>
                                                <div className={styles.timeIcon}><Clock size={16} /></div>
                                                <span>You have <strong>{timeDiff}</strong> between arrival and boarding. {
                                                    parseInt(timeDiff) >= 2 || timeDiff.includes('h') ? 'Perfect window for a calm family journey.' : 'Tight! We\'ll prioritise the fastest routes.'
                                                }</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className={styles.priorityGrid}>
                                        {[
                                            { id: 'calm', label: 'Stay calm', desc: 'More quiet zones & alerts', emoji: '🧘' },
                                            { id: 'busy', label: 'Keep kids busy', desc: 'Frequent activity prompts', emoji: '🎮' },
                                            { id: 'walk', label: 'Walk less', desc: 'Stroller-friendly, short paths', emoji: '🚼' },
                                            { id: 'queue', label: 'Queue less', desc: 'Fastest security routes', emoji: '⚡' }
                                        ].map(p => (
                                            <button
                                                key={p.id}
                                                className={`glass ${styles.priorityCard} ${data.priorities.includes(p.label) ? styles.priorityActive : ''}`}
                                                onClick={() => {
                                                    const cur = data.priorities
                                                    update('priorities', cur.includes(p.label) ? cur.filter(x => x !== p.label) : [...cur, p.label])
                                                }}
                                            >
                                                <div className={styles.priorityEmoji}>{p.emoji}</div>
                                                <div className={styles.priorityCheck}>
                                                    {data.priorities.includes(p.label) ? <Check size={14} /> : null}
                                                </div>
                                                <div className={styles.priorityLabel}>{p.label}</div>
                                                <div className={styles.priorityDesc}>{p.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="done"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={styles.overviewContainer}
                            >
                                <div className={`glass-elevated ${styles.overviewCard}`}>
                                    <div className={styles.overviewHeader}>
                                        <div className={styles.overviewBadge}>Trip Prepared ✅</div>
                                        <h3>Your Personalised Timeline</h3>
                                        <p style={{ color: 'var(--text-body)', fontSize: 14, marginTop: 8 }}>
                                            Built around {childNames}'s journey today.
                                        </p>
                                    </div>
                                    <div className={styles.overviewTimeline}>
                                        {[
                                            { time: data.arrivalAtAirport, label: 'Check-in & Security', tag: 'Fast Route' },
                                            { time: '14:30', label: 'Play Zone Activity', tag: 'Kid Mode' },
                                            { time: data.boardingTime, label: `Gate Boarding — ${data.flightNumber}`, tag: 'Alert Set' },
                                        ].map((t, i) => (
                                            <div key={i} className={styles.timelineItem}>
                                                <div className={styles.timeLabel}>{t.time}</div>
                                                <div className={styles.timelinePoint} />
                                                <div className={styles.timelineText}>
                                                    <strong>{t.label}</strong>
                                                    <span>{t.tag}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={() => {
                                            setIsMagic(true)
                                            setTimeout(() => navigate('/dashboard'), 2200)
                                        }}
                                        style={{ marginTop: 32, width: '100%' }}
                                    >
                                        Launch Family Hub <ArrowRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isMagic && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={styles.magicOverlay}
                            >
                                <div className={styles.magicLoader} />
                                <h2 className="hero-title-cinematic">Building your family hub…</h2>
                                <p style={{ marginTop: 16 }}>Personalising your timeline for {childNames} ✈️</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!done && (
                        <div className={styles.wizardActions}>
                            <button
                                className="btn btn-ghost"
                                onClick={handleBack}
                                style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
                            >
                                <ArrowLeft size={16} /> Back
                            </button>
                            <button className="btn btn-primary" onClick={handleNext}>
                                {step === 3 ? 'Complete Setup' : 'Continue'} <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    )
}
