import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { maidGraph } from "lib/maidGraph";
import { useDialogue } from "hooks/useDialogue";

const Overlay = styled.div`
  position: relative;
  width: min(680px, 95vw);
  max-width: 95vw;
  max-height: 85vh;
  background: linear-gradient(135deg, #001a33 0%, #002244 50%, #003355 100%);
  border: 6px solid #ff6600;
  border-radius: 4px;
  padding: 20px;
  color: #ffffff;
  font-family: "Courier New", "Courier", monospace;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 
    0 0 0 2px #0066cc,
    0 0 0 4px #ff6600,
    0 8px 24px rgba(0, 0, 0, 0.8),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 16px;
    gap: 12px;
    max-height: 80vh;
    border-width: 4px;
  }
`;

const Meta = styled.div`
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #00ccff;
  text-shadow: 0 0 8px rgba(0, 204, 255, 0.6);
  
  @media (max-width: 768px) {
    font-size: 9px;
  }
`;

const Speaker = styled.div`
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #ff9933;
  text-shadow: 
    2px 2px 0 #003366,
    0 0 12px rgba(255, 153, 51, 0.6);
  border-bottom: 3px solid #ff6600;
  padding-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 16px;
    border-bottom-width: 2px;
  }
`;

const DialogueText = styled.div`
  font-size: 15px;
  line-height: 1.7;
  text-align: left;
  white-space: pre-wrap;
  color: #e6f2ff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  padding: 12px;
  background: rgba(0, 26, 51, 0.6);
  border: 2px solid #0066cc;
  border-radius: 2px;
  min-height: 80px;
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.6;
    padding: 10px;
    min-height: 70px;
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
  color: #001a33;
  font-weight: 700;
  font-family: "Courier New", "Courier", monospace;
  padding: 12px 16px;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.1s ease;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 13px;
  text-align: left;
  box-shadow: 
    3px 3px 0 rgba(0, 0, 0, 0.4),
    inset 0 -2px 4px rgba(0, 0, 0, 0.3);

  &:hover {
    background: linear-gradient(180deg, #ffaa66 0%, #ff8833 100%);
    border-color: #ffd699;
    transform: translate(1px, 1px);
    box-shadow: 
      2px 2px 0 rgba(0, 0, 0, 0.4),
      inset 0 -2px 4px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 
      1px 1px 0 rgba(0, 0, 0, 0.4),
      inset 0 -1px 2px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 12px;
  }
`;

const SecondaryButton = styled(ChoiceButton)`
  background: linear-gradient(180deg, #0088cc 0%, #0066aa 100%);
  border-color: #00aaff;
  color: #ffffff;
  font-size: 11px;
  padding: 8px 12px;
  margin-top: 4px;
  
  &:hover {
    background: linear-gradient(180deg, #00aaff 0%, #0088cc 100%);
    border-color: #33ccff;
  }
  
  @media (max-width: 768px) {
    font-size: 10px;
    padding: 6px 10px;
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
  font-size: 48px;
  filter: drop-shadow(0 0 12px rgba(255, 204, 0, 0.8));
  
  @media (max-width: 768px) {
    font-size: 40px;
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

interface MaidDialogueProps {
  onClose?: () => void;
}

export default function MaidDialogue({ onClose }: MaidDialogueProps) {
  const { node, flags, chooseYes, chooseNo, restart } = useDialogue(maidGraph);
  const { primaryWallet } = useDynamicContext();
  const successFlag = maidGraph.meta.success_flag;
  const hasObjective = successFlag ? flags.has(successFlag) : false;
  const keyRecorded = useRef(false);

  const speakerName = node.speaker === "maid"
    ? "Maid"
    : node.speaker === "system"
      ? "System"
      : node.speaker;

  // Check if we're on the final node with "Close" label
  const isCloseButton = node.options.yes.label === "Close";

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
      {hasObjective && successFlag && (
        <>
          <KeyItem>
            <KeyIcon>🔑</KeyIcon>
            <KeyText>Room 7 Key Obtained</KeyText>
            <KeySubtext>Return after dark to access Room 7</KeySubtext>
          </KeyItem>
          <FlagNotice>
            🎯 New objective: Return to Room 7 at night
          </FlagNotice>
        </>
      )}
    </Overlay>
  );
}
