import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Plus, Trash2, Share2, Sparkles } from 'lucide-react'
import { toast } from 'react-hot-toast'
import PageWrapper from '../components/PageWrapper'
import styles from './PackingPage.module.css'
import { usePhase, PHASES } from '../context/PhaseContext'

const packingData = {
    'Essentials': {
        'Documents': [
            { id: 'd1', label: 'Passports & Visas', checked: true },
            { id: 'd2', label: 'Boarding Passes', checked: false },
            { id: 'd3', label: 'Travel Insurance', checked: false },
        ],
        'Health': [
            { id: 'h1', label: 'First Aid Kit', checked: false },
            { id: 'h2', label: 'Prescriptions', checked: true },
        ]
    },
    'Children': {
        'Leo (7)': [
            { id: 'l1', label: 'Comfort blanket', checked: true },
            { id: 'l2', label: 'Noise headphones', checked: false },
            { id: 'l3', label: 'Spare Hoodie', checked: false },
        ],
        'Mia (5)': [
            { id: 'm1', label: 'Stuffed Rabbit', checked: true },
            { id: 'm2', label: 'Tablet (Charged)', checked: true },
            { id: 'm3', label: 'Extra Socks', checked: false },
        ]
    },
    'Clothes': {
        'Parent 1': [
            { id: 'p1_1', label: 'Light Layers', checked: false },
            { id: 'p1_2', label: 'Comfort Shoes', checked: true },
        ],
        'Parent 2': [
            { id: 'p2_1', label: 'Extra Outfit', checked: false },
            { id: 'p2_2', label: 'Sunglasses', checked: false },
        ]
    },
    'Gear': {
        'Electronics': [
            { id: 'e1', label: 'Universal Adapter', checked: true },
            { id: 'e2', label: 'Power Bank', checked: false },
        ],
        'Travel': [
            { id: 't1', label: 'Inflatable Pillow', checked: false },
            { id: 't2', label: 'Water Bottles', checked: true },
        ]
    },
    'In-Flight': {
        'Comfort': [
            { id: 'if1', label: 'Neck Pillow', checked: false },
            { id: 'if2', label: 'Eye Mask', checked: false },
            { id: 'if3', label: 'Lip Balm', checked: false },
        ],
        'Family SOS': [
            { id: 'ifs1', label: 'Favorite Snacks', checked: true },
            { id: 'ifs2', label: 'Quiet Toys', checked: false },
            { id: 'ifs3', label: 'Wipes/Sanitizer', checked: true },
        ]
    }
}

const suggestionsByPhase = {
    [PHASES.PRE_FLIGHT]: {
        title: 'Heavier items at the bottom',
        desc: 'Based on your stroller-friendly route, we recommend placing heavier bags at the bottom for better balance.'
    },
    [PHASES.TERMINAL]: {
        title: 'Keep tablets & liquids handy',
        desc: 'Security check is approaching in the next step. Ensure all electronics are easily accessible.'
    },
    [PHASES.IN_FLIGHT]: {
        title: 'Hydration check',
        desc: 'Cabin air is dry. Ensure you have your reusable water bottles filled from the lounge.'
    }
}

export default function PackingPage() {
    const { phase, sentiment } = usePhase()
    const suggestion = suggestionsByPhase[phase] || suggestionsByPhase[PHASES.PRE_FLIGHT]

    // Personalize child names from setup
    const childNames = (() => {
        try {
            const saved = localStorage.getItem('familyTripData')
            if (saved) {
                const children = JSON.parse(saved).children
                return children.map(c => c.name)
            }
        } catch (e) { }
        return ['Leo', 'Mia']
    })()

    const activeSug = sentiment < 0.5 ? {
        title: 'Prioritize Comfort Items',
        desc: `High stress detected. Ensure ${childNames[0]}'s comfort blanket and noise-canceling headphones are in the carry-on.`
    } : suggestion

    const [activeTab, setActiveTab] = useState('Essentials')
    const [customItems, setCustomItems] = useState({}) // { tabName: [{ id, label }] }
    const [customInput, setCustomInput] = useState('')
    const [justHit100, setJustHit100] = useState(false)
    const [synced, setSynced] = useState(false)

    const [items, setItems] = useState(() => {
        const flat = {}
        Object.values(packingData).forEach(tab => {
            Object.values(tab).forEach(list => {
                list.forEach(i => { flat[i.id] = !!i.checked })
            })
        })
        return flat
    })

    const toggle = (id) => {
        setItems(prev => {
            const next = { ...prev, [id]: !prev[id] }
            const allIds = Object.keys(next)
            const allChecked = allIds.every(k => next[k])
            if (allChecked && !justHit100) {
                setJustHit100(true)
                setTimeout(() => setJustHit100(false), 4000)
            }
            return next
        })
    }

    const addCustomItem = () => {
        const label = customInput.trim()
        if (!label) return
        const id = `custom_${Date.now()}`
        // Add to items state as unchecked
        setItems(prev => ({ ...prev, [id]: false }))
        // Add to customItems for this tab
        setCustomItems(prev => ({
            ...prev,
            [activeTab]: [...(prev[activeTab] || []), { id, label }]
        }))
        setCustomInput('')
        toast.success(`"${label}" added to ${activeTab}`, {
            icon: '📦',
            style: { background: 'rgba(7,10,18,0.95)', color: '#fff', border: '1px solid var(--sky)', borderRadius: '100px', backdropFilter: 'blur(10px)' }
        })
    }

    const removeCustomItem = (tabName, id) => {
        setCustomItems(prev => ({
            ...prev,
            [tabName]: (prev[tabName] || []).filter(i => i.id !== id)
        }))
        setItems(prev => {
            const next = { ...prev }
            delete next[id]
            return next
        })
    }

    const getPackedCount = (tabName = null) => {
        if (!tabName) return Object.values(items).filter(v => v === true).length
        let count = 0
        const categories = packingData[tabName]
        if (categories) Object.values(categories).forEach(list => list.forEach(i => { if (items[i.id]) count++ }))
            ; (customItems[tabName] || []).forEach(i => { if (items[i.id]) count++ })
        return count
    }

    const getTotalCount = (tabName = null) => {
        if (!tabName) return Object.keys(items).length
        let count = 0
        const categories = packingData[tabName]
        if (categories) Object.values(categories).forEach(list => { count += list.length })
        count += (customItems[tabName] || []).length
        return count
    }

    const totalCount = getTotalCount()
    const packedCount = getPackedCount()
    const totalPct = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0

    return (
        <PageWrapper>
            <div className={`container ${styles.wrapper}`}>
                {/* 100% Confetti Banner */}
                <AnimatePresence>
                    {(totalPct === 100 || justHit100) && (
                        <motion.div
                            initial={{ opacity: 0, y: -40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{
                                position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
                                background: 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(125,211,252,0.1))',
                                border: '1px solid rgba(52,211,153,0.4)',
                                backdropFilter: 'blur(20px)',
                                padding: '14px 28px',
                                borderRadius: '100px',
                                display: 'flex', alignItems: 'center', gap: 12,
                                zIndex: 999,
                                boxShadow: '0 0 40px rgba(52,211,153,0.2)'
                            }}
                        >
                            <span style={{ fontSize: 20 }}>🎉</span>
                            <strong style={{ color: 'var(--mint)', fontSize: 14 }}>All packed! {childNames.join(' & ')} are ready for takeoff.</strong>
                        </motion.div>
                    )}
                </AnimatePresence>

                <header className={styles.header}>
                    <div>
                        <div className="section-label">Preparation</div>
                        <h1 className="hero-title-cinematic">Mission <span>Ready</span></h1>
                        <p>{totalPct === 100 ? 'Systems check complete — You are ready for takeoff.' : 'Finalizing essentials for your journey.'}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        <button
                            className={`btn ${synced ? 'btn-ghost' : 'btn-secondary'}`}
                            aria-label="Share packing list with your travel partner"
                            onClick={() => {
                                setSynced(true)
                                toast.success("Synced with Partner ✓", {
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
                            <Share2 size={16} /> {synced ? 'Synced ✓' : 'Sync with Partner'}
                        </button>
                    </div>
                </header>

                <div className={styles.tabLayout}>
                    {/* Left: Tabs */}
                    <div className={styles.tabList}>
                        {Object.keys(packingData).map(tab => {
                            const tabPacked = getPackedCount(tab)
                            const tabTotal = getTotalCount(tab)
                            const tabPct = tabTotal > 0 ? Math.round((tabPacked / tabTotal) * 100) : 0
                            return (
                                <button
                                    key={tab}
                                    className={`${styles.tabItem} ${activeTab === tab ? styles.tabActive : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    <span className={styles.tabLabel}>{tab}</span>
                                    <span className={styles.tabPill}>{tabPct}%</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Right: Content */}
                    <div className={styles.checklistColumn}>
                        {/* AI Suggestion */}
                        <motion.div
                            className={styles.aiSuggestionCard}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={activeSug.title}
                        >
                            <div className={styles.aiBadge}><Sparkles size={10} /> Smart Suggestion</div>
                            <div className={styles.aiTitle}>{activeSug.title}</div>
                            <div className={styles.aiDesc}>{activeSug.desc}</div>
                        </motion.div>

                        {/* Progress Bar */}
                        <div className={`glass ${styles.progressCard}`}>
                            <div className={styles.progressInfo}>
                                <div className={styles.progressLabel}>Overall Completion</div>
                                <div className={styles.progressPct}>{totalPct}%</div>
                            </div>
                            <div className="progress-bar">
                                <motion.div
                                    className="progress-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${totalPct}%` }}
                                    transition={{ duration: 0.6 }}
                                />
                            </div>
                        </div>

                        {/* Category Sections */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                            >
                                {Object.entries(packingData[activeTab]).map(([category, list]) => (
                                    <div key={category} className={styles.catSection}>
                                        <div className={styles.catHeader}>
                                            <h4>{category}</h4>
                                            <div className="chip chip-sky">{list.filter(i => items[i.id]).length} / {list.length}</div>
                                        </div>
                                        <div className={styles.itemList} role="list">
                                            {list.map(item => (
                                                <button
                                                    key={item.id}
                                                    className={`${styles.checkItem} ${items[item.id] ? styles.checkItemDone : ''}`}
                                                    onClick={() => toggle(item.id)}
                                                    role="listitem"
                                                >
                                                    <div className={`${styles.checkbox} ${items[item.id] ? styles.checkboxChecked : ''}`}>
                                                        {items[item.id] && <Check size={14} strokeWidth={3} />}
                                                    </div>
                                                    <span className={styles.itemLabel}>{item.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Custom Items for this tab */}
                                {(customItems[activeTab] || []).length > 0 && (
                                    <div className={styles.catSection}>
                                        <div className={styles.catHeader}>
                                            <h4>Custom Items</h4>
                                            <div className="chip chip-iris">{(customItems[activeTab] || []).filter(i => items[i.id]).length} / {(customItems[activeTab] || []).length}</div>
                                        </div>
                                        <div className={styles.itemList} role="list">
                                            {(customItems[activeTab] || []).map(item => (
                                                <button
                                                    key={item.id}
                                                    className={`${styles.checkItem} ${items[item.id] ? styles.checkItemDone : ''}`}
                                                    onClick={() => toggle(item.id)}
                                                    role="listitem"
                                                >
                                                    <div className={`${styles.checkbox} ${items[item.id] ? styles.checkboxChecked : ''}`}>
                                                        {items[item.id] && <Check size={14} strokeWidth={3} />}
                                                    </div>
                                                    <span className={styles.itemLabel}>{item.label}</span>
                                                    <button
                                                        onClick={e => { e.stopPropagation(); removeCustomItem(activeTab, item.id) }}
                                                        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0 4px', flexShrink: 0 }}
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Add Custom Item Input */}
                                <div className={styles.addItemRow}>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <input
                                            className={styles.addItemInput}
                                            placeholder={`+ Add item to ${activeTab}…`}
                                            value={customInput}
                                            onChange={e => setCustomInput(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') addCustomItem() }}
                                            aria-label="Add a custom packing item"
                                        />
                                        <button
                                            onClick={addCustomItem}
                                            className="btn btn-primary"
                                            style={{ flexShrink: 0, padding: '0 18px', borderRadius: 14 }}
                                            aria-label="Add item"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}
