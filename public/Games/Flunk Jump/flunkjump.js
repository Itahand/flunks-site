//board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//flunk jumper
let jumperWidth = 46;
let jumperHeight = 46;
let jumperX = boardWidth/2 - jumperWidth/2;
let jumperY = boardHeight*7/8 - jumperHeight;

let jumper = {
    x : jumperX,
    y : jumperY,
    width : jumperWidth,
    height : jumperHeight
}

//physics
let velocityX = 0; 
let velocityY = 0; //jumper jump speed
let initialVelocityY = -8; //starting velocity Y
let gravity = 0.4;

//mobile gyroscope
let gyroEnabled = false;
let gyroSensitivity = 0.3; // Adjust sensitivity (0.1 = low, 1.0 = high)
let gyroMultiplier = 8; // How much movement per degree of tilt

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;

let score = 0;
let maxScore = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveJumper);
    
    // Initialize mobile controls
    initializeMobileControls();
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //jumper
    jumper.x += velocityX;
    if (jumper.x > boardWidth) {
        jumper.x = 0;
    }
    else if (jumper.x + jumper.width < 0) {
        jumper.x = boardWidth;
    }

    velocityY += gravity;
    jumper.y += velocityY;
    if (jumper.y > board.height) {
        gameOver = true;
        endGame();
    }
    
    // Draw jumper (simple rectangle for now)
    context.fillStyle = "#ff6b6b";
    context.fillRect(jumper.x, jumper.y, jumper.width, jumper.height);
    
    // Add simple face
    context.fillStyle = "white";
    context.fillRect(jumper.x + 8, jumper.y + 8, 6, 6); // left eye
    context.fillRect(jumper.x + 32, jumper.y + 8, 6, 6); // right eye
    context.fillStyle = "black";
    context.fillRect(jumper.x + 15, jumper.y + 25, 16, 4); // smile

    //platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && jumper.y < boardHeight*3/4) {
            platform.y -= initialVelocityY; //slide platform down
        }
        if (detectCollision(jumper, platform) && velocityY >= 0) {
            velocityY = initialVelocityY; //jump
        }
        
        // Draw platform
        context.fillStyle = "#4ecdc4";
        context.fillRect(platform.x, platform.y, platform.width, platform.height);
        // Add platform border
        context.strokeStyle = "#45b7d1";
        context.lineWidth = 2;
        context.strokeRect(platform.x, platform.y, platform.width, platform.height);
    }

    // clear platforms and add new platform
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); //removes first element from the array
        newPlatform(); //replace with new platform on top
    }

    //score
    updateScore();
    context.fillStyle = "black";
    context.font = "bold 18px Arial";
    context.fillText(score, 10, 25);
    
    // Update score display
    document.getElementById("current-score").textContent = score;

    if (gameOver) {
        context.fillStyle = "rgba(0, 0, 0, 0.7)";
        context.fillRect(0, 0, boardWidth, boardHeight);
        
        context.fillStyle = "white";
        context.font = "bold 24px Arial";
        context.textAlign = "center";
        context.fillText("GAME OVER", boardWidth/2, boardHeight/2 - 40);
        
        context.fillStyle = "#ffff00";
        context.font = "bold 32px Arial";
        context.fillText(score, boardWidth/2, boardHeight/2);
        
        context.fillStyle = "white";
        context.font = "16px Arial";
        context.fillText("Press SPACE to restart", boardWidth/2, boardHeight/2 + 40);
        context.textAlign = "start";
    }
}

function moveJumper(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") { //move right
        velocityX = 4;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //move left
        velocityX = -4;
    }
    else if (e.code == "Space" && gameOver) {
        resetGame();
    }
}

function placePlatforms() {
    platformArray = [];

    //starting platform
    let platform = {
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }
    platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4);
        let platform = {
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight
        }
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth*3/4);
    let platform = {
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight
    }
    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   
           a.x + a.width > b.x &&   
           a.y < b.y + b.height &&  
           a.y + a.height > b.y;    
}

function updateScore() {
    let points = Math.floor(50*Math.random()); 
    if (velocityY < 0) { //negative going up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}

function endGame() {
    // Send score to parent window (Flunks arcade)
    if (window.parent && score > 0) {
        console.log('🦘 Flunk Jump - Final Score:', score);
        window.parent.postMessage({
            type: 'FLUNK_JUMP_SCORE',
            score: score
        }, '*');
    }
}

// Mobile Controls and Gyroscope Support
function initializeMobileControls() {
    // Check if device supports gyroscope
    if (window.DeviceOrientationEvent) {
        // Request permission for iOS 13+
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            // iOS 13+ requires permission
            const gyroButton = document.createElement('button');
            gyroButton.textContent = '📱 Enable Gyro Controls';
            gyroButton.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: #4ecdc4;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 5px;
                font-size: 12px;
                cursor: pointer;
                z-index: 1000;
            `;
            
            gyroButton.onclick = function() {
                DeviceOrientationEvent.requestPermission()
                    .then(response => {
                        if (response === 'granted') {
                            enableGyroControls();
                            gyroButton.textContent = '✅ Gyro Active';
                            gyroButton.style.background = '#4CAF50';
                        } else {
                            gyroButton.textContent = '❌ Gyro Denied';
                            gyroButton.style.background = '#f44336';
                        }
                    })
                    .catch(console.error);
            };
            
            document.body.appendChild(gyroButton);
        } else {
            // Android and older iOS - enable directly
            enableGyroControls();
        }
    }
    
    // Add touch controls for mobile
    addTouchControls();
}

function enableGyroControls() {
    gyroEnabled = true;
    console.log('🎮 Gyroscope controls enabled!');
    
    window.addEventListener('deviceorientation', handleGyroscope);
}

function handleGyroscope(event) {
    if (!gyroEnabled || gameOver) return;
    
    // Get the gamma value (left/right tilt)
    const gamma = event.gamma; // -90 to 90 degrees
    
    if (gamma !== null) {
        // Convert tilt to movement velocity
        // Negative gamma = tilt left, positive gamma = tilt right
        const tiltThreshold = 5; // Ignore small tilts
        
        if (Math.abs(gamma) > tiltThreshold) {
            // Scale the tilt to movement speed
            velocityX = (gamma / 90) * gyroMultiplier * gyroSensitivity;
            
            // Cap the maximum velocity
            velocityX = Math.max(-6, Math.min(6, velocityX));
        } else {
            // Gradually reduce velocity when phone is level
            velocityX *= 0.9;
        }
    }
}

function addTouchControls() {
    // Add touch areas for non-gyro mobile control
    board.addEventListener('touchstart', handleTouchStart);
    board.addEventListener('touchmove', handleTouchMove);
    
    // Prevent scrolling on touch
    board.addEventListener('touchstart', preventDefault);
    board.addEventListener('touchmove', preventDefault);
}

function preventDefault(e) {
    e.preventDefault();
}

function handleTouchStart(e) {
    if (gameOver) {
        // Reset game on touch when game over
        resetGame();
        return;
    }
    
    const touch = e.touches[0];
    const rect = board.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    
    // Determine movement based on touch position
    if (touchX < boardWidth / 2) {
        velocityX = -4; // Move left
    } else {
        velocityX = 4;  // Move right
    }
}

function handleTouchMove(e) {
    if (gameOver) return;
    
    const touch = e.touches[0];
    const rect = board.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    
    // Continuous movement based on touch position
    if (touchX < boardWidth / 2) {
        velocityX = -4; // Move left
    } else {
        velocityX = 4;  // Move right
    }
}

function resetGame() {
    jumper = {
        x : jumperX,
        y : jumperY,
        width : jumperWidth,
        height : jumperHeight
    }

    velocityX = 0;
    velocityY = initialVelocityY;
    score = 0;
    maxScore = 0;
    gameOver = false;
    placePlatforms();
}