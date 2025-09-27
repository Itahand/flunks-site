import { useState, useMemo, useEffect } from "react";
import { useAuth } from "contexts/AuthContext";
import { awardGum } from "utils/gumAPI";
import { trackFridayNightLightsClick, checkFridayNightLightsClicked } from "../../utils/fridayNightLightsTracking";
import { checkRepeatOffenderEligibility, formatTimeRemaining } from "../../utils/repeatOffenderTracking";
import { getFontStyle } from "utils/fontConfig";

const FootballFieldMain = () => {
  const { walletAddress, user } = useAuth();
  const [buttonClickLoading, setButtonClickLoading] = useState(false);
  const [hasClaimedGum, setHasClaimedGum] = useState(false);
  const [repeatOffenderLoading, setRepeatOffenderLoading] = useState(false);
  const [repeatOffenderEligibility, setRepeatOffenderEligibility] = useState<{
    canClaim: boolean;
    timeRemaining?: number;
    lastClaimTime?: string;
  }>({ canClaim: false });

  // Story mode state
  const [currentStoryPanel, setCurrentStoryPanel] = useState(0);
  const [showStoryMode, setShowStoryMode] = useState(true);

  // Get font styling for JOCK clique (football field is jock territory)
  const fontStyle = getFontStyle('JOCK');

  // Story panels for multi-window narrative
  const storyPanels = [
    {
      title: "Strange Homecoming - Part 1",
      text: "All day the halls had carried a strange hush, as if the walls themselves were waiting for something to happen. The usual pre-game excitement felt muted, replaced by an odd tension that even the most spirited students couldn't shake."
    },
    {
      title: "Strange Homecoming - Part 2", 
      text: "By the time the bleachers filled and the lights hummed to life, the strangeness hadn't lifted—it had deepened. The crowd cheered, the band played, but the night's rhythm was wrong, like a song played just out of tune."
    },
    {
      title: "Strange Homecoming - Part 3",
      text: "This wasn't homecoming. This was the beginning of something else—something slipping quietly away, even as no one noticed. The field lights cast longer shadows than they should, and the air itself seemed to hold its breath."
    }
  ];

  // Create audio instance for Friday Night Lights - set to loop
  const fridayNightLightsAudio = useMemo(() => {
    if (typeof window === 'undefined') return null;
    
    const audio = new Audio("/music/homecoming.mp3");
    audio.loop = true;
    audio.volume = 0.6; // Set volume to 60%
    
    // Add error handling
    audio.addEventListener('error', (e) => {
      console.warn('Could not load homecoming.mp3 audio:', e);
    });
    
    return audio;
  }, []);

  // Start playing audio when component mounts and check if user has already claimed GUM
  useEffect(() => {
    const startAudio = async () => {
      if (!fridayNightLightsAudio) return;
      
      try {
        // Try to play audio
        const playPromise = fridayNightLightsAudio.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          console.log('🎵 Homecoming music started playing');
        }
      } catch (error) {
        console.warn('Could not auto-play Friday Night Lights audio (browser policy):', error);
        
        // Add click listener to play on user interaction
        const handleFirstClick = () => {
          if (fridayNightLightsAudio) {
            fridayNightLightsAudio.play().catch(console.warn);
          }
          document.removeEventListener('click', handleFirstClick);
        };
        
        document.addEventListener('click', handleFirstClick);
      }
    };

    const checkGumStatus = async () => {
      if (walletAddress) {
        try {
          const hasClicked = await checkFridayNightLightsClicked(walletAddress);
          setHasClaimedGum(hasClicked);
          
          // If they've claimed Friday Night Lights, check repeat offender eligibility
          if (hasClicked) {
            const eligibility = await checkRepeatOffenderEligibility(walletAddress);
            setRepeatOffenderEligibility(eligibility);
          }
        } catch (error) {
          console.error("Error checking GUM status:", error);
        }
      }
    };

    startAudio();
    checkGumStatus();

    // Cleanup audio on unmount
    return () => {
      if (fridayNightLightsAudio) {
        fridayNightLightsAudio.pause();
        fridayNightLightsAudio.currentTime = 0;
      }
    };
  }, [walletAddress, fridayNightLightsAudio]);

  const handleFridayNightLightsClick = async () => {
    if (!walletAddress || !user) {
      alert("Please connect your wallet first!");
      return;
    }

    if (buttonClickLoading || hasClaimedGum) return;

    setButtonClickLoading(true);
    try {
      // Track the click
      const tracked = await trackFridayNightLightsClick(walletAddress);
      
      if (tracked) {
        // Award 50 GUM for clicking Friday Night Lights
        await awardGum(walletAddress, "friday_night_lights", { amount: 50, description: "Friday Night Lights click" });
        setHasClaimedGum(true);
        
        // Check repeat offender eligibility now that they've claimed Friday Night Lights
        const eligibility = await checkRepeatOffenderEligibility(walletAddress);
        setRepeatOffenderEligibility(eligibility);
        
        alert("🏈 FRIDAY NIGHT LIGHTS! You earned 50 GUM! The crowd roars with excitement!");
      } else {
        setHasClaimedGum(true);
        alert("🏈 You've already experienced Friday Night Lights! The magic only happens once.");
      }
    } catch (error) {
      console.error("Failed to process Friday Night Lights click:", error);
      alert("Something went wrong with Friday Night Lights. Try again!");
    } finally {
      setButtonClickLoading(false);
    }
  };

  const handleRepeatOffenderClick = async () => {
    if (!walletAddress || !user) {
      alert("Please connect your wallet first!");
      return;
    }

    if (repeatOffenderLoading || !repeatOffenderEligibility.canClaim) return;

    setRepeatOffenderLoading(true);
    try {
      const response = await fetch('/api/claim-repeat-offender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`🏈 REPEAT OFFENDER! You earned ${result.gumAwarded} GUM! The legend continues!`);
        // Refresh eligibility status
        const eligibility = await checkRepeatOffenderEligibility(walletAddress);
        setRepeatOffenderEligibility(eligibility);
      } else {
        alert(`❌ ${result.error || 'Failed to claim Repeat Offender reward. Please try again.'}`);
      }
    } catch (error) {
      console.error("Failed to process Repeat Offender claim:", error);
      alert("Something went wrong with Repeat Offender claim. Try again!");
    } finally {
      setRepeatOffenderLoading(false);
    }
  };

  const nextStoryPanel = () => {
    if (currentStoryPanel < storyPanels.length - 1) {
      setCurrentStoryPanel(currentStoryPanel + 1);
    } else {
      setShowStoryMode(false);
    }
  };

  const skipStory = () => {
    setShowStoryMode(false);
  };

  return (
    <div className="relative w-full h-full">
      {/* Background Image */}
      <img
        src="/images/backdrops/football-field.png"
        alt="Football Field Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
        onError={(e) => {
          e.currentTarget.src = "/images/backdrops/BLANK.png";
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30 z-5"></div>

      {showStoryMode ? (
        /* Story Mode Windows */
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
          <div 
            className="bg-black border-4 text-white p-6 rounded-none shadow-2xl max-w-2xl w-full"
            style={{
              borderColor: '#f5a2d3',
              background: 'rgba(10, 10, 14, 0.95)',
            }}
          >
            <h2 className="text-xl font-bold mb-4 text-center" style={{ color: '#f5a2d3' }}>
              {storyPanels[currentStoryPanel].title}
            </h2>
            
            <p className="text-base leading-relaxed mb-6 font-italic">
              {storyPanels[currentStoryPanel].text}
            </p>

            <div className="flex justify-between items-center">
              <button
                onClick={skipStory}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded border border-gray-400 transition-colors"
              >
                Skip Story
              </button>

              <div className="flex gap-2">
                {storyPanels.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStoryPanel ? 'bg-pink-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStoryPanel}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white rounded border border-pink-300 transition-all font-bold"
              >
                {currentStoryPanel < storyPanels.length - 1 ? 'Continue' : 'Enter Field'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile: Text above everything */}
          <div className="block sm:hidden absolute top-4 left-0 right-0 z-10 px-4">
            <div 
              className="bg-black border-2 text-white p-3 rounded shadow-xl"
              style={{
                borderColor: '#f5a2d3',
                background: 'rgba(10, 10, 14, 0.9)',
              }}
            >
              <p className="text-sm leading-tight font-italic">
                The night's rhythm was wrong, like a song played just out of tune. This wasn't homecoming.
              </p>
            </div>
          </div>

          {/* Bottom Buttons Container */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2 sm:gap-3 w-full px-4">
            {/* Friday Night Lights Button */}
            <button
              onClick={handleFridayNightLightsClick}
              disabled={buttonClickLoading || hasClaimedGum}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-base sm:text-lg transition-all duration-300 shadow-lg border-2 w-full max-w-xs
                ${buttonClickLoading 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed border-gray-500' 
                  : hasClaimedGum
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed border-gray-600'
                  : 'bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white border-yellow-400 hover:scale-105 hover:shadow-yellow-500/50'
                }`}
              style={{
                ...fontStyle,
                fontSize: 'clamp(16px, 4vw, 18px)',
                fontWeight: 'bold',
              }}
            >
              {buttonClickLoading 
                ? '⏳ Loading...' 
                : hasClaimedGum 
                ? '🏈 LIGHTS CLAIMED' 
                : '🏈 FRIDAY NIGHT LIGHTS'
              }
            </button>

            {/* Repeat Offender Button */}
            {hasClaimedGum && (
              <button
                onClick={handleRepeatOffenderClick}
                disabled={repeatOffenderLoading || !repeatOffenderEligibility.canClaim}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all duration-300 shadow-lg border-2 w-full max-w-xs
                  ${repeatOffenderLoading 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed border-gray-500' 
                    : !repeatOffenderEligibility.canClaim
                    ? 'bg-red-700 text-red-300 cursor-not-allowed border-red-600'
                    : 'bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border-red-400 hover:scale-105 hover:shadow-red-500/50'
                  }`}
                style={{
                  ...fontStyle,
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  fontWeight: 'bold',
                }}
              >
                {repeatOffenderLoading 
                  ? '⏳ Loading...' 
                  : !repeatOffenderEligibility.canClaim && repeatOffenderEligibility.timeRemaining
                  ? `🚫 Wait ${formatTimeRemaining(repeatOffenderEligibility.timeRemaining)}`
                  : repeatOffenderEligibility.canClaim
                  ? '🔄 REPEAT OFFENDER (+50 GUM)'
                  : '🔄 REPEAT OFFENDER'
                }
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FootballFieldMain;