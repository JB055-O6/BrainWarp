// Level Loader
class LevelLoader {
  constructor(engine) {
    this.engine = engine;
    this.currentPuzzle = null;
    this.puzzleModules = {};
    this.loadingTimeout = null; // Track ongoing loading timeout
    
    // Initialize modules
    this.initializeModules();
  }
  
  initializeModules() {
    // Register puzzle modules
    this.registerModule('memory', this.createMemoryPuzzle);
    this.registerModule('logic', this.createLogicPuzzle);
    this.registerModule('reflex', this.createReflexPuzzle);
    this.registerModule('pattern', this.createPatternPuzzle);
  }
  
  registerModule(type, createFunction) {
    this.puzzleModules[type] = createFunction.bind(this);
  }
  
  loadPuzzle(puzzleId, container) {
    // Cancel any ongoing loading operation
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }

    // Find the puzzle in the engine
    const puzzle = this.engine.puzzles.find(p => p.id === puzzleId);
    if (!puzzle) {
      console.error(`Puzzle not found: ${puzzleId}`);
      container.innerHTML = '<div class="error-message">Puzzle not found</div>';
      return;
    }
    
    this.currentPuzzle = puzzle;
    
    // Show loading state
    container.innerHTML = `
      <div class="puzzle-loading">
        <div class="loading-spinner"></div>
        <p>Initializing neural challenge...</p>
      </div>
    `;
    
    // Simulate loading time
    this.loadingTimeout = setTimeout(() => {
      // Create the puzzle based on its type
      const createFunction = this.puzzleModules[puzzle.type];
      if (createFunction) {
        createFunction(puzzle, container);
      } else {
        container.innerHTML = '<div class="error-message">Unknown puzzle type</div>';
      }
      this.loadingTimeout = null;
    }, 1000);
  }
  
  createMemoryPuzzle(puzzle, container) {
    container.innerHTML = `
      <div class="memory-puzzle puzzle-module">
        <div class="puzzle-instructions">
          <p>Memorize the sequence of neural pulses, then repeat it back in the correct order.</p>
        </div>
        
        <div class="memory-grid">
          <div class="memory-cell" data-index="0"></div>
          <div class="memory-cell" data-index="1"></div>
          <div class="memory-cell" data-index="2"></div>
          <div class="memory-cell" data-index="3"></div>
          <div class="memory-cell" data-index="4"></div>
          <div class="memory-cell" data-index="5"></div>
          <div class="memory-cell" data-index="6"></div>
          <div class="memory-cell" data-index="7"></div>
          <div class="memory-cell" data-index="8"></div>
        </div>
        
        <div class="puzzle-controls">
          <div class="puzzle-status">
            <span class="status-label">Level:</span>
            <span class="status-value">1</span>
          </div>
          <button class="neural-button" id="start-memory">Begin Sequence</button>
        </div>
      </div>
    `;
    
    // Initialize memory puzzle logic
    this.initMemoryPuzzle(container);
  }
  
  initMemoryPuzzle(container) {
    const cells = container.querySelectorAll('.memory-cell');
    const startButton = container.querySelector('#start-memory');
    const statusValue = container.querySelector('.status-value');
    
    let sequence = [];
    let playerSequence = []; // Changed to let to allow resetting
    let level = 1;
    let isPlaying = false;
    let canInput = false;
    
    // Generate a random sequence
    const generateSequence = () => {
      sequence = [];
      for (let i = 0; i < level + 2; i++) {
        sequence.push(Math.floor(Math.random() * cells.length));
      }
    };
    
    // Play the sequence
    const playSequence = async () => {
      canInput = false;
      
      for (let i = 0; i < sequence.length; i++) {
        const cellIndex = sequence[i];
        const cell = cells[cellIndex];
        
        // Highlight the cell
        cell.classList.add('active');
        
        // Play sound if enabled
        let playSound = window.brainwarpEngine.playSound;
        if (this.engine.settings.soundEnabled && typeof playSound === 'function') {
          playSound('memory-tone-' + (cellIndex % 3));
        }
        
        // Wait
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Remove highlight
        cell.classList.remove('active');
        
        // Wait between cells
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      canInput = true;
    };
    
    // Check player sequence
    const checkSequence = () => {
      for (let i = 0; i < playerSequence.length; i++) {
        if (playerSequence[i] !== sequence[i]) {
          return false;
        }
      }
      return true;
    };
    
    // Start button click
    startButton.addEventListener('click', () => {
      if (isPlaying) return;
      
      isPlaying = true;
      startButton.disabled = true;
      startButton.textContent = 'Watching...';
      
      // Generate and play sequence
      generateSequence();
      playSequence().then(() => {
        startButton.textContent = 'Repeat Sequence';
        playerSequence = [];
      });
    });
    
    // Cell click
    cells.forEach(cell => {
      cell.addEventListener('click', () => {
        if (!canInput) return;
        
        const index = Number.parseInt(cell.dataset.index);
        
        // Highlight the cell
        cell.classList.add('active');
        setTimeout(() => cell.classList.remove('active'), 300);
        
        // Play sound if enabled
        const playSound = window.brainwarpEngine.playSound;
        if (this.engine.settings.soundEnabled && typeof playSound === 'function') {
          playSound('memory-tone-' + (index % 3));
        }
        
        // Add to player sequence
        playerSequence.push(index);
        
        // Check if sequence is complete
        if (playerSequence.length === sequence.length) {
          canInput = false;
          
          // Check if correct
          if (checkSequence()) {
            // Success
            level++;
            statusValue.textContent = level;
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Sequence correct! Next level...';
            container.querySelector('.puzzle-module').appendChild(successMessage);
            
            // Remove after delay
            setTimeout(() => {
              successMessage.remove();
              
              // Reset for next level
              isPlaying = false;
              startButton.disabled = false;
              startButton.textContent = 'Begin Sequence';
              playerSequence = []; // Reset player sequence
              
              // Update engine score
              this.engine.completePuzzle(this.currentPuzzle.id, level * 10);
            }, 1500);
          } else {
            // Failure
            const failMessage = document.createElement('div');
            failMessage.className = 'fail-message';
            failMessage.textContent = 'Sequence incorrect! Try again.';
            container.querySelector('.puzzle-module').appendChild(failMessage);
            
            // Remove after delay
            setTimeout(() => {
              failMessage.remove();
              
              // Reset
              isPlaying = false;
              startButton.disabled = false;
              startButton.textContent = 'Begin Sequence';
              playerSequence = []; // Reset player sequence
            }, 1500);
          }
        }
      });
    });
  }
  
  createLogicPuzzle(puzzle, container) {
    container.innerHTML = `
      <div class="logic-puzzle puzzle-module">
        <div class="puzzle-instructions">
          <p>Connect the neural pathways to complete the circuit. Click on nodes to rotate connections.</p>
        </div>
        
        <div class="logic-grid">
          <div class="logic-row">
            <div class="logic-node source" data-type="source"></div>
            <div class="logic-node path" data-type="path" data-rotation="0"></div>
            <div class="logic-node path" data-type="path" data-rotation="0"></div>
          </div>
          <div class="logic-row">
            <div class="logic-node path" data-type="path" data-rotation="0"></div>
            <div class="logic-node path" data-type="path" data-rotation="0"></div>
            <div class="logic-node path" data-type="path" data-rotation="0"></div>
          </div>
          <div class="logic-row">
            <div class="logic-node path" data-type="path" data-rotation="0"></div>
            <div class="logic-node path" data-type="path" data-rotation="0"></div>
            <div class="logic-node target" data-type="target"></div>
          </div>
        </div>
        
        <div class="puzzle-controls">
          <button class="neural-button" id="reset-logic">Reset Circuit</button>
          <button class="neural-button" id="check-logic">Verify Circuit</button>
        </div>
      </div>
    `;
    
    // Initialize logic puzzle
    this.initLogicPuzzle(container);
  }
  
  initLogicPuzzle(container) {
    const nodes = container.querySelectorAll('.logic-node');
    const resetButton = container.querySelector('#reset-logic');
    const checkButton = container.querySelector('#check-logic');
    
    // Add rotation functionality to path nodes
    nodes.forEach(node => {
      if (node.dataset.type === 'path') {
        node.addEventListener('click', () => {
          // Rotate the node
          let rotation = Number.parseInt(node.dataset.rotation);
          rotation = (rotation + 90) % 360;
          node.dataset.rotation = rotation;
          
          // Update visual rotation
          node.style.transform = `rotate(${rotation}deg)`;
          
          // Play sound if enabled
          const playSound = window.brainwarpEngine.playSound;
          if (this.engine.settings.soundEnabled && typeof playSound === 'function') {
            playSound('click');
          }
        });
      }
    });
    
    // Reset button
    resetButton.addEventListener('click', () => {
      nodes.forEach(node => {
        if (node.dataset.type === 'path') {
          node.dataset.rotation = '0';
          node.style.transform = 'rotate(0deg)';
        }
      });
    });
    
    // Check button
    checkButton.addEventListener('click', () => {
      // This would normally check if the circuit is complete
      // For this demo, we'll just simulate success
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = 'Circuit complete! Neural pathway established.';
      container.querySelector('.puzzle-module').appendChild(successMessage);
      
      // Remove after delay
      setTimeout(() => {
        successMessage.remove();
        
        // Update engine score
        this.engine.completePuzzle(this.currentPuzzle.id, 50);
      }, 1500);
    });
  }
  
  createReflexPuzzle(puzzle, container) {
    container.innerHTML = `
      <div class="reflex-puzzle puzzle-module">
        <div class="puzzle-instructions">
          <p>Click on the neural nodes as quickly as possible when they activate.</p>
        </div>
        
        <div class="reflex-arena">
          <div class="reflex-target"></div>
        </div>
        
        <div class="puzzle-controls">
          <div class="puzzle-status">
            <span class="status-label">Score:</span>
            <span class="status-value" id="reflex-score">0</span>
          </div>
          <div class="puzzle-status">
            <span class="status-label">Time:</span>
            <span class="status-value" id="reflex-time">30</span>s
          </div>
          <button class="neural-button" id="start-reflex">Start Challenge</button>
        </div>
      </div>
    `;
    
    // Initialize reflex puzzle
    this.initReflexPuzzle(container);
  }
  
  initReflexPuzzle(container) {
    const arena = container.querySelector('.reflex-arena');
    const target = container.querySelector('.reflex-target');
    const startButton = container.querySelector('#start-reflex');
    const scoreDisplay = container.querySelector('#reflex-score');
    const timeDisplay = container.querySelector('#reflex-time');
    
    let score = 0;
    let timeLeft = 30;
    let gameInterval;
    let isPlaying = false;
    
    // Position target randomly
    const positionTarget = () => {
      const arenaRect = arena.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      
      const maxX = arenaRect.width - targetRect.width;
      const maxY = arenaRect.height - targetRect.height;
      
      const x = Math.floor(Math.random() * maxX);
      const y = Math.floor(Math.random() * maxY);
      
      target.style.left = `${x}px`;
      target.style.top = `${y}px`;
      
      // Make target active
      target.classList.add('active');
      
      // Set timeout to hide if not clicked
      setTimeout(() => {
        if (target.classList.contains('active')) {
          target.classList.remove('active');
          positionTarget();
        }
      }, 1500);
    };
    
    // Start button click
    startButton.addEventListener('click', () => {
      if (isPlaying) return;
      
      isPlaying = true;
      score = 0;
      timeLeft = 30;
      scoreDisplay.textContent = score;
      timeDisplay.textContent = timeLeft;
      startButton.disabled = true;
      
      // Start game
      positionTarget();
      
      // Start timer
      gameInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
          // End game
          clearInterval(gameInterval);
          target.classList.remove('active');
          isPlaying = false;
          startButton.disabled = false;
          
          // Update engine score
          this.engine.completePuzzle(this.currentPuzzle.id, score);
          
          // Show end message
          const endMessage = document.createElement('div');
          endMessage.className = 'success-message';
          endMessage.textContent = `Challenge complete! Final score: ${score}`;
          container.querySelector('.puzzle-module').appendChild(endMessage);
          
          // Remove after delay
          setTimeout(() => {
            endMessage.remove();
          }, 3000);
        }
      }, 1000);
    });
    
    // Target click
    target.addEventListener('click', () => {
      if (!isPlaying || !target.classList.contains('active')) return;
      
      // Increment score
      score++;
      scoreDisplay.textContent = score;
      
      // Play sound if enabled
      let playSound = window.brainwarpEngine.playSound;
      if (this.engine.settings.soundEnabled && typeof playSound === 'function') {
        playSound('target-hit');
      }
      
      // Hide target and reposition
      target.classList.remove('active');
      setTimeout(positionTarget, 500);
    });
  }
  
  createPatternPuzzle(puzzle, container) {
    container.innerHTML = `
      <div class="pattern-puzzle puzzle-module">
        <div class="puzzle-instructions">
          <p>Identify the pattern and select the next element in the sequence.</p>
        </div>
        
        <div class="pattern-sequence">
          <div class="pattern-item" data-value="1"></div>
          <div class="pattern-item" data-value="2"></div>
          <div class="pattern-item" data-value="3"></div>
          <div class="pattern-item" data-value="5"></div>
          <div class="pattern-item" data-value="8"></div>
          <div class="pattern-item pattern-question">?</div>
        </div>
        
        <div class="pattern-options">
          <div class="pattern-option" data-value="11"></div>
          <div class="pattern-option" data-value="12"></div>
          <div class="pattern-option" data-value="13"></div>
          <div class="pattern-option" data-value="14"></div>
        </div>
        
        <div class="puzzle-controls">
          <button class="neural-button" id="check-pattern">Submit Answer</button>
        </div>
      </div>
    `;
    
    // Initialize pattern puzzle
    this.initPatternPuzzle(container);
  }
  
  initPatternPuzzle(container) {
    const options = container.querySelectorAll('.pattern-option');
    const checkButton = container.querySelector('#check-pattern');
    
    let selectedOption = null;
    
    // Option click
    options.forEach(option => {
      option.addEventListener('click', () => {
        // Remove selected class from all options
        options.forEach(opt => opt.classList.remove('selected'));
        
        // Add selected class to clicked option
        option.classList.add('selected');
        selectedOption = option;
        
        // Play sound if enabled
        const playSound = window.brainwarpEngine.playSound;
        if (this.engine.settings.soundEnabled && typeof playSound === 'function') {
          playSound('select');
        }
      });
    });
    
    // Check button click
    checkButton.addEventListener('click', () => {
      if (!selectedOption) return;
      
      // Check if correct (Fibonacci sequence: next is 13)
      const isCorrect = selectedOption.dataset.value === '13';
      
      if (isCorrect) {
        // Success
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Pattern identified correctly!';
        container.querySelector('.puzzle-module').appendChild(successMessage);
        
        // Update engine score
        this.engine.completePuzzle(this.currentPuzzle.id, 75);
        
        // Remove after delay
        setTimeout(() => {
          successMessage.remove();
        }, 2000);
      } else {
        // Failure
        const failMessage = document.createElement('div');
        failMessage.className = 'fail-message';
        failMessage.textContent = 'Incorrect pattern identification. Try again.';
        container.querySelector('.puzzle-module').appendChild(failMessage);
        
        // Remove after delay
        setTimeout(() => {
          failMessage.remove();
        }, 2000);
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait for engine to be initialized
  window.addEventListener('brainwarp:initialized', () => {
    // Create level loader
    const levelLoader = new LevelLoader(window.brainwarpEngine);
    
    // Expose to global scope
    window.levelLoader = levelLoader;
    
    // Override the loadPuzzleContent function
    window.loadPuzzleContent = (puzzleId, container) => {
      levelLoader.loadPuzzle(puzzleId, container);
    };
  });
});