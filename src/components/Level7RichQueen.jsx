import { forwardRef, useState, useEffect, useRef, useCallback } from 'react'
import './Level7RichQueen.css'

const ITEMS = ['💎', '💰', '👑', '💵', '💍', '🏆', '✨', '🪙']

const Level7RichQueen = forwardRef(({ diamonds, setDiamonds }, ref) => {
    const [rain, setRain] = useState([])
    const [isActive, setIsActive] = useState(false)
    const sectionRef = useRef(null)
    const intervalRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsActive(entry.isIntersecting),
            { threshold: 0.3 }
        )
        const el = ref?.current || sectionRef.current
        if (el) observer.observe(el)
        return () => observer.disconnect()
    }, [ref])

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                const id = Date.now() + Math.random()
                const item = ITEMS[Math.floor(Math.random() * ITEMS.length)]
                const left = Math.random() * 90
                const dur = 3 + Math.random() * 2
                setRain(prev => [...prev.slice(-20), { id, item, left, dur }])
                setTimeout(() => setRain(prev => prev.filter(r => r.id !== id)), dur * 1000)
            }, 400)
        } else {
            clearInterval(intervalRef.current)
        }
        return () => clearInterval(intervalRef.current)
    }, [isActive])

    const handleCatch = useCallback((id) => {
        setDiamonds(d => d + 1)
        setRain(prev => prev.filter(r => r.id !== id))
    }, [setDiamonds])

    return (
        <section className="level level-7" ref={(el) => { sectionRef.current = el; if (typeof ref === 'function') ref(el) }}>
            <div className="level-header">
                <span className="level-badge rq-badge">Level 7</span>
                <h2 className="level-title rq-title">Rich Queen Mode 💎</h2>
            </div>
            <div className="level-content">
                <p className="rq-sub">Bakawasss is rich & fabulous! Collect the riches! 👑</p>
                <div className="rq-counter">
                    <span className="rq-diamonds pixel">{diamonds}</span>
                    <span className="rq-label">💎 collected</span>
                </div>
                <div className="rq-empire-text">
                    {diamonds < 10 ? '💰 Building the Bakawasss Empire...' :
                        diamonds < 25 ? '🏰 Bakawasss Manor is growing!' :
                            diamonds < 50 ? '👑 Queen Bakawasss reigns supreme!' :
                                '🌟 Bakawasss is the RICHEST queen ever!'}
                </div>
                <div className="rq-arena">
                    {rain.map(r => (
                        <span
                            key={r.id}
                            className="rq-item"
                            style={{ left: `${r.left}%`, animationDuration: `${r.dur}s` }}
                            onClick={() => handleCatch(r.id)}
                        >
                            {r.item}
                        </span>
                    ))}
                </div>
                {diamonds >= 10 && (
                    <div className="rq-crown glass-card">
                        <span>👑</span>
                        <p>Crown Unlocked! ({diamonds} riches)</p>
                    </div>
                )}
            </div>
        </section>
    )
})

Level7RichQueen.displayName = 'Level7RichQueen'
export default Level7RichQueen
