import { useState, useCallback, useEffect } from 'react'
import './App.css'

const BASE = import.meta.env.BASE_URL

const PAGES = [
  { id: 'cover' },
  { id: 'sorry' },
  { id: 'things' },
  { id: 'compliments' },
  { id: 'promise' },
  { id: 'forgive' },
  { id: 'final' },
]

function App() {
  const [currentPage, setCurrentPage] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [forgiven, setForgiven] = useState(false)
  const [noCount, setNoCount] = useState(0)
  const [noPos, setNoPos] = useState({})
  const [noText, setNoText] = useState("no, not yet")
  const [hearts, setHearts] = useState([])

  const goNext = useCallback(() => {
    if (transitioning) return
    if (currentPage >= PAGES.length - 1) return
    setTransitioning(true)
    setTimeout(() => {
      setCurrentPage(p => p + 1)
      setTransitioning(false)
    }, 300)
  }, [currentPage, transitioning])

  const handleForgive = useCallback(() => {
    setForgiven(true)
    // Launch hearts
    const newHearts = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      left: 10 + Math.random() * 80,
      delay: i * 0.15,
      size: 14 + Math.random() * 18,
    }))
    setHearts(newHearts)
    setTimeout(() => goNext(), 1200)
  }, [goNext])

  const handleNo = useCallback(() => {
    const c = noCount + 1
    setNoCount(c)
    const texts = [
      "hmm, really?", "you sure?", "think again...",
      "come on...", "please?", "pretty please?",
      "okay wow", "i'm not going away", "just tap yes",
      "you know you want to",
    ]
    setNoText(texts[Math.min(c, texts.length - 1)])
    setNoPos({
      left: `${10 + Math.random() * 60}%`,
      top: `${Math.random() * 100}px`,
    })
  }, [noCount])

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') goNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext])

  return (
    <div className="app">
      <div className="ambient ambient-1" />
      <div className="ambient ambient-2" />

      {currentPage > 0 && currentPage < PAGES.length - 1 && (
        <div className="page-counter">{currentPage} / {PAGES.length - 1}</div>
      )}

      {/* === COVER === */}
      <div className={`page ${currentPage === 0 ? 'active' : 'exiting'}`} onClick={goNext}>
        <div className="page-inner">
          <img src={`${BASE}cover.png`} alt="" className="illustration" />
          <span className="cover-label">a letter for</span>
          <h1 className="cover-name">Bakawasss</h1>
          <p className="cover-from handwritten">from anurag</p>
          <span className="tap-hint">tap anywhere to open</span>
        </div>
      </div>

      {/* === PAGE 1: SORRY === */}
      <div className={`page ${currentPage === 1 ? 'active' : currentPage > 1 ? 'exiting' : ''}`}>
        <div className="page-inner">
          <img src={`${BASE}sorry.png`} alt="" className="illustration" />
          <p className="page-text">
            i messed up. i know. and i'm not going to make excuses.
          </p>
          <p className="page-text">
            you didn't deserve that, and <em>i'm really sorry</em>.
          </p>
          <div className="page-divider" />
          <p className="page-subtext">
            i hate that i made you upset. that's the last thing i ever want.
          </p>
        </div>
        <button className="next-btn" onClick={goNext}>continue</button>
      </div>

      {/* === PAGE 2: THINGS ABOUT YOU === */}
      <div className={`page ${currentPage === 2 ? 'active' : currentPage > 2 ? 'exiting' : ''}`}>
        <div className="page-inner">
          <p className="page-text" style={{ marginBottom: '28px' }}>
            things that make you, <em>you</em>
          </p>
          <ul className="things-list">
            {[
              "the way you absolutely destroy pani puri — like it's a sport",
              "how you can teach anyone anything and make it actually fun",
              "your roblox obsession that i secretly love",
              "the fact that you're the most generous person i know",
              "how you light up every room just by walking in",
            ].map((text, i) => (
              <li key={i} className="thing-item" style={{ animationDelay: `${0.4 + i * 0.15}s` }}>
                <span className="thing-dot" />
                <span className="thing-text">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <button className="next-btn" onClick={goNext}>continue</button>
      </div>

      {/* === PAGE 3: COMPLIMENTS === */}
      <div className={`page ${currentPage === 3 ? 'active' : currentPage > 3 ? 'exiting' : ''}`}>
        <div className="page-inner">
          <p className="page-text">
            honestly? you're probably the <em>cutest person</em> i've ever met.
          </p>
          <div className="page-divider" />
          <p className="page-text">
            smart. kind. funny. a fast food connoisseur. a roblox legend. a teacher people actually love.
          </p>
          <div className="page-divider" />
          <p className="page-text" style={{ color: 'var(--accent)' }}>
            you're kind of everything, bakawasss.
          </p>
        </div>
        <button className="next-btn" onClick={goNext}>continue</button>
      </div>

      {/* === PAGE 4: PROMISE === */}
      <div className={`page ${currentPage === 4 ? 'active' : currentPage > 4 ? 'exiting' : ''}`}>
        <div className="page-inner">
          <p className="page-text">
            i can't undo what happened.
          </p>
          <p className="page-text">
            but i can promise to <em>try harder</em>. to think before i act. to be someone who deserves to have you in their life.
          </p>
          <div className="page-divider" />
          <p className="page-text" style={{ fontSize: '1.2rem', color: 'var(--text-dim)' }}>
            because losing you is not something i'm okay with. ever.
          </p>
        </div>
        <button className="next-btn" onClick={goNext}>continue</button>
      </div>

      {/* === PAGE 5: FORGIVE === */}
      <div className={`page ${currentPage === 5 ? 'active' : currentPage > 5 ? 'exiting' : ''}`}>
        <div className="page-inner">
          <p className="page-text" style={{ marginBottom: '32px' }}>
            so... will you forgive me?
          </p>
          <div className="forgive-area">
            <button className="yes-button" onClick={handleForgive}>
              yes, i forgive you
            </button>
            <button
              className="no-button"
              onClick={handleNo}
              style={noPos}
            >
              {noText}
            </button>
          </div>
          {noCount > 2 && (
            <p className="forgive-hint">
              {noCount > 6 ? "okay i'll wait here forever if i have to" : "the no button seems to have a mind of its own"}
            </p>
          )}
        </div>
      </div>

      {/* === PAGE 6: FINAL === */}
      <div className={`page ${currentPage === 6 ? 'active' : ''}`}>
        <div className="final-hearts">
          {hearts.map(h => (
            <span
              key={h.id}
              className="final-heart"
              style={{
                left: `${h.left}%`,
                animationDelay: `${h.delay}s`,
                fontSize: `${h.size}px`,
              }}
            >
              ♥
            </span>
          ))}
        </div>
        <div className="page-inner" style={{ position: 'relative', zIndex: 2 }}>
          <img src={`${BASE}happy.png`} alt="" className="illustration" />
          <p className="page-text">
            <em>thank you</em>.
          </p>
          <p className="final-message">
            i'll be better. i promise.<br />
            you mean the world to me.
          </p>
          <p className="final-sign">— anurag</p>
        </div>
      </div>
    </div>
  )
}

export default App
