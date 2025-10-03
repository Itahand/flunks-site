document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let doodler = null  // Initialize as null, will be created in createDoodler()
  let isGameOver = false
  let speed = 3
  let basePlatformCount = 6  // Start with generous amount of platforms for learning
  let platformCount = basePlatformCount
  let platforms = []
  let score = 0
  let platformCounter = 0  // Track total platforms created
  let doodlerLeftSpace = 156  // Center the doodler (400px grid width / 2 - 87px doodler width / 2)
  let startPoint = 300  // Start higher for better building placement
  let doodlerBottomSpace = startPoint
  const gravity = 0.9
  let upTimerId
  let downTimerId
  let isJumping = true
  let isGoingLeft = false
  let isGoingRight = false
  let lastDirection = 'right'  // Track last direction for sprite selection
  let leftTimerId
  let rightTimerId
  let backgroundScrollTimer
  
  // Audio system variables
  let isSfxEnabled = true  // SFX toggle state
  let startSound = null
  let gameMusic = null
  let dieSound = null
  
  // Initialize audio elements after DOM is loaded
  function initializeAudio() {
    startSound = document.getElementById('startSound')
    gameMusic = document.getElementById('gameMusic')
    dieSound = document.getElementById('dieSound')
    
    // Set volume levels
    if (startSound) startSound.volume = 0.7
    if (gameMusic) gameMusic.volume = 0.4  // Background music should be quieter
    if (dieSound) dieSound.volume = 0.8
  }
  
  // Audio management functions
  function playStartSound() {
    if (isSfxEnabled && startSound) {
      startSound.currentTime = 0  // Reset to beginning
      startSound.play().catch(e => console.log('Start sound play failed:', e))
    }
  }
  
  function playGameMusic() {
    if (isSfxEnabled && gameMusic) {
      gameMusic.currentTime = 0  // Reset to beginning
      gameMusic.play().catch(e => console.log('Game music play failed:', e))
    }
  }
  
  function stopGameMusic() {
    if (gameMusic) {
      gameMusic.pause()
      gameMusic.currentTime = 0
    }
  }
  
  function playDieSound() {
    if (isSfxEnabled && dieSound) {
      dieSound.currentTime = 0  // Reset to beginning
      dieSound.play().catch(e => console.log('Die sound play failed:', e))
    }
  }
  
  function toggleSfx() {
    isSfxEnabled = !isSfxEnabled
    if (!isSfxEnabled) {
      // Stop all currently playing audio
      stopGameMusic()
    }
    return isSfxEnabled
  }
  
  // Background scrolling variables
  let backgroundPosition = -2400  // Start lower in the light area
  let lastDoodlerPosition = startPoint
  const backgroundHeight = 3000  // Keep tall height for full image
  
  // Function to create continuous slow background scroll
  function startBackgroundScroll() {
    backgroundScrollTimer = setInterval(() => {
      // Stop background scrolling when score reaches 500 (you've "maxed out")
      if (score >= 500) {
        return; // Don't scroll background anymore
      }
      
      // Continuous slow upward scroll (move toward 0 from negative value)
      backgroundPosition += 0.5
      
      // Stop at the top instead of resetting - stay at 0 when reached
      if (backgroundPosition >= 0) {
        backgroundPosition = 0; // Stay at the top, don't reset
        clearInterval(backgroundScrollTimer); // Stop the scrolling timer
        return;
      }
      
      grid.style.backgroundPosition = `0px ${backgroundPosition}px`
    }, 50) // Update every 50ms for smooth animation
  }
  
  // Function to update background position for smooth infinite scroll
  function updateBackground() {
    // Stop background scrolling when score reaches 500 or when already at top
    if (score >= 500 || backgroundPosition >= 0) {
      return;
    }
    
    // Calculate how much the doodler has moved up
    const doodlerMovement = doodlerBottomSpace - lastDoodlerPosition
    
    // Add extra movement when doodler is jumping up (parallax effect)
    if (doodlerMovement > 0 && doodlerBottomSpace > 200) {
      // Additional scrolling based on doodler movement (move toward 0)
      backgroundPosition += doodlerMovement * 0.3
      
      // Stop at the top instead of resetting
      if (backgroundPosition >= 0) {
        backgroundPosition = 0; // Stay at the top
      }
      
      grid.style.backgroundPosition = `0px ${backgroundPosition}px`
    }
    
    lastDoodlerPosition = doodlerBottomSpace
  }

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
    if (score < 25) {
      return 6;  // Start with 6 platforms for easier beginning
    } else if (score < 75) {
      return 5;  // Reduce to 5 platforms after 25 points
    } else if (score < 125) {
      return 4;  // Reduce to 4 platforms after 75 points
    } else if (score < 175) {
      return 3;  // Reduce to 3 platforms after 125 points
    } else if (score < 225) {
      return 2;  // Reduce to 2 platforms after 175 points
    } else {
      return 1;  // Only 1 platform after 225 points - extreme difficulty
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
    // Stop all platform movement and scoring if game is over
    if (isGameOver) {
      return;
    }
    
    if (doodlerBottomSpace > 200) {
        // Update background position for scrolling effect
        updateBackground()
        
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
    console.log('🔧 createDoodler() called');
    
    // First, remove any existing doodlers from the grid
    const existingDoodlers = grid.querySelectorAll('.doodler');
    console.log('🗑️ Found', existingDoodlers.length, 'existing doodlers to remove');
    existingDoodlers.forEach(existingDoodler => {
      console.log('Removing existing doodler');
      existingDoodler.remove();
    });
    
    // Create a fresh doodler element
    const newDoodler = document.createElement('div');
    newDoodler.classList.add('doodler');
    
    // Position doodler in center of screen with down sprite
    newDoodler.style.left = doodlerLeftSpace + 'px';
    newDoodler.style.bottom = doodlerBottomSpace + 'px';
    newDoodler.style.width = '75px';  // Reduced from 87px
    newDoodler.style.height = '73px';  // Reduced from 85px
    newDoodler.style.position = 'absolute';
    newDoodler.style.backgroundImage = 'url("flunko-down.png")';
    newDoodler.style.backgroundSize = 'contain';
    // newDoodler.style.backgroundColor = 'red';  // Temporarily use solid color instead of image
    // newDoodler.style.border = '2px solid black';
    
    // Add to grid and update global reference
    grid.appendChild(newDoodler);
    
    // Update the global doodler reference
    doodler = newDoodler;
    
    // Create or update score display
    let scoreDisplay = document.getElementById('scoreDisplay');
    if (!scoreDisplay) {
      scoreDisplay = document.createElement('div');
      scoreDisplay.id = 'scoreDisplay';
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
      `;
      grid.appendChild(scoreDisplay);
    }
    scoreDisplay.textContent = 'Score: 0';
  }

  // Functions to change doodler sprite based on movement direction
  function setDoodlerUpSprite() {
    if (lastDirection === 'left') {
      doodler.style.backgroundImage = "url('flunko-up-L.png')";
    } else {
      doodler.style.backgroundImage = "url('flunko-up.png')";
    }
  }

  function setDoodlerDownSprite() {
    if (lastDirection === 'left') {
      doodler.style.backgroundImage = "url('flunko-down-L.png')";
    } else {
      doodler.style.backgroundImage = "url('flunko-down.png')";
    }
  }

  function setDoodlerDefaultSprite() {
    doodler.style.backgroundImage = "url('doodler-guy.png')";
  }

function fall() {
  // Stop falling if game is over
  if (isGameOver) {
    clearInterval(downTimerId)
    return
  }
  
  isJumping = false
  setDoodlerDownSprite()  // Set falling sprite
    clearInterval(upTimerId)
    downTimerId = setInterval(function () {
      // Check if game is over before continuing
      if (isGameOver) {
        clearInterval(downTimerId)
        return
      }
      
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
    // Stop jumping if game is over
    if (isGameOver) {
      clearInterval(upTimerId)
      return
    }
    
    clearInterval(downTimerId)
    isJumping = true
    setDoodlerUpSprite()  // Set jumping sprite
    upTimerId = setInterval(function () {
      // Check if game is over before continuing
      if (isGameOver) {
        clearInterval(upTimerId)
        return
      }
      
      console.log(startPoint)
      console.log('1', doodlerBottomSpace)
      doodlerBottomSpace += 20
      doodler.style.bottom = doodlerBottomSpace + 'px'
      
      // Update background during jump
      updateBackground()
      
      // Check if doodler went WAY too high (game over condition)
      // Only trigger game over if doodler goes extremely high (indicates infinite jump bug)
      if (doodlerBottomSpace >= 1500) {
        console.log('Doodler went way too high - Game Over')
        clearInterval(upTimerId)
        gameOver()
        return
      }
      
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
    lastDirection = 'left'  // Update direction for sprite selection
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
    lastDirection = 'right'  // Update direction for sprite selection
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
    
    // Stop background music and play die sound
    stopGameMusic()
    playDieSound()
    
    // Send score to parent window for leaderboard submission
    if (window.parent && score > 0) {
      window.parent.postMessage({
        type: 'FLUNKY_UPPY_SCORE',
        score: score
      }, '*');
      console.log('Score sent to parent:', score);
    }
    
    // Clear all intervals
    clearInterval(upTimerId)
    clearInterval(downTimerId)
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
    clearInterval(backgroundScrollTimer)
    
    // Remove ALL doodler elements from the grid
    const allDoodlers = grid.querySelectorAll('.doodler');
    allDoodlers.forEach(doodlerElement => {
      console.log('Removing doodler element');
      doodlerElement.remove();
    });
    
    // Set doodler reference to null
    doodler = null;
    
    // Clear all platforms but keep track of what we're removing
    while (grid.firstChild) {
      console.log('remove')
      grid.removeChild(grid.firstChild)
    }
    
    // Create game over screen with retro pixel styling
    const gameOverDiv = document.createElement('div');
    gameOverDiv.style.cssText = `
      position: absolute;
      top: 35%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.95);
      color: white;
      padding: 20px 25px;
      border-radius: 12px;
      text-align: center;
      font-family: 'Press Start 2P', 'Courier New', monospace;
      z-index: 1000;
      border: 4px solid #ff4757;
      box-shadow: 0 0 20px rgba(255, 71, 87, 0.8), inset 0 0 10px rgba(0,0,0,0.5);
      max-width: 280px;
      min-width: 240px;
      image-rendering: pixelated;
    `;
    gameOverDiv.innerHTML = `
      <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #ff4757; text-shadow: 2px 2px 0px #000, 0 0 10px #ff4757;">Game Over!</h3>
      <p style="margin: 0 0 18px 0; font-size: 13px; color: #00ffff; text-shadow: 1px 1px 0px #000;">Score: ${score}</p>
      <p style="margin: 0; font-size: 9px; color: #ffd700; line-height: 1.6; text-shadow: 1px 1px 0px #000;">Click the restart platform below to play again!</p>
    `;
    grid.appendChild(gameOverDiv);
    
    // Create restart platform and leaderboard button at the bottom
    createRestartPlatform();
    createLeaderboardButton();
    
    // Position doodler on the restart platform
    createGameOverDoodler();
  }

  function createRestartPlatform() {
    const restartPlatform = document.createElement('div');
    restartPlatform.id = 'restartPlatform';
    restartPlatform.classList.add('platform');
    restartPlatform.style.cssText = `
      position: absolute;
      bottom: 120px;
      left: 50%;
      transform: translateX(-50%);
      width: 160px;
      height: 28px;
      background: linear-gradient(135deg, #ffd700, #ffed4e);
      border: 4px solid #ff6b35;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: 0 4px 0px #cc5528, 0 8px 20px rgba(255, 215, 0, 0.6);
      z-index: 1001;
      animation: restartPlatformPulse 1.5s infinite alternate;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Press Start 2P', 'Courier New', monospace;
      font-size: 9px;
      font-weight: bold;
      color: #8B0000;
      text-shadow: 1px 1px 0px rgba(255,255,255,0.5);
      image-rendering: pixelated;
    `;
    restartPlatform.textContent = 'CLICK TO RESTART';
    
    // Add CSS animation for the pulsing effect
    if (!document.querySelector('#restartPlatformStyles')) {
      const style = document.createElement('style');
      style.id = 'restartPlatformStyles';
      style.textContent = `
        @keyframes restartPlatformPulse {
          0% {
            box-shadow: 0 4px 0px #cc5528, 0 8px 20px rgba(255, 215, 0, 0.6);
            transform: translateX(-50%) scale(1);
          }
          100% {
            box-shadow: 0 4px 0px #cc5528, 0 10px 25px rgba(255, 215, 0, 0.9);
            transform: translateX(-50%) scale(1.05);
          }
        }
        
        #restartPlatform:hover {
          background: linear-gradient(135deg, #ffed4e, #ffd700);
          transform: translateX(-50%) scale(1.1) !important;
          box-shadow: 0 4px 0px #cc5528, 0 12px 30px rgba(255, 215, 0, 1);
        }
        
        #restartPlatform:active {
          transform: translateX(-50%) translateY(2px) scale(1.08) !important;
          box-shadow: 0 2px 0px #cc5528, 0 6px 15px rgba(255, 215, 0, 0.8);
        }
      `;
      document.head.appendChild(style);
    }
    
    // Add click event listener for restart
    restartPlatform.addEventListener('click', restartGame);
    
    grid.appendChild(restartPlatform);
    return restartPlatform;
  }

  function createLeaderboardButton() {
    const leaderboardButton = document.createElement('div');
    leaderboardButton.id = 'leaderboardButton';
    leaderboardButton.style.cssText = `
      position: absolute;
      bottom: 70px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 28px;
      background: linear-gradient(135deg, #4CAF50, #45a049);
      border: 4px solid #2E7D32;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: 0 4px 0px #1B5E20, 0 8px 20px rgba(76, 175, 80, 0.6);
      z-index: 1001;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Press Start 2P', 'Courier New', monospace;
      font-size: 9px;
      font-weight: bold;
      color: white;
      text-shadow: 1px 1px 0px rgba(0,0,0,0.5);
      transition: all 0.3s ease;
      image-rendering: pixelated;
    `;
    leaderboardButton.textContent = '🏆 SCORES';
    
    // Add hover effect
    leaderboardButton.addEventListener('mouseenter', () => {
      leaderboardButton.style.background = 'linear-gradient(135deg, #45a049, #4CAF50)';
      leaderboardButton.style.transform = 'translateX(-50%) scale(1.1)';
      leaderboardButton.style.boxShadow = '0 4px 0px #1B5E20, 0 10px 25px rgba(76, 175, 80, 1)';
    });
    
    leaderboardButton.addEventListener('mouseleave', () => {
      leaderboardButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
      leaderboardButton.style.transform = 'translateX(-50%) scale(1)';
      leaderboardButton.style.boxShadow = '0 4px 0px #1B5E20, 0 8px 20px rgba(76, 175, 80, 0.6)';
    });
    
    // Add press effect
    leaderboardButton.addEventListener('mousedown', () => {
      leaderboardButton.style.transform = 'translateX(-130px) translateY(2px) scale(1.08)';
      leaderboardButton.style.boxShadow = '0 2px 0px #1B5E20, 0 6px 15px rgba(76, 175, 80, 0.8)';
    });
    
    leaderboardButton.addEventListener('mouseup', () => {
      leaderboardButton.style.transform = 'translateX(-130px) scale(1.1)';
      leaderboardButton.style.boxShadow = '0 4px 0px #1B5E20, 0 10px 25px rgba(76, 175, 80, 1)';
    });
    
    // Add click event listener to open leaderboard
    leaderboardButton.addEventListener('click', () => {
      // Send message to parent window to open leaderboard
      if (window.parent) {
        window.parent.postMessage({
          type: 'FLUNKY_UPPY_OPEN_LEADERBOARD'
        }, '*');
      }
    });
    
    grid.appendChild(leaderboardButton);
    return leaderboardButton;
  }

  function createGameOverDoodler() {
    // Make sure there are no existing doodlers before creating game over doodler
    const existingDoodlers = grid.querySelectorAll('.doodler');
    existingDoodlers.forEach(existing => {
      console.log('Removing existing doodler before game over doodler');
      existing.remove();
    });
    
    const gameOverDoodler = document.createElement('div');
    gameOverDoodler.classList.add('doodler');
    gameOverDoodler.classList.add('game-over-doodler'); // Add special class
    gameOverDoodler.style.cssText = `
      position: absolute;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      width: 95px;
      height: 92px;
      background-image: url('die.png');
      background-size: contain;
      background-repeat: no-repeat;
      image-rendering: pixelated;
      z-index: 1000;
    `;
    grid.appendChild(gameOverDoodler);
    return gameOverDoodler;
  }

  function restartGame() {
    console.log('🔄 Restarting game via platform click...');
    
    // Play start sound and background music for restart
    playStartSound()
    playGameMusic()
    
    // Reset all game variables
    isGameOver = false;
    score = 0;
    platformCounter = 0;  // Reset platform counter
    doodlerLeftSpace = 156;  // Center the doodler (400px grid width / 2 - 87px doodler width / 2)
    doodlerBottomSpace = startPoint;
    platforms = [];
    isJumping = true;
    isGoingLeft = false;
    isGoingRight = false;
    lastDirection = 'right';  // Reset to right-facing
    
    // Reset background scrolling
    backgroundPosition = -2400;  // Start lower in light area
    lastDoodlerPosition = startPoint;
    grid.style.backgroundPosition = '0px -2400px';
    
    // Clear all intervals including background scroll
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    clearInterval(backgroundScrollTimer);
    
    // Clear the grid completely
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    
    // Restart the game
    start();
  }


  function start() {
    if (!isGameOver) {
      // Initialize audio on first start
      if (!startSound) {
        initializeAudio()
      }
      
      // Clear any existing intervals first to prevent duplicates
      clearInterval(upTimerId);
      clearInterval(downTimerId);
      clearInterval(leftTimerId);
      clearInterval(rightTimerId);
      clearInterval(backgroundScrollTimer);
      
      createPlatforms()
      createDoodler()
      setInterval(movePlatforms,30)
      
      // Start continuous background scrolling
      startBackgroundScroll()
      
      // Start with an initial jump instead of falling
      jump() // Give character initial upward momentum
      
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
      
      console.log('🦘 Flunky Uppy game started! Use arrow keys or touch/tilt to play.');
    } 
  }
  
  // Don't auto-start - let it be triggered manually or on first load
  // start()
  
  // Also allow manual start command from parent
  window.startFlunkJump = function() {
    console.log('🎮 Manual start triggered from parent window');
    // Force restart the game
    restartGame();
  };

  // Start the game on first load
  start();
  
  // Listen for SFX toggle messages from parent window
  window.addEventListener('message', (event) => {
    if (event.data.type === 'SFX_TOGGLE') {
      const wasEnabled = isSfxEnabled;
      isSfxEnabled = event.data.enabled;
      console.log('🔊 SFX setting received:', isSfxEnabled ? 'ON' : 'OFF');
      
      // If SFX was disabled, stop current music
      if (wasEnabled && !isSfxEnabled) {
        stopGameMusic();
      }
      // If SFX was enabled and game is running, start music
      else if (!wasEnabled && isSfxEnabled && !isGameOver) {
        playGameMusic();
      }
    }
    
    // Handle start game with audio message
    if (event.data.type === 'START_GAME_WITH_AUDIO') {
      console.log('🎵 Starting game with audio from parent window');
      
      // Play start sound and background music
      playStartSound();
      playGameMusic();
    }
  });
})