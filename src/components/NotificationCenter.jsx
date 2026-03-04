import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, MapPin, Clock, Zap, Navigation } from 'lucide-react'
import { useDemoMode } from '../App'
import styles from './NotificationCenter.module.css'

import { usePhase } from '../context/PhaseContext'

const demoNotifications = [
    { id: 1, icon: Navigation, color: 'var(--sky)', title: 'Gate Change Alert', body: 'Gate B14 → B22 — 12 min walk. Leave now for buffer time.', delay: 4000 },
    { id: 2, icon: MapPin, color: 'var(--mint)', title: 'Restroom Nearby', body: 'Family restroom 2 min ahead on the right. Perfect stop time.', delay: 12000 },
    { id: 3, icon: Clock, color: 'var(--peach)', title: 'Activity Time', body: 'Next 10 min free — start a coloring pack for the kids!', delay: 20000 },
    { id: 4, icon: Zap, color: 'var(--iris)', title: 'Boarding in 30 min', body: 'Head to Gate B22. Security queue estimated: 8 min.', delay: 30000 },
    { id: 5, icon: Bell, color: 'var(--urgent)', title: 'Snack Reminder', body: 'Last food options before the gate — grab snacks now.', delay: 42000 },
]

export default function NotificationCenter() {
    const { demoMode } = useDemoMode()
    const { sentiment } = usePhase()
    const [toasts, setToasts] = useState([])

    // Demo Mode Timers
    useEffect(() => {
        const activeTimers = []
        if (demoMode) {
            demoNotifications.forEach(n => {
                const timer = setTimeout(() => {
                    setToasts(prev => {
                        if (prev.find(t => t.id === n.id)) return prev
                        return [...prev, { ...n }]
                    })
                    const dismissTimer = setTimeout(() => {
                        setToasts(prev => prev.filter(t => t.id !== n.id))
                    }, 6000)
                    activeTimers.push(dismissTimer)
                }, n.delay)
                activeTimers.push(timer)
            })
        }
        return () => activeTimers.forEach(clearTimeout)
    }, [demoMode])

    // Proactive Alert Logic
    useEffect(() => {
        if (sentiment < 0.5) {
            const stressID = Date.now()
            const stressAlert = {
                id: stressID,
                icon: Zap,
                color: 'var(--urgent)',
                title: 'Tantrum Risk: High',
                body: 'Stress levels rising. Suggesting "Cloud Nine" play area or guided breathing now.',
            }

            setToasts(prev => {
                if (prev.find(t => t.title.includes('Tantrum'))) return prev
                return [...prev, stressAlert]
            })

            const timer = setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== stressID))
            }, 8000)

            return () => clearTimeout(timer)
        }
    }, [sentiment])

    const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id))

    return (
        <div className={styles.container}>
            <AnimatePresence>
                {toasts.map(toast => {
                    const Icon = toast.icon
                    return (
                        <motion.div
                            key={toast.id}
                            className={styles.toast}
                            initial={{ opacity: 0, y: 20, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                        >
                            <div className={styles.iconBox} style={{ background: `${toast.color}22`, border: `1px solid ${toast.color}44` }}>
                                <Icon size={16} color={toast.color} />
                            </div>
                            <div className={styles.content}>
                                <p className={styles.title}>{toast.title}</p>
                                <p className={styles.body}>{toast.body}</p>
                            </div>
                            <button className={styles.dismiss} onClick={() => dismiss(toast.id)}>
                                <X size={14} />
                            </button>
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    )
}
