import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState, createContext, useContext, lazy, Suspense } from 'react'
import CustomCursor from './components/CustomCursor'
import StaggeredMenu from './components/StaggeredMenu'
import Background from './components/Background'
import NotificationCenter from './components/NotificationCenter'
import Footer from './components/Footer'
import { PhaseProvider } from './context/PhaseContext'
import ScrollProgress from './components/ScrollProgress'
import { Toaster } from 'react-hot-toast'

// Route-level code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'))
const SetupPage = lazy(() => import('./pages/SetupPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const MapPage = lazy(() => import('./pages/MapPage'))
const ActivitiesPage = lazy(() => import('./pages/ActivitiesPage'))
const PackingPage = lazy(() => import('./pages/PackingPage'))
const SecurityPage = lazy(() => import('./pages/SecurityPage'))
const PlanTripPage = lazy(() => import('./pages/PlanTripPage'))
const SystemPage = lazy(() => import('./pages/SystemPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const BookingPage = lazy(() => import('./pages/BookingPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const PageSkeleton = () => (
    <div style={{ minHeight: '100vh', background: 'var(--base-0)' }} />
)

export const DemoContext = createContext()
export const useDemoMode = () => useContext(DemoContext)

const menuItems = [
    { label: 'Plan a Trip', sub: 'Destinations', link: '/plan-trip' },
    { label: 'Airport Map', sub: 'Adaptive Route', link: '/map' },
    { label: 'Security Prep', sub: 'Family Fast-Track', link: '/security' },
    { label: 'Packing List', sub: 'Luggage Sync', link: '/packing' },
    { label: 'Activities', sub: 'Boredom Killers', link: '/activities' }
]

const socialItems = [
    { label: 'Start Journey', link: '/plan-trip' },
    { label: 'Journey Hub', link: '/dashboard' },
    { label: 'Design System', link: '/system' }
]

function AnimatedRoutes() {
    const location = useLocation()
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/setup" element={<SetupPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/activities" element={<ActivitiesPage />} />
                <Route path="/packing" element={<PackingPage />} />
                <Route path="/security" element={<SecurityPage />} />
                <Route path="/plan-trip" element={<PlanTripPage />} />
                <Route path="/system" element={<SystemPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </AnimatePresence>
    )
}

function ConditionalMenu({ items, socialItems }) {
    return (
        <StaggeredMenu
            items={items}
            socialItems={socialItems}
            accentColor="var(--sky)"
            colors={['var(--base-1)', 'var(--iris)']}
        />
    )
}

export default function App() {
    const [demoMode, setDemoMode] = useState(false)

    return (
        <PhaseProvider>
            <DemoContext.Provider value={{ demoMode, setDemoMode }}>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <Toaster position="bottom-right" reverseOrder={false} />
                    <CustomCursor />
                    <Background />
                    <ConditionalMenu
                        items={menuItems}
                        socialItems={socialItems}
                    />
                    <ScrollProgress />
                    <NotificationCenter />
                    <Suspense fallback={<PageSkeleton />}>
                        <AnimatedRoutes />
                    </Suspense>
                    <Footer />
                </BrowserRouter>
            </DemoContext.Provider>
        </PhaseProvider>
    )
}
