import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import RetroTextBox from "components/RetroTextBox";
import { WINDOW_IDS } from "fixed";

const FourThievesBarMain = () => {
  const { openWindow, closeWindow } = useWindowsContext();

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

  return (
    <div className="relative w-full h-full">
      <img
        src="/images/backdrops/BLANK.png"
        alt="4 Thieves Bar Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="absolute inset-0 z-10">
        {/* Main Bar */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.FOUR_THIEVES_BAR_MAIN_BAR,
              "Main Bar",
              "Sticky mahogany stretches the length of the room. Four mismatched bar stools are permanently claimed by regulars who speak only in whispers when outsiders enter."
            )
          }
          className="absolute top-6 left-6 bg-amber-900 text-white px-4 py-2 rounded shadow-lg border border-amber-500 hover:bg-amber-800 transition-transform duration-200 hover:scale-105"
        >
          🥃 Main Bar
        </button>

        {/* Pool Room */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.FOUR_THIEVES_BAR_POOL_ROOM,
              "Pool Room",
              "The green felt is scarred with cigarette burns, and the cue rack is missing two sticks. Someone carved a warning into the table: 'Don’t break unless you’re ready to lose.'"
            )
          }
          className="absolute top-6 right-6 bg-emerald-900 text-white px-4 py-2 rounded shadow-lg border border-emerald-500 hover:bg-emerald-800 transition-transform duration-200 hover:scale-105"
        >
          🎱 Pool Room
        </button>

        {/* Private Booths */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.FOUR_THIEVES_BAR_PRIVATE_BOOTH,
              "Private Booths",
              "Curved leather booths offer just enough privacy for bad deals. The flickering neon sign above them is wired to short out whenever the wrong name is spoken."
            )
          }
          className="absolute bottom-6 left-6 bg-purple-900 text-white px-4 py-2 rounded shadow-lg border border-purple-500 hover:bg-purple-800 transition-transform duration-200 hover:scale-105"
        >
          🕵️ Private Booths
        </button>

        {/* Back Alley */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.FOUR_THIEVES_BAR_BACK_ALLEY,
              "Back Alley",
              "A single buzzing light illuminates crates of contraband soda and a door marked KEEP OUT. The alley camera is always pointed just slightly the wrong way."
            )
          }
          className="absolute bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded shadow-lg border border-slate-500 hover:bg-slate-800 transition-transform duration-200 hover:scale-105"
        >
          🚪 Back Alley
        </button>
      </div>
    </div>
  );
};

export default FourThievesBarMain;
