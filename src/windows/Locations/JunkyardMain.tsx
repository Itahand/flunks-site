import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import RetroTextBox from "components/RetroTextBox";
import { WINDOW_IDS } from "fixed";

const JunkyardMain = () => {
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
        alt="Junkyard Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="absolute inset-0 z-10">
        {/* Car Stacks */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.JUNKYARD_CAR_STACKS,
              "Car Stacks",
              "Rusted cars reach three stories high, strapped together with chains. Scraps of varsity jackets hang from one fender like someone climbed too fast."
            )
          }
          className="absolute top-6 left-6 bg-amber-800 text-white px-4 py-2 rounded shadow-lg border border-amber-500 hover:bg-amber-700 transition-transform duration-200 hover:scale-105"
        >
          🚙 Car Stacks
        </button>

        {/* Crusher */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.JUNKYARD_CAR_CRUSHER,
              "Car Crusher",
              "Hydraulics groan as the crusher rests over a half-flattened sedan. A clipboard nearby lists plate numbers crossed out in red pen."
            )
          }
          className="absolute top-6 right-6 bg-rose-900 text-white px-4 py-2 rounded shadow-lg border border-rose-500 hover:bg-rose-800 transition-transform duration-200 hover:scale-105"
        >
          🏗️ Crusher
        </button>

        {/* Office */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.JUNKYARD_OFFICE,
              "Office Trailer",
              "A trailer desk buried under pawn slips, unpaid invoices, and a photo of three kids in Flunks jerseys. The radio scanner never stops chattering."
            )
          }
          className="absolute bottom-6 left-6 bg-cyan-900 text-white px-4 py-2 rounded shadow-lg border border-cyan-500 hover:bg-cyan-800 transition-transform duration-200 hover:scale-105"
        >
          🗂️ Office
        </button>

        {/* Secret Bunker */}
        <button
          onClick={() =>
            openRoom(
              WINDOW_IDS.JUNKYARD_SECRET_BUNKER,
              "Hidden Bunker",
              "A camouflaged hatch tucked beneath a tarp reveals concrete stairs and emergency supplies dated decades ago. There's a glowing map pinned to the wall below."
            )
          }
          className="absolute bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded shadow-lg border border-slate-500 hover:bg-slate-800 transition-transform duration-200 hover:scale-105"
        >
          🕳️ Bunker
        </button>
      </div>
    </div>
  );
};

export default JunkyardMain;
