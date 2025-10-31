import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { maidGraph } from "lib/maidGraph";
import { useDialogue } from "hooks/useDialogue";

const Overlay = styled.div`
  position: relative;
  width: min(320px, 85vw);
  max-width: 85vw;
  max-height: 70vh;
  background: #000033;
  border: 4px solid #ff6600;
  border-radius: 0;
  padding: 12px;
  color: #ffffff;
  font-family: "Press Start 2P", "Courier New", monospace;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 
    0 0 0 2px #0066cc,
    0 0 0 6px #ff6600,
    0 6px 0 6px #000,
    0 8px 24px rgba(0, 0, 0, 0.9);
  overflow-y: auto;
  image-rendering: pixelated;
  
  @media (max-width: 768px) {
    padding: 10px;
    gap: 6px;
    max-height: 65vh;
    width: min(300px, 85vw);
    border-width: 3px;
  }
`;

const Meta = styled.div`
  font-size: 7px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #00ccff;
  text-shadow: 2px 2px 0 #003366;
  
  @media (max-width: 768px) {
    font-size: 6px;
  }
`;

const Speaker = styled.div`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #ff9933;
  text-shadow: 2px 2px 0 #000;
  border-bottom: 3px solid #ff6600;
  padding-bottom: 6px;
  
  @media (max-width: 768px) {
    font-size: 9px;
    border-bottom-width: 2px;
  }
`;

const DialogueText = styled.div`
  font-size: 10px;
  line-height: 1.4;
  text-align: left;
  white-space: pre-wrap;
  color: #ffffff;
  padding: 8px;
  background: #001166;
  border: 2px solid #0066cc;
  border-radius: 0;
  min-height: 60px;
  display: flex;
  align-items: center;
  box-shadow: inset 2px 2px 0 rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 9px;
    padding: 7px;
    min-height: 50px;
  }
`;

const Choices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const ChoiceButton = styled.button`
  background: linear-gradient(180deg, #ff8833 0%, #ff6600 100%);
  border: 3px solid #ffaa66;
  color: #000000;
  font-weight: 700;
  font-family: "Press Start 2P", "Courier New", monospace;
  padding: 8px 10px;
  border-radius: 0;
  cursor: pointer;
  transition: none;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 8px;
  text-align: left;
  box-shadow: 
    4px 4px 0 rgba(0, 0, 0, 0.4),
    inset -2px -2px 0 rgba(0, 0, 0, 0.3);
  image-rendering: pixelated;

  &:hover {
    background: linear-gradient(180deg, #ffaa66 0%, #ff8833 100%);
    border-color: #ffd699;
    transform: translate(2px, 2px);
    box-shadow: 
      2px 2px 0 rgba(0, 0, 0, 0.4),
      inset -2px -2px 0 rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translate(4px, 4px);
    box-shadow: 
      0px 0px 0 rgba(0, 0, 0, 0.4),
      inset -1px -1px 0 rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 7px 8px;
    font-size: 7px;
  }
`;

const SecondaryButton = styled(ChoiceButton)`
  background: linear-gradient(180deg, #0088cc 0%, #0066aa 100%);
  border-color: #00aaff;
  color: #ffffff;
  font-size: 7px;
  padding: 6px 8px;
  margin-top: 4px;
  
  &:hover {
    background: linear-gradient(180deg, #00aaff 0%, #0088cc 100%);
    border-color: #33ccff;
  }
  
  @media (max-width: 768px) {
    font-size: 6px;
    padding: 5px 7px;
  }
`;

const FlagNotice = styled.div`
  margin-top: 4px;
  padding: 10px 12px;
  border-radius: 2px;
  background: linear-gradient(135deg, rgba(255, 153, 51, 0.2), rgba(0, 204, 255, 0.2));
  border: 3px solid #ff9933;
  color: #ffcc66;
  font-size: 13px;
  text-align: center;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px 10px;
  }
`;

const DeadEnd = styled.div`
  font-size: 12px;
  text-align: center;
  color: #ff6666;
  letter-spacing: 0.06em;
  text-shadow: 0 0 8px rgba(255, 102, 102, 0.8);
  
  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

const KeyItem = styled.div`
  margin-top: 8px;
  padding: 16px;
  border-radius: 2px;
  background: linear-gradient(135deg, #ff6600 0%, #ff9933 50%, #0066cc 100%);
  border: 4px solid #ffaa66;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 
    0 0 0 2px #003366,
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    0 4px 12px rgba(255, 102, 0, 0.5);

  @keyframes pulse {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 
        0 0 0 2px #003366,
        inset 0 2px 4px rgba(255, 255, 255, 0.3),
        0 4px 12px rgba(255, 102, 0, 0.5);
    }
    50% { 
      transform: scale(1.02);
      box-shadow: 
        0 0 0 2px #003366,
        inset 0 2px 4px rgba(255, 255, 255, 0.3),
        0 8px 20px rgba(255, 102, 0, 0.7);
    }
  }
  
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const KeyIcon = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 12px rgba(255, 204, 0, 0.8));
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const KeyText = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 
    2px 2px 0 #003366,
    0 0 12px rgba(255, 204, 0, 0.8);
  font-family: "Courier New", "Courier", monospace;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const KeySubtext = styled.div`
  font-size: 12px;
  color: #e6f2ff;
  font-family: "Courier New", "Courier", monospace;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  
  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

// Fullscreen Key Animation Overlay
const KeyAnimationOverlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: ${props => props.$isVisible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${props => props.$isVisible ? 'fadeIn' : 'fadeOut'} 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

const KeyAnimationContainer = styled.div<{ $isAnimating: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  animation: ${props => props.$isAnimating ? 'keyReveal' : 'none'} 5s ease-in-out;
  
  @keyframes keyReveal {
    0% {
      transform: scale(0.3) rotate(-180deg);
      opacity: 0;
    }
    40% {
      transform: scale(1.1) rotate(10deg);
      opacity: 1;
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }
`;

const KeyAnimationImage = styled.img`
  width: 50vw;
  height: 50vh;
  max-width: 500px;
  max-height: 500px;
  object-fit: contain;
  image-rendering: pixelated;
  filter: drop-shadow(0 0 40px rgba(255, 204, 0, 1))
          drop-shadow(0 0 80px rgba(255, 153, 0, 0.8))
          drop-shadow(0 0 120px rgba(255, 102, 0, 0.6));
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { 
      filter: drop-shadow(0 0 40px rgba(255, 204, 0, 1))
              drop-shadow(0 0 80px rgba(255, 153, 0, 0.8))
              drop-shadow(0 0 120px rgba(255, 102, 0, 0.6));
    }
    50% { 
      filter: drop-shadow(0 0 60px rgba(255, 204, 0, 1))
              drop-shadow(0 0 100px rgba(255, 153, 0, 1))
              drop-shadow(0 0 140px rgba(255, 102, 0, 0.8));
    }
  }
`;

const KeyAnimationText = styled.div`
  font-family: "Press Start 2P", "Courier New", monospace;
  font-size: 24px;
  color: #ffcc00;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  text-align: center;
  text-shadow: 
    3px 3px 0 #003366,
    0 0 20px rgba(255, 204, 0, 0.8),
    0 0 40px rgba(255, 153, 0, 0.6);
  animation: textGlow 2s ease-in-out infinite;
  
  @keyframes textGlow {
    0%, 100% {
      text-shadow: 
        3px 3px 0 #003366,
        0 0 20px rgba(255, 204, 0, 0.8),
        0 0 40px rgba(255, 153, 0, 0.6);
    }
    50% {
      text-shadow: 
        3px 3px 0 #003366,
        0 0 30px rgba(255, 204, 0, 1),
        0 0 60px rgba(255, 153, 0, 0.8);
    }
  }
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

interface MaidDialogueProps {
  onClose?: () => void;
}

export default function MaidDialogue({ onClose }: MaidDialogueProps) {
  const { node, flags, chooseYes, chooseNo, restart } = useDialogue(maidGraph);
  const { primaryWallet } = useDynamicContext();
  const successFlag = maidGraph.meta.success_flag;
  const hasObjective = successFlag ? flags.has(successFlag) : false;
  const keyRecorded = useRef(false);
  const [showKeyAnimation, setShowKeyAnimation] = useState(false);
  const [keyAnimationComplete, setKeyAnimationComplete] = useState(false);
  const keyAnimationPlayed = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakerName = node.speaker === "maid"
    ? "Maid"
    : node.speaker === "system"
      ? "System"
      : node.speaker;

  // Check if we're on the final node with "Close" label
  const isCloseButton = node.options.yes.label === "Close";

  // Play key animation when objective is unlocked
  useEffect(() => {
    if (hasObjective && !keyAnimationPlayed.current) {
      keyAnimationPlayed.current = true;
      
      // Play alert sound
      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/success-gum-claim.mp3');
        audioRef.current.volume = 0.6;
      }
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      
      // Show animation
      setShowKeyAnimation(true);
      
      // Hide animation after 5 seconds (extended for better visibility)
      setTimeout(() => {
        setShowKeyAnimation(false);
        setKeyAnimationComplete(true);
      }, 5000);
    }
  }, [hasObjective]);

  // Record key obtainment when objective is unlocked
  useEffect(() => {
    if (hasObjective && primaryWallet?.address && !keyRecorded.current) {
      keyRecorded.current = true;
      
      const recordKey = async () => {
        try {
          console.log('🔑 Recording Room 7 key for:', primaryWallet.address);
          const response = await fetch('/api/record-room7-key', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress: primaryWallet.address }),
          });
          
          const data = await response.json();
          if (data.success) {
            console.log('✅ Room 7 key recorded successfully');
            // Dispatch event to update locker
            window.dispatchEvent(new Event('room7KeyObtained'));
          } else {
            console.error('❌ Failed to record key:', data.error);
          }
        } catch (error) {
          console.error('💥 Error recording key:', error);
        }
      };
      
      recordKey();
    }
  }, [hasObjective, primaryWallet?.address]);

  const handleChoice = (choice: "yes" | "no") => {
    if (isCloseButton && onClose) {
      onClose();
    } else {
      if (choice === "yes") {
        chooseYes();
      } else {
        chooseNo();
      }
    }
  };

  return (
    <>
      {/* Fullscreen Key Animation Overlay */}
      <KeyAnimationOverlay $isVisible={showKeyAnimation}>
        <KeyAnimationContainer $isAnimating={showKeyAnimation}>
          <KeyAnimationImage 
            src="/images/locations/paradise motel/key.png" 
            alt="Room 7 Key"
          />
          <KeyAnimationText>
            Room 7 Key<br/>Obtained!
          </KeyAnimationText>
        </KeyAnimationContainer>
      </KeyAnimationOverlay>

      {/* Main Dialogue Box */}
      <Overlay>
        {maidGraph.meta.location && <Meta>{maidGraph.meta.location}</Meta>}
        <Speaker>{speakerName}</Speaker>
        <DialogueText>{node.text}</DialogueText>
        <Choices>
          <ChoiceButton onClick={() => handleChoice("yes")}>
            {node.options.yes.label}
          </ChoiceButton>
          {!isCloseButton && (
            <>
              <ChoiceButton onClick={() => handleChoice("no")}>
                {node.options.no.label}
              </ChoiceButton>
              <SecondaryButton onClick={restart}>Restart</SecondaryButton>
            </>
          )}
        </Choices>
        {node.tags?.includes("dead_end") && (
          <DeadEnd>Dead end. Try a different approach.</DeadEnd>
        )}
        {/* Only show this after animation completes */}
        {hasObjective && successFlag && keyAnimationComplete && (
          <FlagNotice>
            🎯 New objective: Return to Room 7 at night
          </FlagNotice>
        )}
      </Overlay>
    </>
  );
}
