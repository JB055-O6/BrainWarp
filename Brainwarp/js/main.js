// import { gsap } from "gsap";

document.addEventListener("DOMContentLoaded", () => {
  showLoadingScreen();
  initBackgroundCanvas();
  setupNavigation();
  setupModal();
  showSection("start");
  setupSettings();
  setupTooltips();
  setupNotifications();
  setupAchievements();
  setupLeaderboard();
  initUserProfile();

  setTimeout(hideLoadingScreen, 2000);
});

function showLoadingScreen() {
  const loadingScreen = document.createElement("div");
  loadingScreen.className = "loading-screen";
  loadingScreen.innerHTML = `
    <div class="loading-logo">
      <div class="loading-logo-glyph"></div>
    </div>
    <div class="loading-text">BRAINWARP</div>
    <div class="loading-progress">
      <div class="loading-progress-fill" id="loading-progress-fill"></div>
    </div>
    <div class="loading-status" id="loading-status">Initializing neural interface...</div>
  `;
  document.body.appendChild(loadingScreen);

  let progress = 0;
  const progressFill = document.getElementById("loading-progress-fill");
  const statusText = document.getElementById("loading-status");
  const loadingSteps = [
    "Initializing neural interface...",
    "Calibrating synaptic connections...",
    "Loading cognitive modules...",
    "Establishing neural pathways...",
    "Activating brain-computer interface...",
  ];

  const loadingInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;

    progressFill.style.width = `${progress}%`;
    const stepIndex = Math.min(Math.floor(progress / 20), loadingSteps.length - 1);
    statusText.textContent = loadingSteps[stepIndex];

    if (progress === 100) clearInterval(loadingInterval);
  }, 400);
}

function hideLoadingScreen() {
  const loadingScreen = document.querySelector(".loading-screen");
  if (loadingScreen) {
    loadingScreen.classList.add("hidden");
    setTimeout(() => loadingScreen.remove(), 1000);
  }
}

function initBackgroundCanvas() {
  const canvas = document.getElementById("background-canvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const stars = [];
  const starCount = 200;
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      color: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.5 + 0.5})`,
      speed: Math.random() * 0.5 + 0.1,
    });
  }

  const nodes = [];
  const nodeCount = 15;
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 2,
      color: i % 3 === 0 ? "rgba(0, 240, 255, 0.7)" : i % 3 === 1 ? "rgba(255, 0, 230, 0.7)" : "rgba(125, 0, 255, 0.7)",
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      connections: [],
    });
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const connectionCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < connectionCount; j++) {
      const targetIndex = Math.floor(Math.random() * nodes.length);
      if (targetIndex !== i && !node.connections.includes(targetIndex)) {
        node.connections.push(targetIndex);
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(5, 5, 24, 1)");
    gradient.addColorStop(1, "rgba(10, 10, 32, 1)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.fill();

      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      for (let j = 0; j < node.connections.length; j++) {
        const targetNode = nodes[node.connections[j]];
        const distance = Math.sqrt(Math.pow(targetNode.x - node.x, 2) + Math.pow(targetNode.y - node.y, 2));
        if (distance < 300) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          const opacity = 1 - distance / 300;
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + 3, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(node.x, node.y, node.radius, node.x, node.y, node.radius + 5);
      gradient.addColorStop(0, node.color);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fill();

      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
    }

    requestAnimationFrame(animate);
  }

  animate();
}

function setupNavigation() {
  const navButtons = document.querySelectorAll(".neural-nav .pulse-button");
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.getAttribute("data-section");
      transitionToSection(section);
      playSound("click");
    });
  });

  const startButton = document.getElementById("start-interface");
  if (startButton) {
    startButton.addEventListener("click", () => {
      transitionToSection("puzzles");
      playSound("success");
      showAchievement("Neural Link Established", "You’ve successfully initiated your first neural connection.");
    });
  }
}

function setupModal() {
  const modals = document.querySelectorAll(".neural-modal");
  modals.forEach((modal) => {
    const closeButton = modal.querySelector(".close-button");
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        closeModal(modal.id);
      });
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal.id);
    });
  });
}

function transitionToSection(sectionId) {
  const currentSection = document.querySelector(".active-section");
  const targetSection = document.getElementById(sectionId);
  if (!currentSection || !targetSection || currentSection === targetSection) return;

  const navButtons = document.querySelectorAll(".neural-nav .pulse-button");
  navButtons.forEach((button) => {
    button.classList.toggle("active", button.getAttribute("data-section") === sectionId);
  });

  gsap.to(currentSection, {
    opacity: 0,
    y: -20,
    duration: 0.5,
    ease: "power2.in",
    onComplete: () => {
      currentSection.classList.remove("active-section");
      targetSection.classList.add("active-section");
      gsap.fromTo(
        targetSection,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => animateActiveSection(sectionId),
        },
      );
    },
  });
}

function animateActiveSection(sectionId) {
  gsap.killTweensOf(".neural-capsule, .neural-panel, .puzzle-container, .info-cell, .neural-puzzle-card");

  if (sectionId === "start") {
    gsap.from(".neural-capsule", { opacity: 0, y: 30, duration: 1, ease: "power3.out" });
    gsap.from(".neural-text", { opacity: 0, y: 20, duration: 0.8, delay: 0.3, ease: "power2.out" });
    gsap.from(".glow-button", { scale: 0.8, opacity: 0, duration: 1, delay: 0.6, ease: "elastic.out(1, 0.5)" });
  } else if (sectionId === "about") {
    gsap.from(".neural-panel", { opacity: 0, scale: 0.95, duration: 0.8, ease: "power2.out" });
    gsap.from(".info-cell", { opacity: 0, y: 30, stagger: 0.15, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" });
  } else if (sectionId === "puzzles") {
    gsap.from(".puzzle-container", { opacity: 0, y: 30, duration: 0.8, ease: "power2.out" });
    gsap.from(".puzzle-card", { opacity: 0, y: 30, stagger: 0.1, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" });
  } else if (sectionId === "profile") {
    gsap.from(".neural-panel", { opacity: 0, scale: 0.95, duration: 0.8, ease: "power2.out" });
    gsap.from(".profile-stat", { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" });
    gsap.from(".achievement-item", { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, delay: 0.5, ease: "back.out(1.7)" });
  } else if (sectionId === "leaderboard") {
    gsap.from(".neural-panel", { opacity: 0, scale: 0.95, duration: 0.8, ease: "power2.out" });
    gsap.from(".leaderboard-entry", { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" });
  }
}

function openModal(modalId, content) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  if (content && modal.querySelector(".modal-body")) {
    modal.querySelector(".modal-body").innerHTML = content;
  }

  modal.classList.add("active");
  const modalContent = modal.querySelector(".modal-content");
  if (modalContent) {
    gsap.fromTo(
      modalContent,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
    );
  }

  playSound("select");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  const modalContent = modal.querySelector(".modal-content");
  if (modalContent) {
    gsap.to(modalContent, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        modal.classList.remove("active");
      },
    });
  } else {
    modal.classList.remove("active");
  }

  playSound("click");
}

function setupSettings() {
  if (!document.querySelector(".settings-panel")) {
    const settingsPanel = document.createElement("div");
    settingsPanel.className = "settings-panel";
    settingsPanel.innerHTML = `
      <div class="settings-toggle" data-tooltip="Settings" data-tooltip-position="left"></div>
      <div class="settings-header">
        <div class="settings-title">Neural Interface Settings</div>
      </div>
      <div class="settings-group">
        <div class="settings-group-title">Interface</div>
        <div class="settings-option">
          <div class="settings-label">Theme</div>
          <div class="theme-options">
            <div class="theme-option neural active" data-theme="neural"></div>
            <div class="theme-option cyber" data-theme="cyber"></div>
          </div>
        </div>
      </div>
      <div class="settings-group">
        <div class="settings-group-title">Audio</div>
        <div class="settings-option">
          <div class="settings-label">Sound Effects</div>
          <div class="settings-toggle-switch active" data-setting="sound"></div>
        </div>
      </div>
      <div class="settings-group">
        <div class="settings-group-title">Visual</div>
        <div class="settings-option">
          <div class="settings-label">Particle Effects</div>
          <div class="settings-toggle-switch active" data-setting="particles"></div>
        </div>
        <div class="settings-option">
          <div class="settings-label">Reduced Motion</div>
          <div class="settings-toggle-switch" data-setting="reducedMotion"></div>
        </div>
      </div>
    `;
    document.body.appendChild(settingsPanel);

    const settingsToggle = settingsPanel.querySelector(".settings-toggle");
    settingsToggle.addEventListener("click", () => {
      settingsPanel.classList.toggle("active");
      playSound("click");
    });

    const themeOptions = settingsPanel.querySelectorAll(".theme-option");
    themeOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const theme = option.getAttribute("data-theme");
        setTheme(theme);
        themeOptions.forEach((opt) => opt.classList.remove("active"));
        option.classList.add("active");
        playSound("select");
      });
    });

    const toggleSwitches = settingsPanel.querySelectorAll(".settings-toggle-switch");
    toggleSwitches.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        toggle.classList.toggle("active");
        const setting = toggle.getAttribute("data-setting");
        const isActive = toggle.classList.contains("active");
        updateSetting(setting, isActive);
        playSound("click");
      });
    });
  }
}

function setTheme(theme) {
  const themeStylesheet = document.getElementById("theme-stylesheet");
  if (themeStylesheet) {
    themeStylesheet.href = `css/themes/${theme}.css`;
  }
  localStorage.setItem("brainwarp-theme", theme);
  showNotification(
    "Theme Updated",
    `Neural interface theme set to ${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
    "info",
  );
}

function updateSetting(setting, value) {
  if (window.brainwarpEngine) {
    const settings = {};
    settings[setting] = value;
    if (setting === "sound") settings.soundEnabled = value;
    if (setting === "particles") settings.particleEffects = value;
    window.brainwarpEngine.updateSettings(settings);
  }

  if (setting === "sound") {
    if (window.soundSystem) window.soundSystem.setEnabled(value);
  } else if (setting === "particles") {
    document.body.classList.toggle("particles-disabled", !value);
  } else if (setting === "reducedMotion") {
    document.body.classList.toggle("reduced-motion", value);
  }

  const settings = JSON.parse(localStorage.getItem("brainwarp-settings") || "{}");
  settings[setting] = value;
  localStorage.setItem("brainwarp-settings", JSON.stringify(settings));
}

function setupTooltips() {
  const tooltip = document.createElement("div");
  tooltip.className = "neural-tooltip";
  document.body.appendChild(tooltip);

  const tooltipElements = document.querySelectorAll("[data-tooltip]");
  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", (e) => {
      const text = element.getAttribute("data-tooltip");
      const position = element.getAttribute("data-tooltip-position") || "top";
      tooltip.textContent = text;
      tooltip.className = `neural-tooltip ${position}`;

      const rect = element.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      let left, top;

      if (position === "top") {
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        top = rect.top - tooltipRect.height - 10;
      } else if (position === "bottom") {
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        top = rect.bottom + 10;
      } else if (position === "left") {
        left = rect.left - tooltipRect.width - 10;
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
      } else {
        left = rect.right + 10;
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
      }

      left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
      top = Math.max(10, Math.min(top, window.innerHeight - tooltipRect.height - 10));

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
      tooltip.classList.add("active");
    });

    element.addEventListener("mouseleave", () => {
      tooltip.classList.remove("active");
    });
  });
}

function setupNotifications() {
  if (!document.querySelector(".notification-container")) {
    const container = document.createElement("div");
    container.className = "notification-container";
    document.body.appendChild(container);
  }
}

function showNotification(title, message, type = "info") {
  const container = document.querySelector(".notification-container");
  if (!container) return;

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-icon"></div>
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    </div>
    <div class="notification-close"></div>
  `;

  container.appendChild(notification);

  const closeButton = notification.querySelector(".notification-close");
  closeButton.addEventListener("click", () => {
    notification.classList.remove("active");
    setTimeout(() => notification.remove(), 300);
  });

  setTimeout(() => notification.classList.add("active"), 10);
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.remove("active");
      setTimeout(() => {
        if (notification.parentNode) notification.remove();
      }, 300);
    }
  }, 5000);

  if (type === "success") playSound("success");
  else if (type === "error") playSound("error");
  else playSound("select");
}

function setupAchievements() {
  if (!document.querySelector(".achievement-popup")) {
    const popup = document.createElement("div");
    popup.className = "achievement-popup";
    popup.innerHTML = `
      <div class="achievement-icon">🏆</div>
      <div class="achievement-content">
        <div class="achievement-title">Achievement Unlocked</div>
        <div class="achievement-description"></div>
      </div>
    `;
    document.body.appendChild(popup);
  }

  const achievementsGrid = document.getElementById("achievements-grid");
  if (achievementsGrid) {
    const achievements = JSON.parse(localStorage.getItem("brainwarp-achievements") || "[]");
    achievementsGrid.innerHTML = achievements.map(achievement => `
      <div class="achievement-item">
        <div class="achievement-item-title">${achievement.title}</div>
        <div class="achievement-item-description">${achievement.description}</div>
        <div class="achievement-item-date">${new Date(achievement.date).toLocaleDateString()}</div>
      </div>
    `).join("");
  }
}

function showAchievement(title, description) {
  const popup = document.querySelector(".achievement-popup");
  if (!popup) return;

  popup.querySelector(".achievement-title").textContent = title;
  popup.querySelector(".achievement-description").textContent = description;
  popup.classList.add("active");

  playSound("success");
  saveAchievement(title, description);

  setTimeout(() => popup.classList.remove("active"), 5000);

  setupAchievements(); // Refresh achievements grid
}

function saveAchievement(title, description) {
  const achievements = JSON.parse(localStorage.getItem("brainwarp-achievements") || "[]");
  if (!achievements.some(a => a.title === title)) {
    achievements.push({
      title,
      description,
      date: new Date().toISOString(),
    });
    localStorage.setItem("brainwarp-achievements", JSON.stringify(achievements));
  }
}

function setupLeaderboard() {
  const leaderboardEntries = document.getElementById("leaderboard-entries");
  if (!leaderboardEntries) return;

  const userScore = window.brainwarpEngine?.score || 0;
  const mockLeaderboard = [
    { name: "Neural User", score: userScore },
    { name: "CortexBot", score: 500 },
    { name: "SynapseMaster", score: 450 },
    { name: "BrainwaveAI", score: 400 },
    { name: "NeuronStar", score: 350 },
  ].sort((a, b) => b.score - a.score);

  leaderboardEntries.innerHTML = mockLeaderboard.map((entry, index) => `
    <div class="leaderboard-entry">
      <span class="leaderboard-rank">${index + 1}</span>
      <span class="leaderboard-name">${entry.name}</span>
      <span class="leaderboard-score">${entry.score}</span>
    </div>
  `).join("");
}

function initUserProfile() {
  const userData = JSON.parse(localStorage.getItem("brainwarp-user") || "null");
  if (!userData) {
    const defaultUser = {
      name: "Neural User",
      level: 1,
      xp: 0,
      completedPuzzles: 0,
      highScores: {},
      score: 0,
      lives: 3,
    };
    localStorage.setItem("brainwarp-user", JSON.stringify(defaultUser));
  }

  window.brainwarpEngine?.updateUIDisplay();
}

function playSound(name) {
  if (window.soundSystem) window.soundSystem.playSound(name);
}

window.transitionToSection = transitionToSection;
window.openModal = openModal;
window.closeModal = closeModal;
window.showNotification = showNotification;
window.showAchievement = showAchievement;
window.playSound = playSound;
window.showSection = (sectionId) => transitionToSection(sectionId);
window.openPuzzleModal = (puzzleId, title) => {
  const modal = document.getElementById("puzzle-modal");
  if (modal) {
    modal.querySelector("#puzzle-modal-title").textContent = title;
    const container = modal.querySelector(".modal-body");
    if (window.loadPuzzleContent) window.loadPuzzleContent(puzzleId, container);
    openModal("puzzle-modal");
  }
};