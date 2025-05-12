document.addEventListener("DOMContentLoaded", () => {
  initAnimations();
  setupInteractiveElements();
});

function initAnimations() {
  // Animate the header on page load
  const header = document.querySelector(".neural-header");
  if (header) {
    gsap.from(header, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }

  const logoGlyph = document.querySelector(".logo-glyph");
  if (logoGlyph) {
    gsap.from(logoGlyph, {
      scale: 0,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: "elastic.out(1, 0.5)",
    });
  }

  const logoText = document.querySelector(".logo-text");
  if (logoText) {
    gsap.from(logoText, {
      x: -20,
      opacity: 0,
      duration: 1,
      delay: 0.7,
      ease: "power2.out",
    });
  }

  const navButtons = document.querySelectorAll(".neural-nav .pulse-button");
  if (navButtons.length > 0) {
    gsap.from(navButtons, {
      opacity: 0,
      x: 20,
      stagger: 0.1,
      duration: 0.8,
      delay: 1,
      ease: "power2.out",
    });
  }

  // Trigger section animations for the initial active section
  const initialSection = document.querySelector(".active-section");
  if (initialSection) {
    window.animateActiveSection(initialSection.id);
  }
}

function setupInteractiveElements() {
  const buttons = document.querySelectorAll(".pulse-button, .glow-button, .neural-button");
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });
      if (button.classList.contains("pulse-button")) {
        gsap.to(button, {
          boxShadow: "0 0 15px var(--glow-color)",
          repeat: -1,
          yoyo: true,
          duration: 0.8,
        });
      }
    });

    button.addEventListener("mouseleave", () => {
      gsap.to(button, {
        scale: 1,
        boxShadow: "0 0 5px var(--glow-color)",
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

  const puzzleCards = document.querySelectorAll(".puzzle-card");
  puzzleCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      if (card.classList.contains("unlocked")) {
        gsap.to(card, {
          scale: 1.03,
          boxShadow: "0 5px 20px var(--glow)",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        scale: 1,
        boxShadow: "0 0 0 transparent",
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

  const statItems = document.querySelectorAll(".stat-item");
  statItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      gsap.to(item, {
        y: -3,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(item, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });
}