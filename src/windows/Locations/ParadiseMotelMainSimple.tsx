import React from 'react';
import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";

// Simplified Paradise Motel component with proper buttons
const ParadiseMotelMainSimple = () => {
  const { closeWindow } = useWindowsContext();

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
            src="/images/locations/paradise motel/paradise-motel-day.png"
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
              onClick={() => {
                alert('🏨 Lobby feature coming soon! Check back later.');
              }}
              className="bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white px-6 py-3 rounded-xl border-4 border-blue-300 hover:border-blue-200 transition-all duration-300 hover:scale-105 text-center text-lg font-black shadow-lg hover:shadow-xl"
              style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
            >
              � Lobby
            </button>
            <button
              onClick={() => {
                alert('🔄 Round Back feature coming soon! This is where you\'ll interact with the maid to get the Room 7 key.');
              }}
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