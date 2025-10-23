import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";
import { useTimeBasedImage } from "utils/timeBasedImages";
import CellarDoorDigitalLock from "components/CellarDoorDigitalLock";
import { getCliqueColors, getCliqueIcon } from "utils/cliqueColors";
import { getFontStyle } from "utils/fontConfig";
import HiddenRiffWindow from "windows/Games/HiddenRiffWindow";

const FreaksHouseMain = () => {
  const { openWindow, closeWindow } = useWindowsContext();
  
  // Use your uploaded day/night images for Freaks House
  const dayImage = "/images/icons/freaks-house-day.png";
  const nightImage = "/images/icons/freaks-house-night.png";
  const timeBasedInfo = useTimeBasedImage(dayImage, nightImage);

  const openRoom = (roomKey: string, title: string, content: string) => {
    const cliqueColors = getCliqueColors('FREAK');
    const fontStyle = getFontStyle('FREAK');
    
    openWindow({
      key: roomKey,
      window: (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(450px, 90vw)',
            maxHeight: '70vh',
            backgroundColor: cliqueColors.primary,
            border: '3px solid #FFFFFF',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Title */}
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.2)',
            padding: '12px 16px',
            borderBottom: '2px solid rgba(255,255,255,0.3)',
            ...fontStyle,
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            textAlign: 'center'
          }}>
            {getCliqueIcon('FREAK')} {title}
          </div>
          
          {/* Content */}
          <div style={{
            padding: '20px',
            flex: 1,
            backgroundColor: cliqueColors.primary,
            ...fontStyle,
            fontSize: '18px',
            lineHeight: '1.6',
            color: '#FFFFFF',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflow: 'auto'
          }}>
            {content}
          </div>
          
          {/* Close Button */}
          <div style={{
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderTop: '1px solid rgba(255,255,255,0.2)'
          }}>
            <button
              onClick={() => closeWindow(roomKey)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.5)',
                borderRadius: '4px',
                color: '#FFFFFF',
                padding: '6px 12px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                ...fontStyle,
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Close
            </button>
          </div>
        </div>
      ),
    });
  };

  const openBedroom = () => {
    openWindow({
      key: WINDOW_IDS.FREAKS_HOUSE_BEDROOM,
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.FREAKS_HOUSE_BEDROOM}
          headerTitle="Freak's Bedroom"
          onClose={() => closeWindow(WINDOW_IDS.FREAKS_HOUSE_BEDROOM)}
          initialWidth="90vw"
          initialHeight="90vh"
          resizable={true}
        >
          <div className="w-full h-full bg-[#1a1a1a] text-white overflow-auto flex flex-col">
            {/* Image Section - Takes up most of the space */}
            <div className="relative flex-1 min-h-[400px] bg-black">
              <img
                src="/images/locations/freaks-bedroom.png"
                alt="Freak's Bedroom Interior"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/images/backdrops/BLANK.png";
                }}
              />
            </div>
            
            {/* Description and Buttons Section - Below the image */}
            <div className="bg-black bg-opacity-90 p-4 sm:p-6 border-t border-gray-600">
              <h1 className="text-xl sm:text-2xl mb-2 sm:mb-3 font-bold text-center">🖤 Freak's Bedroom</h1>
              <p className="text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 text-center">
                Black curtains block out the light. Band posters and dark artwork cover every inch of the walls.
                The air smells faintly of incense and rebellion.
              </p>
              <p className="text-xs text-gray-300 mb-4 text-center">
                Explore different areas of the bedroom to discover hidden secrets and artistic chaos.
              </p>
              
              {/* Interactive Buttons */}
              <div className="max-w-lg mx-auto">
                {/* Three buttons in a row with responsive grid */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <button
                    onClick={() => {
                      openWindow({
                        key: WINDOW_IDS.HIDDEN_RIFF,
                        window: <HiddenRiffWindow />,
                      });
                    }}
                    className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base min-h-[44px]"
                  >
                    🎸 Guitar
                  </button>
                  
                  <button
                    onClick={() => {
                      alert('� TV interaction coming soon!');
                    }}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base min-h-[44px]"
                  >
                    📺 TV
                  </button>
                  
                  <button
                    onClick={() => {
                      alert('🖊️ Desk interaction coming soon!');
                    }}
                    className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base min-h-[44px]"
                  >
                    🖊️ Desk
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DraggableResizeableWindow>
      ),
    });
  };

  const openCellarDoorLock = () => {
    openWindow({
      key: WINDOW_IDS.FREAKS_HOUSE_CELLAR_DOOR_LOCK,
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.FREAKS_HOUSE_CELLAR_DOOR_LOCK}
          headerTitle="Cellar Door - Digital Lock"
          onClose={() => closeWindow(WINDOW_IDS.FREAKS_HOUSE_CELLAR_DOOR_LOCK)}
          initialWidth="min(400px, 90vw)"
          initialHeight="min(500px, 80vh)"
          resizable={false}
        >
          <CellarDoorDigitalLock
            onUnlock={() => {
              closeWindow(WINDOW_IDS.FREAKS_HOUSE_CELLAR_DOOR_LOCK);
              openRoom(
                WINDOW_IDS.FREAKS_HOUSE_CELLAR_DOOR,
                "Cellar Door",
                "The ancient lock clicks open with a deep, resonating thud. Beyond the door, stone steps descend into absolute darkness. Cold air flows upward, carrying whispers of forgotten secrets and the faint scent of something long buried..."
              );
            }}
            onCancel={() => closeWindow(WINDOW_IDS.FREAKS_HOUSE_CELLAR_DOOR_LOCK)}
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
          alt={`Freak's House Background - ${timeBasedInfo.isDay ? 'Day' : 'Night'}`}
          className="absolute inset-0 w-full h-full object-contain z-0 transition-opacity duration-500"
          onError={(e) => {
            e.currentTarget.src = "/images/backdrops/BLANK.png";
          }}
        />

        {/* Day/Night Atmospheric Overlay */}
        <div 
          className={`absolute inset-0 z-1 transition-all duration-500 ${
            !timeBasedInfo.isDay 
              ? 'bg-purple-900 bg-opacity-30' 
              : 'bg-red-100 bg-opacity-10'
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
          {/* Bedroom */}
          <button
            onClick={openBedroom}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 min-w-[120px] text-center"
          >
            🖤 Bedroom
          </button>

          {/* Basement */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.FREAKS_HOUSE_BASEMENT,
                "Basement",
                "A makeshift recording studio with amplifiers and instruments scattered around. 8-tracks line the floor and cassettes are stacked to the ceiling."
              )
            }
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 min-w-[120px] text-center"
          >
            🎸 Basement
          </button>

          {/* Attic */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.FREAKS_HOUSE_ATTIC,
                "Attic",
                "Dusty old books about the occult and conspiracy theories line makeshift shelves."
              )
            }
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 min-w-[120px] text-center"
          >
            📚 Attic
          </button>

          {/* Kitchen */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.FREAKS_HOUSE_KITCHEN,
                "Kitchen",
                "Energy drinks and instant noodles stack the counter. A coffee pot that never gets cleaned."
              )
            }
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 min-w-[120px] text-center"
          >
            ☕ Kitchen
          </button>
        </div>

        {/* Cellar Door Button - Ominous */}
        <div className="flex justify-center mt-4">
          <button
            onClick={openCellarDoorLock}
            className="bg-gradient-to-b from-purple-900 to-black text-purple-200 px-8 py-3 rounded-lg hover:from-purple-800 hover:to-gray-900 hover:text-purple-100 transition-all duration-300 hover:scale-105 min-w-[200px] text-center shadow-lg border-2 border-purple-800 hover:border-purple-600"
            style={{
              fontFamily: 'serif',
              fontSize: '18px',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              letterSpacing: '2px'
            }}
          >
            🚪 CELLAR DOOR
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreaksHouseMain;
