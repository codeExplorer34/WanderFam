import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Share2 } from 'lucide-react'
import { useDemoMode } from '../App'
import { toast } from 'react-hot-toast'
import styles from './Navbar.module.css'

const navLinks = [
    { to: '/map', label: 'Airport Map', sub: 'Adaptive Route' },
    { to: '/security', label: 'Security Prep', sub: 'Family Fast-Track' },
    { to: '/packing', label: 'Packing List', sub: 'Luggage Sync' },
    { to: '/activities', label: 'Activities', sub: 'Boredom Killers' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const { demoMode, setDemoMode } = useDemoMode()
    const location = useLocation()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => setMobileOpen(false), [location])

    return (
        <>
            <motion.nav
                className={styles.navbar}
                style={{ background: scrolled ? 'rgba(7,10,18,0.90)' : 'transparent' }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className={`container ${styles.inner}`}>
                    <NavLink to="/" className={styles.logo}>
                        <span className={styles.logoText}>Wander<span className={styles.italic}>Fam</span></span>
                    </NavLink>

                    {/* Desktop Nav */}
                    <nav className={styles.desktopNav} aria-label="Main navigation">
                        {navLinks.map(l => (
                            <NavLink
                                key={l.to}
                                to={l.to}
                                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                            >
                                <span className={styles.navLinkLabel}>{l.label}</span>
                                {l.sub && <span className={styles.navLinkSub}>{l.sub}</span>}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className={styles.actions}>
                        {/* Demo Mode Toggle */}
                        <button
                            onClick={() => setDemoMode(d => !d)}
                            className={`${styles.demoToggle} ${demoMode ? styles.demoActive : ''}`}
                            aria-label={demoMode ? 'Live Demo is ON' : 'Try Live Demo'}
                            aria-pressed={demoMode}
                        >
                            <span className={styles.demoIndicator} aria-hidden="true" />
                            <span>Demo</span>
                        </button>

                        <NavLink to="/plan-trip" className="btn btn-primary btn-sm">
                            Start Journey
                        </NavLink>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                            <button
                                className="btn btn-secondary"
                                aria-label="Share packing list with your travel partner"
                                onClick={() => {
                                    toast.success("Synced with Partner", {
                                        icon: '🤝',
                                        style: {
                                            borderRadius: '100px',
                                            background: 'rgba(7, 10, 18, 0.9)',
                                            color: '#fff',
                                            border: '1px solid var(--sky)',
                                            backdropFilter: 'blur(10px)',
                                        },
                                    })
                                }}
                            >
                                <Share2 size={16} /> Sync with Partner
                            </button>
                        </div>
                        {/* Hamburger */}
                        <button className={styles.hamburger} onClick={() => setMobileOpen(v => !v)} aria-label="Menu">
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className={styles.mobileMenu}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {navLinks.map(l => (
                            <NavLink key={l.to} to={l.to} className={styles.mobileLink}>
                                <div className={styles.mobileLinkLabel}>{l.label}</div>
                                {l.sub && <div className={styles.mobileLinkSub}>{l.sub}</div>}
                            </NavLink>
                        ))}
                        <NavLink to="/system" className={styles.mobileLink}>Design System</NavLink>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
