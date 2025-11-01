import React from 'react';
import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import StoryManual from "components/StoryManual";
import { WINDOW_IDS } from "fixed";

// Temporary simplified Paradise Motel component for testing cutscenes
const ParadiseMotelMainSimple = () => {
  const { openWindow, closeWindow } = useWindowsContext();

  const openRoom7Cutscene = () => {
    openWindow({
      key: WINDOW_IDS.STORY_MANUAL,
      window: (
        <StoryManual 
          autoPlayChapterId="paradise-motel" 
          onClose={() => closeWindow(WINDOW_IDS.STORY_MANUAL)}
        />
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
            src="/images/locations/paradise motel/paradise-motel-day.png"
            alt="Paradise Motel"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/images/backdrops/BLANK.png";
            }}
          />
        </div>
        
        <div className="w-full bg-gradient-to-r from-cyan-600 via-blue-700 to-orange-600 p-4 border-t-4 border-orange-400 shadow-2xl">
          <div className="flex justify-center">
            <button
              onClick={openRoom7Cutscene}
              className="bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white px-8 py-4 rounded-xl border-4 border-purple-300 hover:border-purple-200 transition-all duration-300 hover:scale-105 text-center text-lg font-black shadow-lg hover:shadow-xl"
              style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
            >
              🎬 Room 7 Cutscene (DEV)
            </button>
          </div>
        </div>
      </div>
    </DraggableResizeableWindow>
  );
};

export default ParadiseMotelMainSimple;