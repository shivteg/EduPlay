// ==========================================================================
// EduPlay Premium Educational Game Engine (Vanilla JS)
// ==========================================================================

const STORAGE_KEY = "eduplay-premium-state-v3";
const LEADERBOARD_KEY = "eduplay-premium-leaderboard-v3";

// Levels Definitions (10 Progressively Harder Educational Themes)
const LEVEL_DEFINITIONS = [
  { id: 1, name: "Stellar Summit", skill: "Addition", accent: "#00e5ff", description: "Quick addition climbing missions." },
  { id: 2, name: "Submarine Depths", skill: "Subtraction", accent: "#ff4785", description: "Subsea subtraction navigation." },
  { id: 3, name: "Mystic Woods", skill: "Multiplication", accent: "#ffc82c", description: "Forest multiplication quests." },
  { id: 4, name: "Canyon Cross", skill: "Division", accent: "#4ade80", description: "Dividing canyon paths safely." },
  { id: 5, name: "Coral Reef", skill: "Fractions", accent: "#a855f7", description: "Splitting treasures under the sea." },
  { id: 6, name: "Chrono Castle", skill: "Time", accent: "#f97316", description: "Telling time inside ancient castles." },
  { id: 7, name: "Prism Peak", skill: "Shapes", accent: "#ec4899", description: "Geometry peaks and shape sides." },
  { id: 8, name: "Pattern Plains", skill: "Patterns", accent: "#06b6d4", description: "Cracking sequence code trails." },
  { id: 9, name: "Sphinx Temple", skill: "Word Problems", accent: "#eab308", description: "Decoding ancient math text riddles." },
  { id: 10, name: "Cosmo Fortress", skill: "Final Boss Battle", accent: "#ef4444", description: "Epic mixed order of operations duel!" }
];

// Cosmetic shop list
const COSMETICS_SHOP = [
  { id: "frame-gold", name: "Gold Swirl Frame", type: "frame", cost: 100, asset: "frame-gold", description: "A shiny golden frame for your avatar." },
  { id: "frame-neon", name: "Neon Wave Frame", type: "frame", cost: 150, asset: "frame-neon", description: "A flashing neon boundary frame." },
  { id: "title-space", name: "Space Explorer Title", type: "title", cost: 80, asset: "Space Explorer", description: "Display a space-themed title." },
  { id: "title-wizard", name: "Math Wizard Title", type: "title", cost: 120, asset: "Math Wizard", description: "Show off a wizardly coding title." }
];

// Boost items shop list
const BOOSTS_SHOP = [
  { id: "hint-pass", name: "Hint Pass", cost: 20, description: "Reveal the explanation of the question." },
  { id: "time-burst", name: "Time Burst", cost: 35, description: "Add 5 extra seconds to the countdown." },
  { id: "shield", name: "Shield", cost: 40, description: "Block 1 wrong answer (prevents life loss)." },
  { id: "skip-pass", name: "Skip Pass", cost: 30, description: "Skip a tough question with no penalty." }
];

// Audio State
let audioContext = null;
let masterGain = null;
let musicGain = null;
let fxGain = null;
let musicOscillators = [];
let musicSequenceId = null;

// Game Play State
let state = loadState();
let currentQuestion = null;
let timer = 12;
let lives = 3;
let score = 0;
let round = 1;
let combo = 0;
let lastAnswerCorrect = false;
let isPaused = false;
let countdownHandle = null;
let ttsEnabled = false;

// DOM Element Registry
const els = {
  setupOverlay: document.getElementById("setupOverlay"),
  setupPlayerName: document.getElementById("setupPlayerName"),
  setupAvatarGrid: document.getElementById("setupAvatarGrid"),
  setupColorGrid: document.getElementById("setupColorGrid"),
  setupSaveBtn: document.getElementById("setupSaveBtn"),
  
  treasureDialog: document.getElementById("treasureDialog"),
  chestIcon: document.getElementById("chestIcon"),
  chestPrize: document.getElementById("chestPrize"),
  closeTreasureBtn: document.getElementById("closeTreasureBtn"),
  
  ttsToggle: document.getElementById("ttsToggle"),
  musicToggle: document.getElementById("musicToggle"),
  themeToggle: document.getElementById("themeToggle"),
  helpButton: document.getElementById("helpButton"),
  creditsButton: document.getElementById("creditsButton"),
  helpDialog: document.getElementById("helpDialog"),
  creditsDialog: document.getElementById("creditsDialog"),
  
  playerNameDisplay: document.getElementById("playerNameDisplay"),
  playerTitleDisplay: document.getElementById("playerTitleDisplay"),
  heroAvatarDisplay: document.getElementById("heroAvatarDisplay"),
  
  heroLevel: document.getElementById("heroLevel"),
  heroCoins: document.getElementById("heroCoins"),
  heroXP: document.getElementById("heroXP"),
  heroBest: document.getElementById("heroBest"),
  streakValue: document.getElementById("streakValue"),
  dailyBadge: document.getElementById("dailyBadge"),
  
  statusText: document.getElementById("statusText"),
  overallProgressText: document.getElementById("overallProgressText"),
  overallProgressBar: document.getElementById("overallProgressBar"),
  worldProgressText: document.getElementById("worldProgressText"),
  correctValue: document.getElementById("correctValue"),
  livesValue: document.getElementById("livesValue"),
  
  spinWheelBtn: document.getElementById("spinWheelBtn"),
  wheelGraphic: document.getElementById("wheelGraphic"),
  wheelResult: document.getElementById("wheelResult"),
  levelsMap: document.getElementById("levelsMap"),
  
  missionStatus: document.getElementById("missionStatus"),
  worldBadge: document.getElementById("worldBadge"),
  levelBadge: document.getElementById("levelBadge"),
  bossBadge: document.getElementById("bossBadge"),
  
  scoreValue: document.getElementById("scoreValue"),
  timerValue: document.getElementById("timerValue"),
  livesValueInline: document.getElementById("livesValueInline"),
  roundValue: document.getElementById("roundValue"),
  worldProgressTextInline: document.getElementById("worldProgressTextInline"),
  worldProgressBar: document.getElementById("worldProgressBar"),
  
  questionMeta: document.getElementById("questionMeta"),
  questionText: document.getElementById("questionText"),
  options: document.getElementById("options"),
  feedback: document.getElementById("feedback"),
  startGameButton: document.getElementById("startGameButton"),
  hintButton: document.getElementById("hintButton"),
  skipQuestionButton: document.getElementById("skipQuestionButton"),
  pauseGameButton: document.getElementById("pauseGameButton"),
  
  pauseOverlay: document.getElementById("pauseOverlay"),
  resumeGameButton: document.getElementById("resumeGameButton"),
  
  cosmeticsInventory: document.getElementById("cosmeticsInventory"),
  inventoryList: document.getElementById("inventoryList"),
  achievementList: document.getElementById("achievementList"),
  
  shopList: document.getElementById("shopList"),
  statsList: document.getElementById("statsList"),
  leaderboardList: document.getElementById("leaderboardList"),
  
  playerName: document.getElementById("playerName"),
  difficultySelect: document.getElementById("difficultySelect"),
  musicVolumeSlider: document.getElementById("musicVolumeSlider"),
  fxVolumeSlider: document.getElementById("fxVolumeSlider"),
  soundToggle: document.getElementById("soundToggle"),
  resetProgressBtn: document.getElementById("resetProgressBtn"),
  
  openHelpDialog: document.getElementById("openHelpDialog"),
  openCreditsDialog: document.getElementById("openCreditsDialog"),
  startHeroButton: document.getElementById("startHeroButton"),
  viewStatsButton: document.getElementById("viewStatsButton"),
  unlockOverlay: document.getElementById("unlockOverlay"),
  celebrationLayer: document.getElementById("celebrationLayer")
};

// Selection cache for character creator
let selectedAvatar = "🧒";
let selectedColor = "#00e5ff";

// ==========================================================================
// 1. Audio Synth Engine (Web Audio API)
// ==========================================================================

function initAudio() {
  if (audioContext) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  
  audioContext = new AudioContextClass();
  masterGain = audioContext.createGain();
  masterGain.gain.value = 1.0;
  masterGain.connect(audioContext.destination);
  
  musicGain = audioContext.createGain();
  musicGain.gain.value = (state.musicEnabled ? (parseInt(els.musicVolumeSlider.value) / 100) * 0.05 : 0);
  musicGain.connect(masterGain);
  
  fxGain = audioContext.createGain();
  fxGain.gain.value = (state.soundEnabled ? (parseInt(els.fxVolumeSlider.value) / 100) * 0.25 : 0);
  fxGain.connect(masterGain);
  
  if (state.musicEnabled) {
    startMusic();
  }
}

function playFX(type) {
  if (!audioContext) initAudio();
  if (!audioContext || !state.soundEnabled) return;
  
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(fxGain);
  
  const now = audioContext.currentTime;
  
  if (type === "click") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === "success") {
    osc.type = "triangle";
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.35);
  } else if (type === "fail") {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.25);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.start(now);
    osc.stop(now + 0.25);
  } else if (type === "levelUp") {
    // Joyful melody
    const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
    notes.forEach((freq, idx) => {
      const o = audioContext.createOscillator();
      const g = audioContext.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(freq, now + idx * 0.075);
      g.gain.setValueAtTime(0.35, now + idx * 0.075);
      g.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.075 + 0.15);
      o.connect(g);
      g.connect(fxGain);
      o.start(now + idx * 0.075);
      o.stop(now + idx * 0.075 + 0.15);
    });
  } else if (type === "wheel") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(880, now + 0.05);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.start(now);
    osc.stop(now + 0.08);
  }
}

function startMusic() {
  if (!audioContext) initAudio();
  if (!audioContext) return;
  
  if (musicSequenceId) return; // Already running
  
  const notes = [
    261.63, 329.63, 392.00, 329.63, // C Major
    293.66, 349.23, 440.00, 349.23, // F Major
    329.63, 392.00, 493.88, 392.00, // G Major
    261.63, 349.23, 392.00, 523.25  // C Ending
  ];
  
  let noteIndex = 0;
  const tempo = 350; // ms per note
  
  const playNext = () => {
    if (!state.musicEnabled || !audioContext) return;
    
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const oscGain = audioContext.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(notes[noteIndex % notes.length], now);
    
    oscGain.gain.setValueAtTime(0.12, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    
    osc.connect(oscGain);
    oscGain.connect(musicGain);
    
    osc.start(now);
    osc.stop(now + 0.33);
    
    noteIndex += 1;
  };
  
  musicSequenceId = setInterval(playNext, tempo);
}

function stopMusic() {
  if (musicSequenceId) {
    clearInterval(musicSequenceId);
    musicSequenceId = null;
  }
}

// ==========================================================================
// 2. Intelligent Math Question Generator (10 Skill-levels)
// ==========================================================================

function generateQuestion(levelIndex, difficulty) {
  let prompt = "";
  let answer = 0;
  let options = [];
  let explanation = "";
  
  // Calculate range multipliers based on settings difficulty
  let min = 1, max = 10;
  if (difficulty === "medium") { min = 5; max = 30; }
  else if (difficulty === "hard") { min = 10; max = 100; }
  
  const rand = (start, end) => Math.floor(Math.random() * (end - start + 1)) + start;
  
  switch (levelIndex) {
    case 0: { // Level 1: Addition
      const a = rand(min, max);
      const b = rand(min, max);
      prompt = `What is ${a} + ${b}?`;
      answer = a + b;
      explanation = `${a} plus ${b} makes ${answer}.`;
      break;
    }
    case 1: { // Level 2: Subtraction
      const a = rand(min, max + 10);
      const b = rand(min, a);
      prompt = `What is ${a} - ${b}?`;
      answer = a - b;
      explanation = `${a} minus ${b} leaves ${answer}.`;
      break;
    }
    case 2: { // Level 3: Multiplication
      const maxMult = difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : 20;
      const a = rand(1, maxMult);
      const b = rand(1, 10);
      prompt = `What is ${a} × ${b}?`;
      answer = a * b;
      explanation = `${a} times ${b} is equal to ${answer}.`;
      break;
    }
    case 3: { // Level 4: Division
      const divisor = rand(1, 10);
      const quotient = rand(1, difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : 20);
      const dividend = divisor * quotient;
      prompt = `What is ${dividend} ÷ ${divisor}?`;
      answer = quotient;
      explanation = `${dividend} divided by ${divisor} is equal to ${answer}.`;
      break;
    }
    case 4: { // Level 5: Fractions
      const denominator = rand(3, 8);
      const numerator = rand(1, denominator - 1);
      const multiplier = rand(2, 3);
      const multNum = numerator * multiplier;
      const multDen = denominator * multiplier;
      
      prompt = `Which fraction is equivalent to ${numerator}/${denominator}?`;
      answer = `${multNum}/${multDen}`;
      explanation = `If you multiply both top and bottom of ${numerator}/${denominator} by ${multiplier}, you get ${multNum}/${multDen}.`;
      
      // We will handle options as strings for fractions
      options.push(answer);
      while (options.length < 4) {
        const fakeD = rand(4, 20);
        const fakeN = rand(1, fakeD - 1);
        const fake = `${fakeN}/${fakeD}`;
        if (!options.includes(fake) && fake !== `${numerator}/${denominator}`) {
          options.push(fake);
        }
      }
      break;
    }
    case 5: { // Level 6: Time
      const hours = rand(1, 5);
      if (Math.random() > 0.5) {
        prompt = `How many minutes are in ${hours} hours?`;
        answer = hours * 60;
        explanation = `Since there are 60 minutes in 1 hour, ${hours} hours equals ${hours} × 60 = ${answer} minutes.`;
      } else {
        const startH = rand(1, 10);
        const startM = rand(0, 3) * 15;
        const addMinutes = rand(2, 6) * 15;
        let endM = startM + addMinutes;
        let endH = startH;
        if (endM >= 60) {
          endH += Math.floor(endM / 60);
          endM = endM % 60;
        }
        if (endH > 12) endH -= 12;
        
        prompt = `If a movie starts at ${startH}:${startM.toString().padStart(2, "0")} and lasts ${addMinutes} minutes, what time does it finish?`;
        answer = `${endH}:${endM.toString().padStart(2, "0")}`;
        explanation = `${addMinutes} minutes added to ${startH}:${startM.toString().padStart(2, "0")} completes at ${answer}.`;
        
        options.push(answer);
        while (options.length < 4) {
          const fakeH = rand(1, 12);
          const fakeM = rand(0, 3) * 15;
          const fake = `${fakeH}:${fakeM.toString().padStart(2, "0")}`;
          if (!options.includes(fake)) options.push(fake);
        }
      }
      break;
    }
    case 6: { // Level 7: Shapes
      const shapes = [
        { name: "triangle", sides: 3 },
        { name: "quadrilateral", sides: 4 },
        { name: "pentagon", sides: 5 },
        { name: "hexagon", sides: 6 },
        { name: "heptagon", sides: 7 },
        { name: "octagon", sides: 8 }
      ];
      const target = shapes[rand(0, shapes.length - 1)];
      prompt = `How many flat sides does a ${target.name} have?`;
      answer = target.sides;
      explanation = `A ${target.name} has exactly ${answer} sides.`;
      break;
    }
    case 7: { // Level 8: Patterns
      const start = rand(1, 10);
      const step = rand(2, 6);
      const seq = [start, start + step, start + 2 * step, start + 3 * step];
      prompt = `What number completes the pattern: ${seq.join(", ")}, ?`;
      answer = start + 4 * step;
      explanation = `The pattern increases by adding ${step} each step: ${seq[3]} + ${step} = ${answer}.`;
      break;
    }
    case 8: { // Level 9: Word Problems
      const names = ["Leo", "Sophia", "Oliver", "Emma"];
      const items = ["marbles", "stamps", "cards", "stickers"];
      const name = names[rand(0, names.length - 1)];
      const item = items[rand(0, items.length - 1)];
      const total = rand(15, 30);
      const given = rand(5, 12);
      
      prompt = `${name} had ${total} ${item} in a box. They gave ${given} to their friend. How many do they have left?`;
      answer = total - given;
      explanation = `This is a subtraction: ${total} minus ${given} leaves ${answer} ${item}.`;
      break;
    }
    case 9: { // Level 10: Final Boss Battle (Mixed PEMDAS)
      const a = rand(2, 6);
      const b = rand(2, 6);
      const c = rand(1, 10);
      prompt = `Boss Challenge: Solve (${a} × ${b}) + ${c}`;
      answer = (a * b) + c;
      explanation = `First multiply inside the brackets: ${a} × ${b} = ${a * b}. Then add ${c}: ${a * b} + ${c} = ${answer}.`;
      break;
    }
  }

  // If options were not custom added, generate them numerically
  if (options.length === 0) {
    options.push(answer);
    while (options.length < 4) {
      const isNum = typeof answer === "number";
      const offset = rand(-10, 10);
      let fake = isNum ? answer + offset : answer;
      if (isNum && fake <= 0) fake = answer + rand(1, 10);
      if (!options.includes(fake) && fake !== answer) {
        options.push(fake);
      }
    }
  }

  // Shuffle options
  options.sort(() => Math.random() - 0.5);

  return {
    prompt,
    answerIndex: options.indexOf(answer),
    options,
    explanation
  };
}

// ==========================================================================
// 3. Local Storage & Player Profile Onboarding State
// ==========================================================================

function createDefaultState() {
  return {
    setupCompleted: false,
    playerName: "Learner",
    playerAvatar: "🧒",
    playerColor: "#00e5ff",
    equippedFrame: null,
    equippedTitle: null,
    
    coins: 0,
    xp: 0,
    level: 1,
    bestScore: 0,
    completedLevels: [],
    correctCount: 0,
    streak: 0,
    inventory: {
      "hint-pass": 1,
      "time-burst": 0,
      "shield": 0,
      "skip-pass": 0
    },
    ownedCosmetics: [],
    
    // Statistics counters
    stats: {
      gamesPlayed: 0,
      questionsAnswered: 0,
      accuracy: 0,
      fastestTime: 99,
      averageTimeSum: 0,
      totalCoinsEarned: 0
    },
    
    // Setting toggles
    musicVolume: 70,
    fxVolume: 80,
    soundEnabled: true,
    musicEnabled: true,
    theme: "light",
    
    currentLevelIndex: 0,
    currentLevelQuestionIndex: 0,
    dailySpinTimestamp: null
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw);
    const defaults = createDefaultState();
    return { ...defaults, ...parsed };
  } catch (e) {
    console.error("Local storage load failed:", e);
    return createDefaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Local storage save failed:", e);
  }
}

// ==========================================================================
// 4. Onboarding, UI, Themes, & Profile Layout updates
// ==========================================================================

function checkOnboarding() {
  if (!state.setupCompleted) {
    els.setupOverlay.hidden = false;
    setupCreatorEvents();
  } else {
    els.setupOverlay.hidden = true;
    applyColorTheme(state.playerColor);
    applyTheme(state.theme);
  }
}

function setupCreatorEvents() {
  // Avatar selection
  const avButtons = els.setupOverlay.querySelectorAll(".avatar-btn");
  avButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      avButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedAvatar = btn.getAttribute("data-avatar");
      playFX("click");
    });
  });

  // Color selection
  const colButtons = els.setupOverlay.querySelectorAll(".color-btn");
  colButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      colButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedColor = btn.getAttribute("data-color");
      applyColorTheme(selectedColor);
      playFX("click");
    });
  });

  els.setupSaveBtn.addEventListener("click", () => {
    const nameInput = els.setupPlayerName.value.trim();
    if (!nameInput) {
      alert("Please enter a name first!");
      return;
    }
    
    state.playerName = nameInput;
    state.playerAvatar = selectedAvatar;
    state.playerColor = selectedColor;
    state.setupCompleted = true;
    state.coins = 50; // Welcome coins bonus
    state.stats.totalCoinsEarned = 50;
    saveState();
    
    els.setupOverlay.hidden = true;
    playFX("levelUp");
    initializeSettings();
    renderAll();
  });
}

function applyColorTheme(color) {
  document.documentElement.style.setProperty("--accent", color);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  els.themeToggle.checked = theme === "dark";
  state.theme = theme;
  saveState();
}

// Render dynamic elements
function renderProfile() {
  els.playerNameDisplay.textContent = state.playerName;
  els.playerName.value = state.playerName;
  
  // Render Equipped Title
  if (state.equippedTitle) {
    els.playerTitleDisplay.textContent = state.equippedTitle;
    els.playerTitleDisplay.style.display = "block";
  } else {
    els.playerTitleDisplay.style.display = "none";
  }

  // Render Avatar and Equipped Border Frame
  els.heroAvatarDisplay.textContent = state.playerAvatar;
  els.heroAvatarDisplay.className = "player-avatar";
  if (state.equippedFrame) {
    els.heroAvatarDisplay.classList.add(state.equippedFrame);
  }
}

// ==========================================================================
// 5. Level pathways & Map drawing
// ==========================================================================

function drawLevelsMap() {
  els.levelsMap.innerHTML = "";
  LEVEL_DEFINITIONS.forEach((lvl, idx) => {
    const isCompleted = state.completedLevels.includes(lvl.id);
    const isUnlocked = idx === 0 || state.completedLevels.includes(LEVEL_DEFINITIONS[idx - 1].id);
    const isActive = idx === state.currentLevelIndex;
    
    const node = document.createElement("div");
    node.className = "level-node";
    if (isCompleted) node.classList.add("completed");
    if (isUnlocked) node.classList.add("unlocked");
    else node.classList.add("locked");
    if (isActive) node.classList.add("active-node");
    
    node.innerHTML = `
      <div class="node-num">${lvl.id}</div>
      <div class="node-label">${lvl.name}</div>
      <div style="font-size:0.6rem; color:var(--muted); font-weight:800; margin-top:0.2rem;">${lvl.skill}</div>
    `;
    
    if (isUnlocked) {
      node.addEventListener("click", () => {
        playFX("click");
        selectActiveLevel(idx);
      });
    }
    
    els.levelsMap.appendChild(node);
  });
}

function selectActiveLevel(index) {
  state.currentLevelIndex = index;
  state.currentLevelQuestionIndex = 0;
  saveState();
  
  const lvl = LEVEL_DEFINITIONS[index];
  els.missionStatus.textContent = `${lvl.name}`;
  els.worldBadge.textContent = `${lvl.name}`;
  els.levelBadge.textContent = `${lvl.skill}`;
  els.bossBadge.textContent = index === 9 ? "Yes" : "No";
  
  setStatus(`Selected level: ${lvl.name}. Click 'Start Level' to play!`, "success");
  
  renderProgress();
  drawLevelsMap();
}

function setStatus(text, tone = "default") {
  els.statusText.textContent = text;
  els.statusText.style.background = tone === "success"
    ? "rgba(94, 227, 200, 0.18)"
    : tone === "danger"
      ? "rgba(255, 107, 127, 0.18)"
      : "rgba(94, 227, 200, 0.16)";
}

// ==========================================================================
// 6. Audio controls settings handlers
// ==========================================================================

function updateVolumeSettings() {
  state.musicVolume = parseInt(els.musicVolumeSlider.value);
  state.fxVolume = parseInt(els.fxVolumeSlider.value);
  saveState();
  
  if (musicGain && state.musicEnabled) {
    musicGain.gain.setValueAtTime((state.musicVolume / 100) * 0.05, audioContext.currentTime);
  }
  if (fxGain && state.soundEnabled) {
    fxGain.gain.setValueAtTime((state.fxVolume / 100) * 0.25, audioContext.currentTime);
  }
}

// ==========================================================================
// 7. Lucky Wheel (Daily Spin Reward)
// ==========================================================================

let isSpinning = false;
function spinLuckyWheel() {
  if (isSpinning) return;
  
  const now = new Date().toDateString();
  if (state.dailySpinTimestamp === now) {
    els.wheelResult.textContent = "You already spun the wheel today! Come back tomorrow.";
    setStatus("Daily spin limit reached.", "danger");
    return;
  }
  
  isSpinning = true;
  els.spinWheelBtn.disabled = true;
  playFX("wheel");
  
  const randomDeg = Math.floor(Math.random() * 360) + 1440; // At least 4 full rotations
  els.wheelGraphic.style.transform = `rotate(${randomDeg}deg)`;
  
  const prizeSlices = [
    { text: "15 Coins 🪙", reward: () => addCoins(15) },
    { text: "Free Hint Pass 💡", reward: () => addBoost("hint-pass", 1) },
    { text: "30 Coins 🪙", reward: () => addCoins(30) },
    { text: "Free Skip Pass ⏭️", reward: () => addBoost("skip-pass", 1) },
    { text: "Free Shield 🛡️", reward: () => addBoost("shield", 1) },
    { text: "50 Coins! 🪙", reward: () => addCoins(50) },
    { text: "Free Time Burst ⏱️", reward: () => addBoost("time-burst", 1) },
    { text: "Double Spin Prize! 🪙", reward: () => addCoins(25) }
  ];
  
  const finalDegree = randomDeg % 360;
  const sliceIndex = Math.floor((360 - finalDegree) / 45) % 8;
  
  setTimeout(() => {
    const prize = prizeSlices[sliceIndex];
    prize.reward();
    playFX("success");
    
    els.wheelResult.textContent = `Congrats! You won a ${prize.text}!`;
    state.dailySpinTimestamp = now;
    saveState();
    
    isSpinning = false;
    els.spinWheelBtn.disabled = false;
    renderAll();
  }, 4100);
}

function addCoins(amount) {
  state.coins += amount;
  state.stats.totalCoinsEarned += amount;
  saveState();
  spawnReward(`+${amount} 🪙`);
}

function addBoost(id, qty) {
  state.inventory[id] = (state.inventory[id] || 0) + qty;
  saveState();
}

// ==========================================================================
// 8. Main Game Quest Progression & Active Level Loop
// ==========================================================================

function startLevel() {
  if (state.currentLevelQuestionIndex === 10) {
    state.currentLevelQuestionIndex = 0;
  }
  
  lives = 3;
  score = 0;
  round = state.currentLevelQuestionIndex + 1;
  isPaused = false;
  els.pauseOverlay.classList.remove("active");
  
  setStatus(`Level started! Complete 10 questions to unlock the next level.`, "success");
  
  state.stats.gamesPlayed += 1;
  saveState();
  
  startRoundQuestion();
}

function startRoundQuestion() {
  if (lives <= 0) {
    endLevelFail();
    return;
  }
  
  if (state.currentLevelQuestionIndex >= 10) {
    endLevelSuccess();
    return;
  }
  
  round = state.currentLevelQuestionIndex + 1;
  timer = 12; // Standard seconds per answer
  lastAnswerCorrect = false;
  
  // Generate a brand new truly random question
  currentQuestion = generateQuestion(state.currentLevelIndex, state.difficulty);
  
  // Update HUD values
  els.roundValue.textContent = `${round}/10`;
  els.timerValue.textContent = timer;
  els.livesValueInline.textContent = lives;
  els.scoreValue.textContent = score;
  
  els.questionMeta.textContent = `Question ${round} of 10 · ${state.difficulty}`;
  els.questionText.textContent = currentQuestion.prompt;
  
  // TTS Narration (Narrator voice accessibility feature)
  if (ttsEnabled) {
    speakText(currentQuestion.prompt);
  }
  
  els.feedback.textContent = "";
  els.options.innerHTML = "";
  
  currentQuestion.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => handleAnswerSubmit(idx));
    els.options.appendChild(btn);
  });
  
  els.startGameButton.style.display = "none";
  
  clearInterval(countdownHandle);
  startTimerLoop();
  renderProgress();
}

function startTimerLoop() {
  countdownHandle = setInterval(() => {
    if (isPaused) return; // Freeze timer if paused
    
    timer -= 1;
    els.timerValue.textContent = timer;
    
    if (timer <= 0) {
      clearInterval(countdownHandle);
      handleQuestionTimeout();
    }
  }, 1000);
}

function handleAnswerSubmit(selectedIndex) {
  if (isPaused) return;
  clearInterval(countdownHandle);
  
  const buttons = els.options.querySelectorAll(".option-btn");
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === currentQuestion.answerIndex) {
      btn.classList.add("correct");
    } else if (idx === selectedIndex) {
      btn.classList.add("wrong");
    }
  });

  state.stats.questionsAnswered += 1;
  const answerTime = 12 - timer;
  state.stats.averageTimeSum += answerTime;
  if (answerTime < state.stats.fastestTime && selectedIndex === currentQuestion.answerIndex) {
    state.stats.fastestTime = answerTime;
  }
  
  if (selectedIndex === currentQuestion.answerIndex) {
    // Correct Answer
    playFX("success");
    lastAnswerCorrect = true;
    state.correctCount += 1;
    state.streak += 1;
    combo = state.streak;
    
    // Base score points
    let points = 10;
    
    // Difficulty modifier
    if (state.difficulty === "medium") points += 5;
    else if (state.difficulty === "hard") points += 10;
    
    // Combo multiplier bonus
    if (combo >= 5) points += 10;
    else if (combo >= 3) points += 5;
    
    // Quick Speed Timer bonus
    if (timer >= 9) {
      points += 5;
      triggerAchievement("Speed Demon");
    }
    
    score += points;
    
    // Add coins
    const coinsWon = state.currentLevelIndex === 9 ? 10 : 5; // Double coins for Boss level
    addCoins(coinsWon);
    
    // Gain XP
    const xpWon = 15;
    state.xp += xpWon;
    checkLevelUp();
    
    els.feedback.textContent = `Correct! ${currentQuestion.explanation}`;
    setStatus("Great job! Proceeding to next round.", "success");
    
    state.currentLevelQuestionIndex += 1;
    saveState();
    
    setTimeout(() => {
      startRoundQuestion();
    }, 1500);
    
  } else {
    // Incorrect Answer
    // Check if player has an active Shield to block life loss
    if (state.inventory["shield"] > 0) {
      state.inventory["shield"] -= 1;
      saveState();
      playFX("success");
      els.feedback.textContent = `Incorrect, but your Shield blocked the damage! Correct: ${currentQuestion.options[currentQuestion.answerIndex]}`;
      setStatus("Shield blocked life loss!", "success");
      renderInventory();
    } else {
      playFX("fail");
      lives -= 1;
      state.streak = 0;
      combo = 0;
      els.feedback.textContent = `Oops! Correct answer is: ${currentQuestion.options[currentQuestion.answerIndex]}`;
      setStatus("That answer was incorrect.", "danger");
    }
    
    state.currentLevelQuestionIndex += 1;
    saveState();
    
    setTimeout(() => {
      startRoundQuestion();
    }, 1800);
  }
  
  saveState();
  renderAll();
}

function handleQuestionTimeout() {
  if (state.inventory["shield"] > 0) {
    state.inventory["shield"] -= 1;
    saveState();
    playFX("success");
    setStatus("Shield blocked time out damage!", "success");
    renderInventory();
  } else {
    playFX("fail");
    lives -= 1;
    state.streak = 0;
    combo = 0;
    setStatus("Time expired! You lost 1 life.", "danger");
  }
  
  state.currentLevelQuestionIndex += 1;
  saveState();
  
  setTimeout(() => {
    startRoundQuestion();
  }, 1500);
  
  renderAll();
}

function skipQuestion() {
  if (state.inventory["skip-pass"] <= 0) {
    setStatus("You do not own any Skip Passes. Purchase one in the Shop!", "danger");
    return;
  }
  
  state.inventory["skip-pass"] -= 1;
  saveState();
  playFX("click");
  setStatus("Question skipped!", "success");
  
  state.currentLevelQuestionIndex += 1;
  saveState();
  
  startRoundQuestion();
  renderAll();
}

function toggleGamePause() {
  isPaused = !isPaused;
  if (isPaused) {
    els.pauseOverlay.classList.add("active");
    els.pauseGameButton.textContent = "Resume ▶️";
  } else {
    els.pauseOverlay.classList.remove("active");
    els.pauseGameButton.textContent = "Pause ⏸️";
  }
}

// Handlers for active Level Completions
function endLevelSuccess() {
  clearInterval(countdownHandle);
  playFX("levelUp");
  
  // Award Completion Level ID to array
  const levelId = LEVEL_DEFINITIONS[state.currentLevelIndex].id;
  if (!state.completedLevels.includes(levelId)) {
    state.completedLevels.push(levelId);
  }
  
  // Set Next active level
  if (state.currentLevelIndex < 9) {
    state.currentLevelIndex += 1;
    showLevelUnlockBanner(LEVEL_DEFINITIONS[state.currentLevelIndex].name);
  }
  state.currentLevelQuestionIndex = 0;
  saveState();
  
  // Open Victory Chest Modal!
  showVictoryChest();
  
  els.startGameButton.style.display = "inline-block";
  setStatus(`Congratulations! You cleared the level!`, "success");
  renderAll();
}

function endLevelFail() {
  clearInterval(countdownHandle);
  playFX("fail");
  
  // Save highscore if valid
  saveHighScore(score);
  
  state.currentLevelQuestionIndex = 0;
  saveState();
  
  els.startGameButton.style.display = "inline-block";
  setStatus(`Game over! You ran out of lives. Try again!`, "danger");
  renderAll();
}

// Victory Chest mini-game logic
function showVictoryChest() {
  els.treasureDialog.showModal();
  els.chestIcon.className = "chest-icon";
  els.chestIcon.textContent = "🎁";
  els.chestPrize.textContent = "";
  els.chestPrize.classList.remove("visible");
  els.closeTreasureBtn.style.display = "none";
}

els.chestIcon.addEventListener("click", () => {
  if (els.chestIcon.classList.contains("opened")) return;
  
  els.chestIcon.classList.add("opened");
  els.chestIcon.textContent = "🔓🎁";
  playFX("levelUp");
  
  const coinPrize = Math.floor(Math.random() * 41) + 10; // 10 to 50 coins
  addCoins(coinPrize);
  
  els.chestPrize.textContent = `+${coinPrize} Coins! 🪙`;
  els.chestPrize.classList.add("visible");
  els.closeTreasureBtn.style.display = "inline-block";
});

els.closeTreasureBtn.addEventListener("click", () => {
  els.treasureDialog.close();
  renderAll();
});

// High Score database
function saveHighScore(finalScore) {
  if (finalScore <= 0) return;
  
  try {
    let leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
    const dateStr = new Date().toLocaleDateString();
    
    leaderboard.push({ name: state.playerName, score: finalScore, date: dateStr });
    // Sort descending
    leaderboard.sort((a, b) => b.score - a.score);
    // Keep top 10
    leaderboard = leaderboard.slice(0, 10);
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  } catch (e) {
    console.warn("Leaderboard save failed:", e);
  }
}

// Level Up checks
function checkLevelUp() {
  const nextLvl = Math.floor(state.xp / 100) + 1;
  if (nextLvl > state.level) {
    state.level = nextLvl;
    playFX("levelUp");
    setStatus(`Profile Level Up! You are now level ${state.level}!`, "success");
    triggerAchievement("Level Up");
  }
}

// Achievement logic
function triggerAchievement(title) {
  const achievementsList = {
    "Stellar Starter": "Complete Level 1",
    "Combo Master": "Reach a 5-question streak",
    "Thrifty Scholar": "Save 100 coins",
    "Speed Demon": "Answer a question in under 3 seconds",
    "Boss Slayer": "Defeat the Final Boss (Level 10)",
    "Level Up": "Reach player level 3",
    "Cosmetic Collector": "Own a cosmetic item"
  };
  
  if (!state.ownedCosmetics.includes(title) && achievementsList[title]) {
    // Push achievement badge
    state.ownedCosmetics.push(title);
    saveState();
    showCelebration(title);
    playFX("levelUp");
  }
}

function showLevelUnlockBanner(name) {
  els.unlockOverlay.hidden = false;
  els.unlockOverlay.classList.add("is-visible");
  els.unlockOverlay.innerHTML = `
    <div class="unlock-card">
      <p class="eyebrow">Level unlocked</p>
      <h3>${name}</h3>
      <p>A new learning segment has been added to your map pathway!</p>
    </div>
  `;
  setTimeout(() => {
    els.unlockOverlay.classList.remove("is-visible");
    els.unlockOverlay.hidden = true;
  }, 2200);
}

function showCelebration(badgeName) {
  els.celebrationLayer.innerHTML = "";
  const colors = ["#00e5ff", "#ff4785", "#ffc82c", "#4ade80"];
  
  for (let i = 0; i < 35; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.top = `-10px`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.3}s`;
    els.celebrationLayer.appendChild(piece);
  }
  
  spawnReward(`Unlocked: ${badgeName}! 🏆`);
  setTimeout(() => {
    els.celebrationLayer.innerHTML = "";
  }, 1800);
}

function spawnReward(text) {
  const pop = document.createElement("div");
  pop.className = "reward-pop";
  pop.textContent = text;
  pop.style.left = `50vw`;
  pop.style.top = `40vh`;
  pop.style.transform = `translate(-50%, -50%)`;
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 1200);
}

// Speech synthesis narrations
function speakText(text) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = state.fxVolume / 100;
    window.speechSynthesis.speak(utterance);
  }
}

// ==========================================================================
// 9. Cosmetic Shop & Inventory Dressing Room
// ==========================================================================

function handleCosmeticBuy(id) {
  const item = COSMETICS_SHOP.find(x => x.id === id);
  if (!item) return;
  
  if (state.coins < item.cost) {
    setStatus("Not enough coins!", "danger");
    return;
  }
  
  state.coins -= item.cost;
  state.ownedCosmetics.push(item.id);
  saveState();
  
  playFX("success");
  setStatus(`Purchased: ${item.name}! Check 'My Wardrobe' to equip it.`, "success");
  
  triggerAchievement("Cosmetic Collector");
  renderAll();
}

function handleBoostBuy(id) {
  const item = BOOSTS_SHOP.find(x => x.id === id);
  if (!item) return;
  
  if (state.coins < item.cost) {
    setStatus("Not enough coins!", "danger");
    return;
  }
  
  state.coins -= item.cost;
  state.inventory[item.id] = (state.inventory[item.id] || 0) + 1;
  saveState();
  
  playFX("success");
  setStatus(`Purchased: ${item.name}! Booster ready.`, "success");
  
  renderAll();
}

function equipCosmetic(id) {
  const item = COSMETICS_SHOP.find(x => x.id === id);
  if (!item) return;
  
  if (item.type === "frame") {
    state.equippedFrame = (state.equippedFrame === item.asset) ? null : item.asset;
  } else if (item.type === "title") {
    state.equippedTitle = (state.equippedTitle === item.asset) ? null : item.asset;
  }
  
  saveState();
  playFX("click");
  renderAll();
}

// Render inventory items
function renderInventory() {
  els.inventoryList.innerHTML = "";
  BOOSTS_SHOP.forEach(boost => {
    const qty = state.inventory[boost.id] || 0;
    const li = document.createElement("li");
    li.className = "inventory-item";
    li.innerHTML = `<span><strong>${boost.name}</strong></span> <strong>Qty: ${qty}</strong>`;
    els.inventoryList.appendChild(li);
  });
  
  // Render cosmetics wardrobe
  els.cosmeticsInventory.innerHTML = "";
  const owned = COSMETICS_SHOP.filter(x => state.ownedCosmetics.includes(x.id));
  
  if (owned.length === 0) {
    els.cosmeticsInventory.innerHTML = `<p style="font-size:0.85rem; color:var(--muted); grid-column: 1 / -1;">No wardrobe items owned yet.</p>`;
  } else {
    owned.forEach(cos => {
      const isEquipped = (cos.type === "frame" && state.equippedFrame === cos.asset) ||
                         (cos.type === "title" && state.equippedTitle === cos.asset);
      const card = document.createElement("div");
      card.className = `cosmetic-card ${isEquipped ? "equipped" : ""}`;
      card.innerHTML = `
        <h5>${cos.name}</h5>
        <button class="button secondary" type="button">${isEquipped ? "Unequip" : "Equip"}</button>
      `;
      card.querySelector("button").addEventListener("click", () => equipCosmetic(cos.id));
      els.cosmeticsInventory.appendChild(card);
    });
  }
}

// Render achievements panel
function renderAchievements() {
  els.achievementList.innerHTML = "";
  const list = [
    { title: "Stellar Starter", desc: "Complete Level 1" },
    { title: "Combo Master", desc: "Reach a 5-question streak" },
    { title: "Thrifty Scholar", desc: "Save 100 coins" },
    { title: "Speed Demon", desc: "Answer in under 3 seconds" },
    { title: "Boss Slayer", desc: "Defeat Final Level 10" },
    { title: "Level Up", desc: "Reach player level 3" },
    { title: "Cosmetic Collector", desc: "Own a wardrobe frame/title" }
  ];
  
  list.forEach(badge => {
    const isUnlocked = state.ownedCosmetics.includes(badge.title);
    const li = document.createElement("li");
    li.className = "inventory-item";
    li.style.opacity = isUnlocked ? "1" : "0.45";
    li.innerHTML = `<span><strong>${isUnlocked ? "🏆" : "🔒"} ${badge.title}</strong><br><small>${badge.desc}</small></span>`;
    els.achievementList.appendChild(li);
  });
}

// Render shop
function renderShop() {
  els.shopList.innerHTML = "";
  
  // Powerups Shop
  BOOSTS_SHOP.forEach(boost => {
    const li = document.createElement("li");
    li.className = "shop-item";
    li.innerHTML = `
      <span><strong>${boost.name}</strong><br><small>${boost.description}</small></span>
      <button class="button secondary shop-item-btn" type="button">Buy · ${boost.cost} 🪙</button>
    `;
    li.querySelector("button").addEventListener("click", () => handleBoostBuy(boost.id));
    els.shopList.appendChild(li);
  });
  
  // Cosmetics Shop
  COSMETICS_SHOP.forEach(cos => {
    const isOwned = state.ownedCosmetics.includes(cos.id);
    const li = document.createElement("li");
    li.className = "shop-item";
    li.innerHTML = `
      <span><strong>${cos.name}</strong><br><small>${cos.description}</small></span>
      <button class="button secondary shop-item-btn" type="button" ${isOwned ? "disabled" : ""}>
        ${isOwned ? "Owned" : `Buy · ${cos.cost} 🪙`}
      </button>
    `;
    if (!isOwned) {
      li.querySelector("button").addEventListener("click", () => handleCosmeticBuy(cos.id));
    }
    els.shopList.appendChild(li);
  });
}

// ==========================================================================
// 10. Statistics & Leaderboards rendering
// ==========================================================================

function renderStats() {
  els.statsList.innerHTML = "";
  
  const total = state.stats.questionsAnswered;
  const accuracyVal = total > 0 ? Math.round((state.correctCount / total) * 100) : 0;
  const avgTimeVal = total > 0 ? Math.round(state.stats.averageTimeSum / total) : 0;
  
  const rows = [
    { label: "Games Played", val: state.stats.gamesPlayed },
    { label: "Questions Answered", val: total },
    { label: "Answer Accuracy", val: `${accuracyVal}%` },
    { label: "Fastest Response", val: `${state.stats.fastestTime === 99 ? "-" : state.stats.fastestTime}s` },
    { label: "Average Response", val: `${avgTimeVal}s` },
    { label: "Total Coins Won", val: state.stats.totalCoinsEarned }
  ];
  
  rows.forEach(r => {
    const li = document.createElement("li");
    li.className = "stat-item";
    li.innerHTML = `<span>${r.label}</span><strong>${r.val}</strong>`;
    els.statsList.appendChild(li);
  });
}

function renderLeaderboard() {
  els.leaderboardList.innerHTML = "";
  const list = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [
    { name: "ApexSolver", score: 250, date: "07/10/2026" },
    { name: "MathHero", score: 180, date: "07/11/2026" },
    { name: "PixelKid", score: 120, date: "07/12/2026" }
  ];
  
  list.forEach((entry, idx) => {
    const li = document.createElement("li");
    li.className = "leaderboard-item";
    li.innerHTML = `<span>#${idx + 1} ${entry.name} <small style="font-size:0.7rem; color:var(--muted)">(${entry.date})</small></span><strong>${entry.score}</strong>`;
    els.leaderboardList.appendChild(li);
  });
}

// Render dynamic HUD and dashboard panel progress bars
function renderProgress() {
  const totalLevels = LEVEL_DEFINITIONS.length;
  const progressPercent = Math.round((state.completedLevels.length / totalLevels) * 100);
  
  els.overallProgressText.textContent = `${progressPercent}%`;
  els.overallProgressBar.style.width = `${progressPercent}%`;
  els.worldProgressText.textContent = `${progressPercent}%`;
  
  const currentLvlQuestionIndex = state.currentLevelQuestionIndex;
  const levelPercent = Math.round((currentLvlQuestionIndex / 10) * 100);
  els.worldProgressTextInline.textContent = `${levelPercent}%`;
  els.worldProgressBar.style.width = `${levelPercent}%`;
  
  els.heroLevel.textContent = state.level;
  els.heroCoins.textContent = state.coins;
  els.heroXP.textContent = state.xp;
  els.heroBest.textContent = state.bestScore;
  els.streakValue.textContent = state.streak;
  els.correctValue.textContent = state.correctCount;
  els.livesValue.textContent = lives;
  
  // Award badges
  els.dailyBadge.textContent = state.streak >= 5 ? "Combo Master" : "Active";
  
  // Save best score to player metadata
  if (score > state.bestScore) {
    state.bestScore = score;
    saveState();
  }
  
  renderProfile();
}

// Helper hints
function revealHint() {
  if (!currentQuestion) {
    setStatus("Select a level and start first to get hints!", "danger");
    return;
  }
  
  if (state.inventory["hint-pass"] <= 0) {
    setStatus("You do not own any Hint Passes. Purchase one in the Shop!", "danger");
    return;
  }
  
  state.inventory["hint-pass"] -= 1;
  saveState();
  playFX("click");
  
  els.feedback.textContent = `💡 Hint: ${currentQuestion.explanation}`;
  renderInventory();
}

// Settings initialization
function initializeSettings() {
  els.playerName.value = state.playerName;
  els.difficultySelect.value = state.difficulty;
  els.soundToggle.checked = state.soundEnabled;
  els.musicToggle.setAttribute("aria-pressed", String(state.musicEnabled));
  
  // Themes sync
  applyColorTheme(state.playerColor);
  applyTheme(state.theme);
}

function handleSettingsFormChange(e) {
  const target = e.target;
  if (target.id === "playerName") {
    state.playerName = target.value.trim() || "Learner";
  } else if (target.id === "difficultySelect") {
    state.difficulty = target.value;
  } else if (target.id === "soundToggle") {
    state.soundEnabled = target.checked;
    if (fxGain) {
      fxGain.gain.setValueAtTime(state.soundEnabled ? (state.fxVolume / 100) * 0.25 : 0, audioContext ? audioContext.currentTime : 0);
    }
  }
  saveState();
  renderAll();
}

function toggleMusicPref() {
  state.musicEnabled = !state.musicEnabled;
  saveState();
  
  els.musicToggle.setAttribute("aria-pressed", String(state.musicEnabled));
  
  if (state.musicEnabled) {
    startMusic();
    if (musicGain && audioContext) {
      musicGain.gain.setValueAtTime((state.musicVolume / 100) * 0.05, audioContext.currentTime);
    }
  } else {
    stopMusic();
    if (musicGain && audioContext) {
      musicGain.gain.setValueAtTime(0, audioContext.currentTime);
    }
  }
}

// Reset operations
function resetAllProgress() {
  const confirmFirst = confirm("Are you absolutely sure you want to reset ALL your progress? This deletes your profile, levels, and coins.");
  if (!confirmFirst) return;
  const confirmSecond = confirm("Double Check: This CANNOT be undone. Proceed?");
  if (!confirmSecond) return;
  
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEADERBOARD_KEY);
  
  state = createDefaultState();
  saveState();
  
  playFX("fail");
  window.location.reload();
}

// Rendering dispatcher
function renderAll() {
  renderProfile();
  drawLevelsMap();
  renderProgress();
  renderInventory();
  renderAchievements();
  renderShop();
  renderStats();
  renderLeaderboard();
}

// Setup Event Listeners
function bindEvents() {
  // TTS Narration button
  els.ttsToggle.addEventListener("click", () => {
    ttsEnabled = !ttsEnabled;
    els.ttsToggle.setAttribute("aria-pressed", String(ttsEnabled));
    els.ttsToggle.textContent = ttsEnabled ? "🔊 Voice On" : "🔊 Voice Off";
    els.ttsToggle.classList.toggle("active", ttsEnabled);
    playFX("click");
  });

  els.musicToggle.addEventListener("click", () => {
    toggleMusicPref();
    playFX("click");
  });
  
  els.themeToggle.addEventListener("change", (e) => {
    applyTheme(e.target.checked ? "dark" : "light");
    playFX("click");
  });

  els.helpButton.addEventListener("click", () => els.helpDialog.showModal());
  els.creditsButton.addEventListener("click", () => els.creditsDialog.showModal());
  els.openHelpDialog.addEventListener("click", () => els.helpDialog.showModal());
  els.openCreditsDialog.addEventListener("click", () => els.creditsDialog.showModal());
  
  els.startHeroButton.addEventListener("click", () => {
    els.levelsMap.scrollIntoView({ behavior: "smooth" });
    playFX("click");
  });
  els.viewStatsButton.addEventListener("click", () => {
    document.querySelector(".info-grid").scrollIntoView({ behavior: "smooth" });
    playFX("click");
  });

  // Game action triggers
  els.startGameButton.addEventListener("click", () => {
    startLevel();
    playFX("click");
  });
  els.hintButton.addEventListener("click", () => {
    revealHint();
  });
  els.skipQuestionButton.addEventListener("click", () => {
    skipQuestion();
  });
  els.pauseGameButton.addEventListener("click", () => {
    toggleGamePause();
    playFX("click");
  });
  els.resumeGameButton.addEventListener("click", () => {
    toggleGamePause();
    playFX("click");
  });

  // Lucky wheel trigger
  els.spinWheelBtn.addEventListener("click", () => {
    spinLuckyWheel();
  });

  // Settings inputs
  els.settingsForm.addEventListener("input", handleSettingsFormChange);
  els.musicVolumeSlider.addEventListener("input", updateVolumeSettings);
  els.fxVolumeSlider.addEventListener("input", updateVolumeSettings);
  els.resetProgressBtn.addEventListener("click", resetAllProgress);

  // Close dialog on escape keys
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      els.helpDialog.close();
      els.creditsDialog.close();
      els.treasureDialog.close();
    }
  });

  // Setup click-to-activate Audio Context gesture unlock
  const unlockAudio = () => {
    initAudio();
    document.removeEventListener("click", unlockAudio);
    document.removeEventListener("keydown", unlockAudio);
  };
  document.addEventListener("click", unlockAudio);
  document.addEventListener("keydown", unlockAudio);
}

// Initializer
function initialize() {
  checkOnboarding();
  initializeSettings();
  renderAll();
  bindEvents();
  
  // Set default active level on map
  selectActiveLevel(state.currentLevelIndex);
}

initialize();
