import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import MaidDialogue from "components/MaidDialogue";
import { WINDOW_IDS } from "fixed";
import { useTimeBasedImage } from "utils/timeBasedImages";
import RetroTextBox from "components/RetroTextBox";
import { useState, useEffect, useRef } from "react";
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

const ParadiseMotelMain = () => {
  const { openWindow, closeWindow } = useWindowsContext();
  const { primaryWallet } = useDynamicContext();
  
  // Use day/night images for Paradise Motel
  const dayImage = "/images/locations/paradise motel/paradise-motel-day.png";
  const nightImage = "/images/locations/paradise motel/paradise-motel-night.png";
  const timeBasedInfo = useTimeBasedImage(dayImage, nightImage);

  // Background music state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [room7SlackerCompleted, setRoom7SlackerCompleted] = useState(false);

  // Initialize background music when component mounts
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/music/paradisemotel.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3; // Set to 30% volume
    }

    const playMusic = async () => {
      try {
        if (audioRef.current && !isMuted) {
          await audioRef.current.play();
        }
      } catch (error) {
        console.log('Music autoplay blocked by browser');
      }
    };

    playMusic();

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Handle mute/unmute
  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.log);
      }
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

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

  const getCurrentBackground = () => {
    return timeBasedInfo.currentImage;
  };

  // Function to open Room 6 - always accessible
  const openRoom6 = () => {
    openWindow({
      key: WINDOW_IDS.PARADISE_MOTEL_ROOM_6,
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.PARADISE_MOTEL_ROOM_6}
          headerTitle="Paradise Motel - Room 6"
          onClose={() => closeWindow(WINDOW_IDS.PARADISE_MOTEL_ROOM_6)}
          initialWidth="80vw"
          initialHeight="80vh"
          resizable={true}
        >
          <div className="relative w-full h-full">
            <img
              src="/images/locations/paradise motel/room-6.png"
              alt="Paradise Motel Room 6"
              className="absolute inset-0 w-full h-full object-contain bg-black"
              onError={(e) => {
                e.currentTarget.src = "/images/backdrops/BLANK.png";
              }}
            />
          </div>
        </DraggableResizeableWindow>
      ),
    });
  };

  // Function to open Room 7 based on time of day
  const openRoom7 = async () => {
    // Use user's LOCAL timezone for day/night detection
    const now = new Date();
    const hour = now.getHours(); // Gets hour in user's local timezone (0-23)
    
    // Day time is 6 AM (06:00) to 6 PM (18:00) in user's LOCAL timezone
    const isDay = hour >= 6 && hour < 18;
    const isNightTime = !isDay;
    
    if (isDay) {
      // During day: show room-7-day.png with peephole button
      openWindow({
        key: WINDOW_IDS.PARADISE_MOTEL_ROOM_7,
        window: (
          <DraggableResizeableWindow
            windowsId={WINDOW_IDS.PARADISE_MOTEL_ROOM_7}
            headerTitle="Paradise Motel - Room 7"
            onClose={() => closeWindow(WINDOW_IDS.PARADISE_MOTEL_ROOM_7)}
            initialWidth="80vw"
            initialHeight="80vh"
            resizable={true}
          >
            <div className="relative w-full h-full flex flex-col">
              {/* Room 7 Day Image */}
              <div className="relative flex-1">
                <img
                  src="/images/locations/paradise motel/room-7-day.png"
                  alt="Paradise Motel Room 7 (Day)"
                  className="absolute inset-0 w-full h-full object-contain bg-black"
                  onError={(e) => {
                    e.currentTarget.src = "/images/backdrops/BLANK.png";
                  }}
                />
              </div>
              
              {/* Peephole Button at Bottom */}
              <div className="bg-gradient-to-r from-purple-900 to-pink-800 p-4 border-t-4 border-purple-400">
                <div className="max-w-md mx-auto">
                  <button
                    onClick={() => {
                      // Close Room 7 Day and open Peephole view
                      closeWindow(WINDOW_IDS.PARADISE_MOTEL_ROOM_7);
                      openWindow({
                        key: "paradise-motel-room-7-peephole",
                        window: (
                          <DraggableResizeableWindow
                            windowsId="paradise-motel-room-7-peephole"
                            headerTitle="Paradise Motel - Room 7 (Peephole)"
                            onClose={() => closeWindow("paradise-motel-room-7-peephole")}
                            initialWidth="80vw"
                            initialHeight="80vh"
                            resizable={true}
                          >
                            <div className="relative w-full h-full">
                              <img
                                src="/images/locations/paradise motel/room-7-peep.png"
                                alt="Paradise Motel Room 7 Peephole View"
                                className="absolute inset-0 w-full h-full object-contain bg-black"
                                onError={(e) => {
                                  e.currentTarget.src = "/images/backdrops/BLANK.png";
                                }}
                              />
                            </div>
                          </DraggableResizeableWindow>
                        ),
                      });
                    }}
                    className="w-full bg-gradient-to-br from-amber-600 to-orange-800 hover:from-amber-500 hover:to-orange-700 text-white px-6 py-4 rounded-lg border-3 border-amber-400 hover:border-amber-300 transition-all duration-300 hover:scale-105 text-center text-lg font-black shadow-lg"
                    style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
                  >
                    �️ Peephole
                  </button>
                </div>
              </div>
            </div>
          </DraggableResizeableWindow>
        ),
      });
    } else {
      // NIGHT TIME: Check if user has the key from the maid first
      if (!primaryWallet?.address) {
        openRoom(
          "no-wallet",
          "Access Denied",
          "You need to connect your wallet first."
        );
        return;
      }

      // Check if user has obtained the Room 7 key
      try {
        const response = await fetch(`/api/check-room7-key?walletAddress=${primaryWallet.address}`);
        const data = await response.json();
        
        if (!data.success || !data.hasKey) {
          // User doesn't have the key - show locked message
          openRoom(
            "room-7-locked",
            "Room 7 - Locked",
            "The door is locked. Maybe someone around back during the day could help you get in..."
          );
          return;
        }

        console.log('✅ User has Room 7 key, granting access');
        
      } catch (error) {
        console.error('❌ Failed to check Room 7 key:', error);
        openRoom(
          "room-7-error",
          "Error",
          "Something went wrong checking your access. Please try again."
        );
        return;
      }

      // User has the key! Award GUM for completing the objective
      if (!room7SlackerCompleted) {
        try {
          const response = await fetch('/api/paradise-motel-room7', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              walletAddress: primaryWallet.address,
              username: 'Anonymous'
            })
          });
          
          const data = await response.json();
          
          if (data.success) {
            setRoom7SlackerCompleted(true);
            console.log('✅ Room 7 Slacker objective completed! +' + (data.gumAwarded || 50) + ' GUM');
            window.dispatchEvent(new CustomEvent('gum-balance-updated'));
          } else if (data.alreadyCompleted) {
            console.log('ℹ️ Room 7 already visited');
            setRoom7SlackerCompleted(true);
          }
        } catch (error) {
          console.error('❌ Failed to award Room 7 Slacker GUM:', error);
        }
      }
      
      openWindow({
        key: WINDOW_IDS.PARADISE_MOTEL_ROOM_7,
        window: (
          <DraggableResizeableWindow
            windowsId={WINDOW_IDS.PARADISE_MOTEL_ROOM_7}
            headerTitle="Paradise Motel - Room 7 🌙"
            onClose={() => closeWindow(WINDOW_IDS.PARADISE_MOTEL_ROOM_7)}
            initialWidth="80vw"
            initialHeight="80vh"
            resizable={true}
          >
            <div className="relative w-full h-full">
              <img
                src="/images/locations/paradise motel/room-7.png"
                alt="Paradise Motel Room 7 (Night)"
                className="absolute inset-0 w-full h-full object-contain bg-black"
                onError={(e) => {
                  e.currentTarget.src = "/images/backdrops/BLANK.png";
                }}
              />
              {/* Success message overlay */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl font-bold animate-bounce">
                🎉 +50 GUM! Slacker Objective Complete!
              </div>
            </div>
          </DraggableResizeableWindow>
        ),
      });
    }
  };

  // Function to ring the bell
  const ringBell = () => {
    openRoom(
      "paradise-motel-ring-bell",
      "Front Desk Bell",
      "*DING DING* ... Nobody answers. The bell echoes through the empty lobby."
    );
  };

  // Function to open Lobby with 4 new buttons
  const openLobby = () => {
    openWindow({
      key: WINDOW_IDS.PARADISE_MOTEL_LOBBY,
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.PARADISE_MOTEL_LOBBY}
          headerTitle="Paradise Motel - Lobby"
          onClose={() => closeWindow(WINDOW_IDS.PARADISE_MOTEL_LOBBY)}
          initialWidth="900px"
          initialHeight="75vh"
          resizable={true}
        >
          <div className="relative w-full h-full flex flex-col overflow-hidden">
            {/* Fullscreen Lobby Image */}
            <div className="relative flex-1 flex items-center justify-center min-h-0">
              <img
                src="/images/locations/paradise motel/lobby.png"
                alt="Paradise Motel Lobby"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/images/backdrops/BLANK.png";
                }}
              />
            </div>
            
            {/* 4 Buttons Below Image - Compact */}
            <div className="w-full bg-gradient-to-r from-purple-900 to-pink-800 p-4 border-t-4 border-purple-400 shadow-2xl flex-shrink-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
                {/* Room 1 */}
                <button
                  onClick={() =>
                    openRoom(
                      WINDOW_IDS.PARADISE_MOTEL_ROOM_1,
                      "Room 1",
                      "The bed is unmade and there's a strange stain on the carpet. The TV shows only static, but sometimes you see shapes moving in it."
                    )
                  }
                  className="bg-gradient-to-br from-pink-700 to-purple-900 hover:from-pink-600 hover:to-purple-800 text-white px-3 py-3 rounded-lg border-3 border-pink-500 hover:border-pink-400 transition-all duration-300 hover:scale-105 text-center text-sm font-black shadow-lg whitespace-nowrap"
                  style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
                >
                  🛏️ Room 1
                </button>

                {/* Room 6 - Always Accessible */}
                <button
                  onClick={openRoom6}
                  className="bg-gradient-to-br from-blue-700 to-indigo-900 hover:from-blue-600 hover:to-indigo-800 text-white px-3 py-3 rounded-lg border-3 border-blue-500 hover:border-blue-400 transition-all duration-300 hover:scale-105 text-center text-sm font-black shadow-lg whitespace-nowrap"
                  style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
                >
                  🚪 Room 6
                </button>

                {/* Room 7 - Day/Night Behavior */}
                <button
                  onClick={openRoom7}
                  className="bg-gradient-to-br from-purple-800 to-pink-900 hover:from-purple-700 hover:to-pink-800 text-white px-3 py-3 rounded-lg border-3 border-purple-500 hover:border-purple-400 transition-all duration-300 hover:scale-105 text-center text-sm font-black shadow-lg whitespace-nowrap"
                  style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
                >
                  {timeBasedInfo.isDay ? '🌞' : '🌙'} Room 7
                </button>

                {/* Ring Bell */}
                <button
                  onClick={ringBell}
                  className="bg-gradient-to-br from-amber-700 to-red-900 hover:from-amber-600 hover:to-red-800 text-white px-3 py-3 rounded-lg border-3 border-amber-500 hover:border-amber-400 transition-all duration-300 hover:scale-105 text-center text-sm font-black shadow-lg whitespace-nowrap"
                  style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
                >
                  🔔 Ring Bell
                </button>
              </div>
            </div>
          </div>
        </DraggableResizeableWindow>
      ),
    });
  };

  // Function to open 'Round Back with PNG display
  const openRoundBack = () => {
    // Check time of day - 6 AM to 6 PM is day
    const now = new Date();
    const hour = now.getHours();
    const isDay = hour >= 6 && hour < 18;
    
    if (!isDay) {
      // NIGHT: Show empty round back with trash and cigarettes (no maid)
      openWindow({
        key: "paradise-motel-round-back",
        window: (
          <DraggableResizeableWindow
            windowsId="paradise-motel-round-back"
            headerTitle="Paradise Motel - 'Round Back 🌙"
            onClose={() => closeWindow("paradise-motel-round-back")}
            initialWidth="80vw"
            initialHeight="80vh"
            resizable={true}
          >
            <div className="relative w-full h-full overflow-hidden">
              <img
                src="/images/backgrounds/locations/paradise-motel/round-back-night.png"
                alt="Paradise Motel 'Round Back at Night"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to day image if night image doesn't exist yet
                  e.currentTarget.src = "/images/backgrounds/locations/paradise-motel/round-back.png";
                }}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-4 border-gray-600 rounded p-6 max-w-md text-center">
                  <p className="text-white text-lg font-semibold mb-2">Nobody's here...</p>
                  <p className="text-gray-300 text-sm">
                    Just trash, cigarette butts, and the distant sound of cars passing by. 
                    The maid must work during the day.
                  </p>
                </div>
              </div>
            </div>
          </DraggableResizeableWindow>
        ),
      });
    } else {
      // DAY: Show maid dialogue
      openWindow({
        key: "paradise-motel-round-back",
        window: (
          <DraggableResizeableWindow
            windowsId="paradise-motel-round-back"
            headerTitle="Paradise Motel - 'Round Back"
            onClose={() => closeWindow("paradise-motel-round-back")}
            initialWidth="80vw"
            initialHeight="80vh"
            resizable={true}
          >
            <div className="relative w-full h-full overflow-hidden">
              <img
                src="/images/backgrounds/locations/paradise-motel/round-back.png"
                alt="Paradise Motel 'Round Back"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/images/backdrops/BLANK.png";
                }}
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 flex items-center justify-center p-4 md:p-10">
                <MaidDialogue onClose={() => closeWindow("paradise-motel-round-back")} />
              </div>
            </div>
          </DraggableResizeableWindow>
        ),
      });
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Image Container - Expanded to fill more width */}
      <div className="relative flex-1 flex items-center justify-center min-h-0 px-0">
        <img
          src={getCurrentBackground()}
          alt={`Paradise Motel Background - ${timeBasedInfo.isDay ? 'Day' : 'Night'}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/images/backdrops/BLANK.png";
          }}
        />
      </div>

      {/* Bottom Buttons - Compact with blue/orange gradient */}
      <div className="w-full bg-gradient-to-r from-cyan-600 via-blue-700 to-orange-600 p-4 border-t-4 border-orange-400 shadow-2xl flex-shrink-0">
        <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
          {/* Lobby */}
          <button
            onClick={openLobby}
            className="bg-gradient-to-br from-orange-500 to-orange-700 hover:from-orange-400 hover:to-orange-600 text-white px-6 py-3 rounded-xl border-4 border-orange-300 hover:border-orange-200 transition-all duration-300 hover:scale-105 text-center text-base font-black shadow-lg hover:shadow-xl whitespace-nowrap"
            style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
          >
            🏨 Lobby
          </button>

          {/* 'Round Back */}
          <button
            onClick={openRoundBack}
            className="bg-gradient-to-br from-cyan-600 to-blue-800 hover:from-cyan-500 hover:to-blue-700 text-white px-6 py-3 rounded-xl border-4 border-cyan-400 hover:border-cyan-300 transition-all duration-300 hover:scale-105 text-center text-base font-black shadow-lg hover:shadow-xl whitespace-nowrap"
            style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
          >
            🌙 'Round Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParadiseMotelMain;
