import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";
import { useTimeBasedImage } from "utils/timeBasedImages";
import { useState } from "react";
import FlappyFlunkWindow from "windows/Games/FlappyFlunkWindow";
import FlunkJumpWindow from "windows/Games/FlunkJumpWindow";
import MultiColorText from "components/MultiColorText";
import { isFeatureEnabled } from "utils/buildMode";

const ArcadeMain = () => {
  const { openWindow, closeWindow } = useWindowsContext();
  
  // Use your uploaded day/night images for Arcade
  const dayImage = "/images/icons/arcade-day.png";
  const nightImage = "/images/icons/arcade-night.png";
  const timeBasedInfo = useTimeBasedImage(dayImage, nightImage);

  const openRoom = (roomKey: string, title: string, content: string) => {
    // Memphis-style colors for the text
    const memphisColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8E8', '#F7DC6F'];
    
    openWindow({
      key: roomKey,
      window: (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(500px, 95vw)',
            maxWidth: '500px',
            maxHeight: 'min(70vh, 600px)',
            minHeight: '300px',
            backgroundColor: '#1a1a1a',
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #FF6B6B 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, #4ECDC4 1px, transparent 1px),
              linear-gradient(45deg, transparent 40%, rgba(69, 183, 209, 0.1) 50%, transparent 60%),
              linear-gradient(-45deg, transparent 40%, rgba(150, 206, 180, 0.1) 50%, transparent 60%),
              radial-gradient(circle at 50% 50%, #FFEAA7 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px, 60px 60px, 80px 80px, 80px 80px, 30px 30px',
            backgroundPosition: '0 0, 20px 20px, 0 0, 40px 0, 10px 10px',
            border: '4px solid #FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.1)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Title */}
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 'clamp(8px, 4vw, 16px) clamp(12px, 5vw, 20px)',
            borderBottom: '3px solid #FFFFFF',
            textAlign: 'center',
            backgroundImage: 'linear-gradient(90deg, rgba(255,107,107,0.2) 0%, rgba(78,205,196,0.2) 50%, rgba(69,183,209,0.2) 100%)',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MultiColorText 
              text={`🎮 ${title}`}
              colors={memphisColors}
              fontSize="20px"
              fontFamily="'Press Start 2P', monospace"
            />
          </div>
          
          {/* Content */}
          <div style={{
            padding: 'clamp(12px, 6vw, 24px)',
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: '0'
          }}>
            <div style={{ 
              maxWidth: '100%', 
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <MultiColorText 
                text={content}
                colors={memphisColors}
                fontSize="16px"
                fontFamily="'Press Start 2P', monospace"
              />
            </div>
          </div>
          
          {/* Close Button */}
          <div style={{
            padding: 'clamp(12px, 4vw, 16px) clamp(16px, 6vw, 24px)',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderTop: '2px solid rgba(255,255,255,0.3)'
          }}>
            <button
              onClick={() => closeWindow(roomKey)}
              style={{
                backgroundColor: '#FF6B6B',
                backgroundImage: 'linear-gradient(45deg, #FF6B6B 0%, #4ECDC4 100%)',
                border: '3px solid #FFFFFF',
                borderRadius: '8px',
                color: '#FFFFFF',
                padding: 'clamp(8px, 3vw, 12px) clamp(16px, 6vw, 24px)',
                fontSize: 'clamp(10px, 3.5vw, 14px)',
                fontWeight: 'bold',
                fontFamily: "'Press Start 2P', monospace",
                cursor: 'pointer',
                textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                minWidth: '80px',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(-2deg)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255,107,107,0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
              }}
            >
              Close
            </button>
          </div>
        </div>
      ),
    });
  };

  const openSnackCorner = () => {
    const memphisColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8E8', '#F7DC6F'];
    
    openWindow({
      key: WINDOW_IDS.ARCADE_BOTTOM_LEFT,
      window: (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(600px, 95vw)',
            maxWidth: '600px',
            maxHeight: 'min(80vh, 700px)',
            minHeight: '400px',
            backgroundColor: '#1a1a1a',
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #FF6B6B 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, #4ECDC4 1px, transparent 1px),
              linear-gradient(45deg, transparent 40%, rgba(69, 183, 209, 0.1) 50%, transparent 60%),
              linear-gradient(-45deg, transparent 40%, rgba(150, 206, 180, 0.1) 50%, transparent 60%),
              radial-gradient(circle at 50% 50%, #FFEAA7 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px, 60px 60px, 80px 80px, 80px 80px, 30px 30px',
            backgroundPosition: '0 0, 20px 20px, 0 0, 40px 0, 10px 10px',
            border: '4px solid #FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.1)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Title */}
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 'clamp(8px, 4vw, 16px) clamp(12px, 5vw, 20px)',
            borderBottom: '3px solid #FFFFFF',
            textAlign: 'center',
            backgroundImage: 'linear-gradient(90deg, rgba(255,107,107,0.2) 0%, rgba(78,205,196,0.2) 50%, rgba(69,183,209,0.2) 100%)',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MultiColorText 
              text="🍿 Snack Corner"
              colors={memphisColors}
              fontSize="20px"
              fontFamily="'Press Start 2P', monospace"
            />
          </div>
          
          {/* Content */}
          <div style={{
            padding: 'clamp(12px, 6vw, 24px)',
            flex: 1,
            overflow: 'auto',
            textAlign: 'center',
            minHeight: '0'
          }}>
            <div style={{ 
              marginBottom: 'clamp(12px, 5vw, 20px)',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}>
              <MultiColorText 
                text="SUGAR RUSH PARADISE! Cotton candy machines spin pink and blue clouds!"
                colors={memphisColors}
                fontSize="14px"
                fontFamily="'Press Start 2P', monospace"
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <MultiColorText 
                text="Popcorn kernels POP POP POP in symphony! Soda fountains bubble with rainbow fizz! Giant pretzels twist like golden sculptures!"
                colors={memphisColors}
                fontSize="12px"
                fontFamily="'Press Start 2P', monospace"
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <MultiColorText 
                text="The sweet aroma of victory and nachos fills the air! Candy machines glow like neon beacons calling to hungry gamers!"
                colors={['#DDA0DD', '#98D8E8', '#F7DC6F', '#FF6B6B']}
                fontSize="11px"
                fontFamily="'Press Start 2P', monospace"
              />
            </div>
          </div>
          
          {/* Close Button */}
          <div style={{
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderTop: '2px solid rgba(255,255,255,0.3)'
          }}>
            <button
              onClick={() => closeWindow(WINDOW_IDS.ARCADE_BOTTOM_LEFT)}
              style={{
                backgroundColor: '#FF6B6B',
                backgroundImage: 'linear-gradient(45deg, #FF6B6B 0%, #4ECDC4 100%)',
                border: '3px solid #FFFFFF',
                borderRadius: '8px',
                color: '#FFFFFF',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: "'Press Start 2P', monospace",
                cursor: 'pointer',
                textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(-2deg)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255,107,107,0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
              }}
            >
              Close
            </button>
          </div>
        </div>
      ),
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Image Section */}
      <div className="relative flex-1">
        <img
          src={timeBasedInfo.currentImage}
          alt={`Arcade Background - ${timeBasedInfo.isDay ? 'Day' : 'Night'}`}
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500"
          onError={(e) => {
            e.currentTarget.src = "/images/backdrops/BLANK.png";
          }}
        />

        {/* Day/Night Atmospheric Overlay */}
        <div 
          className={`absolute inset-0 z-1 transition-all duration-500 ${
            !timeBasedInfo.isDay 
              ? 'bg-purple-900 bg-opacity-20' 
              : 'bg-yellow-100 bg-opacity-5'
          }`}
        />

        {/* Time Info Display */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm z-20">
          {timeBasedInfo.currentTime}
        </div>
      </div>

      {/* Room Buttons Section */}
      <div className="bg-gray-800 p-4 border-t border-gray-600">
        <div className="flex gap-4 flex-wrap justify-center max-w-4xl mx-auto">
        {/* Front Area */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.ARCADE_TOP_LEFT,
              "Front Area",
              "NEON LIGHTS FLASH! Rows of vintage arcade cabinets line the walls like colorful soldiers! Street Fighter II, Pac-Man, and Galaga machines hum with electric energy! High score screens flicker with legendary names! The carpet is worn from decades of shuffling feet and victory dances!"
            )
          }
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 min-w-[120px] text-center"
        >
          🎮 Front Area
        </button>

        {/* Prize Booth */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.ARCADE_TOP_RIGHT,
              "Prize Booth",
              "STUFFED ANIMALS EVERYWHERE! Giant teddy bears and rainbow unicorns hang from every hook! Claw machines filled with mysterious treasures! Spinning wheels of fortune! Tickets cascade like confetti from redemption games! The prize master watches with knowing eyes!"
            )
          }
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 min-w-[120px] text-center"
        >
          🎁 Prize Booth
        </button>

        {/* Snack Corner */}
        <button
          onClick={openSnackCorner}
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 min-w-[120px] text-center"
        >
          🍿 Snack Corner
        </button>

        {/* Back Room */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.ARCADE_BOTTOM_RIGHT,
              "Back Room",
              "FORBIDDEN ZONE! A mysterious door marked EMPLOYEES ONLY! What secrets lie beyond? Rumors speak of prototype games never released! The door handle is warm to the touch! Strange electronic sounds echo from within! Do you dare to discover what's hidden?"
            )
          }
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 min-w-[120px] text-center"
        >
          🚪 Back Room
        </button>
        
        {/* Flappy Flunk Game */}
        <button
          onClick={() =>
            openWindow({
              key: WINDOW_IDS.FLAPPY_FLUNK,
              window: (
                <DraggableResizeableWindow
                  windowsId={WINDOW_IDS.FLAPPY_FLUNK}
                  onClose={() => closeWindow(WINDOW_IDS.FLAPPY_FLUNK)}
                  headerTitle="Flappy Flunk"
                  initialWidth="480px"
                  initialHeight="640px"
                  headerIcon="/images/icons/flappyflunk.png"
                >
                  <FlappyFlunkWindow />
                </DraggableResizeableWindow>
              ),
            })
          }
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500 transition-all duration-200 hover:scale-105 min-w-[120px] text-center font-bold"
        >
          🐦 FLAPPY FLUNK
        </button>
        
        {/* Flunky Uppy Game - Build Mode Only */}
        {isFeatureEnabled('showFlunkyUppy') && (
          <button
            onClick={() =>
              openWindow({
                key: WINDOW_IDS.FLUNKY_UPPY,
                window: (
                  <DraggableResizeableWindow
                    windowsId={WINDOW_IDS.FLUNKY_UPPY}
                    onClose={() => closeWindow(WINDOW_IDS.FLUNKY_UPPY)}
                    headerTitle="Flunky Uppy"
                    initialWidth="420px"
                    initialHeight="720px"
                    headerIcon="/images/icons/flunky-uppy-icon.png?v=2"
                  >
                    <FlunkJumpWindow />
                  </DraggableResizeableWindow>
                ),
              })
            }
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-500 transition-all duration-200 hover:scale-105 min-w-[120px] text-center font-bold"
          >
            🦘 FLUNKY UPPY
          </button>
        )}

        {/* Coming Soon Section */}
        <button
          onClick={() => {
            openWindow({
              key: "arcade-coming-soon",
              window: (
                <div
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    backgroundColor: '#000000',
                    border: '4px solid #FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    padding: '20px'
                  }}
                >
                  {/* Close Button */}
                  <button
                    onClick={() => closeWindow("arcade-coming-soon")}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: '#FF0000',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      zIndex: 1001
                    }}
                  >
                    ✕
                  </button>
                  
                  {/* Coming Soon Image */}
                  <img 
                    src="/images/coming-soon.png"
                    alt="Coming Soon"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                      margin: '0 auto'
                    }}
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 48px; font-family: 'Press Start 2P', monospace;">
                            🚧 COMING SOON 🚧
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              ),
            });
          }}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded hover:from-yellow-400 hover:to-orange-400 transition-all duration-200 hover:scale-105 min-w-[120px] text-center font-bold border-2 border-yellow-300 shadow-lg animate-pulse"
        >
          🚧 COMING SOON
        </button>
        </div>
      </div>
    </div>
  );
};

export default ArcadeMain;
