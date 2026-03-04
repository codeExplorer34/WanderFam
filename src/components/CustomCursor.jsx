import { useEffect, useRef } from 'react'

export default function CustomCursor() {
    const dotRef = useRef(null)
    const pos = useRef({ x: 0, y: 0 })
    const mouse = useRef({ x: 0, y: 0 })
    const rafRef = useRef(null)

    useEffect(() => {
        if (!window.matchMedia('(pointer: fine)').matches) return

        const dot = dotRef.current
        if (!dot) return

        const onMouseMove = (e) => {
            mouse.current = { x: e.clientX, y: e.clientY }
        }

        const animate = () => {
            // Smooth interpolation (LERP) for that "smooth" feel
            pos.current.x += (mouse.current.x - pos.current.x) * 0.15
            pos.current.y += (mouse.current.y - pos.current.y) * 0.15

            dot.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`

            rafRef.current = requestAnimationFrame(animate)
        }

        const onMouseDown = () => dot.classList.add('clicking')
        const onMouseUp = () => dot.classList.remove('clicking')

        // Add hover effect for interactable elements
        const onMouseOver = (e) => {
            if (e.target.closest('a, button, [role="button"], input, select, textarea')) {
                dot.classList.add('hovered')
            }
        }
        const onMouseOut = (e) => {
            if (e.target.closest('a, button, [role="button"], input, select, textarea')) {
                dot.classList.remove('hovered')
            }
        }

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mousedown', onMouseDown)
        window.addEventListener('mouseup', onMouseUp)
        window.addEventListener('mouseover', onMouseOver)
        window.addEventListener('mouseout', onMouseOut)

        rafRef.current = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mousedown', onMouseDown)
            window.removeEventListener('mouseup', onMouseUp)
            window.removeEventListener('mouseover', onMouseOver)
            window.removeEventListener('mouseout', onMouseOut)
            cancelAnimationFrame(rafRef.current)
        }
    }, [])

    return <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
}
