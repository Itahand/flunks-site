import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";
import RetroTextBox from "components/RetroTextBox";

const FlunkFmMain = () => {
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
        alt="Flunk FM Background"
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
          {/* Studio */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.FLUNK_FM_STUDIO,
                "Recording Studio",
                "Soundproof walls and professional recording equipment. The ON AIR light glows red."
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
            🎙️ Studio
          </button>

          {/* DJ Booth */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.FLUNK_FM_BOOTH,
                "DJ Booth",
                "Turntables and mixing boards. Stacks of vinyl records and a wall of CDs."
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
            🎧 DJ Booth
          </button>

          {/* Office */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.FLUNK_FM_OFFICE,
                "Station Office",
                "Cluttered desk with programming schedules and sponsor contracts. Coffee-stained papers everywhere."
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
            📻 Office
          </button>

          {/* Transmission Tower */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.FLUNK_FM_TRANSMITTER,
                "Transmission Tower",
                "Up a narrow metal ladder sits the old broadcast switch. Red warning lights blink over a log book tracking mysteriously timed outages."
              )
            }
            style={{
              background: 'linear-gradient(45deg, #4F46E5, #6366F1)',
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
            📡 Tower
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlunkFmMain;
