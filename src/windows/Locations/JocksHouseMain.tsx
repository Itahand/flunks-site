import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";
import { useTimeBasedImage } from "utils/timeBasedImages";
import { getCliqueColors, getCliqueIcon } from "utils/cliqueColors";
import { getFontStyle } from "utils/fontConfig";
import { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { awardGum } from "utils/gumAPI";
import { trackDigitalLockAttempt } from "utils/digitalLockTracking";

// Separate DigitalLock component to avoid state closure issues
const DigitalLockWindow = ({ onClose, primaryWallet }: { 
  onClose: () => void;
  primaryWallet: any;
}) => {
  const [localLockCode, setLocalLockCode] = useState('');
  const [localIsUnlocked, setLocalIsUnlocked] = useState(false);
  const correctCode = '0730';
  
  console.log('🔄 DigitalLockWindow render - localLockCode:', `"${localLockCode}"`, 'length:', localLockCode.length);

  const playBeep = (frequency = 800, duration = 100) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const handleLocalKeypadPress = (digit: string) => {
    console.log('🎯 Local Keypad pressed:', digit);
    if (digit >= '0' && digit <= '9') {
      playBeep(600, 150);
      setLocalLockCode(currentCode => {
        console.log('📊 Local Current code before update:', `"${currentCode}"`, 'Length:', currentCode.length);
        if (currentCode.length < 4) {
          const newCode = currentCode + digit;
          console.log('✅ Local New code will be:', `"${newCode}"`, 'Length:', newCode.length);
          return newCode;
        }
        console.log('❌ Local Code already 4 digits, ignoring');
        return currentCode;
      });
    }
  };

  const handleLocalCodeSubmit = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('🔐 Local Submit attempt - lockCode:', `"${localLockCode}"`, 'correctCode:', `"${correctCode}"`);
    
    const success = localLockCode === correctCode;
    
    // Track the attempt in Supabase
    try {
      if (primaryWallet?.address) {
        console.log('📊 Tracking digital lock attempt to Supabase...');
        await trackDigitalLockAttempt(
          primaryWallet.address,
          null, // We don't have username context here, but that's okay
          localLockCode,
          success
        );
        console.log('✅ Digital lock attempt tracked successfully!');
      } else {
        console.log('⚠️ No wallet connected, skipping tracking');
      }
    } catch (error) {
      console.error('❌ Error tracking digital lock attempt:', error);
      // Don't let tracking errors stop the game flow
    }
    
    if (success) {
      console.log('✅ Local Correct code entered!');
      playBeep(1000, 500);
      setLocalIsUnlocked(true);
    } else {
      console.log('❌ Local Incorrect code.');
      playBeep(200, 800);
      setTimeout(() => {
        setLocalLockCode('');
      }, 1000);
    }
  };

  const clearLocalCode = () => {
    console.log('🧹 Local Clearing code');
    playBeep(400, 200);
    setLocalLockCode('');
  };

  return (
    <div className="p-6 w-full h-full bg-gray-900 text-white flex flex-col justify-center items-center overflow-hidden">
      <div className="text-center mb-6 px-4">
        <h2 className="text-xl mb-3">🔒 Locked Trunk</h2>
        <p className="text-sm text-gray-300 mb-4 leading-relaxed max-w-sm mx-auto break-words">
          You found a locked trunk under the bed, figure out the code to see what's inside!
        </p>
      </div>
      
      {!localIsUnlocked ? (
        <div className="w-full max-w-sm mx-auto">
          {/* Digital Display */}
          <div className="bg-black border-2 border-gray-600 rounded-lg p-4 mb-6">
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-2">ENTER 4-DIGIT CODE</div>
              <div className="text-2xl font-mono text-green-400 tracking-widest">
                {localLockCode.padEnd(4, '_').split('').map((char, index) => (
                  <span key={index} className="mx-1">
                    {char === '_' ? '○' : char}
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Debug: "{localLockCode}" (length: {localLockCode.length})
              </div>
            </div>
          </div>
          
          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 mb-6 max-w-[200px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
              <button
                key={digit}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🖱️ Local Button clicked:', digit);
                  handleLocalKeypadPress(digit);
                }}
                disabled={digit === '*' || digit === '#'}
                className={`w-12 h-12 rounded font-mono text-lg font-bold transition-all duration-150 border-2 ${
                  digit === '*' || digit === '#' 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed border-gray-600'
                    : 'bg-gray-600 hover:bg-gray-500 text-white hover:scale-105 active:scale-95 border-gray-500 hover:border-gray-400'
                }`}
              >
                {digit}
              </button>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Local UNLOCK button clicked, lockCode:', `"${localLockCode}"`, 'length:', localLockCode.length);
                handleLocalCodeSubmit(e);
              }}
              disabled={localLockCode.length !== 4}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-200 text-lg ${
                localLockCode.length === 4 
                  ? 'bg-green-600 hover:bg-green-700 hover:scale-105 text-white cursor-pointer' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              🔓 UNLOCK ({localLockCode.length}/4)
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                clearLocalCode();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 text-lg"
            >
              🔄 CLEAR
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 text-lg"
            >
              🚪 CANCEL
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <h2 className="text-xl mb-3">📦 Unlocked Trunk</h2>
            <p className="text-base text-gray-300 mb-4 leading-relaxed">
              The lock clicks open, revealing the contents inside...
            </p>
            {primaryWallet?.address && (
              <p className="text-xs text-green-400 mb-2">
                🎯 Success tracked for wallet: {primaryWallet.address.slice(0, 8)}...{primaryWallet.address.slice(-4)}
              </p>
            )}
          </div>
          
          <div className="bg-yellow-100 text-black p-6 rounded-lg border-2 border-yellow-600 shadow-lg transform rotate-1">
            <div className="text-center">
              <div className="text-lg font-bold mb-4 text-gray-800">
                Mysterious Message
              </div>
              <div className="text-base leading-relaxed font-handwriting" style={{ fontFamily: 'cursive' }}>
                "the first to get 5869 wins the flow at the end of the rainbow"
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              What could this cryptic message mean?
            </p>
          </div>
        </>
      )}
      
      <div className="mt-6">
        <button
          onClick={() => onClose()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 text-lg"
        >
          🚪 Close
        </button>
      </div>
    </div>
  );
};

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
          initialWidth="90vw"
          initialHeight="90vh"
          resizable={true}
        >
          <div className="w-full h-full bg-[#1a1a1a] text-white overflow-auto flex flex-col">
            {/* Image Section - Takes up most of the space */}
            <div className="relative flex-1 min-h-[400px] bg-black">
              <img
                src="/images/locations/jocks-bedroom.png"
                alt="Jock's Bedroom Interior"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/images/backdrops/BLANK.png";
                }}
              />
            </div>
            
            {/* Description and Buttons Section - Below the image */}
            <div className="bg-black bg-opacity-90 p-4 sm:p-6 border-t border-gray-600">
              <h1 className="text-xl sm:text-2xl mb-2 sm:mb-3 font-bold text-center">🛏️ Jock's Bedroom</h1>
              <p className="text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 text-center">
                The personal sanctuary of a champion athlete. Every corner speaks to dedication, 
                discipline, and the relentless pursuit of excellence.
              </p>
              <p className="text-xs text-gray-300 mb-4 text-center">
                Explore different areas of the bedroom to uncover the secrets of athletic success.
              </p>
              
              {/* Interactive Buttons */}
              <div className="max-w-lg mx-auto">
                {/* First row - 4 buttons with responsive grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <button
                    onClick={() => 
                      openRoom(
                        WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_closet',
                        "Walk-in Closet",
                        "Letterman jackets from multiple sports hang in perfect order. Championship rings sit in a display case. Team captain armbands are neatly organized on shelves."
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base min-h-[44px]"
                  >
                    👕 Closet
                  </button>
                  
                  <button
                    onClick={() => 
                      openStudyDesk()
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base min-h-[44px]"
                  >
                    📚 Desk
                  </button>
                  
                  <button
                    onClick={() => 
                      openUnderBed()
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base min-h-[44px]"
                  >
                    🛏️ Under the Bed
                  </button>
                  
                  <button
                    onClick={() => 
                      openDigitalLockStats()
                    }
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base min-h-[44px]"
                  >
                    📊 Lock Stats
                  </button>
                  
                  <button
                    onClick={() => 
                      openRoom(
                        WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_trophy',
                        "Trophy Corner",
                        "A gleaming display of athletic achievements. MVP awards, state championship trophies, and team photos from winning seasons. Each piece represents countless hours of dedication and zero excuses."
                      )
                    }
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base min-h-[44px]"
                  >
                    🏆 Trophies
                  </button>
                </div>
                
                {/* Second row - Computer button */}
                <div className="flex justify-center">
                  <button
                    disabled
                    className="bg-gray-600 text-gray-400 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold cursor-not-allowed opacity-50 shadow-lg w-full sm:w-64 text-sm sm:text-base min-h-[44px]"
                    title="Coming soon..."
                  >
                    💻 Computer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DraggableResizeableWindow>
      ),
    });
  };

  const correctCode = '0730';

  // Add audio feedback
  const playBeep = (frequency = 800, duration = 100) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const openUnderBed = () => {
    console.log('🚪 Opening Under the Bed - Digital Lock window');
    
    openWindow({
      key: WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_under_bed_lock',
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_under_bed_lock'}
          headerTitle="Under the Bed - Digital Lock"
          onClose={() => closeWindow(WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_under_bed_lock')}
          initialWidth="500px"
          initialHeight="600px"
          resizable={false}
        >
          <DigitalLockWindow 
            onClose={() => closeWindow(WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_under_bed_lock')} 
            primaryWallet={primaryWallet}
          />
        </DraggableResizeableWindow>
      ),
    });
  };

  const openDigitalLockStats = () => {
    openWindow({
      key: WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_lock_stats',
      window: (
        <DraggableResizeableWindow
          windowsId={WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_lock_stats'}
          headerTitle="Digital Lock Statistics"
          onClose={() => closeWindow(WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_lock_stats')}
          initialWidth="600px"
          initialHeight="500px"
          resizable={true}
        >
          <DigitalLockStatsWindow onClose={() => closeWindow(WINDOW_IDS.JOCKS_HOUSE_BEDROOM + '_lock_stats')} />
        </DraggableResizeableWindow>
      ),
    });
  };

  // Digital Lock Stats Component
  const DigitalLockStatsWindow = ({ onClose }: { onClose: () => void }) => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchStats = async () => {
        try {
          const response = await fetch('/api/digital-lock-stats');
          const data = await response.json();
          
          if (data.success) {
            setStats(data.stats);
          } else {
            setError(data.error || 'Failed to load stats');
          }
        } catch (err) {
          setError('Network error loading stats');
          console.error('Error loading stats:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }, []);

    return (
      <div className="p-6 w-full h-full bg-gray-900 text-white overflow-auto">
        <div className="text-center mb-6">
          <h2 className="text-xl mb-3">📊 Digital Lock Statistics</h2>
          <p className="text-sm text-gray-300">
            Track who's been cracking the 0730 code!
          </p>
        </div>

        {loading && (
          <div className="text-center">
            <p className="text-gray-400">Loading stats...</p>
          </div>
        )}

        {error && (
          <div className="text-center">
            <p className="text-red-400">Error: {error}</p>
          </div>
        )}

        {stats && (
          <div className="space-y-6">
            {/* Overall Stats */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-4 text-blue-300">📈 Overall Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{stats.totalAttempts}</div>
                  <div className="text-sm text-gray-300">Total Attempts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{stats.successfulAttempts}</div>
                  <div className="text-sm text-gray-300">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{stats.failedAttempts}</div>
                  <div className="text-sm text-gray-300">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{stats.successRate}%</div>
                  <div className="text-sm text-gray-300">Success Rate</div>
                </div>
              </div>
            </div>

            {/* User Stats */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-4 text-green-300">👥 User Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{stats.uniqueUsers}</div>
                  <div className="text-sm text-gray-300">Unique Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{stats.uniqueSuccessfulUsers}</div>
                  <div className="text-sm text-gray-300">Successful Users</div>
                </div>
              </div>
            </div>

            {/* Recent Successes */}
            {stats.recentSuccesses && stats.recentSuccesses.length > 0 && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-4 text-yellow-300">🏆 Recent Successes</h3>
                <div className="space-y-2">
                  {stats.recentSuccesses.map((success: any, index: number) => (
                    <div key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                      <span className="font-mono text-green-400">{success.wallet}</span>
                      <span className="text-sm text-gray-300">
                        {new Date(success.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center pt-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all duration-200 hover:scale-105 mr-2"
              >
                🔄 Refresh Stats
              </button>
              <button
                onClick={onClose}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-all duration-200 hover:scale-105"
              >
                🚪 Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
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
