import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ArrowRight } from 'lucide-react'
import { useDemoMode } from '../App'
import styles from './ParallaxHero.module.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * ParallaxHero – Osmo-style multi-layer scroll parallax
 * Adapted to WanderFam's dark cinematic theme.
 *
 * Layer structure (back → front):
 *  Layer 1 – Sky / atmosphere (slowest)
 *  Layer 2 – Airport terminal mid-ground
 *  Layer 3 – Brand title text  ← comes through the layers
 *  Layer 4 – Close-up family silhouette (fastest)
 */
export default function ParallaxHero() {
    const { setDemoMode } = useDemoMode()
    const layersRef = useRef(null)
    const lenisRef = useRef(null)

    const navigate = useNavigate()

    const handleTryDemo = () => {
        setDemoMode(true)
        // Set some dummy data in localStorage to make the demo feel 'live'
        const dummyData = {
            departure: 'Dubai (DXB)',
            destination: 'London (LHR)',
            children: [{ name: 'Leo', age: '5', likes: 'Puzzles, Planes' }],
            flightNumber: 'EK 501',
            boardingTime: '16:00',
            arrivalAtAirport: '13:30',
            priorities: ['Keep kids busy', 'Stay calm'],
        }
        localStorage.setItem('familyTripData', JSON.stringify(dummyData))

        // Brief delay for the 'clicking' feel, then navigate
        setTimeout(() => {
            navigate('/dashboard')
        }, 100)
    }

    useEffect(() => {
        // ── Lenis smooth scroll (scoped – doesn't conflict with any global Lenis) ──
        const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
        lenisRef.current = lenis
        lenis.on('scroll', ScrollTrigger.update)

        const ticker = (time) => lenis.raf(time * 1000)
        gsap.ticker.add(ticker)
        gsap.ticker.lagSmoothing(0)

        // ── Layer parallax timeline ──
        const trigger = layersRef.current
        if (!trigger) return

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger,
                start: '0% 0%',
                end: '100% 0%',
                scrub: 0,
            },
        })

        const layers = [
            { layer: '1', yPercent: 70 },
            { layer: '2', yPercent: 55 },
            { layer: '3', yPercent: 40 },
            { layer: '4', yPercent: 10 },
        ]

        layers.forEach((l, idx) => {
            tl.to(
                trigger.querySelectorAll(`[data-parallax-layer="${l.layer}"]`),
                { yPercent: l.yPercent, ease: 'none' },
                idx === 0 ? undefined : '<'
            )
        })

        return () => {
            lenis.destroy()
            gsap.ticker.remove(ticker)
            tl.scrollTrigger?.kill()
            tl.kill()
        }
    }, [])

    return (
        <div className={styles.parallax}>
            {/* ── Hero viewport ─────────────────────────────────────── */}
            <section className={styles.parallaxHeader}>
                <div className={styles.parallaxVisuals}>
                    {/* hard edge so background below can't bleed up */}
                    <div className={styles.blackLineOverflow} />

                    {/* ── Layered images ───────────────────────────────── */}
                    <div ref={layersRef} data-parallax-layers className={styles.parallaxLayers}>
                        {/* Layer 1 – Mountain View background (slowest) */}
                        <img
                            src="/landing-hero.jpg"
                            loading="eager"
                            alt=""
                            data-parallax-layer="1"
                            className={styles.layerImg}
                        />
                        {/* Layer 3 – Brand title (sits between the layers) */}
                        <div data-parallax-layer="3" className={styles.layerTitle}>
                            <div className={styles.titleBlock}>
                                <p className={styles.eyebrow}>The Intelligent Family Travel Companion</p>
                                <h1 className={styles.displayTitle}>
                                    Family travel,<br />
                                    <span className={styles.metallicWord}>simplified.</span>
                                </h1>
                                <p className={styles.subline}>
                                    The first airport co-pilot that keeps you organized<br />
                                    and your children engaged.
                                </p>

                                {/* CTA Buttons */}
                                <div className={styles.ctaRow}>
                                    <div className={styles.ctaGroup}>
                                        <Link to="/plan-trip" className={styles.btnPillPrimary}>
                                            Start Your Journey
                                        </Link>
                                        <p className={styles.microCopy}>
                                            You'll begin by setting up your family profile and flight details.
                                        </p>
                                    </div>
                                    <button
                                        className={styles.btnPillSecondary}
                                        onClick={handleTryDemo}
                                    >
                                        Try Demo
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Stats Section (Reference based) */}
                        <div className={styles.statsRow}>
                            <div className={styles.statItem}>
                                <div className={styles.statValue}>150+</div>
                                <div className={styles.statLabel}>Direct Airports</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statValue}>24/7</div>
                                <div className={styles.statLabel}>Active Support</div>
                            </div>
                        </div>
                    </div>

                    {/* Gradient fade at the bottom so it bleeds into the next section */}
                    <div className={styles.parallaxFade} />
                </div>
            </section>

        </div>
    )
}
