import { forwardRef } from 'react'
import './Level2Sorry.css'

const Level2Sorry = forwardRef((_, ref) => (
    <section className="level level-2" ref={ref}>
        <div className="level-header">
            <span className="level-badge">Level 2</span>
            <h2 className="level-title">The Sorry Bridge 💬</h2>
        </div>
        <div className="level-content">
            <div className="clouds">
                <div className="cloud c1">☁️</div>
                <div className="cloud c2">☁️</div>
                <div className="cloud c3">☁️</div>
            </div>
            <div className="sign-board">
                <div className="sign-post" />
                <div className="sign-face">
                    <p className="sign-title pixel">📜 A Message For You</p>
                    <p className="sign-message">
                        Hey <strong>Bakawasss</strong>,<br /><br />
                        I know I messed up, and I'm really, <em>really</em> sorry. 🥺<br /><br />
                        You're way too precious to me and I hate that I made you upset.<br /><br />
                        I promise I'll try to be better!<br />
                        Please don't be mad at me... 🫶
                    </p>
                    <p className="sign-from">— Anurag 💌</p>
                </div>
            </div>
            <div className="bridge-blocks">
                {[0, 1, 2, 3, 4].map(i => <div className="block" key={i} style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
        </div>
    </section>
))

Level2Sorry.displayName = 'Level2Sorry'
export default Level2Sorry
