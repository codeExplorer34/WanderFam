import { motion, useScroll, useTransform } from 'framer-motion'

export default function Background() {
    const { scrollYProgress } = useScroll()

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -300])
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 450])
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -180])
    const y4 = useTransform(scrollYProgress, [0, 1], [0, 120])

    return (
        <>
            <motion.div style={{ y: y1 }} className="aurora-orb aurora-orb-1" />
            <motion.div style={{ y: y2 }} className="aurora-orb aurora-orb-2" />
            <motion.div style={{ y: y3 }} className="aurora-orb aurora-orb-3" />
            <motion.div
                style={{ y: y4, opacity: 0.1, background: 'radial-gradient(circle, var(--blue-soft) 0%, transparent 70%)', width: 800, height: 800, right: '20%', top: '30%' }}
                className="aurora-orb"
            />
        </>
    )
}
