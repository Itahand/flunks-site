import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";
import { useTimeBasedImage } from "utils/timeBasedImages";
import { getCliqueColors, getCliqueIcon } from "utils/cliqueColors";
import { getFontStyle } from "utils/fontConfig";
import { useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { awardGum } from "utils/gumAPI";

const JocksHouseMain = () => {
  const { openWindow, closeWindow } = useWindowsContext();
  const { primaryWallet } = useDynamicContext();
  const [gumClaimed, setGumClaimed] = useState(false);
  
  // Use your uploaded day/night images for Jocks House
  const dayImage = "/images/icons/jocks-house-day.png";
  const nightImage = "/images/icons/jocks-house-night.png";
  const timeBasedInfo = useTimeBasedImage(dayImage, nightImage);

  const openRoom = (roomKey: string, title: string, content: string) => {
    const cliqueColors = getCliqueColors('JOCK');
    const fontStyle = getFontStyle('JOCK');
    
    openWindow({
      key: roomKey,
      window: (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(450px, 90vw)',
            maxHeight: '70vh',
            backgroundColor: cliqueColors.primary,
            border: '3px solid #FFFFFF',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Title */}
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.2)',
            padding: '12px 16px',
            borderBottom: '2px solid rgba(255,255,255,0.3)',
            ...fontStyle,
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            textAlign: 'center'
          }}>
            {getCliqueIcon('JOCK')} {title}
          </div>
          
          {/* Content */}
          <div style={{
            padding: '20px',
            flex: 1,
            backgroundColor: cliqueColors.primary,
            ...fontStyle,
            fontSize: '18px',
            lineHeight: '1.6',
            color: '#FFFFFF',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflow: 'auto'
          }}>
            {content}
          </div>
          
          {/* Close Button */}
          <div style={{
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderTop: '1px solid rgba(255,255,255,0.2)'
          }}>
            <button
              onClick={() => closeWindow(roomKey)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.5)',
                borderRadius: '4px',
                color: '#FFFFFF',
                padding: '6px 12px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                ...fontStyle,
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Close
            </button>
          </div>
        </div>
      ),
    });
  };

  const openBedroom = () => {
    openWindow({
      key: WINDOW_IDS.JOCKS_HOUSE_BEDROOM,
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.JOCKS_HOUSE_BEDROOM}
          headerTitle="Jock's Bedroom"
          onClose={() => closeWindow(WINDOW_IDS.JOCKS_HOUSE_BEDROOM)}
          initialWidth="70vw"
          initialHeight="70vh"
          resizable={true}
        >
          <div className="relative w-full h-full bg-[#1a1a1a] text-white overflow-hidden">
            {/* Bedroom Background Image */}
            <img
              src="/images/locations/jocks-bedroom.png"
              alt="Jock's Bedroom Interior"
              className="absolute inset-0 w-full h-full object-cover z-0"
              onError={(e) => {
                e.currentTarget.src = "/images/backdrops/BLANK.png";
              }}
            />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 z-10 bg-black bg-opacity-40 p-6 flex flex-col justify-end">
              {/* Bottom Section - Description and Interactive Buttons */}
              <div className="bg-black bg-opacity-80 p-3 sm:p-4 rounded">
                <h1 className="text-xl sm:text-2xl mb-2 sm:mb-3 font-bold">🛏️ Jock's Bedroom</h1>
                <p className="text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3">
                  The personal sanctuary of a champion athlete. Every corner of this room speaks to dedication, 
                  discipline, and the relentless pursuit of excellence. The walls are covered with team photos, 
                  motivational quotes, and reminders that there are zero excuses for failure. The air still 
                  carries the faint scent of athletic tape and determination.
                </p>
                <p className="text-xs text-gray-300 mb-3 sm:mb-4">
                  Explore different areas of the bedroom to uncover the secrets of athletic success.
                </p>
                
                {/* Interactive Buttons - Now at bottom with mobile optimization */}
                <div className="max-w-lg mx-auto px-2 sm:px-0">
                  {/* First row - 4 buttons with responsive grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <button
                      onClick={() => 
                        openRoom(
                          WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_closet',
                          "Walk-in Closet",
                          "Letterman jackets from multiple sports hang in perfect order. Championship rings sit in a display case. Team captain armbands are neatly organized on shelves."
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base min-h-[44px] sm:min-h-auto"
                    >
                      👕 Closet
                    </button>
                    
                    <button
                      onClick={() => 
                        openStudyDesk()
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base min-h-[44px] sm:min-h-auto"
                    >
                      📚 Desk
                    </button>
                    
                    <button
                      onClick={() => 
                        openUnderBed()
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base min-h-[44px] sm:min-h-auto"
                    >
                      🛏️ Under the Bed
                    </button>
                    
                    <button
                      onClick={() => 
                        openRoom(
                          WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_trophy',
                          "Trophy Corner",
                          "A gleaming display of athletic achievements. MVP awards, state championship trophies, and team photos from winning seasons. Each piece represents countless hours of dedication and zero excuses."
                        )
                      }
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base min-h-[44px] sm:min-h-auto"
                    >
                      🏆 Trophies
                    </button>
                  </div>
                  
                  {/* Second row - Disabled computer button with mobile optimization */}
                  <div className="flex justify-center">
                    <button
                      disabled
                      className="bg-gray-600 text-gray-400 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold cursor-not-allowed opacity-50 shadow-lg w-full sm:w-64 text-sm sm:text-base min-h-[44px] sm:min-h-auto"
                      title="Coming soon..."
                    >
                      💻 Computer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DraggableResizeableWindow>
      ),
    });
  };
                </div>
                </p>
              </div>
            </div>
          </div>
        </DraggableResizeableWindow>
      ),
    });
  };

  const openUnderBed = () => {
    openWindow({
      key: WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_under_bed_lock',
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_under_bed_lock'}
          headerTitle="Under the Bed - Digital Lock"
          onClose={() => closeWindow(WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_under_bed_lock')}
          initialWidth="400px"
          initialHeight="300px"
          resizable={false}
        >
          <div className="p-6 w-full h-full bg-gray-900 text-white flex flex-col justify-center items-center">
            <div className="text-center mb-6">
              <h2 className="text-xl mb-2">🔒 Digital Lock</h2>
              <p className="text-sm text-gray-300 mb-4">
                A mysterious lockbox is hidden under the bed. Enter the 4-digit code to unlock its secrets.
              </p>
            </div>
            
            <div className="bg-black bg-opacity-50 p-4 rounded-lg border border-gray-600">
              <div className="flex justify-center space-x-2 mb-4">
                <input
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-2xl font-bold bg-gray-800 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.value && target.nextElementSibling) {
                      (target.nextElementSibling as HTMLInputElement).focus();
                    }
                  }}
                />
                <input
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-2xl font-bold bg-gray-800 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.value && target.nextElementSibling) {
                      (target.nextElementSibling as HTMLInputElement).focus();
                    }
                  }}
                />
                <input
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-2xl font-bold bg-gray-800 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.value && target.nextElementSibling) {
                      (target.nextElementSibling as HTMLInputElement).focus();
                    }
                  }}
                />
                <input
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-2xl font-bold bg-gray-800 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => {
                    // Get all input values
                    const inputs = document.querySelectorAll(`[data-window-id="${WINDOW_IDS.JOCKS_HOUSE_BEDROOM}_under_bed_lock"] input`);
                    const code = Array.from(inputs).map((input: any) => input.value).join('');
                    
                    if (code.length !== 4) {
                      alert('Please enter a 4-digit code');
                      return;
                    }
                    
                    // Check if the code is correct
                    if (code === '0730') {
                      // Close the lock window first
                      closeWindow(WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_under_bed_lock');
                      
                      // Open the unlocked box contents
                      openWindow({
                        key: WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_unlocked_box',
                        window: (
                          <DraggableResizeableWindow
                            windowsId={WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_unlocked_box'}
                            headerTitle="Under the Bed - Unlocked Box"
                            onClose={() => closeWindow(WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_unlocked_box')}
                            initialWidth="400px"
                            initialHeight="350px"
                            resizable={false}
                          >
                            <div className="p-6 w-full h-full bg-gray-900 text-white flex flex-col justify-center items-center">
                              <div className="text-center mb-6">
                                <h2 className="text-xl mb-2">📦 Unlocked Box Contents</h2>
                                <p className="text-sm text-gray-300 mb-4">
                                  The digital lock has opened! Inside you discover...
                                </p>
                              </div>
                              
                              {/* Gum Claim Section */}
                              <div className="bg-green-900 bg-opacity-50 p-4 rounded-lg border border-green-600 mb-4">
                                <div className="text-center mb-3">
                                  <h3 className="text-lg font-bold text-green-300">🍬 Hidden Gum Stash!</h3>
                                  <p className="text-sm text-gray-300">A secret emergency gum supply!</p>
                                </div>
                                <button
                                  onClick={async () => {
                                    if (!primaryWallet?.address) {
                                      alert('🔗 Please connect your wallet first to claim GUM!');
                                      return;
                                    }
                                    
                                    if (gumClaimed) {
                                      alert('🍬 You have already claimed your hidden GUM stash from this location!');
                                      return;
                                    }
                                    
                                    try {
                                      const result = await awardGum(
                                        primaryWallet.address,
                                        'jocks_bedroom_hidden_stash',
                                        { 
                                          location: 'jocks_house_bedroom_under_bed',
                                          amount: 100,
                                          reason: 'Found hidden GUM stash under the bed'
                                        }
                                      );
                                      
                                      if (result.success) {
                                        alert(`🍬 SUCCESS! You found ${result.earned} GUM hidden under the bed!\n\n💰 This was a one-time discovery bonus. The stash is now empty.`);
                                        setGumClaimed(true);
                                        
                                        // Dispatch event to update other UI components
                                        window.dispatchEvent(new CustomEvent('gumBalanceUpdated', {
                                          detail: { 
                                            earned: result.earned,
                                            walletAddress: primaryWallet.address,
                                            source: 'jocks_bedroom_hidden_stash'
                                          }
                                        }));
                                      } else {
                                        if (result.error?.includes('cooldown') || result.error?.includes('already claimed')) {
                                          alert('🕐 You have already claimed this hidden GUM stash! One-time discoveries can only be claimed once per wallet.');
                                          setGumClaimed(true);
                                        } else {
                                          alert(`❌ ${result.error || 'Failed to claim GUM. Please try again.'}`);
                                        }
                                      }
                                    } catch (error) {
                                      console.error('Error claiming hidden GUM:', error);
                                      alert('❌ Something went wrong. Please try again.');
                                    }
                                  }}
                                  disabled={gumClaimed}
                                  className={`w-full px-4 py-3 rounded font-bold transition-all duration-200 hover:scale-105 ${
                                    gumClaimed 
                                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50' 
                                      : 'bg-green-600 hover:bg-green-700 text-white'
                                  }`}
                                >
                                  {gumClaimed ? '🍬 Already Claimed' : '🍬 Claim 100 GUM (One-time only)'}
                                </button>
                              </div>
                              
                              {/* Smaller Locked Box Section */}
                              <div className="bg-yellow-900 bg-opacity-50 p-4 rounded-lg border border-yellow-600 w-full">
                                <div className="text-center">
                                  <h3 className="text-lg font-bold text-yellow-300 mb-2">🗝️ Mysterious Small Box</h3>
                                  <p className="text-sm text-gray-300 mb-3">
                                    You also find a smaller metal box with an old-fashioned key lock. 
                                    It rattles when shaken - something important is definitely inside.
                                  </p>
                                  <div className="bg-black bg-opacity-40 p-3 rounded border border-gray-600">
                                    <div className="text-2xl mb-2">🔒</div>
                                    <p className="text-xs text-gray-400">
                                      This box requires a physical key to open.
                                      <br />
                                      The key must be hidden somewhere else...
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DraggableResizeableWindow>
                        ),
                      });
                    } else {
                      alert(`❌ INCORRECT CODE: ${code}\n\n🔒 The lock remains sealed. The digital display flashes red briefly before returning to its waiting state. Try again...`);
                      // Clear inputs for retry
                      inputs.forEach((input: any) => input.value = '');
                      (inputs[0] as HTMLInputElement)?.focus();
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold transition-all duration-200"
                >
                  🔓 Unlock
                </button>
                
                <button
                  onClick={() => {
                    // Clear all inputs
                    const inputs = document.querySelectorAll(`[data-window-id="${WINDOW_IDS.JOCKS_HOUSE_BEDROOM}_under_bed_lock"] input`);
                    inputs.forEach((input: any) => input.value = '');
                    (inputs[0] as HTMLInputElement)?.focus();
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-bold transition-all duration-200"
                >
                  🔄 Clear
                </button>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 mt-4 text-center">
              Hint: Look around the room for clues...
            </p>
          </div>
        </DraggableResizeableWindow>
      ),
    });
  };

  const openStudyDesk = () => {
    openWindow({
      key: WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_study_desk',
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_study_desk'}
          headerTitle="Jock's Study Desk"
          onClose={() => closeWindow(WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_study_desk')}
          initialWidth="70vw"
          initialHeight="70vh"
          resizable={true}
        >
          <div className="relative w-full h-full bg-[#1a1a1a] text-white overflow-hidden">
            {/* Study Desk Background Image */}
            <img
              src="/images/locations/jocks-study-desk.png"
              alt="Jock's Study Desk"
              className="absolute inset-0 w-full h-full object-cover z-0"
              onError={(e) => {
                e.currentTarget.src = "/images/backdrops/BLANK.png";
              }}
            />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 z-10 bg-black bg-opacity-40 p-6 flex flex-col justify-between">
              {/* Top Section - Interactive Elements */}
              <div className="flex-1 flex items-center justify-center">
                <div className="bg-black bg-opacity-80 p-6 rounded-lg max-w-2xl">
                  <h1 className="text-2xl mb-4 font-bold text-center">📚 Championship Study Desk</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-blue-300 mb-2">📋 Playbooks & Strategy</h3>
                      <p className="text-sm text-gray-300">
                        Multiple playbooks are spread across the desk surface. Red ink marks key plays, 
                        and sticky notes highlight winning strategies. The pages show wear from constant study.
                      </p>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-green-300 mb-2">💻 Game Analysis</h3>
                      <p className="text-sm text-gray-300">
                        A laptop displays paused game footage. Multiple browser tabs show opponent statistics, 
                        player performance metrics, and upcoming game schedules.
                      </p>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-yellow-300 mb-2">🏆 Scholarship Letter</h3>
                      <p className="text-sm text-gray-300">
                        Pinned prominently to the corkboard above - a full-ride scholarship offer from State University. 
                        The letter is creased from being read multiple times.
                      </p>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-purple-300 mb-2">💊 Training Supplements</h3>
                      <p className="text-sm text-gray-300">
                        Protein powder containers and vitamin bottles line the back edge. A training schedule 
                        shows 5:30 AM workouts and strict meal timing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Motivational Quote */}
              <div className="bg-black bg-opacity-80 p-4 rounded">
                <p className="text-center text-lg font-bold text-yellow-300 mb-2">
                  "Champions are made when nobody's watching"
                </p>
                <p className="text-center text-sm text-gray-300">
                  A handwritten note taped to the desk lamp reminds that success comes from dedication, 
                  preparation, and zero excuses - even in the quiet hours of studying game film and strategy.
                </p>
              </div>
            </div>
          </div>
        </DraggableResizeableWindow>
      ),
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Image Section */}
      <div className="relative flex-1">
        <img
          src={timeBasedInfo.currentImage}
          alt={`Jock's House Background - ${timeBasedInfo.isDay ? 'Day' : 'Night'}`}
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500"
          onError={(e) => {
            e.currentTarget.src = "/images/backdrops/BLANK.png";
          }}
        />

        {/* Day/Night Atmospheric Overlay */}
        <div 
          className={`absolute inset-0 z-1 transition-all duration-500 ${
            !timeBasedInfo.isDay 
              ? 'bg-blue-900 bg-opacity-20' 
              : 'bg-yellow-100 bg-opacity-5'
          }`}
        />

        {/* Time Info Display */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm z-20">
          {timeBasedInfo.currentTime}
        </div>
      </div>

      {/* Room Buttons Section */}
      <div className="bg-gray-800 p-4 border-t border-gray-600">
        <div className="flex gap-4 flex-wrap justify-center max-w-4xl mx-auto">
          {/* Basement */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.JOCKS_HOUSE_GARAGE,
                "Basement",
                "Weight sets and exercise equipment fill the space. Motivational posters cover the walls with bold messages: 'ZERO EXCUSES', 'WINNERS NEVER QUIT', and 'THERE ARE NO SHORTCUTS TO ANY PLACE WORTH GOING'. The constant reminder that there are zero excuses for failure drives every workout."
              )
            }
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 min-w-[120px] text-center"
          >
            🏠 Basement
          </button>

          {/* Kitchen */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.JOCKS_HOUSE_KITCHEN,
                "Kitchen",
                "Protein shakes and energy bars stack the counter. A meal prep schedule is taped to the fridge."
              )
            }
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 min-w-[120px] text-center"
          >
            🥤 Kitchen
          </button>

          {/* Living Room */}
          <button
            onClick={() =>
              openRoom(
                WINDOW_IDS.JOCKS_HOUSE_LIVING_ROOM,
                "Living Room",
                "Sports trophies line the shelves. A worn football sits on the coffee table."
              )
            }
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 min-w-[120px] text-center"
          >
            🏆 Living Room
          </button>

          {/* Bedroom */}
          <button
            onClick={openBedroom}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all duration-200 hover:scale-105 min-w-[120px] text-center"
          >
            🛏️ Bedroom
          </button>
        </div>
      </div>
    </div>
  );
};

export default JocksHouseMain;
