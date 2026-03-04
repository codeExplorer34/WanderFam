import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Map, Users, Clock, DollarSign, ArrowRight, Check, Compass, Palmtree, Landmark, Trees } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import styles from './PlanTripPage.module.css'

const tripTypes = [
    { id: 'beach', label: 'Beach', icon: Palmtree, color: 'var(--sky)' },
    { id: 'city', label: 'City', icon: Landmark, color: 'var(--iris)' },
    { id: 'nature', label: 'Nature', icon: Trees, color: 'var(--mint)' },
    { id: 'parks', label: 'Family Parks', icon: Compass, color: 'var(--peach)' },
]

const destinations = [
    {
        id: 1,
        name: 'Tenerife, Spain',
        type: 'beach',
        why: 'Vibrant beaches, kid-friendly resorts, and Siam Park water world.',
        time: '4.5h',
        cost: 'Medium',
        img: 'https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=2070&auto=format&fit=crop',
        tags: ['Great for toddlers', 'Warm weather']
    },
    {
        id: 2,
        name: 'Vienna, Austria',
        type: 'city',
        why: 'Safe, stroller-friendly parks, and the historic Prater amusement park.',
        time: '2.5h',
        cost: 'Medium',
        img: '/images/Austria.jpg',
        tags: ['Cultural', 'Short flights']
    },
    {
        id: 3,
        name: 'Black Forest, DE',
        type: 'nature',
        why: 'Fairytale walks and massive indoor water worlds.',
        time: '1.5h',
        cost: 'Low',
        img: '/images/Forest.jpg',
        tags: ['Adventure', 'Budget friendly']
    },
    {
        id: 4,
        name: 'Orlando, Florida',
        type: 'parks',
        why: 'Endless theme park entertainment for all ages.',
        time: '9h+',
        cost: 'High',
        img: '/images/Florida-Disneyland.jpg',
        tags: ['All Ages', 'High Energy']
    },
    {
        id: 5,
        name: 'Hokkaido, Japan',
        type: 'nature',
        why: 'Snow parks, hot springs, and amazing seafood.',
        time: '11h',
        cost: 'High',
        img: '/images/Japan.jpg',
        tags: ['Foodies', 'Unique']
    },
    {
        id: 6,
        name: 'Bali, Indonesia',
        type: 'beach',
        why: 'Lush family resorts, calm beaches, and cultural temples.',
        time: '13h',
        cost: 'Medium',
        img: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?q=80&w=2048&auto=format&fit=crop',
        tags: ['Exotic', 'All ages']
    },
]

const holidayTypes = [
    { id: 'beach', label: 'Relaxing Resort', icon: Palmtree, desc: 'Sun, sand, and stress-free pools.' },
    { id: 'parks', label: 'Theme Park', icon: Compass, desc: 'High energy fun for all ages.' },
    { id: 'city', label: 'City Break', icon: Landmark, desc: 'Culture, parks, and easy walks.' },
    { id: 'nature', label: 'Nature Escape', icon: Trees, desc: 'Fresh air and fairytale forests.' }
]

export default function PlanTripPage() {
    const [tripType, setTripType] = useState('beach')
    const [kidsAges, setKidsAges] = useState([])
    const [energyLevels, setEnergyLevels] = useState([])
    const [selectedDest, setSelectedDest] = useState(null)
    const navigate = useNavigate()

    const ageGroups = [
        { label: '0-2', id: '0-2' },
        { label: '3-5', id: '3-5' },
        { label: '6-9', id: '6-9' },
        { label: '10-12', id: '10-12' }
    ]

    const energyOptions = [
        { label: 'High Energy', id: 'high' },
        { label: 'Calm/Quiet', id: 'calm' },
        { label: 'Sensitive to Noise', id: 'noise' }
    ]

    const filteredDestinations = destinations.filter(d => d.type === tripType)

    const toggleKidAge = (id) => {
        setKidsAges(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
    }

    const toggleEnergy = (id) => {
        setEnergyLevels(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id])
    }

    return (
        <PageWrapper>
            {/* Progress indicator — inline, not fixed/sticky */}
            <div className={styles.progressBanner}>
                <div className={styles.progressSteps}>
                    {['Trip Setup', 'Flight Details', 'Airport Plan'].map((step, i) => (
                        <div key={i} className={`${styles.progressStep} ${i === 0 ? styles.stepActive : ''}`}>
                            <div className={styles.stepDot}>{i < 1 ? <Check size={12} /> : i + 1}</div>
                            <span>{step}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={`container ${styles.wrapper}`}>
                <div className={styles.twoCol}>
                    {/* LEFT — Form */}
                    <div className={styles.leftCol}>
                        <header className={styles.header}>
                            <div className="section-label">Step 1 of 3</div>
                            <h1 className="hero-title-cinematic">Plan Your Airport Journey.</h1>
                            <p style={{ marginTop: 12, color: 'var(--text-body)' }}>Choose a destination and let WanderFam build your family's calm airport experience.</p>
                        </header>

                        {/* Section 1: Who's travelling? */}
                        <section className={styles.funnelSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.stepNum}>1</div>
                                <h3>Who's travelling?</h3>
                            </div>
                            <div className={styles.funnelContent}>
                                <div className={styles.selectorGroup}>
                                    <label>Kids' ages</label>
                                    <div className={styles.chipGrid}>
                                        {ageGroups.map(a => (
                                            <button
                                                key={a.id}
                                                className={`${styles.chip} ${kidsAges.includes(a.id) ? styles.active : ''}`}
                                                onClick={() => toggleKidAge(a.id)}
                                            >
                                                {a.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.selectorGroup}>
                                    <label>They are...</label>
                                    <div className={styles.chipGrid}>
                                        {energyOptions.map(e => (
                                            <button
                                                key={e.id}
                                                className={`${styles.chip} ${energyLevels.includes(e.id) ? styles.active : ''}`}
                                                onClick={() => toggleEnergy(e.id)}
                                            >
                                                {e.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Holiday Type */}
                        <section className={styles.funnelSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.stepNum}>2</div>
                                <h3>What kind of holiday?</h3>
                            </div>
                            <div className={styles.holidayGrid}>
                                {holidayTypes.map(h => (
                                    <button
                                        key={h.id}
                                        className={`${styles.holidayCard} ${tripType === h.id ? styles.holidayActive : ''}`}
                                        onClick={() => setTripType(h.id)}
                                    >
                                        <div className={styles.holidayIcon}
                                            style={{ background: tripType === h.id ? 'rgba(125,211,252,0.12)' : undefined, color: tripType === h.id ? 'var(--sky)' : undefined }}
                                        >
                                            <h.icon size={22} />
                                        </div>
                                        <div className={styles.holidayInfo}>
                                            <h4>{h.label}</h4>
                                            <p>{h.desc}</p>
                                        </div>
                                        {tripType === h.id && <div className={styles.checkMark}><Check size={14} /></div>}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT — Destination Cards */}
                    <div className={styles.rightCol}>
                        <div className={styles.sectionHeader} style={{ marginBottom: 24 }}>
                            <div className={styles.stepNum}>3</div>
                            <h3>Suggested for your family</h3>
                        </div>
                        <div className={styles.destinationGrid}>
                            <AnimatePresence mode="popLayout">
                                {filteredDestinations.map((d, i) => (
                                    <motion.div
                                        key={d.id}
                                        className={`${styles.destCard} ${selectedDest?.id === d.id ? styles.destSelected : ''}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.08 }}
                                        onClick={() => setSelectedDest(d)}
                                        whileHover={{ y: -4 }}
                                    >
                                        <div className={styles.destImgContainer}>
                                            <img src={d.img} alt={d.name} />
                                            <div className={styles.destOverlay} />
                                        </div>
                                        <div className={styles.destTags}>
                                            {d.tags.map((t, ti) => <span key={ti} className={styles.destTag}>{t}</span>)}
                                        </div>
                                        <div className={styles.destContent}>
                                            <h3>{d.name}</h3>
                                            <p className={styles.destWhy}>{d.why}</p>
                                            <div className={styles.destMeta}>
                                                <span><Clock size={12} /> {d.time}</span>
                                                <span><DollarSign size={12} /> {d.cost}</span>
                                            </div>
                                        </div>
                                        {selectedDest?.id === d.id && <div className={styles.destCheck}><Check size={20} /></div>}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Continue CTA — always visible */}
                        <div className={styles.ctaBlock}>
                            {selectedDest ? (
                                <div className={styles.selectionSummary}>
                                    <div className={styles.summaryLabel}>Selected</div>
                                    <div className={styles.summaryValue}>{selectedDest.name}</div>
                                </div>
                            ) : (
                                <p className={styles.ctaHint}>Select a destination above to continue</p>
                            )}
                            <button
                                className="btn btn-primary btn-lg"
                                disabled={!selectedDest}
                                style={{ opacity: selectedDest ? 1 : 0.4, cursor: selectedDest ? 'pointer' : 'not-allowed' }}
                                onClick={() => selectedDest && navigate('/booking', { state: { destination: selectedDest } })}
                            >
                                Confirm Selection & Book <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}
