import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Map, Star, ChevronDown } from 'lucide-react'
import styles from './FrameScrollSequence.module.css'

/**
 * FrameScrollSequence
 * Implements the Antigravity Integration Spec for image-sequence scroll animation.
 */
export default function FrameScrollSequence({
    frameCount = 170,
    framePath = (i) => `/assets/frames/suitcase/suitcase_animation/ezgif-frame-${String(i).padStart(3, '0')}.jpg`,
    preloadCount = 24,
    smoothing = 0.08,
    pinHeight = '400vh',
    label = 'Animated suitcase opening',
}) {
    // ... existing refs and logic ...
    const sectionRef = useRef(null)
    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const state = useRef({
        images: [],
        currentFrame: 1,
        targetFrame: 1,
        rafId: null,
        resizeObserver: null,
    })

    // ─── Utils ───────────────────────────────────────────────────────────────

    const reduceMotion = typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false

    /** Resize canvas to match full viewport × DPR */
    const resizeCanvas = useCallback((img) => {
        const canvas = canvasRef.current
        if (!canvas || !img) return
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const w = window.innerWidth
        const h = window.innerHeight

        canvas.width = w * dpr
        canvas.height = h * dpr
        canvas.style.width = `${w}px`
        canvas.style.height = `${h}px`
    }, [])

    const [scrollProgress, setScrollProgress] = useState(0)
    const s = state.current

    /** Draw a specific frame index with camera-zoom depth scaling */
    const drawFrame = useCallback((index) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const img = state.current.images[index]
        if (!img?.complete || img.naturalWidth === 0) return

        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const cw = canvas.width / dpr
        const ch = canvas.height / dpr

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, cw, ch)

        const progress = (index - 1) / (frameCount - 1)
        const zoom = 1 + progress * 0.25

        const iw = img.naturalWidth
        const ih = img.naturalHeight
        const scale = Math.max(cw / iw, ch / ih) * zoom
        const w = iw * scale
        const h = ih * scale
        const x = (cw - w) / 2
        const y = (ch - h) / 2

        ctx.drawImage(img, x, y, w, h)
        setScrollProgress(progress) // Update state for UI elements
    }, [frameCount])

    // ─── Narrative Content ───
    const narrativeSteps = [
        { threshold: 0.1, label: 'Unpacking Chaos', text: 'Preparation meets peace of mind.' },
        { threshold: 0.4, label: 'Focusing Essentials', text: 'Smart suggestions for every family member.' },
        { threshold: 0.7, label: 'Ready for Flight', text: 'Your journey, perfectly organized.' }
    ]

    const activeNarrative = narrativeSteps.reduce((acc, step) =>
        scrollProgress >= step.threshold ? step : acc,
        { text: 'Scroll to unpack the journey' }
    )

    // ─── Preload ─────────────────────────────────────────────────────────────

    const preloadRange = useCallback((start, end) => {
        const { images } = state.current
        for (let i = start; i <= end; i++) {
            if (images[i]) continue // already loading/loaded
            const img = new Image()
            img.decoding = 'async'
            img.loading = 'eager'
            img.src = framePath(i)
            img.onload = () => {
                if (i === 1) {
                    resizeCanvas(img)
                    drawFrame(1)
                }
            }
            images[i] = img
        }
    }, [framePath, resizeCanvas, drawFrame])

    // ─── Scroll handler ───────────────────────────────────────────────────────

    const onScroll = useCallback(() => {
        const section = sectionRef.current
        if (!section) return
        const rect = section.getBoundingClientRect()
        const total = rect.height - window.innerHeight
        const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0
        state.current.targetFrame = 1 + progress * (frameCount - 1)

        // For reduced motion — snap immediately
        if (reduceMotion) {
            state.current.currentFrame = state.current.targetFrame
            drawFrame(Math.round(state.current.currentFrame))
        }
    }, [frameCount, reduceMotion, drawFrame])

    // ─── Animation loop ───────────────────────────────────────────────────────

    const animate = useCallback(() => {
        const s = state.current
        s.currentFrame += (s.targetFrame - s.currentFrame) * smoothing
        const rounded = Math.max(1, Math.min(frameCount, Math.round(s.currentFrame)))
        drawFrame(rounded)
        s.rafId = requestAnimationFrame(animate)
    }, [smoothing, frameCount, drawFrame])

    // ─── Setup / Teardown ─────────────────────────────────────────────────────

    useEffect(() => {
        const s = state.current

        // Eager preload first N frames
        preloadRange(1, preloadCount)

        // Lazy preload rest during idle
        const lazyLoad = () => preloadRange(preloadCount + 1, frameCount)
        if (typeof requestIdleCallback !== 'undefined') {
            requestIdleCallback(lazyLoad)
        } else {
            setTimeout(lazyLoad, 500)
        }

        // Scroll listener
        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll()

        // ResizeObserver
        const canvas = canvasRef.current
        if (canvas) {
            s.resizeObserver = new ResizeObserver(() => {
                if (s.images[1]?.complete) resizeCanvas(s.images[1])
            })
            s.resizeObserver.observe(canvas.parentElement)
        }

        // Start animation loop
        if (!reduceMotion) {
            s.rafId = requestAnimationFrame(animate)
        }

        return () => {
            window.removeEventListener('scroll', onScroll)
            if (s.rafId) cancelAnimationFrame(s.rafId)
            if (s.resizeObserver) s.resizeObserver.disconnect()
        }
    }, [animate, onScroll, preloadRange, resizeCanvas, preloadCount, frameCount, reduceMotion])

    return (
        <section
            ref={sectionRef}
            id="suitcase-seq"
            className={styles.section}
            style={{ height: pinHeight }}
            aria-label={label}
        >
            <div className={styles.pin} ref={containerRef}>
                <canvas
                    ref={canvasRef}
                    id="suitcase-canvas"
                    className={styles.canvas}
                    aria-hidden="true"
                />

                {/* Narrative Overlay — Points 4 & 12 */}
                <div className={styles.contentOverlay}>
                    <div className={styles.progressTracker}>
                        <div className={styles.progressLine}>
                            <motion.div
                                className={styles.progressFill}
                                style={{ height: `${scrollProgress * 100}%` }}
                            />
                        </div>
                        <div className={styles.progressSteps}>
                            {narrativeSteps.map((step, i) => (
                                <div
                                    key={i}
                                    className={`${styles.stepDot} ${scrollProgress >= step.threshold ? styles.stepActive : ''}`}
                                    title={step.label}
                                />
                            ))}
                        </div>
                    </div>

                    <div className={styles.narrativeBox}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeNarrative.text}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className={styles.narrativeText}
                            >
                                <span className={styles.narrativeLabel}>
                                    {activeNarrative.label || 'Interactive Story'}
                                </span>
                                <h2>{activeNarrative.text}</h2>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {scrollProgress < 0.1 && (
                        <motion.div
                            className={styles.scrollHint}
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span>Scroll to Unpack</span>
                            <ChevronDown size={20} />
                        </motion.div>
                    )}
                </div>

                {/* Parallax Artifact Layers — spill out as it opens */}
                {!reduceMotion && (
                    <div className={styles.parallaxLayer}>
                        <motion.div
                            className={styles.artifact}
                            style={{
                                x: '-25vw',
                                y: '-15vh',
                                scale: 0.8,
                                opacity: Math.max(0, (state.current.targetFrame - 60) / 100)
                            }}
                        >
                            <Plane size={120} color="var(--sky)" strokeWidth={0.5} style={{ opacity: 0.1 }} />
                        </motion.div>
                        <motion.div
                            className={styles.artifact}
                            style={{
                                x: '28vw',
                                y: '10vh',
                                scale: 1.2,
                                opacity: Math.max(0, (state.current.targetFrame - 40) / 100)
                            }}
                        >
                            <Star size={180} color="var(--iris)" strokeWidth={0.5} style={{ opacity: 0.08 }} />
                        </motion.div>
                        <motion.div
                            className={styles.artifact}
                            style={{
                                x: '-15vw',
                                y: '25vh',
                                scale: 0.6,
                                opacity: Math.max(0, (state.current.targetFrame - 80) / 100)
                            }}
                        >
                            <Map size={90} color="var(--mint)" strokeWidth={0.5} style={{ opacity: 0.12 }} />
                        </motion.div>
                    </div>
                )}

                {reduceMotion && (
                    <p className={styles.a11yNote}>Animation paused (reduce motion enabled)</p>
                )}
            </div>
        </section>
    )
}
