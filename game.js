// Game Configuration
const CONFIG = {
    canvasWidth: 800,
    canvasHeight: 600,
    bikeWidth: 30,
    bikeHeight: 50,
    maxSpeed: 200,
    acceleration: 2,
    deceleration: 1,
    friction: 0.95,
    obstacleWidth: 40,
    obstacleHeight: 40,
    powerUpSize: 20,
};

// Game State
const gameState = {
    isRunning: false,
    isPaused: false,
    speed: 0,
    distance: 0,
    score: 0,
    bikeX: CONFIG.canvasWidth / 2,
    bikeY: CONFIG.canvasHeight - 100,
};

// Input State
const inputState = {
    left: false,
    right: false,
    accelerate: false,
    brake: false,
};

// Game Objects
let obstacles = [];
let powerUps = [];
let particles = [];

// Get Canvas and Context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Get UI Elements
const speedDisplay = document.getElementById('speed');
const distanceDisplay = document.getElementById('distance');
const scoreDisplay = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// Event Listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', resetGame);

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function handleKeyDown(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') inputState.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') inputState.right = true;
    if (e.key === ' ') { inputState.accelerate = true; e.preventDefault(); }
    if (e.key === 'Shift') inputState.brake = true;
}

function handleKeyUp(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') inputState.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') inputState.right = false;
    if (e.key === ' ') inputState.accelerate = false;
    if (e.key === 'Shift') inputState.brake = false;
}

function startGame() {
    if (!gameState.isRunning) {
        gameState.isRunning = true;
        gameState.isPaused = false;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        gameLoop();
    }
}

function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    pauseBtn.textContent = gameState.isPaused ? 'Resume' : 'Pause';
    if (!gameState.isPaused) gameLoop();
}

function resetGame() {
    gameState.isRunning = false;
    gameState.isPaused = false;
    gameState.speed = 0;
    gameState.distance = 0;
    gameState.score = 0;
    gameState.bikeX = CONFIG.canvasWidth / 2;
    gameState.bikeY = CONFIG.canvasHeight - 100;
    obstacles = [];
    powerUps = [];
    particles = [];
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
    updateUI();
    draw();
}

function gameLoop() {
    if (!gameState.isPaused && gameState.isRunning) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

function update() {
    // Handle acceleration and braking
    if (inputState.accelerate && gameState.speed < CONFIG.maxSpeed) {
        gameState.speed += CONFIG.acceleration;
    } else if (inputState.brake) {
        gameState.speed -= CONFIG.deceleration * 2;
    } else {
        gameState.speed *= CONFIG.friction;
    }

    // Keep speed within bounds
    gameState.speed = Math.max(0, Math.min(gameState.speed, CONFIG.maxSpeed));

    // Handle steering
    const steerAmount = 5;
    if (inputState.left && gameState.bikeX > 30) {
        gameState.bikeX -= steerAmount;
    }
    if (inputState.right && gameState.bikeX < CONFIG.canvasWidth - 30) {
        gameState.bikeX += steerAmount;
    }

    // Update distance
    gameState.distance += gameState.speed / 100;
    gameState.score = Math.floor(gameState.distance * 10);

    // Spawn obstacles
    if (Math.random() < 0.02) {
        spawnObstacle();
    }

    // Spawn power-ups
    if (Math.random() < 0.005) {
        spawnPowerUp();
    }

    // Update obstacles
    obstacles = obstacles.filter(obstacle => {
        obstacle.y += gameState.speed / 20;
        if (obstacle.y > CONFIG.canvasHeight) return false;

        // Check collision
        if (checkCollision(gameState.bikeX, gameState.bikeY, obstacle.x, obstacle.y)) {
            createExplosion(obstacle.x, obstacle.y);
            gameState.speed = Math.max(0, gameState.speed - 20);
            return false;
        }
        return true;
    });

    // Update power-ups
    powerUps = powerUps.filter(powerUp => {
        powerUp.y += gameState.speed / 20;
        if (powerUp.y > CONFIG.canvasHeight) return false;

        // Check collision
        if (checkCollision(gameState.bikeX, gameState.bikeY, powerUp.x, powerUp.y)) {
            gameState.speed = Math.min(CONFIG.maxSpeed, gameState.speed + 30);
            gameState.score += 100;
            createExplosion(powerUp.x, powerUp.y, 'gold');
            return false;
        }
        return true;
    });

    // Update particles
    particles = particles.filter(particle => {
        particle.life--;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.2; // gravity
        return particle.life > 0;
    });

    updateUI();
}

function draw() {
    // Clear canvas
    ctx.fillStyle = 'rgba(135, 206, 235, 1)';
    ctx.fillRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);

    // Draw road
    ctx.fillStyle = '#444';
    ctx.fillRect(50, 0, CONFIG.canvasWidth - 100, CONFIG.canvasHeight);

    // Draw road markings
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 20]);
    for (let i = 0; i < CONFIG.canvasHeight; i += 40) {
        ctx.beginPath();
        ctx.moveTo(CONFIG.canvasWidth / 2, i);
        ctx.lineTo(CONFIG.canvasWidth / 2, i + 20);
        ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw obstacles
    obstacles.forEach(obstacle => {
        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(obstacle.x, obstacle.y, CONFIG.obstacleWidth, CONFIG.obstacleHeight);
        ctx.strokeStyle = '#C0392B';
        ctx.lineWidth = 2;
        ctx.strokeRect(obstacle.x, obstacle.y, CONFIG.obstacleWidth, CONFIG.obstacleHeight);
    });

    // Draw power-ups
    powerUps.forEach(powerUp => {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(powerUp.x, powerUp.y, CONFIG.powerUpSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // Draw bike
    drawBike(gameState.bikeX, gameState.bikeY);

    // Draw particles
    particles.forEach(particle => {
        ctx.globalAlpha = particle.life / 255;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        ctx.globalAlpha = 1;
    });

    // Draw game over message if not running
    if (!gameState.isRunning && gameState.distance > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', CONFIG.canvasWidth / 2, CONFIG.canvasHeight / 2 - 20);
        ctx.font = '20px Arial';
        ctx.fillText(`Final Score: ${gameState.score}`, CONFIG.canvasWidth / 2, CONFIG.canvasHeight / 2 + 30);
    }
}

function drawBike(x, y) {
    // Bike body
    ctx.fillStyle = '#2ECC71';
    ctx.beginPath();
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x - CONFIG.bikeWidth / 2, y);
    ctx.lineTo(x, y + 20);
    ctx.lineTo(x + CONFIG.bikeWidth / 2, y);
    ctx.closePath();
    ctx.fill();

    // Bike wheels
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(x - 8, y + 15, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 8, y + 15, 6, 0, Math.PI * 2);
    ctx.fill();

    // Speed indicator
    const speedPercent = gameState.speed / CONFIG.maxSpeed;
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(x - 15, y - 30, 30 * speedPercent, 5);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 15, y - 30, 30, 5);
}

function spawnObstacle() {
    const x = 70 + Math.random() * (CONFIG.canvasWidth - 140);
    obstacles.push({
        x: x,
        y: -CONFIG.obstacleHeight,
    });
}

function spawnPowerUp() {
    const x = 70 + Math.random() * (CONFIG.canvasWidth - 140);
    powerUps.push({
        x: x,
        y: -CONFIG.powerUpSize,
    });
}

function checkCollision(bikeX, bikeY, objectX, objectY) {
    const bikeBoundingBox = {
        left: bikeX - CONFIG.bikeWidth,
        right: bikeX + CONFIG.bikeWidth,
        top: bikeY - CONFIG.bikeHeight,
        bottom: bikeY + CONFIG.bikeHeight,
    };

    const objectBoundingBox = {
        left: objectX,
        right: objectX + CONFIG.obstacleWidth,
        top: objectY,
        bottom: objectY + CONFIG.obstacleHeight,
    };

    return !(bikeBoundingBox.right < objectBoundingBox.left ||
             bikeBoundingBox.left > objectBoundingBox.right ||
             bikeBoundingBox.bottom < objectBoundingBox.top ||
             bikeBoundingBox.top > objectBoundingBox.bottom);
}

function createExplosion(x, y, color = '#FF6B6B') {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            color: color,
            size: Math.random() * 4 + 2,
            life: 255,
        });
    }
}

function updateUI() {
    speedDisplay.textContent = Math.floor(gameState.speed);
    distanceDisplay.textContent = gameState.distance.toFixed(1);
    scoreDisplay.textContent = gameState.score;
}

// Initial draw
draw();