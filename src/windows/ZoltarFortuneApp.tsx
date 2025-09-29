import React, { useState, useCallback, useEffect } from 'react';
import { useGum } from '../contexts/GumContext';
import { useAuth } from '../contexts/AuthContext';

interface GameResult {
  isWinner: boolean;
  payout: number;
  message: string;
}

const ZoltarFortuneApp = () => {
  const { balance, spendGum, earnGum } = useGum();
  const { walletAddress } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [gameStats, setGameStats] = useState({
    totalPlays: 0,
    totalWins: 0,
    totalSpent: 0,
    totalWon: 0
  });
  
  const PLAY_COST = 10;
  const WIN_PAYOUT = 250;
  const WIN_CHANCE = 1 / 30; // 3.33% chance (good house edge!)

  // Mystical fortunes for different outcomes
  const winMessages = [
    "🔮 The spirits smile upon you! Fortune favors the bold!",
    "✨ The cosmic forces align! Great wealth awaits you!",
    "🌟 The ancient prophecy comes true! You are chosen!",
    "💫 Destiny has spoken! The universe rewards your courage!",
    "🎭 The fates have decided! Victory is yours, brave soul!",
    "🏆 The mystical energies converge! You have been blessed!",
    "⭐ The stars dance in celebration of your triumph!",
    "🌙 The moon goddess bestows her favor upon you!"
  ];

  const loseMessages = [
    "🔮 The mists are cloudy today... but tomorrow brings new hope!",
    "✨ The spirits whisper: 'Patience, young seeker...'",
    "🌙 Not all who wander are lost. Try again when the moon is full!",
    "⭐ The stars are not aligned... but they will be soon!",
    "🎭 Even the greatest fortune tellers cannot always see clearly...",
    "🌫️ The crystal ball shows... shadows. But light will come!",
    "🦉 The wise owl says: 'Knowledge comes to those who persist.'",
    "🍀 Your luck builds with each attempt. The spirits take notice..."
  ];

  // Load game stats from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && walletAddress) {
      const savedStats = localStorage.getItem(`zoltar_stats_${walletAddress}`);
      if (savedStats) {
        setGameStats(JSON.parse(savedStats));
      }
    }
  }, [walletAddress]);

  // Save game stats to localStorage
  const updateStats = useCallback((newStats: typeof gameStats) => {
    if (typeof window !== 'undefined' && walletAddress) {
      localStorage.setItem(`zoltar_stats_${walletAddress}`, JSON.stringify(newStats));
      setGameStats(newStats);
    }
  }, [walletAddress]);

  // Generate secure random outcome
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
      const spendResult = await spendGum(PLAY_COST, 'zoltar_fortune_app', {
        game: 'zoltar_standalone',
        timestamp: new Date().toISOString(),
        cost: PLAY_COST
      });

      if (!spendResult.success) {
        alert(`🔮 The spirits reject your offering: ${spendResult.error}`);
        setIsPlaying(false);
        setIsAnimating(false);
        return;
      }

      // Update stats
      const newStats = {
        ...gameStats,
        totalPlays: gameStats.totalPlays + 1,
        totalSpent: gameStats.totalSpent + PLAY_COST
      };

      // Generate the game outcome
      const outcome = generateOutcome();
      
      // Animate for dramatic effect
      setTimeout(async () => {
        setGameResult(outcome);
        setIsAnimating(false);
        setShowResult(true);

        // If they won, award the payout and update stats
        if (outcome.isWinner) {
          try {
            await earnGum('zoltar_fortune_app_win', {
              game: 'zoltar_standalone',
              win_amount: outcome.payout,
              timestamp: new Date().toISOString()
            });
            
            newStats.totalWins = gameStats.totalWins + 1;
            newStats.totalWon = gameStats.totalWon + outcome.payout;
          } catch (error) {
            console.error('Error awarding zoltar winnings:', error);
          }
        }

        updateStats(newStats);

        // Reset after showing result
        setTimeout(() => {
          setIsPlaying(false);
          setShowResult(false);
          setGameResult(null);
        }, 6000);
      }, 3500); // 3.5 second dramatic pause

    } catch (error) {
      console.error('Error playing Zoltar:', error);
      setIsPlaying(false);
      setIsAnimating(false);
      alert('🔮 The mystical forces are disrupted! Please try again.');
    }
  };

  const winRate = gameStats.totalPlays > 0 ? ((gameStats.totalWins / gameStats.totalPlays) * 100).toFixed(1) : '0.0';
  const netProfit = gameStats.totalWon - gameStats.totalSpent;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1a0033, #330066, #4B0082, #8B008B, #1a0033)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '20px',
      minHeight: '600px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Creepster', 'Chiller', 'Papyrus', cursive"
    }}>
      {/* Mystical Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
          linear-gradient(45deg, transparent 40%, rgba(255, 69, 180, 0.05) 50%, transparent 60%)
        `,
        animation: isAnimating ? 'mysticalPulse 3s ease-in-out infinite' : 'none'
      }} />

      {/* Floating Stars */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            fontSize: `${8 + Math.random() * 8}px`,
            color: '#FFD700',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `starTwinkle ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`,
            textShadow: '0 0 10px rgba(255,215,0,0.8)',
            pointerEvents: 'none'
          }}
        >
          ✨
        </div>
      ))}

      {/* Zoltar Image Container */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        marginBottom: '20px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          background: 'linear-gradient(145deg, #8B4513, #DAA520, #FFD700, #DAA520, #8B4513)',
          padding: '15px',
          borderRadius: '20px',
          border: '3px solid #FFD700',
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(139, 69, 19, 0.3)',
          position: 'relative'
        }}>
          {/* Ornate Corner Decorations */}
          <div style={{ position: 'absolute', top: '-5px', left: '-5px', fontSize: '20px', color: '#FFD700' }}>✦</div>
          <div style={{ position: 'absolute', top: '-5px', right: '-5px', fontSize: '20px', color: '#FFD700' }}>✦</div>
          <div style={{ position: 'absolute', bottom: '-5px', left: '-5px', fontSize: '20px', color: '#FFD700' }}>✦</div>
          <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', fontSize: '20px', color: '#FFD700' }}>✦</div>
          
          <img
            src="/images/zoltar/zoltar-background.png"
            alt="Zoltar Fortune Teller"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '15px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          />
        </div>
      </div>

      {/* Mystical Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
        zIndex: 10
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #FFD700, #FF1493, #9370DB, #FFD700)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          marginBottom: '5px',
          fontFamily: "'Creepster', 'Chiller', serif",
          letterSpacing: '2px'
        }}>
          ☾ THE GREAT ZOLTAR ☽
        </h1>
        <p style={{
          color: '#E6E6FA',
          fontSize: '16px',
          fontStyle: 'italic',
          textShadow: '0 0 10px rgba(230,230,250,0.8)',
          fontFamily: "'Papyrus', serif"
        }}>
          🔮 Mystic Oracle of Destiny 🔮
        </p>
      </div>

      {/* Main Zoltar Machine */}
      <div style={{
        position: 'relative',
        width: '400px',
        height: '500px',
        margin: '20px auto',
        zIndex: 10
      }}>
        {/* Machine Frame */}
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(145deg, #8B4513, #A0522D, #CD853F)',
          border: '6px solid #FFD700',
          borderRadius: '30px 30px 15px 15px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.7), inset 0 0 30px rgba(255,215,0,0.3)',
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
              'radial-gradient(circle, rgba(255,215,0,0.5) 0%, transparent 70%)' :
              'transparent',
            animation: isAnimating ? 'pulse 1.5s ease-in-out infinite' : 'none'
          }} />

          {/* Crystal Ball Area */}
          <div style={{
            position: 'absolute',
            top: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: isAnimating ?
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(138,43,226,0.7), rgba(75,0,130,0.9))' :
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), rgba(138,43,226,0.5), rgba(75,0,130,0.7))',
            border: '4px solid #FFD700',
            boxShadow: isAnimating ?
              '0 0 40px rgba(138,43,226,1), inset 0 0 30px rgba(255,255,255,0.4)' :
              '0 0 20px rgba(138,43,226,0.6), inset 0 0 25px rgba(255,255,255,0.3)',
            animation: isAnimating ? 'crystalGlow 2.5s ease-in-out infinite' : 'none'
          }}>
            {/* Mystical swirls inside crystal ball */}
            <div style={{
              position: 'absolute',
              top: '25%',
              left: '25%',
              right: '25%',
              bottom: '25%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: isAnimating ? 'spin 4s linear infinite' : 'none'
            }} />
          </div>

          {/* Zoltar's Eyes */}
          <div style={{
            position: 'absolute',
            top: '240px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '50px'
          }}>
            <div style={{
              width: '25px',
              height: '25px',
              borderRadius: '50%',
              background: isAnimating ?
                'radial-gradient(circle, #FFD700, #FF6B6B)' :
                'radial-gradient(circle, #FF4500, #8B0000)',
              boxShadow: '0 0 15px rgba(255,69,0,0.9)',
              animation: isAnimating ? 'eyeGlow 2s ease-in-out infinite' : 'none'
            }} />
            <div style={{
              width: '25px',
              height: '25px',
              borderRadius: '50%',
              background: isAnimating ?
                'radial-gradient(circle, #FFD700, #FF6B6B)' :
                'radial-gradient(circle, #FF4500, #8B0000)',
              boxShadow: '0 0 15px rgba(255,69,0,0.9)',
              animation: isAnimating ? 'eyeGlow 2s ease-in-out infinite 0.7s' : 'none'
            }} />
          </div>

      {/* Mystical Fortune Button */}
      <div style={{
        background: 'linear-gradient(145deg, #4B0082, #8B008B, #9400D3, #8B008B, #4B0082)',
        padding: '20px',
        borderRadius: '25px',
        border: '3px solid #FFD700',
        boxShadow: '0 0 30px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(75, 0, 130, 0.8)',
        marginBottom: '20px',
        position: 'relative',
        maxWidth: '400px',
        width: '100%'
      }}>
        {/* Ornate Mystical Border */}
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '24px',
          color: '#FFD700',
          textShadow: '0 0 10px rgba(255, 215, 0, 0.8)'
        }}>
          ⚜️
        </div>
        
        <button
          onClick={playGame}
          disabled={isPlaying || balance < PLAY_COST}
          style={{
            width: '100%',
            height: '70px',
            background: isPlaying ?
              'linear-gradient(45deg, #666, #999, #666)' :
              'linear-gradient(45deg, #FFD700, #FFA500, #FF6347, #FFA500, #FFD700)',
            border: '3px solid #8B4513',
            borderRadius: '35px',
            color: isPlaying ? '#ccc' : '#8B0000',
            fontWeight: 'bold',
            fontSize: '18px',
            fontFamily: "'Creepster', 'Chiller', serif",
            cursor: isPlaying ? 'not-allowed' : 'pointer',
            boxShadow: isPlaying ?
              'inset 0 4px 12px rgba(0,0,0,0.6)' :
              '0 8px 25px rgba(255,140,0,0.8), inset 0 3px 8px rgba(255,255,255,0.6)',
            transition: 'all 0.4s ease',
            textShadow: isPlaying ? 'none' : '2px 2px 4px rgba(0,0,0,0.8)',
            letterSpacing: '1px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isPlaying ? 
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' :
              'none',
            animation: isPlaying ? 'shimmer 2s ease-in-out infinite' : 'none'
          }} />
          <span style={{ position: 'relative', zIndex: 1 }}>
            {isPlaying ? '🔮 THE SPIRITS WHISPER...' : `✨ DIVINE YOUR FORTUNE ✨`}
          </span>
        </button>
        
        <div style={{
          textAlign: 'center',
          marginTop: '10px',
          color: '#E6E6FA',
          fontSize: '14px',
          fontStyle: 'italic',
          fontFamily: "'Papyrus', serif"
        }}>
          ⭐ Cost: {PLAY_COST} GUM • Fortune Awaits: {WIN_PAYOUT} GUM ⭐
        </div>
      </div>

          {/* Game Result Display */}
          {showResult && gameResult && (
            <div style={{
              position: 'absolute',
              top: '290px',
              left: '15px',
              right: '15px',
              background: 'rgba(0,0,0,0.9)',
              color: gameResult.isWinner ? '#FFD700' : '#FF69B4',
              padding: '20px',
              borderRadius: '15px',
              border: `3px solid ${gameResult.isWinner ? '#FFD700' : '#FF69B4'}`,
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              animation: 'fadeIn 0.7s ease-in-out',
              boxShadow: `0 0 20px ${gameResult.isWinner ? 'rgba(255,215,0,0.5)' : 'rgba(255,105,180,0.5)'}`
            }}>
              {gameResult.isWinner && (
                <div style={{ fontSize: '20px', marginBottom: '10px' }}>
                  🎉 FORTUNE FAVORS YOU! 🎉<br />
                  +{gameResult.payout} GUM!
                </div>
              )}
              <div style={{ lineHeight: '1.4' }}>{gameResult.message}</div>
            </div>
          )}
        </div>
      </div>

      {/* Game Statistics Panel */}
      <div style={{
        background: 'rgba(0,0,0,0.7)',
        border: '2px solid #FFD700',
        borderRadius: '15px',
        padding: '20px',
        margin: '20px',
        textAlign: 'center',
        minWidth: '300px',
        zIndex: 10
      }}>
        <h3 style={{ color: '#FFD700', marginBottom: '15px', fontSize: '18px' }}>
          📊 Your Mystical Journey
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', color: '#E6E6FA' }}>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Games Played</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{gameStats.totalPlays}</div>
          </div>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Win Rate</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: gameStats.totalWins > 0 ? '#00ff00' : '#ffffff' }}>
              {winRate}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Total Spent</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff6666' }}>
              {gameStats.totalSpent} GUM
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Net Result</div>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: netProfit >= 0 ? '#00ff00' : '#ff6666' 
            }}>
              {netProfit >= 0 ? '+' : ''}{netProfit} GUM
            </div>
          </div>
        </div>
      </div>

      {/* Balance Display */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.8)',
        color: '#FFD700',
        padding: '10px 20px',
        borderRadius: '25px',
        fontSize: '16px',
        fontWeight: 'bold',
        border: '2px solid #FFD700',
        zIndex: 100
      }}>
        💰 {balance.toLocaleString()} GUM
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes mysticalPulse {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.02);
          }
        }

        @keyframes starTwinkle {
          0%, 100% { 
            opacity: 0.4;
            transform: scale(0.8) rotate(0deg);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }

        @keyframes crystalGlow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(138,43,226,0.6), inset 0 0 25px rgba(255,255,255,0.3);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 60px rgba(138,43,226,1.2), inset 0 0 40px rgba(255,255,255,0.6);
            transform: scale(1.08);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes eyeGlow {
          0%, 100% { 
            box-shadow: 0 0 15px rgba(255,69,0,0.9);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(255,215,0,1.5);
            transform: scale(1.3);
          }
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        button:hover:not(:disabled) {
          transform: scale(1.05) !important;
          box-shadow: 0 12px 35px rgba(255,140,0,1.0), inset 0 3px 8px rgba(255,255,255,0.7) !important;
        }
      `}</style>
    </div>
  );
};

export default ZoltarFortuneApp;