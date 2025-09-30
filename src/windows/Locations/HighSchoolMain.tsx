import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";
import { useState } from "react";
import { useTimeBasedImage, isDayTime } from "utils/timeBasedImages";
import { useAuth } from "contexts/AuthContext";
import { awardGum } from "utils/gumAPI";
import { trackCafeteriaButtonClick } from "utils/cafeteriaButtonTracking";
import FootballerGumClaimButton from "components/FootballerGumClaimButton";
import HomecomingDanceButton from "components/HomecomingDanceButton";
// import HomecomingTestButton from "components/HomecomingTestButton";
import HomecomingStory from "../../components/HomecomingStory";

const HighSchoolMain = () => {
  const { openWindow, closeWindow } = useWindowsContext();
  const { walletAddress, user } = useAuth();
  const [buttonClickLoading, setButtonClickLoading] = useState(false);
  const [backgroundTransition, setBackgroundTransition] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // State for debugging homecoming story
  const [showHomecomingStory, setShowHomecomingStory] = useState(false);
  
  // State for school lockdown investigation popup
  const [showInvestigationPopup, setShowInvestigationPopup] = useState(false);

  // Use time-based images with your uploaded day/night photos
  const dayImage = "/images/icons/schooltapeday.png";
  const nightImage = "/images/icons/schooltapenight.png";
  const fallbackImage = "/images/backdrops/BLANK.png";

  // Get time-based image info
  const timeBasedInfo = useTimeBasedImage(dayImage, nightImage);

  // Get current background - use time-based only
  const getCurrentBackground = () => {
    return timeBasedInfo.currentImage;
  };

  // Handle cafeteria button click
  const handleCafeteriaButtonClick = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first to use this feature!');
      return;
    }

    setButtonClickLoading(true);
    
    try {
      // Get username - could be from user object or wallet address as fallback
      const username = user?.email || user?.username || walletAddress.slice(0, 8) + '...';
      
      // Track the cafeteria button click in the proper table
      const trackingResult = await trackCafeteriaButtonClick({
        walletAddress,
        username
      });

      if (trackingResult) {
        // Also award gum for the click
        const gumResult = await awardGum(
          walletAddress,
          "cafeteria_visit",
          { username }
        );

        // Dispatch event to update objectives immediately
        window.dispatchEvent(new CustomEvent('cafeteriaButtonClicked', { 
          detail: { walletAddress, username } 
        }));

        if (gumResult.success) {
          alert(`🍽️ Your cafeteria visit has been recorded! +${gumResult.earned} gum awarded!`);
        } else {
          alert('🍽️ Cafeteria visit recorded successfully!');
        }
      } else {
        alert('❌ Failed to record visit. Please try again.');
      }
    } catch (error) {
      console.error('Error clicking cafeteria button:', error);
      alert('❌ Something went wrong. Please try again.');
    } finally {
      setButtonClickLoading(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to blank image if day/night specific images don't exist
    e.currentTarget.src = fallbackImage;
  };

  const openRoom = (roomKey: string, title: string, content: string) => {
    openWindow({
      key: roomKey,
      window: (
        <DraggableResizeableWindow
          windowsId={roomKey}
          headerTitle={title}
          onClose={() => closeWindow(roomKey)}
          initialWidth="min(30vw, 90vw)"
          initialHeight="min(30vh, 60vh)"
          resizable={true}
          style={{
            backgroundColor: '#C0C0C0',
            color: '#000000'
          }}
        >
          <div className="p-4 w-full h-full overflow-hidden" style={{
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

  const openCafeteria = () => {
    openWindow({
      key: WINDOW_IDS.HIGH_SCHOOL_CAFETERIA,
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.HIGH_SCHOOL_CAFETERIA}
          headerTitle="Cafeteria"
          onClose={() => closeWindow(WINDOW_IDS.HIGH_SCHOOL_CAFETERIA)}
          initialWidth="70vw"
          initialHeight="70vh"
          resizable={true}
        >
          <div className="relative w-full h-full bg-[#1a1a1a] text-white overflow-hidden">
            {/* Cafeteria Background Image */}
            <img
              src="/images/locations/cafeteria.png"
              alt="Cafeteria Interior"
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
                  onClick={handleCafeteriaButtonClick}
                  disabled={!walletAddress || buttonClickLoading}
                  className={`
                    px-6 py-3 rounded-lg font-bold text-white text-lg shadow-lg transition-all duration-200
                    ${walletAddress 
                      ? 'bg-green-600 hover:bg-green-700 hover:scale-105 cursor-pointer' 
                      : 'bg-gray-600 cursor-not-allowed opacity-50'
                    }
                    ${buttonClickLoading ? 'animate-pulse' : ''}
                  `}
                  title={walletAddress ? 'Click to record your cafeteria visit!' : 'Connect wallet to use this feature'}
                >
                  {buttonClickLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Recording...
                    </span>
                  ) : (
                    '🍽️ Check In to Cafeteria'
                  )}
                </button>
              </div>

              {/* Bottom Section - Description */}
              <div className="bg-black bg-opacity-80 p-4 rounded">
                <h1 className="text-2xl mb-3 font-bold">🍽️ Cafeteria</h1>
                <p className="text-sm leading-relaxed mb-3">
                  The heart of student life at Flunks High School. Long tables stretch across the room, 
                  each telling stories of friendships, rivalries, and teenage drama. The lunch counter 
                  still has mysterious stains from the last day before semester zero began. Empty lunch 
                  trays sit abandoned on tables, and a suspicious smell lingers in the air - is it from 
                  the mystery meat or something more sinister? The vending machines hum ominously in 
                  the corner, their lights flickering with an otherworldly glow.
                </p>
                
                {/* Status indicator */}
                <div className="text-xs text-gray-300">
                  {walletAddress ? (
                    <span className="text-green-400">✅ Wallet connected - You can check in!</span>
                  ) : (
                    <span className="text-yellow-400">⚠️ Connect your wallet to record visits</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DraggableResizeableWindow>
      ),
    });
  };

  // Handler for showing investigation popup
  const showInvestigationWarning = () => {
    setShowInvestigationPopup(true);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Image Section */}
      <div className="relative flex-1">
        <img
          src={getCurrentBackground()}
          alt={`High School Background - ${timeBasedInfo.isDay ? 'Day' : 'Night'}`}
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500"
          onError={handleImageError}
        />

        {/* Day/Night Atmospheric Overlay */}
        <div 
          className={`absolute inset-0 z-1 transition-all duration-500 ${
            !timeBasedInfo.isDay
              ? 'bg-blue-900 bg-opacity-30' 
              : 'bg-yellow-100 bg-opacity-10'
          }`}
          style={{
            background: !timeBasedInfo.isDay
              ? 'linear-gradient(180deg, rgba(25, 25, 112, 0.3) 0%, rgba(0, 0, 0, 0.4) 100%)'
              : 'linear-gradient(180deg, rgba(255, 255, 224, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)'
          }}
        />

        {/* Time Info Display */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm z-20">
          Auto: {timeBasedInfo.currentTime}
        </div>

        {/* LOCKDOWN BANNER */}
        <div className="absolute top-4 right-4 bg-red-600 border-2 border-yellow-400 text-white px-4 py-2 rounded-lg text-sm font-bold z-20 animate-pulse shadow-lg">
          🚨 SCHOOL LOCKDOWN 🚨
        </div>
        
        {/* Police Tape Overlay */}
        <div className="absolute inset-x-0 top-0 h-12 z-10 pointer-events-none"
             style={{
               background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(251, 191, 36, 0.8) 10px, rgba(251, 191, 36, 0.8) 20px)',
               borderBottom: '3px solid #fbbf24'
             }}></div>
        <div className="absolute inset-x-0 bottom-0 h-12 z-10 pointer-events-none"
             style={{
               background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(251, 191, 36, 0.8) 10px, rgba(251, 191, 36, 0.8) 20px)',
               borderTop: '3px solid #fbbf24'
             }}></div>
      </div>

      {/* Room Buttons Section - SCHOOL LOCKDOWN */}
      <div className="bg-red-900 p-4 border-t border-yellow-400 border-t-4 relative" style={{
        background: 'repeating-linear-gradient(45deg, #7f1d1d, #7f1d1d 10px, #fbbf24 10px, #fbbf24 20px)',
        borderImage: 'repeating-linear-gradient(90deg, #000 0%, #fbbf24 50%, #000 100%) 1'
      }}>
        <div className="flex gap-4 flex-wrap justify-center max-w-4xl mx-auto">
        {/* Hallway - LOCKDOWN */}
        <button
          onClick={showInvestigationWarning}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-200 hover:scale-105 min-w-[120px] text-center border-2 border-yellow-400 shadow-lg"
        >
          ☠️ DO NOT ENTER
        </button>

        {/* Classroom - LOCKDOWN */}
        <button
          onClick={showInvestigationWarning}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-200 hover:scale-105 min-w-[120px] text-center border-2 border-yellow-400 shadow-lg"
        >
          ☠️ DO NOT ENTER
        </button>

        {/* Cafeteria - LOCKDOWN */}
        <button
          onClick={showInvestigationWarning}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-200 hover:scale-105 min-w-[120px] text-center border-2 border-yellow-400 shadow-lg"
        >
          ☠️ DO NOT ENTER
        </button>

        {/* Gymnasium - LOCKDOWN */}
        <button
          onClick={showInvestigationWarning}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-200 hover:scale-105 min-w-[120px] text-center border-2 border-yellow-400 shadow-lg"
        >
          ☠️ DO NOT ENTER
        </button>

        {/* Locker Room - LOCKDOWN */}
        <button
          onClick={showInvestigationWarning}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-200 hover:scale-105 min-w-[120px] text-center border-2 border-yellow-400 shadow-lg"
        >
          ☠️ DO NOT ENTER
        </button>

        {/* Library - LOCKDOWN */}
        <button
          onClick={showInvestigationWarning}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-200 hover:scale-105 min-w-[120px] text-center border-2 border-yellow-400 shadow-lg"
        >
          ☠️ DO NOT ENTER
        </button>

        {/* Principal's Office - LOCKDOWN */}
        <button
          onClick={showInvestigationWarning}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-200 hover:scale-105 min-w-[120px] text-center border-2 border-yellow-400 shadow-lg"
        >
          ☠️ DO NOT ENTER
        </button>
        </div>
      </div>

      {/* Investigation Lockdown Popup */}
      {showInvestigationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-red-900 border-4 border-yellow-400 rounded-lg p-8 max-w-md text-center shadow-2xl" 
               style={{
                 background: 'linear-gradient(45deg, #7f1d1d, #991b1b)',
                 boxShadow: '0 0 30px rgba(251, 191, 36, 0.5)'
               }}>
            <div className="text-6xl mb-4 animate-pulse">🚨</div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">SCHOOL UNDER INVESTIGATION</h2>
            <div className="text-4xl mb-4">☠️⚠️☠️</div>
            <p className="text-white text-lg mb-6 leading-relaxed">
              Seriously, stop clicking! The school is locked down due to mysterious circumstances surrounding 
              Flunko's disappearance. Federal agents have sealed off all rooms until further notice.
            </p>
            <p className="text-yellow-300 text-sm mb-6 italic">
              "Do not attempt entry. We mean it!"
            </p>
            <button 
              onClick={() => setShowInvestigationPopup(false)}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
            >
              🏃‍♂️ RUN AWAY!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HighSchoolMain;
