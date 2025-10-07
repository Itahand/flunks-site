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
          {/* Counter */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.SNACK_SHACK_COUNTER,
                "Service Counter",
                "The sliding window is propped open with a chipped wooden spoon. A greasy cash box sits beside a stack of order tickets with the corners burnt from the grill heat."
              )
            }
            style={{
              background: 'linear-gradient(45deg, #FFB900, #FF8C00)',
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
            style={{
              background: 'linear-gradient(45deg, #DC143C, #B22222)',
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
            style={{
              background: 'linear-gradient(45deg, #2E8B57, #228B22)',
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
            style={{
              background: 'linear-gradient(45deg, #4169E1, #1E90FF)',
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
            🎶 Picnic Area
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnackShackMain;
