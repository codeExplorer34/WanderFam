import { useRef, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Navigation, Heart, Layout, Wind, Plane } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import styles from './CinematicJourney.module.css'

gsap.registerPlugin(ScrollTrigger)

const steps = [
    {
        id: "01",
        label: "The Briefing",
        title: "Ditch the spreadsheets.",
        desc: "Tell us where you're going and who's coming. We sync your family’s details across devices instantly. No accounts, just adventure.",
        color: "var(--sky)",
        image: "/journey_briefing_family_sync_1772623700784.png"
    },
    {
        id: "02",
        label: "The Co-Pilot",
        title: "Navigate with ease.",
        desc: "As you enter the terminal, the dashboard wakes up. We find the shortest lines and nearest play zones with stroller-friendly precision.",
        color: "var(--iris)",
        image: "/journey_copilot_airport_map_1772623721646.png"
    },
    {
        id: "03",
        label: "The Sanctuary",
        title: "Peace at 30,000 feet.",
        desc: "In the air, WanderFam shifts into Calm Mode. Curated activities keep the kids inspired, while you get the peace you deserve.",
        color: "var(--mint)",
        image: "/journey_sanctuary_plane_view_1772623740041.png"
    }
]

export default function CinematicJourney() {
    const containerRef = useRef(null)
    const trackRef = useRef(null)

    useGSAP(() => {
        const sections = gsap.utils.toArray(`.${styles.stepScene}`)

        const mainAnim = gsap.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                pin: true,
                scrub: 1,
                snap: 1 / (sections.length - 1),
                end: () => "+=" + trackRef.current.offsetWidth
            },
            id: "main-journey"
        })

        // Ghost numbers animation - using containerAnimation for horizontal sync
        sections.forEach((section, i) => {
            const ghost = section.querySelector(`.${styles.ghostNum}`)
            const visual = section.querySelector(`.${styles.visualImage}`)

            if (ghost) {
                gsap.fromTo(ghost,
                    { opacity: 0, x: 100 },
                    {
                        opacity: 0.03,
                        x: 0,
                        scrollTrigger: {
                            trigger: section,
                            containerAnimation: mainAnim,
                            start: "left center",
                            toggleActions: "play none none reverse",
                            scrub: true
                        }
                    }
                )
            }

            if (visual) {
                gsap.fromTo(visual,
                    { scale: 1.2, x: 50 },
                    {
                        scale: 1,
                        x: 0,
                        scrollTrigger: {
                            trigger: section,
                            containerAnimation: mainAnim,
                            start: "left right",
                            end: "right left",
                            scrub: true
                        }
                    }
                )
            }
        })
    }, { scope: containerRef })

    return (
        <section ref={containerRef} className={styles.section}>
            {/* Ambient Background */}
            <div className={styles.ambientBg}>
                <div className={styles.noiseOverlay} />
                <div className={styles.auroraGlow} />
            </div>

            <div ref={trackRef} className={styles.track}>
                {steps.map((step, i) => (
                    <div key={i} className={styles.stepScene}>
                        {/* Giant Ghost Number */}
                        <div className={styles.ghostNum}>{step.id}</div>

                        <div className={styles.sceneContent}>
                            <div className={styles.textContent}>
                                <motion.span
                                    className={styles.stepLabel}
                                    style={{ color: step.color }}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false }}
                                    transition={{ duration: 0.8 }}
                                >
                                    {step.id} — {step.label}
                                </motion.span>
                                <motion.h2
                                    className={styles.stepTitle}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false }}
                                    transition={{ duration: 0.8, delay: 0.1 }}
                                >
                                    {step.title}
                                </motion.h2>
                                <motion.p
                                    className={styles.stepDesc}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    {step.desc}
                                </motion.p>
                            </div>

                            <div className={styles.visualContainer}>
                                <div className={styles.visualBox}>
                                    <div className={styles.imageWrap}>
                                        <img
                                            src={step.image}
                                            alt={step.label}
                                            className={styles.visualImage}
                                        />
                                        <div className={styles.imageOverlay} style={{ background: `linear-gradient(45deg, ${step.color}22, transparent)` }} />
                                    </div>
                                    <div className={styles.visualIconOverlay}>
                                        {i === 0 && <Sparkles size={40} color={step.color} />}
                                        {i === 1 && <Navigation size={40} color={step.color} />}
                                        {i === 2 && <Heart size={40} color={step.color} />}
                                    </div>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className={styles.stepConnector}>
                                        <svg viewBox="0 0 100 20">
                                            <motion.path
                                                d="M 0 10 Q 50 15 100 10"
                                                stroke="rgba(255,255,255,0.1)"
                                                fill="transparent"
                                                strokeWidth="0.5"
                                            />
                                            <motion.path
                                                d="M 0 10 Q 50 15 100 10"
                                                stroke={step.color}
                                                fill="transparent"
                                                strokeWidth="1"
                                                initial={{ pathLength: 0 }}
                                                whileInView={{ pathLength: 1 }}
                                                transition={{ duration: 1.5, delay: 0.5 }}
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
