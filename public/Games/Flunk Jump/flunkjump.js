class FlunkJumpGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.gameRunning = false;
        
        // Player properties
        this.player = {
            x: this.canvas.width / 2 - 15,
            y: this.canvas.height - 100,
            width: 30,
            height: 30,
            velocityX: 0,
            velocityY: 0,
            onGround: false,
            jumpPower: -15,
            speed: 5
        };
        
        // Platforms
        this.platforms = [];
        this.generateInitialPlatforms();
        
        // Camera offset for scrolling
        this.cameraY = 0;
        
        // Mobile controls
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.gyroEnabled = false;
        this.lastGamma = 0;
        
        this.setupControls();
        this.setupMobileControls();
        
        // Game loop
        this.gameLoop = this.gameLoop.bind(this);
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
        
        // Generate platforms going up
        for (let i = 1; i < 50; i++) {
            this.platforms.push({
                x: Math.random() * (this.canvas.width - 80),
                y: this.canvas.height - 20 - (i * 120),
                width: 80,
                height: 15,
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
            
            // Touch controls for jumping and movement
            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                
                if (x < this.canvas.width / 2) {
                    this.player.velocityX = -this.player.speed;
                } else {
                    this.player.velocityX = this.player.speed;
                }
            });
            
            this.canvas.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.player.velocityX *= 0.8; // Gradual stop
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
        const sensitivity = 0.3;
        
        if (Math.abs(gamma) > 5) { // Dead zone
            this.player.velocityX = gamma * sensitivity;
            
            // Clamp velocity
            if (this.player.velocityX > this.player.speed) {
                this.player.velocityX = this.player.speed;
            } else if (this.player.velocityX < -this.player.speed) {
                this.player.velocityX = -this.player.speed;
            }
        }
    }
    
    handleInput() {
        if (!this.gameRunning) return;
        
        // Desktop controls
        if (this.keys['arrowleft'] || this.keys['a']) {
            this.player.velocityX = -this.player.speed;
        } else if (this.keys['arrowright'] || this.keys['d']) {
            this.player.velocityX = this.player.speed;
        } else if (!this.isMobile) {
            this.player.velocityX *= 0.8; // Friction
        }
    }
    
    updatePlayer() {
        if (!this.gameRunning) return;
        
        // Apply gravity
        this.player.velocityY += 0.8;
        
        // Update position
        this.player.x += this.player.velocityX;
        this.player.y += this.player.velocityY;
        
        // Keep player in bounds horizontally
        if (this.player.x < 0) {
            this.player.x = 0;
            this.player.velocityX = 0;
        } else if (this.player.x + this.player.width > this.canvas.width) {
            this.player.x = this.canvas.width - this.player.width;
            this.player.velocityX = 0;
        }
        
        // Check platform collisions
        this.player.onGround = false;
        for (let platform of this.platforms) {
            if (this.checkCollision(this.player, platform)) {
                if (this.player.velocityY > 0) { // Falling down
                    this.player.y = platform.y - this.player.height;
                    this.player.velocityY = this.player.jumpPower;
                    this.player.onGround = true;
                    
                    // Update score based on height
                    const currentHeight = Math.floor((this.canvas.height - this.player.y) / 10);
                    if (currentHeight > this.score) {
                        this.score = currentHeight;
                        this.updateScoreDisplay();
                    }
                }
            }
        }
        
        // Camera follows player when going up
        if (this.player.y < this.canvas.height / 2) {
            this.cameraY = this.canvas.height / 2 - this.player.y;
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
        for (let platform of this.platforms) {
            if (platform.y + this.cameraY > -50 && platform.y + this.cameraY < this.canvas.height + 50) {
                this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
                
                // Platform border
                this.ctx.strokeStyle = '#654321';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
            }
        }
        
        // Draw player (simple kangaroo-like character)
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Player border
        this.ctx.strokeStyle = '#FF4444';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Simple kangaroo ears
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.fillRect(this.player.x + 5, this.player.y - 8, 6, 8);
        this.ctx.fillRect(this.player.x + 19, this.player.y - 8, 6, 8);
        
        // Restore context
        this.ctx.restore();
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
        this.cameraY = 0;
        this.player.x = this.canvas.width / 2 - 15;
        this.player.y = this.canvas.height - 100;
        this.player.velocityX = 0;
        this.player.velocityY = 0;
        
        document.getElementById('gameOverScreen').style.display = 'none';
        this.updateScoreDisplay();
        this.startGame();
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.handleInput();
        this.updatePlayer();
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