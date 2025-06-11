class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matches = 0;
        this.moves = 0;
        this.gameTime = 0;
        this.timer = null;
        this.gameStarted = false;
        this.lockBoard = false;

        // Enhanced emoji symbols for better visual appeal
        this.symbols = [
            '🌟', '🌟', '🎯', '🎯', '🚀', '🚀', '💎', '💎',
            '🎨', '🎨', '🎪', '🎪', '🎭', '🎭', '🎸', '🎸'
        ];

        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.shuffleCards();
        this.createGameBoard();
        this.resetStats();
    }

    shuffleCards() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.symbols.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.symbols[i], this.symbols[j]] = [this.symbols[j], this.symbols[i]];
        }
    }

    createGameBoard() {
        const gameGrid = document.getElementById('gameGrid');
        gameGrid.innerHTML = '';
        
        this.symbols.forEach((symbol, index) => {
            const card = this.createCard(symbol, index);
            gameGrid.appendChild(card);
        });
    }

    createCard(symbol, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="card-face card-front"></div>
            <div class="card-face card-back">${symbol}</div>
        `;
        
        card.addEventListener('click', () => this.handleCardClick(card));
        return card;
    }

    handleCardClick(card) {
        // Prevent clicking if board is locked or card is already flipped/matched
        if (this.lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        // Start timer on first click
        if (!this.gameStarted) {
            this.startTimer();
            this.gameStarted = true;
        }

        this.flipCard(card);
        this.flippedCards.push(card);

        // Check for match when two cards are flipped
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateMoves();
            this.checkForMatch();
        }
    }

    flipCard(card) {
        card.classList.add('flipped');
    }

    checkForMatch() {
        const [card1, card2] = this.flippedCards;
        const symbol1 = card1.dataset.symbol;
        const symbol2 = card2.dataset.symbol;

        if (symbol1 === symbol2) {
            this.handleMatch();
        } else {
            this.handleMismatch();
        }
    }

    handleMatch() {
        const [card1, card2] = this.flippedCards;
        
        // Add matched class after a short delay
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.matches++;
            this.updateMatches();
            
            // Check if game is won
            if (this.matches === 8) {
                this.gameWon();
            }
        }, 300);

        this.flippedCards = [];
    }

    handleMismatch() {
        this.lockBoard = true;
        const [card1, card2] = this.flippedCards;
        
        // Add shake animation for visual feedback
        card1.classList.add('shake');
        card2.classList.add('shake');
        
        // Flip cards back after delay
        setTimeout(() => {
            card1.classList.remove('flipped', 'shake');
            card2.classList.remove('flipped', 'shake');
            this.flippedCards = [];
            this.lockBoard = false;
        }, 800);
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.gameTime++;
            this.updateTimer();
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateTimer() {
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = this.gameTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('time').textContent = timeString;
    }

    updateMoves() {
        document.getElementById('moves').textContent = this.moves;
    }

    updateMatches() {
        document.getElementById('matches').textContent = this.matches;
    }

    resetStats() {
        this.matches = 0;
        this.moves = 0;
        this.gameTime = 0;
        this.gameStarted = false;
        this.lockBoard = false;
        this.flippedCards = [];
        
        this.updateMoves();
        this.updateMatches();
        this.updateTimer();
        this.stopTimer();
    }

    gameWon() {
        this.stopTimer();
        
        // Show victory message after a short delay
        setTimeout(() => {
            document.getElementById('finalMoves').textContent = this.moves;
            document.getElementById('finalTime').textContent = document.getElementById('time').textContent;
            document.getElementById('victoryMessage').classList.add('show');
        }, 500);
    }

    setupEventListeners() {
        // New Game button
        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.startNewGame();
        });

        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'n' || e.key === 'N') {
                this.startNewGame();
            } else if (e.key === 'r' || e.key === 'R') {
                this.resetGame();
            }
        });
    }

    startNewGame() {
        // Hide victory message
        document.getElementById('victoryMessage').classList.remove('show');
        
        // Reset game state
        this.resetStats();
        this.shuffleCards();
        this.createGameBoard();
    }

    resetGame() {
        // Reset stats and timer
        this.resetStats();
        
        // Reset all cards
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.classList.remove('flipped', 'matched', 'shake');
        });
    }
}

// Utility functions
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function getRandomEmoji() {
    const emojis = ['🌟', '🎯', '🚀', '💎', '🎨', '🎪', '🎭', '🎸', '🎵', '🎲', '🎈', '🎊'];
    return emojis[Math.floor(Math.random() * emojis.length)];
}

// Global function for victory message button
function startNewGame() {
    if (window.game) {
        window.game.startNewGame();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new MemoryGame();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Handle page visibility change (pause timer when tab is not active)
document.addEventListener('visibilitychange', () => {
    if (window.game) {
        if (document.hidden && window.game.gameStarted) {
            window.game.stopTimer();
        } else if (!document.hidden && window.game.gameStarted && window.game.matches < 8) {
            window.game.startTimer();
        }
    }
});

// Add sound effects (optional - requires audio files)
class SoundManager {
    constructor() {
        this.sounds = {
            flip: null,
            match: null,
            win: null,
            mismatch: null
        };
        this.enabled = false;
    }

    loadSounds() {
        // Uncomment and provide audio files to enable sounds
        
        // this.sounds.flip = new Audio('sounds\strange-notification-36458.mp3');
        // this.sounds.match = new Audio('sounds\sound-1-167181.mp3');
        // this.sounds.win = new Audio('sounds\goodresult-82807.mp3');
        // // this.sounds.mismatch = new Audio('sounds/mismatch.mp3');
        // this.enabled = true;
        
    }

    play(soundName) {
        if (this.enabled && this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(() => {
                // Handle autoplay restrictions
            });
        }
    }
}

// Initialize sound manager
const soundManager = new SoundManager();
soundManager.loadSounds();
