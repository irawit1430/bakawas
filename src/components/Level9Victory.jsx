import { forwardRef, useEffect, useRef } from 'react'
import './Level9Victory.css'

const CONFETTI_COLORS = ['#ff8fab', '#c8b6ff', '#b8e0d2', '#ffd6a5', '#fdffb6', '#a0c4ff', '#ffd700', '#ff6b6b']

const Level9Victory = forwardRef(({ paniPuri, fastFood, stars, diamonds }, ref) => {
    const confettiRef = useRef(null)

    useEffect(() => {
        const container = confettiRef.current
        if (!container) return

        const launchWave = (count, delay) => {
            setTimeout(() => {
                for (let i = 0; i < count; i++) {
                    setTimeout(() => {
                        const piece = document.createElement('div')
                        piece.className = 'confetti-piece'
                        const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
                        const size = 6 + Math.random() * 10
                        piece.style.left = Math.random() * 100 + '%'
                        piece.style.width = size + 'px'
                        piece.style.height = size + 'px'
                        piece.style.background = color
                        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px'
                        piece.style.animationDuration = (2 + Math.random() * 3) + 's'
                        container.appendChild(piece)
                        setTimeout(() => piece.remove(), 5000)
                    }, i * 30)
                }
            }, delay)
        }

        launchWave(100, 0)
        launchWave(60, 1500)
        launchWave(40, 3500)
    }, [])

    const totalXP = (paniPuri * 10) + (fastFood * 15) + (stars * 20) + (diamonds * 25) + 9999

    return (
        <section className="level level-9 in-view" ref={ref} id="victory">
            <div className="confetti-container" ref={confettiRef} />
            <div className="level-header">
                <span className="level-badge v-badge">🏆 Victory!</span>
                <h2 className="level-title v-title">BAKAWASSS WINS! 🎉</h2>
            </div>
            <div className="level-content v-content">
                <div className="v-characters">
                    {/* Anurag */}
                    <div className="roblox-char v-char">
                        <div className="char-head v-bounce">
                            <div className="char-face">
                                <div className="char-eye left v-eye" />
                                <div className="char-eye right v-eye" />
                                <div className="char-mouth happy" />
                            </div>
                        </div>
                        <div className="char-body">
                            <div className="char-arm left v-wave" />
                            <div className="char-arm right v-wave-r" />
                        </div>
                        <div className="char-legs">
                            <div className="char-leg left" />
                            <div className="char-leg right" />
                        </div>
                        <div className="name-tag">Anurag</div>
                    </div>
                    <div className="v-heart">💖</div>
                    {/* Bakawasss */}
                    <div className="roblox-char v-char baka">
                        <div className="char-head v-bounce">
                            <div className="char-face">
                                <div className="char-eye left v-eye" />
                                <div className="char-eye right v-eye" />
                                <div className="char-mouth happy" />
                            </div>
                            <div className="char-hair" />
                        </div>
                        <div className="char-body">
                            <div className="char-arm left v-wave-r" />
                            <div className="char-arm right v-wave" />
                        </div>
                        <div className="char-legs">
                            <div className="char-leg left" />
                            <div className="char-leg right" />
                        </div>
                        <div className="name-tag">Bakawasss</div>
                    </div>
                </div>

                <div className="v-message">
                    <p className="v-yay">YAY! We're besties again! 🥺💖</p>
                    <p className="v-sub pixel">OBBY COMPLETED! FRIENDSHIP RESTORED!</p>
                </div>

                {/* Stats */}
                <div className="v-stats glass-card">
                    <h3 className="v-stats-header pixel">📊 Adventure Stats</h3>
                    <div className="v-stat-row"><span>🥘 Pani Puris eaten</span><span className="v-stat-val">{paniPuri}</span></div>
                    <div className="v-stat-row"><span>🍔 Fast Food caught</span><span className="v-stat-val">{fastFood}</span></div>
                    <div className="v-stat-row"><span>⭐ Gold Stars given</span><span className="v-stat-val">{stars}</span></div>
                    <div className="v-stat-row"><span>💎 Riches collected</span><span className="v-stat-val">{diamonds}</span></div>
                    <div className="v-stat-total">
                        <span>Total Friendship XP</span>
                        <span className="v-xp pixel">+{totalXP}</span>
                    </div>
                </div>

                <div className="v-xp-banner pixel">+{totalXP} Friendship XP ✨</div>

                {/* Badges */}
                <div className="v-badges">
                    <div className="v-badge-card glass-card">
                        <div className="v-badge-icon">🏅</div>
                        <p className="v-badge-name">"Best Friend Ever"</p>
                    </div>
                    {paniPuri >= 10 && (
                        <div className="v-badge-card glass-card">
                            <div className="v-badge-icon">🥘</div>
                            <p className="v-badge-name">"Pani Puri Queen"</p>
                        </div>
                    )}
                    {fastFood >= 5 && (
                        <div className="v-badge-card glass-card">
                            <div className="v-badge-icon">🍔</div>
                            <p className="v-badge-name">"Fast Food Fan"</p>
                        </div>
                    )}
                    {stars >= 15 && (
                        <div className="v-badge-card glass-card">
                            <div className="v-badge-icon">📚</div>
                            <p className="v-badge-name">"Top Teacher"</p>
                        </div>
                    )}
                    {diamonds >= 10 && (
                        <div className="v-badge-card glass-card">
                            <div className="v-badge-icon">👑</div>
                            <p className="v-badge-name">"Rich Queen"</p>
                        </div>
                    )}
                </div>

                <div className="v-final-msg">
                    <p>I'm really sorry, Bakawasss 🥺</p>
                    <p>You mean the world to me.</p>
                    <p>Please never be mad at me 🫶</p>
                    <p className="v-sign">— Anurag 💌</p>
                </div>
            </div>
        </section>
    )
})

Level9Victory.displayName = 'Level9Victory'
export default Level9Victory
