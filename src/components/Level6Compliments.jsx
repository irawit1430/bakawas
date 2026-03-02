import { forwardRef, useState, useEffect, useRef } from 'react'
import './Level6Compliments.css'

const COMPLIMENTS = [
    { emoji: '🌟', text: "You're the cutest player in every Roblox server" },
    { emoji: '🍔', text: "She can eat more pani puri than anyone alive" },
    { emoji: '📚', text: "The best tuition teacher that students actually love" },
    { emoji: '💖', text: "You make everything more fun just by being there" },
    { emoji: '✨', text: "You're literally the sweetest person in the universe" },
    { emoji: '🎮', text: "Gaming without you is just boring tbh" },
    { emoji: '🥺', text: "You're soooo cute it's not even fair" },
    { emoji: '👑', text: "Rich, smart, cute, gamer — she has everything" },
    { emoji: '💪', text: "The hardest working teacher I know" },
    { emoji: '🌸', text: "Everything about you is just *chef's kiss*" },
]

const Level6Compliments = forwardRef((_, ref) => {
    const [visible, setVisible] = useState(new Set())
    const cardsRef = useRef([])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const idx = parseInt(entry.target.dataset.idx)
                        setTimeout(() => {
                            setVisible(prev => new Set([...prev, idx]))
                        }, idx * 150)
                    }
                })
            },
            { threshold: 0.2 }
        )
        cardsRef.current.forEach(el => { if (el) observer.observe(el) })
        return () => observer.disconnect()
    }, [])

    return (
        <section className="level level-6" ref={ref}>
            <div className="level-header">
                <span className="level-badge">Level 6</span>
                <h2 className="level-title">Compliment Checkpoint 🌸</h2>
            </div>
            <div className="level-content">
                <p className="comp-intro">Things Anurag thinks about Bakawasss:</p>
                <div className="comp-list">
                    {COMPLIMENTS.map((c, i) => (
                        <div
                            key={i}
                            className={`comp-card glass-card ${visible.has(i) ? 'comp-visible' : ''} ${i % 2 === 0 ? 'from-left' : 'from-right'}`}
                            ref={el => cardsRef.current[i] = el}
                            data-idx={i}
                        >
                            <span className="comp-emoji">{c.emoji}</span>
                            <p>{c.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
})

Level6Compliments.displayName = 'Level6Compliments'
export default Level6Compliments
