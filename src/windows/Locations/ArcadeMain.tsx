import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";
import { useTimeBasedImage } from "utils/timeBasedImages";
import { useState } from "react";
import { useAuth } from "contexts/AuthContext";
import { awardGum } from "utils/gumAPI";
import FlappyFlunkWindow from "windows/Games/FlappyFlunkWindow";

const ArcadeMain = () => {
  const { openWindow, closeWindow } = useWindowsContext();
  const { walletAddress, user } = useAuth();
  const [gumClaimLoading, setGumClaimLoading] = useState(false);
  
  // Use your uploaded day/night images for Arcade
  const dayImage = "/images/icons/arcade-day.png";
  const nightImage = "/images/icons/arcade-night.png";
  const timeBasedInfo = useTimeBasedImage(dayImage, nightImage);

  // Handle snack corner gum claim
  const handleSnackGumClaim = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first to claim gum!');
      return;
    }

    setGumClaimLoading(true);
    
    try {
      // Get username - could be from user object or wallet address as fallback
      const username = user?.email || user?.username || walletAddress.slice(0, 8) + '...';
      
      // Award gum for the snack corner visit
      const gumResult = await awardGum(
        walletAddress,
        "arcade_snack",
        { username, location: 'arcade_snack_corner' }
      );

      if (gumResult.success) {
        alert(`🍿 Snack time! +${gumResult.earned} gum awarded! Come back in 24 hours for more.`);
      } else {
        if (gumResult.error?.includes('cooldown') || gumResult.error?.includes('limit')) {
          alert('🕐 You can only claim snack gum once every 24 hours. Come back later!');
        } else {
          alert(`❌ ${gumResult.error || 'Failed to claim gum. Please try again.'}`);
        }
      }
    } catch (error) {
      console.error('Error claiming snack gum:', error);
      alert('❌ Something went wrong. Please try again.');
    } finally {
      setGumClaimLoading(false);
    }
  };

  const openRoom = (roomKey: string, title: string, content: string) => {
    openWindow({
      key: roomKey,
      window: (
        <DraggableResizeableWindow
          windowsId={roomKey}
          headerTitle={title}
          onClose={() => closeWindow(roomKey)}
          initialWidth="min(400px, 90vw)"
          initialHeight="min(300px, 60vh)"
          resizable={false}
          style={{
            backgroundColor: '#C0C0C0',
            color: '#000000'
          }}
        >
          <div className="p-4 w-full h-full" style={{
            backgroundColor: '#C0C0C0',
            fontFamily: "'MS Sans Serif', 'Arial', sans-serif",
            fontSize: '14px',
            fontWeight: 'normal',
            lineHeight: '1.5',
            color: '#000000',
            textShadow: '1px 1px 0px rgba(255, 255, 255, 0.3)',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflow: 'hidden'
          }}>
            {content}
          </div>
        </DraggableResizeableWindow>
      ),
    });
  };

  const openSnackCorner = () => {
    openWindow({
      key: WINDOW_IDS.ARCADE_BOTTOM_LEFT,
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.ARCADE_BOTTOM_LEFT}
          headerTitle="Snack Corner"
          onClose={() => closeWindow(WINDOW_IDS.ARCADE_BOTTOM_LEFT)}
          initialWidth="70vw"
          initialHeight="70vh"
          resizable={true}
        >
          <div className="relative w-full h-full bg-[#1a1a1a] text-white overflow-hidden">
            {/* Snack Corner Background Image */}
            <img
              src="/images/locations/snack-corner.png"
              alt="Snack Corner Interior"
              className="absolute inset-0 w-full h-full object-cover z-0"
              onError={(e) => {
                e.currentTarget.src = "/images/backdrops/BLANK.png";
              }}
            />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 z-10 bg-black bg-opacity-50 p-6 flex flex-col justify-between">
              {/* Top Section - Interactive Button */}
              <div className="flex justify-center pt-8">
                <button
                  onClick={handleSnackGumClaim}
                  disabled={!walletAddress || gumClaimLoading}
                  className={`
                    px-6 py-3 rounded-lg font-bold text-white text-lg shadow-lg transition-all duration-200
                    ${walletAddress 
                      ? 'bg-purple-600 hover:bg-purple-700 hover:scale-105 cursor-pointer' 
                      : 'bg-gray-600 cursor-not-allowed opacity-50'
                    }
                    ${gumClaimLoading ? 'animate-pulse' : ''}
                  `}
                  title={walletAddress ? 'Claim 25 gum from the snack corner! (24h cooldown)' : 'Connect wallet to claim gum'}
                >
                  {gumClaimLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Claiming...
                    </span>
                  ) : (
                    '🍿 Claim 25 Gum'
                  )}
                </button>
              </div>

              {/* Bottom Section - Description */}
              <div className="bg-black bg-opacity-80 p-4 rounded">
                <h1 className="text-2xl mb-3 font-bold">🍿 Snack Corner</h1>
                <p className="text-sm leading-relaxed mb-3">
                  The perfect pit stop between gaming sessions. Rows of vending machines line the walls, 
                  filled with sugary drinks and salty snacks that fuel late-night gaming marathons. 
                  The neon glow from the machines casts colorful shadows across scattered candy wrappers 
                  and empty soda cans. A small seating area with retro booth-style seats provides the 
                  perfect spot to refuel while discussing high scores and gaming strategies with fellow 
                  arcade enthusiasts.
                </p>
                
                <p className="text-xs opacity-70">
                  The air smells of artificial cherry and the faint ozone from nearby arcade machines...
                </p>
                
                <div className="mt-3 p-2 bg-purple-900 bg-opacity-50 rounded text-center">
                  <p className="text-xs text-purple-200">
                    💫 Daily Gum Reward: 25 gum every 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DraggableResizeableWindow>
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
              "Old cabinets blink with forgotten high scores."
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
              "Dusty plush toys watch from behind the glass."
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
              "A locked door hides the real secrets of the arcade."
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
        </div>
      </div>
    </div>
  );
};

export default ArcadeMain;
