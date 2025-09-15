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

  // Mobile controls
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  let gyroEnabled = false;

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
            score++
            updateScore()
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
            startPoint = doodlerBottomSpace
            jump()
            isJumping = true
          }
      })
    },20)
  }

  function jump() {
    clearInterval(downTimerId)
    isJumping = true
    upTimerId = setInterval(function () {
      doodlerBottomSpace += 20
      doodler.style.bottom = doodlerBottomSpace + 'px'
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
      if (doodlerLeftSpace <= 313) {
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

  // Desktop controls
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

  // Mobile controls setup
  function setupMobileControls() {
    if (isMobile) {
      // Request gyroscope permission for iOS 13+
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        grid.addEventListener('touchstart', () => {
          DeviceOrientationEvent.requestPermission()
            .then(response => {
              if (response == 'granted') {
                enableGyroscope();
              }
            })
            .catch(console.error);
        }, { once: true });
      } else {
        enableGyroscope();
      }
      
      // Touch controls
      grid.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = grid.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        
        if (x < grid.offsetWidth / 2) {
          moveLeft();
        } else {
          moveRight();
        }
      });
      
      grid.addEventListener('touchend', (e) => {
        e.preventDefault();
        moveStraight();
      });
    }
  }

  function enableGyroscope() {
    gyroEnabled = true;
    window.addEventListener('deviceorientation', handleGyroscope);
  }

  function handleGyroscope(event) {
    if (!gyroEnabled || isGameOver) return;
    
    const gamma = event.gamma || 0; // Left-right tilt
    
    if (Math.abs(gamma) > 5) { // Dead zone
      if (gamma > 5) {
        moveRight();
      } else if (gamma < -5) {
        moveLeft();
      }
    } else {
      moveStraight();
    }
  }

  function updateScore() {
    document.getElementById('score').textContent = score;
  }

  function gameOver() {
    isGameOver = true
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild)
    }
    
    // Show game over screen
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverScreen').style.display = 'block';
    
    clearInterval(upTimerId)
    clearInterval(downTimerId)
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
    
    // Send score to parent window for leaderboard
    if (window.parent) {
      window.parent.postMessage({
        type: 'FLUNK_JUMP_SCORE',
        score: score
      }, '*');
    }
  }

  function start() {
    if (!isGameOver) {
      createPlatforms()
      createDoodler()
      setInterval(movePlatforms,30)
      jump(startPoint)
      document.addEventListener('keyup', control)
      setupMobileControls()
      updateScore()
    } 
  }
  
  start()
})