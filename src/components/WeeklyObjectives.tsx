import React, { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { getObjectivesStatus, type ChapterObjective, type ObjectiveStatus, calculateObjectiveProgress } from '../utils/weeklyObjectives';

interface WeeklyObjectivesProps {
  currentWeek?: number;
  onObjectiveComplete?: (objective: ChapterObjective) => void;
}

const WeeklyObjectives: React.FC<WeeklyObjectivesProps> = ({ onObjectiveComplete }) => {
  const { primaryWallet } = useDynamicContext();
  const [objectivesStatus, setObjectivesStatus] = useState<ObjectiveStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastWallet, setLastWallet] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState<1 | 2>(1);

  // Generate Week 2 placeholder data
  const getWeek2PlaceholderData = (): ObjectiveStatus => {
    return {
      fridayNightLightsClicked: false,
      crackedCode: false,
      completedObjectives: [
        {
          id: 'week2-objective-1',
          title: '???',
          description: 'To be announced',
          type: 'custom' as const,
          completed: false,
          reward: 10
        },
        {
          id: 'week2-objective-2',
          title: '???',
          description: 'To be announced',
          type: 'custom' as const,
          completed: false,
          reward: 15
        }
      ]
    };
  };

  // Get current objectives data based on selected week
  const currentObjectivesData = currentWeek === 2 ? getWeek2PlaceholderData() : objectivesStatus;

  const loadObjectives = async (forceRefresh = false) => {
    if (!primaryWallet?.address) {
      return;
    }
    
    setLoading(true);
    try {
      if (forceRefresh) {
        console.log('🔄 Force refreshing objectives for wallet:', primaryWallet.address.slice(0, 10) + '...');
      }
      
      const status = await getObjectivesStatus(primaryWallet.address);
      setObjectivesStatus(status);
      
    } catch (error) {
      console.error('❌ Failed to load objectives:', error);
      // On error, clear the status to prevent stale data
      setObjectivesStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset state when wallet changes
    if (primaryWallet?.address !== lastWallet) {
      setObjectivesStatus(null);
      setLastWallet(primaryWallet?.address || null);
    }
    
    // Clear previous state when wallet changes
    setObjectivesStatus(null);
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
    
    return () => {
      clearInterval(interval);
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      window.removeEventListener('cafeteriaButtonClicked', handleObjectiveUpdate);
      window.removeEventListener('codeAccessed', handleObjectiveUpdate);
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
      background: 'rgba(0,0,0,0.8)',
      border: '2px solid #4a90e2',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '20px',
      color: 'white',
      fontFamily: 'MS Sans Serif, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#4a90e2'
            }}>
              📋 Semester Zero: Finding Flunko
            </div>
            
            {/* Week Navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              padding: '4px'
            }}>
              <button
                onClick={() => setCurrentWeek(1)}
                style={{
                  background: currentWeek === 1 ? 'rgba(74, 144, 226, 0.5)' : 'transparent',
                  border: currentWeek === 1 ? '1px solid #4a90e2' : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  color: currentWeek === 1 ? '#fff' : '#ccc',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Week 1
              </button>
              <button
                onClick={() => setCurrentWeek(2)}
                style={{
                  background: currentWeek === 2 ? 'rgba(255, 165, 0, 0.5)' : 'transparent',
                  border: currentWeek === 2 ? '1px solid #ffa500' : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  color: currentWeek === 2 ? '#fff' : '#ccc',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Week 2 →
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => loadObjectives(true)}
              disabled={loading}
              style={{
                background: 'rgba(74, 144, 226, 0.2)',
                border: '1px solid #4a90e2',
                borderRadius: '4px',
                color: '#4a90e2',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? '⏳' : '🔄'} Refresh
            </button>
                        {/* Hard Reset button hidden per user request */}
            {false && (
              <button
                onClick={() => {}}
                disabled={loading}
                style={{
                  background: 'transparent',
                  border: '1px solid #ff8c00',
                  borderRadius: '4px',
                  color: '#ff8c00',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1
                }}
              >
                🔥 Hard Reset
              </button>
            )}
          </div>
        </div>
        
        <div style={{
          fontSize: '14px',
          color: '#ccc',
          marginBottom: '12px'
        }}>
          Week {currentWeek} Objectives ({completedCount}/{totalCount} Complete)
        </div>
        
        {/* Progress Bar */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '10px',
          height: '8px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            background: progress === 100 
              ? 'linear-gradient(90deg, #00ff00, #32cd32)' 
              : 'linear-gradient(90deg, #4a90e2, #357abd)',
            height: '100%',
            width: `${progress}%`,
            borderRadius: '10px',
            transition: 'width 0.5s ease-out'
          }} />
        </div>
        <div style={{
          fontSize: '12px',
          color: '#aaa',
          marginTop: '4px'
        }}>
          {progress}% Complete
        </div>
      </div>

      {/* Debug Info - Show raw status for troubleshooting */}
      {objectivesStatus && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          padding: '8px',
          marginBottom: '16px',
          fontSize: '11px',
          color: '#999'
        }}>
          <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>🔍 Debug Info:</div>
          <div>Wallet: {primaryWallet?.address?.slice(0, 10)}...</div>
          <div>Friday Night Lights: {objectivesStatus.fridayNightLightsClicked ? '✅ YES' : '❌ NO'}</div>
          <div>Code Cracked: {objectivesStatus.crackedCode ? '✅ YES' : '❌ NO'}</div>
          <div>Progress: {progress}% ({completedCount}/{totalCount})</div>
          <div>Last Update: {new Date().toLocaleTimeString()}</div>
        </div>
      )}

      {/* Objectives List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {currentObjectivesData.completedObjectives.map((objective) => (
          <div
            key={objective.id}
            style={{
              background: objective.completed 
                ? 'rgba(0, 255, 0, 0.1)' 
                : currentWeek === 2 
                  ? 'rgba(255, 165, 0, 0.05)' // Orange tint for Week 2
                  : 'rgba(255, 255, 255, 0.05)',
              border: objective.completed 
                ? '1px solid rgba(0, 255, 0, 0.3)' 
                : currentWeek === 2
                  ? '1px solid rgba(255, 165, 0, 0.3)' // Orange border for Week 2
                  : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
          >
            {/* Coming Soon badge for Week 2 */}
            {currentWeek === 2 && (
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '8px',
                background: 'linear-gradient(45deg, #ff8c00, #ffa500)',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                COMING SOON
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: objective.completed ? '#00ff00' : currentWeek === 2 ? '#ffa500' : '#fff',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {objective.completed ? '✅' : currentWeek === 2 ? '🔒' : '⭕'} {objective.title}
                {currentWeek === 2 && (
                  <span style={{
                    fontSize: '12px',
                    color: '#ffa500',
                    fontWeight: 'normal'
                  }}>
                    (Locked)
                  </span>
                )}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#ccc',
                marginBottom: '4px'
              }}>
                {objective.description}
              </div>
              {objective.reward && (
                <div style={{
                  fontSize: '11px',
                  color: currentWeek === 2 ? '#ffa500' : '#4a90e2',
                  fontWeight: 'bold'
                }}>
                  🍬 Reward: +{objective.reward} GUM
                </div>
              )}
            </div>
            
            {objective.completed && (
              <div style={{
                background: 'rgba(0, 255, 0, 0.2)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                animation: 'completePulse 2s ease-in-out infinite'
              }}>
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {progress === 100 && (
        <div style={{
          background: 'linear-gradient(45deg, rgba(0, 255, 0, 0.2), rgba(50, 205, 50, 0.2))',
          border: '2px solid #00ff00',
          borderRadius: '8px',
          padding: '12px',
          marginTop: '16px',
          textAlign: 'center',
          animation: 'completionGlow 2s ease-in-out infinite alternate'
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#00ff00',
            marginBottom: '4px'
          }}>
            🎉 All Objectives Complete! 🎉
          </div>
          <div style={{
            fontSize: '14px',
            color: '#32cd32'
          }}>
            You're ready for the next semester!
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes completePulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        
        @keyframes completionGlow {
          0% { box-shadow: 0 0 10px rgba(0, 255, 0, 0.3); }
          100% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.6); }
        }
      `}</style>
    </div>
  );
};

export default WeeklyObjectives;
