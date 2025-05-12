document.addEventListener("DOMContentLoaded", () => {
  initializeCustomButtons();
  initializeNeuralCapsules();
});

function initializeCustomButtons() {
  const glowButtons = document.querySelectorAll(".glow-button");
  glowButtons.forEach((button) => {
    if (!button.querySelector(".button-particles")) {
      const particleContainer = document.createElement("div");
      particleContainer.className = "button-particles";
      button.appendChild(particleContainer);
    }

    button.addEventListener("mouseenter", () => {
      if (window.brainwarpEngine?.settings?.particleEffects === false) return;
      const particleContainer = button.querySelector(".button-particles");
      createButtonParticles(particleContainer);
    });
  });

  const allButtons = document.querySelectorAll(".neural-button, .glow-button, .pulse-button");
  allButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const ripple = document.createElement("span");
      ripple.className = "button-ripple";
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

function createButtonParticles(container) {
  const particleCount = 10;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("span");
    particle.className = "button-particle";
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 4 + 2;
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    container.appendChild(particle);

    if (window.gsap) {
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 50,
        y: (Math.random() - 0.5) * 50,
        opacity: 0,
        duration: 1,
        onComplete: () => particle.remove(),
      });
    }
  }
}

function initializeNeuralCapsules() {
  const capsules = document.querySelectorAll(".neural-capsule");
  capsules.forEach((capsule) => {
    capsule.addEventListener("mousemove", (e) => {
      const rect = capsule.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = (y - centerY) / 20;
      const tiltY = (centerX - x) / 20;

      if (window.gsap) {
        gsap.to(capsule, {
          rotationX: tiltX,
          rotationY: tiltY,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    });

    capsule.addEventListener("mouseleave", () => {
      if (window.gsap) {
        gsap.to(capsule, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    });
  });

  const infoCells = document.querySelectorAll(".info-cell");
  infoCells.forEach((cell) => {
    cell.addEventListener("mouseenter", () => {
      cell.classList.add("cell-glow");
      const icon = cell.querySelector(".cell-icon");
      if (icon && window.gsap) {
        gsap.to(icon, { scale: 1.1, duration: 0.3, ease: "back.out(1.7)" });
      }
    });

    cell.addEventListener("mouseleave", () => {
      cell.classList.remove("cell-glow");
      const icon = cell.querySelector(".cell-icon");
      if (icon && window.gsap) {
        gsap.to(icon, { scale: 1, duration: 0.3, ease: "power2.out" });
      }
    });
  });
}

function createNeuralPuzzleCard(puzzle) {
  const card = document.createElement("div");
  card.className = `neural-puzzle-card ${puzzle.type}-type`;
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
      if (window.brainwarpEngine) window.brainwarpEngine.startPuzzle(puzzle.id);
    });
  }

  return card;
}

window.createNeuralPuzzleCard = createNeuralPuzzleCard;
window.createButtonParticles = createButtonParticles;