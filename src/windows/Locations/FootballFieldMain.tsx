import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";
import RetroTextBox from "components/RetroTextBox";
import { useState, useMemo } from "react";
import { useAuth } from "contexts/AuthContext";
import { awardGum } from "utils/gumAPI";
import { trackFridayNightLightsClick } from "utils/fridayNightLightsTracking";

const FootballFieldMain = () => {
  const { openWindow, closeWindow } = useWindowsContext();
  const { walletAddress, user } = useAuth();
  const [buttonClickLoading, setButtonClickLoading] = useState(false);

  // Create audio instance for Friday Night Lights
  const fridayNightLightsAudio = useMemo(() => new Audio("/sounds/friday-night-lights.mp3"), []);

  const playFridayNightLightsSound = () => {
    try {
      fridayNightLightsAudio.currentTime = 0; // Reset to beginning
      fridayNightLightsAudio.play().catch(console.error);
    } catch (error) {
      console.warn('Could not play Friday Night Lights audio:', error);
    }
  };

  const handleFridayNightLightsClick = async () => {
    if (!walletAddress || !user) {
      alert("Please connect your wallet first!");
      return;
    }

    if (buttonClickLoading) return;

    // Play the Friday Night Lights audio immediately when clicked
    playFridayNightLightsSound();

    setButtonClickLoading(true);
    try {
      // Track the click
      const tracked = await trackFridayNightLightsClick(walletAddress);
      
      if (tracked) {
        // Award 50 GUM for clicking Friday Night Lights
        await awardGum(walletAddress, "friday_night_lights", { amount: 50, description: "Friday Night Lights click" });
        alert("🏈 FRIDAY NIGHT LIGHTS! You earned 50 GUM! The crowd roars with excitement!");
      } else {
        alert("🏈 You've already experienced Friday Night Lights! The magic only happens once.");
      }
    } catch (error) {
      console.error("Failed to process Friday Night Lights click:", error);
      alert("Something went wrong with Friday Night Lights. Try again!");
    } finally {
      setButtonClickLoading(false);
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
          initialWidth="400px"
          initialHeight="300px"
          resizable={false}
        >
          <div className="p-4 w-full h-full">
            <RetroTextBox
              title={title}
              content={content}
              className="w-full h-full"
            />
          </div>
        </DraggableResizeableWindow>
      ),
    });
  };

  return (
    <div className="relative w-full h-full">
      <img
        src="/images/backdrops/football-field.png"
        alt="Football Field Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
        onError={(e) => {
          // Fallback to blank background if image fails to load
          e.currentTarget.src = "/images/backdrops/BLANK.png";
        }}
      />

      {/* Friday Night Lights Button - Center of field */}
      <button
        onClick={handleFridayNightLightsClick}
        disabled={buttonClickLoading}
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 
          px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 
          ${buttonClickLoading 
            ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
            : 'bg-yellow-600 hover:bg-yellow-500 text-white hover:scale-110 shadow-lg hover:shadow-xl'
          }`}
      >
        {buttonClickLoading ? '⏳ Loading...' : '🏈 FRIDAY NIGHT LIGHTS'}
      </button>

      {/* Bleachers/Stands */}
      <button
        onClick={() =>
          openRoom(
            WINDOW_IDS.FOOTBALL_FIELD_STANDS,
            "Bleachers",
            "Metal bleachers echo with the cheers of past games. Old programs and popcorn containers litter the ground."
          )
        }
        className="absolute top-4 left-4 bg-gray-900 text-white px-3 py-2 rounded z-10 hover:bg-gray-700 transition-transform duration-200 hover:scale-105"
      >
        🏟️ Stands
      </button>

      {/* Locker Room */}
      <button
        onClick={() =>
          openRoom(
            WINDOW_IDS.FOOTBALL_FIELD_LOCKER_ROOM,
            "Locker Room",
            "The smell of sweat and determination lingers. Motivational speeches still echo off the tiled walls."
          )
        }
        className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-2 rounded z-10 hover:bg-gray-700 transition-transform duration-200 hover:scale-105"
      >
        👕 Locker Room
      </button>

      {/* Equipment Shed */}
      <button
        onClick={() =>
          openRoom(
            WINDOW_IDS.FOOTBALL_FIELD_EQUIPMENT_SHED,
            "Equipment Shed",
            "Helmets, shoulder pads, and practice equipment stored in organized chaos."
          )
        }
        className="absolute bottom-4 left-4 bg-gray-900 text-white px-3 py-2 rounded z-10 hover:bg-gray-700 transition-transform duration-200 hover:scale-105"
      >
        ⚡ Equipment
      </button>
    </div>
  );
};

export default FootballFieldMain;
