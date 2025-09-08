import React from 'react';
import { Button, Frame, Progress } from 'react95';
import styled from 'styled-components';
import { useTimeBasedAccess, TimeBasedAccessRule, TIME_RULES } from 'hooks/useTimeBasedAccess';

const TimeAccessContainer = styled.div`
  padding: 20px;
  max-width: 700px;
  margin: 0 auto;
  background: ${({ theme }) => theme.material};
`;

const LocationCard = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  margin: 12px 0;
  background: ${({ $isOpen }) => $isOpen ? '#d4edda' : '#f8d7da'};
  border: 2px solid ${({ $isOpen }) => $isOpen ? '#c3e6cb' : '#f5c6cb'};
  border-radius: 8px;
  position: relative;
`;

const LocationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LocationTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: bold;
`;

const StatusBadge = styled.span<{ $isOpen: boolean }>`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: bold;
  background: ${({ $isOpen }) => $isOpen ? '#28a745' : '#dc3545'};
  color: white;
`;

const TimeInfo = styled.div`
  font-size: 12px;
  color: #666;
  line-height: 1.4;
`;

const CurrentTimeDisplay = styled.div`
  text-align: center;
  padding: 16px;
  background: #e9ecef;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ActionButton = styled(Button)<{ $disabled?: boolean }>`
  ${({ $disabled }) => $disabled && `
    opacity: 0.5;
    cursor: not-allowed;
  `}
`;

interface TimeBasedAccessPanelProps {
  onLocationAccess?: (locationName: string) => void;
}

const TimeBasedAccessPanel: React.FC<TimeBasedAccessPanelProps> = ({ onLocationAccess }) => {
  const {
    currentTime,
    currentHour,
    currentDay,
    isLocationOpen,
    getTimeUntilOpen,
    getTimeUntilClosed,
    formatTime
  } = useTimeBasedAccess();

  const getDayName = (dayNum: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum];
  };

  const formatTimeWindows = (rule: TimeBasedAccessRule): string => {
    return rule.timeWindows.map(window => {
      const days = window.days ? window.days.map(d => getDayName(d)).join(', ') : 'Every day';
      const startTime = `${window.startHour === 0 ? 12 : window.startHour > 12 ? window.startHour - 12 : window.startHour}${window.startHour >= 12 ? 'PM' : 'AM'}`;
      const endTime = `${window.endHour === 0 ? 12 : window.endHour > 12 ? window.endHour - 12 : window.endHour}${window.endHour >= 12 ? 'PM' : 'AM'}`;
      return `${days}: ${startTime} - ${endTime}`;
    }).join('\n');
  };

  const handleLocationClick = (locationName: string, isOpen: boolean) => {
    if (isOpen && onLocationAccess) {
      onLocationAccess(locationName);
    }
  };

  return (
    <TimeAccessContainer>
      <Frame variant="well" style={{ padding: '16px' }}>
        <h2 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>🕐 Time-Based Location Access</h2>
        
        <CurrentTimeDisplay>
          <h3 style={{ margin: '0 0 8px 0' }}>Current Time</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {formatTime(currentTime)}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            {getDayName(currentDay)} • Hour: {currentHour}
          </div>
        </CurrentTimeDisplay>

        <h3 style={{ margin: '20px 0 16px 0' }}>Available Locations</h3>
        
        {Object.values(TIME_RULES).map((rule) => {
          const isOpen = isLocationOpen(rule);
          const timeStatus = isOpen ? getTimeUntilClosed(rule) : getTimeUntilOpen(rule);
          
          return (
            <LocationCard key={rule.name} $isOpen={isOpen}>
              <LocationHeader>
                <LocationTitle>
                  {rule.name === 'Night Club' && '🌙'} 
                  {rule.name === 'Study Hall' && '📚'} 
                  {rule.name === 'Weekend Hangout' && '🎉'} 
                  {rule.name === 'Lunch Spot' && '🍕'} 
                  {rule.name === 'Early Bird Cafe' && '☕'} 
                  {rule.name === 'After School Hangout' && '🎮'} 
                  {rule.name}
                </LocationTitle>
                <StatusBadge $isOpen={isOpen}>
                  {isOpen ? '✅ OPEN' : '🔒 CLOSED'}
                </StatusBadge>
              </LocationHeader>
              
              <div style={{ fontSize: '13px', color: '#555' }}>
                {rule.description}
              </div>
              
              <TimeInfo>
                <strong>Schedule:</strong><br/>
                {formatTimeWindows(rule)}
              </TimeInfo>
              
              <TimeInfo>
                <strong>Status:</strong> {timeStatus}
              </TimeInfo>
              
              <ActionButton
                onClick={() => handleLocationClick(rule.name, isOpen)}
                $disabled={!isOpen}
                style={{ 
                  marginTop: '8px',
                  background: isOpen ? '#28a745' : '#6c757d',
                  color: 'white'
                }}
              >
                {isOpen ? `Enter ${rule.name}` : 'Location Closed'}
              </ActionButton>
            </LocationCard>
          );
        })}

        <Frame variant="well" style={{ margin: '24px 0', padding: '16px' }}>
          <h4>🔧 How to Implement</h4>
          <div style={{ fontSize: '12px', fontFamily: 'monospace', lineHeight: '1.4' }}>
            <p><strong>Basic Usage:</strong></p>
            <code style={{ display: 'block', background: '#f0f0f0', padding: '8px', margin: '4px 0' }}>
              const &#123; isLocationOpen &#125; = useTimeBasedAccess();<br/>
              const canEnter = isLocationOpen(TIME_RULES.NIGHT_CLUB);<br/>
              if (!canEnter) &#123;<br/>
              &nbsp;&nbsp;return &lt;div&gt;🌙 Night Club opens at 9 PM!&lt;/div&gt;;<br/>
              &#125;
            </code>
            
            <p><strong>Custom Time Rules:</strong></p>
            <code style={{ display: 'block', background: '#f0f0f0', padding: '8px', margin: '4px 0' }}>
              const customRule = &#123;<br/>
              &nbsp;&nbsp;name: "Secret Meeting",<br/>
              &nbsp;&nbsp;timeWindows: [&#123; startHour: 23, endHour: 1 &#125;]<br/>
              &#125;;
            </code>
          </div>
        </Frame>
      </Frame>
    </TimeAccessContainer>
  );
};

export default TimeBasedAccessPanel;
