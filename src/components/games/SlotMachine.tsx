import { useState, useEffect, useRef, useCallback } from 'react';

// Slot machine symbols - classic bar theme
const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '🎰', '⭐'];

// Symbol weights (higher = more common)
const SYMBOL_WEIGHTS: { [key: string]: number } = {
  '🍒': 20,  // Most common
  '🍋': 18,
  '🍊': 16,
  '🍇': 14,
  '💎': 8,
  '7️⃣': 6,   // Lucky 7s are rare
  '🎰': 4,
  '⭐': 3,   // Jackpot star - rarest
};

// Payout table (multipliers)
const PAYOUTS: { [key: string]: number } = {
  '🍒🍒🍒': 5,
  '🍋🍋🍋': 8,
  '🍊🍊🍊': 10,
  '🍇🍇🍇': 15,
  '💎💎💎': 25,
  '7️⃣7️⃣7️⃣': 50,
  '🎰🎰🎰': 75,
  '⭐⭐⭐': 100,  // JACKPOT!
  // Two of a kind (any position)
  'PAIR': 2,
};

interface SlotMachineProps {
  onClose?: () => void;
  walletAddress?: string;
  gumBalance?: number;
  onGumChange?: (amount: number) => void;
}

const SlotMachine: React.FC<SlotMachineProps> = ({ 
  onClose, 
  walletAddress,
  gumBalance = 0,
  onGumChange 
}) => {
  const [reels, setReels] = useState<string[]>(['🎰', '🎰', '🎰']);
  const [spinning, setSpinning] = useState<boolean[]>([false, false, false]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [bet, setBet] = useState(10);
  const [lastWin, setLastWin] = useState(0);
  const [message, setMessage] = useState('Pull the lever to play!');
  const [spinCount, setSpinCount] = useState(0);
  
  // Audio refs
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);
  const jackpotSoundRef = useRef<HTMLAudioElement | null>(null);
  const leverSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize sounds
    spinSoundRef.current = new Audio('/sounds/slot-spin.mp3');
    winSoundRef.current = new Audio('/sounds/slot-win.mp3');
    jackpotSoundRef.current = new Audio('/sounds/jackpot.mp3');
    leverSoundRef.current = new Audio('/sounds/lever-pull.mp3');

    return () => {
      // Cleanup
      [spinSoundRef, winSoundRef, jackpotSoundRef, leverSoundRef].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current.currentTime = 0;
        }
      });
    };
  }, []);

  // Get random symbol based on weights
  const getRandomSymbol = useCallback(() => {
    const totalWeight = Object.values(SYMBOL_WEIGHTS).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (const [symbol, weight] of Object.entries(SYMBOL_WEIGHTS)) {
      random -= weight;
      if (random <= 0) return symbol;
    }
    return SYMBOLS[0];
  }, []);

  // Calculate win amount
  const calculateWin = useCallback((finalReels: string[]): { win: number; message: string } => {
    const combo = finalReels.join('');
    
    // Check for three of a kind
    if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
      const multiplier = PAYOUTS[combo] || 5;
      const winAmount = bet * multiplier;
      
      if (combo === '⭐⭐⭐') {
        return { win: winAmount, message: '🎉 JACKPOT!!! 🎉' };
      } else if (combo === '7️⃣7️⃣7️⃣') {
        return { win: winAmount, message: '🍀 LUCKY SEVENS! 🍀' };
      }
      return { win: winAmount, message: `🎊 THREE OF A KIND! Win ${winAmount} GUM!` };
    }
    
    // Check for pairs
    if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
      const winAmount = bet * PAYOUTS['PAIR'];
      return { win: winAmount, message: `✨ Pair! Win ${winAmount} GUM!` };
    }
    
    return { win: 0, message: 'No luck this time... Spin again!' };
  }, [bet]);

  // Spin the reels
  const spin = useCallback(async () => {
    if (isSpinning) return;
    
    // Check if player has enough GUM
    if (gumBalance < bet) {
      setMessage('❌ Not enough GUM! Get more at other locations.');
      return;
    }

    setIsSpinning(true);
    setLastWin(0);
    setSpinCount(prev => prev + 1);
    
    // Deduct bet
    onGumChange?.(-bet);
    
    // Play lever sound
    leverSoundRef.current?.play().catch(() => {});
    
    // Start all reels spinning
    setSpinning([true, true, true]);
    setMessage('Spinning...');
    
    // Play spin sound
    setTimeout(() => {
      spinSoundRef.current?.play().catch(() => {});
    }, 200);
    
    // Generate final results
    const finalReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    
    // Stop reels one by one with delays
    const stopReel = (index: number, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setReels(prev => {
            const newReels = [...prev];
            newReels[index] = finalReels[index];
            return newReels;
          });
          setSpinning(prev => {
            const newSpinning = [...prev];
            newSpinning[index] = false;
            return newSpinning;
          });
          resolve();
        }, delay);
      });
    };
    
    // Stagger the stops
    await stopReel(0, 1000);
    await stopReel(1, 1500);
    await stopReel(2, 2000);
    
    // Calculate winnings
    const result = calculateWin(finalReels);
    setLastWin(result.win);
    setMessage(result.message);
    
    if (result.win > 0) {
      onGumChange?.(result.win);
      if (result.win >= bet * 50) {
        jackpotSoundRef.current?.play().catch(() => {});
      } else {
        winSoundRef.current?.play().catch(() => {});
      }
    }
    
    setIsSpinning(false);
  }, [isSpinning, bet, gumBalance, onGumChange, getRandomSymbol, calculateWin]);

  // Reel animation styles
  const getReelStyle = (index: number, isSpinningReel: boolean) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '100px',
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)',
    borderRadius: '8px',
    border: '3px solid #ffd700',
    boxShadow: isSpinningReel 
      ? '0 0 20px #ffd700, inset 0 0 20px rgba(255, 215, 0, 0.3)' 
      : '0 0 10px rgba(255, 215, 0, 0.5)',
    fontSize: '48px',
    animation: isSpinningReel ? 'spin-blur 0.1s linear infinite' : 'none',
    transition: 'all 0.3s ease',
  });

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #1a0a0a 0%, #2d1810 50%, #1a0a0a 100%)',
        minHeight: '500px',
      }}
    >
      {/* Slot Machine Frame */}
      <div 
        className="relative p-6 rounded-2xl"
        style={{
          background: 'linear-gradient(180deg, #8B4513 0%, #654321 50%, #3d2817 100%)',
          border: '8px solid #ffd700',
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.5), inset 0 0 30px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Title */}
        <div 
          className="text-center mb-4"
          style={{
            fontFamily: 'Cooper Black, Georgia, serif',
            fontSize: '24px',
            color: '#ffd700',
            textShadow: '2px 2px 4px #000, 0 0 10px #ffd700',
          }}
        >
          🎰 LUCKY SLOTS 🎰
        </div>

        {/* Reels Container */}
        <div 
          className="flex gap-2 p-4 rounded-lg mb-4"
          style={{
            background: '#0a0a0a',
            border: '4px solid #333',
            boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8)',
          }}
        >
          {reels.map((symbol, index) => (
            <div key={index} style={getReelStyle(index, spinning[index])}>
              <span style={{ 
                filter: spinning[index] ? 'blur(2px)' : 'none',
                animation: spinning[index] ? 'symbol-flash 0.1s linear infinite' : 'none',
              }}>
                {spinning[index] ? SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] : symbol}
              </span>
            </div>
          ))}
        </div>

        {/* Message Display */}
        <div 
          className="text-center p-3 rounded-lg mb-4"
          style={{
            background: '#000',
            border: '2px solid #ffd700',
            color: lastWin > 0 ? '#00ff00' : '#ffd700',
            fontFamily: 'monospace',
            fontSize: '14px',
            minHeight: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textShadow: lastWin > 0 ? '0 0 10px #00ff00' : 'none',
          }}
        >
          {message}
        </div>

        {/* Bet Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => setBet(Math.max(5, bet - 5))}
            disabled={isSpinning}
            className="px-4 py-2 rounded-lg font-bold"
            style={{
              background: 'linear-gradient(180deg, #ff4444 0%, #cc0000 100%)',
              border: '2px solid #ff6666',
              color: 'white',
              opacity: isSpinning ? 0.5 : 1,
            }}
          >
            -5
          </button>
          <div 
            className="px-6 py-2 rounded-lg text-center"
            style={{
              background: '#000',
              border: '2px solid #ffd700',
              color: '#ffd700',
              fontFamily: 'monospace',
              minWidth: '100px',
            }}
          >
            BET: {bet} GUM
          </div>
          <button
            onClick={() => setBet(Math.min(100, bet + 5))}
            disabled={isSpinning}
            className="px-4 py-2 rounded-lg font-bold"
            style={{
              background: 'linear-gradient(180deg, #44ff44 0%, #00cc00 100%)',
              border: '2px solid #66ff66',
              color: 'white',
              opacity: isSpinning ? 0.5 : 1,
            }}
          >
            +5
          </button>
        </div>

        {/* GUM Balance */}
        <div 
          className="text-center mb-4 p-2 rounded"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            color: '#ffd700',
            fontFamily: 'monospace',
          }}
        >
          💰 Balance: {gumBalance} GUM
        </div>

        {/* Spin Button / Lever */}
        <button
          onClick={spin}
          disabled={isSpinning || gumBalance < bet}
          className="w-full py-4 rounded-xl font-black text-xl transition-all duration-300"
          style={{
            background: isSpinning 
              ? 'linear-gradient(180deg, #555 0%, #333 100%)'
              : 'linear-gradient(180deg, #ff6b35 0%, #f7931e 50%, #ff6b35 100%)',
            border: '4px solid #ffd700',
            color: 'white',
            fontFamily: 'Cooper Black, Georgia, serif',
            boxShadow: isSpinning 
              ? 'none' 
              : '0 0 20px rgba(255, 107, 53, 0.5), 0 5px 0 #cc5500',
            transform: isSpinning ? 'translateY(5px)' : 'none',
            cursor: isSpinning || gumBalance < bet ? 'not-allowed' : 'pointer',
            opacity: gumBalance < bet ? 0.5 : 1,
          }}
        >
          {isSpinning ? '🎰 SPINNING...' : '🎰 PULL LEVER 🎰'}
        </button>

        {/* Payout Table (collapsible) */}
        <details className="mt-4">
          <summary 
            className="cursor-pointer text-center"
            style={{ color: '#ffd700', fontFamily: 'Cooper Black, Georgia, serif' }}
          >
            📋 Payout Table
          </summary>
          <div 
            className="mt-2 p-3 rounded-lg text-sm"
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              border: '1px solid #ffd700',
              color: '#fff',
            }}
          >
            <div className="grid grid-cols-2 gap-1">
              <div>⭐⭐⭐ = 100x</div>
              <div>🎰🎰🎰 = 75x</div>
              <div>7️⃣7️⃣7️⃣ = 50x</div>
              <div>💎💎💎 = 25x</div>
              <div>🍇🍇🍇 = 15x</div>
              <div>🍊🍊🍊 = 10x</div>
              <div>🍋🍋🍋 = 8x</div>
              <div>🍒🍒🍒 = 5x</div>
              <div className="col-span-2">Any Pair = 2x</div>
            </div>
          </div>
        </details>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes spin-blur {
          0% { transform: translateY(-10px); }
          50% { transform: translateY(10px); }
          100% { transform: translateY(-10px); }
        }
        @keyframes symbol-flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default SlotMachine;
