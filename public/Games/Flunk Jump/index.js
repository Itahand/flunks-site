document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const doodler = document.createElement('div')
  let isGameOver = false
  let speed = 3
  let platformCount = 5
  let platforms = []
  let score = 0
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
    constructor(newPlatBottom) {
      this.left = Math.random() * 315
      this.bottom = newPlatBottom
      this.visual = document.createElement('div')

      const visual = this.visual
      visual.classList.add('platform')
      visual.style.left = this.left + 'px'
      visual.style.bottom = this.bottom + 'px'
      grid.appendChild(visual)
    }
  }


  function createPlatforms() {
    for(let i =0; i < platformCount; i++) {
      let platGap = 600 / platformCount
      let newPlatBottom = 100 + i * platGap
      let newPlatform = new Platform (newPlatBottom)
      platforms.push(newPlatform)
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
            
            var newPlatform = new Platform(600)
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
          (doodlerLeftSpace <= (platform.left + 85)) &&
          !isJumping
          ) {
            console.log('tick')
            startPoint = doodlerBottomSpace
            jump()
            console.log('start', startPoint)
            isJumping = true
          }
      })

    },20)
}

  function jump() {
    clearInterval(downTimerId)
    isJumping = true
    upTimerId = setInterval(function () {
      console.log(startPoint)
      console.log('1', doodlerBottomSpace)
      doodlerBottomSpace += 20
      doodler.style.bottom = doodlerBottomSpace + 'px'
      console.log('2',doodlerBottomSpace)
      console.log('s',startPoint)
      if (doodlerBottomSpace > (startPoint + 200)) {
        fall()
        isJumping = false
      }
    },30)
  }

  function moveLeft() {
    if (isGoingRight) {
        clearInterval(rightTimerId)
        isGoingRight = false
    }
    isGoingLeft = true
    leftTimerId = setInterval(function () {
        if (doodlerLeftSpace >= 0) {
          console.log('going left')
          doodlerLeftSpace -=5
           doodler.style.left = doodlerLeftSpace + 'px'
        } else moveRight()
    },20)
  }

  function moveRight() {
    if (isGoingLeft) {
        clearInterval(leftTimerId)
        isGoingLeft = false
    }
    isGoingRight = true
    rightTimerId = setInterval(function () {
      //changed to 313 to fit doodle image
      if (doodlerLeftSpace <= 313) {
        console.log('going right')
        doodlerLeftSpace +=5
        doodler.style.left = doodlerLeftSpace + 'px'
      } else moveLeft()
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
    doodler.style.bottom = doodlerBottomSpace + 'px'
    if(e.key === 'ArrowLeft') {
      moveLeft()
    } else if (e.key === 'ArrowRight') {
      moveRight()
    } else if (e.key === 'ArrowUp') {
      moveStraight()
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
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      font-family: Arial, sans-serif;
      z-index: 1000;
    `;
    gameOverDiv.innerHTML = `
      <h2>Game Over!</h2>
      <p>Final Score: ${score}</p>
      <button onclick="location.reload()" style="
        background: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
      ">Play Again</button>
    `;
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
      jump(startPoint)
      
      // Desktop controls
      document.addEventListener('keyup', control)
      
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
  start()
})