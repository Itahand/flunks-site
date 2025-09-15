class FlunkJumpGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.gameRunning = false;
        this.height = 0; // Score based on height like original
        
        // Physics constants (based on original C++ game)
        this.GRAVITY = 0.00014; // G = 14 / 10000.0f from original
        this.JUMP_VELOCITY = -0.7; // DOODLE_VY from original
        this.HORIZONTAL_SPEED = 0.42; // DOODLE_VX from original
        
        // Player properties (Doodle character)
        this.player = {
            x: this.canvas.width / 2 - 29, // Center doodle (58px wide / 2)
            y: this.canvas.height - 100,
            width: 58, // Original doodle sprite size
            height: 57,
            velocityX: 0,
            velocityY: 0,
            onPlatform: false,
            facing: 'right', // Track direction for sprite
            state: 'base' // base, jumping, falling
        };
        
        // Platforms array
        this.platforms = [];
        this.generateInitialPlatforms();
        
        // Camera offset for scrolling
        this.cameraY = 0;
        this.lastCameraY = 0;
        
        // Mobile controls
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.gyroEnabled = false;
        this.keys = {};
        
        this.setupControls();
        this.setupMobileControls();
        
        // Game loop
        this.gameLoop = this.gameLoop.bind(this);
        this.lastTime = 0;
        this.startGame();
    }
    
    generateInitialPlatforms() {
        // Ground platform
        this.platforms.push({
            x: 0,
            y: this.canvas.height - 20,
            width: this.canvas.width,
            height: 20,
            type: 'ground'
        });
        
        // Generate platforms based on original game pattern
        for (let i = 1; i < 100; i++) {
            const platformWidth = 80;
            const platformHeight = 15;
            const spacing = 80 + Math.random() * 40; // Variable spacing like original
            
            this.platforms.push({
                x: Math.random() * (this.canvas.width - platformWidth),
                y: this.canvas.height - 20 - (i * spacing),
                width: platformWidth,
                height: platformHeight,
                type: 'normal'
            });
        }
    }
    
    setupControls() {
        this.keys = {};
        
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    
    setupMobileControls() {
        if (this.isMobile) {
            // Request device orientation permission for iOS 13+
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                this.canvas.addEventListener('touchstart', () => {
                    DeviceOrientationEvent.requestPermission()
                        .then(response => {
                            if (response == 'granted') {
                                this.enableGyroscope();
                            }
                        })
                        .catch(console.error);
                }, { once: true });
            } else {
                this.enableGyroscope();
            }
            
            // Touch controls for movement
            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                
                if (x < this.canvas.width / 2) {
                    this.player.velocityX = -this.HORIZONTAL_SPEED;
                    this.player.facing = 'left';
                } else {
                    this.player.velocityX = this.HORIZONTAL_SPEED;
                    this.player.facing = 'right';
                }
            });
            
            this.canvas.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.player.velocityX = 0;
            });
        }
    }
    
    enableGyroscope() {
        this.gyroEnabled = true;
        window.addEventListener('deviceorientation', (e) => {
            this.handleGyroscope(e);
        });
    }
    
    handleGyroscope(event) {
        if (!this.gyroEnabled || !this.gameRunning) return;
        
        const gamma = event.gamma || 0; // Left-right tilt
        const sensitivity = 0.01; // Reduced sensitivity for better control
        
        if (Math.abs(gamma) > 3) { // Dead zone
            this.player.velocityX = gamma * sensitivity;
            
            // Update facing direction
            if (gamma > 0) {
                this.player.facing = 'right';
            } else {
                this.player.facing = 'left';
            }
            
            // Clamp velocity to match original game speed
            if (this.player.velocityX > this.HORIZONTAL_SPEED) {
                this.player.velocityX = this.HORIZONTAL_SPEED;
            } else if (this.player.velocityX < -this.HORIZONTAL_SPEED) {
                this.player.velocityX = -this.HORIZONTAL_SPEED;
            }
        } else {
            this.player.velocityX = 0;
        }
    }
    
    handleInput(deltaTime) {
        if (!this.gameRunning) return;
        
        // Horizontal movement (based on original game physics)
        let targetVelocityX = 0;
        
        // Desktop controls
        if (this.keys['arrowleft'] || this.keys['a']) {
            targetVelocityX = -this.HORIZONTAL_SPEED;
            this.player.facing = 'left';
        } else if (this.keys['arrowright'] || this.keys['d']) {
            targetVelocityX = this.HORIZONTAL_SPEED;
            this.player.facing = 'right';
        }
        
        // Apply horizontal velocity with smooth acceleration
        this.player.velocityX = targetVelocityX;
    }
    
    updatePlayer(deltaTime) {
        if (!this.gameRunning) return;
        
        // Apply gravity (based on original physics)
        this.player.velocityY += this.GRAVITY * deltaTime;
        
        // Update position with deltaTime for smooth movement
        this.player.x += this.player.velocityX * deltaTime;
        this.player.y += this.player.velocityY * deltaTime;
        
        // Screen wrapping (like original game)
        if (this.player.x + this.player.width < 0) {
            this.player.x = this.canvas.width;
        } else if (this.player.x > this.canvas.width) {
            this.player.x = -this.player.width;
        }
        
        // Check platform collisions
        this.player.onPlatform = false;
        for (let platform of this.platforms) {
            if (this.checkCollision(this.player, platform)) {
                // Only bounce if falling down and hitting from above
                if (this.player.velocityY > 0 && 
                    this.player.y + this.player.height - platform.y <= 20) {
                    
                    this.player.y = platform.y - this.player.height;
                    this.player.velocityY = this.JUMP_VELOCITY; // Jump with original velocity
                    this.player.onPlatform = true;
                    this.player.state = 'jumping';
                    
                    // Update score based on height (like original)
                    const currentHeight = Math.floor((this.canvas.height - this.player.y) / 10);
                    if (currentHeight > this.height) {
                        this.height = currentHeight;
                        this.score = this.height;
                        this.updateScoreDisplay();
                    }
                }
            }
        }
        
        // Update player state
        if (this.player.velocityY < 0) {
            this.player.state = 'jumping';
        } else if (this.player.velocityY > 0) {
            this.player.state = 'falling';
        }
        
        // Camera follows player (original behavior)
        if (this.player.y < this.canvas.height / 2) {
            const targetCameraY = this.canvas.height / 2 - this.player.y;
            this.cameraY = targetCameraY;
        }
        
        // Game over condition
        if (this.player.y > this.canvas.height + this.cameraY + 100) {
            this.endGame();
        }
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Save context for camera transformation
        this.ctx.save();
        this.ctx.translate(0, this.cameraY);
        
        // Draw platforms
        this.ctx.fillStyle = '#8B4513';
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        
        for (let platform of this.platforms) {
            if (platform.y + this.cameraY > -50 && platform.y + this.cameraY < this.canvas.height + 50) {
                // Platform base
                this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
                this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
                
                // Platform highlight (3D effect)
                this.ctx.fillStyle = '#A0522D';
                this.ctx.fillRect(platform.x + 2, platform.y + 2, platform.width - 4, platform.height - 4);
                this.ctx.fillStyle = '#8B4513';
            }
        }
        
        // Draw player (Doodle-like character)
        this.drawDoodle();
        
        // Restore context
        this.ctx.restore();
    }
    
    drawDoodle() {
        const x = this.player.x;
        const y = this.player.y;
        const w = this.player.width;
        const h = this.player.height;
        
        // Main body (green like original Doodle)
        this.ctx.fillStyle = '#90EE90';
        this.ctx.fillRect(x + 10, y + 15, w - 20, h - 25);
        
        // Head
        this.ctx.fillStyle = '#7FDD7F';
        this.ctx.fillRect(x + 15, y + 5, w - 30, 20);
        
        // Eyes
        this.ctx.fillStyle = '#000';
        if (this.player.facing === 'right') {
            this.ctx.fillRect(x + 22, y + 8, 3, 3); // Right eye
            this.ctx.fillRect(x + 30, y + 8, 3, 3); // Left eye
            
            // Nose pointing right
            this.ctx.fillStyle = '#FF6B6B';
            this.ctx.fillRect(x + 35, y + 12, 8, 4);
        } else {
            this.ctx.fillRect(x + 25, y + 8, 3, 3); // Left eye  
            this.ctx.fillRect(x + 33, y + 8, 3, 3); // Right eye
            
            // Nose pointing left
            this.ctx.fillStyle = '#FF6B6B';
            this.ctx.fillRect(x + 15, y + 12, 8, 4);
        }
        
        // Legs
        this.ctx.fillStyle = '#90EE90';
        this.ctx.fillRect(x + 12, y + h - 15, 8, 12);
        this.ctx.fillRect(x + w - 20, y + h - 15, 8, 12);
        
        // Feet
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.fillRect(x + 10, y + h - 8, 12, 6);
        this.ctx.fillRect(x + w - 22, y + h - 8, 12, 6);
        
        // Jump animation effect
        if (this.player.state === 'jumping' && this.player.velocityY < -0.3) {
            // Motion lines
            this.ctx.strokeStyle = '#FFF';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x + w/2 - 10, y + h + 5);
            this.ctx.lineTo(x + w/2 - 15, y + h + 15);
            this.ctx.moveTo(x + w/2 + 10, y + h + 5);
            this.ctx.lineTo(x + w/2 + 15, y + h + 15);
            this.ctx.stroke();
        }
    }
    
    updateScoreDisplay() {
        document.getElementById('score').textContent = this.score;
    }
    
    startGame() {
        this.gameRunning = true;
        this.gameLoop();
    }
    
    endGame() {
        this.gameRunning = false;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverScreen').style.display = 'block';
        
        // Send score to parent window for leaderboard
        if (window.parent) {
            window.parent.postMessage({
                type: 'FLUNK_JUMP_SCORE',
                score: this.score
            }, '*');
        }
    }
    
    restartGame() {
        this.score = 0;
        this.height = 0;
        this.cameraY = 0;
        this.lastCameraY = 0;
        
        // Reset player to original position and state
        this.player.x = this.canvas.width / 2 - 29;
        this.player.y = this.canvas.height - 100;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        this.player.facing = 'right';
        this.player.state = 'base';
        
        // Regenerate platforms
        this.platforms = [];
        this.generateInitialPlatforms();
        
        document.getElementById('gameOverScreen').style.display = 'none';
        this.updateScoreDisplay();
        this.startGame();
    }
    
    gameLoop(currentTime) {
        if (!this.gameRunning) return;
        
        // Calculate delta time for smooth animation
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.handleInput(deltaTime);
        this.updatePlayer(deltaTime);
        this.render();
        
        requestAnimationFrame(this.gameLoop);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new FlunkJumpGame();
    
    // Restart button functionality
    document.getElementById('restartBtn').addEventListener('click', () => {
        game.restartGame();
    });
});