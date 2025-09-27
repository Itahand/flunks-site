import React, { useState, useCallback, useEffect } from 'react';
import { useGum } from '../contexts/GumContext';
import { useAuth } from '../contexts/AuthContext';

interface ZoltarMachineProps {
  className?: string;
  style?: React.CSSProperties;
}

interface GameResult {
  isWinner: boolean;
  payout: number;
  message: string;
}

const ZoltarMachine: React.FC<ZoltarMachineProps> = ({ className, style }) => {
  const { balance, spendGum, earnGum } = useGum();
  const { walletAddress } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const PLAY_COST = 10;
  const WIN_PAYOUT = 250;
  const WIN_CHANCE = 1 / 30; // 3.33% chance (good house edge!)

  // Mystical fortunes for different outcomes
  const winMessages = [
    "🔮 The spirits smile upon you! Fortune favors the bold!",
    "✨ The cosmic forces align! Great wealth awaits you!",
    "🌟 The ancient prophecy comes true! You are chosen!",
    "💫 Destiny has spoken! The universe rewards your courage!",
    "🎭 The fates have decided! Victory is yours, brave soul!"
  ];

  const loseMessages = [
    "🔮 The mists are cloudy today... but tomorrow brings new hope!",
    "✨ The spirits whisper: 'Patience, young seeker...'",
    "🌙 Not all who wander are lost. Try again when the moon is full!",
    "⭐ The stars are not aligned... but they will be soon!",
    "🎭 Even the greatest fortune tellers cannot always see clearly..."
  ];

  // Generate secure random outcome (this should be server-side in production!)
  const generateOutcome = useCallback((): GameResult => {
    // Use crypto.getRandomValues for better randomness
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);
    const random = randomArray[0] / (0xFFFFFFFF + 1);
    
    const isWinner = random < WIN_CHANCE;
    
    if (isWinner) {
      return {
        isWinner: true,
        payout: WIN_PAYOUT,
        message: winMessages[Math.floor(Math.random() * winMessages.length)]
      };
    } else {
      return {
        isWinner: false,
        payout: 0,
        message: loseMessages[Math.floor(Math.random() * loseMessages.length)]
      };
    }
  }, []);

  const playGame = async () => {
    if (!walletAddress) {
      alert('🔮 The spirits require you to connect your mystic wallet first!');
      return;
    }

    if (balance < PLAY_COST) {
      alert(`🔮 You need at least ${PLAY_COST} GUM to consult the mystical Zoltar!`);
      return;
    }

    if (isPlaying) return;

    setIsPlaying(true);
    setGameResult(null);
    setShowResult(false);
    setIsAnimating(true);

    try {
      // First, deduct the cost
      const spendResult = await spendGum(PLAY_COST, 'zoltar_fortune_machine', {
        game: 'zoltar',
        timestamp: new Date().toISOString(),
        cost: PLAY_COST
      });

      if (!spendResult.success) {
        alert(`🔮 The spirits reject your offering: ${spendResult.error}`);
        setIsPlaying(false);
        setIsAnimating(false);
        return;
      }

      // Generate the game outcome
      const outcome = generateOutcome();
      
      // Animate for dramatic effect
      setTimeout(async () => {
        setGameResult(outcome);
        setIsAnimating(false);
        setShowResult(true);

        // If they won, award the payout
        if (outcome.isWinner) {
          try {
            await earnGum('zoltar_fortune_machine_win', {
              game: 'zoltar',
              win_amount: outcome.payout,
              timestamp: new Date().toISOString()
            });
          } catch (error) {
            console.error('Error awarding zoltar winnings:', error);
          }
        }

        // Reset after showing result
        setTimeout(() => {
          setIsPlaying(false);
          setShowResult(false);
          setGameResult(null);
        }, 5000);
      }, 3000); // 3 second dramatic pause

    } catch (error) {
      console.error('Error playing Zoltar:', error);
      setIsPlaying(false);
      setIsAnimating(false);
      alert('🔮 The mystical forces are disrupted! Please try again.');
    }
  };

  return (
    <div 
      className={`zoltar-machine ${className || ''}`}
      style={{
        position: 'relative',
        width: '300px',
        height: '400px',
        margin: '20px auto',
        ...style
      }}
    >
      {/* Machine Frame */}
      <div style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(145deg, #8B4513, #A0522D, #CD853F)',
        border: '4px solid #FFD700',
        borderRadius: '20px 20px 10px 10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,215,0,0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Mystical Glow Effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isAnimating ? 
            'radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)' :
            'transparent',
          animation: isAnimating ? 'pulse 1s ease-in-out infinite' : 'none'
        }} />

        {/* Crystal Ball Area */}
        <div style={{
          position: 'absolute',
          top: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: isAnimating ?
            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(138,43,226,0.6), rgba(75,0,130,0.8))' :
            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(138,43,226,0.4), rgba(75,0,130,0.6))',
          border: '3px solid #FFD700',
          boxShadow: isAnimating ?
            '0 0 30px rgba(138,43,226,0.8), inset 0 0 20px rgba(255,255,255,0.3)' :
            '0 0 15px rgba(138,43,226,0.5), inset 0 0 20px rgba(255,255,255,0.3)',
          animation: isAnimating ? 'crystalGlow 2s ease-in-out infinite' : 'none'
        }}>
          {/* Mystical swirls inside crystal ball */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            right: '20%',
            bottom: '20%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: isAnimating ? 'spin 3s linear infinite' : 'none'
          }} />
        </div>

        {/* Zoltar's Eyes */}
        <div style={{
          position: 'absolute',
          top: '180px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '40px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: isAnimating ?
              'radial-gradient(circle, #FFD700, #FF6B6B)' :
              'radial-gradient(circle, #FF4500, #8B0000)',
            boxShadow: '0 0 10px rgba(255,69,0,0.8)',
            animation: isAnimating ? 'eyeGlow 1.5s ease-in-out infinite' : 'none'
          }} />
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: isAnimating ?
              'radial-gradient(circle, #FFD700, #FF6B6B)' :
              'radial-gradient(circle, #FF4500, #8B0000)',
            boxShadow: '0 0 10px rgba(255,69,0,0.8)',
            animation: isAnimating ? 'eyeGlow 1.5s ease-in-out infinite 0.5s' : 'none'
          }} />
        </div>

        {/* Play Button */}
        <button
          onClick={playGame}
          disabled={isPlaying || balance < PLAY_COST}
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '140px',
            height: '50px',
            background: isPlaying ?
              'linear-gradient(45deg, #666, #999)' :
              'linear-gradient(45deg, #FFD700, #FFA500, #FF8C00)',
            border: 'none',
            borderRadius: '25px',
            color: isPlaying ? '#ccc' : '#8B0000',
            fontWeight: 'bold',
            fontSize: '14px',
            fontFamily: 'serif',
            cursor: isPlaying ? 'not-allowed' : 'pointer',
            boxShadow: isPlaying ?
              'inset 0 2px 5px rgba(0,0,0,0.3)' :
              '0 5px 15px rgba(255,140,0,0.5), inset 0 1px 3px rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          {isPlaying ? '🔮 CONSULTING...' : `🔮 PLAY (${PLAY_COST} GUM)`}
        </button>

        {/* Game Result Display */}
        {showResult && gameResult && (
          <div style={{
            position: 'absolute',
            top: '220px',
            left: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: gameResult.isWinner ? '#FFD700' : '#FF69B4',
            padding: '15px',
            borderRadius: '10px',
            border: `2px solid ${gameResult.isWinner ? '#FFD700' : '#FF69B4'}`,
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            animation: 'fadeIn 0.5s ease-in-out'
          }}>
            {gameResult.isWinner && (
              <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                🎉 YOU WON {gameResult.payout} GUM! 🎉
              </div>
            )}
            <div>{gameResult.message}</div>
          </div>
        )}

        {/* Balance Display */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.7)',
          color: '#FFD700',
          padding: '5px 10px',
          borderRadius: '15px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          💰 {balance} GUM
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        @keyframes crystalGlow {
          0%, 100% { 
            box-shadow: 0 0 15px rgba(138,43,226,0.5), inset 0 0 20px rgba(255,255,255,0.3);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 40px rgba(138,43,226,1), inset 0 0 30px rgba(255,255,255,0.5);
            transform: scale(1.05);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes eyeGlow {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(255,69,0,0.8);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 20px rgba(255,215,0,1);
            transform: scale(1.2);
          }
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .zoltar-machine:hover button:not(:disabled) {
          transform: translateX(-50%) scale(1.05);
          box-shadow: 0 8px 20px rgba(255,140,0,0.7), inset 0 1px 3px rgba(255,255,255,0.4);
        }
      `}</style>
    </div>
  );
};

export default ZoltarMachine;