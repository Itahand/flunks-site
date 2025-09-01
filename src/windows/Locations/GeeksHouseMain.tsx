import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";
import { useTimeBasedImage } from "utils/timeBasedImages";
import ShedDigitalLock from "components/ShedDigitalLock";

const GeeksHouseMain = () => {
  const { openWindow, closeWindow } = useWindowsContext();
  
  // Use your uploaded day/night images for Geeks House
  const dayImage = "/images/icons/geeks-house-day.png";
  const nightImage = "/images/icons/geeks-house-night.png";
  const timeBasedInfo = useTimeBasedImage(dayImage, nightImage);

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
        >
          <div className="p-4 text-sm leading-relaxed bg-[#1a1a1a] text-white w-full h-full">
            <h1 className="text-xl mb-2">{title}</h1>
            <p>{content}</p>
          </div>
        </DraggableResizeableWindow>
      ),
    });
  };

  const openShedWithLock = () => {
    openWindow({
      key: WINDOW_IDS.GEEKS_HOUSE_SHED_LOCK,
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.GEEKS_HOUSE_SHED_LOCK}
          headerTitle="🔒 Shed Security Access"
          onClose={() => closeWindow(WINDOW_IDS.GEEKS_HOUSE_SHED_LOCK)}
          initialWidth="450px"
          initialHeight="700px"
          resizable={true}
        >
          <ShedDigitalLock 
            onCancel={() => closeWindow(WINDOW_IDS.GEEKS_HOUSE_SHED_LOCK)}
          />
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
          alt={`Geek's House Background - ${timeBasedInfo.isDay ? 'Day' : 'Night'}`}
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500"
          onError={(e) => {
            e.currentTarget.src = "/images/backdrops/BLANK.png";
          }}
        />

        {/* Day/Night Atmospheric Overlay */}
        <div 
          className={`absolute inset-0 z-1 transition-all duration-500 ${
            !timeBasedInfo.isDay 
              ? 'bg-green-900 bg-opacity-20' 
              : 'bg-cyan-100 bg-opacity-5'
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
          {/* Lab */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.GEEKS_HOUSE_LAB,
                "Science Lab",
                "Beakers bubble with mysterious experiments. Chemistry sets and microscopes cover the workbench."
              )
            }
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 min-w-[120px] text-center"
          >
            🧪 Lab
          </button>

          {/* Computer Room */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.GEEKS_HOUSE_COMPUTER_ROOM,
                "Computer Room",
                "Multiple monitors glow in the darkness. Lines of code scroll endlessly across the screens."
              )
            }
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 min-w-[120px] text-center"
          >
            💻 Computer Room
          </button>

          {/* Library */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.GEEKS_HOUSE_LIBRARY,
                "Library",
                "Floor-to-ceiling bookshelves filled with technical manuals and science fiction novels."
              )
            }
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 min-w-[120px] text-center"
          >
            📖 Library
          </button>

          {/* Workshop */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.GEEKS_HOUSE_WORKSHOP,
                "Workshop",
                "Electronic components and half-built gadgets litter the workbench. Soldering irons and circuit boards everywhere. Zero parts go unused here."
              )
            }
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 min-w-[120px] text-center"
          >
            🔧 Workshop
          </button>
        </div>

        {/* SHED Button - Longer and Ominous */}
        <div className="flex justify-center mt-4">
          <button
            onClick={openShedWithLock}
            className="bg-gradient-to-b from-red-900 to-black text-red-200 px-8 py-3 rounded-lg hover:from-red-800 hover:to-gray-900 hover:text-red-100 transition-all duration-300 hover:scale-105 min-w-[200px] text-center shadow-lg border-2 border-red-800 hover:border-red-600"
            style={{
              fontFamily: 'serif',
              fontSize: '18px',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              letterSpacing: '2px'
            }}
          >
            🏚️ SHED
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeeksHouseMain;
