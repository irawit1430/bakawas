/* =============================================
   SORRY OBBY — Interactive Script
   ============================================= */

// --- Floating Hearts Background ---
(function createFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  const hearts = ['💖', '💗', '💕', '💓', '🩷', '♥️', '✨', '🌸'];
  
  for (let i = 0; i < 20; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (8 + Math.random() * 12) + 's';
    heart.style.animationDelay = (Math.random() * 10) + 's';
    heart.style.fontSize = (0.8 + Math.random() * 1) + 'rem';
    container.appendChild(heart);
  }
})();

// --- Progress Bar ---
const progressFill = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');
const levels = document.querySelectorAll('.level');

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.min((scrollTop / docHeight) * 100, 100);
  progressFill.style.width = progress + '%';

  // Determine current level
  let currentLevel = 1;
  levels.forEach((level, i) => {
    const rect = level.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.5) {
      currentLevel = i + 1;
    }
  });

  // Cap at level 4 when level 5 is hidden
  const level5 = document.getElementById('level5');
  const maxLevel = level5.style.display === 'none' ? 4 : 5;
  currentLevel = Math.min(currentLevel, maxLevel);
  progressLabel.textContent = `Level ${currentLevel}/${maxLevel}`;
}

// --- Scroll-triggered animations ---
function handleScrollAnimations() {
  // Level visibility
  levels.forEach((level) => {
    const rect = level.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      level.classList.add('in-view');
    }
  });

  // Compliment cards
  const cards = document.querySelectorAll('.compliment-card');
  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      const delay = parseInt(card.dataset.delay) || 0;
      setTimeout(() => card.classList.add('visible'), delay);
    }
  });
}

window.addEventListener('scroll', () => {
  updateProgress();
  handleScrollAnimations();
}, { passive: true });

// Initial call
updateProgress();
handleScrollAnimations();

// --- "No" Button Runaway ---
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const buttonArena = document.getElementById('buttonArena');
const healthFill = document.getElementById('healthFill');
const noHint = document.getElementById('noHint');

let noPressCount = 0;
const funnyTexts = [
  "Nope, try again! 😜",
  "Can't catch me! 🏃‍♂️",
  "Hehe, you missed! 😝",
  "Just press Yes already! 🥺",
  "I'll keep running! 🏃‍♀️💨",
  "You know you want to forgive me! 💖",
  "Stop being mean! 😭",
  "Anurag is crying rn 😢",
  "PLEASEEE 🥺🥺🥺",
  "Okay this is just rude 😤",
];

noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  noPressCount++;

  // Move button to random position within arena
  const arenaRect = buttonArena.getBoundingClientRect();
  const btnWidth = noBtn.offsetWidth;
  const btnHeight = noBtn.offsetHeight;
  
  const maxX = arenaRect.width - btnWidth;
  const maxY = Math.max(arenaRect.height - btnHeight, 120);
  
  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;
  
  noBtn.style.position = 'absolute';
  noBtn.style.left = randomX + 'px';
  noBtn.style.top = randomY + 'px';
  noBtn.style.transition = 'left 0.2s ease, top 0.2s ease';

  // Make no button smaller each time
  const scale = Math.max(0.5, 1 - noPressCount * 0.08);
  noBtn.style.transform = `scale(${scale})`;

  // Shrink health bar on each no click (it represents "hope" going down then being saved)
  const healthVal = Math.max(5, 30 - noPressCount * 3);
  healthFill.style.width = healthVal + '%';

  // Update no button text
  const textIdx = Math.min(noPressCount - 1, funnyTexts.length - 1);
  noBtn.textContent = funnyTexts[textIdx];

  // Make yes button grow
  const yesScale = 1 + noPressCount * 0.05;
  yesBtn.style.transform = `scale(${Math.min(yesScale, 1.3)})`;

  // Hint text
  if (noPressCount >= 3) {
    noHint.textContent = "the no button is scared of you 😂";
  }
  if (noPressCount >= 6) {
    noHint.textContent = "just give up and press yes 💖";
  }
  if (noPressCount >= 9) {
    noHint.textContent = "anurag is on his knees begging 🧎";
  }
});

// Also move on hover for desktop (and touch start for mobile)
noBtn.addEventListener('mouseenter', () => {
  if (noPressCount > 2) {
    const arenaRect = buttonArena.getBoundingClientRect();
    const maxX = arenaRect.width - noBtn.offsetWidth;
    const maxY = Math.max(arenaRect.height - noBtn.offsetHeight, 120);
    noBtn.style.left = Math.random() * maxX + 'px';
    noBtn.style.top = Math.random() * maxY + 'px';
  }
});

// --- "Yes" Button - Victory! ---
yesBtn.addEventListener('click', () => {
  // Show victory level
  const level5 = document.getElementById('level5');
  level5.style.display = 'flex';

  // Hide level 4 boss stuff
  document.getElementById('level4').style.display = 'none';

  // Health bar goes full!
  healthFill.style.width = '100%';
  healthFill.style.background = 'linear-gradient(90deg, #4ade80, #22c55e, #86efac)';

  // Scroll to victory
  setTimeout(() => {
    level5.scrollIntoView({ behavior: 'smooth' });
    level5.classList.add('in-view');
  }, 100);

  // Launch confetti!
  launchConfetti();
  
  // Update progress
  setTimeout(updateProgress, 500);
});

// --- Confetti ---
function launchConfetti() {
  const container = document.getElementById('confettiContainer');
  const colors = ['#ff8fab', '#c8b6ff', '#b8e0d2', '#ffd6a5', '#fdffb6', '#a0c4ff', '#ffd700', '#ff6b6b'];
  const shapes = ['square', 'circle'];
  
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = 6 + Math.random() * 10;
      
      piece.style.left = Math.random() * 100 + '%';
      piece.style.width = size + 'px';
      piece.style.height = size + 'px';
      piece.style.background = color;
      piece.style.borderRadius = shape === 'circle' ? '50%' : '2px';
      piece.style.animationDuration = (2 + Math.random() * 3) + 's';
      
      container.appendChild(piece);
      
      // Remove after animation
      setTimeout(() => piece.remove(), 5000);
    }, i * 30);
  }

  // Second wave
  setTimeout(() => {
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 6 + Math.random() * 10;
        
        piece.style.left = Math.random() * 100 + '%';
        piece.style.width = size + 'px';
        piece.style.height = size + 'px';
        piece.style.background = color;
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.animationDuration = (2 + Math.random() * 3) + 's';
        
        container.appendChild(piece);
        setTimeout(() => piece.remove(), 5000);
      }, i * 50);
    }
  }, 1500);
}
