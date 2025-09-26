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

  // Get font styling for JOCK clique (football field is jock territory)
  const fontStyle = getFontStyle('JOCK');

  // Create audio instance for Friday Night Lights - set to loop
  const fridayNightLightsAudio = useMemo(() => {
    const audio = new Audio("/sounds/friday-night-lights.mp3");
    audio.loop = true;
    audio.volume = 0.6; // Set volume to 60%
    return audio;
  }, []);

  // Start playing audio when component mounts and check if user has already claimed GUM
  useEffect(() => {
    const startAudio = async () => {
      try {
        await fridayNightLightsAudio.play();
      } catch (error) {
        console.warn('Could not auto-play Friday Night Lights audio:', error);
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
          console.error("Failed to check GUM claim status:", error);
        }
      }
    };

    startAudio();
    checkGumStatus();

    // Cleanup function to pause audio when component unmounts
    return () => {
      fridayNightLightsAudio.pause();
    };
  }, [fridayNightLightsAudio, walletAddress]);

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

  return (
    <div className="relative w-full h-full">
      {/* Background Image */}
      <img
        src="/images/backdrops/football-field.png"
        alt="Football Field Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
        onError={(e) => {
          // Fallback to blank background if image fails to load
          e.currentTarget.src = "/images/backdrops/BLANK.png";
        }}
      />
      
      {/* Dark Overlay to dim the background */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-5"></div>

      {/* Central Content Container */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center max-w-2xl px-4">
        {/* Friday Night Lights Button - Enhanced prominence */}
        <button
          onClick={handleFridayNightLightsClick}
          disabled={buttonClickLoading || hasClaimedGum}
          className={`mb-6 px-10 py-5 rounded-xl font-bold text-2xl transition-all duration-300 shadow-2xl border-2 
            ${buttonClickLoading 
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed border-gray-500' 
              : hasClaimedGum
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed border-gray-600'
              : 'bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white border-yellow-400 hover:scale-110 hover:shadow-yellow-500/50'
            }`}
          style={{
            ...fontStyle,
            fontSize: '24px', // Override for larger button text
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

        {/* Repeat Offender Button - Only shows if Friday Night Lights has been claimed */}
        {hasClaimedGum && (
          <button
            onClick={handleRepeatOffenderClick}
            disabled={repeatOffenderLoading || !repeatOffenderEligibility.canClaim}
            className={`mb-6 px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 shadow-2xl border-2 
              ${repeatOffenderLoading 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed border-gray-500' 
                : !repeatOffenderEligibility.canClaim
                ? 'bg-red-700 text-red-300 cursor-not-allowed border-red-600'
                : 'bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border-red-400 hover:scale-110 hover:shadow-red-500/50'
              }`}
            style={{
              ...fontStyle,
              fontSize: '20px', // Slightly smaller than Friday Night Lights
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

        {/* Small Town Football Blurb */}
        <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg p-6 border border-gray-600 shadow-xl">
          <p 
            className="text-white text-lg leading-relaxed italic font-medium"
            style={{
              ...fontStyle,
              fontSize: '18px', // Specific size for main quote
              lineHeight: '1.6',
            }}
          >
            All day the halls had carried a strange hush, as if the walls themselves were waiting for something to happen. By the time the bleachers filled and the lights hummed to life, the strangeness hadn't lifted—it had deepened. The crowd cheered, the band played, but the night's rhythm was wrong, like a song played just out of tune. This wasn't homecoming. This was the beginning of something else—something slipping quietly away, even as no one noticed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FootballFieldMain;
