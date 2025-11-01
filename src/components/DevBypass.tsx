import React from 'react';
import { useWindowsContext } from "contexts/WindowsContext";
import StoryManual from "components/StoryManual";
import { WINDOW_IDS } from "fixed";

interface DevBypassProps {
  isDevelopment: boolean;
}

const DevBypass: React.FC<DevBypassProps> = ({ isDevelopment }) => {
  const { openWindow, closeWindow } = useWindowsContext();

  // Only show in development
  if (!isDevelopment) return null;

  const openParadiseMotelCutscene = () => {
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
    <div className="fixed top-4 right-4 z-50 bg-red-600 text-white p-4 rounded-lg shadow-lg border-2 border-red-400">
      <div className="text-sm font-bold mb-2">🚀 DEV BYPASS MODE</div>
      <button
        onClick={openParadiseMotelCutscene}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
      >
        🎬 Paradise Motel Cutscene
      </button>
    </div>
  );
};

export default DevBypass;