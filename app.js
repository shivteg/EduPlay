const STORAGE_KEY = "eduplay-state-v2";

const MODE_DEFINITIONS = [
  { id: "math", label: "Math", emoji: "➗", description: "Quick arithmetic challenges" },
  { id: "science", label: "Science", emoji: "🔬", description: "Curious facts and experiments" },
  { id: "geography", label: "Geography", emoji: "🌍", description: "Places, flags, and capitals" },
  { id: "logic", label: "Logic", emoji: "🧠", description: "Patterns and reasoning" },
];

const WORLDS = [
  {
    id: "stellar",
    name: "Stellar Sprint",
    emoji: "🌟",
    mode: "math",
    accent: "#ff8f6b",
    description: "Bright stars and speedy number missions.",
    questions: [
      { prompt: "What is 7 × 8?", options: ["54", "56", "58", "60"], answer: 1, explanation: "Seven times eight equals fifty-six." },
      { prompt: "What is 81 ÷ 9?", options: ["7", "8", "9", "10"], answer: 2, explanation: "Eighty-one divided by nine is nine." },
      { prompt: "Which number is prime?", options: ["21", "25", "29", "33"], answer: 2, explanation: "Twenty-nine has no divisors other than one and itself." },
      { prompt: "What is 12 + 15?", options: ["24", "25", "26", "27"], answer: 2, explanation: "Twelve plus fifteen is twenty-seven." },
      { prompt: "Which fraction is equal to one-half?", options: ["1/3", "2/4", "3/4", "4/5"], answer: 1, explanation: "Two-fourths simplifies to one-half." },
      { prompt: "What is 9 × 4?", options: ["32", "34", "36", "38"], answer: 2, explanation: "Nine times four is thirty-six." },
      { prompt: "What is 50 - 17?", options: ["31", "32", "33", "34"], answer: 2, explanation: "Fifty minus seventeen equals thirty-three." },
      { prompt: "What is 6 × 6?", options: ["32", "34", "36", "38"], answer: 2, explanation: "Six times six is thirty-six." },
      { prompt: "What is 100 ÷ 5?", options: ["15", "18", "20", "25"], answer: 2, explanation: "One hundred divided by five is twenty." },
      { prompt: "Boss challenge: Solve 14 + 8 × 2.", options: ["28", "30", "32", "34"], answer: 2, explanation: "Multiply first, then add: 8 × 2 = 16, plus 14 = 30." },
    ],
  },
  {
    id: "ocean",
    name: "Ocean Quest",
    emoji: "🌊",
    mode: "science",
    accent: "#42b8ff",
    description: "Spark curiosity with science discoveries.",
    questions: [
      { prompt: "What planet is known as the Red Planet?", options: ["Venus", "Mars", "Mercury", "Jupiter"], answer: 1, explanation: "Mars has a reddish appearance due to iron oxide." },
      { prompt: "What gas do plants absorb from the air?", options: ["Oxygen", "Hydrogen", "Carbon dioxide", "Nitrogen"], answer: 2, explanation: "Plants use carbon dioxide during photosynthesis." },
      { prompt: "What force keeps us on the ground?", options: ["Magnetism", "Friction", "Gravity", "Light"], answer: 2, explanation: "Gravity pulls us toward Earth." },
      { prompt: "What do bees collect from flowers?", options: ["Sand", "Honey", "Water", "Pollen"], answer: 3, explanation: "Bees collect pollen, which helps plants reproduce." },
      { prompt: "Which body part pumps blood?", options: ["Lungs", "Heart", "Brain", "Stomach"], answer: 1, explanation: "The heart pumps blood around the body." },
      { prompt: "What do plants need to make food?", options: ["Moonlight", "Sunlight", "Snow", "Smoke"], answer: 1, explanation: "Plants use sunlight to make food through photosynthesis." },
      { prompt: "What is the name of the closest star to Earth?", options: ["Mars", "The Moon", "The Sun", "Pluto"], answer: 2, explanation: "The Sun is the closest star to Earth." },
      { prompt: "What do we breathe in?", options: ["Oxygen", "Helium", "Carbon", "Gold"], answer: 0, explanation: "We breathe in oxygen." },
      { prompt: "Which part of a plant absorbs water?", options: ["Stem", "Leaves", "Roots", "Flowers"], answer: 2, explanation: "Roots absorb water from the soil." },
      { prompt: "Boss challenge: Which part of the cell contains DNA?", options: ["Cytoplasm", "Nucleus", "Membrane", "Vacuole"], answer: 1, explanation: "The nucleus holds the cell's DNA." },
    ],
  },
  {
    id: "jungle",
    name: "Jungle Journey",
    emoji: "🌴",
    mode: "geography",
    accent: "#8adf6a",
    description: "Travel the world and learn new places.",
    questions: [
      { prompt: "What is the capital of Japan?", options: ["Seoul", "Beijing", "Tokyo", "Osaka"], answer: 2, explanation: "Tokyo is the capital city of Japan." },
      { prompt: "Which ocean is the largest?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3, explanation: "The Pacific Ocean is the largest and deepest ocean." },
      { prompt: "Which country has the Nile River?", options: ["Egypt", "Brazil", "Canada", "India"], answer: 0, explanation: "The Nile River flows through Egypt and several other countries." },
      { prompt: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], answer: 2, explanation: "Canberra is the capital of Australia." },
      { prompt: "Which continent is the Sahara in?", options: ["Asia", "Africa", "Europe", "South America"], answer: 1, explanation: "The Sahara Desert is in Africa." },
      { prompt: "What is the largest country by area?", options: ["Canada", "Russia", "China", "USA"], answer: 1, explanation: "Russia is the largest country by area." },
      { prompt: "What is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: 1, explanation: "The Nile is often called the longest river in the world." },
      { prompt: "Which city is called the City of Lights?", options: ["Rome", "Paris", "Berlin", "Madrid"], answer: 1, explanation: "Paris is often called the City of Lights." },
      { prompt: "Which country is famous for the Andes mountains?", options: ["Brazil", "Chile", "Argentina", "Peru"], answer: 3, explanation: "The Andes are in Peru and several other South American countries." },
      { prompt: "Boss challenge: Which country is home to the Great Barrier Reef?", options: ["South Africa", "Australia", "Mexico", "India"], answer: 1, explanation: "The Great Barrier Reef is off the coast of Australia." },
    ],
  },
  {
    id: "cosmo",
    name: "Cosmo Logic",
    emoji: "🚀",
    mode: "logic",
    accent: "#ff79c6",
    description: "Puzzle your way through clever pattern challenges.",
    questions: [
      { prompt: "Which comes next: 2, 4, 8, 16, ?", options: ["18", "24", "32", "40"], answer: 2, explanation: "Each number doubles." },
      { prompt: "If all bloops are blips and some blips are blups, which is true?", options: ["All bloops are blups", "Some bloops are blups", "No bloops are blups", "All blups are bloops"], answer: 1, explanation: "The statement allows some overlap, not certainty for all." },
      { prompt: "Find the odd one out: circle, square, triangle, apple", options: ["Circle", "Square", "Triangle", "Apple"], answer: 3, explanation: "Apple is not a shape." },
      { prompt: "Which shape has three sides?", options: ["Circle", "Square", "Triangle", "Rectangle"], answer: 2, explanation: "A triangle has three sides." },
      { prompt: "Complete the pattern: red, blue, red, blue, ?", options: ["Green", "Red", "Yellow", "Blue"], answer: 1, explanation: "The pattern alternates red and blue." },
      { prompt: "What comes next: 10, 8, 6, 4, ?", options: ["2", "3", "5", "7"], answer: 0, explanation: "The numbers decrease by two each time." },
      { prompt: "Which word is the odd one out: cat, dog, fish, moon?", options: ["Cat", "Dog", "Fish", "Moon"], answer: 3, explanation: "Moon is not an animal." },
      { prompt: "Which number is missing: 3, 6, 9, ?, 15", options: ["10", "11", "12", "13"], answer: 2, explanation: "The numbers increase by three each time." },
      { prompt: "If a triangle has three sides, how many sides does a hexagon have?", options: ["4", "5", "6", "7"], answer: 2, explanation: "A hexagon has six sides." },
      { prompt: "Boss challenge: Which comes next: 1, 1, 2, 3, 5, ?", options: ["7", "8", "9", "10"], answer: 1, explanation: "This is the Fibonacci pattern, next is eight." },
    ],
  },
];

const SHOP_ITEMS = [
  { id: "hint-pass", name: "Hint Pass", cost: 20, description: "Reveal the answer explanation." },
  { id: "time-burst", name: "Time Burst", cost: 35, description: "Add 4 seconds to the next round." },
  { id: "shield", name: "Shield", cost: 40, description: "Prevent one life loss." },
];

const state = loadState();
let currentMode = state.currentMode || "math";
let currentQuestion = null;
let round = 0;
let score = 0;
let timer = 12;
let lives = 3;
let questionLocked = false;
let countdownHandle = null;
let audioContext = null;
let masterGain = null;
let musicLoop = null;
let lastAnswerWasCorrect = false;

const els = {
  themeToggle: document.getElementById("themeToggle"),
  statusText: document.getElementById("statusText"),
  scoreValue: document.getElementById("scoreValue"),
  timerValue: document.getElementById("timerValue"),
  livesValue: document.getElementById("livesValue"),
  livesValueInline: document.getElementById("livesValueInline"),
  roundValue: document.getElementById("roundValue"),
  questionMeta: document.getElementById("questionMeta"),
  questionText: document.getElementById("questionText"),
  options: document.getElementById("options"),
  feedback: document.getElementById("feedback"),
  modeButtons: document.getElementById("modeButtons"),
  inventoryList: document.getElementById("inventoryList"),
  achievementList: document.getElementById("achievementList"),
  shopList: document.getElementById("shopList"),
  statsList: document.getElementById("statsList"),
  leaderboardList: document.getElementById("leaderboardList"),
  questList: document.getElementById("questList"),
  worldList: document.getElementById("worldList"),
  startGameButton: document.getElementById("startGameButton"),
  hintButton: document.getElementById("hintButton"),
  playerName: document.getElementById("playerName"),
  playerNameDisplay: document.getElementById("playerNameDisplay"),
  difficultySelect: document.getElementById("difficultySelect"),
  soundToggle: document.getElementById("soundToggle"),
  musicToggle: document.getElementById("musicToggle"),
  settingsForm: document.getElementById("settingsForm"),
  helpDialog: document.getElementById("helpDialog"),
  creditsDialog: document.getElementById("creditsDialog"),
  helpButton: document.getElementById("helpButton"),
  creditsButton: document.getElementById("creditsButton"),
  openHelpDialog: document.getElementById("openHelpDialog"),
  openCreditsDialog: document.getElementById("openCreditsDialog"),
  startHeroButton: document.getElementById("startHeroButton"),
  viewStatsButton: document.getElementById("viewStatsButton"),
  heroLevel: document.getElementById("heroLevel"),
  heroCoins: document.getElementById("heroCoins"),
  heroXP: document.getElementById("heroXP"),
  heroBest: document.getElementById("heroBest"),
  streakValue: document.getElementById("streakValue"),
  dailyBadge: document.getElementById("dailyBadge"),
  correctValue: document.getElementById("correctValue"),
  overallProgressText: document.getElementById("overallProgressText"),
  overallProgressBar: document.getElementById("overallProgressBar"),
  worldProgressText: document.getElementById("worldProgressText"),
  worldProgressTextInline: document.getElementById("worldProgressTextInline"),
  worldProgressBar: document.getElementById("worldProgressBar"),
  worldBadge: document.getElementById("worldBadge"),
  levelBadge: document.getElementById("levelBadge"),
  bossBadge: document.getElementById("bossBadge"),
  missionStatus: document.getElementById("missionStatus"),
  unlockOverlay: document.getElementById("unlockOverlay"),
  celebrationLayer: document.getElementById("celebrationLayer"),
};

function createDefaultState() {
  return {
    playerName: "Learner",
    difficulty: "easy",
    soundEnabled: true,
    musicEnabled: true,
    theme: "light",
    coins: 0,
    xp: 0,
    level: 1,
    bestScore: 0,
    completedRounds: 0,
    totalCorrect: 0,
    totalWrong: 0,
    streak: 0,
    inventory: [],
    achievements: [],
    leaderboard: [],
    stats: { math: 0, science: 0, geography: 0, logic: 0 },
    currentMode: "math",
    currentWorldIndex: 0,
    currentLevelIndex: 0,
    worldProgress: { 0: 0, 1: 0, 2: 0, 3: 0 },
    unlockedWorlds: [true, false, false, false],
  };
}

function normalizeState(parsed = {}) {
  const base = createDefaultState();
  const normalized = {
    ...base,
    ...parsed,
    stats: { ...base.stats, ...(parsed.stats || {}) },
    worldProgress: { ...base.worldProgress, ...(parsed.worldProgress || {}) },
  };

  normalized.currentWorldIndex = Math.max(0, Math.min(WORLDS.length - 1, Number(parsed.currentWorldIndex) || 0));
  normalized.currentLevelIndex = Math.max(0, Math.min(9, Number(parsed.currentLevelIndex) || 0));
  normalized.currentMode = MODE_DEFINITIONS.some((mode) => mode.id === parsed.currentMode) ? parsed.currentMode : "math";
  normalized.unlockedWorlds = Array.from({ length: WORLDS.length }, (_, index) => {
    const savedValue = Array.isArray(parsed.unlockedWorlds) ? parsed.unlockedWorlds[index] : undefined;
    return index === 0 ? true : Boolean(savedValue);
  });

  return normalized;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return createDefaultState();
    }
    const parsed = JSON.parse(saved);
    return normalizeState(parsed);
  } catch (error) {
    console.error("Unable to load saved game state.", error);
    return createDefaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...normalizeState(state),
        theme: document.documentElement.getAttribute("data-theme"),
      })
    );
  } catch (error) {
    console.warn("Unable to save game state.", error);
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  els.themeToggle.checked = theme === "dark";
}

function updateHeroSummary() {
  els.playerNameDisplay.textContent = state.playerName;
  els.heroLevel.textContent = state.level;
  els.heroCoins.textContent = state.coins;
  els.heroXP.textContent = state.xp;
  els.heroBest.textContent = state.bestScore;
  els.streakValue.textContent = state.streak;
  els.correctValue.textContent = state.totalCorrect;
  els.dailyBadge.textContent = state.streak >= 3 ? "On fire" : "New";
}

function setStatus(text, tone = "default") {
  els.statusText.textContent = text;
  els.statusText.style.background = tone === "success"
    ? "rgba(94, 227, 200, 0.18)"
    : tone === "danger"
      ? "rgba(255, 107, 127, 0.18)"
      : "rgba(94, 227, 200, 0.16)";
}

function getCurrentWorld() {
  return WORLDS[state.currentWorldIndex];
}

function getTimerValue() {
  const base = state.difficulty === "hard" ? 8 : state.difficulty === "medium" ? 10 : 12;
  return base - state.currentWorldIndex;
}

function renderModes() {
  els.modeButtons.innerHTML = "";
  MODE_DEFINITIONS.forEach((mode) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip-button ${mode.id === currentMode ? "active" : ""}`;
    button.innerHTML = `${mode.emoji} ${mode.label}`;
    button.setAttribute("aria-pressed", String(mode.id === currentMode));
    button.addEventListener("click", () => {
      currentMode = mode.id;
      state.currentMode = mode.id;
      const matchingWorld = WORLDS.findIndex((world) => world.mode === mode.id);
      if (matchingWorld >= 0) {
        startWorld(matchingWorld);
      }
      renderModes();
    });
    els.modeButtons.appendChild(button);
  });
}

function renderWorlds() {
  els.worldList.innerHTML = "";
  WORLDS.forEach((world, index) => {
    const isUnlocked = state.unlockedWorlds[index];
    const percent = state.worldProgress[index] || 0;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `world-card ${index === state.currentWorldIndex ? "active" : ""} ${isUnlocked ? "" : "locked"}`;
    button.disabled = !isUnlocked && index !== 0;
    button.innerHTML = `
      <div class="world-details">
        <strong>${world.emoji} ${world.name}</strong>
        <small>${world.description}</small>
      </div>
      <span>${percent}%</span>
    `;
    button.addEventListener("click", () => startWorld(index));
    els.worldList.appendChild(button);
  });
}

function renderQuests() {
  const world = getCurrentWorld();
  const questItems = [
    `Complete 10 levels in ${world.name}`,
    `Keep your streak alive for 3 rounds`,
    `Earn ${world.mode === "logic" ? "30" : "20"} XP in this world`,
  ];
  els.questList.innerHTML = "";
  questItems.forEach((item) => {
    const li = document.createElement("li");
    li.className = "inventory-item";
    li.textContent = item;
    els.questList.appendChild(li);
  });
}

function renderInventory() {
  els.inventoryList.innerHTML = "";
  if (!state.inventory.length) {
    els.inventoryList.innerHTML = '<li class="inventory-item">No boosts unlocked yet.</li>';
    return;
  }
  state.inventory.forEach((item) => {
    const li = document.createElement("li");
    li.className = "inventory-item";
    li.textContent = item;
    els.inventoryList.appendChild(li);
  });
}

function renderAchievements() {
  els.achievementList.innerHTML = "";
  if (!state.achievements.length) {
    els.achievementList.innerHTML = '<li class="inventory-item">Finish a world to unlock badges.</li>';
    return;
  }
  state.achievements.forEach((achievement) => {
    const li = document.createElement("li");
    li.className = "inventory-item";
    li.textContent = achievement;
    els.achievementList.appendChild(li);
  });
}

function renderShop() {
  els.shopList.innerHTML = "";
  SHOP_ITEMS.forEach((item) => {
    const li = document.createElement("li");
    li.className = "shop-item";
    li.innerHTML = `<span><strong>${item.name}</strong><br /><small>${item.description}</small></span><button class="button secondary" data-shop-id="${item.id}" type="button">Buy • ${item.cost}</button>`;
    els.shopList.appendChild(li);
  });
}

function renderStats() {
  const entries = [
    { label: "Math", value: state.stats.math },
    { label: "Science", value: state.stats.science },
    { label: "Geography", value: state.stats.geography },
    { label: "Logic", value: state.stats.logic },
  ];
  els.statsList.innerHTML = "";
  entries.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "stat-item";
    li.innerHTML = `<span>${entry.label}</span><strong>${entry.value}</strong>`;
    els.statsList.appendChild(li);
  });
}

function renderLeaderboard() {
  const sorted = [...state.leaderboard].sort((a, b) => b.score - a.score).slice(0, 5);
  els.leaderboardList.innerHTML = "";
  if (!sorted.length) {
    els.leaderboardList.innerHTML = '<li class="leaderboard-item">No scores yet.</li>';
    return;
  }
  sorted.forEach((entry, index) => {
    const li = document.createElement("li");
    li.className = "leaderboard-item";
    li.innerHTML = `<span>#${index + 1} ${entry.name}</span><strong>${entry.score}</strong>`;
    els.leaderboardList.appendChild(li);
  });
}

function renderProgressPanel() {
  const totalProgress = WORLDS.reduce((sum, _, index) => sum + (state.worldProgress[index] || 0), 0) / WORLDS.length;
  els.overallProgressText.textContent = `${Math.round(totalProgress)}%`;
  els.overallProgressBar.style.width = `${Math.round(totalProgress)}%`;
  const currentWorld = getCurrentWorld();
  const currentPercent = state.worldProgress[state.currentWorldIndex] || 0;
  els.worldProgressText.textContent = `${currentPercent}%`;
  els.worldProgressTextInline.textContent = `${currentPercent}%`;
  els.worldProgressBar.style.width = `${currentPercent}%`;
  els.worldBadge.textContent = `${currentWorld.emoji} ${currentWorld.name}`;
  els.levelBadge.textContent = `Level ${state.currentLevelIndex + 1}`;
  els.bossBadge.textContent = state.currentLevelIndex === 9 ? "Yes" : "No";
  els.missionStatus.textContent = `${currentWorld.name}`;
  els.scoreValue.textContent = score;
  els.livesValue.textContent = lives;
  els.livesValueInline.textContent = lives;
  els.roundValue.textContent = `${Math.min(state.currentLevelIndex + 1, 10)}/10`;
  els.timerValue.textContent = timer;
  updateHeroSummary();
}

function awardAchievements() {
  if (state.completedRounds >= 3 && !state.achievements.includes("Spark Starter")) {
    state.achievements.push("Spark Starter");
    showCelebration("Spark Starter");
  }
  if (state.streak >= 3 && !state.achievements.includes("Combo Keeper")) {
    state.achievements.push("Combo Keeper");
    showCelebration("Combo Keeper");
  }
  if (state.level >= 3 && !state.achievements.includes("Level Up")) {
    state.achievements.push("Level Up");
    showCelebration("Level Up");
  }
  if (state.completedRounds >= 4 && !state.achievements.includes("World Explorer")) {
    state.achievements.push("World Explorer");
    showCelebration("World Explorer");
  }
}

function applyProgress() {
  const nextLevel = Math.floor(state.xp / 100) + 1;
  if (nextLevel > state.level) {
    state.level = nextLevel;
    setStatus(`Level up! You are now level ${state.level}.`, "success");
  }
  if (score > state.bestScore) {
    state.bestScore = score;
  }
  awardAchievements();
  saveState();
  renderInventory();
  renderAchievements();
  renderStats();
  renderLeaderboard();
  renderProgressPanel();
  renderWorlds();
  renderQuests();
}

function startWorld(index) {
  if (index > 0 && !state.unlockedWorlds[index]) {
    setStatus("This world is locked. Finish the previous world to unlock it.", "danger");
    return;
  }
  state.currentWorldIndex = index;
  state.currentLevelIndex = 0;
  state.currentMode = WORLDS[index].mode;
  currentMode = WORLDS[index].mode;
  score = 0;
  lives = 3;
  round = 0;
  timer = getTimerValue();
  questionLocked = false;
  clearInterval(countdownHandle);
  saveState();
  renderModes();
  renderWorlds();
  renderQuests();
  renderProgressPanel();
  setStatus(`Welcome to ${WORLDS[index].name}!`, "success");
  startRound();
}

function startRound() {
  clearInterval(countdownHandle);
  questionLocked = false;
  round = state.currentLevelIndex + 1;
  timer = getTimerValue();
  const world = getCurrentWorld();
  const question = world.questions[state.currentLevelIndex];
  currentQuestion = question;
  els.questionMeta.innerHTML = `<strong>${world.emoji} ${world.name}</strong> · ${state.difficulty} · ${state.currentLevelIndex === 9 ? "Boss level" : `Level ${state.currentLevelIndex + 1}`}`;
  els.questionText.textContent = question.prompt;
  els.feedback.textContent = "";
  els.options.innerHTML = "";
  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";
    button.textContent = option;
    button.addEventListener("click", () => handleAnswer(index));
    els.options.appendChild(button);
  });
  renderProgressPanel();
  startTimer();
  setStatus(`${state.currentLevelIndex === 9 ? "Boss" : "Level"} ${state.currentLevelIndex + 1} ready.`, "default");
}

function startTimer() {
  countdownHandle = window.setInterval(() => {
    timer -= 1;
    els.timerValue.textContent = timer;
    if (timer <= 0) {
      window.clearInterval(countdownHandle);
      handleTimeout();
    }
  }, 1000);
}

function handleAnswer(index) {
  if (questionLocked) {
    return;
  }
  questionLocked = true;
  window.clearInterval(countdownHandle);
  const buttons = Array.from(els.options.querySelectorAll("button"));
  buttons.forEach((button, buttonIndex) => {
    button.disabled = true;
    if (buttonIndex === currentQuestion.answer) {
      button.classList.add("correct");
    } else if (buttonIndex === index) {
      button.classList.add("wrong");
    }
  });
  if (index === currentQuestion.answer) {
    const bonus = state.currentWorldIndex + 1;
    score += 10 + (state.difficulty === "hard" ? 5 : state.difficulty === "medium" ? 3 : 1) + bonus;
    state.totalCorrect += 1;
    state.xp += 18 + bonus * 2;
    state.coins += 4 + bonus;
    state.stats[currentMode] += 1;
    state.streak += 1;
    state.completedRounds += 1;
    lastAnswerWasCorrect = true;
    els.feedback.textContent = `Correct! ${currentQuestion.explanation}`;
    setStatus("Great job! On to the next level.", "success");
    playSound("success");
    spawnReward(`+${4 + bonus} 🪙`);
    window.setTimeout(() => {
      if (state.currentLevelIndex >= 9) {
        completeWorld();
      } else {
        state.currentLevelIndex += 1;
        saveState();
        applyProgress();
        startRound();
      }
    }, 1100);
  } else {
    state.totalWrong += 1;
    state.streak = 0;
    lives -= 1;
    lastAnswerWasCorrect = false;
    els.feedback.textContent = `Not quite. ${currentQuestion.explanation}`;
    setStatus("That one missed. Try again with a fresh spark!", "danger");
    playSound("fail");
    renderProgressPanel();
    if (lives <= 0) {
      endGame();
      return;
    }
    window.setTimeout(() => startRound(), 1200);
  }
  renderProgressPanel();
  applyProgress();
}

function handleTimeout() {
  if (questionLocked) {
    return;
  }
  questionLocked = true;
  lives -= 1;
  state.totalWrong += 1;
  state.streak = 0;
  els.feedback.textContent = `Time's up! ${currentQuestion.explanation}`;
  setStatus("Time expired. Keep going!", "danger");
  playSound("fail");
  renderProgressPanel();
  if (lives <= 0) {
    endGame();
    return;
  }
  window.setTimeout(() => startRound(), 1200);
}

function completeWorld() {
  const world = getCurrentWorld();
  state.worldProgress[state.currentWorldIndex] = 100;
  state.coins += 22;
  state.xp += 70;
  state.completedRounds += 1;
  saveState();
  renderProgressPanel();
  renderWorlds();
  renderQuests();
  setStatus(`World complete! ${world.name} is now yours.`, "success");
  showCelebration(`World complete: ${world.name}`);
  showUnlockCard(world.name);
  if (state.currentWorldIndex < WORLDS.length - 1) {
    state.unlockedWorlds[state.currentWorldIndex + 1] = true;
    saveState();
    window.setTimeout(() => {
      startWorld(state.currentWorldIndex + 1);
    }, 2000);
  }
}

function endGame() {
  clearInterval(countdownHandle);
  const rank = state.leaderboard.find((entry) => entry.name === state.playerName);
  if (rank) {
    rank.score = Math.max(rank.score, score);
  } else {
    state.leaderboard.push({ name: state.playerName, score });
  }
  state.leaderboard.sort((a, b) => b.score - a.score);
  state.currentLevelIndex = 0;
  state.streak = 0;
  saveState();
  renderLeaderboard();
  renderProgressPanel();
  setStatus(`Out of lives. Start ${getCurrentWorld().name} again to continue.`, "danger");
  els.feedback.textContent = "No more lives left. Start the world again to continue your adventure.";
  els.options.innerHTML = "";
  questionLocked = false;
  timer = getTimerValue();
}

function showUnlockCard(worldName) {
  els.unlockOverlay.hidden = false;
  els.unlockOverlay.classList.add("is-visible");
  els.unlockOverlay.style.pointerEvents = "auto";
  els.unlockOverlay.innerHTML = `
    <div class="unlock-card">
      <p class="eyebrow">New world unlocked</p>
      <h3>${worldName}</h3>
      <p>Your adventure continues with fresh challenges and brighter rewards.</p>
    </div>
  `;
  window.setTimeout(() => {
    els.unlockOverlay.classList.remove("is-visible");
    els.unlockOverlay.style.pointerEvents = "none";
    els.unlockOverlay.hidden = true;
    els.unlockOverlay.innerHTML = "";
  }, 1400);
}

function showCelebration(title) {
  const colors = ["#5ee3c8", "#7c7fff", "#ff8fb1", "#ffc96b"];
  for (let index = 0; index < 30; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.top = `-10px`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.2}s`;
    els.celebrationLayer.appendChild(piece);
    window.setTimeout(() => piece.remove(), 1400);
  }
  spawnReward(title);
}

function spawnReward(text) {
  const pop = document.createElement("div");
  pop.className = "reward-pop";
  pop.textContent = text;
  pop.style.left = `${Math.random() * 80 + 10}vw`;
  pop.style.top = `${Math.random() * 50 + 20}vh`;
  document.body.appendChild(pop);
  window.setTimeout(() => pop.remove(), 900);
}

function ensureAudioContext() {
  if (audioContext) {
    if (audioContext.state === "suspended") {
      void audioContext.resume();
    }
    window.__eduplayAudioState = { state: audioContext.state };
    return audioContext;
  }
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }
  audioContext = new AudioContextClass();
  masterGain = audioContext.createGain();
  masterGain.gain.value = 0.04;
  masterGain.connect(audioContext.destination);
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }
  window.__eduplayAudioState = { state: audioContext.state };
  return audioContext;
}

function playTone(type) {
  const context = ensureAudioContext();
  if (!context || !state.soundEnabled) {
    return;
  }
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.type = type === "success" ? "triangle" : "sawtooth";
  oscillator.frequency.value = type === "success" ? 660 : 220;
  gainNode.gain.setValueAtTime(0.0001, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.09, context.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.2);
  oscillator.connect(gainNode);
  gainNode.connect(masterGain);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.22);
}

function playBackgroundMusicNote(context, frequency, duration = 0.6, volume = 0.12) {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  gainNode.gain.setValueAtTime(0.0001, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(volume, context.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
  oscillator.connect(gainNode);
  gainNode.connect(masterGain);
  oscillator.start();
  oscillator.stop(context.currentTime + duration + 0.01);
}

function playSound(type) {
  if (!state.soundEnabled) {
    return;
  }
  playTone(type);
  if (type === "success") {
    window.speechSynthesis?.speak(new SpeechSynthesisUtterance("Correct!"));
  }
  if (type === "fail") {
    window.speechSynthesis?.speak(new SpeechSynthesisUtterance("Try again."));
  }
}

function startMusicLoop() {
  const context = ensureAudioContext();
  if (!context || !state.musicEnabled) {
    return;
  }
  if (context.state === "suspended") {
    void context.resume();
  }
  const tracks = [
    [261.63, 293.66, 329.63, 349.23, 392.0, 349.23, 329.63, 293.66],
    [392.0, 440.0, 493.88, 523.25, 493.88, 440.0, 392.0, 349.23],
    [329.63, 392.0, 440.0, 392.0, 349.23, 329.63, 293.66, 261.63],
  ];
  const melody = tracks[Math.floor(Math.random() * tracks.length)];
  let index = 0;
  if (musicLoop) {
    window.clearInterval(musicLoop);
  }
  const playNext = () => {
    if (!state.musicEnabled) {
      return;
    }
    playBackgroundMusicNote(context, melody[index % melody.length], 0.55, 0.14);
    index += 1;
  };
  playNext();
  musicLoop = window.setInterval(playNext, 650);
  window.__eduplayMusicLoopActive = true;
}

function toggleMusic() {
  state.musicEnabled = !state.musicEnabled;
  saveState();
  els.musicToggle.setAttribute("aria-pressed", String(state.musicEnabled));
  els.musicToggle.textContent = state.musicEnabled ? "♫ Music on" : "♫ Music off";
  if (!state.musicEnabled) {
    if (musicLoop) {
      window.clearInterval(musicLoop);
      musicLoop = null;
    }
    window.__eduplayMusicLoopActive = false;
    return;
  }
  setStatus("Background music is now playing.", "default");
  startMusicLoop();
}

function handleShopPurchase(event) {
  const button = event.target.closest("button[data-shop-id]");
  if (!button) {
    return;
  }
  const itemId = button.getAttribute("data-shop-id");
  const item = SHOP_ITEMS.find((entry) => entry.id === itemId);
  if (!item) {
    return;
  }
  if (state.coins < item.cost) {
    setStatus("Not enough coins for that boost.", "danger");
    return;
  }
  state.coins -= item.cost;
  state.inventory.push(item.name);
  setStatus(`${item.name} unlocked.`, "success");
  applyProgress();
  renderShop();
}

function initializeSettings() {
  els.playerName.value = state.playerName;
  els.difficultySelect.value = state.difficulty;
  els.soundToggle.checked = state.soundEnabled;
  els.musicToggle.textContent = state.musicEnabled ? "♫ Music on" : "♫ Music off";
  els.musicToggle.setAttribute("aria-pressed", String(state.musicEnabled));
  applyTheme(state.theme);
}

function updateSettings(event) {
  const target = event.target;
  if (target.id === "playerName") {
    const trimmed = target.value.trim();
    state.playerName = trimmed || "Learner";
  }
  if (target.id === "difficultySelect") {
    state.difficulty = target.value;
  }
  if (target.id === "soundToggle") {
    state.soundEnabled = target.checked;
  }
  saveState();
  initializeSettings();
  renderProgressPanel();
}

function bindEvents() {
  els.themeToggle.addEventListener("change", (event) => {
    applyTheme(event.target.checked ? "dark" : "light");
    saveState();
  });

  els.musicToggle.addEventListener("click", () => {
    toggleMusic();
  });

  els.startGameButton.addEventListener("click", () => {
    startWorld(state.currentWorldIndex);
  });

  els.hintButton.addEventListener("click", () => {
    if (!currentQuestion) {
      setStatus("Start a world to unlock hints.", "default");
      return;
    }
    els.feedback.textContent = `Hint: ${currentQuestion.explanation}`;
    setStatus("Hint used.", "default");
  });

  els.startHeroButton.addEventListener("click", () => {
    startWorld(state.currentWorldIndex);
  });

  els.viewStatsButton.addEventListener("click", () => {
    document.querySelector(".info-grid").scrollIntoView({ behavior: "smooth" });
  });

  els.helpButton.addEventListener("click", () => els.helpDialog.showModal());
  els.creditsButton.addEventListener("click", () => els.creditsDialog.showModal());
  els.openHelpDialog.addEventListener("click", () => els.helpDialog.showModal());
  els.openCreditsDialog.addEventListener("click", () => els.creditsDialog.showModal());
  els.shopList.addEventListener("click", handleShopPurchase);
  if (els.settingsForm) {
    els.settingsForm.addEventListener("input", updateSettings);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      els.helpDialog.close();
      els.creditsDialog.close();
    }
  });
}

function initialize() {
  initializeSettings();
  renderModes();
  renderWorlds();
  renderQuests();
  renderInventory();
  renderAchievements();
  renderShop();
  renderStats();
  renderLeaderboard();
  renderProgressPanel();
  bindEvents();
  setStatus("The adventure is ready. Choose a world and begin.", "default");
}

initialize();
