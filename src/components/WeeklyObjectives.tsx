import React, { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { getObjectivesStatus, getChapter2ObjectivesStatus, getChapter3ObjectivesStatus, type ChapterObjective, type ObjectiveStatus, calculateObjectiveProgress } from '../utils/weeklyObjectives';

interface WeeklyObjectivesProps {
  currentWeek?: number;
  onObjectiveComplete?: (objective: ChapterObjective) => void;
}

const WeeklyObjectives: React.FC<WeeklyObjectivesProps> = ({ onObjectiveComplete }) => {
  const { primaryWallet } = useDynamicContext();
  const [objectivesStatus, setObjectivesStatus] = useState<ObjectiveStatus | null>(null);
  const [chapter2ObjectivesStatus, setChapter2ObjectivesStatus] = useState<ObjectiveStatus | null>(null);
  const [chapter3ObjectivesStatus, setChapter3ObjectivesStatus] = useState<ObjectiveStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastWallet, setLastWallet] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState<1 | 2 | 3>(3); // Default to Chapter 3 - Picture Day

  // Get current objectives data based on selected week
  const currentObjectivesData = currentWeek === 3 ? chapter3ObjectivesStatus : 
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
      
      // Load Chapter 1, Chapter 2, and Chapter 3 objectives
      const [status, chapter2Status, chapter3Status] = await Promise.all([
        getObjectivesStatus(primaryWallet.address),
        getChapter2ObjectivesStatus(primaryWallet.address),
        getChapter3ObjectivesStatus(primaryWallet.address)
      ]);
      
      setObjectivesStatus(status);
      setChapter2ObjectivesStatus(chapter2Status);
      setChapter3ObjectivesStatus(chapter3Status);
      
    } catch (error) {
      console.error('❌ Failed to load objectives:', error);
      // On error, clear the status to prevent stale data
      setObjectivesStatus(null);
      setChapter2ObjectivesStatus(null);
      setChapter3ObjectivesStatus(null);
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
      setLastWallet(primaryWallet?.address || null);
    }
    
    // Clear previous state when wallet changes
    setObjectivesStatus(null);
    setChapter2ObjectivesStatus(null);
    setChapter3ObjectivesStatus(null);
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
        {/* Title */}
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#4a90e2',
          marginBottom: '12px'
        }}>
          📋 Semester Zero: Finding Flunko
        </div>
        
        {/* Chapter Navigation - Mobile Optimized */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px'
        }}>
          {/* Chapter Buttons Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '8px',
            width: '100%',
            maxWidth: '320px',
            overflowX: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#4a90e2 transparent'
          }}>
            <button
              onClick={() => setCurrentWeek(1)}
              style={{
                background: currentWeek === 1 ? 'rgba(74, 144, 226, 0.5)' : 'transparent',
                border: currentWeek === 1 ? '1px solid #4a90e2' : '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                color: currentWeek === 1 ? '#fff' : '#ccc',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '80px',
                whiteSpace: 'nowrap'
              }}
            >
              Chapter 1
            </button>
            <button
              onClick={() => setCurrentWeek(2)}
              style={{
                background: currentWeek === 2 ? 'rgba(255, 165, 0, 0.5)' : 'transparent',
                border: currentWeek === 2 ? '1px solid #ffa500' : '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                color: currentWeek === 2 ? '#fff' : '#ccc',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '80px',
                whiteSpace: 'nowrap'
              }}
            >
              Chapter 2
            </button>
            <button
              onClick={() => setCurrentWeek(3)}
              style={{
                background: currentWeek === 3 ? 'rgba(255, 20, 147, 0.5)' : 'transparent',
                border: currentWeek === 3 ? '1px solid #ff1493' : '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                color: currentWeek === 3 ? '#fff' : '#ccc',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '80px',
                whiteSpace: 'nowrap'
              }}
            >
              Chapter 3
            </button>
          </div>
          
          {/* Refresh Button Row */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => loadObjectives(true)}
              disabled={loading}
              style={{
                background: 'rgba(74, 144, 226, 0.2)',
                border: '1px solid #4a90e2',
                borderRadius: '4px',
                color: '#4a90e2',
                padding: '6px 12px',
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
                  padding: '6px 12px',
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
          Chapter {currentWeek} Objectives ({completedCount}/{totalCount} Complete)
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
                : currentWeek === 3 
                  ? 'rgba(255, 20, 147, 0.05)' // Pink tint for Chapter 3
                  : currentWeek === 2 
                    ? 'rgba(255, 165, 0, 0.05)' // Orange tint for Chapter 2
                    : 'rgba(255, 255, 255, 0.05)',
              border: objective.completed 
                ? '1px solid rgba(0, 255, 0, 0.3)' 
                : currentWeek === 3
                  ? '1px solid rgba(255, 20, 147, 0.3)' // Pink border for Chapter 3
                  : currentWeek === 2
                    ? '1px solid rgba(255, 165, 0, 0.3)' // Orange border for Chapter 2
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
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: objective.completed ? '#00ff00' : '#fff',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {objective.completed ? '✅' : '⭕'} {objective.title}
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
                  color: currentWeek === 3 ? '#ff1493' : currentWeek === 2 ? '#ffa500' : '#4a90e2',
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
            You're ready for the next chapter!
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
