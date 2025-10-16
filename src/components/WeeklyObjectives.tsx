import React, { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { getObjectivesStatus, getChapter2ObjectivesStatus, getChapter3ObjectivesStatus, getChapter4ObjectivesStatus, getChapter5ObjectivesStatus, type ChapterObjective, type ObjectiveStatus, calculateObjectiveProgress } from '../utils/weeklyObjectives';

interface WeeklyObjectivesProps {
  currentWeek?: number;
  onObjectiveComplete?: (objective: ChapterObjective) => void;
}

const WeeklyObjectives: React.FC<WeeklyObjectivesProps> = ({ onObjectiveComplete }) => {
  const { primaryWallet } = useDynamicContext();
  const [objectivesStatus, setObjectivesStatus] = useState<ObjectiveStatus | null>(null);
  const [chapter2ObjectivesStatus, setChapter2ObjectivesStatus] = useState<ObjectiveStatus | null>(null);
  const [chapter3ObjectivesStatus, setChapter3ObjectivesStatus] = useState<ObjectiveStatus | null>(null);
  const [chapter4ObjectivesStatus, setChapter4ObjectivesStatus] = useState<ObjectiveStatus | null>(null);
  const [chapter5ObjectivesStatus, setChapter5ObjectivesStatus] = useState<ObjectiveStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastWallet, setLastWallet] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState<1 | 2 | 3 | 4 | 5>(5); // Default to Chapter 5 - Paradise Motel

  // Get current objectives data based on selected week
  const currentObjectivesData = currentWeek === 5 ? chapter5ObjectivesStatus :
                              currentWeek === 4 ? chapter4ObjectivesStatus :
                              currentWeek === 3 ? chapter3ObjectivesStatus : 
                              currentWeek === 2 ? chapter2ObjectivesStatus : 
                              objectivesStatus;

  const loadObjectives = async (forceRefresh = false) => {
    if (!primaryWallet?.address) {
      return;
    }
    
    setLoading(true);
    try {
      if (forceRefresh) {
        console.log('🔄 Force refreshing objectives for wallet:', primaryWallet.address.slice(0, 10) + '...');
      }
      
      // Load Chapter 1, Chapter 2, Chapter 3, Chapter 4, and Chapter 5 objectives
      const [status, chapter2Status, chapter3Status, chapter4Status, chapter5Status] = await Promise.all([
        getObjectivesStatus(primaryWallet.address),
        getChapter2ObjectivesStatus(primaryWallet.address),
        getChapter3ObjectivesStatus(primaryWallet.address),
        getChapter4ObjectivesStatus(primaryWallet.address),
        getChapter5ObjectivesStatus(primaryWallet.address)
      ]);
      
      setObjectivesStatus(status);
      setChapter2ObjectivesStatus(chapter2Status);
      setChapter3ObjectivesStatus(chapter3Status);
      setChapter4ObjectivesStatus(chapter4Status);
      setChapter5ObjectivesStatus(chapter5Status);
      
    } catch (error) {
      console.error('❌ Failed to load objectives:', error);
      // On error, clear the status to prevent stale data
      setObjectivesStatus(null);
      setChapter2ObjectivesStatus(null);
      setChapter3ObjectivesStatus(null);
      setChapter4ObjectivesStatus(null);
      setChapter5ObjectivesStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset state when wallet changes
    if (primaryWallet?.address !== lastWallet) {
      setObjectivesStatus(null);
      setChapter2ObjectivesStatus(null);
      setChapter3ObjectivesStatus(null);
      setChapter4ObjectivesStatus(null);
      setChapter5ObjectivesStatus(null);
      setLastWallet(primaryWallet?.address || null);
    }
    
    // Clear previous state when wallet changes
    setObjectivesStatus(null);
    setChapter2ObjectivesStatus(null);
    setChapter3ObjectivesStatus(null);
    setChapter4ObjectivesStatus(null);
    setChapter5ObjectivesStatus(null);
    loadObjectives();
    
    // Much longer refresh interval to reduce server load and UI disruption
    const interval = setInterval(() => loadObjectives(), 120000); // Changed from 30s to 2 minutes
    
    // Even more conservative debounced update handler
    let refreshTimeout: NodeJS.Timeout | null = null;
    const handleObjectiveUpdate = () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      refreshTimeout = setTimeout(() => {
        loadObjectives(true); // Force refresh on events
        refreshTimeout = null;
      }, 5000); // Increased from 2s to 5s delay
    };

    window.addEventListener('cafeteriaButtonClicked', handleObjectiveUpdate);
    window.addEventListener('codeAccessed', handleObjectiveUpdate);
    window.addEventListener('pictureVoteComplete', handleObjectiveUpdate); // Add Picture Day voting event
    
    return () => {
      clearInterval(interval);
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      window.removeEventListener('cafeteriaButtonClicked', handleObjectiveUpdate);
      window.removeEventListener('codeAccessed', handleObjectiveUpdate);
      window.removeEventListener('pictureVoteComplete', handleObjectiveUpdate);
    };
  }, [primaryWallet?.address, lastWallet]);

  if (!primaryWallet?.address) {
    return null;
  }

  if (loading) {
    return (
      <div style={{
        background: 'rgba(0,0,0,0.8)',
        border: '2px solid #4a90e2',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '20px',
        textAlign: 'center'
      }}>
        <div style={{ color: '#4a90e2', fontSize: '16px' }}>
          📊 Loading objectives...
        </div>
      </div>
    );
  }

  if (!currentObjectivesData) return null;

  const progress = calculateObjectiveProgress(currentObjectivesData.completedObjectives);
  const completedCount = currentObjectivesData.completedObjectives.filter(obj => obj.completed).length;
  const totalCount = currentObjectivesData.completedObjectives.length;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #001122 0%, #002244 50%, #003366 100%)',
      border: '4px solid #FFD700',
      borderRadius: '0',
      padding: '0',
      marginTop: '20px',
      color: 'white',
      fontFamily: '"Courier New", monospace',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'inset 0 0 50px rgba(255, 215, 0, 0.2), 0 0 30px rgba(0, 0, 0, 0.8)',
      animation: 'nintendoGlow 3s ease-in-out infinite alternate'
    }}>
      {/* Nintendo-Style Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        animation: 'starFieldMove 20s linear infinite',
        pointerEvents: 'none'
      }} />

      {/* Epic Nintendo Title */}
      <div style={{
        textAlign: 'center',
        padding: '20px 20px 10px 20px',
        background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)',
        borderBottom: '4px solid #B8860B',
        position: 'relative',
        animation: 'titleShine 2s ease-in-out infinite'
      }}>
        <div style={{
          fontSize: 'clamp(20px, 6vw, 40px)',
          fontWeight: 'bold',
          color: '#001122',
          textShadow: '2px 2px 0px #FFFFFF, -2px -2px 0px #FFFFFF, 2px -2px 0px #FFFFFF, -2px 2px 0px #FFFFFF',
          letterSpacing: '3px',
          animation: 'titlePulse 1.5s ease-in-out infinite',
          marginBottom: '12px',
          fontFamily: '"Courier New", "Lucida Console", monospace',
          imageRendering: 'pixelated'
        }}>
          SEMESTER ZERO
        </div>
        <div style={{
          fontSize: 'clamp(18px, 4vw, 32px)',
          color: '#001122',
          fontWeight: 'bold',
          textShadow: '2px 2px 0px #FFFFFF, -2px -2px 0px #FFFFFF, 2px -2px 0px #FFFFFF, -2px 2px 0px #FFFFFF',
          letterSpacing: '2px'
        }}>
          ~ FINDING FLUNKO ~
        </div>
      </div>

      {/* Level Select Menu */}
      <div style={{
        padding: '20px',
        background: 'linear-gradient(180deg, rgba(0, 34, 68, 0.9) 0%, rgba(0, 17, 34, 0.9) 100%)'
      }}>
        {/* Chapter Selection Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.3)',
          border: '2px solid #FFD700',
          borderRadius: '8px'
        }}>
          {[1, 2, 3, 4, 5].map((chapter) => {
            const isSelected = currentWeek === chapter;
            const chapterData = chapter === 5 ? chapter5ObjectivesStatus :
                              chapter === 4 ? chapter4ObjectivesStatus :
                              chapter === 3 ? chapter3ObjectivesStatus : 
                              chapter === 2 ? chapter2ObjectivesStatus : 
                              objectivesStatus;
            const chapterProgress = chapterData ? calculateObjectiveProgress(chapterData.completedObjectives) : 0;
            const isComplete = chapterProgress === 100;
            
            return (
              <button
                key={chapter}
                onClick={() => setCurrentWeek(chapter as 1 | 2 | 3 | 4 | 5)}
                style={{
                  background: isSelected 
                    ? 'linear-gradient(45deg, #FFD700, #FFA500)' 
                    : isComplete 
                      ? 'linear-gradient(45deg, #32CD32, #228B22)'
                      : 'linear-gradient(45deg, #4169E1, #1E90FF)',
                  border: '3px solid ' + (isSelected ? '#FFFFFF' : isComplete ? '#00FF00' : '#87CEEB'),
                  borderRadius: '8px',
                  color: isSelected ? '#001122' : '#FFFFFF',
                  padding: '12px 8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textShadow: isSelected ? '1px 1px 0px #FFFFFF' : '1px 1px 2px #000000',
                  animation: isSelected ? 'levelFloat 2s ease-in-out infinite' : isComplete ? 'powerUp 3s ease-in-out infinite' : 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  fontSize: '18px',
                  marginBottom: '4px'
                }}>
                  {isComplete ? '👑' : chapter === 1 ? '🏫' : chapter === 2 ? '🏀' : chapter === 3 ? '📸' : chapter === 4 ? '💃' : '🏨'}
                </div>
                <div>CHAPTER {chapter}</div>
                <div style={{
                  fontSize: '10px',
                  marginTop: '4px',
                  opacity: 0.8
                }}>
                  {chapterProgress}% COMPLETE
                </div>
                {isComplete && (
                  <div style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    background: '#FFD700',
                    color: '#001122',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    animation: 'starTwinkle 1s ease-in-out infinite'
                  }}>
                    ★
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Current Chapter Info */}
        <div style={{
          background: 'linear-gradient(90deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.2) 100%)',
          border: '2px solid #FFD700',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#FFD700',
            marginBottom: '8px',
            textShadow: '2px 2px 4px #000000',
            animation: 'titlePulse 2s ease-in-out infinite'
          }}>
            {currentWeek === 1 ? '🏫 CHAPTER 1: THE BEGINNING' :
             currentWeek === 2 ? '🏀 CHAPTER 2: JOCKS HOUSE' :
             currentWeek === 3 ? '📸 CHAPTER 3: PICTURE DAY' :
             currentWeek === 4 ? '💃 CHAPTER 4: HOMECOMING DANCE' :
             '🏨 CHAPTER 5: PARADISE MOTEL'}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#FFFFFF',
            marginBottom: '12px'
          }}>
            MISSIONS COMPLETED: {completedCount}/{totalCount}
          </div>
          
          {/* Epic Progress Bar */}
          <div style={{
            background: '#001122',
            border: '2px solid #FFD700',
            borderRadius: '20px',
            height: '20px',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              background: progress === 100 
                ? 'linear-gradient(90deg, #FFD700, #32CD32, #FFD700)' 
                : 'linear-gradient(90deg, #4169E1, #1E90FF, #87CEEB)',
              height: '100%',
              width: `${progress}%`,
              borderRadius: '18px',
              transition: 'width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              animation: progress === 100 ? 'powerUp 2s ease-in-out infinite' : 'none',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {progress === 100 && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.5) 50%, transparent 70%)',
                  animation: 'shine 2s ease-in-out infinite'
                }} />
              )}
            </div>
            <div style={{
              position: 'absolute',
              top: '2px',
              left: '0',
              right: '0',
              bottom: '0',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 'bold',
              textAlign: 'center',
              lineHeight: '16px',
              textShadow: '1px 1px 2px #000000'
            }}>
              {progress}%
            </div>
          </div>
        </div>

        {/* Mission Objectives Grid */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {currentObjectivesData.completedObjectives.map((objective, index) => (
            <div
              key={objective.id}
              style={{
                background: objective.completed 
                  ? 'linear-gradient(135deg, rgba(50, 205, 50, 0.3), rgba(0, 255, 0, 0.2))' 
                  : 'linear-gradient(135deg, rgba(65, 105, 225, 0.2), rgba(30, 144, 255, 0.1))',
                border: objective.completed 
                  ? '2px solid #32CD32' 
                  : '2px solid #4169E1',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.5s ease',
                position: 'relative',
                overflow: 'hidden',
                animation: objective.completed ? 'missionComplete 3s ease-in-out infinite' : 'levelFloat 4s ease-in-out infinite',
                animationDelay: `${index * 0.2}s`
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: objective.completed ? '#32CD32' : '#FFFFFF',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textShadow: '1px 1px 2px #000000'
                }}>
                  <span style={{
                    fontSize: '20px',
                    animation: objective.completed ? 'starTwinkle 1s ease-in-out infinite' : 'none'
                  }}>
                    {objective.completed ? '🏆' : '⚡'}
                  </span>
                  MISSION {index + 1}: {objective.title.toUpperCase()}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#CCCCCC',
                  marginBottom: '8px',
                  lineHeight: '1.4'
                }}>
                  {objective.description}
                </div>
                {objective.reward && (
                  <div style={{
                    fontSize: '12px',
                    color: '#FFD700',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px #000000'
                  }}>
                    🍬 REWARD: +{objective.reward} GUM POWER
                  </div>
                )}
              </div>
              
              {objective.completed && (
                <div style={{
                  background: 'linear-gradient(45deg, #FFD700, #32CD32)',
                  border: '2px solid #FFFFFF',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  animation: 'powerUp 2s ease-in-out infinite',
                  color: '#001122',
                  textShadow: 'none'
                }}>
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Completion Fanfare */}
        {progress === 100 && (
          <div style={{
            background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.4), rgba(50, 205, 50, 0.4))',
            border: '3px solid #FFD700',
            borderRadius: '12px',
            padding: '16px 14px',
            marginTop: '20px',
            textAlign: 'center',
            animation: 'completionFanfare 2s ease-in-out infinite alternate',
            position: 'relative',
            overflow: 'hidden',
            maxWidth: '100%',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              position: 'relative',
              zIndex: 10
            }}>
              <div style={{
                fontSize: 'clamp(14px, 5vw, 22px)',
                fontWeight: 'bold',
                color: '#FFD700',
                textShadow: '2px 2px 4px #000000',
                animation: 'titlePulse 1s ease-in-out infinite',
                fontFamily: '"Press Start 2P", "Courier New", monospace',
                letterSpacing: '1px',
                lineHeight: 1.2,
                wordBreak: 'break-word'
              }}>🎉 CHAPTER<br/>COMPLETE! 🎉</div>
              <div style={{
                fontSize: 'clamp(10px, 4vw, 16px)',
                color: '#32CD32',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px #000000',
                fontFamily: '"Press Start 2P", "Courier New", monospace',
                letterSpacing: '1px',
                lineHeight: 1.25,
                wordBreak: 'break-word',
                maxWidth: '95%'
              }}>READY FOR<br/>NEXT ADVENTURE!</div>
            </div>
            {/* Celebration Particles */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: `${15 + i * 16}%`,
                  left: `${8 + i * 18}%`,
                  width: '14px',
                  height: '14px',
                  background: i % 2 === 0 ? '#FFD700' : '#32CD32',
                  borderRadius: '50%',
                  opacity: 0.85,
                  animation: `starTwinkle ${1 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.25}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Control Panel */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '20px',
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.5)',
          border: '2px solid #4169E1',
          borderRadius: '8px'
        }}>
          <button
            onClick={() => loadObjectives(true)}
            disabled={loading}
            style={{
              background: loading 
                ? 'linear-gradient(45deg, #666666, #444444)' 
                : 'linear-gradient(45deg, #4169E1, #1E90FF)',
              border: '2px solid #FFFFFF',
              borderRadius: '6px',
              color: '#FFFFFF',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              textShadow: '1px 1px 2px #000000',
              animation: loading ? 'none' : 'levelFloat 3s ease-in-out infinite',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? '⏳ LOADING...' : '🔄 REFRESH MISSIONS'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes nintendoGlow {
          0% { box-shadow: inset 0 0 50px rgba(255, 215, 0, 0.2), 0 0 30px rgba(0, 0, 0, 0.8); }
          100% { box-shadow: inset 0 0 60px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.3); }
        }
        
        @keyframes starFieldMove {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(-20px) translateY(-20px); }
        }
        
        @keyframes titleShine {
          0% { background: linear-gradient(90deg, #FFD700, #FFA500, #FFD700); }
          50% { background: linear-gradient(90deg, #FFA500, #FFD700, #FFA500); }
          100% { background: linear-gradient(90deg, #FFD700, #FFA500, #FFD700); }
        }
        
        @keyframes missionComplete {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-2px) scale(1.02); }
        }
        
        @keyframes completionFanfare {
          0% { 
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(50, 205, 50, 0.3);
            transform: scale(1);
          }
          100% { 
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.8), inset 0 0 30px rgba(50, 205, 50, 0.5);
            transform: scale(1.02);
          }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default WeeklyObjectives;
