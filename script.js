// Game State
const gameState = {
    players: [],
    gameStarted: false,
    selectedPlayer: null,
    spinHistory: []
};

// DOM Elements
const playerNameInput = document.getElementById('playerName');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const playersList = document.getElementById('playersList');
const playerCount = document.getElementById('playerCount');
const startGameBtn = document.getElementById('startGameBtn');
const setupSection = document.getElementById('setupSection');
const gameSection = document.getElementById('gameSection');
const spinBtn = document.getElementById('spinBtn');
const resetBtn = document.getElementById('resetBtn');
const selectedPlayerDisplay = document.getElementById('selectedPlayer');
const spinHistory = document.getElementById('spinHistory');
const bottle = document.getElementById('bottle');

// Event Listeners
addPlayerBtn.addEventListener('click', addPlayer);
playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addPlayer();
});
startGameBtn.addEventListener('click', startGame);
spinBtn.addEventListener('click', spinBottle);
resetBtn.addEventListener('click', resetGame);

// Functions
function addPlayer() {
    const playerName = playerNameInput.value.trim();
    
    if (!playerName) {
        alert('Please enter a player name');
        return;
    }
    
    if (gameState.players.includes(playerName)) {
        alert('Player already added');
        return;
    }
    
    gameState.players.push(playerName);
    playerNameInput.value = '';
    updatePlayersList();
    updateStartButton();
}

function removePlayer(playerName) {
    gameState.players = gameState.players.filter(p => p !== playerName);
    updatePlayersList();
    updateStartButton();
}

function updatePlayersList() {
    playerCount.textContent = gameState.players.length;
    playersList.innerHTML = gameState.players.map(player => `
        <li>
            <span>${player}</span>
            <button onclick="removePlayer('${player}')">Remove</button>
        </li>
    `).join('');
}

function updateStartButton() {
    startGameBtn.disabled = gameState.players.length < 2;
}

function startGame() {
    gameState.gameStarted = true;
    gameState.spinHistory = [];
    selectedPlayerDisplay.textContent = '-';
    spinHistory.innerHTML = '';
    setupSection.style.display = 'none';
    gameSection.style.display = 'block';
    spinBtn.disabled = false;
}

function spinBottle() {
    if (!gameState.gameStarted || gameState.players.length === 0) {
        return;
    }
    
    spinBtn.disabled = true;
    bottle.classList.add('spinning');
    
    // Random rotation amount (multiple full rotations)
    const rotations = 5 + Math.random() * 5; // 5-10 rotations
    const randomIndex = Math.floor(Math.random() * gameState.players.length);
    const selectedPlayer = gameState.players[randomIndex];
    
    // Calculate final rotation to land on selected player
    const baseRotation = (360 / gameState.players.length) * randomIndex;
    const finalRotation = rotations * 360 + baseRotation;
    
    // Duration: 3 seconds (matches animation)
    setTimeout(() => {
        bottle.style.transform = `rotate(${finalRotation}deg)`;
        bottle.classList.remove('spinning');
        
        // Display result
        gameState.selectedPlayer = selectedPlayer;
        selectedPlayerDisplay.textContent = selectedPlayer;
        
        // Add to history
        const timestamp = new Date().toLocaleTimeString();
        gameState.spinHistory.unshift(`${timestamp} - ${selectedPlayer}`);
        updateSpinHistory();
        
        spinBtn.disabled = false;
    }, 3000);
}

function updateSpinHistory() {
    spinHistory.innerHTML = gameState.spinHistory
        .slice(0, 10) // Show last 10 spins
        .map((spin, index) => `
            <li>${spin}</li>
        `)
        .join('');
}

function resetGame() {
    gameState.gameStarted = false;
    gameState.selectedPlayer = null;
    gameState.spinHistory = [];
    bottle.style.transform = 'rotate(0deg)';
    setupSection.style.display = 'block';
    gameSection.style.display = 'none';
    playerNameInput.focus();
}

// Initialize
updateStartButton();
playerNameInput.focus();
