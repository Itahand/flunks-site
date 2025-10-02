import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useGum } from '../contexts/GumContext';
import { useAuth } from '../contexts/AuthContext';

interface GameResult {
  isWinner: boolean;
  payout: number;
  message: string;
}

const ZoltarFortuneApp: React.FC = () => {
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const PLAY_COST = 10;
  const WIN_PAYOUT = 250;
  const WIN_CHANCE = 1 / 30;

  // Play background music when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/zoltar.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(err => {
        console.log('Audio autoplay prevented:', err);
      });
    }

    // Cleanup: stop music when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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

  const winMessages = [
    "The spirits smile upon you! Fortune favors the bold! Your lucky numbers: 3, 7, 9, 1",
    "The cosmic forces align! Great wealth awaits you! Your lucky numbers: 2, 5, 8, 4",
    "The ancient prophecy comes true! You are chosen! Your lucky numbers: 1, 6, 3, 9",
    "Destiny has spoken! The universe rewards your courage! Your lucky numbers: 4, 8, 2, 7",
    "The fates have decided! Victory is yours, brave soul! Your lucky numbers: 5, 1, 6, 3"
  ];

  const loseMessages = [
    "The mists are cloudy today... but tomorrow brings new hope!",
    "The spirits whisper: Patience, young seeker...",
    "Not all who wander are lost. Try again when the moon is full!",
    "The stars are not aligned... but they will be soon!",
    "Even the greatest fortune tellers cannot always see clearly...",
    "The crystal ball shows shadows... your fortune hides in the fog.",
    "The ancient ones speak, but their words are veiled in mystery.",
    "Your destiny awaits, dear soul, but not at this moment in time.",
    "The winds of fate blow in strange directions... patience is key.",
    "The cards have been drawn, but they tell of a journey not yet complete.",
    "The moon waxes, the moon wanes... your time shall come again.",
    "I see great things ahead, but first you must walk through darkness.",
    "The spirits are restless tonight... they cannot reveal what is hidden.",
    "Your path is shrouded, but fear not, for light always returns.",
    "The cosmic wheel turns slowly... fortune will smile upon you soon.",
    "The tea leaves swirl and dance, but their message remains unclear.",
    "Your aura shimmers with potential... it merely needs time to bloom.",
    "The oracle has spoken: Not yet, but very soon, child of destiny.",
    "I gaze into the void and see... more attempts shall bring clarity.",
    "The spirits test your resolve... prove your worth and try again.",
    "Your fortune sleeps beneath the surface... it shall awaken in time.",
    "The ancient runes speak of patience... your reward lies just ahead.",
    "The celestial bodies whisper secrets... but today they remain silent.",
    "I see threads of gold in your future... they are not ready to shine.",
    "The mystical forces are gathering... but they need more time to align.",
    "Your chakras are clouded... cleanse your spirit and return to me.",
    "The pendulum swings, but it has not reached its peak yet.",
    "The universe works in mysterious ways... trust the journey, seeker.",
    "The flames dance and flicker... they show promise, but not today.",
    "Your third eye opens slowly... with each visit, you see more clearly.",
    "The spirits smile, but they ask you to prove your dedication first.",
    "The wheel of fortune spins endlessly... your number will come up soon.",
    "The ancestors watch over you... they say: one more time, brave soul.",
    "Your energy flows with the river of fate... it has not reached the sea.",
    "The mystical energies retreat... but they shall return stronger for you."
  ];

  const generateOutcome = useCallback((): GameResult => {
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
      alert('The spirits require you to connect your mystic wallet first!');
      return;
    }

    if (balance < PLAY_COST) {
      alert(`You need at least ${PLAY_COST} GUM to consult the mystical Zoltar!`);
      return;
    }

    if (isPlaying) return;

    setIsPlaying(true);
    setGameResult(null);
    setShowResult(false);
    setIsAnimating(true);

    try {
      const spendResult = await spendGum(PLAY_COST, 'zoltar_fortune_machine', {
        game: 'zoltar',
        timestamp: new Date().toISOString(),
        cost: PLAY_COST
      });

      if (!spendResult.success) {
        alert(`The spirits reject your offering: ${spendResult.error}`);
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

      const outcome = generateOutcome();
      
      setTimeout(async () => {
        setGameResult(outcome);
        setIsAnimating(false);
        setShowResult(true);

        if (outcome.isWinner) {
          try {
            await earnGum('zoltar_fortune_machine_win', {
              game: 'zoltar',
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

        setTimeout(() => {
          setIsPlaying(false);
          setShowResult(false);
          setGameResult(null);
        }, 5000);
      }, 3000);

    } catch (error) {
      console.error('Error playing Zoltar:', error);
      setIsPlaying(false);
      setIsAnimating(false);
      alert('The mystical forces are disrupted! Please try again.');
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { 
              box-shadow: 0 0 40px rgba(138,43,226,0.8), inset 0 0 30px rgba(255,255,255,0.4);
            }
            50% { 
              box-shadow: 0 0 60px rgba(138,43,226,1), inset 0 0 40px rgba(255,255,255,0.6);
            }
          }
          
          @keyframes fadeIn {
            from { 
              opacity: 0;
            }
            to { 
              opacity: 1;
            }
          }
          
          /* Mobile responsive styles */
          @media (max-width: 768px) {
            .zoltar-crystal-ball {
              width: 180px !important;
              height: 180px !important;
              font-size: 90px !important;
              margin-bottom: 40px !important;
            }
            
            .zoltar-gum-display {
              font-size: 22px !important;
              padding: 8px 20px !important;
            }
            
            .zoltar-button {
              width: 90% !important;
              max-width: 350px !important;
              height: 80px !important;
              font-size: 16px !important;
            }
            
            .zoltar-message-box {
              padding: 30px 20px !important;
              font-size: 16px !important;
            }
            
            .zoltar-win-text {
              font-size: 32px !important;
            }
            
            .zoltar-message-text {
              font-size: 16px !important;
            }
          }
        `}
      </style>
      
      {/* Dramatic Overlay for Messages - Appears on TOP with dimmed background */}
      {showResult && gameResult && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.5s ease-out',
          pointerEvents: 'none'
        }}>
          <div 
            className="zoltar-message-box"
            style={{
            background: gameResult.isWinner 
              ? 'linear-gradient(135deg, rgba(255,215,0,0.95), rgba(255,165,0,0.95))'
              : 'linear-gradient(135deg, rgba(139,0,139,0.95), rgba(75,0,130,0.95))',
            color: gameResult.isWinner ? '#000' : '#FFF',
            padding: '50px 60px',
            borderRadius: '30px',
            border: `6px solid ${gameResult.isWinner ? '#FFD700' : '#FF69B4'}`,
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: gameResult.isWinner 
              ? '0 0 60px rgba(255,215,0,1), inset 0 0 30px rgba(255,255,255,0.3)'
              : '0 0 60px rgba(255,105,180,1), inset 0 0 30px rgba(255,255,255,0.2)',
            maxWidth: '90%',
            width: '600px',
            animation: 'fadeIn 0.5s ease-out',
            margin: '0 auto'
          }}>
            {gameResult.isWinner && (
              <div 
                className="zoltar-win-text"
                style={{ 
                fontSize: '48px', 
                marginBottom: '20px', 
                textShadow: '0 0 20px rgba(255,215,0,0.8)',
                animation: 'pulse 1s ease-in-out infinite'
              }}>
                ✨ YOU WON {gameResult.payout} GUM! ✨
              </div>
            )}
            <div 
              className="zoltar-message-text"
              style={{ 
              fontFamily: "'Papyrus', serif", 
              lineHeight: '1.8', 
              fontSize: '20px',
              textShadow: gameResult.isWinner ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.5)'
            }}>
              {gameResult.message}
            </div>
          </div>
        </div>
      )}
      
      <div style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #1a0033, #330066, #1a0033)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '20px',
        minHeight: '600px',
        position: 'relative',
        overflow: 'auto'
      }}>
      {/* Zoltar Image at the top */}
      <div style={{
        width: '100%',
        maxWidth: '500px',
        marginBottom: '30px',
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
            src="/images/backdrops/zoltar-background.png"
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
        marginBottom: '30px',
        zIndex: 10
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #FFD700, #FF1493, #9370DB, #FFD700)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          marginBottom: '8px',
          fontFamily: "'Creepster', 'Chiller', serif",
          letterSpacing: '3px'
        }}>
          ☾ THE GREAT ZOLTAR ☽
        </h1>
        <p style={{
          color: '#E6E6FA',
          fontSize: '18px',
          fontStyle: 'italic',
          textShadow: '0 0 10px rgba(230,230,250,0.8)',
          fontFamily: "'Papyrus', serif"
        }}>
          🔮 Mystic Oracle of Destiny 🔮
        </p>
      </div>

      {/* Fortune Machine Container */}
      {/* Fortune Machine Container */}
      <div style={{
        position: 'relative',
        width: '600px',
        height: '500px',
        margin: '40px auto 60px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
          
          {/* Crystal Ball - Centered and Lower */}
          <div 
            className="zoltar-crystal-ball"
            style={{
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(138,43,226,0.6), rgba(75,0,130,0.8))',
            border: '6px solid #FFD700',
            boxShadow: '0 0 40px rgba(138,43,226,0.8), inset 0 0 30px rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '120px',
            pointerEvents: 'none',
            animation: isAnimating ? 'pulse 0.5s ease-in-out infinite' : 'none',
            marginBottom: '60px'
          }}>
            🔮
          </div>

          {/* GUM Balance - Gypsy style centered below crystal ball */}
          <div style={{
            textAlign: 'center',
            marginBottom: '50px'
          }}>
            <div 
              className="zoltar-gum-display"
              style={{
              display: 'inline-block',
              color: '#FFD700',
              fontSize: '28px',
              fontWeight: 'bold',
              fontFamily: "'Papyrus', serif",
              textShadow: '0 0 15px rgba(255,215,0,0.8), 0 0 30px rgba(255,215,0,0.5)',
              padding: '10px 30px',
              borderTop: '2px solid #FFD700',
              borderBottom: '2px solid #FFD700',
              position: 'relative'
            }}>
              <span style={{ 
                fontSize: '32px',
                marginRight: '10px',
                filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.8))'
              }}>💰</span>
              {balance} GUM
              <span style={{
                position: 'absolute',
                left: '-15px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '20px'
              }}>✦</span>
              <span style={{
                position: 'absolute',
                right: '-15px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '20px'
              }}>✦</span>
            </div>
          </div>

          {/* Play Button - BIG and CLICKABLE with smaller font */}
          <button
            className="zoltar-button"
            onClick={playGame}
            disabled={isPlaying || balance < PLAY_COST}
            style={{
              width: '400px',
              height: '100px',
              background: isPlaying ?
                'linear-gradient(45deg, #666, #999)' :
                'linear-gradient(45deg, #FFD700, #FFA500, #FF8C00)',
              border: '5px solid #8B0000',
              borderRadius: '50px',
              color: isPlaying ? '#ccc' : '#8B0000',
              fontWeight: 'bold',
              fontSize: '18px',
              fontFamily: "'Papyrus', serif",
              cursor: isPlaying || balance < PLAY_COST ? 'not-allowed' : 'pointer',
              boxShadow: isPlaying ?
                'inset 0 3px 8px rgba(0,0,0,0.4)' :
                '0 10px 35px rgba(255,140,0,0.8), inset 0 3px 8px rgba(255,255,255,0.6)',
              transition: 'all 0.3s ease',
              zIndex: 100,
              textShadow: isPlaying ? 'none' : '0 2px 4px rgba(0,0,0,0.4)'
            }}
            onMouseEnter={(e) => {
              if (!isPlaying && balance >= PLAY_COST) {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 15px 45px rgba(255,140,0,1), inset 0 3px 8px rgba(255,255,255,0.7)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = isPlaying ?
                'inset 0 3px 8px rgba(0,0,0,0.4)' :
                '0 10px 35px rgba(255,140,0,0.8), inset 0 3px 8px rgba(255,255,255,0.6)';
            }}
          >
            {isPlaying ? '🔮 CONSULTING THE SPIRITS...' : `🔮 CONSULT THE ORACLE (${PLAY_COST} GUM)`}
          </button>
      </div>

      {/* Game Statistics Panel - Moved down below crystal ball */}
      <div style={{
        background: 'rgba(0,0,0,0.8)',
        border: '3px solid #FFD700',
        borderRadius: '20px',
        padding: '30px',
        margin: '20px auto 50px',
        textAlign: 'center',
        minWidth: '400px',
        maxWidth: '500px',
        zIndex: 10,
        boxShadow: '0 0 30px rgba(255,215,0,0.4)'
      }}>
        <h3 style={{ 
          color: '#FFD700', 
          marginBottom: '25px', 
          fontSize: '22px',
          fontFamily: "'Papyrus', serif",
          textShadow: '0 0 10px rgba(255,215,0,0.6)'
        }}>
          📊 Your Mystical Journey
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '25px', 
          color: '#E6E6FA' 
        }}>
          <div>
            <div style={{ fontSize: '16px', opacity: 0.8, marginBottom: '8px' }}>Games Played</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{gameStats.totalPlays}</div>
          </div>
          <div>
            <div style={{ fontSize: '16px', opacity: 0.8, marginBottom: '8px' }}>Win Rate</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: gameStats.totalWins > 0 ? '#00ff00' : '#ffffff' }}>
              {gameStats.totalPlays > 0 ? ((gameStats.totalWins / gameStats.totalPlays) * 100).toFixed(1) : '0.0'}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '16px', opacity: 0.8, marginBottom: '8px' }}>Total Spent</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff6666' }}>
              {gameStats.totalSpent} GUM
            </div>
          </div>
          <div>
            <div style={{ fontSize: '16px', opacity: 0.8, marginBottom: '8px' }}>Net Result</div>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: (gameStats.totalWon - gameStats.totalSpent) >= 0 ? '#00ff00' : '#ff6666' 
            }}>
              {(gameStats.totalWon - gameStats.totalSpent) >= 0 ? '+' : ''}{gameStats.totalWon - gameStats.totalSpent} GUM
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ZoltarFortuneApp;
