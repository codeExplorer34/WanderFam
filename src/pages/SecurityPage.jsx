import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, AlertCircle, Check, Plane, Clock, ChevronRight, Lock } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import styles from './SecurityPage.module.css'

const securitySteps = [
    {
        id: 1, label: 'Electronics', icon: Lock,
        items: ['Remove laptops from bags', 'Tablets into a separate tray', 'Power banks: keep accessible'],
        tip: 'Leo can help by placing his own tablet in the tray. It builds confidence!'
    },
    {
        id: 2, label: 'Liquids', icon: AlertCircle,
        items: ['Max 100ml per container', 'All in a 1-litre clear bag', 'Baby formula & milk are exempt'],
        tip: 'Keep baby bottles in a side pocket; security often checks these separately.'
    },
    {
        id: 3, label: 'Gear', icon: ShieldCheck,
        items: ['Adults: remove shoes & belt', 'Kids: no need to remove shoes', 'Empty all jacket pockets'],
        tip: 'Have kids stand on the "magic footprints" while you pass through the scanner.'
    },
    {
        id: 4, label: 'Stroller', icon: Plane,
        items: ['Fold stroller at scanner', 'Pass it through the X-ray belt', 'Carry baby through arch'],
        tip: 'Use the "Family Lane" here – the staff are trained to hold strollers if you are solo.'
    },
    {
        id: 5, label: 'All Clear', icon: Check,
        items: ['Collect all items from trays', 'Repack at designated area', 'Proceed to your gate'],
        tip: 'Double-check trays for small items like pacifiers or favorite toy cars!'
    },
]

function getFirstChildName() {
    try {
        const saved = localStorage.getItem('familyTripData')
        if (saved) return JSON.parse(saved).children[0].name
    } catch (e) { }
    return 'Your child'
}

export default function SecurityPage() {
    const [activeStep, setActiveStep] = useState(1)
    const [completedSteps, setCompletedSteps] = useState(new Set())
    const [timeLeft, setTimeLeft] = useState(2535) // 42:15 in seconds
    const firstChild = getFirstChildName()

    // Build personalized steps
    const personalizedSteps = [
        {
            id: 1, label: 'Electronics', icon: Lock,
            items: ['Remove laptops from bags', 'Tablets into a separate tray', 'Power banks: keep accessible'],
            tip: `${firstChild} can help by placing their own tablet in the tray — it builds confidence and keeps them engaged!`
        },
        {
            id: 2, label: 'Liquids', icon: AlertCircle,
            items: ['Max 100ml per container', 'All in a 1-litre clear bag', 'Baby formula & milk are exempt'],
            tip: 'Keep baby bottles in a side pocket — security often checks these separately and it saves time.'
        },
        {
            id: 3, label: 'Gear', icon: ShieldCheck,
            items: ['Adults: remove shoes & belt', 'Kids: no need to remove shoes', 'Empty all jacket pockets'],
            tip: `Have ${firstChild} stand on the "magic footprints" while you pass through the scanner — makes it feel like a game!`
        },
        {
            id: 4, label: 'Stroller', icon: Plane,
            items: ['Fold stroller at scanner', 'Pass it through the X-ray belt', 'Carry baby through arch'],
            tip: 'Use the "Family Lane" — staff are trained to hold strollers if you\'re managing kids solo.'
        },
        {
            id: 5, label: 'All Clear', icon: Check,
            items: ['Collect all items from trays', 'Repack at designated area', 'Proceed to your gate'],
            tip: `Double-check trays for ${firstChild}'s small items like toys, pacifiers, or favourite snacks!`
        },
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s < 10 ? '0' : ''}${s}`
    }

    const markDoneAndNext = () => {
        setCompletedSteps(prev => new Set([...prev, activeStep]))
        if (activeStep < personalizedSteps.length) {
            setActiveStep(activeStep + 1)
        }
    }

    return (
        <PageWrapper>
            <div className={`container ${styles.wrapper}`}>
                <header className={styles.header}>
                    <div>
                        <div className="section-label">Checkpoint Flow</div>
                        <h1 className="hero-title-cinematic">Security Screening</h1>
                        <p style={{ color: 'var(--text-body)' }}>Streamlined process for families with young children.</p>
                    </div>
                </header>

                <div className={styles.timelineWrapper}>
                    <div className={styles.horizontalTimeline}>
                        <div className={styles.timelineLine}>
                            <motion.div
                                className={styles.timelineProgress}
                                initial={{ width: 0 }}
                                animate={{ width: `${((activeStep - 1) / (personalizedSteps.length - 1)) * 100}%` }}
                            />
                        </div>
                        {personalizedSteps.map(step => (
                            <div
                                key={step.id}
                                className={`${styles.timelineStep} ${activeStep === step.id ? styles.stepActive : ''} ${completedSteps.has(step.id) || activeStep > step.id ? styles.stepDone : ''}`}
                                onClick={() => setActiveStep(step.id)}
                            >
                                <div className={styles.stepCircle}>
                                    {(completedSteps.has(step.id) || activeStep > step.id) ? <Check size={20} strokeWidth={3} /> : <step.icon size={20} />}
                                </div>
                                <div className={styles.stepLabel}>{step.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.familyTipsTitle}>Family Priority Tips</div>
                <div className={styles.tipsGrid}>
                    <div className={`glass-elevated ${styles.tipCard}`}>
                        <h5><ShieldCheck size={18} color="var(--blue-soft)" /> Dedicated Lanes</h5>
                        <p>Look for the family/assistance lane signage. These lanes feature wider scanners for strollers and more patient staff.</p>
                    </div>
                    <div className={`glass-elevated ${styles.tipCard}`}>
                        <h5><AlertCircle size={18} color="var(--blue-soft)" /> Exempt Liquids</h5>
                        <p>Baby formula, breast milk, and children’s medicine are exempt from the 100ml rule. Declare them to agents separately.</p>
                    </div>
                </div>

                <div className={styles.layout}>
                    <div className={`glass ${styles.screeningStatus}`}>
                        <div className={styles.statusHeader}>
                            <div className={styles.statusTitle}>Step Details</div>
                            <div className="chip chip-iris">Step {activeStep} of 5</div>
                        </div>
                        {activeStep === 5 ? (
                            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    style={{ fontSize: 64, marginBottom: 20 }}
                                >
                                    ✅
                                </motion.div>
                                <h2 style={{ color: 'var(--mint)', marginBottom: 12 }}>Security Complete!</h2>
                                <p style={{ color: 'var(--text-body)', fontSize: 16 }}>Head to your gate! Your journey continues.</p>
                                <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => setActiveStep(1)}>Restart Demo</button>
                            </div>
                        ) : (
                            <>
                                {(() => {
                                    const step = personalizedSteps.find(s => s.id === activeStep)
                                    const StepIcon = step?.icon
                                    return step ? (
                                        <motion.div
                                            key={activeStep}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}
                                        >
                                            <div className={styles.detailIconWrap}>
                                                <StepIcon size={28} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ color: '#fff', marginBottom: 16 }}>{step.label}</h3>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                    {step.items.map((item, idx) => (
                                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                            <div className={styles.itemCheck}>
                                                                <Check size={12} color="var(--blue-soft)" />
                                                            </div>
                                                            <span style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.4 }}>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className={styles.categoryTip}>
                                                    <strong>WanderFam Tip: </strong>{step.tip}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : null
                                })()}
                                <button
                                    className="btn btn-primary"
                                    style={{ marginTop: 32, width: '100%' }}
                                    onClick={markDoneAndNext}
                                >
                                    {activeStep === personalizedSteps.length ? 'Mark Complete ✓' : 'Next Step →'}
                                </button>
                            </>
                        )}
                    </div>

                    <div className={styles.rightPanel}>
                        <div className={`glass ${styles.countdownWrapper}`}>
                            <div className={styles.countdownTag}>Boarding Starts In</div>
                            <div className={styles.countdownDisplay}>{formatTime(timeLeft)}</div>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Gate B22 · Terminal B</p>
                        </div>

                        <div className={styles.boardingList}>
                            {[
                                { group: 'Group 1 — Priority', time: '16:00', active: true, yours: true },
                                { group: 'Group 2 — Early', time: '16:10', active: false, yours: false },
                                { group: 'Group 3 — Main', time: '16:20', active: false, yours: false },
                            ].map((g, i) => (
                                <div key={i} className={`${styles.boardingRow} ${g.active ? styles.boardingRowActive : ''}`}>
                                    <span className={styles.groupLabel}>
                                        {g.group}
                                        {g.yours && <span style={{ marginLeft: 8, fontSize: 11, background: 'var(--sky)', color: '#000', borderRadius: 4, padding: '1px 6px', fontWeight: 700 }}>YOU</span>}
                                    </span>
                                    <span className={styles.groupTime}>{g.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}
