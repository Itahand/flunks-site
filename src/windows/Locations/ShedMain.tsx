import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import RetroTextBox from "components/RetroTextBox";
import { WINDOW_IDS } from "fixed";

const ShedMain = () => {
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
        alt="Shed Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="absolute inset-0 z-10">
        {/* Workbench */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.SHED_WORKBENCH,
              "Workbench",
              "Tools are frozen mid-project: a half-sanded bat, a radio cracked open, and a sketch taped beneath a rusty clamp titled 'Phase Two'."
            )
          }
          className="absolute top-6 left-6 bg-orange-800 text-white px-4 py-2 rounded shadow-lg border border-orange-500 hover:bg-orange-700 transition-transform duration-200 hover:scale-105"
        >
          🔧 Workbench
        </button>

        {/* Tool Wall */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.SHED_TOOL_WALL,
              "Tool Wall",
              "Every hook is labeled in fading marker: wrenches, bolt cutters, and a spot simply marked '?'. One outline is empty."
            )
          }
          className="absolute top-6 right-6 bg-stone-800 text-white px-4 py-2 rounded shadow-lg border border-stone-500 hover:bg-stone-700 transition-transform duration-200 hover:scale-105"
        >
          🧰 Tool Wall
        </button>

        {/* Storage */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.SHED_STORAGE,
              "Storage Crates",
              "Milk crates overflow with polaroids, gas masks, and old science fair trophies. A hidden drawer clicks when you press the cracked baseball card."
            )
          }
          className="absolute bottom-6 left-6 bg-lime-800 text-white px-4 py-2 rounded shadow-lg border border-lime-500 hover:bg-lime-700 transition-transform duration-200 hover:scale-105"
        >
          📦 Storage
        </button>

        {/* Trapdoor */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.SHED_SECRET_TRAPDOOR,
              "Trapdoor",
              "A loose plank lifts to reveal a ladder descending into pitch darkness. The air below smells like oil and rain-soaked concrete."
            )
          }
          className="absolute bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded shadow-lg border border-slate-500 hover:bg-slate-700 transition-transform duration-200 hover:scale-105"
        >
          ⬇️ Trapdoor
        </button>
      </div>
    </div>
  );
};

export default ShedMain;
