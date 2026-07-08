const STORAGE_KEY = "eduplay-state-v1";

const MODE_DEFINITIONS = [
  { id: "math", label: "Math", emoji: "➗", description: "Quick arithmetic challenges" },
  { id: "science", label: "Science", emoji: "🔬", description: "Curious facts and experiments" },
  { id: "geography", label: "Geography", emoji: "🌍", description: "Places, flags, and capitals" },
  { id: "logic", label: "Logic", emoji: "🧠", description: "Patterns and reasoning" },
];

const QUESTION_BANK = {
  math: [
    { prompt: "What is 7 × 8?", options: ["54", "56", "58", "60"], answer: 1, explanation: "Seven times eight equals fifty-six." },
    { prompt: "What is 81 ÷ 9?", options: ["7", "8", "9", "10"], answer: 2, explanation: "Eighty-one divided by nine is nine." },
    { prompt: "Which number is prime?", options: ["21", "25", "29", "33"], answer: 2, explanation: "Twenty-nine has no divisors other than one and itself." },
  ],
  science: [
    { prompt: "What planet is known as the Red Planet?", options: ["Venus", "Mars", "Mercury", "Jupiter"], answer: 1, explanation: "Mars has a reddish appearance because of iron oxide." },
    { prompt: "What gas do plants absorb from the air?", options: ["Oxygen", "Hydrogen", "Carbon dioxide", "Nitrogen"], answer: 2, explanation: "Plants use carbon dioxide during photosynthesis." },
    { prompt: "What force keeps us on the ground?", options: ["Magnetism", "Friction", "Gravity", "Light"], answer: 2, explanation: "Gravity pulls objects toward Earth." },
  ],
  geography: [
    { prompt: "What is the capital of Japan?", options: ["Seoul", "Beijing", "Tokyo", "Osaka"], answer: 2, explanation: "Tokyo is the capital city of Japan." },
    { prompt: "Which ocean is the largest?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3, explanation: "The Pacific Ocean is the largest and deepest ocean." },
    { prompt: "Which country has the Nile River?", options: ["Egypt", "Brazil", "Canada", "India"], answer: 0, explanation: "The Nile River flows through Egypt and several other countries." },
  ],
  logic: [
    { prompt: "Which comes next: 2, 4, 8, 16, ?", options: ["18", "24", "32", "40"], answer: 2, explanation: "Each number doubles." },
    { prompt: "If all bloops are blips and some blips are blups, which is true?", options: ["All bloops are blups", "Some bloops are blups", "No bloops are blups", "All blups are bloops"], answer: 1, explanation: "The statement allows some overlap, not certainty for all." },
    { prompt: "Find the odd one out: circle, square, triangle, apple", options: ["Circle", "Square", "Triangle", "Apple"], answer: 3, explanation: "Apple is not a shape." },
  ],
};

const SHOP_ITEMS = [
  { id: "hint-pass", name: "Hint Pass", cost: 20, description: "Reveal the answer explanation." },
  { id: "time-burst", name: "Time Burst", cost: 35, description: "Add 4 seconds to the next round." },
  { id: "shield", name: "Shield", cost: 40, description: "Prevent one life loss." },
];

const state = loadState();
let currentMode = "math";
let currentQuestion = null;
let round = 0;
let score = 0;
let timer = 12;
let lives = 3;
let questionLocked = false;
let countdownHandle = null;
let lastAnswerWasCorrect = false;

const els = {
  themeToggle: document.getElementById("themeToggle"),
  statusText: document.getElementById("statusText"),
  scoreValue: document.getElementById("scoreValue"),
  timerValue: document.getElementById("timerValue"),
  livesValue: document.getElementById("livesValue"),
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
  startGameButton: document.getElementById("startGameButton"),
  hintButton: document.getElementById("hintButton"),
  playerName: document.getElementById("playerName"),
  difficultySelect: document.getElementById("difficultySelect"),
  soundToggle: document.getElementById("soundToggle"),
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
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return createDefaultState();
    }
    const parsed = JSON.parse(saved);
    return { ...createDefaultState(), ...parsed };
  } catch (error) {
    console.error("Unable to load saved game state.", error);
    return createDefaultState();
  }
}

function createDefaultState() {
  return {
    playerName: "Learner",
    difficulty: "easy",
    soundEnabled: true,
    theme: "dark",
    coins: 0,
    xp: 0,
    level: 1,
    bestScore: 0,
    completedRounds: 0,
    totalCorrect: 0,
    totalWrong: 0,
    inventory: [],
    achievements: [],
    leaderboard: [],
    stats: {
      math: 0,
      science: 0,
      geography: 0,
      logic: 0,
    },
  };
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...state,
      theme: document.documentElement.getAttribute("data-theme"),
    })
  );
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  els.themeToggle.checked = theme === "dark";
}

function updateHeroSummary() {
  els.heroLevel.textContent = state.level;
  els.heroCoins.textContent = state.coins;
  els.heroXP.textContent = state.xp;
  els.heroBest.textContent = state.bestScore;
}

function setStatus(text, tone = "default") {
  els.statusText.textContent = text;
  els.statusText.style.background = tone === "success"
    ? "rgba(91, 224, 184, 0.18)"
    : tone === "danger"
      ? "rgba(255, 107, 127, 0.18)"
      : "rgba(91, 224, 184, 0.16)";
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
      renderModes();
      startRound();
    });
    els.modeButtons.appendChild(button);
  });
}

function renderInventory() {
  els.inventoryList.innerHTML = "";
  if (!state.inventory.length) {
    els.inventoryList.innerHTML = '<li class="inventory-item">No boosts yet.</li>';
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
    els.achievementList.innerHTML = '<li class="inventory-item">Finish a round to unlock achievements.</li>';
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

function awardAchievements() {
  if (state.completedRounds >= 3 && !state.achievements.includes("Starter")) {
    state.achievements.push("Starter");
  }
  if (state.totalCorrect >= 5 && !state.achievements.includes("Sharp Mind")) {
    state.achievements.push("Sharp Mind");
  }
  if (state.level >= 3 && !state.achievements.includes("Level Up")) {
    state.achievements.push("Level Up");
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
  updateHeroSummary();
  renderInventory();
  renderAchievements();
  renderStats();
  renderLeaderboard();
}

function startRound() {
  clearInterval(countdownHandle);
  questionLocked = false;
  round += 1;
  timer = getTimerValue();
  els.roundValue.textContent = `${round}/10`;
  els.scoreValue.textContent = score;
  els.timerValue.textContent = timer;
  els.livesValue.textContent = lives;

  const pool = QUESTION_BANK[currentMode] || QUESTION_BANK.math;
  const question = pool[Math.floor(Math.random() * pool.length)];
  currentQuestion = question;
  els.questionMeta.innerHTML = `<strong>${MODE_DEFINITIONS.find((item) => item.id === currentMode)?.label || "Quiz"}</strong> · ${state.difficulty}`;
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

  startTimer();
  setStatus(`New ${currentMode} challenge launched.`, "default");
}

function getTimerValue() {
  const base = state.difficulty === "hard" ? 8 : state.difficulty === "medium" ? 10 : 12;
  return base;
}

function startTimer() {
  countdownHandle = setInterval(() => {
    timer -= 1;
    els.timerValue.textContent = timer;
    if (timer <= 0) {
      clearInterval(countdownHandle);
      handleTimeout();
    }
  }, 1000);
}

function handleAnswer(index) {
  if (questionLocked) {
    return;
  }

  questionLocked = true;
  clearInterval(countdownHandle);

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
    score += 10 + (state.difficulty === "hard" ? 5 : state.difficulty === "medium" ? 3 : 1);
    state.totalCorrect += 1;
    state.xp += 15;
    state.coins += 3;
    state.stats[currentMode] += 1;
    state.completedRounds += 1;
    lastAnswerWasCorrect = true;
    els.feedback.textContent = `Correct! ${currentQuestion.explanation}`;
    setStatus("Correct answer. Great work!", "success");
    playSound("success");
  } else {
    state.totalWrong += 1;
    lives -= 1;
    lastAnswerWasCorrect = false;
    els.feedback.textContent = `Not quite. ${currentQuestion.explanation}`;
    setStatus("That one missed. Try another round!", "danger");
    playSound("fail");
  }

  els.scoreValue.textContent = score;
  els.livesValue.textContent = lives;
  applyProgress();

  if (lives <= 0) {
    endGame();
    return;
  }

  window.setTimeout(() => {
    if (round < 10) {
      startRound();
    } else {
      endGame();
    }
  }, 1400);
}

function handleTimeout() {
  if (questionLocked) {
    return;
  }
  questionLocked = true;
  lives -= 1;
  state.totalWrong += 1;
  els.feedback.textContent = `Time's up! ${currentQuestion.explanation}`;
  els.livesValue.textContent = lives;
  setStatus("Time expired. Keep going!", "danger");
  playSound("fail");
  applyProgress();
  if (lives <= 0) {
    endGame();
    return;
  }
  window.setTimeout(() => {
    if (round < 10) {
      startRound();
    } else {
      endGame();
    }
  }, 1400);
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
  saveState();
  renderLeaderboard();
  setStatus(`Session complete. Final score: ${score}.`, "success");
  els.feedback.textContent = "Game over. Start another round to keep learning.";
  els.questionText.textContent = "Session complete. Press start to play again.";
  els.options.innerHTML = "";
  round = 0;
  questionLocked = false;
  timer = getTimerValue();
  els.roundValue.textContent = "0/10";
  els.timerValue.textContent = timer;
}

function playSound(type) {
  if (!state.soundEnabled) {
    return;
  }
  if (type === "success") {
    window.speechSynthesis?.speak(new SpeechSynthesisUtterance("Correct!"));
  }
  if (type === "fail") {
    window.speechSynthesis?.speak(new SpeechSynthesisUtterance("Try again."));
  }
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
}

function bindEvents() {
  els.themeToggle.addEventListener("change", (event) => {
    applyTheme(event.target.checked ? "dark" : "light");
    saveState();
  });

  els.startGameButton.addEventListener("click", () => {
    round = 0;
    score = 0;
    lives = 3;
    els.scoreValue.textContent = score;
    els.livesValue.textContent = lives;
    els.roundValue.textContent = "0/10";
    startRound();
  });

  els.hintButton.addEventListener("click", () => {
    if (!currentQuestion) {
      setStatus("Start a round to unlock hints.", "default");
      return;
    }
    const explanation = currentQuestion.explanation;
    els.feedback.textContent = `Hint: ${explanation}`;
    setStatus("Hint used.", "default");
  });

  els.startHeroButton.addEventListener("click", () => {
    round = 0;
    score = 0;
    lives = 3;
    els.scoreValue.textContent = score;
    els.livesValue.textContent = lives;
    els.roundValue.textContent = "0/10";
    startRound();
  });

  els.viewStatsButton.addEventListener("click", () => {
    document.querySelector(".info-grid").scrollIntoView({ behavior: "smooth" });
  });

  els.helpButton.addEventListener("click", () => els.helpDialog.showModal());
  els.creditsButton.addEventListener("click", () => els.creditsDialog.showModal());
  els.openHelpDialog.addEventListener("click", () => els.helpDialog.showModal());
  els.openCreditsDialog.addEventListener("click", () => els.creditsDialog.showModal());

  els.shopList.addEventListener("click", handleShopPurchase);
  els.settingsForm.addEventListener("input", updateSettings);

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
  renderInventory();
  renderAchievements();
  renderShop();
  renderStats();
  renderLeaderboard();
  updateHeroSummary();
  bindEvents();
  setStatus("Welcome to EduPlay. Choose a topic to begin.", "default");
}

initialize();
