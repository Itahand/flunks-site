document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const doodler = document.createElement('div')
  let isGameOver = false
  let speed = 3
  let basePlatformCount = 6  // Start with more platforms for easier beginning
  let platformCount = basePlatformCount
  let platforms = []
  let score = 0
  let platformCounter = 0  // Track total platforms created
  let doodlerLeftSpace = 50
  let startPoint = 150
  let doodlerBottomSpace = startPoint
  const gravity = 0.9
  let upTimerId
  let downTimerId
  let isJumping = true
  let isGoingLeft = false
  let isGoingRight = false
  let leftTimerId
  let rightTimerId

  class Platform {
    constructor(newPlatBottom, platformNumber = 0) {
      this.left = Math.random() * 315
      this.bottom = newPlatBottom
      this.visual = document.createElement('div')
      
      // Determine platform type based on platform number
      if (platformNumber > 0 && platformNumber % 20 === 0) {
        // Special platform every 20 platforms
        this.type = 'special'
        this.jumpHeight = 300  // Higher jump
        this.width = 50        // Shorter width
      } else if (platformNumber === 0) {
        // First platform is always normal for easy start
        this.type = 'normal'
        this.jumpHeight = 200  // Standard jump
        this.width = 85
      } else {
        // Random platform type for normal platforms
        const rand = Math.random()
        if (rand < 0.6) {
          this.type = 'normal'
          this.jumpHeight = 200  // Standard jump
          this.width = 85
        } else if (rand < 0.85) {
          this.type = 'low'
          this.jumpHeight = 150  // Lower jump
          this.width = 85
        } else {
          this.type = 'high'
          this.jumpHeight = 250  // Higher jump
          this.width = 85
        }
      }

      const visual = this.visual
      visual.classList.add('platform')
      visual.style.left = this.left + 'px'
      visual.style.bottom = this.bottom + 'px'
      visual.style.width = this.width + 'px'
      
      // Set platform colors based on type
      if (this.type === 'special') {
        visual.style.backgroundColor = '#ff6b35'  // Orange special platform
        visual.style.border = '2px solid #ff4500'
        visual.style.boxShadow = '0 0 10px rgba(255, 107, 53, 0.5)'
      } else if (this.type === 'high') {
        visual.style.backgroundColor = '#4CAF50'  // Green for high jump
      } else if (this.type === 'low') {
        visual.style.backgroundColor = '#f44336'  // Red for low jump
      } else {
        visual.style.backgroundColor = '#2196F3'  // Blue for normal
      }
      
      grid.appendChild(visual)
    }
  }

  // Dynamic platform count based on score
  function getPlatformCount() {
    if (score < 100) {
      return 6;  // Easy start with 6 platforms
    } else if (score < 200) {
      return 5;  // Reduce to 5 platforms after 100 points
    } else if (score < 300) {
      return 4;  // Reduce to 4 platforms after 200 points
    } else if (score < 500) {
      return 3;  // Reduce to 3 platforms after 300 points
    } else {
      return 2;  // Minimum 2 platforms for extreme difficulty
    }
  }

  // Show difficulty increase notification
  function showDifficultyNotification(score) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 69, 87, 0.9);
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      font-weight: bold;
      z-index: 2000;
      text-align: center;
      border: 2px solid #fff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    `;
    
    let message = '';
    if (score === 100) message = 'DIFFICULTY UP! Fewer platforms!';
    else if (score === 200) message = 'GETTING HARDER! Even fewer platforms!';
    else if (score === 300) message = 'EXPERT MODE! Minimal platforms!';
    else if (score === 500) message = 'INSANE MODE! Maximum difficulty!';
    
    notification.textContent = message;
    grid.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  function createPlatforms() {
    platformCount = getPlatformCount();  // Update platform count based on score
    for(let i = 0; i < platformCount; i++) {
      let platGap = 600 / platformCount  // Adjust gap based on current platform count
      let newPlatBottom = 100 + i * platGap
      platformCounter++  // Increment platform counter
      
      // For the first platform, ensure it's a normal platform positioned for easy access
      if (i === 0) {
        let newPlatform = new Platform(newPlatBottom, 0) // Pass 0 to force normal platform
        // Position first platform closer to starting position
        newPlatform.left = Math.max(0, Math.min(250, Math.random() * 200 + 50)) // Keep within reasonable range
        newPlatform.visual.style.left = newPlatform.left + 'px'
        platforms.push(newPlatform)
      } else {
        let newPlatform = new Platform(newPlatBottom, platformCounter)
        platforms.push(newPlatform)
      }
      console.log(platforms)
    }
  }

  function movePlatforms() {
    if (doodlerBottomSpace > 200) {
        platforms.forEach(platform => {
          platform.bottom -= 4
          let visual = platform.visual
          visual.style.bottom = platform.bottom + 'px'

          if(platform.bottom < 10) {
            let firstPlatform = platforms[0].visual
            firstPlatform.classList.remove('platform')
            platforms.shift()
            console.log(platforms)
            score++
            
            // Update score display
            const scoreDisplay = document.getElementById('scoreDisplay')
            if (scoreDisplay) {
              scoreDisplay.textContent = 'Score: ' + score
            }
            
            // Check for difficulty milestones and show notifications
            if (score === 100 || score === 200 || score === 300 || score === 500) {
              showDifficultyNotification(score);
            }
            
            // Dynamic platform spacing based on current difficulty
            let currentPlatformCount = getPlatformCount();
            let dynamicSpacing = 600 / currentPlatformCount;
            platformCounter++  // Increment platform counter
            var newPlatform = new Platform(600 + dynamicSpacing, platformCounter)
            platforms.push(newPlatform)
          }
      }) 
    }
    
  }

  function createDoodler() {
    grid.appendChild(doodler)
    doodler.classList.add('doodler')
    doodlerLeftSpace = platforms[0].left
    doodler.style.left = doodlerLeftSpace + 'px'
    doodler.style.bottom = doodlerBottomSpace + 'px'
    
    // Create score display
    const scoreDisplay = document.createElement('div')
    scoreDisplay.id = 'scoreDisplay'
    scoreDisplay.style.cssText = `
      position: absolute;
      top: 10px;
      left: 10px;
      color: white;
      font-family: Arial, sans-serif;
      font-size: 20px;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
      z-index: 100;
    `
    scoreDisplay.textContent = 'Score: 0'
    grid.appendChild(scoreDisplay)
  }

function fall() {
  isJumping = false
    clearInterval(upTimerId)
    downTimerId = setInterval(function () {
      doodlerBottomSpace -= 5
      doodler.style.bottom = doodlerBottomSpace + 'px'
      if (doodlerBottomSpace <= 0) {
        gameOver()
      }
      platforms.forEach(platform => {
        if (
          (doodlerBottomSpace >= platform.bottom) &&
          (doodlerBottomSpace <= (platform.bottom + 15)) &&
          ((doodlerLeftSpace + 60) >= platform.left) && 
          (doodlerLeftSpace <= (platform.left + platform.width)) &&
          !isJumping
          ) {
            console.log('tick')
            startPoint = doodlerBottomSpace
            jump(platform.jumpHeight)  // Pass the jump height to the jump function
            console.log('start', startPoint)
            isJumping = true
          }
      })

    },20)
}

  function jump(jumpHeight = 200) {  // Default to 200 if no height specified
    clearInterval(downTimerId)
    isJumping = true
    upTimerId = setInterval(function () {
      console.log(startPoint)
      console.log('1', doodlerBottomSpace)
      doodlerBottomSpace += 20
      doodler.style.bottom = doodlerBottomSpace + 'px'
      console.log('2',doodlerBottomSpace)
      console.log('s',startPoint)
      if (doodlerBottomSpace > (startPoint + jumpHeight)) {  // Use dynamic jump height
        fall()
        isJumping = false
      }
    },30)
  }

  function moveLeft() {
    // Clear any existing movement
    if (isGoingRight) {
        clearInterval(rightTimerId)
        isGoingRight = false
    }
    
    // Don't start a new interval if already going left
    if (isGoingLeft) return;
    
    isGoingLeft = true
    leftTimerId = setInterval(function () {
        if (doodlerLeftSpace >= 0) {
          doodlerLeftSpace -= 5
          doodler.style.left = doodlerLeftSpace + 'px'
        } else {
          // Stop at boundary instead of reversing
          doodlerLeftSpace = 0
          doodler.style.left = doodlerLeftSpace + 'px'
        }
    },20)
  }

  function moveRight() {
    // Clear any existing movement
    if (isGoingLeft) {
        clearInterval(leftTimerId)
        isGoingLeft = false
    }
    
    // Don't start a new interval if already going right
    if (isGoingRight) return;
    
    isGoingRight = true
    rightTimerId = setInterval(function () {
      //changed to 313 to fit doodle image
      if (doodlerLeftSpace <= 313) {
        doodlerLeftSpace += 5
        doodler.style.left = doodlerLeftSpace + 'px'
      } else {
        // Stop at boundary instead of reversing
        doodlerLeftSpace = 313
        doodler.style.left = doodlerLeftSpace + 'px'
      }
    },20)
  }
  
  function moveStraight() {
    isGoingLeft = false
    isGoingRight = false
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
  }

  //assign functions to keyCodes
  function control(e) {
    // Prevent default browser behavior for arrow keys
    if(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
    }
    
    doodler.style.bottom = doodlerBottomSpace + 'px'
    if(e.key === 'ArrowLeft') {
      moveLeft()
      console.log('⬅️ Moving left');
    } else if (e.key === 'ArrowRight') {
      moveRight()
      console.log('➡️ Moving right');
    } else if (e.key === 'ArrowUp') {
      moveStraight()
      console.log('⬆️ Moving straight');
    }
  }

  // Handle key release to stop movement
  function controlStop(e) {
    // Prevent default browser behavior for arrow keys
    if(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
    }
    
    if(e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      moveStraight()
      console.log('🛑 Stopping movement');
    }
  }

  // Mobile touch controls
  let touchStartX = 0;
  let touchStartY = 0;
  
  function handleTouchStart(e) {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
  
  function handleTouchMove(e) {
    e.preventDefault();
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Determine direction based on touch movement
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal movement
      if (diffX > 0) {
        moveLeft(); // Swipe left
      } else {
        moveRight(); // Swipe right
      }
    } else {
      // Vertical movement - up swipe stops movement
      if (diffY > 0) {
        moveStraight(); // Swipe up
      }
    }
  }
  
  function handleTouchEnd(e) {
    e.preventDefault();
    touchStartX = 0;
    touchStartY = 0;
  }

  // Device orientation controls for mobile
  function handleOrientation(e) {
    if (e.gamma !== null) {
      const tilt = e.gamma; // Left/right tilt
      if (tilt > 10) {
        moveRight();
      } else if (tilt < -10) {
        moveLeft();
      } else {
        moveStraight();
      }
    }
  }

  function gameOver() {
    isGameOver = true
    console.log('Game Over! Final Score:', score)
    
    // Send score to parent window for leaderboard submission
    if (window.parent && score > 0) {
      window.parent.postMessage({
        type: 'FLUNK_JUMP_SCORE',
        score: score
      }, '*');
      console.log('Score sent to parent:', score);
    }
    
    while (grid.firstChild) {
      console.log('remove')
      grid.removeChild(grid.firstChild)
    }
    
    // Create game over screen
    const gameOverDiv = document.createElement('div');
    gameOverDiv.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      text-align: center;
      font-family: Arial, sans-serif;
      z-index: 1000;
      border: 2px solid #333;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      max-width: 200px;
      min-width: 180px;
    `;
    gameOverDiv.innerHTML = `
      <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #ff4757;">Game Over!</h3>
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #00ffff;">Score: ${score}</p>
      <button id="playAgainBtn" style="
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Play Again</button>
    `;
    
    // Add click event listener for play again button
    const playAgainBtn = gameOverDiv.querySelector('#playAgainBtn');
    playAgainBtn.addEventListener('click', () => {
      console.log('🔄 Restarting game...');
      // Reset all game variables
      isGameOver = false;
      score = 0;
      platformCounter = 0;  // Reset platform counter
      doodlerLeftSpace = 50;
      doodlerBottomSpace = startPoint;
      platforms = [];
      isJumping = true;
      isGoingLeft = false;
      isGoingRight = false;
      
      // Clear all intervals
      clearInterval(upTimerId);
      clearInterval(downTimerId);
      clearInterval(leftTimerId);
      clearInterval(rightTimerId);
      
      // Clear the grid and restart
      while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
      }
      
      // Restart the game
      start();
    });
    grid.appendChild(gameOverDiv);
    
    clearInterval(upTimerId)
    clearInterval(downTimerId)
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
  }


  function start() {
    if (!isGameOver) {
      createPlatforms()
      createDoodler()
      setInterval(movePlatforms,30)
      fall()  // Start by falling instead of jumping
      
      // Desktop controls - use passive: false to allow preventDefault
      document.addEventListener('keydown', control, { passive: false })
      document.addEventListener('keyup', controlStop, { passive: false })
      
      // Mobile touch controls
      grid.addEventListener('touchstart', handleTouchStart, { passive: false })
      grid.addEventListener('touchmove', handleTouchMove, { passive: false })
      grid.addEventListener('touchend', handleTouchEnd, { passive: false })
      
      // Mobile orientation controls (if available)
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation)
      }
      
      console.log('🦘 Flunk Jump game started! Use arrow keys or touch/tilt to play.');
    } 
  }
  
  // Auto-start the game but allow external control
  start()
  
  // Also allow manual start command from parent
  window.startFlunkJump = start;
})