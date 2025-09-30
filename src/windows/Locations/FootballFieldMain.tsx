import { useState, useMemo, useEffect } from "react";
import { useAuth } from "contexts/AuthContext";
import { awardGum } from "utils/gumAPI";
import { trackFridayNightLightsClick, checkFridayNightLightsClicked } from "../../utils/fridayNightLightsTracking";
import { getFontStyle } from "utils/fontConfig";

const FootballFieldMain = () => {
  const { walletAddress, user } = useAuth();
  const [buttonClickLoading, setButtonClickLoading] = useState(false);
  const [hasClaimedGum, setHasClaimedGum] = useState(false);

  // Get font styling for JOCK clique (football field is jock territory)
  const fontStyle = getFontStyle('JOCK');

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
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      {/* Background Image */}
      <img
        src="/images/backdrops/vigil.png"
        alt="Football Field Vigil"
        className="w-full h-full object-contain z-0"
        style={{
          // Show full image constrained to container
          objectFit: 'contain',
          objectPosition: 'center center',
          width: '100%',
          height: '100%'
        }}
        onError={(e) => {
          e.currentTarget.src = "/images/backdrops/BLANK.png";
        }}
      />
      
      {/* Subtle Dark Overlay for better button visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-20 z-5"></div>


    </div>
  );
};

export default FootballFieldMain;