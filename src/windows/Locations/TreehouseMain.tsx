import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";

const TreehouseMain = () => {
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
          style={{
            backgroundColor: '#C0C0C0',
            color: '#000000'
          }}
        >
          <div className="p-4 w-full h-full" style={{
            backgroundColor: '#C0C0C0',
            fontFamily: "'MS Sans Serif', 'Arial', sans-serif",
            fontSize: '14px',
            fontWeight: 'normal',
            lineHeight: '1.5',
            color: '#000000',
            textShadow: '1px 1px 0px rgba(255, 255, 255, 0.3)',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflow: 'hidden'
          }}>
            {content}
          </div>
        </DraggableResizeableWindow>
      ),
    });
  };

  return (
    <div className="relative w-full h-full">
      <img
        src="/images/locations/treehouse/daybg.png"
        alt="Treehouse Background"
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
          {/* Loft */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.TREEHOUSE_LOFT,
                "Loft",
                "A creaky ladder leads to a dusty loft with old comic books."
              )
            }
            style={{
              background: 'linear-gradient(45deg, #1F2937, #374151)',
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
            🪜 Loft
          </button>

          {/* Work Desk */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.TREEHOUSE_DESK,
                "Work Desk",
                "The desk has a map with tacks, red yarn, and a walkie talkie."
              )
            }
            style={{
              background: 'linear-gradient(45deg, #1F2937, #374151)',
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
            📻 Work Desk
          </button>

          {/* Old Trunk */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.TREEHOUSE_TRUNK,
                "Old Trunk",
                "Inside is a flashlight, half a diary, and something locked..."
              )
            }
            style={{
              background: 'linear-gradient(45deg, #1F2937, #374151)',
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
            🧳 Trunk
          </button>

          {/* Secret Window */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.TREEHOUSE_WINDOW,
                "Secret Window",
                "You can peek out over the lake from here. Something glimmers."
              )
            }
            style={{
              background: 'linear-gradient(45deg, #1F2937, #374151)',
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
            🪟 Window View
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreehouseMain;
