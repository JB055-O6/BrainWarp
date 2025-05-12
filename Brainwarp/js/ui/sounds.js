class SoundSystem {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.5;
    this.initializeSounds();
  }

  initializeSounds() {
    this.registerSound("click", [220, 0], 0.1);
    this.registerSound("hover", [440, 0], 0.05);
    this.registerSound("success", [523.25, 659.25, 783.99], 0.2);
    this.registerSound("error", [369.99, 277.18], 0.2);
    this.registerSound("target-hit", [880, 0], 0.1);
    this.registerSound("select", [440, 880], 0.1);
    this.registerSound("memory-tone-0", [261.63, 0], 0.2);
    this.registerSound("memory-tone-1", [329.63, 0], 0.2);
    this.registerSound("memory-tone-2", [392.0, 0], 0.2);
    this.registerSound("level-up", [659.25, 783.99, 1046.5], 0.3);
    this.registerSound("game-over", [277.18, 220, 0], 0.3);
    this.registerSound("hint", [523.25, 0], 0.1);
  }

  registerSound(name, frequencies, duration) {
    this.sounds[name] = { frequencies, duration };
  }

  playSound(name) {
    if (!this.enabled) return;
    const sound = this.sounds[name];
    if (!sound) return;

    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    sound.frequencies.forEach((freq, index) => {
      if (freq === 0) return;
      const oscillator = this.audioContext.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.value = freq;
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = this.volume;
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + sound.duration);
      setTimeout(() => oscillator.stop(), sound.duration * 1000);
    });
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}

const soundSystem = new SoundSystem();
window.soundSystem = soundSystem;
window.playSound = (name) => soundSystem.playSound(name);
window.toggleSound = (enabled) => soundSystem.setEnabled(enabled);