import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";
import RetroTextBox from "components/RetroTextBox";

const PoliceStationMain = () => {
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
        alt="Police Station Background"
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
          {/* Front Desk */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.POLICE_STATION_FRONT_DESK,
                "Front Desk",
                "A tired officer sits behind bulletproof glass. Incident reports and wanted posters cover the bulletin board."
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
            👮 Front Desk
          </button>

          {/* Holding Cells */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.POLICE_STATION_CELLS,
                "Holding Cells",
                "Cold metal bars and concrete walls. Someone's carved initials into the bench."
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
            🔒 Cells
          </button>

          {/* Evidence Room */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.POLICE_STATION_EVIDENCE_ROOM,
                "Evidence Room",
                "Shelves of bagged evidence and case files. A mysterious box marked 'CONFIDENTIAL' sits on the top shelf."
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
            📦 Evidence Room
          </button>

          {/* Interrogation Room */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.POLICE_STATION_INTERROGATION_ROOM,
                "Interrogation Room",
                "One swinging bulb, a scarred metal table, and a mirrored wall that hums with hidden tape recorders. Someone left a cold cup of coffee that never seems to cool."
              )
            }
            style={{
              background: 'linear-gradient(45deg, #1E3A8A, #3B82F6)',
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
            🚨 Interrogation
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoliceStationMain;
