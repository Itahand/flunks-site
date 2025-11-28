import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import RetroTextBox from "components/RetroTextBox";
import { WINDOW_IDS } from "fixed";
import { useTimeBasedImage } from "utils/timeBasedImages";
import { useState, useEffect, useRef } from "react";
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useUnifiedWallet } from 'contexts/UnifiedWalletContext';
import SlotMachine from "components/games/SlotMachine";
import VideoPoker from "components/games/VideoPoker";
import ScratchCard from "components/games/ScratchCard";

const FourThievesBarMain = () => {
  const { openWindow, closeWindow } = useWindowsContext();
  const { primaryWallet } = useDynamicContext();
  const { address: unifiedAddress } = useUnifiedWallet();
  const effectiveWallet = primaryWallet;
  const walletAddress = unifiedAddress || primaryWallet?.address;

  // Day/night images
  const dayImage = "/images/locations/four-thieves/four-thieves-day.png";
  const nightImage = "/images/locations/four-thieves/four-thieves-night.png";
  const timeBasedInfo = useTimeBasedImage(dayImage, nightImage);
  const isDay = timeBasedInfo.isDay;

  // GUM balance state (would be fetched from API in production)
  const [gumBalance, setGumBalance] = useState(500); // Starting balance for demo

  // Background music
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Initialize bar music
    audioRef.current = new Audio('/music/bar-ambience.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.2;

    const playMusic = async () => {
      try {
        if (audioRef.current && !isMuted) {
          await audioRef.current.play();
        }
      } catch (error) {
        console.log('Music autoplay blocked');
      }
    };

    playMusic();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.log);
      }
    }
  }, [isMuted]);

  const handleGumChange = (amount: number) => {
    setGumBalance(prev => Math.max(0, prev + amount));
    // TODO: In production, call API to update GUM balance
  };

  const getCurrentBackground = () => {
    return isDay ? dayImage : nightImage;
  };

  // Generic room opener for text-based rooms
  const openRoom = (roomKey: string, title: string, content: string) => {
    openWindow({
      key: roomKey,
      window: (
        <DraggableResizeableWindow
          windowsId={roomKey}
          headerTitle={title}
          onClose={() => closeWindow(roomKey)}
          initialWidth="450px"
          initialHeight="350px"
          resizable={false}
        >
          <div className="p-4 w-full h-full bg-gradient-to-br from-amber-950 via-red-950 to-amber-950">
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

  // Open Slot Machine
  const openSlotMachine = () => {
    openWindow({
      key: WINDOW_IDS.FOUR_THIEVES_BAR_SLOT_MACHINE,
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.FOUR_THIEVES_BAR_SLOT_MACHINE}
          headerTitle="🎰 Lucky Slots - 4 Thieves"
          onClose={() => closeWindow(WINDOW_IDS.FOUR_THIEVES_BAR_SLOT_MACHINE)}
          initialWidth="450px"
          initialHeight="650px"
          resizable={false}
        >
          <SlotMachine 
            walletAddress={walletAddress}
            gumBalance={gumBalance}
            onGumChange={handleGumChange}
            onClose={() => closeWindow(WINDOW_IDS.FOUR_THIEVES_BAR_SLOT_MACHINE)}
          />
        </DraggableResizeableWindow>
      ),
    });
  };

  // Open Video Poker
  const openVideoPoker = () => {
    openWindow({
      key: WINDOW_IDS.FOUR_THIEVES_BAR_VIDEO_POKER,
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.FOUR_THIEVES_BAR_VIDEO_POKER}
          headerTitle="🃏 Jacks or Better - 4 Thieves"
          onClose={() => closeWindow(WINDOW_IDS.FOUR_THIEVES_BAR_VIDEO_POKER)}
          initialWidth="540px"
          initialHeight="900px"
          resizable={true}
        >
          <VideoPoker 
            walletAddress={walletAddress}
            gumBalance={gumBalance}
            onGumChange={handleGumChange}
            onClose={() => closeWindow(WINDOW_IDS.FOUR_THIEVES_BAR_VIDEO_POKER)}
          />
        </DraggableResizeableWindow>
      ),
    });
  };

  // Open Scratch Cards
  const openScratchCards = () => {
    openWindow({
      key: WINDOW_IDS.FOUR_THIEVES_BAR_SCRATCH_CARDS,
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.FOUR_THIEVES_BAR_SCRATCH_CARDS}
          headerTitle="🎟️ Lucky Scratchers - 4 Thieves"
          onClose={() => closeWindow(WINDOW_IDS.FOUR_THIEVES_BAR_SCRATCH_CARDS)}
          initialWidth="380px"
          initialHeight="620px"
          resizable={false}
        >
          <ScratchCard 
            walletAddress={walletAddress}
            gumBalance={gumBalance}
            onGumChange={handleGumChange}
            onClose={() => closeWindow(WINDOW_IDS.FOUR_THIEVES_BAR_SCRATCH_CARDS)}
          />
        </DraggableResizeableWindow>
      ),
    });
  };

  // Open the main interior with slot machine and video poker
  const openInterior = () => {
    openWindow({
      key: WINDOW_IDS.FOUR_THIEVES_BAR_INTERIOR,
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.FOUR_THIEVES_BAR_INTERIOR}
          headerTitle="4 Thieves Bar & Grill - Inside"
          onClose={() => closeWindow(WINDOW_IDS.FOUR_THIEVES_BAR_INTERIOR)}
          initialWidth="900px"
          initialHeight="80vh"
          resizable={true}
        >
          <div className="relative w-full h-full flex flex-col overflow-hidden">
            {/* Interior Image */}
            <div className="relative flex-1 flex items-center justify-center min-h-0">
              <img
                src="/images/locations/four-thieves/four-thieves-interior.png"
                alt="4 Thieves Bar & Grill Interior"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/images/backdrops/BLANK.png";
                }}
              />
            </div>
            
            {/* Interior Buttons */}
            <div className="w-full bg-gradient-to-r from-amber-900 via-red-900 to-amber-900 p-4 border-t-4 border-yellow-600 shadow-2xl flex-shrink-0">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-5xl mx-auto">
                {/* Slot Machine */}
                <button
                  onClick={openSlotMachine}
                  className="bg-gradient-to-br from-purple-600 to-purple-900 hover:from-purple-500 hover:to-purple-800 text-white px-3 py-3 rounded-lg border-3 border-yellow-400 hover:border-yellow-300 transition-all duration-300 hover:scale-105 text-center text-sm font-black shadow-lg whitespace-nowrap animate-pulse"
                  style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
                >
                  🎰 Slots
                </button>

                {/* Video Poker */}
                <button
                  onClick={openVideoPoker}
                  className="bg-gradient-to-br from-green-700 to-green-900 hover:from-green-600 hover:to-green-800 text-white px-3 py-3 rounded-lg border-3 border-yellow-400 hover:border-yellow-300 transition-all duration-300 hover:scale-105 text-center text-sm font-black shadow-lg whitespace-nowrap"
                  style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
                >
                  🃏 Poker
                </button>

                {/* Scratch Cards */}
                <button
                  onClick={openScratchCards}
                  className="bg-gradient-to-br from-pink-600 to-pink-900 hover:from-pink-500 hover:to-pink-800 text-white px-3 py-3 rounded-lg border-3 border-yellow-400 hover:border-yellow-300 transition-all duration-300 hover:scale-105 text-center text-sm font-black shadow-lg whitespace-nowrap"
                  style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
                >
                  🎟️ Scratchers
                </button>

                {/* Bar Counter */}
                <button
                  onClick={() => openRoom(
                    WINDOW_IDS.FOUR_THIEVES_BAR_MAIN_BAR,
                    "The Bar",
                    "Sticky mahogany stretches the length of the room. The bartender, a grizzled old-timer with a missing pinky, polishes glasses that are already spotless. Four mismatched bar stools are permanently claimed by regulars who speak only in whispers when outsiders enter. The tap selection includes some drinks you've never heard of."
                  )}
                  className="bg-gradient-to-br from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-3 py-3 rounded-lg border-3 border-yellow-400 hover:border-yellow-300 transition-all duration-300 hover:scale-105 text-center text-sm font-black shadow-lg whitespace-nowrap"
                  style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
                >
                  🥃 The Bar
                </button>

                {/* Pool Room */}
                <button
                  onClick={() => openRoom(
                    WINDOW_IDS.FOUR_THIEVES_BAR_POOL_ROOM,
                    "Pool Room",
                    "The green felt is scarred with cigarette burns, and the cue rack is missing two sticks. Someone carved a warning into the table: 'Don't break unless you're ready to lose.' A group of bikers in the corner eye you suspiciously."
                  )}
                  className="bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white px-3 py-3 rounded-lg border-3 border-yellow-400 hover:border-yellow-300 transition-all duration-300 hover:scale-105 text-center text-sm font-black shadow-lg whitespace-nowrap"
                  style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
                >
                  🎱 Pool Room
                </button>
              </div>

              {/* GUM Balance Display */}
              <div className="mt-3 text-center">
                <span 
                  className="px-4 py-2 rounded-lg inline-block"
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: '#ffd700',
                    fontFamily: 'monospace',
                    border: '2px solid #ffd700',
                  }}
                >
                  💰 Your GUM: {gumBalance}
                </span>
              </div>
            </div>
          </div>
        </DraggableResizeableWindow>
      ),
    });
  };

  // Open the back room (kitchen/storage area)
  const openBackRoom = () => {
    openWindow({
      key: WINDOW_IDS.FOUR_THIEVES_BAR_BACK_ROOM,
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.FOUR_THIEVES_BAR_BACK_ROOM}
          headerTitle="4 Thieves - Back Room"
          onClose={() => closeWindow(WINDOW_IDS.FOUR_THIEVES_BAR_BACK_ROOM)}
          initialWidth="800px"
          initialHeight="70vh"
          resizable={true}
        >
          <div className="relative w-full h-full flex flex-col overflow-hidden">
            {/* Back Room Image */}
            <div className="relative flex-1 flex items-center justify-center min-h-0">
              <img
                src="/images/locations/four-thieves/four-thieves-back-room.png"
                alt="4 Thieves Back Room"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/images/backdrops/BLANK.png";
                }}
              />
            </div>
            
            {/* Back Room Buttons */}
            <div className="w-full bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 p-4 border-t-4 border-gray-600 shadow-2xl flex-shrink-0">
              <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                {/* Private Booths */}
                <button
                  onClick={() => openRoom(
                    WINDOW_IDS.FOUR_THIEVES_BAR_PRIVATE_BOOTH,
                    "Private Booths",
                    "Curved leather booths offer just enough privacy for bad deals. The flickering neon sign above them is wired to short out whenever the wrong name is spoken. You notice scratch marks on the table... and is that a hidden compartment?"
                  )}
                  className="bg-gradient-to-br from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white px-4 py-3 rounded-lg border-3 border-indigo-400 hover:border-indigo-300 transition-all duration-300 hover:scale-105 text-center text-sm font-black shadow-lg"
                  style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
                >
                  🕵️ Private Booths
                </button>

                {/* Back Alley */}
                <button
                  onClick={() => openRoom(
                    WINDOW_IDS.FOUR_THIEVES_BAR_BACK_ALLEY,
                    "Back Alley",
                    "A single buzzing light illuminates crates of contraband soda and a door marked KEEP OUT. The alley camera is always pointed just slightly the wrong way. You hear whispered conversations that stop the moment you appear."
                  )}
                  className="bg-gradient-to-br from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 text-white px-4 py-3 rounded-lg border-3 border-gray-400 hover:border-gray-300 transition-all duration-300 hover:scale-105 text-center text-sm font-black shadow-lg"
                  style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
                >
                  🚪 Back Alley
                </button>
              </div>
            </div>
          </div>
        </DraggableResizeableWindow>
      ),
    });
  };

  // Main component render - Exterior view
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Background Image */}
      <div className="relative flex-1 flex items-center justify-center min-h-0 px-0">
        <img
          src={getCurrentBackground()}
          alt={`4 Thieves Bar & Grill - ${isDay ? 'Day' : 'Night'}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/images/backdrops/BLANK.png";
          }}
        />
        
        {/* Neon Sign Glow Effect at Night */}
        {!isDay && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, rgba(255, 100, 50, 0.15) 0%, transparent 50%)',
            }}
          />
        )}
      </div>

      {/* Bottom Buttons - Bar style with warm colors */}
      <div className="w-full bg-gradient-to-r from-amber-800 via-red-900 to-amber-800 p-4 border-t-4 border-yellow-600 shadow-2xl flex-shrink-0">
        <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
          {/* Front Door */}
          <button
            onClick={openInterior}
            className="bg-gradient-to-br from-amber-600 to-orange-800 hover:from-amber-500 hover:to-orange-700 text-white px-6 py-3 rounded-xl border-4 border-yellow-400 hover:border-yellow-300 transition-all duration-300 hover:scale-105 text-center text-base font-black shadow-lg hover:shadow-xl whitespace-nowrap"
            style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
          >
            🚪 Front Door
          </button>

          {/* Back Door */}
          <button
            onClick={openBackRoom}
            className="bg-gradient-to-br from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white px-6 py-3 rounded-xl border-4 border-gray-500 hover:border-gray-400 transition-all duration-300 hover:scale-105 text-center text-base font-black shadow-lg hover:shadow-xl whitespace-nowrap"
            style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
          >
            🚪 Back Door
          </button>
        </div>
        
        {/* Location Title */}
        <div className="text-center mt-3">
          <span 
            className="text-yellow-300 text-lg font-black"
            style={{ 
              fontFamily: 'Cooper Black, Georgia, serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255, 200, 50, 0.3)',
            }}
          >
            🍺 4 THIEVES BAR & GRILL 🍺
          </span>
        </div>
      </div>

      {/* Music Toggle */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-4 right-4 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
        style={{ zIndex: 20 }}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );
};

export default FourThievesBarMain;
