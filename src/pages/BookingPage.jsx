import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Plus, ChevronDown, Check, Lock, Shield, Plane, Luggage, Wifi, Baby, Utensils, Calendar, User, CreditCard } from 'lucide-react'
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

const getInitials = (p) => {
    const f = (p.firstName || '').charAt(0)
    const l = (p.lastName || '').charAt(0)
    return (f + l).toUpperCase() || 'P'
}

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
function PassengersStep({ onNext, passengers, setPassengers }) {
    const toggle = (id) => {
        setPassengers(p => p.map(px => ({ ...px, expanded: px.id === id ? !px.expanded : false })))
    }

    const handleAddPassenger = () => {
        const newId = passengers.length + 1
        const colors = ['#38bdf8', '#a855f7', '#4ade80', '#fb923c', '#f43f5e']
        const newPax = {
            id: newId,
            firstName: '',
            lastName: '',
            type: 'Adult',
            seat: `${12 + newId}${String.fromCharCode(65 + (newId % 6))}`,
            meal: 'Standard meal',
            isYou: false,
            dob: '//',
            gender: 'Male',
            nationality: '',
            passport: '',
            passExpiry: '',
            color: colors[newId % colors.length],
            expanded: true
        }
        setPassengers([...passengers.map(p => ({ ...p, expanded: false })), newPax])
        toast.success("New traveller added")
    }

    const handleRemovePassenger = (id) => {
        if (passengers.length === 1) {
            toast.error("At least one traveller is required")
            return
        }
        setPassengers(passengers.filter(p => p.id !== id))
    }


    const handleUpdate = (id, field, value) => {
        setPassengers(passengers.map(p => {
            if (p.id === id) {
                const updated = { ...p, [field]: value }
                if (field === 'dob' || field.includes('dob')) {
                    const parts = updated.dob.split('/')
                    if (parts[2] && parts[2].length === 4) {
                        const birthYear = parseInt(parts[2])
                        const currentYear = new Date().getFullYear()
                        const age = currentYear - birthYear
                        updated.type = age < 14 ? 'Child' : 'Adult'
                    }
                }
                return updated
            }
            return p
        }))
    }



    return (
        <div className={styles.stepPanel}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Who's flying with you today?</h2>
                    <p className={styles.cardSub}>Add the travellers for this trip. We'll only use this for tickets and updates.</p>
                </div>

                <div className={styles.passengerList}>
                    {passengers.map((p, index) => (
                        <div key={p.id} className={styles.passengerCard}>
                            {/* ── Summary row ── */}
                            <div className={styles.paxSummary} onClick={() => toggle(p.id)}>
                                <div className={styles.avatar} style={{ background: `${p.color}22`, border: `2px solid ${p.color}55` }}>
                                    <span style={{ color: p.color }}>{getInitials(p)}</span>
                                </div>
                                <div className={styles.paxInfo}>
                                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Traveller {index + 1}
                                    </div>
                                    <div className={styles.paxName}>
                                        {p.firstName || 'New Traveller'} {p.lastName}
                                        {p.isYou && <span className={styles.youBadge}>YOU</span>}
                                    </div>
                                    <div className={styles.paxPills}>
                                        <span className={`${styles.pill} ${p.type === 'Child' ? styles.pillPurple : styles.pillGray}`}>
                                            {p.type === 'Child' ? <Baby size={12} /> : <User size={12} />} {p.type}
                                        </span>
                                        <span className={`${styles.pill} ${styles.pillBlue}`}>
                                            <CreditCard size={12} /> Seat {p.seat}
                                        </span>
                                        <span className={`${styles.pill} ${styles.pillGreen}`}>
                                            <Utensils size={12} /> {p.meal}
                                        </span>
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
                                                <label className={styles.fieldLabel}><User size={11} /> First name</label>
                                                <input
                                                    className={styles.fieldInput}
                                                    placeholder="e.g. Zayn"
                                                    value={p.firstName}
                                                    onChange={(e) => handleUpdate(p.id, 'firstName', e.target.value)}
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label className={styles.fieldLabel}><User size={11} /> Last name</label>
                                                <input
                                                    className={styles.fieldInput}
                                                    placeholder="e.g. Ahmed"
                                                    value={p.lastName}
                                                    onChange={(e) => handleUpdate(p.id, 'lastName', e.target.value)}
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label className={styles.fieldLabel}>Gender</label>
                                                <select
                                                    className={`${styles.fieldInput} ${styles.fieldSelect}`}
                                                    value={p.gender}
                                                    onChange={(e) => handleUpdate(p.id, 'gender', e.target.value)}
                                                >
                                                    <option>Male</option><option>Female</option><option>Other</option>
                                                </select>
                                            </div>
                                            <div className={`${styles.field} ${styles.fieldFull}`}>
                                                <label className={styles.fieldLabel}><Calendar size={11} /> Date of birth (Required for age check)</label>
                                                <div className={styles.dobRow}>
                                                    <input
                                                        className={styles.fieldInput}
                                                        placeholder="DD"
                                                        maxLength={2}
                                                        value={p.dob.split('/')[0] || ''}
                                                        onChange={(e) => {
                                                            const parts = p.dob.split('/')
                                                            handleUpdate(p.id, 'dob', `${e.target.value}/${parts[1] || ''}/${parts[2] || ''}`)
                                                        }}
                                                    />
                                                    <input
                                                        className={styles.fieldInput}
                                                        placeholder="MM"
                                                        maxLength={2}
                                                        value={p.dob.split('/')[1] || ''}
                                                        onChange={(e) => {
                                                            const parts = p.dob.split('/')
                                                            handleUpdate(p.id, 'dob', `${parts[0] || ''}/${e.target.value}/${parts[2] || ''}`)
                                                        }}
                                                    />
                                                    <input
                                                        className={styles.fieldInput}
                                                        placeholder="YYYY"
                                                        maxLength={4}
                                                        value={p.dob.split('/')[2] || ''}
                                                        onChange={(e) => {
                                                            const parts = p.dob.split('/')
                                                            handleUpdate(p.id, 'dob', `${parts[0] || ''}/${parts[1] || ''}/${e.target.value}`)
                                                        }}
                                                    />
                                                </div>
                                                {p.dob.split('/')[2]?.length === 4 && (
                                                    <div style={{ fontSize: '11px', color: p.type === 'Child' ? '#c084fc' : '#94a3b8', marginTop: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        {p.type === 'Child' ? <Baby size={12} /> : <User size={12} />} Categorized as: {p.type}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.field}>
                                                <label className={styles.fieldLabel}>Nationality</label>
                                                <input
                                                    className={styles.fieldInput}
                                                    value={p.nationality}
                                                    placeholder="e.g. UAE"
                                                    onChange={(e) => handleUpdate(p.id, 'nationality', e.target.value)}
                                                />
                                            </div>
                                            <div className={`${styles.field} ${styles.fieldWide}`}>
                                                <label className={styles.fieldLabel}><CreditCard size={11} /> Passport number</label>
                                                <input
                                                    className={styles.fieldInput}
                                                    value={p.passport}
                                                    placeholder="e.g. P1234567"
                                                    onChange={(e) => handleUpdate(p.id, 'passport', e.target.value)}
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label className={styles.fieldLabel}>Expiry</label>
                                                <input
                                                    className={styles.fieldInput}
                                                    value={p.passExpiry}
                                                    placeholder="MM/YYYY"
                                                    onChange={(e) => handleUpdate(p.id, 'passExpiry', e.target.value)}
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label className={styles.fieldLabel}>Seat</label>
                                                <select
                                                    className={`${styles.fieldInput} ${styles.fieldSelect}`}
                                                    value={p.seat.includes('A') ? 'Window' : 'Aisle'}
                                                    onChange={(e) => handleUpdate(p.id, 'seat', e.target.value === 'Window' ? '12A' : '12B')}
                                                >
                                                    <option>Window</option><option>Aisle</option><option>Middle</option>
                                                </select>
                                            </div>
                                            <div className={styles.field}>
                                                <label className={styles.fieldLabel}><Utensils size={11} /> Meal</label>
                                                <select
                                                    className={`${styles.fieldInput} ${styles.fieldSelect}`}
                                                    value={p.meal}
                                                    onChange={(e) => handleUpdate(p.id, 'meal', e.target.value)}
                                                >
                                                    <option>Standard meal</option>
                                                    <option>Vegetarian meal</option>
                                                    <option>Fruit platter</option>
                                                    <option>Child meal</option>
                                                </select>
                                            </div>
                                            <button className={styles.btnRemove} onClick={() => handleRemovePassenger(p.id)}>
                                                Remove Traveller
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div className={styles.cardActions}>
                    <button className={styles.btnGhost} onClick={handleAddPassenger}>
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
function FlightStep({ flight, onNext, passengers }) {
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
            <div className={styles.boardingPassRealistic}>
                <div className={styles.bpRedHeader}>
                    <div className={styles.bpHeaderAirlines}>
                        <Plane size={24} className={styles.bpPlaneIcon} />
                        <span>AIRNEST AIRLINES</span>
                    </div>
                    <div className={styles.bpHeaderTitle}>BOARDING PASS</div>
                    <div className={styles.bpHeaderStubTitle}>BOARDING PASS</div>
                </div>

                <div className={styles.bpBody}>
                    {/* Main Part */}
                    <div className={styles.bpMain}>
                        <div className={styles.bpRouteRow}>
                            <div className={styles.bpPoint}>
                                <div className={styles.bpLabel}>From</div>
                                <div className={styles.bpBigCode}>{flight.from.city.toUpperCase()}</div>
                            </div>
                            <div className={styles.bpRouteIcon}>
                                <div className={styles.bpDashedLine} />
                                <Plane size={20} className={styles.bpRoutePlane} />
                                <div className={styles.bpDashedLine} />
                            </div>
                            <div className={styles.bpPoint}>
                                <div className={styles.bpLabel}>To</div>
                                <div className={styles.bpBigCode}>{flight.to.city.toUpperCase()}</div>
                            </div>
                        </div>

                        <div className={styles.bpInfoGrid}>
                            <div className={styles.bpInfoGroup}>
                                <div className={styles.bpLabel}>Passenger</div>
                                <div className={styles.bpInfoValue}>{passengers[0].firstName} {passengers[0].lastName}</div>
                            </div>
                            <div className={styles.bpInfoGroup}>
                                <div className={styles.bpLabel}>Flight</div>
                                <div className={styles.bpInfoValue}>{flight.flightNo}</div>
                            </div>
                            <div className={styles.bpInfoGroup}>
                                <div className={styles.bpLabel}>Date</div>
                                <div className={styles.bpInfoValue}>15 JUL 30</div>
                            </div>
                            <div className={styles.bpInfoGroup}>
                                <div className={styles.bpLabel}>Time</div>
                                <div className={styles.bpInfoValue}>{flight.depart.time}</div>
                            </div>
                            <div className={styles.bpInfoGroup}>
                                <div className={styles.bpLabel}>Arrival time</div>
                                <div className={styles.bpInfoValue}>{flight.arrive.time}</div>
                            </div>
                            <div className={styles.bpInfoGroup}>
                                <div className={styles.bpLabel}>Gate</div>
                                <div className={styles.bpInfoValue}>{flight.from.gate}</div>
                            </div>
                            <div className={styles.bpInfoGroup}>
                                <div className={styles.bpLabel}>Boarding Till</div>
                                <div className={styles.bpInfoValue}>12:20</div>
                            </div>
                            <div className={styles.bpInfoGroup}>
                                <div className={styles.bpLabel}>Seat</div>
                                <div className={styles.bpInfoValue}>{passengers[0].seat}</div>
                            </div>
                            <div className={styles.bpInfoGroup}>
                                <div className={styles.bpLabel}>Terminal</div>
                                <div className={styles.bpInfoValue}>{flight.from.terminal}</div>
                            </div>
                        </div>

                        <div className={styles.bpFooterNote}>
                            BOARDING GATE CLOSE 15 MINUTES PRIOR TO DEPARTURE TIME
                        </div>

                        <div className={styles.bpSideBarcode}>
                            <span>0 1 2 3 4 5 6 7 8 9 1 0</span>
                            <div className={styles.bpVerticalBars}>
                                {[1, 2, 3, 4, 3, 2, 1, 2, 3, 4, 3, 2, 1].map((h, i) => (
                                    <div key={i} style={{ height: `${20 + h * 5}px` }} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Perforation */}
                    <div className={styles.bpPerforationVertical} />

                    {/* Stub Part */}
                    <div className={styles.bpStub}>
                        <div className={styles.bpInfoGroup}>
                            <div className={styles.bpLabel}>Passenger</div>
                            <div className={styles.bpInfoValue}>{passengers[0].firstName} {passengers[0].lastName}</div>
                        </div>
                        <div className={styles.bpInfoGroup}>
                            <div className={styles.bpLabel}>From</div>
                            <div className={styles.bpInfoValue}>{flight.from.city}</div>
                        </div>
                        <div className={styles.bpInfoGroup}>
                            <div className={styles.bpLabel}>To</div>
                            <div className={styles.bpInfoValue}>{flight.to.city}</div>
                        </div>

                        <div className={styles.bpStubGrid}>
                            <div className={styles.bpInfoGroup}>
                                <div className={styles.bpLabel}>Flight</div>
                                <div className={styles.bpInfoValue}>{flight.flightNo}</div>
                            </div>
                            <div className={styles.bpInfoGroup}>
                                <div className={styles.bpLabel}>Date</div>
                                <div className={styles.bpInfoValue}>15 JUL 30</div>
                            </div>
                            <div className={styles.bpInfoGroup}>
                                <div className={styles.bpLabel}>Time</div>
                                <div className={styles.bpInfoValue}>{flight.depart.time}</div>
                            </div>
                            <div className={styles.bpInfoGroup}>
                                <div className={styles.bpLabel}>Gate</div>
                                <div className={styles.bpInfoValue}>{flight.from.gate}</div>
                            </div>
                            <div className={styles.bpInfoGroup}>
                                <div className={styles.bpLabel}>Boarding Till</div>
                                <div className={styles.bpInfoValue}>12:20</div>
                            </div>
                            <div className={styles.bpInfoGroup}>
                                <div className={styles.bpLabel}>Seat</div>
                                <div className={styles.bpInfoValue}>{passengers[0].seat}</div>
                            </div>
                        </div>

                        <div className={styles.bpStubBarcode}>
                            <div className={styles.bpHorizontalBars}>
                                {[1, 2, 3, 4, 3, 2, 1, 2, 3, 4, 3, 2, 1, 2, 3, 4].map((h, i) => (
                                    <div key={i} style={{ height: '30px', width: '2px' }} />
                                ))}
                            </div>
                            <span>0 1 2 3 4 5  6 7 8 9 1 0</span>
                        </div>
                    </div>
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
function SummaryStep({ flight, onComplete, passengers, onEdit }) {
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
                    <button className={styles.editLink} onClick={() => onEdit('passengers')}>Edit passengers</button>
                </div>
                {passengers.map(p => (
                    <div key={p.id} className={styles.paxSummaryRow}>
                        <div className={styles.avatar} style={{ width: 34, height: 34, fontSize: 12, background: `${p.color}22`, border: `2px solid ${p.color}55` }}>
                            <span style={{ color: p.color }}>{getInitials(p)}</span>
                        </div>
                        <div className={styles.paxSummaryContent}>
                            <div className={styles.paxSummaryInfo}>
                                {p.firstName} {p.lastName} {p.isYou && <span className={styles.youBadgeMini}>YOU</span>}
                            </div>
                            <div className={styles.paxSummaryMeta}>
                                <span className={styles.metaItem}>
                                    {p.type === 'Child' ? <Baby size={11} /> : <User size={11} />} {p.type}
                                </span>
                                <span className={styles.metaItem}>
                                    <CreditCard size={11} /> Seat {p.seat}
                                </span>
                                <span className={styles.metaItem}>
                                    <Utensils size={11} /> {p.meal}
                                </span>
                            </div>
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
                        <div className={styles.stepItem} onClick={() => onChange(s.id)}>
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
    const [passengers, setPassengers] = useState(INITIAL_PASSENGERS)
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
                            <button className="btn btn-primary btn-lg" onClick={() => navigate('/setup', { state: { passengers, flight } })}>
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
                                {step === 'passengers' && <PassengersStep onNext={nextStep} passengers={passengers} setPassengers={setPassengers} />}
                                {step === 'flight' && <FlightStep flight={flight} onNext={nextStep} passengers={passengers} />}
                                {step === 'summary' && <SummaryStep flight={flight} onComplete={handleComplete} passengers={passengers} onEdit={go} />}
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
