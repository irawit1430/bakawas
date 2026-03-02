import { useEffect, useRef } from 'react'

const hearts = ['💖', '💗', '💕', '💓', '🩷', '♥️', '✨', '🌸']

export default function FloatingHearts() {
    const containerRef = useRef(null)

    useEffect(() => {
        const el = containerRef.current
        for (let i = 0; i < 22; i++) {
            const span = document.createElement('span')
            span.className = 'floating-heart'
            span.textContent = hearts[Math.floor(Math.random() * hearts.length)]
            span.style.left = Math.random() * 100 + '%'
            span.style.animationDuration = (8 + Math.random() * 14) + 's'
            span.style.animationDelay = (Math.random() * 12) + 's'
            span.style.fontSize = (0.8 + Math.random() * 1) + 'rem'
            el.appendChild(span)
        }
    }, [])

    return <div className="floating-hearts" ref={containerRef} />
}
