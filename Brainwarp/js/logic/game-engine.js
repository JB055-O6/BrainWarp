class BrainwarpEngine {
  constructor() {
    this.puzzles = [];
    this.currentLevel = 0;
    this.score = 0;
    this.lives = 3;
    this.xp = 0;
    this.level = 1;
    this.completedPuzzles = 0;
    this.isInitialized = false;
    this.hintCooldown = 0;
    this.settings = {
      difficulty: "normal",
      soundEnabled: true,
      particleEffects: true,
    };
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      await this.loadPuzzleData();
      this.initializePuzzleGrid();
      this.loadUserData();
      this.startHintCooldown();

      this.isInitialized = true;
      console.log("Brainwarp Engine initialized");
      window.dispatchEvent(new CustomEvent("brainwarp:initialized"));
    } catch (error) {
      console.error("Failed to initialize Brainwarp Engine:", error);
    }
  }

  async loadPuzzleData() {
    try {
      const response = await fetch("data/brain-levels.json");
      if (!response.ok) throw new Error("Failed to load puzzle data");
      const data = await response.json();
      this.puzzles = data.puzzles || [];
      console.log(`Loaded ${this.puzzles.length} puzzles`);
    } catch (error) {
      console.error("Error loading puzzle data:", error);
      this.puzzles = this.getDefaultPuzzles();
    }
  }

  getDefaultPuzzles() {
    return [
      { id: "memory-1", type: "memory", title: "Sequence Recall", difficulty: "easy", description: "Memorize and repeat the sequence of neural pulses.", unlocked: true },
      { id: "logic-1", type: "logic", title: "Neural Pathways", difficulty: "easy", description: "Connect the correct neural pathways to complete the circuit.", unlocked: true },
      { id: "reflex-1", type: "reflex", title: "Synapse Response", difficulty: "easy", description: "Click the neural nodes as they appear within the time limit.", unlocked: true },
      { id: "pattern-1", type: "pattern", title: "Pattern Recognition", difficulty: "medium", description: "Identify and continue the neural pattern sequence.", unlocked: false },
    ];
  }

  loadUserData() {
    const userData = JSON.parse(localStorage.getItem("brainwarp-user") || "{}");
    this.score = userData.score || 0;
    this.lives = userData.lives || 3;
    this.xp = userData.xp || 0;
    this.level = userData.level || 1;
    this.completedPuzzles = userData.completedPuzzles || 0;

    this.updateUIDisplay();
  }

  saveUserData() {
    const userData = {
      score: this.score,
      lives: this.lives,
      xp: this.xp,
      level: this.level,
      completedPuzzles: this.completedPuzzles,
      name: "Neural User",
    };
    localStorage.setItem("brainwarp-user", JSON.stringify(userData));
    this.updateUIDisplay();
  }

  updateUIDisplay() {
    const scoreElement = document.getElementById("player-score");
    const livesElement = document.getElementById("player-lives");
    const profileName = document.getElementById("profile-name");
    const profileLevel = document.getElementById("profile-level");
    const profileXP = document.getElementById("profile-xp");
    const profileCompleted = document.getElementById("profile-completed");

    if (scoreElement) scoreElement.textContent = this.score;
    if (livesElement) livesElement.textContent = this.lives;
    if (profileName) profileName.textContent = "Neural User";
    if (profileLevel) profileLevel.textContent = this.level;
    if (profileXP) profileXP.textContent = this.xp;
    if (profileCompleted) profileCompleted.textContent = this.completedPuzzles;
  }

  initializePuzzleGrid() {
    const puzzleGrid = document.getElementById("puzzle-grid");
    if (!puzzleGrid) return;

    puzzleGrid.innerHTML = "";

    this.puzzles.forEach((puzzle) => {
      const puzzleCard = this.createPuzzleCard(puzzle);
      puzzleGrid.appendChild(puzzleCard);
    });

    // Dispatch the puzzleCardsLoaded event after all cards are added
    window.dispatchEvent(new Event("puzzleCardsLoaded"));

    this.updateUIDisplay();
  }

  createPuzzleCard(puzzle) {
    const card = document.createElement("div");
    card.className = `puzzle-card ${puzzle.type}-puzzle ${puzzle.unlocked ? "unlocked" : "locked"}`;
    card.dataset.puzzleId = puzzle.id;

    card.innerHTML = `
      <div class="card-glow"></div>
      <div class="card-content">
        <div class="puzzle-icon ${puzzle.type}-icon"></div>
        <h3 class="puzzle-title">${puzzle.title}</h3>
        <div class="puzzle-difficulty">
          <span class="difficulty-label">Difficulty:</span>
          <span class="difficulty-value ${puzzle.difficulty}">${puzzle.difficulty}</span>
        </div>
        <p class="puzzle-description">${puzzle.description}</p>
        <div class="puzzle-status">
          ${puzzle.unlocked ? '<span class="status-unlocked">Available</span>' : '<span class="status-locked">Locked</span>'}
        </div>
      </div>
    `;

    if (puzzle.unlocked) {
      card.addEventListener("click", () => {
        this.startPuzzle(puzzle.id);
      });
    }

    return card;
  }

  startPuzzle(puzzleId) {
    const puzzle = this.puzzles.find((p) => p.id === puzzleId);
    if (!puzzle || !puzzle.unlocked) return;

    console.log(`Starting puzzle: ${puzzle.title}`);

    if (typeof openPuzzleModal === "function") {
      openPuzzleModal(puzzleId, puzzle.title);
      document.getElementById("hint-button").disabled = this.hintCooldown > 0;
    }
  }

  completePuzzle(puzzleId, score) {
    const puzzle = this.puzzles.find((p) => p.id === puzzleId);
    if (!puzzle) return;

    console.log(`Completed puzzle: ${puzzle.title} with score: ${score}`);

    this.score += score;
    this.xp += score * 2;
    this.completedPuzzles++;

    // Level up logic
    const xpForNextLevel = this.level * 100;
    if (this.xp >= xpForNextLevel) {
      this.level++;
      this.lives = Math.min(this.lives + 1, 5); // Max 5 lives
      window.showNotification("Level Up!", `You’ve reached Level ${this.level}!`, "success");
    }

    const currentIndex = this.puzzles.indexOf(puzzle);
    if (currentIndex < this.puzzles.length - 1) {
      const nextPuzzle = this.puzzles[currentIndex + 1];
      if (!nextPuzzle.unlocked) {
        nextPuzzle.unlocked = true;
        console.log(`Unlocked new puzzle: ${nextPuzzle.title}`);
        this.initializePuzzleGrid();
      }
    }

    this.saveUserData();

    window.dispatchEvent(
      new CustomEvent("brainwarp:puzzleCompleted", {
        detail: { puzzleId, score },
      }),
    );
  }

  loseLife() {
    this.lives--;
    this.saveUserData();
    if (this.lives <= 0) {
      window.showNotification("Game Over", "You’ve run out of lives. Resetting...", "error");
      setTimeout(() => {
        this.lives = 3;
        this.score = Math.floor(this.score * 0.5);
        this.initializePuzzleGrid();
        window.transitionToSection("start");
      }, 2000);
    } else {
      window.showNotification("Life Lost", `You have ${this.lives} lives remaining.`, "error");
    }
  }

  startHintCooldown() {
    const hintButton = document.getElementById("hint-button");
    if (!hintButton) return;

    setInterval(() => {
      if (this.hintCooldown > 0) {
        this.hintCooldown--;
        hintButton.disabled = this.hintCooldown > 0;
        hintButton.textContent = this.hintCooldown > 0 ? `Hint (${this.hintCooldown}s)` : "Request Hint";
      }
    }, 1000);

    hintButton.addEventListener("click", () => {
      if (this.hintCooldown > 0) return;
      this.provideHint();
      this.hintCooldown = 30; // 30-second cooldown
      hintButton.disabled = true;
      hintButton.textContent = `Hint (${this.hintCooldown}s)`;
    });
  }

  provideHint() {
    const modal = document.getElementById("puzzle-modal");
    if (!modal.classList.contains("active")) return;

    const puzzleType = this.puzzles.find(p => p.id === modal.querySelector(".modal-body").firstElementChild?.classList[0].split('-')[0])?.type;

    let hintMessage = "";
    switch (puzzleType) {
      case "memory":
        hintMessage = "Focus on the first few cells of the sequence.";
        break;
      case "logic":
        hintMessage = "Ensure each node connects to the next in the path.";
        break;
      case "reflex":
        hintMessage = "Stay alert—the targets will speed up!";
        break;
      case "pattern":
        hintMessage = "Look for a mathematical sequence, like Fibonacci.";
        break;
      default:
        hintMessage = "No hint available.";
    }

    window.showNotification("Hint", hintMessage, "info");
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    console.log("Settings updated:", this.settings);

    if (newSettings.hasOwnProperty("soundEnabled")) {
      if (typeof toggleSound === "function") {
        toggleSound(newSettings.soundEnabled);
      }
    }

    if (newSettings.hasOwnProperty("particleEffects")) {
      document.body.classList.toggle("particles-disabled", !newSettings.particleEffects);
    }

    this.saveUserData();
  }
}

const brainwarpEngine = new BrainwarpEngine();

document.addEventListener("DOMContentLoaded", () => {
  brainwarpEngine.initialize();
});

window.brainwarpEngine = brainwarpEngine;