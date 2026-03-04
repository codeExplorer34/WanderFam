import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plane, ArrowLeft } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'

export default function NotFoundPage() {
    return (
        <PageWrapper>
            <div style={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '40px 20px'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ fontSize: 80, marginBottom: 32 }}
                    >
                        ✈️
                    </motion.div>
                    <div className="section-label" style={{ marginBottom: 16 }}>404 — Lost in Transit</div>
                    <h1 className="hero-title-cinematic" style={{ fontSize: 'clamp(40px, 6vw, 72px)', marginBottom: 16 }}>
                        This gate doesn't<br />exist yet.
                    </h1>
                    <p style={{ color: 'var(--text-body)', fontSize: 18, marginBottom: 40, maxWidth: 420, margin: '0 auto 40px' }}>
                        Looks like you've wandered off the terminal map. Let's get you back on track.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/" className="btn btn-primary btn-lg">
                            <ArrowLeft size={18} /> Back to Home
                        </Link>
                        <Link to="/dashboard" className="btn btn-ghost btn-lg">
                            <Plane size={18} /> Family Hub
                        </Link>
                    </div>
                </motion.div>
            </div>
        </PageWrapper>
    )
}
