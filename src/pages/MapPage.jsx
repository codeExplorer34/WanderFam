import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import L from 'leaflet'
import {
    Navigation, Clock, Accessibility, Coffee,
    Gamepad2, Plane, LocateFixed, Search,
    MapPin, Share2, ChevronRight, Home,
    Utensils, Baby, Activity, X
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import styles from './MapPage.module.css'

const AIRPORT_CENTER = [51.4761, -0.4845]
const AIRPORT_ZOOM = 17

const zones = [
    {
        id: 'gate',
        label: 'Gate B22',
        icon: Plane,
        color: '#3b82f6',
        colorHex: '#3b82f6',
        category: 'gates',
        coords: [51.4775, -0.4815],
        time: '12 min',
        desc: 'Your departure gate. Boarding begins at 16:00. Priority boarding available for families.',
        boardingTime: '16:00'
    },
    {
        id: 'restroom',
        label: 'Family Restroom',
        icon: Baby,
        color: '#10b981',
        colorHex: '#10b981',
        category: 'services',
        coords: [51.4763, -0.4848],
        time: '2 min',
        desc: 'Clean, fully equipped with baby-changing tables, toddler seats, and step stools.'
    },
    {
        id: 'cafe',
        label: 'Starbucks Coffee',
        icon: Coffee,
        color: '#f59e0b',
        colorHex: '#f59e0b',
        category: 'food',
        coords: [51.4755, -0.4862],
        time: '4 min',
        desc: 'Mobile ordering active. Kids menu available. Grab a snack before boarding.'
    },
    {
        id: 'play',
        label: 'Cloud Nine Play Zone',
        icon: Gamepad2,
        color: '#8b5cf6',
        colorHex: '#8b5cf6',
        category: 'services',
        coords: [51.4767, -0.4835],
        time: '6 min',
        desc: 'Soft play area and interactive screens. Supervised and free for all passengers.'
    },
]

const familyMembers = [
    { id: 'you', name: 'You', status: 'Near Cafe', initials: 'YU', coords: [51.4756, -0.4858], color: '#f97316' },
    { id: 'leo', name: 'Leo', status: 'Play Zone', initials: 'LE', coords: [51.4769, -0.4832], color: '#3b82f6' },
    { id: 'mia', name: 'Mia', status: 'Play Zone', initials: 'MI', coords: [51.4766, -0.4838], color: '#8b5cf6' },
]

const filterOptions = [
    { key: 'all', label: 'All', icon: Activity },
    { key: 'gates', label: 'Gates', icon: Plane },
    { key: 'food', label: 'Food', icon: Utensils },
    { key: 'services', label: 'Services', icon: Accessibility },
]
const floors = ['L1', 'L2', 'L3']

function createPulseIcon(colorHex, isSelected) {
    const size = isSelected ? 18 : 11
    const ring = size + 16
    const html = `
        <div style="position:relative;width:${ring}px;height:${ring}px;display:flex;align-items:center;justify-content:center;">
            <div style="
                width:${size}px;height:${size}px;border-radius:50%;
                background:${colorHex};
                border:2.5px solid white;
                box-shadow:0 2px 10px ${colorHex}55;
                position:relative;z-index:2;
            "></div>
            ${isSelected ? `<div style="
                position:absolute;inset:0;border-radius:50%;
                background:${colorHex}33;
                animation:leaflet-ping 2s ease-out infinite;
            "></div>` : ''}
        </div>
    `
    return L.divIcon({ html, className: '', iconSize: [ring, ring], iconAnchor: [ring / 2, ring / 2] })
}

function createFamilyIcon(member) {
    const html = `
        <div style="
            width:32px;height:32px;border-radius:50%;
            background:${member.color};
            border:2.5px solid white;
            display:flex;align-items:center;justify-content:center;
            font-size:10px;font-weight:700;color:white;
            box-shadow:0 2px 8px rgba(0,0,0,0.15);
            font-family: 'Plus Jakarta Sans', sans-serif;
            letter-spacing: 0.03em;
        ">${member.initials}</div>
    `
    return L.divIcon({ html, className: '', iconSize: [32, 32], iconAnchor: [16, 16] })
}

export default function MapPage() {
    const [selected, setSelected] = useState('gate')
    const [filter, setFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFloor, setActiveFloor] = useState('L2')
    const [showDetail, setShowDetail] = useState(true)
    const mapRef = useRef(null)
    const mapInstanceRef = useRef(null)
    const markersRef = useRef({})

    const selectedZone = useMemo(() => zones.find(z => z.id === selected), [selected])

    const filteredZones = useMemo(() => {
        return zones.filter(z => {
            const matchesFilter = filter === 'all' || z.category === filter
            const matchesSearch = z.label.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesFilter && matchesSearch
        })
    }, [filter, searchQuery])

    const gateZone = useMemo(() => zones.find(z => z.id === 'gate'), [])
    const minutesToLeave = 18

    useEffect(() => {
        if (!document.getElementById('leaflet-ping-style')) {
            const style = document.createElement('style')
            style.id = 'leaflet-ping-style'
            style.textContent = `@keyframes leaflet-ping {
                0%   { transform:scale(0.8); opacity:0.8; }
                100% { transform:scale(2.8); opacity:0; }
            }`
            document.head.appendChild(style)
        }

        if (!mapRef.current || mapInstanceRef.current) return

        const map = L.map(mapRef.current, {
            center: AIRPORT_CENTER,
            zoom: AIRPORT_ZOOM,
            zoomControl: false,
        })

        // CartoDB Voyager — clean, warm, readable
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
            subdomains: 'abcd',
            maxZoom: 20,
        }).addTo(map)

        // Add custom zoom control in top-right
        L.control.zoom({ position: 'topright' }).addTo(map)

        // Add POIs
        zones.forEach(zone => {
            const marker = L.marker(zone.coords, {
                icon: createPulseIcon(zone.colorHex, zone.id === 'gate'),
            }).addTo(map)

            marker.on('click', () => { setSelected(zone.id); setShowDetail(true) })
            marker.bindTooltip(zone.label, {
                direction: 'top', offset: [0, -12],
                className: 'leaflet-calm-tooltip'
            })
            markersRef.current[zone.id] = marker
        })

        // Add family member markers
        familyMembers.forEach(member => {
            L.marker(member.coords, { icon: createFamilyIcon(member) })
                .addTo(map)
                .bindTooltip(member.name, { direction: 'top', offset: [0, -18], className: 'leaflet-calm-tooltip' })
        })

        // Dashed route line
        const route = [familyMembers[0].coords, [51.4759, -0.4853], [51.4767, -0.4835], [51.4771, -0.4822], [51.4775, -0.4815]]
        L.polyline(route, { color: '#f97316', weight: 3, opacity: 0.5, dashArray: '6, 10' }).addTo(map)

        mapInstanceRef.current = map

        return () => {
            map.remove()
            mapInstanceRef.current = null
        }
    }, [])

    useEffect(() => {
        if (!mapInstanceRef.current) return
        zones.forEach(zone => {
            const marker = markersRef.current[zone.id]
            if (marker) marker.setIcon(createPulseIcon(zone.colorHex, zone.id === selected))
        })
    }, [selected])

    useEffect(() => {
        if (!mapInstanceRef.current) return
        zones.forEach(z => {
            const marker = markersRef.current[z.id]
            if (!marker) return
            const visible = (filter === 'all' || z.category === filter) && z.label.toLowerCase().includes(searchQuery.toLowerCase())
            if (visible && !mapInstanceRef.current.hasLayer(marker)) marker.addTo(mapInstanceRef.current)
            else if (!visible && mapInstanceRef.current.hasLayer(marker)) mapInstanceRef.current.removeLayer(marker)
        })
    }, [filter, searchQuery])

    // Add custom tooltip CSS
    useEffect(() => {
        if (!document.getElementById('leaflet-calm-tooltip-style')) {
            const style = document.createElement('style')
            style.id = 'leaflet-calm-tooltip-style'
            style.textContent = `.leaflet-calm-tooltip {
                background: white !important;
                border: 1px solid rgba(0,0,0,0.08) !important;
                border-radius: 8px !important;
                color: #1e293b !important;
                font-family: 'Plus Jakarta Sans', sans-serif !important;
                font-size: 12px !important;
                font-weight: 600 !important;
                box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
                padding: 6px 12px !important;
            }
            .leaflet-calm-tooltip::before { display: none !important; }
            `
            document.head.appendChild(style)
        }
    }, [])

    const handleFlyTo = (coords, zoom = 18) => {
        mapInstanceRef.current?.flyTo(coords, zoom, { duration: 1.2 })
    }

    const handleMyLocation = () => handleFlyTo(AIRPORT_CENTER, AIRPORT_ZOOM)

    return (
        <PageWrapper>
            {/* Global tooltip CSS patch */}
            <div className={styles.calmLayout}>


                {/* ── Main Content ────────────────────────────────────── */}
                <div className={styles.contentGrid}>

                    {/* ── Sidebar ──────────────────────────────────────── */}
                    <aside className={styles.sidebar}>

                        {/* Brand + Title */}
                        <div className={styles.sidebarTop}>
                            <h1 className={styles.pageTitle}>Airport Map</h1>
                            <p className={styles.pageSub}>Real-time family locator & facility finder</p>
                        </div>

                        {/* Search */}
                        <div className={styles.searchBox}>
                            <Search size={15} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search gates, food, services…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Filters */}
                        <div className={styles.filterSection}>
                            <div className={styles.filterPills}>
                                {filterOptions.map(f => {
                                    const count = f.key === 'all'
                                        ? zones.length
                                        : zones.filter(z => z.category === f.key).length
                                    return (
                                        <button
                                            key={f.key}
                                            className={`${styles.pill} ${filter === f.key ? styles.pillActive : ''}`}
                                            onClick={() => setFilter(f.key)}
                                        >
                                            <f.icon size={13} />
                                            <span>{f.label}</span>
                                            <em>{count}</em>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className={styles.sidebarScroll}>

                            {/* Family section */}
                            <div className={styles.section}>
                                <div className={styles.sectionHead}>
                                    <span className={styles.sectionTitle}>Family members</span>
                                    <span className={styles.liveBadge}>
                                        <span className={styles.liveDot} />
                                        Live
                                    </span>
                                </div>
                                {familyMembers.map(m => (
                                    <div
                                        key={m.id}
                                        className={styles.memberCard}
                                        onClick={() => handleFlyTo(m.coords, 19)}
                                    >
                                        <div className={styles.avatar} style={{ background: m.color }}>
                                            {m.initials}
                                        </div>
                                        <div className={styles.memberInfo}>
                                            <div className={styles.memberName}>{m.name}</div>
                                            <div className={styles.memberStatus}>
                                                <MapPin size={10} />
                                                {m.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Facilities list */}
                            <div className={styles.section}>
                                <div className={styles.sectionHead}>
                                    <span className={styles.sectionTitle}>Nearby facilities</span>
                                </div>
                                {filteredZones.length > 0 ? filteredZones.map(z => (
                                    <button
                                        key={z.id}
                                        className={`${styles.facilityRow} ${selected === z.id ? styles.facilityActive : ''}`}
                                        onClick={() => { setSelected(z.id); setShowDetail(true); handleFlyTo(z.coords) }}
                                    >
                                        <div className={styles.facilityIcon} style={{ background: z.colorHex + '18', color: z.colorHex }}>
                                            <z.icon size={15} />
                                        </div>
                                        <div className={styles.facilityInfo}>
                                            <span className={styles.facilityName}>{z.label}</span>
                                            <span className={styles.facilityTime}>
                                                <Clock size={10} />
                                                {z.time}
                                            </span>
                                        </div>
                                        {selected === z.id && <ChevronRight size={14} className={styles.facilityArrow} />}
                                    </button>
                                )) : (
                                    <p className={styles.emptyState}>No results for "{searchQuery}"</p>
                                )}
                            </div>

                        </div>
                    </aside>

                    {/* ── Map Area ─────────────────────────────────────── */}
                    <main className={styles.mapArea}>

                        {/* Map canvas */}
                        <div ref={mapRef} className={styles.mapCanvas} />

                        {/* My Location + Floor Switcher */}
                        <div className={styles.mapControls}>
                            <button className={styles.locBtn} onClick={handleMyLocation} title="Re-center">
                                <LocateFixed size={16} />
                                <span>My Location</span>
                            </button>

                            <div className={styles.floorSwitcher}>
                                <span className={styles.floorLabel}>Floor</span>
                                {floors.map(f => (
                                    <button
                                        key={f}
                                        className={`${styles.floorBtn} ${activeFloor === f ? styles.floorActive : ''}`}
                                        onClick={() => setActiveFloor(f)}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Gate Detail Card */}
                        <AnimatePresence>
                            {showDetail && selectedZone && (
                                <motion.div
                                    className={styles.detailCard}
                                    initial={{ y: 24, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 24, opacity: 0 }}
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                >
                                    <button className={styles.closeBtn} onClick={() => setShowDetail(false)}>
                                        <X size={14} />
                                    </button>
                                    <div className={styles.detailHeader}>
                                        <div className={styles.detailIconBox} style={{ background: selectedZone.colorHex + '18', color: selectedZone.colorHex }}>
                                            <selectedZone.icon size={22} />
                                        </div>
                                        <div>
                                            <h3 className={styles.detailTitle}>{selectedZone.label}</h3>
                                            <span className={styles.detailWalk}><Clock size={11} /> {selectedZone.time} walk</span>
                                        </div>
                                    </div>
                                    <p className={styles.detailDesc}>{selectedZone.desc}</p>
                                    <div className={styles.detailActions}>
                                        <button className={styles.navCta}>
                                            <Navigation size={15} />
                                            Start Navigation
                                        </button>
                                        <button className={styles.shareBtn}>
                                            <Share2 size={15} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </main>
                </div>
            </div>
        </PageWrapper>
    )
}
