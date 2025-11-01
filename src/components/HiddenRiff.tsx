"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import type { HiddenRiffPreset, MajorChord } from "lib/hiddenRiffPresets";
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 16px;
  
  /* Retro vibes background */
  background: 
    linear-gradient(135deg, rgba(255, 107, 107, 0.05) 0%, rgba(255, 204, 0, 0.05) 100%),
    repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.03) 0px,
      transparent 1px,
      transparent 2px,
      rgba(255, 255, 255, 0.03) 3px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.03) 0px,
      transparent 1px,
      transparent 2px,
      rgba(255, 255, 255, 0.03) 3px
    ),
    radial-gradient(circle at 20% 30%, rgba(255, 193, 7, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(156, 39, 176, 0.08) 0%, transparent 50%),
    linear-gradient(180deg, #1a1410 0%, #0d0a08 100%);
  
  box-shadow: 
    0 0 60px rgba(255, 193, 7, 0.15),
    inset 0 0 80px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    transform: scale(0.92);
    transform-origin: top left;
  }
`;

const AmpShell = styled.div`
  background: linear-gradient(145deg, rgba(42, 24, 16, 0.95) 0%, rgba(26, 15, 8, 0.98) 100%);
  border: 4px solid #100a06;
  border-radius: 8px;
  padding: 32px 24px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.8),
    inset 0 2px 4px rgba(255, 255, 255, 0.05),
    inset 0 -2px 8px rgba(0, 0, 0, 0.5);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 8px;
    border: 1px solid rgba(139, 90, 43, 0.3);
    border-radius: 4px;
    pointer-events: none;
  }
`;

const VintageMesh = styled.div`
  background: 
    repeating-linear-gradient(
      0deg,
      rgba(60, 40, 20, 0.8) 0px,
      transparent 1px,
      transparent 2px,
      rgba(60, 40, 20, 0.8) 3px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(60, 40, 20, 0.8) 0px,
      transparent 1px,
      transparent 2px,
      rgba(60, 40, 20, 0.8) 3px
    ),
    radial-gradient(circle at 50% 50%, #1a1410 0%, #0d0a08 100%);
  border: 3px solid #3d2817;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 
    inset 0 4px 12px rgba(0, 0, 0, 0.8),
    inset 0 0 20px rgba(0, 0, 0, 0.5);
  margin-bottom: 24px;
`;

const ChordButton = styled.button<{ selected?: boolean }>`
  background: ${({ selected }) => 
    selected 
      ? 'linear-gradient(145deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)' 
      : 'linear-gradient(145deg, #8b5a2b 0%, #654321 50%, #4a2511 100%)'
  };
  border: 3px solid ${({ selected }) => (selected ? '#b8860b' : '#3d2817')};
  border-radius: 6px;
  padding: 18px 12px;
  font-size: 32px;
  font-weight: 900;
  font-family: 'Courier New', monospace;
  color: ${({ selected }) => (selected ? '#000' : '#d4a574')};
  text-shadow: ${({ selected }) => 
    selected 
      ? '0 1px 0 rgba(255, 255, 255, 0.5)' 
      : '0 2px 4px rgba(0, 0, 0, 0.8)'
  };
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 
    ${({ selected }) => 
      selected 
        ? '0 4px 0 #8b6914, 0 6px 12px rgba(255, 215, 0, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.2)' 
        : '0 4px 0 #2a1810, 0 6px 12px rgba(0, 0, 0, 0.5), inset 0 -2px 4px rgba(0, 0, 0, 0.3)'
    };

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(2px);
    box-shadow: ${({ selected }) => 
      selected 
        ? '0 2px 0 #8b6914, 0 3px 6px rgba(255, 215, 0, 0.4)' 
        : '0 2px 0 #2a1810, 0 3px 6px rgba(0, 0, 0, 0.5)'
    };
  }
`;

const ChordGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 20px;
  
  /* First row has 4 buttons (A B C D), second row has 3 buttons (E F G) centered */
  > button:nth-child(5) {
    grid-column: 1 / 2;
  }
  > button:nth-child(6) {
    grid-column: 2 / 3;
  }
  > button:nth-child(7) {
    grid-column: 3 / 4;
  }
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const SequenceDisplay = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: #1a1410;
  border: 2px solid #3d2817;
  border-radius: 6px;
  margin-bottom: 16px;
  min-height: 60px;
`;

const SequenceSlot = styled.div<{ filled?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background: ${({ filled }) => filled ? 'linear-gradient(145deg, #4a7c59 0%, #2d5a3d 100%)' : '#242424'};
  border: 2px solid ${({ filled }) => filled ? '#2d5a3d' : '#3e3e3e'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 900;
  font-family: 'Courier New', monospace;
  color: ${({ filled }) => filled ? '#90ee90' : '#666'};
  box-shadow: ${({ filled }) => filled ? '0 0 8px rgba(93, 216, 130, 0.3)' : 'inset 0 2px 4px rgba(0, 0, 0, 0.5)'};
`;

type HiddenRiffProps = {
  preset: HiddenRiffPreset;
  onComplete?: (payload: {
    presetId: string;
    perfect: boolean;
    misses: number;
    ms: number;
  }) => void;
  showHints?: boolean;
  useToneSynth?: boolean;
};

const MAJOR_CHORD_NOTES: Record<MajorChord, string[]> = {
  A: ["A3", "C#4", "E4"],
  B: ["B3", "D#4", "F#4"],
  C: ["C3", "E3", "G3"],
  D: ["D3", "F#3", "A3"],
  E: ["E3", "G#3", "B3"],
  F: ["F3", "A3", "C4"],
  G: ["G3", "B3", "D4"],
};

// Minor chord notes (lowered 3rd)
const MINOR_CHORD_NOTES: Record<string, string[]> = {
  Am: ["A3", "C4", "E4"],
  Bm: ["B3", "D4", "F#4"],
  Cm: ["C3", "D#3", "G3"],
  Dm: ["D3", "F3", "A3"],
  Em: ["E3", "G3", "B3"],
  Fm: ["F3", "G#3", "C4"],
  Gm: ["G3", "A#3", "D4"],
};

const HiddenRiff = ({ preset, onComplete }: HiddenRiffProps) => {
  // Get wallet address from Dynamic context
  const { primaryWallet } = useDynamicContext();
  const walletAddress = primaryWallet?.address;

  // The secret sequence (updated - no longer revealed publicly)
  const correctSequence: string[] = ['C', 'G', 'Am', 'F'];

  // All chords available (majors + minors)
  const allChords: string[] = ['A', 'Am', 'B', 'Bm', 'C', 'Cm', 'D', 'Dm', 'E', 'Em', 'F', 'G'];
  
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioStarted, setAudioStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize Web Audio API context (simpler than Tone.js)
  useEffect(() => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(ctx);
    
    return () => {
      if (ctx.state !== 'closed') {
        ctx.close();
      }
    };
  }, []);

  // Play chord using Web Audio API
  const playChord = async (chord: string) => {
    if (!audioContext) {
      console.log('Audio context not initialized');
      return;
    }

    try {
      // Resume audio context on first interaction (required by browsers)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
        setAudioStarted(true);
      }

      // Get the notes for the chord
      const notes = MINOR_CHORD_NOTES[chord] || MAJOR_CHORD_NOTES[chord as MajorChord];
      if (!notes) {
        console.log('Missing notes for chord', chord);
        return;
      }

      console.log('Playing chord:', chord, notes);

      // Convert note names to frequencies and play them
      const noteFrequencies = notes.map(note => noteToFrequency(note));
      
      noteFrequencies.forEach(freq => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = freq;
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
      });
    } catch (err) {
      console.error('Error playing chord:', err);
    }
  };

  // Convert note name (e.g., "A3") to frequency in Hz
  const noteToFrequency = (note: string): number => {
    const noteMap: Record<string, number> = {
      'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
      'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
    };
    
    const match = note.match(/^([A-G]#?)(\d)$/);
    if (!match) return 440;
    
    const [, noteName, octaveStr] = match;
    const octave = parseInt(octaveStr);
    const noteIndex = noteMap[noteName];
    
    // A4 = 440 Hz
    const a4 = 440;
    const semitonesFromA4 = (octave - 4) * 12 + (noteIndex - 9);
    
    return a4 * Math.pow(2, semitonesFromA4 / 12);
  };

  const handleChordClick = (chord: string) => {
    // Play the sound
    playChord(chord);
    
    // Add to sequence if less than 4
    if (userSequence.length < 4) {
      setUserSequence([...userSequence, chord]);
    }
  };

  const handleClear = () => {
    setUserSequence([]);
  };

  const handleSubmit = async () => {
    if (userSequence.length !== 4) {
      alert('Please select 4 chords');
      return;
    }

    // Check if the sequence matches
    const isCorrect = userSequence.every((chord, i) => chord === correctSequence[i]);
    
    if (isCorrect) {
      setIsSubmitting(true);
      
      try {
        // Call API to award GUM and achievement
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (walletAddress) {
          headers['x-wallet-address'] = walletAddress;
        }

        const response = await fetch('/api/claim-hidden-riff', {
          method: 'POST',
          headers,
          body: JSON.stringify({ sequence: userSequence }),
        });

        const responseText = await response.text();
        console.log('API Response:', responseText);
        
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse response as JSON:', parseError);
          console.error('Response text:', responseText);
          alert('Error: Invalid response from server');
          return;
        }

        if (data.success) {
          alert(`🎸 Correct sequence! You unlocked the Overachiever achievement and earned ${data.gumEarned} GUM!`);
          onComplete?.({
            presetId: preset?.id || 'hidden-riff',
            perfect: true,
            misses: 0,
            ms: 0,
          });
          setUserSequence([]);
        } else {
          alert(data.message || 'Already claimed or error occurred');
        }
      } catch (error) {
        console.error('Error submitting:', error);
        alert('Error submitting. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('❌ Wrong sequence. Try again!');
      setUserSequence([]);
    }
  };

  return (
    <Shell>
      <AmpShell>
        {/* Amp Brand Label */}
        <div className="text-center mb-4">
          <div className="text-amber-600 font-bold text-sm tracking-widest" style={{ fontFamily: 'Courier New, monospace' }}>
            ★ VINTAGE RIFF MASTER ★
          </div>
        </div>

        {/* Speaker Mesh Area */}
        <VintageMesh>
          <div className="flex flex-col items-center gap-4">
            {/* Sequence Display - Show selected chords */}
            <SequenceDisplay>
              {[0, 1, 2, 3].map((index) => (
                <SequenceSlot key={index} filled={!!userSequence[index]}>
                  {userSequence[index] || '?'}
                </SequenceSlot>
              ))}
            </SequenceDisplay>

            {/* Chord Buttons - All 7 chords (A-G) */}
            <ChordGrid>
              {allChords.map((label, indexPosition) => (
                <ChordButton
                  key={label}
                  selected={userSequence.includes(label)}
                  onClick={() => handleChordClick(label)}
                  aria-label={`Play chord ${label}`}
                  title={`${indexPosition + 1}. ${label}`}
                  disabled={userSequence.length >= 4}
                >
                  {label}
                </ChordButton>
              ))}
            </ChordGrid>
          </div>
        </VintageMesh>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          <button
            className="px-5 py-3 rounded bg-gradient-to-b from-orange-600 to-orange-800 text-white font-bold hover:brightness-110 border-2 border-orange-900 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleClear}
            disabled={userSequence.length === 0}
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            ✗ CLEAR
          </button>
          <button
            className="px-5 py-3 rounded bg-gradient-to-b from-emerald-600 to-emerald-800 text-white font-bold hover:brightness-110 border-2 border-emerald-900 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={userSequence.length !== 4 || isSubmitting}
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            {isSubmitting ? '⏳ CHECKING...' : '✓ SUBMIT'}
          </button>
        </div>

        {/* Vintage Screws Decoration */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-gray-800 border border-gray-900 shadow-inner" />
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-gray-800 border border-gray-900 shadow-inner" />
        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-gray-800 border border-gray-900 shadow-inner" />
        <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-gray-800 border border-gray-900 shadow-inner" />
      </AmpShell>

      {/* Instructions */}
      <div className="text-center text-xs text-zinc-500 italic" style={{ fontFamily: 'Courier New, monospace' }}>
        Click 4 chords in sequence, then hit SUBMIT
      </div>
    </Shell>
  );
};

export default HiddenRiff;
