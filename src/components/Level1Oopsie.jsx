import { forwardRef } from 'react'
import './Level1Oopsie.css'

const Level1Oopsie = forwardRef((_, ref) => (
    <section className="level level-1 in-view" ref={ref}>
        <div className="level-header">
            <span className="level-badge">Level 1</span>
            <h2 className="level-title">The Oopsie Zone 🫣</h2>
        </div>
        <div className="level-content">
            <div className="oopsie-scene">
                <div className="roblox-char oopsie-char">
                    <div className="char-head">
                        <div className="char-face">
                            <div className="char-eye left" />
                            <div className="char-eye right" />
                            <div className="char-mouth sad" />
                        </div>
                    </div>
                    <div className="char-body">
                        <div className="char-arm left" />
                        <div className="char-arm right" />
                    </div>
                    <div className="char-legs">
                        <div className="char-leg left" />
                        <div className="char-leg right" />
                    </div>
                    <div className="name-tag">Anurag</div>
                </div>
                <div className="trip-stars">
                    <span>⭐</span><span>💫</span><span>✨</span>
                </div>
            </div>
            <div className="oopsie-text">
                <span className="big-oops pixel">OOPS!</span>
                <p>anurag tripped and fell...</p>
                <p className="sub-text">...because he messed up 🥺</p>
            </div>
            <div className="scroll-hint">
                <span>scroll down to continue the obby</span>
                <div className="scroll-arrow">↓</div>
            </div>
        </div>
    </section>
))

Level1Oopsie.displayName = 'Level1Oopsie'
export default Level1Oopsie
