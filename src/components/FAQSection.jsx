import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, HelpCircle, Gamepad2, Wind, Navigation, Users } from 'lucide-react'
import styles from './FAQSection.module.css'

const FAQS = [
    {
        id: 'account',
        question: "Do I need to create an account to start?",
        answer: "No. We prioritize your time. Start instantly without any sign-up. Your travel data is stored locally and securely on your device for the duration of your journey.",
        icon: <HelpCircle size={20} />
    },
    {
        id: 'calm',
        question: "How does 'Calm Mode' actually help me?",
        answer: "Calm Mode uses psychological grounding techniques and guided breathing to reduce airport anxiety. It's designed to be activated in seconds when things get overwhelming.",
        icon: <Wind size={20} />
    },
    {
        id: 'activities',
        question: "What kind of 'Boredom Killers' are available for my kids?",
        answer: "We provide an intelligent library of age-appropriate scavenger hunts, interactive 'Window-View' games, and digital puzzles. Each activity is suggested at the optimal time to keep explorers perfectly engaged.",
        icon: <Gamepad2 size={20} />
    },
    {
        id: 'map',
        question: "Are the directions stroller-friendly?",
        answer: "Yes. Our intelligent mapping engine prioritizes elevators over stairs and highlights wider paths to ensure a seamless experience with strollers or luggage.",
        icon: <Navigation size={20} />
    },
    {
        id: 'sync',
        question: "Can I sync my trip with my partner?",
        answer: "Yes. Simply tap 'Sync with Partner' to generate a secure link. Your partner can then see the same live timeline, map, and activity lists on their device.",
        icon: <Users size={20} />
    }
]

export default function FAQSection() {
    const [expandedId, setExpandedId] = useState(FAQS[0].id) // Start with one open

    const toggle = (id) => {
        setExpandedId(expandedId === id ? null : id)
    }

    return (
        <section id="faq" className={styles.faqSection}>
            <div className={styles.bgOverlay} />
            <div className="container">
                <div className={styles.header}>
                    <div className={styles.pillBadge}>Frequently Asked Questions</div>
                    <h2 className={styles.title}>Your questions answered</h2>
                    <p className={styles.subline}>
                        To provide flexible, inspiring travels that foster connection and peace of mind.
                        We strive to create an environment where every family can thrive.
                    </p>
                </div>

                <div className={styles.faqGrid}>
                    {FAQS.map((faq, index) => (
                        <div
                            key={faq.id}
                            className={`${styles.faqItem} ${expandedId === faq.id ? styles.active : ''}`}
                            onClick={() => toggle(faq.id)}
                        >
                            <div className={styles.faqHeader}>
                                <div className={styles.faqNumber}>
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                                <h3 className={styles.question}>{faq.question}</h3>
                                <div className={styles.toggleIcon}>
                                    {expandedId === faq.id ? <Minus size={18} strokeWidth={1.5} /> : <Plus size={18} strokeWidth={1.5} />}
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedId === faq.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        className={styles.faqContent}
                                    >
                                        <div className={styles.answer}>
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
