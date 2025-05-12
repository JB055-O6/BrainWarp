document.addEventListener("DOMContentLoaded", () => {
  initializeTransitions();
});

function initializeTransitions() {
  const navButtons = document.querySelectorAll(".neural-nav .pulse-button");
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetSection = button.getAttribute("data-section");
      transitionToSection(targetSection);
    });
  });

  const startButton = document.getElementById("start-interface");
  if (startButton) {
    startButton.addEventListener("click", () => {
      transitionToSection("puzzles");
    });
  }
}

function transitionToSection(sectionId) {
  const currentSection = document.querySelector(".active-section");
  const targetSection = document.getElementById(sectionId);
  if (!currentSection || !targetSection || currentSection === targetSection) return;

  playSound("hover");

  // Reset the current section's elements to ensure they can be re-animated
  const currentElements = currentSection.querySelectorAll(".neural-text, .neural-capsule, .neural-panel, .puzzle-card, .achievement-item, .profile-stat, .leaderboard-entry, .glow-button");
  if (currentElements.length > 0) {
    gsap.set(currentElements, { opacity: 1, y: 0, scale: 1, display: "block" });
  }

  gsap.to(currentSection, {
    opacity: 0,
    y: -20,
    duration: 0.5,
    ease: "power2.in",
    onComplete: () => {
      currentSection.classList.remove("active-section");
      targetSection.classList.add("active-section");

      // Reset the target section's elements before animating
      const targetElements = targetSection.querySelectorAll(".neural-text, .neural-capsule, .neural-panel, .puzzle-card, .achievement-item, .profile-stat, .leaderboard-entry, .glow-button");
      if (targetElements.length > 0) {
        gsap.set(targetElements, { opacity: 0, y: 0, scale: 1, display: "block" });
      }

      gsap.fromTo(
        targetSection,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            setTimeout(() => animateActiveSection(sectionId), 100);
          },
        },
      );
    },
  });
}

function animateActiveSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  // General animation for common elements
  const elements = section.querySelectorAll(".neural-text, .neural-capsule, .neural-panel, .puzzle-card, .achievement-item");
  if (elements.length > 0) {
    gsap.fromTo(
      elements,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    );
  }

  if (sectionId === "start") {
    const capsule = section.querySelector(".neural-capsule");
    const text = section.querySelectorAll(".neural-text");
    const button = section.querySelector(".glow-button");

    if (capsule) {
      gsap.fromTo(
        capsule,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
    if (text.length > 0) {
      gsap.fromTo(
        text,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
      );
    }
    if (button) {
      gsap.fromTo(
        button,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, delay: 0.6, ease: "elastic.out(1, 0.5)" }
      );
    } else {
      console.warn("Start interface button (.glow-button) not found in start section.");
    }
  } else if (sectionId === "about") {
    const panel = section.querySelector(".neural-panel");
    const infoCells = section.querySelectorAll(".info-cell");

    if (panel) {
      gsap.fromTo(
        panel,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    }

    // Add a slight delay to ensure DOM is ready
    setTimeout(() => {
      const infoCellsAfterDelay = section.querySelectorAll(".info-cell");
      if (infoCellsAfterDelay.length > 0) {
        gsap.fromTo(
          infoCellsAfterDelay,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "back.out(1.7)",
            onComplete: () => {
              // Ensure opacity is set to 1 after animation
              gsap.set(infoCellsAfterDelay, { opacity: 1 });
            },
          }
        );
      } else {
        console.warn("No info cells found to animate in about section.");
      }
    }, 200);
  } else if (sectionId === "puzzles") {
    const container = section.querySelector(".puzzle-container");
    if (container) {
      gsap.fromTo(
        container,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }

    // Animate puzzle cards after they're loaded
    const animatePuzzleCards = () => {
      const puzzleCards = section.querySelectorAll(".puzzle-card");
      if (puzzleCards.length > 0) {
        gsap.fromTo(
          puzzleCards,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "back.out(1.7)" }
        );
      } else {
        console.warn("No puzzle cards found to animate.");
      }
    };

    // Check if puzzle cards are already loaded
    const puzzleList = document.getElementById("puzzle-list");
    if (puzzleList && puzzleList.children.length > 0) {
      animatePuzzleCards();
    } else {
      window.addEventListener("puzzleCardsLoaded", animatePuzzleCards, { once: true });
    }
  } else if (sectionId === "profile") {
    const panel = section.querySelector(".neural-panel");
    const stats = section.querySelectorAll(".profile-stat");
    const achievements = section.querySelectorAll(".achievement-item");

    if (panel) {
      gsap.fromTo(
        panel,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    }
    if (stats.length > 0) {
      gsap.fromTo(
        stats,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" }
      );
    }
    if (achievements.length > 0) {
      gsap.fromTo(
        achievements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, delay: 0.5, ease: "back.out(1.7)" }
      );
    }
  } else if (sectionId === "leaderboard") {
    const panel = section.querySelector(".neural-panel");
    const entries = section.querySelectorAll(".leaderboard-entry");

    if (panel) {
      gsap.fromTo(
        panel,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
      );
    }
    if (entries.length > 0) {
      gsap.fromTo(
        entries,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" }
      );
    }
  }
}

function openModal(modalId, content) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  // Set content if provided (e.g., for puzzle modals, content will be used to trigger loading)
  if (content && modal.querySelector(".modal-body")) {
    modal.querySelector(".modal-body").innerHTML = content;
  }

  modal.classList.add("active");
  const modalContent = modal.querySelector(".modal-content");
  if (modalContent) {
    gsap.fromTo(
      modalContent,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
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
        // Only clear the modal body if it's not a puzzle modal being reused
        if (modalId !== "puzzle-modal" && modal.querySelector(".modal-body")) {
          modal.querySelector(".modal-body").innerHTML = "";
        }
      },
    });
  } else {
    modal.classList.remove("active");
  }

  playSound("click");
}

// Specific function for opening puzzle modals
function openPuzzleModal(puzzleId, puzzleTitle) {
  const modal = document.getElementById("puzzle-modal");
  if (!modal) return;

  // Set the modal title
  const modalTitle = modal.querySelector(".modal-title");
  if (modalTitle) {
    modalTitle.textContent = puzzleTitle || "Neural Challenge";
  }

  // Open the modal without setting content (let loadPuzzleContent handle it)
  openModal("puzzle-modal");

  // Load the puzzle content into the modal body
  const modalBody = modal.querySelector(".modal-body");
  if (modalBody && typeof loadPuzzleContent === "function") {
    loadPuzzleContent(puzzleId, modalBody);
  }
}

window.transitionToSection = transitionToSection;
window.openModal = openModal;
window.closeModal = closeModal;
window.openPuzzleModal = openPuzzleModal;