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
          {/* Car Stacks */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.JUNKYARD_CAR_STACKS,
                "Car Stacks",
                "Rusted cars reach three stories high, strapped together with chains. Scraps of varsity jackets hang from one fender like someone climbed too fast."
              )
            }
            style={{
              background: 'linear-gradient(45deg, #92400E, #D97706)',
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
            style={{
              background: 'linear-gradient(45deg, #881337, #E11D48)',
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
            style={{
              background: 'linear-gradient(45deg, #164E63, #0891B2)',
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
            🕳️ Bunker
          </button>
        </div>
      </div>
    </div>
  );
};

export default JunkyardMain;
