import React from 'react';
import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import MaidDialogue from "components/MaidDialogue";
import { WINDOW_IDS } from "fixed";

// Simplified Paradise Motel component with proper buttons
const ParadiseMotelMainSimple = () => {
  const { openWindow, closeWindow } = useWindowsContext();

  // Get current hour for day/night logic (6 AM - 6 PM is daytime)
  const now = new Date();
  const hour = now.getHours();
  const isDayTime = hour >= 6 && hour < 18;

  // Function to open Lobby
  const openLobby = () => {
    openWindow({
      key: WINDOW_IDS.PARADISE_MOTEL_LOBBY,
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.PARADISE_MOTEL_LOBBY}
          headerTitle="Paradise Motel - Lobby"
          onClose={() => closeWindow(WINDOW_IDS.PARADISE_MOTEL_LOBBY)}
          initialWidth="80vw"
          initialHeight="80vh"
          resizable={true}
        >
          <div className="relative w-full h-full flex flex-col bg-black">
            <div className="relative flex-1 flex items-center justify-center min-h-0">
              <img
                src="/images/locations/paradise motel/lobby.png"
                alt="Paradise Motel Lobby"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/images/backdrops/BLANK.png";
                }}
              />
            </div>

            {/* Bottom Buttons */}
            <div className="w-full bg-gradient-to-r from-cyan-600 via-blue-700 to-orange-600 p-4 border-t-4 border-orange-400 shadow-2xl flex-shrink-0">
              <div className="flex justify-center gap-4 flex-wrap">
                <button
                  onClick={() => alert('🚪 Room 1 is locked. You need a key!')}
                  className="bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white px-4 py-2 rounded-lg border-4 border-purple-300 hover:border-purple-200 transition-all duration-300 hover:scale-105 text-center text-base font-black shadow-lg"
                  style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
                >
                  🚪 Room 1
                </button>
                <button
                  onClick={() => alert('🚪 Room 6 is locked. You need a key!')}
                  className="bg-gradient-to-br from-pink-600 to-pink-800 hover:from-pink-500 hover:to-pink-700 text-white px-4 py-2 rounded-lg border-4 border-pink-300 hover:border-pink-200 transition-all duration-300 hover:scale-105 text-center text-base font-black shadow-lg"
                  style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
                >
                  🚪 Room 6
                </button>
                <button
                  onClick={() => alert('🚪 Room 7 access depends on time of day and having the key from the maid!')}
                  className="bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-4 py-2 rounded-lg border-4 border-red-300 hover:border-red-200 transition-all duration-300 hover:scale-105 text-center text-base font-black shadow-lg"
                  style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
                >
                  🌙 Room 7
                </button>
                <button
                  onClick={() => alert('🔔 Ring the bell to call the front desk... if anyone is there.')}
                  className="bg-gradient-to-br from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 text-white px-4 py-2 rounded-lg border-4 border-yellow-300 hover:border-yellow-200 transition-all duration-300 hover:scale-105 text-center text-base font-black shadow-lg"
                  style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
                >
                  🔔 Bell
                </button>
              </div>
            </div>
          </div>
        </DraggableResizeableWindow>
      ),
    });
  };

  // Function to open Round Back (maid interaction)
  const openRoundBack = () => {
    const roundBackImage = isDayTime 
      ? "/images/locations/paradise motel/daytime-round-back.png"
      : "/images/locations/paradise motel/night-round-back.png";

    openWindow({
      key: "paradise-motel-round-back",
      window: (
        <DraggableResizeableWindow
          windowsId="paradise-motel-round-back"
          headerTitle="Paradise Motel - 'Round Back"
          onClose={() => closeWindow("paradise-motel-round-back")}
          initialWidth="80vw"
          initialHeight="80vh"
          resizable={true}
        >
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <img
              src={roundBackImage}
              alt="Paradise Motel Round Back"
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = "/images/backdrops/BLANK.png";
              }}
            />
            {isDayTime && (
              <div className="absolute bottom-4 left-4 right-4">
                <MaidDialogue onClose={() => closeWindow("paradise-motel-round-back")} />
              </div>
            )}
          </div>
        </DraggableResizeableWindow>
      ),
    });
  };

  return (
    <DraggableResizeableWindow
      windowsId={WINDOW_IDS.PARADISE_MOTEL_MAIN}
      headerTitle="Paradise Motel"
      onClose={() => closeWindow(WINDOW_IDS.PARADISE_MOTEL_MAIN)}
      initialWidth="80vw"
      initialHeight="80vh"
      resizable={true}
    >
      <div className="relative w-full h-full flex flex-col overflow-hidden bg-black">
        <div className="relative flex-1 flex items-center justify-center min-h-0 px-0">
          <img
            src={isDayTime 
              ? "/images/locations/paradise motel/paradise-motel-day.png"
              : "/images/locations/paradise motel/paradise-motel-night.png"
            }
            alt="Paradise Motel"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/images/backdrops/BLANK.png";
            }}
          />
        </div>
        
        <div className="w-full bg-gradient-to-r from-cyan-600 via-blue-700 to-orange-600 p-4 border-t-4 border-orange-400 shadow-2xl">
          <div className="flex justify-center gap-4">
            <button
              onClick={openLobby}
              className="bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white px-6 py-3 rounded-xl border-4 border-blue-300 hover:border-blue-200 transition-all duration-300 hover:scale-105 text-center text-lg font-black shadow-lg hover:shadow-xl"
              style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
            >
              🏨 Lobby
            </button>
            <button
              onClick={openRoundBack}
              className="bg-gradient-to-br from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white px-6 py-3 rounded-xl border-4 border-green-300 hover:border-green-200 transition-all duration-300 hover:scale-105 text-center text-lg font-black shadow-lg hover:shadow-xl"
              style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
            >
              🔄 Round Back
            </button>
          </div>
        </div>
      </div>
    </DraggableResizeableWindow>
  );
};

export default ParadiseMotelMainSimple;