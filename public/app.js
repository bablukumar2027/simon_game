// ================= USER AUTHENTICATION =================
let currentUser = null;
let userHighScore = 0;
let isLoggedIn = false;

// Check user authentication
function checkAuth() {
    fetch("/user")
    .then(res => {
        if (!res.ok) {
            // If not logged in, use local storage
            console.log("User not logged in, using local storage");
            loadLocalUser();
            return Promise.reject("Not authenticated");
        }
        return res.json();
    })
    .then(user => {
        currentUser = user;
        userHighScore = user.highScore || 0;
        isLoggedIn = true;
        document.getElementById("username").innerText = `Welcome, ${user.username}`;
        document.getElementById("highScore").innerText = `Highest Score: ${user.highScore || 0}`;
        
        // Update highScore variable
        highScore = user.highScore || localStorage.getItem('simonHighScore') || 0;
        highScoreDisplay.textContent = highScore;
    })
    .catch(err => {
        console.log("Using offline mode:", err);
        // Use local storage mode
        loadLocalUser();
    });
}

function loadLocalUser() {
    const savedName = localStorage.getItem('simonPlayerName') || "Guest Player";
    userName = savedName;
    usernameDisplay.textContent = userName;
    isLoggedIn = false;
}

// ================= GAME VARIABLES =================
let gameSequence = [];
let playerSequence = [];
let level = 1;
let highScore = localStorage.getItem('simonHighScore') || 0;
let gameActive = false;
let userName = "Guest Player";
let maxLevel = 20; // Max level for progress calculation

// DOM elements
const buttons = document.querySelectorAll('.btn');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const highScoreDisplay = document.getElementById('highScore');
const currentLevelDisplay = document.getElementById('currentLevel');
const gameMessage = document.getElementById('gameMessage');
const sequenceLengthDisplay = document.getElementById('sequenceLength');
const usernameDisplay = document.getElementById('username');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');

// Set initial values
highScoreDisplay.textContent = highScore;
usernameDisplay.textContent = userName;
currentLevelDisplay.textContent = level;
updateProgress();

const params = new URLSearchParams(window.location.search);
    const msg = params.get("msg");

    if (msg === "login") {
        alert("✅ Login successful! Welcome back 🎮");
    }

    if (msg === "registered") {
        alert("🎉 Registration successful! Welcome to Simon Says 🎮");
    }





// Get player name (simple implementation)
function getPlayerName() {
    if (isLoggedIn) return; // Don't ask for name if logged in
    
    const name = prompt("Enter your name:", userName);
    if (name && name.trim() !== "") {
        userName = name.trim();
        usernameDisplay.textContent = userName;
        localStorage.setItem('simonPlayerName', userName);
    }
}

// Update progress bar
function updateProgress() {
    const percent = Math.min((level / maxLevel) * 100, 100);
    progressFill.style.width = `${percent}%`;
    progressPercent.textContent = `${Math.round(percent)}%`;
}

// Show initial message
gameMessage.textContent = "Press START to begin the game!";

// Button sounds
const sounds = {
    1: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-electronic-retro-block-hit-2185.mp3'),
    2: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3'),
    3: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3'),
    4: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3')
};

// Initialize sound fallback
for (let key in sounds) {
    sounds[key].volume = 0.3;
}

// Generate random button ID (1-4)
function getRandomButton() {
    return Math.floor(Math.random() * 4) + 1;
}

// Play sequence
function playSequence() {
    gameMessage.textContent = "Watch the sequence carefully...";
    playerSequence = [];
    let delay = 800;
    
    gameSequence.forEach((btnId, index) => {
        setTimeout(() => {
            activateButton(btnId);
            
            // If this is the last button in sequence, allow player to repeat
            if (index === gameSequence.length - 1) {
                setTimeout(() => {
                    gameMessage.textContent = `Your turn! Repeat the ${gameSequence.length}-step sequence`;
                    gameActive = true;
                }, delay);
            }
        }, delay * index);
    });
}

// Activate button (visual and sound)
function activateButton(btnId) {
    const button = document.getElementById(getButtonColor(btnId));
    button.classList.add('active');
    button.classList.add('flash'); // Add flash effect from second code
    sounds[btnId].currentTime = 0;
    sounds[btnId].play();
    
    setTimeout(() => {
        button.classList.remove('active');
        button.classList.remove('flash');
    }, 500);
}

// Get button color from ID
function getButtonColor(id) {
    switch(id) {
        case 1: return 'red';
        case 2: return 'yellow';
        case 3: return 'blue';
        case 4: return 'green';
        default: return 'red';
    }
}

// Get button ID from color
function getButtonId(color) {
    switch(color) {
        case 'red': return 1;
        case 'yellow': return 2;
        case 'blue': return 3;
        case 'green': return 4;
        default: return 1;
    }
}

// Start game
function startGame() {
    if (gameActive) return;
    
    gameSequence = [];
    playerSequence = [];
    level = 1;
    gameActive = false;
    
    // Add first button to sequence
    gameSequence.push(getRandomButton());
    
    // Update displays
    currentLevelDisplay.textContent = level;
    sequenceLengthDisplay.textContent = gameSequence.length;
    updateProgress();
    
    // Start the sequence
    setTimeout(() => {
        playSequence();
    }, 1000);
    
    gameMessage.textContent = "Get ready...";
    startBtn.innerHTML = '<i class="fas fa-pause-circle"></i> Game Running';
    startBtn.style.background = "linear-gradient(to right, #f59e0b, #d97706)";
}

// Reset game
function resetGame() {
    gameActive = false;
    gameSequence = [];
    playerSequence = [];
    level = 1;
    
    currentLevelDisplay.textContent = level;
    sequenceLengthDisplay.textContent = gameSequence.length;
    updateProgress();
    gameMessage.textContent = "Game reset. Press START to begin!";
    startBtn.innerHTML = '<i class="fas fa-play-circle"></i> Start Game';
    startBtn.style.background = "linear-gradient(to right, #10b981, #059669)";
    
    // Reset button animations
    buttons.forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('flash');
        btn.classList.remove('userflash');
    });
}

// Check player's sequence
function checkSequence() {
    // Check if the player's sequence matches so far
    for (let i = 0; i < playerSequence.length; i++) {
        if (playerSequence[i] !== gameSequence[i]) {
            // Game over
            gameOver();
            return;
        }
    }
    
    // If the player has completed the sequence
    if (playerSequence.length === gameSequence.length) {
        // Level complete
        levelComplete();
    }
}

// Level complete
function levelComplete() {
    gameActive = false;
    level++;
    
    // Update displays
    currentLevelDisplay.textContent = level;
    sequenceLengthDisplay.textContent = gameSequence.length + 1;
    updateProgress();
    
    // Update high score if needed
    if (level - 1 > highScore) {
        highScore = level - 1;
        highScoreDisplay.textContent = highScore;
        
        // Save to localStorage
        localStorage.setItem('simonHighScore', highScore);
        
        // If logged in, save to server
        if (isLoggedIn && level - 1 > userHighScore) {
            saveHighScoreToServer(level - 1);
        }
        
        gameMessage.innerHTML = `<span style="color:#fbbf24">New High Score! Level ${level-1}</span>`;
    } else {
        gameMessage.innerHTML = `<span style="color:#10b981">Level ${level-1} complete! Get ready for level ${level}</span>`;
    }
    
    // Add another button to sequence
    setTimeout(() => {
        gameSequence.push(getRandomButton());
        sequenceLengthDisplay.textContent = gameSequence.length;
        playSequence();
    }, 1500);
}

// Game over
function gameOver() {
    gameActive = false;
    gameMessage.innerHTML = `<span style="color:#ef4444">Game Over! You reached level ${level}. Press START to play again.</span>`;
    
    // Play game over sound
    sounds[4].play();
    
    // Flash red background (from second code)
    document.body.style.backgroundColor = "red";
    setTimeout(() => {
        document.body.style.backgroundColor = ""; // Reset to default
    }, 200);
    
    // Save score if needed
    if (isLoggedIn && level > userHighScore) {
        saveHighScoreToServer(level);
    }
    
    startBtn.innerHTML = '<i class="fas fa-play-circle"></i> Start Game';
    startBtn.style.background = "linear-gradient(to right, #10b981, #059669)";
}

// ================= SAVE SCORE TO SERVER =================
function saveHighScoreToServer(score) {
    if (!isLoggedIn) return;
    
    fetch("/score", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ score: score })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            userHighScore = score;
            console.log("High score saved to server:", score);
        }
    })
    .catch(err => {
        console.log("Failed to save score to server:", err);
    });
}

// ================= BUTTON EVENTS =================
// Button click event
buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (!gameActive) return;
        
        const btnId = getButtonId(button.id);
        playerSequence.push(btnId);
        
        // Add user flash effect (from second code)
        button.classList.add('userflash');
        setTimeout(() => {
            button.classList.remove('userflash');
        }, 250);
        
        activateButton(btnId);
        checkSequence();
    });
});

// Start button event
startBtn.addEventListener('click', startGame);

// Reset button event
resetBtn.addEventListener('click', resetGame);

// ================= KEYBOARD SUPPORT =================
document.addEventListener('keydown', (e) => {
    if (!gameActive) {
        // Allow space/enter to start game (from second code)
        if (e.key === ' ' || e.key === 'Enter') {
            startGame();
        }
        return;
    }
    
    let btnId;
    switch(e.key.toLowerCase()) {
        case '1': btnId = 1; break;
        case '2': btnId = 2; break;
        case '3': btnId = 3; break;
        case '4': btnId = 4; break;
        case 'r': btnId = 1; break; // R for red
        case 'y': btnId = 2; break; // Y for yellow
        case 'b': btnId = 3; break; // B for blue
        case 'g': btnId = 4; break; // G for green
        default: return;
    }
    
    // Simulate button click
    playerSequence.push(btnId);
    
    // Find and flash the button
    const button = document.getElementById(getButtonColor(btnId));
    if (button) {
        button.classList.add('userflash');
        setTimeout(() => {
            button.classList.remove('userflash');
        }, 250);
    }
    
    activateButton(btnId);
    checkSequence();
});

// ================= INITIALIZATION =================
// Get player name on page load
window.addEventListener('load', function() {
    // First check authentication
    checkAuth();
    
    // Then get player name if not logged in
    setTimeout(() => {
        if (!isLoggedIn) {
            getPlayerName();
        }
    }, 1000);
});

// Alternative start method from second code
document.addEventListener('keypress', function(e) {
    if (e.key === ' ' || e.key === 'Enter') {
        if (!gameActive) {
            startGame();
        }
    }
});