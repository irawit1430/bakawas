import { forwardRef, useState, useEffect, useRef, useCallback } from 'react'
import './Level4FastFood.css'

const FOODS = ['🍔', '🍕', '🌮', '🍟', '🌯', '🍩', '🧁', '🍦', '🥤', '🍗']

const Level4FastFood = forwardRef(({ score, setScore }, ref) => {
    const [falling, setFalling] = useState([])
    const [bursts, setBursts] = useState([])
    const intervalRef = useRef(null)
    const sectionRef = useRef(null)
    const [isActive, setIsActive] = useState(false)

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
                const food = FOODS[Math.floor(Math.random() * FOODS.length)]
                const left = 5 + Math.random() * 85
                const dur = 2.5 + Math.random() * 2
                setFalling(prev => [...prev.slice(-15), { id, food, left, dur }])
                setTimeout(() => setFalling(prev => prev.filter(f => f.id !== id)), dur * 1000)
            }, 600)
        } else {
            clearInterval(intervalRef.current)
        }
        return () => clearInterval(intervalRef.current)
    }, [isActive])

    const handleCatch = useCallback((id, food, left) => {
        setScore(s => s + 1)
        setFalling(prev => prev.filter(f => f.id !== id))
        const burstId = Date.now() + Math.random()
        setBursts(prev => [...prev, { id: burstId, left, food }])
        setTimeout(() => setBursts(prev => prev.filter(b => b.id !== burstId)), 600)
    }, [setScore])

    return (
        <section className="level level-4" ref={(el) => { sectionRef.current = el; if (typeof ref === 'function') ref(el) }}>
            <div className="level-header">
                <span className="level-badge">Level 4</span>
                <h2 className="level-title">Fast Food Rain 🍔</h2>
            </div>
            <div className="level-content">
                <p className="ff-sub">Bakawasss loves fast food! Tap to catch them!</p>
                <div className="ff-score-area">
                    <span className="ff-score pixel">{score}</span>
                    <span className="ff-label">caught!</span>
                </div>
                <div className="ff-arena">
                    {falling.map(f => (
                        <span
                            key={f.id}
                            className="ff-item"
                            style={{ left: `${f.left}%`, animationDuration: `${f.dur}s` }}
                            onClick={() => handleCatch(f.id, f.food, f.left)}
                        >
                            {f.food}
                        </span>
                    ))}
                    {bursts.map(b => (
                        <span key={b.id} className="ff-burst" style={{ left: `${b.left}%` }}>
                            YUM! 😋
                        </span>
                    ))}
                    {falling.length === 0 && <p className="ff-wait">Food incoming... 🍕</p>}
                </div>
                {score >= 5 && (
                    <div className="ff-badge glass-card">
                        <span>🍔</span>
                        <p>Fast Food Fan! ({score} caught)</p>
                    </div>
                )}
            </div>
        </section>
    )
})

Level4FastFood.displayName = 'Level4FastFood'
export default Level4FastFood
