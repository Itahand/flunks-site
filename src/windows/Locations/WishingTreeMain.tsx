import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import RetroTextBox from "components/RetroTextBox";
import { WINDOW_IDS } from "fixed";

const WishingTreeMain = () => {
  const { openWindow, closeWindow } = useWindowsContext();

  const openRoom = (roomKey: string, title: string, content: string) => {
    openWindow({
      key: roomKey,
      window: (
        <DraggableResizeableWindow
          windowsId={roomKey}
          headerTitle={title}
          onClose={() => closeWindow(roomKey)}
          initialWidth="360px"
          initialHeight="280px"
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
        src="/images/backdrops/BLANK.png"
        alt="Wishing Tree Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="absolute inset-0 z-10">
        {/* Tree Base */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.WISHING_TREE_BASE,
              "Tree Base",
              "Roots twist from dirt, worn smooth from decades of wishes. Coins glint in cracks, and initials carved deep hold secrets older than summer."
            )
          }
          className="absolute top-6 left-6 bg-green-800 text-white px-4 py-2 rounded shadow-lg border border-green-500 hover:bg-green-700 transition-transform duration-200 hover:scale-105"
        >
          🌳 Tree Base
        </button>

        {/* Wish Wall */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.WISHING_TREE_WALL,
              "Wish Wall",
              "Hundreds of notes flutter from branches: faded prayers, love confessions, and one that reads 'Find me at midnight' with yesterday's date."
            )
          }
          className="absolute top-6 right-6 bg-purple-800 text-white px-4 py-2 rounded shadow-lg border border-purple-500 hover:bg-purple-700 transition-transform duration-200 hover:scale-105"
        >
          📝 Wish Wall
        </button>

        {/* Sacred Hollow */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.WISHING_TREE_HOLLOW,
              "Sacred Hollow",
              "Inside the trunk, a hollow altar of candle wax and trinkets. A photo of someone you recognize is pinned beside a warning: 'Some wishes come true.'"
            )
          }
          className="absolute bottom-6 left-6 bg-amber-800 text-white px-4 py-2 rounded shadow-lg border border-amber-500 hover:bg-amber-700 transition-transform duration-200 hover:scale-105"
        >
          🕯️ Sacred Hollow
        </button>

        {/* Moon Garden */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.WISHING_TREE_GARDEN,
              "Moon Garden",
              "Night-blooming flowers circle the tree, their petals silver under moonlight. A stone bench holds a single glove and the scent of jasmine."
            )
          }
          className="absolute bottom-6 right-6 bg-indigo-800 text-white px-4 py-2 rounded shadow-lg border border-indigo-500 hover:bg-indigo-700 transition-transform duration-200 hover:scale-105"
        >
          🌙 Moon Garden
        </button>
      </div>
    </div>
  );
};

export default WishingTreeMain;
