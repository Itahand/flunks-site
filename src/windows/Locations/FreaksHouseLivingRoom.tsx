import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";
import { useWindowsContext } from "contexts/WindowsContext";
import { useState } from "react";

const FreaksHouseLivingRoom = () => {
  const { closeWindow } = useWindowsContext();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    `Let the static tell the story—the TV raised him when Mom couldn't be home. Late-night cartoons, controller cords tangled on the floor, and a stack of games that taught him more about perseverance than any report card ever would.`,
    `Clean clothes hang in the doorway like ghosts waiting for their shift to start. Her Paradise Motel shirt swings gently in the draft, a reminder that someone's always working so someone else can keep dreaming.`
  ];

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <DraggableResizeableWindow
      headerTitle="🎸 Living Room - Freak's House"
      windowsId={WINDOW_IDS.FREAKS_HOUSE_BASEMENT}
      initialWidth="1000px"
      initialHeight="700px"
      onClose={() => closeWindow(WINDOW_IDS.FREAKS_HOUSE_BASEMENT)}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/images/locations/freaks-living-room.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: window.innerWidth < 768 ? '12px' : '24px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            flex: '0 0 auto',
            width: window.innerWidth < 768 ? '95%' : '75%',
            minHeight: '140px',
            maxHeight: window.innerWidth < 768 ? 'none' : '200px',
            background: 'rgba(10, 10, 14, 0.55)',
            border: '3px solid rgba(120, 81, 169, 0.8)',
            color: '#fff',
            borderRadius: '12px 12px 0 0',
            boxShadow: '0 0 0 6px rgba(120, 81, 169, 0.25)',
            backdropFilter: 'blur(3px)',
            padding: window.innerWidth < 768 ? '10px 12px' : '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            margin: '0 auto',
            pointerEvents: 'auto',
            zIndex: 10,
          }}
        >
          <p
            style={{
              letterSpacing: '0.2px',
              lineHeight: '1.35',
              margin: '0',
              fontSize: window.innerWidth < 768 ? 'clamp(11px, 3vw, 14px)' : 'clamp(12px, 1.6vw, 15px)',
              whiteSpace: 'pre-wrap',
              flex: 1,
            }}
          >
            {pages[currentPage]}
          </p>

          <div style={{ 
            display: 'flex', 
            flexDirection: window.innerWidth < 768 ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              width: window.innerWidth < 768 ? '100%' : 'auto',
              justifyContent: window.innerWidth < 768 ? 'space-between' : 'flex-start'
            }}>
              {currentPage > 0 && (
                <button
                  onClick={prevPage}
                  style={{
                    padding: '5px 12px',
                    background: 'rgba(120, 81, 169, 0.9)',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    flex: window.innerWidth < 768 ? 1 : 'none',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(147, 112, 219, 1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(120, 81, 169, 0.9)';
                  }}
                >
                  ← Back
                </button>
              )}
              
              <div style={{ 
                fontSize: '11px', 
                color: 'rgba(255,255,255,0.6)',
                display: 'flex',
                alignItems: 'center',
                padding: window.innerWidth < 768 ? '0 8px' : '0'
              }}>
                {currentPage + 1} / {pages.length}
              </div>
            </div>

            {currentPage < pages.length - 1 ? (
              <button
                onClick={nextPage}
                style={{
                  padding: '5px 12px',
                  background: 'rgba(120, 81, 169, 0.9)',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                  width: window.innerWidth < 768 ? '100%' : 'auto',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(147, 112, 219, 1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(120, 81, 169, 0.9)';
                }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => closeWindow(WINDOW_IDS.FREAKS_HOUSE_BASEMENT)}
                style={{
                  padding: '5px 12px',
                  background: 'rgba(120, 81, 169, 0.9)',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                  width: window.innerWidth < 768 ? '100%' : 'auto',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(147, 112, 219, 1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(120, 81, 169, 0.9)';
                }}
              >
                Close ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </DraggableResizeableWindow>
  );
};

export default FreaksHouseLivingRoom;
