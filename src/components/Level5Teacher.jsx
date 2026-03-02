import { forwardRef, useState, useCallback } from 'react'
import './Level5Teacher.css'

const Level5Teacher = forwardRef(({ stars, setStars }, ref) => {
    const [floatStars, setFloatStars] = useState([])
    const [showCert, setShowCert] = useState(false)

    const handleTapStar = useCallback(() => {
        setStars(s => {
            const next = s + 1
            if (next >= 15 && !showCert) setShowCert(true)
            return next
        })
        const id = Date.now() + Math.random()
        const x = 10 + Math.random() * 80
        setFloatStars(prev => [...prev, { id, x }])
        setTimeout(() => setFloatStars(prev => prev.filter(s => s.id !== id)), 1000)
    }, [setStars, showCert])

    return (
        <section className="level level-5" ref={ref}>
            <div className="level-header">
                <span className="level-badge">Level 5</span>
                <h2 className="level-title">Best Teacher Award 📚</h2>
            </div>
            <div className="level-content">
                <p className="teach-sub">Bakawasss is the sweetest tuition teacher ever! ✨</p>
                <div className="teach-board glass-card">
                    <div className="teach-chalk">📝</div>
                    <p className="teach-text">
                        <strong>Students say:</strong><br />
                        "Best teacher ever! She explains everything so well and never gets angry!" ⭐
                    </p>
                </div>

                <div className="star-collector">
                    <p className="star-prompt">Give her gold stars! ⭐</p>
                    <div className="star-count pixel">{stars} ⭐</div>
                    <div className="star-tap-area" onClick={handleTapStar}>
                        <div className="star-big">⭐</div>
                        <span className="star-tap-label">TAP!</span>
                    </div>
                    {floatStars.map(s => (
                        <span key={s.id} className="star-float" style={{ left: `${s.x}%` }}>⭐</span>
                    ))}
                </div>

                {showCert && (
                    <div className="certificate glass-card">
                        <div className="cert-header">🎓 CERTIFICATE 🎓</div>
                        <p className="cert-body">
                            This certifies that<br />
                            <strong className="cert-name">Bakawasss</strong><br />
                            is officially the<br />
                            <span className="cert-title">"World's Best Tuition Teacher"</span>
                        </p>
                        <div className="cert-stars">⭐⭐⭐⭐⭐</div>
                        <p className="cert-signed">— Signed by all students 💖</p>
                    </div>
                )}
            </div>
        </section>
    )
})

Level5Teacher.displayName = 'Level5Teacher'
export default Level5Teacher
