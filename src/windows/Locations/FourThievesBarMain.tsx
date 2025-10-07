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
          {/* Main Bar */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.FOUR_THIEVES_BAR_MAIN_BAR,
                "Main Bar",
                "Sticky mahogany stretches the length of the room. Four mismatched bar stools are permanently claimed by regulars who speak only in whispers when outsiders enter."
              )
            }
            style={{
              background: 'linear-gradient(45deg, #D4A574, #8B4513)',
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
            🥃 Main Bar
          </button>

          {/* Pool Room */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.FOUR_THIEVES_BAR_POOL_ROOM,
                "Pool Room",
                "The green felt is scarred with cigarette burns, and the cue rack is missing two sticks. Someone carved a warning into the table: 'Don't break unless you're ready to lose.'"
              )
            }
            style={{
              background: 'linear-gradient(45deg, #2E8B57, #006400)',
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
            style={{
              background: 'linear-gradient(45deg, #8B008B, #4B0082)',
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
            style={{
              background: 'linear-gradient(45deg, #708090, #2F4F4F)',
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
            🚪 Back Alley
          </button>
        </div>
      </div>
    </div>
  );
};

export default FourThievesBarMain;
