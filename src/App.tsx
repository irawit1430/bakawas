import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Frown, Star, BookOpen, Sparkles, Gamepad2, Skull, Coins, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

const LEVELS = [
  { emoji: '🍟', speed: 4, time: 10, name: "Fast Food Warmup", bg: '#fdf2f8', ground: '#fbcfe8' },
  { emoji: '🍔', speed: 5, time: 12, name: "Burger Rush", bg: '#fffbeb', ground: '#fde68a' },
  { emoji: '💸', speed: 6, time: 15, name: "Rich Teacher Flex", bg: '#ecfdf5', ground: '#a7f3d0' },
  { emoji: '💎', speed: 7.5, time: 15, name: "Tuition Money", bg: '#eff6ff', ground: '#bfdbfe' },
  { emoji: '🧆', speed: 9, time: 20, name: "PANI PURI BOSS!", bg: '#faf5ff', ground: '#e9d5ff' }
];

const QuitOrDie = ({ onWin }: { onWin: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'LEVEL_UP' | 'GAME_OVER'>('START');
  const [deaths, setDeaths] = useState(0);
  const [score, setScore] = useState(0);
  const requestRef = useRef<number>();

  const state = useRef({
    playerY: 300,
    playerVy: 0,
    obstacles: [] as {x: number, w: number, h: number, passed: boolean}[],
    collectibles: [] as {x: number, y: number, collected: boolean, type: string}[],
    particles: [] as {x: number, y: number, vx: number, vy: number, life: number, color: string}[],
    trail: [] as {x: number, y: number}[],
    frames: 0,
    startTime: 0,
    lastObstacleFrame: 0,
    lastCollectibleFrame: 0,
    bgOffset: 0
  });

  const jump = () => {
    if (gameState !== 'PLAYING') return;
    if (state.current.playerY >= 300) {
      state.current.playerVy = -12.5; // Stronger jump
      createParticles(50, state.current.playerY + 20, '#f472b6', 5); // Jump dust
    }
  };

  const createParticles = (x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      state.current.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 1,
        color
      });
    }
  };

  const triggerLevelUpConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f472b6', '#fbbf24', '#60a5fa']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f472b6', '#fbbf24', '#60a5fa']
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const startGame = () => {
    state.current = {
      playerY: 300,
      playerVy: 0,
      obstacles: [],
      collectibles: [],
      particles: [],
      trail: [],
      frames: 0,
      startTime: Date.now(),
      lastObstacleFrame: 0,
      lastCollectibleFrame: 0,
      bgOffset: 0
    };
    setGameState('PLAYING');
    loop();
  };

  const loop = () => {
    if (!canvasRef.current || gameState === 'LEVEL_UP') return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const currentLevel = LEVELS[level - 1];
    const speed = currentLevel.speed;

    state.current.frames++;
    state.current.bgOffset = (state.current.bgOffset + speed * 0.5) % 40;
    
    // Physics
    state.current.playerVy += 0.7; // Gravity
    state.current.playerY += state.current.playerVy;

    if (state.current.playerY > 300) {
      if (state.current.playerVy > 5) {
        createParticles(50, 320, currentLevel.ground, 3); // Landing dust
      }
      state.current.playerY = 300;
      state.current.playerVy = 0;
    }

    // Trail
    if (state.current.frames % 3 === 0) {
      state.current.trail.push({ x: 50, y: state.current.playerY });
      if (state.current.trail.length > 8) state.current.trail.shift();
    }

    // Spawn obstacles
    const obstacleInterval = Math.max(40, 90 - level * 8); // Gets faster
    if (state.current.frames - state.current.lastObstacleFrame > obstacleInterval + Math.random() * 40) {
      state.current.obstacles.push({
        x: 300,
        w: 20 + Math.random() * 15,
        h: 25 + Math.random() * (15 + level * 5), // Taller obstacles in later levels
        passed: false
      });
      state.current.lastObstacleFrame = state.current.frames;
    }

    // Spawn collectibles (Coins/Gems)
    if (state.current.frames - state.current.lastCollectibleFrame > 100 + Math.random() * 100) {
      state.current.collectibles.push({
        x: 300,
        y: 200 + Math.random() * 60,
        collected: false,
        type: Math.random() > 0.8 ? '💎' : '🪙'
      });
      state.current.lastCollectibleFrame = state.current.frames;
    }

    const pX = 50;
    const pY = state.current.playerY;
    const pSize = 24;

    // Move and collide obstacles
    for (let i = state.current.obstacles.length - 1; i >= 0; i--) {
      const obs = state.current.obstacles[i];
      obs.x -= speed;

      // Hitbox logic
      if (
        pX < obs.x + obs.w - 5 &&
        pX + pSize > obs.x + 5 &&
        pY < 330 &&
        pY + pSize > 330 - obs.h
      ) {
        setGameState('GAME_OVER');
        setDeaths(d => d + 1);
        createParticles(pX, pY, '#ef4444', 30); // Death explosion
        return;
      }

      if (!obs.passed && obs.x < pX) {
        obs.passed = true;
        setScore(s => s + 10);
      }

      if (obs.x + obs.w < 0) state.current.obstacles.splice(i, 1);
    }

    // Move and collide collectibles
    for (let i = state.current.collectibles.length - 1; i >= 0; i--) {
      const col = state.current.collectibles[i];
      col.x -= speed;

      if (!col.collected && pX < col.x + 20 && pX + pSize > col.x && pY < col.y + 20 && pY + pSize > col.y) {
        col.collected = true;
        setScore(s => s + (col.type === '💎' ? 50 : 20));
        createParticles(col.x, col.y, '#fbbf24', 15);
      }

      if (col.x < -30 || col.collected) state.current.collectibles.splice(i, 1);
    }

    // Update particles
    for (let i = state.current.particles.length - 1; i >= 0; i--) {
      const p = state.current.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
      if (p.life <= 0) state.current.particles.splice(i, 1);
    }

    // Check Win Condition
    const elapsed = (Date.now() - state.current.startTime) / 1000;
    if (elapsed >= currentLevel.time) {
      if (level < LEVELS.length) {
        setGameState('LEVEL_UP');
        triggerLevelUpConfetti();
        setTimeout(() => {
          setLevel(l => l + 1);
          setGameState('START');
        }, 3000);
      } else {
        onWin();
      }
      return;
    }

    // --- DRAWING ---
    ctx.clearRect(0, 0, 300, 400);
    
    // Background
    ctx.fillStyle = currentLevel.bg;
    ctx.fillRect(0, 0, 300, 400);

    // Grid lines (Roblox obby vibe)
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 2;
    for(let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo((i * 40) - state.current.bgOffset, 0);
      ctx.lineTo((i * 40) - state.current.bgOffset, 400);
      ctx.stroke();
    }

    // Ground
    ctx.fillStyle = currentLevel.ground;
    ctx.fillRect(0, 330, 300, 70);
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0, 330, 300, 4);

    // Trail
    state.current.trail.forEach((t, i) => {
      ctx.globalAlpha = (i + 1) / 10;
      ctx.font = '20px Arial';
      ctx.fillText(currentLevel.emoji, t.x - 5, t.y + 28);
    });
    ctx.globalAlpha = 1.0;

    // Player
    ctx.font = '30px Arial';
    // Add a slight rotation when jumping
    ctx.save();
    ctx.translate(45 + 15, state.current.playerY + 15);
    ctx.rotate(state.current.playerVy * 0.02);
    ctx.fillText(currentLevel.emoji, -15, 13);
    ctx.restore();

    // Obstacles
    state.current.obstacles.forEach(obs => {
      ctx.fillStyle = '#ef4444';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ef4444';
      ctx.fillRect(obs.x, 330 - obs.h, obs.w, obs.h);
      ctx.fillStyle = '#fca5a5';
      ctx.fillRect(obs.x + 2, 330 - obs.h + 2, obs.w - 4, obs.h - 4);
      ctx.shadowBlur = 0;
    });

    // Collectibles
    ctx.font = '20px Arial';
    state.current.collectibles.forEach(col => {
      ctx.fillText(col.type, col.x, col.y + 20);
    });

    // Particles
    state.current.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // UI
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`Level ${level}: ${currentLevel.name}`, 10, 24);
    
    ctx.font = '14px sans-serif';
    ctx.fillText(`Time: ${Math.max(0, currentLevel.time - elapsed).toFixed(1)}s`, 10, 44);
    
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`Score: ${score}`, 200, 24);

    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      requestRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  return (
    <div className="flex flex-col items-center w-full max-w-sm">
      <h2 className="text-2xl font-bold text-red-500 mb-1 flex items-center gap-2">
        <Skull className="w-6 h-6" /> QUIT OR DIE <Skull className="w-6 h-6" />
      </h2>
      <p className="text-gray-600 mb-4 font-medium text-center">
        {level === 5 ? "FINAL BOSS: PANI PURI!" : "Rich Tuition Teacher Edition"}
      </p>
      
      <div 
        className="relative bg-white border-4 border-pink-300 rounded-xl overflow-hidden shadow-2xl w-[300px] h-[400px] cursor-pointer ring-4 ring-pink-100"
        onClick={jump}
      >
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={400} 
          className="block touch-none"
        />
        
        {gameState === 'START' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-6 text-center backdrop-blur-sm"
          >
            <motion.div 
              animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl mb-4 drop-shadow-lg"
            >
              {LEVELS[level - 1].emoji}
            </motion.div>
            <h3 className="text-2xl font-bold mb-1 text-pink-300">Level {level}</h3>
            <h4 className="text-lg font-semibold mb-4 text-white">{LEVELS[level - 1].name}</h4>
            <p className="mb-6 text-sm text-gray-200 bg-black/40 p-3 rounded-lg border border-white/10">
              Tap to jump. Dodge lasers.<br/>Collect 💎 for dopamine!<br/>Survive for {LEVELS[level-1].time}s.
            </p>
            <button 
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full font-bold hover:from-pink-600 hover:to-purple-600 active:scale-95 shadow-lg shadow-pink-500/50 transition-all border border-white/20"
            >
              PLAY NOW
            </button>
          </motion.div>
        )}

        {gameState === 'LEVEL_UP' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-gradient-to-br from-green-400/90 to-emerald-600/90 flex flex-col items-center justify-center text-white p-6 text-center backdrop-blur-md"
          >
            <Crown className="w-20 h-20 text-yellow-300 mb-4 drop-shadow-lg" />
            <h3 className="text-4xl font-black mb-2 tracking-wider drop-shadow-md">LEVEL CLEARED!</h3>
            <p className="text-xl font-bold text-green-100 mb-2">Score: {score}</p>
            <p className="text-md text-green-50 mt-4 animate-pulse">Get ready for the next one...</p>
          </motion.div>
        )}

        {gameState === 'GAME_OVER' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center text-white p-6 text-center backdrop-blur-sm"
          >
            <motion.h3 
              initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.6 }}
              className="text-5xl font-black mb-2 tracking-widest text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.8)]"
            >
              WASTED
            </motion.h3>
            <p className="mb-6 text-red-200 font-medium">
              {deaths === 1 ? "Even rich teachers fall sometimes." : 
               deaths === 2 ? "Come on, use that big brain!" : 
               "Pani Puri is waiting for you... try again!"}
            </p>
            <button 
              onClick={(e) => { e.stopPropagation(); startGame(); }}
              className="px-8 py-3 bg-white text-red-600 rounded-full font-bold hover:bg-gray-100 active:scale-95 mb-4 shadow-lg shadow-white/20 transition-all"
            >
              RESPAWN
            </button>
            {deaths >= 3 && (
              <button 
                onClick={(e) => { e.stopPropagation(); onWin(); }}
                className="text-sm text-red-300 underline mt-4 opacity-80 hover:opacity-100 transition-opacity"
              >
                Skip game (I'm too noob 🥺)
              </button>
            )}
          </motion.div>
        )}
      </div>
      <div className="flex justify-between w-[300px] mt-4 px-2">
        <p className="text-sm text-gray-500 font-medium animate-pulse">👆 Tap to jump!</p>
        <p className="text-sm text-pink-500 font-bold flex items-center gap-1"><Coins className="w-4 h-4"/> {score}</p>
      </div>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [hug, setHug] = useState(false);

  const handleNoHover = () => {
    const x = Math.random() * 160 - 80;
    const y = Math.random() * 160 - 80;
    setNoPosition({ x, y });
  };

  const nextStep = () => setStep((s) => s + 1);

  const handleYesClick = () => {
    nextStep();
    triggerConfetti();
  };

  const triggerHug = () => {
    setHug(true);
    setTimeout(() => setHug(false), 3000);
  };

  const triggerConfetti = () => {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6 overflow-hidden relative font-sans text-gray-800 selection:bg-pink-200">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center flex flex-col items-center max-w-sm"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <BookOpen className="w-16 h-16 text-pink-400 mb-6" />
            </motion.div>
            <h1 className="text-3xl font-bold text-pink-600 mb-4 tracking-tight">Dearest Bakawasss,</h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              The most amazing (and richest 💰) tuition teacher, and an even better friend...
            </p>
            <button
              onClick={nextStep}
              className="px-8 py-3 bg-pink-400 text-white rounded-full font-semibold shadow-lg shadow-pink-200 hover:bg-pink-500 active:scale-95 transition-all flex items-center gap-2"
            >
              Next <Sparkles className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center flex flex-col items-center max-w-sm"
          >
            <motion.div
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Frown className="w-20 h-20 text-blue-400 mb-6" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">I know I messed up...</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              And I am really, really sorry! 🥺<br />
              <span className="text-sm text-gray-500 mt-2 block">I promise to be a better student and friend.</span>
            </p>
            <button
              onClick={nextStep}
              className="px-8 py-3 bg-blue-400 text-white rounded-full font-semibold shadow-lg shadow-blue-200 hover:bg-blue-500 active:scale-95 transition-all"
            >
              See my question...
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center flex flex-col items-center max-w-sm"
          >
            <Gamepad2 className="w-20 h-20 text-indigo-500 mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Wait a minute...</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Before I ask for your forgiveness, you must prove your skills in a game of <strong>Quit or Die</strong>! 😈<br/>
              <span className="text-sm text-indigo-400 mt-2 block font-medium">Beat all 5 levels to unlock my apology!</span>
            </p>
            <button
              onClick={nextStep}
              className="px-8 py-3 bg-indigo-500 text-white rounded-full font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-600 active:scale-95 transition-all"
            >
              Bring it on!
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex justify-center"
          >
            <QuitOrDie onWin={nextStep} />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center flex flex-col items-center w-full max-w-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.6 }}
            >
              <Crown className="w-24 h-24 text-yellow-500 mb-6 drop-shadow-xl" />
            </motion.div>
            <h2 className="text-3xl font-bold text-pink-500 mb-4">You beat the game!</h2>
            <p className="text-gray-600 mb-12 font-medium">Okay, okay, you are the true Roblox master. Now...</p>
            <h2 className="text-3xl font-bold text-pink-600 mb-12">Will you forgive me?</h2>
            <div className="flex items-center justify-center relative w-full h-32">
              <button
                onClick={handleYesClick}
                className="px-8 py-3 bg-green-400 text-white rounded-full font-bold text-xl shadow-lg shadow-green-200 hover:bg-green-500 active:scale-95 transition-all z-10 absolute left-8"
              >
                YES!
              </button>
              <motion.button
                onHoverStart={handleNoHover}
                onTouchStart={handleNoHover}
                onClick={handleNoHover}
                animate={{ x: noPosition.x, y: noPosition.y }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="px-8 py-3 bg-red-400 text-white rounded-full font-bold text-xl shadow-lg shadow-red-200 absolute right-8"
              >
                No
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="text-center flex flex-col items-center max-w-sm z-10"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Heart className="w-24 h-24 text-pink-500 mb-6 fill-pink-500 drop-shadow-lg" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-pink-600 mb-4"
            >
              YAYYY! 🎉
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-700 mb-2 font-medium"
            >
              Thank you, Bakawasss!
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg text-gray-600 mb-6"
            >
              You truly are the best teacher ever! 🍎
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
              className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-pink-100 mb-6"
            >
              <p className="text-md text-gray-600 font-medium italic">
                "A good teacher can inspire hope, ignite the imagination, and instill a love of learning... and also forgive silly friends."
              </p>
              <p className="text-md text-pink-500 mt-4 font-bold">
                With lots of love,<br />Anurag ❤️
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              onClick={triggerHug}
              className="px-8 py-4 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-full font-bold shadow-xl shadow-pink-300 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-lg border-2 border-white/50"
            >
              Give Anurag a Hug 🫂
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hug Animation Overlay */}
      <AnimatePresence>
        {hug && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-pink-100/80 backdrop-blur-sm pointer-events-none"
          >
            <div className="relative w-full max-w-sm h-64 flex items-center justify-center">
              <motion.div
                initial={{ x: -200, opacity: 0, rotate: -20 }}
                animate={{ x: -20, opacity: 1, rotate: 0 }}
                exit={{ x: -200, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="text-7xl absolute z-10 drop-shadow-xl"
              >
                👦🏽
              </motion.div>
              <motion.div
                initial={{ x: 200, opacity: 0, rotate: 20 }}
                animate={{ x: 20, opacity: 1, rotate: 0 }}
                exit={{ x: 200, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="text-7xl absolute z-10 drop-shadow-xl"
              >
                👩🏻‍🏫
              </motion.div>
              
              <motion.div
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: [0, 1.5, 1.2, 0], opacity: [0, 1, 1, 0], y: -50 }}
                transition={{ delay: 0.6, duration: 2 }}
                className="absolute z-20"
              >
                <Heart className="w-32 h-32 text-red-500 fill-red-500 drop-shadow-2xl" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti / Stars for the final step */}
      {step === 5 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(24)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                top: "100%",
                left: `${Math.random() * 100}%`,
                opacity: 1,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                top: "-10%",
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear",
              }}
            >
              {i % 2 === 0 ? (
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ) : (
                <Heart className="w-5 h-5 text-pink-300 fill-pink-300" />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
