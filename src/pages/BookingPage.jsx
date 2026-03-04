import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Plus, ChevronDown, Check, Lock, Shield, Plane, Luggage, Wifi } from 'lucide-react'
import { toast } from 'react-hot-toast'
import PageWrapper from '../components/PageWrapper'
import styles from './BookingPage.module.css'

/* ================================================================
   MOCK DATA
   ================================================================ */
const MOCK_FLIGHT = {
    from: { code: 'DXB', city: 'Dubai', terminal: 'T3', gate: 'B22' },
    to: { code: 'LHR', city: 'London', terminal: 'T5', gate: 'D14' },
    depart: { time: '08:45', date: 'Mon, 10 Mar 2025' },
    arrive: { time: '13:20', date: 'Mon, 10 Mar 2025' },
    duration: '7h 35m',
    airline: 'Emirates',
    flightNo: 'EK 003',
    class: 'Economy',
    returnDate: 'Fri, 17 Mar 2025',
    nights: 7,
}

const INITIAL_PASSENGERS = [
    {
        id: 1, firstName: 'Zayn', lastName: 'Ahmed', type: 'Adult',
        seat: '12A', meal: 'Vegetarian meal', isYou: true,
        dob: '15/04/1988', gender: 'Male', nationality: 'UAE',
        passport: 'P1234567', passExpiry: '01/2030',
        color: '#38bdf8', expanded: false,
    },
    {
        id: 2, firstName: 'Sara', lastName: 'Ahmed', type: 'Adult',
        seat: '12B', meal: 'Standard meal', isYou: false,
        dob: '22/09/1990', gender: 'Female', nationality: 'UAE',
        passport: 'P7654321', passExpiry: '06/2028',
        color: '#a855f7', expanded: false,
    },
    {
        id: 3, firstName: 'Rayan', lastName: 'Ahmed', type: 'Child',
        seat: '12C', meal: 'Child meal', isYou: false,
        dob: '03/06/2018', gender: 'Male', nationality: 'UAE',
        passport: 'P9876543', passExpiry: '11/2027',
        color: '#4ade80', expanded: false,
    },
]

/* ================================================================
   TRIP SNAPSHOT CARD  (persistent right column)
   ================================================================ */
function TripSnapshotCard({ flight, step }) {
    const timeline = [
        { label: 'Today', sub: 'Planning', active: step === 'passengers' },
        { label: 'Outbound', sub: `${flight.depart.date} · ${flight.depart.time}`, active: step === 'flight' },
        { label: 'In London', sub: `${flight.nights} nights`, active: false },
        { label: 'Return', sub: flight.returnDate, active: step === 'summary' },
    ]
    return (
        <aside className={styles.snapshot}>
            <div className={styles.snapshotHeader}>
                <div className={styles.snapshotRoute}>
                    <div className={styles.snapshotCodes}>
                        {flight.from.code}
                        <span className={styles.snapshotArrow}>→</span>
                        {flight.to.code}
                    </div>
                    <div className={styles.snapshotDates}>
                        {flight.depart.date} — {flight.returnDate}
                    </div>
                </div>
                <div className={styles.snapshotBadge}>
                    <div className={styles.snapshotBadgeDays}>{flight.nights}</div>
                    <div className={styles.snapshotBadgeLabel}>nights</div>
                </div>
            </div>

            <div className={styles.snapshotBody}>
                <div className={styles.snapshotRow}>
                    <div className={styles.snapshotRowIcon}>✈️</div>
                    <div className={styles.snapshotRowInfo}>
                        <div className={styles.snapshotRowLabel}>Outbound flight</div>
                        <div className={styles.snapshotRowValue}>{flight.depart.time} → {flight.arrive.time}</div>
                        <div className={styles.snapshotRowSub}>{flight.flightNo} · {flight.duration} · Non-stop</div>
                    </div>
                </div>
                <div className={styles.snapshotRow}>
                    <div className={styles.snapshotRowIcon}>🏨</div>
                    <div className={styles.snapshotRowInfo}>
                        <div className={styles.snapshotRowLabel}>Destination</div>
                        <div className={styles.snapshotRowValue}>London Heathrow</div>
                        <div className={styles.snapshotRowSub}>Terminal 5 · Gate D14</div>
                    </div>
                </div>
                <div className={styles.snapshotRow}>
                    <div className={styles.snapshotRowIcon}>🎒</div>
                    <div className={styles.snapshotRowInfo}>
                        <div className={styles.snapshotRowLabel}>Passengers</div>
                        <div className={styles.snapshotRowValue}>3 travellers</div>
                        <div className={styles.snapshotRowSub}>2 Adults · 1 Child</div>
                    </div>
                </div>
            </div>

            <div className={styles.snapshotTimeline}>
                <div className={styles.snapshotTimelineLabel}>Your journey</div>
                <div className={styles.snapshotTimelineTrack}>
                    {timeline.map((item, i) => (
                        <div key={i} className={styles.snapshotTlItem}>
                            <div className={`${styles.snapshotTlDot} ${item.active ? styles.active : ''}`}>
                                {item.active ? '●' : '○'}
                            </div>
                            <div>
                                <div className={`${styles.snapshotTlText} ${item.active ? styles.active : ''}`}>
                                    {item.label}
                                </div>
                                <div className={styles.snapshotTlSub}>{item.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    )
}

/* ================================================================
   STEP 1 — PASSENGER LIST
   ================================================================ */
function PassengersStep({ onNext }) {
    const [passengers, setPassengers] = useState(INITIAL_PASSENGERS)

    const toggle = (id) => {
        setPassengers(p => p.map(px => ({ ...px, expanded: px.id === id ? !px.expanded : false })))
    }

    const initials = (p) => `${p.firstName[0]}${p.lastName[0]}`

    return (
        <div className={styles.stepPanel}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Who's flying with you today?</h2>
                    <p className={styles.cardSub}>Add the travellers for this trip. We'll only use this for tickets and updates.</p>
                </div>

                <div className={styles.passengerList}>
                    {passengers.map(p => (
                        <div key={p.id} className={styles.passengerCard}>
                            {/* ── Summary row ── */}
                            <div className={styles.paxSummary} onClick={() => toggle(p.id)}>
                                <div className={styles.avatar} style={{ background: `${p.color}22`, border: `2px solid ${p.color}55` }}>
                                    <span style={{ color: p.color }}>{initials(p)}</span>
                                </div>
                                <div className={styles.paxInfo}>
                                    <div className={styles.paxName}>
                                        {p.firstName} {p.lastName}
                                        {p.isYou && <span className={styles.youBadge}>YOU</span>}
                                    </div>
                                    <div className={styles.paxPills}>
                                        <span className={`${styles.pill} ${styles.pillGray}`}>{p.type}</span>
                                        <span className={`${styles.pill} ${styles.pillBlue}`}>Seat {p.seat}</span>
                                        <span className={`${styles.pill} ${styles.pillGreen}`}>{p.meal}</span>
                                    </div>
                                </div>
                                <ChevronDown
                                    size={18}
                                    className={`${styles.chevron} ${p.expanded ? styles.chevronOpen : ''}`}
                                />
                            </div>

                            {/* ── Inline form (accordion) ── */}
                            <AnimatePresence>
                                {p.expanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: 'easeOut' }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div className={styles.paxForm}>
                                            <div className={styles.field}>
                                                <label className={styles.fieldLabel}>First name</label>
                                                <input className={styles.fieldInput} defaultValue={p.firstName} />
                                            </div>
                                            <div className={styles.field}>
                                                <label className={styles.fieldLabel}>Last name</label>
                                                <input className={styles.fieldInput} defaultValue={p.lastName} />
                                            </div>
                                            <div className={styles.field}>
                                                <label className={styles.fieldLabel}>Gender</label>
                                                <select className={`${styles.fieldInput} ${styles.fieldSelect}`} defaultValue={p.gender}>
                                                    <option>Male</option><option>Female</option><option>Other</option>
                                                </select>
                                            </div>
                                            <div className={`${styles.field} ${styles.fieldFull}`}>
                                                <label className={styles.fieldLabel}>Date of birth</label>
                                                <div className={styles.dobRow}>
                                                    <input className={styles.fieldInput} placeholder="DD" defaultValue={p.dob.split('/')[0]} />
                                                    <input className={styles.fieldInput} placeholder="MM" defaultValue={p.dob.split('/')[1]} />
                                                    <input className={styles.fieldInput} placeholder="YYYY" defaultValue={p.dob.split('/')[2]} />
                                                </div>
                                            </div>
                                            <div className={styles.field}>
                                                <label className={styles.fieldLabel}>Nationality</label>
                                                <input className={styles.fieldInput} defaultValue={p.nationality} />
                                            </div>
                                            <div className={`${styles.field} ${styles.fieldWide}`}>
                                                <label className={styles.fieldLabel}>Passport number</label>
                                                <input className={styles.fieldInput} defaultValue={p.passport} />
                                            </div>
                                            <div className={styles.field}>
                                                <label className={styles.fieldLabel}>Passport expiry</label>
                                                <input className={styles.fieldInput} defaultValue={p.passExpiry} placeholder="MM/YYYY" />
                                            </div>
                                            <div className={styles.field}>
                                                <label className={styles.fieldLabel}>Seat preference</label>
                                                <select className={`${styles.fieldInput} ${styles.fieldSelect}`} defaultValue={p.seat.includes('A') ? 'Window' : 'Aisle'}>
                                                    <option>Window</option><option>Aisle</option><option>Middle</option>
                                                </select>
                                            </div>
                                            <div className={styles.field}>
                                                <label className={styles.fieldLabel}>Meal preference</label>
                                                <select className={`${styles.fieldInput} ${styles.fieldSelect}`}>
                                                    <option>Standard meal</option>
                                                    <option selected={p.meal.includes('Veg')}>Vegetarian meal</option>
                                                    <option selected={p.meal.includes('Child')}>Child meal</option>
                                                    <option>Halal meal</option>
                                                    <option>Vegan meal</option>
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div className={styles.cardActions}>
                    <button className={styles.btnGhost}>
                        <Plus size={15} /> Add another traveller
                    </button>
                    <button className={styles.btnPrimary} onClick={onNext}>
                        Continue <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ================================================================
   BOARDING PASS BARCODE — decorative
   ================================================================ */
function Barcode() {
    const bars = [3, 1, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 1, 2]
    return (
        <div className={styles.bpBarcode}>
            <div className={styles.barcodeBars}>
                {bars.map((w, i) => (
                    <span key={i} style={{ '--w': `${w * 2}px`, '--h': i % 5 === 0 ? '100%' : '70%' }} />
                ))}
            </div>
            <div className={styles.barcodeNum}>EK003 · 10MAR · DXB-LHR</div>
        </div>
    )
}

/* ================================================================
   STEP 2 — FLIGHT DETAILS
   ================================================================ */
function FlightStep({ flight, onNext }) {
    const milestones = [
        { label: 'Check-in', time: '05:45', icon: '🏷', status: 'done' },
        { label: 'Boarding', time: '08:15', icon: '🚪', status: 'done' },
        { label: 'Take-off', time: '08:45', icon: '✈️', status: 'active' },
        { label: 'Landing', time: '13:20', icon: '🏁', status: '' },
    ]

    const infoCards = [
        {
            icon: '🏢', color: 'rgba(56,189,248,0.1)', title: 'Airport & Terminal',
            lines: [`Dubai Intl · Terminal 3`, `London Heathrow · Terminal 5`, `Gate B22 → D14`, `Security wait: ~12 min`],
        },
        {
            icon: '🧳', color: 'rgba(168,85,247,0.1)', title: 'Baggage',
            lines: [`Carry-on: 7 kg included`, `Check-in: 2 × 23 kg`, `Stroller: free at gate`, `Claim belt: Belt 7`],
        },
        {
            icon: '📡', color: 'rgba(74,222,128,0.1)', title: 'Onboard',
            lines: [`Wi-Fi: AED 35 / trip`, `Power: All seats`, `ICE entertainment`, `Meal: 90 min after take-off`],
        },
    ]

    return (
        <div className={styles.stepPanel}>
            {/* ── Boarding Pass ── */}
            <div className={styles.boardingPass}>
                <div className={styles.bpTop}>
                    <div className={styles.bpAirport}>
                        <div className={styles.bpCode}>{flight.from.code}</div>
                        <div className={styles.bpCity}>{flight.from.city}</div>
                    </div>
                    <div className={styles.bpMiddle}>
                        <div className={styles.bpArrow}>
                            <div className={styles.arrowLine} />
                            <Plane size={18} />
                            <div className={styles.arrowLine} />
                        </div>
                        <div className={styles.bpDuration}>{flight.duration} · Non-stop</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
                            {flight.airline} · {flight.flightNo}
                        </div>
                    </div>
                    <div className={`${styles.bpAirport} ${styles.right}`}>
                        <div className={styles.bpCode}>{flight.to.code}</div>
                        <div className={styles.bpCity}>{flight.to.city}</div>
                    </div>
                </div>

                <div className={styles.bpTimes}>
                    <div className={styles.bpTime}>
                        <div className={styles.bpTimeLabel}>Departure</div>
                        <div className={styles.bpTimeValue}>{flight.depart.time}</div>
                        <div className={styles.bpTimeDate}>{flight.depart.date}</div>
                    </div>
                    <div className={`${styles.bpTime} ${styles.right}`}>
                        <div className={styles.bpTimeLabel}>Arrival</div>
                        <div className={styles.bpTimeValue}>{flight.arrive.time}</div>
                        <div className={styles.bpTimeDate}>{flight.arrive.date}</div>
                    </div>
                </div>

                <div className={styles.bpPerforation} />

                <div className={styles.bpBottom}>
                    <div className={styles.bpMeta}>
                        <div className={styles.bpMetaRow}>
                            {[
                                { label: 'Flight', value: flight.flightNo },
                                { label: 'Class', value: flight.class },
                                { label: 'Terminal', value: `T${flight.from.terminal}` },
                                { label: 'Gate', value: flight.from.gate },
                                { label: 'Seat', value: '12A' },
                            ].map(m => (
                                <div key={m.label} className={styles.bpMetaItem}>
                                    <div className={styles.bpMetaLabel}>{m.label}</div>
                                    <div className={styles.bpMetaValue}>{m.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Barcode />
                </div>
            </div>

            {/* ── Flight Timeline ── */}
            <div className={styles.flightTimeline}>
                <div className={styles.timelineTitle}>Flight milestones</div>
                <div className={styles.timelineTrack}>
                    {milestones.map((m, i) => (
                        <div key={i} className={`${styles.timelineMilestone} ${m.status}`}>
                            <div className={styles.timelineDot}>
                                {m.status === 'done' ? <Check size={12} /> : m.icon}
                            </div>
                            <div className={styles.tlLabel}>{m.label}</div>
                            <div className={styles.tlTime}>{m.time}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Info Cards ── */}
            <div className={styles.infoGrid}>
                {infoCards.map(card => (
                    <div key={card.title} className={styles.infoCard}>
                        <div className={styles.infoCardIcon} style={{ background: card.color }}>{card.icon}</div>
                        <div className={styles.infoCardTitle}>{card.title}</div>
                        <div className={styles.infoCardLines}>
                            {card.lines.map(line => (
                                <div key={line} className={styles.infoCardLine}>{line}</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className={styles.btnPrimary} onClick={onNext}>
                    Review trip summary <ArrowRight size={16} />
                </button>
            </div>
        </div>
    )
}

/* ================================================================
   STEP 3 — TRIP SUMMARY
   ================================================================ */
function SummaryStep({ flight, onComplete }) {
    const passengers = INITIAL_PASSENGERS
    const priceRows = [
        { label: 'Flights (3 passengers)', value: 'AED 4,140' },
        { label: 'Taxes & fees', value: 'AED 620' },
        { label: 'Seat upgrades', value: 'AED 180' },
        { label: 'Meal preferences', value: 'Included' },
    ]

    return (
        <div className={styles.stepPanel}>
            {/* ── Destination Hero ── */}
            <div className={styles.tripHeroCard}>
                <div className={styles.tripHeroBg} />
                <div className={styles.tripHeroOverlay} />
                <div className={styles.tripHeroContent}>
                    <div className={styles.tripHeroRoute}>{flight.from.city} → {flight.to.city}</div>
                    <div className={styles.tripHeroMeta}>
                        <span>{flight.depart.date}</span>
                        <span>{flight.nights} nights</span>
                        <span>3 travellers</span>
                    </div>
                </div>
            </div>

            {/* ── Segments ── */}
            <div className={styles.segmentsList}>
                {[
                    { type: 'Outbound', from: flight.from.code, to: flight.to.code, dep: flight.depart.time, arr: flight.arrive.time, dur: flight.duration },
                    { type: 'Return', from: flight.to.code, to: flight.from.code, dep: '14:30', arr: '23:55', dur: '7h 25m' },
                ].map(seg => (
                    <div key={seg.type} className={styles.segmentCard}>
                        <div className={styles.segType}>{seg.type}</div>
                        <div className={styles.segRoute}>
                            <div className={styles.segCode}>{seg.from}</div>
                            <span className={styles.segArrow}>→</span>
                            <div className={styles.segCode}>{seg.to}</div>
                        </div>
                        <div className={styles.segMeta}>
                            <div className={styles.segTime}>{seg.dep} → {seg.arr}</div>
                            <div className={styles.segDur}>{seg.dur} · Non-stop</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Passengers summary ── */}
            <div className={styles.passengersSummary}>
                <div className={styles.paxSummaryHeader}>
                    <div className={styles.paxSummaryTitle}>Passengers</div>
                    <button className={styles.editLink}>Edit passengers</button>
                </div>
                {passengers.map(p => (
                    <div key={p.id} className={styles.paxSummaryRow}>
                        <div className={styles.avatar} style={{ width: 34, height: 34, fontSize: 12, background: `${p.color}22`, border: `2px solid ${p.color}55` }}>
                            <span style={{ color: p.color }}>{p.firstName[0]}{p.lastName[0]}</span>
                        </div>
                        <div>
                            <div className={styles.paxSummaryInfo}>{p.firstName} {p.lastName}</div>
                            <div className={styles.paxSummaryMeta}>{p.type} · Seat {p.seat} · {p.seat.includes('A') || p.seat.includes('C') ? 'Window' : 'Aisle'} · {p.meal}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Price breakdown ── */}
            <div className={styles.priceCard}>
                <div className={styles.priceTotal}>
                    <div className={styles.priceTotalLabel}>Total</div>
                    <div className={styles.priceTotalAmount}>AED 4,940</div>
                    <div className={styles.priceTotalSub}>Including all taxes & fees · 3 passengers</div>
                </div>
                <div className={styles.priceRows}>
                    {priceRows.map(r => (
                        <div key={r.label} className={styles.priceRow}>
                            <span className={styles.priceRowLabel}>{r.label}</span>
                            <span className={styles.priceRowValue}>{r.value}</span>
                        </div>
                    ))}
                </div>
                <div className={styles.priceActions}>
                    <button className={styles.btnPayCta} onClick={onComplete}>
                        <Lock size={16} /> Confirm &amp; Pay
                    </button>
                    <div className={styles.payReassurance}>
                        <Shield size={13} /> Secure payment · 24/7 support
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ================================================================
   STEPPER
   ================================================================ */
const STEPS = [
    { id: 'passengers', label: "Who's flying" },
    { id: 'flight', label: 'Flight details' },
    { id: 'summary', label: 'Trip summary' },
]

function Stepper({ current, onChange }) {
    const ci = STEPS.findIndex(s => s.id === current)
    return (
        <div className={styles.stepperWrap}>
            {STEPS.map((s, i) => {
                const isDone = i < ci
                const isActive = i === ci
                return (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <div className={styles.stepItem} onClick={() => isDone && onChange(s.id)}>
                            <div className={`${styles.stepBubble} ${isActive ? styles.stepBubbleActive : ''} ${isDone ? styles.stepBubbleDone : ''}`}>
                                {isDone ? <Check size={13} /> : i + 1}
                            </div>
                            <span className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ''} ${isDone ? styles.stepLabelDone : ''}`}>
                                {s.label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`${styles.stepConnector} ${isDone ? styles.stepConnectorDone : ''}`} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

/* ================================================================
   PAGE ROOT
   ================================================================ */
export default function BookingPage() {
    const [step, setStep] = useState('passengers')
    const location = useLocation()
    const navigate = useNavigate()
    const [flight, setFlight] = useState(MOCK_FLIGHT)

    useEffect(() => {
        if (location.state?.destination) {
            const dest = location.state.destination
            setFlight(prev => ({
                ...prev,
                to: { ...prev.to, city: dest.name, code: dest.name.substring(0, 3).toUpperCase() }
            }))
        }
    }, [location.state])

    const go = (s) => setStep(s)
    const nextStep = () => {
        const ci = STEPS.findIndex(s => s.id === step)
        if (ci < STEPS.length - 1) setStep(STEPS[ci + 1].id)
    }

    const [showSuccess, setShowSuccess] = useState(false)

    const handleComplete = () => {
        toast.success("Payment Successful!", {
            icon: '✅',
            style: {
                borderRadius: '12px',
                background: 'rgba(7, 10, 18, 0.9)',
                color: '#fff',
                border: '1px solid var(--mint)',
                backdropFilter: 'blur(10px)',
            },
        })
        setShowSuccess(true)
    }

    if (showSuccess) {
        return (
            <PageWrapper>
                <div className={styles.successWrapper}>
                    <motion.div
                        className={`glass-elevated ${styles.successCard}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className={styles.successIcon}>🎉</div>
                        <h1 className="hero-title-cinematic">Trip Created!</h1>
                        <p style={{ color: 'var(--text-body)', marginTop: '1rem', textAlign: 'center' }}>
                            Your family adventure to <strong>{flight.to.city}</strong> is locked in. <br />
                            Ready to setup your live journey dashboard?
                        </p>

                        <div className={styles.successActions}>
                            <button className="btn btn-primary btn-lg" onClick={() => navigate('/setup')}>
                                Start Journey Now <ArrowRight size={18} />
                            </button>
                            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/dashboard')}>
                                Start Journey Later
                            </button>
                        </div>
                    </motion.div>
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper>
            <div className={styles.bookingPage}>
                <Stepper current={step} onChange={go} />

                <div className={styles.shell}>
                    {/* ── Left: step content ── */}
                    <main>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.28, ease: 'easeOut' }}
                            >
                                {step === 'passengers' && <PassengersStep onNext={nextStep} />}
                                {step === 'flight' && <FlightStep flight={flight} onNext={nextStep} />}
                                {step === 'summary' && <SummaryStep flight={flight} onComplete={handleComplete} />}
                            </motion.div>
                        </AnimatePresence>
                    </main>

                    {/* ── Right: persistent snapshot ── */}
                    <TripSnapshotCard flight={flight} step={step} />
                </div>
            </div>
        </PageWrapper>
    )
}
