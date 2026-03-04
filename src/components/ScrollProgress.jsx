import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import styles from './ScrollProgress.module.css'

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll()
    const { pathname } = useLocation()

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })


    return (
        <div className={styles.progressWrapper}>
            <div className={styles.track}>
                <motion.div
                    className={styles.fill}
                    style={{ scaleY, originY: 0 }}
                />
            </div>
            <div className={styles.stages}>
                <div className={styles.stageItem} style={{ top: '0%' }}>
                    <div className={styles.stageDot} />
                    <span className={styles.stageLabel}>Launch</span>
                </div>
                <div className={styles.stageItem} style={{ top: '30%' }}>
                    <div className={styles.stageDot} />
                    <span className={styles.stageLabel}>Vision</span>
                </div>
                <div className={styles.stageItem} style={{ top: '60%' }}>
                    <div className={styles.stageDot} />
                    <span className={styles.stageLabel}>Features</span>
                </div>
                <div className={styles.stageItem} style={{ top: '100%' }}>
                    <div className={styles.stageDot} />
                    <span className={styles.stageLabel}>Begin</span>
                </div>
            </div>
        </div>
    )
}
