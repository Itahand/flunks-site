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

      {/* Buttons at bottom in grid layout - Arcade style */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: 'clamp(10px, 3vw, 20px)',
        borderTop: '3px solid #FFD700',
        boxShadow: '0 -5px 20px rgba(0,0,0,0.8)',
        zIndex: 10
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))',
          gap: 'clamp(8px, 2vw, 12px)',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {/* Workbench */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.SHED_WORKBENCH,
                "Workbench",
                "Tools are frozen mid-project: a half-sanded bat, a radio cracked open, and a sketch taped beneath a rusty clamp titled 'Phase Two'."
              )
            }
            style={{
              background: 'linear-gradient(45deg, #C2410C, #EA580C)',
              color: 'white',
              border: '2px solid white',
              borderRadius: '8px',
              padding: 'clamp(10px, 2.5vw, 15px)',
              fontSize: 'clamp(10px, 2.5vw, 14px)',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '100%',
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
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
            style={{
              background: 'linear-gradient(45deg, #57534E, #78716C)',
              color: 'white',
              border: '2px solid white',
              borderRadius: '8px',
              padding: 'clamp(10px, 2.5vw, 15px)',
              fontSize: 'clamp(10px, 2.5vw, 14px)',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '100%',
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
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
            style={{
              background: 'linear-gradient(45deg, #4D7C0F, #65A30D)',
              color: 'white',
              border: '2px solid white',
              borderRadius: '8px',
              padding: 'clamp(10px, 2.5vw, 15px)',
              fontSize: 'clamp(10px, 2.5vw, 14px)',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '100%',
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
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
            style={{
              background: 'linear-gradient(45deg, #0F172A, #475569)',
              color: 'white',
              border: '2px solid white',
              borderRadius: '8px',
              padding: 'clamp(10px, 2.5vw, 15px)',
              fontSize: 'clamp(10px, 2.5vw, 14px)',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '100%',
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            ⬇️ Trapdoor
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShedMain;
