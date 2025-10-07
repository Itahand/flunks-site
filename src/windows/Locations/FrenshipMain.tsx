import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import RetroTextBox from "components/RetroTextBox";
import { WINDOW_IDS } from "fixed";

const FrenshipMain = () => {
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
        alt="Frenship Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="absolute inset-0 z-10">
        {/* Main Hall */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.FRENSHIP_HALL,
              "Main Hall",
              "Echoing corridors lined with faded yearbooks and trophy cases. A banner reads 'Friendship Lasts Forever' but someone crossed out 'Friend'."
            )
          }
          className="absolute top-6 left-6 bg-blue-800 text-white px-4 py-2 rounded shadow-lg border border-blue-500 hover:bg-blue-700 transition-transform duration-200 hover:scale-105"
        >
          🏛️ Main Hall
        </button>

        {/* Courtyard */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.FRENSHIP_COURTYARD,
              "Courtyard",
              "Benches circle a fountain that hasn't run in years. Graffiti layers tell stories: first kisses, broken promises, and coordinates to somewhere hidden."
            )
          }
          className="absolute top-6 right-6 bg-teal-800 text-white px-4 py-2 rounded shadow-lg border border-teal-500 hover:bg-teal-700 transition-transform duration-200 hover:scale-105"
        >
          ⛲ Courtyard
        </button>

        {/* Old Lockers */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.FRENSHIP_LOCKERS,
              "Old Lockers",
              "Rusted combinations spin freely now. Inside one: a letterman jacket, a mixtape labeled 'Our Summer', and a Polaroid of faces you almost recognize."
            )
          }
          className="absolute bottom-6 left-6 bg-slate-800 text-white px-4 py-2 rounded shadow-lg border border-slate-500 hover:bg-slate-700 transition-transform duration-200 hover:scale-105"
        >
          🔒 Old Lockers
        </button>

        {/* Memory Room */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.FRENSHIP_MEMORY,
              "Memory Room",
              "Walls covered in pinned memories: notes passed in class, friendship bracelets, and a map with red pins marking every meaningful moment."
            )
          }
          className="absolute bottom-6 right-6 bg-rose-800 text-white px-4 py-2 rounded shadow-lg border border-rose-500 hover:bg-rose-700 transition-transform duration-200 hover:scale-105"
        >
          💭 Memory Room
        </button>
      </div>
    </div>
  );
};

export default FrenshipMain;
