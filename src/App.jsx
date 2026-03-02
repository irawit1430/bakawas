import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import FloatingHearts from './components/FloatingHearts'
import ProgressBar from './components/ProgressBar'
import Level1Oopsie from './components/Level1Oopsie'
import Level2Sorry from './components/Level2Sorry'
import Level3PaniPuri from './components/Level3PaniPuri'
import Level4FastFood from './components/Level4FastFood'
import Level5Teacher from './components/Level5Teacher'
import Level6Compliments from './components/Level6Compliments'
import Level7RichQueen from './components/Level7RichQueen'
import Level8BossBattle from './components/Level8BossBattle'
import Level9Victory from './components/Level9Victory'

const TOTAL_LEVELS = 9

function App() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [showVictory, setShowVictory] = useState(false)
  const [paniPuriScore, setPaniPuriScore] = useState(0)
  const [fastFoodScore, setFastFoodScore] = useState(0)
  const [starsCollected, setStarsCollected] = useState(0)
  const [diamondsCollected, setDiamondsCollected] = useState(0)
  const levelRefs = useRef([])

  const handleScroll = useCallback(() => {
    const viewportMid = window.innerHeight * 0.5
    let current = 1
    levelRefs.current.forEach((ref, i) => {
      if (ref) {
        const rect = ref.getBoundingClientRect()
        if (rect.top < viewportMid) current = i + 1
      }
    })
    if (!showVictory) {
      setCurrentLevel(Math.min(current, 8))
    }
  }, [showVictory])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      { threshold: 0.15 }
    )
    levelRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })
    return () => observer.disconnect()
  }, [showVictory])

  const handleVictory = () => {
    setShowVictory(true)
    setCurrentLevel(9)
    setTimeout(() => {
      const el = document.getElementById('victory')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const setLevelRef = (index) => (el) => {
    levelRefs.current[index] = el
  }

  const scrollProgress = showVictory ? 100 : ((currentLevel - 1) / (TOTAL_LEVELS - 1)) * 100

  return (
    <>
      <FloatingHearts />
      <ProgressBar progress={scrollProgress} level={currentLevel} total={showVictory ? 9 : 8} />
      <Level1Oopsie ref={setLevelRef(0)} />
      <Level2Sorry ref={setLevelRef(1)} />
      <Level3PaniPuri ref={setLevelRef(2)} score={paniPuriScore} setScore={setPaniPuriScore} />
      <Level4FastFood ref={setLevelRef(3)} score={fastFoodScore} setScore={setFastFoodScore} />
      <Level5Teacher ref={setLevelRef(4)} stars={starsCollected} setStars={setStarsCollected} />
      <Level6Compliments ref={setLevelRef(5)} />
      <Level7RichQueen ref={setLevelRef(6)} diamonds={diamondsCollected} setDiamonds={setDiamondsCollected} />
      <Level8BossBattle ref={setLevelRef(7)} onVictory={handleVictory} />
      {showVictory && (
        <Level9Victory
          ref={setLevelRef(8)}
          paniPuri={paniPuriScore}
          fastFood={fastFoodScore}
          stars={starsCollected}
          diamonds={diamondsCollected}
        />
      )}
    </>
  )
}

export default App
