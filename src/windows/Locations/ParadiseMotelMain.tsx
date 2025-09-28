import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";
import { useTimeBasedImage } from "utils/timeBasedImages";
import RetroTextBox from "components/RetroTextBox";

const ParadiseMotelMain = () => {
  const { openWindow, closeWindow } = useWindowsContext();
  
  // Use day/night images for Paradise Motel
  const dayImage = "/images/backgrounds/locations/paradise-motel/cover.webp";
  const nightImage = "/images/backgrounds/locations/paradise-motel/cover.webp"; // Same image for now
  const timeBasedInfo = useTimeBasedImage(dayImage, nightImage);

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

  const getCurrentBackground = () => {
    return timeBasedInfo.currentImage;
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Image Section */}
      <div className="relative flex-1">
        <img
          src={getCurrentBackground()}
          alt={`Paradise Motel Background - ${timeBasedInfo.isDay ? 'Day' : 'Night'}`}
          className="absolute inset-0 w-full h-full object-cover z-0"
          onError={(e) => {
            e.currentTarget.src = "/images/backdrops/BLANK.png";
          }}
        />
        {/* Overlay for better button visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      {/* Main Content - Desktop Layout */}
      <div className="hidden md:flex w-full h-full">
        {/* Left Side Buttons - Hidden on mobile */}
        <div className="w-64 bg-gradient-to-b from-purple-900 to-pink-800 flex-col justify-center gap-8 p-6 shadow-2xl flex">
          {/* Lobby */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.PARADISE_MOTEL_LOBBY,
                "Lobby",
                "The neon 'VACANCY' sign flickers with an eerie pink glow. An old guest book sits open with names that don't quite look... normal. The wallpaper peels in strange patterns that almost seem to move when you're not looking directly at them."
              )
            }
            className="bg-gradient-to-br from-pink-600 to-purple-800 hover:from-pink-500 hover:to-purple-700 text-white px-6 py-6 rounded-xl border-4 border-pink-400 hover:border-pink-300 transition-all duration-300 hover:scale-110 text-center text-lg font-black shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
          >
            🏨 Lobby
          </button>

          {/* Pool Area */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.PARADISE_MOTEL_POOL,
                "Pool Area",
                "The pool water is an unusual shade of green that seems to glow under the flickering motel lights. Floating in it is a rubber duck that wasn't there a moment ago... and it's staring at you with painted eyes that seem too real."
              )
            }
            className="bg-gradient-to-br from-purple-700 to-pink-900 hover:from-purple-600 hover:to-pink-800 text-white px-6 py-6 rounded-xl border-4 border-purple-400 hover:border-purple-300 transition-all duration-300 hover:scale-110 text-center text-lg font-black shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
          >
            🏊 Pool Area
          </button>
        </div>

        {/* Center Image Area */}
        <div className="flex-1 relative">
          <img
            src={getCurrentBackground()}
            alt={`Paradise Motel Background - ${timeBasedInfo.isDay ? 'Day' : 'Night'}`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/images/backdrops/BLANK.png";
            }}
          />
          {/* Overlay for atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-pink-900/30"></div>
        </div>

        {/* Right Side Buttons - Hidden on mobile */}
        <div className="w-64 bg-gradient-to-b from-purple-900 to-pink-800 flex-col justify-center gap-8 p-6 shadow-2xl flex">
          {/* Room 1 */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.PARADISE_MOTEL_ROOM_1,
                "Room 1",
                "The bed is unmade and there's a strange stain on the carpet that changes color depending on the angle. The TV shows only static, but sometimes you think you see shapes moving in it - shadows of people who checked in but never checked out."
              )
            }
            className="bg-gradient-to-br from-pink-700 to-purple-900 hover:from-pink-600 hover:to-purple-800 text-white px-6 py-6 rounded-xl border-4 border-pink-500 hover:border-pink-400 transition-all duration-300 hover:scale-110 text-center text-lg font-black shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
          >
            🛏️ Room 1
          </button>

          {/* Room 2 */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.PARADISE_MOTEL_ROOM_2,
                "Room 2",
                "This room looks exactly like Room 1, but everything is slightly... wrong. The mirror reflects something different than what's in the room. The clock runs backwards, and the phone occasionally rings with no one on the other end."
              )
            }
            className="bg-gradient-to-br from-purple-800 to-pink-900 hover:from-purple-700 hover:to-pink-800 text-white px-6 py-6 rounded-xl border-4 border-purple-500 hover:border-purple-400 transition-all duration-300 hover:scale-110 text-center text-lg font-black shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
          >
            🛏️ Room 2
          </button>
        </div>
      </div>

      {/* Mobile Bottom Buttons - Only visible on mobile */}
      <div className="md:hidden bg-gradient-to-r from-purple-900 to-pink-800 p-6 border-t-4 border-purple-400 shadow-2xl">
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {/* Lobby */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.PARADISE_MOTEL_LOBBY,
                "Lobby",
                "The neon 'VACANCY' sign flickers with an eerie pink glow. An old guest book sits open with names that don't quite look... normal."
              )
            }
            className="bg-gradient-to-br from-pink-600 to-purple-800 hover:from-pink-500 hover:to-purple-700 text-white px-4 py-4 rounded-lg border-3 border-pink-400 hover:border-pink-300 transition-all duration-300 hover:scale-105 text-center text-base font-black shadow-lg"
            style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
          >
            🏨 Lobby
          </button>

          {/* Room 1 */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.PARADISE_MOTEL_ROOM_1,
                "Room 1",
                "The bed is unmade and there's a strange stain on the carpet. The TV shows only static, but sometimes you see shapes moving in it."
              )
            }
            className="bg-gradient-to-br from-pink-700 to-purple-900 hover:from-pink-600 hover:to-purple-800 text-white px-4 py-4 rounded-lg border-3 border-pink-500 hover:border-pink-400 transition-all duration-300 hover:scale-105 text-center text-base font-black shadow-lg"
            style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
          >
            🛏️ Room 1
          </button>

          {/* Room 2 */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.PARADISE_MOTEL_ROOM_2,
                "Room 2",
                "This room looks exactly like Room 1, but everything is slightly... wrong. The mirror reflects something different."
              )
            }
            className="bg-gradient-to-br from-purple-800 to-pink-900 hover:from-purple-700 hover:to-pink-800 text-white px-4 py-4 rounded-lg border-3 border-purple-500 hover:border-purple-400 transition-all duration-300 hover:scale-105 text-center text-base font-black shadow-lg"
            style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
          >
            🛏️ Room 2
          </button>

          {/* Pool Area */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.PARADISE_MOTEL_POOL,
                "Pool Area",
                "The pool water is an unusual shade of green. Floating in it is a rubber duck that wasn't there a moment ago."
              )
            }
            className="bg-gradient-to-br from-purple-700 to-pink-900 hover:from-purple-600 hover:to-pink-800 text-white px-4 py-4 rounded-lg border-3 border-purple-400 hover:border-purple-300 transition-all duration-300 hover:scale-105 text-center text-base font-black shadow-lg"
            style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
          >
            🏊 Pool Area
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParadiseMotelMain;
