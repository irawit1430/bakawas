import { forwardRef, useState, useCallback } from 'react'
import './Level3PaniPuri.css'

const Level3PaniPuri = forwardRef(({ score, setScore }, ref) => {
    const [pops, setPops] = useState([])
    const [shake, setShake] = useState(false)

    const handleTap = useCallback(() => {
        setScore(s => s + 1)
        setShake(true)
        setTimeout(() => setShake(false), 200)

        const id = Date.now() + Math.random()
        const x = 30 + Math.random() * 40
        const emoji = ['🤤', '😋', '💕', '✨', '+1'][Math.floor(Math.random() * 5)]
        setPops(prev => [...prev, { id, x, emoji }])
        setTimeout(() => setPops(prev => prev.filter(p => p.id !== id)), 1000)
    }, [setScore])

    const getMessage = () => {
        if (score < 5) return 'Tap to eat pani puri! 🤤'
        if (score < 15) return 'YUMMY! Keep going! 😋'
        if (score < 30) return 'Bakawasss is a pani puri monster! 🔥'
        if (score < 50) return 'UNSTOPPABLE! 🤯'
        return 'PANI PURI QUEEN! 👑'
    }

    return (
        <section className="level level-3" ref={ref}>
            <div className="level-header">
                <span className="level-badge">Level 3</span>
                <h2 className="level-title">Pani Puri Challenge 🥘</h2>
            </div>
            <div className="level-content">
                <p className="pp-subtitle">Bakawasss's favorite! Tap to eat them all!</p>
                <div className="pp-counter pixel">{score}</div>
                <p className="pp-message">{getMessage()}</p>
                <div className="pp-tap-area" onClick={handleTap}>
                    <div className={`pp-bowl ${shake ? 'pp-shake' : ''}`}>
                        <div className="pp-plate">🍽️</div>
                        <div className="pp-puris">
                            {[0, 1, 2, 3, 4].map(i => (
                                <span key={i} className="pp-puri" style={{ animationDelay: `${i * 0.1}s` }}>🥟</span>
                            ))}
                        </div>
                        <div className="pp-water">💧</div>
                    </div>
                    <div className="pp-tap-text">TAP ME!</div>
                    {pops.map(p => (
                        <span key={p.id} className="pp-pop" style={{ left: `${p.x}%` }}>{p.emoji}</span>
                    ))}
                </div>
                {score >= 10 && (
                    <div className="pp-achievement glass-card">
                        <span>🏆</span>
                        <p>Achievement: Pani Puri Lover! ({score} eaten)</p>
                    </div>
                )}
            </div>
        </section>
    )
})

Level3PaniPuri.displayName = 'Level3PaniPuri'
export default Level3PaniPuri
