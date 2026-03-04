import { createContext, useContext, useState, useEffect } from 'react'

const PhaseContext = createContext()

export const PHASES = {
    PRE_FLIGHT: 'pre-flight',
    TERMINAL: 'terminal',
    IN_FLIGHT: 'in-flight',
    ARRIVED: 'arrived'
}

export function PhaseProvider({ children }) {
    const [phase, setPhase] = useState(PHASES.PRE_FLIGHT)
    const [sentiment, setSentiment] = useState(1.0) // 0.0 (stressed) to 1.0 (calm)

    // Simple logic to "simulate" phase based on time if we were building more
    // For now, we provide the manual toggle capability for the demo

    return (
        <PhaseContext.Provider value={{ phase, setPhase, sentiment, setSentiment }}>
            {children}
        </PhaseContext.Provider>
    )
}

export const usePhase = () => useContext(PhaseContext)
