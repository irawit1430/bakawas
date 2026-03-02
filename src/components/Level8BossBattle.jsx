import { forwardRef, useState, useCallback, useRef } from 'react'
import './Level8BossBattle.css'

const FUNNY_TEXTS = [
    "Nope, try again! 😜",
    "Can't catch me! 🏃‍♂️",
    "Hehe, you missed! 😝",
    "Just press Yes! 🥺",
    "I'll keep running! 🏃‍♀️💨",
    "You know you want to! 💖",
    "Stop being mean! 😭",
    "Anurag is crying rn 😢",
    "PLEASEEE 🥺🥺🥺",
    "Okay this is just rude 😤",
    "Last chance... 👉👈",
    "I'm literally begging 🧎",
]

const HINTS = [
    "hehe try clicking no 😏",
    "the no button is scared of you 😂",
    "just give up and press yes 💖",
    "anurag is on his knees begging 🧎",
    "NO MEANS YES RIGHT??? 🥺",
]

const Level8BossBattle = forwardRef(({ onVictory }, ref) => {
    const [noCount, setNoCount] = useState(0)
    const [noPos, setNoPos] = useState({ left: '50%', top: '120px' })
    const [noScale, setNoScale] = useState(1)
    const [noText, setNoText] = useState('No 😤')
    const arenaRef = useRef(null)
    const [yesScale, setYesScale] = useState(1)

    const handleNo = useCallback(() => {
        const newCount = noCount + 1
        setNoCount(newCount)

        const arena = arenaRef.current
        if (arena) {
            const w = arena.offsetWidth - 80
            const h = arena.offsetHeight - 40
            setNoPos({ left: Math.random() * w + 'px', top: Math.random() * h + 'px' })
        }

        setNoScale(Math.max(0.4, 1 - newCount * 0.07))
        setNoText(FUNNY_TEXTS[Math.min(newCount - 1, FUNNY_TEXTS.length - 1)])
        setYesScale(Math.min(1 + newCount * 0.05, 1.35))
    }, [noCount])

    const handleNoHover = useCallback(() => {
        if (noCount > 2) {
            const arena = arenaRef.current
            if (arena) {
                const w = arena.offsetWidth - 80
                const h = arena.offsetHeight - 40
                setNoPos({ left: Math.random() * w + 'px', top: Math.random() * h + 'px' })
            }
        }
    }, [noCount])

    const hintIdx = Math.min(Math.floor(noCount / 2), HINTS.length - 1)

    return (
        <section className="level level-8" ref={ref}>
            <div className="level-header">
                <span className="level-badge">Level 8</span>
                <h2 className="level-title">Boss Battle 😈</h2>
            </div>
            <div className="level-content">
                <div className="boss-intro">
                    <p className="boss-q pixel">⚔️ Final Boss ⚔️</p>
                    <p className="boss-sub-q">Will you forgive Anurag?</p>
                </div>
                <div className="hp-bar">
                    <div className="hp-label pixel">Anurag's Hope</div>
                    <div className="hp-track">
                        <div className="hp-fill" style={{ width: `${Math.max(5, 30 - noCount * 3)}%` }} />
                    </div>
                </div>
                <div className="btn-arena" ref={arenaRef}>
                    <button
                        className="forgive-btn yes-b"
                        onClick={onVictory}
                        style={{ transform: `scale(${yesScale})` }}
                    >
                        Yes, I forgive you! 💖
                    </button>
                    <button
                        className="forgive-btn no-b"
                        onClick={handleNo}
                        onMouseEnter={handleNoHover}
                        style={{ left: noPos.left, top: noPos.top, transform: `scale(${noScale})` }}
                    >
                        {noText}
                    </button>
                </div>
                <p className="boss-hint">{HINTS[hintIdx]}</p>
            </div>
        </section>
    )
})

Level8BossBattle.displayName = 'Level8BossBattle'
export default Level8BossBattle
