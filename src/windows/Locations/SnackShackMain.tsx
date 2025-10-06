import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import RetroTextBox from "components/RetroTextBox";
import { WINDOW_IDS } from "fixed";

const SnackShackMain = () => {
  const { openWindow, closeWindow } = useWindowsContext();

  const openRoom = (roomKey: string, title: string, content: string) => {
    openWindow({
      key: roomKey,
      window: (
        <DraggableResizeableWindow
          windowsId={roomKey}
          headerTitle={title}
          onClose={() => closeWindow(roomKey)}
          initialWidth="380px"
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
        src="/images/backdrops/BLANK.png"
        alt="Snack Shack Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="absolute inset-0 z-10">
        {/* Counter */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.SNACK_SHACK_COUNTER,
              "Service Counter",
              "The sliding window is propped open with a chipped wooden spoon. A greasy cash box sits beside a stack of order tickets with the corners burnt from the grill heat."
            )
          }
          className="absolute top-6 left-6 bg-yellow-700 text-white px-4 py-2 rounded shadow-lg hover:bg-yellow-600 transition-transform duration-200 hover:scale-105"
        >
          🍔 Counter
        </button>

        {/* Grill Line */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.SNACK_SHACK_GRILL_LINE,
              "Grill Line",
              "Two sizzling flat-tops battle for space with a battered fryer. Order bells clang, and the air smells like salt, grease, and late-night secrets overheard by the fry cook."
            )
          }
          className="absolute top-6 right-6 bg-red-700 text-white px-4 py-2 rounded shadow-lg hover:bg-red-600 transition-transform duration-200 hover:scale-105"
        >
          🍟 Grill Line
        </button>

        {/* Stock Room */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.SNACK_SHACK_STOCK_ROOM,
              "Stock Room",
              "Shelves sag with boxes of paper boats, neon syrup, and an industrial stash of napkins. A cooler hums loudly, hiding a secret ledger taped beneath it."
            )
          }
          className="absolute bottom-6 left-6 bg-emerald-700 text-white px-4 py-2 rounded shadow-lg hover:bg-emerald-600 transition-transform duration-200 hover:scale-105"
        >
          📦 Stock Room
        </button>

        {/* Picnic Area */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.SNACK_SHACK_PICNIC_AREA,
              "Picnic Tables",
              "Sticky picnic tables stretch toward the parking lot lights. Carved initials crisscross the wood, and someone left a boombox playing a muffled slow jam."
            )
          }
          className="absolute bottom-6 right-6 bg-blue-700 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-600 transition-transform duration-200 hover:scale-105"
        >
          🎶 Picnic Area
        </button>
      </div>
    </div>
  );
};

export default SnackShackMain;
