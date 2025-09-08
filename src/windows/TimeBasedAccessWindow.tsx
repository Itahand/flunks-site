import React from 'react';
import { Frame } from 'react95';
import TimeBasedAccessPanel from 'components/TimeBasedAccess';
import styled from 'styled-components';

const WindowContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.material};
  overflow-y: auto;
`;

const ExampleSection = styled.div`
  margin: 16px;
  padding: 12px;
  background: #f0f0f0;
  border: 2px solid #ccc;
  border-radius: 4px;
`;

interface TimeBasedAccessWindowProps {
  onClose?: () => void;
}

const TimeBasedAccessWindow: React.FC<TimeBasedAccessWindowProps> = ({ onClose }) => {
  
  const handleLocationAccess = (locationName: string) => {
    alert(`🎉 Welcome to ${locationName}! You've successfully accessed a time-based location.`);
  };

  return (
    <WindowContainer>
      <Frame variant="well" style={{ margin: '16px', padding: '16px' }}>
        <h1 style={{ margin: '0 0 16px 0', fontSize: '20px', textAlign: 'center' }}>
          🕐 Time-Based Location Access System
        </h1>
        
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>
          Locations that are only accessible during specific hours, just like real life!
        </p>
        
        <ExampleSection>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>🌟 Features:</h3>
          <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li><strong>Real-time Clock:</strong> Uses your device's local time</li>
            <li><strong>Day-specific Access:</strong> Some locations only open on certain days</li>
            <li><strong>Midnight Spanning:</strong> Handles locations open past midnight (e.g., 11PM-3AM)</li>
            <li><strong>Live Updates:</strong> Status updates every minute automatically</li>
            <li><strong>Countdown Timers:</strong> Shows exactly when locations open/close</li>
          </ul>
        </ExampleSection>

        <ExampleSection>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>🎯 Example Use Cases:</h3>
          <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li><strong>🌙 Night Club:</strong> Only accessible 9 PM - 3 AM</li>
            <li><strong>📚 Study Hall:</strong> Open during school hours (weekdays only)</li>
            <li><strong>🎉 Weekend Hangout:</strong> Saturday & Sunday exclusive</li>
            <li><strong>🍕 Lunch Spot:</strong> 11 AM - 2 PM daily</li>
            <li><strong>☕ Early Bird Cafe:</strong> Morning coffee 6-10 AM</li>
            <li><strong>🎮 After School:</strong> 3-8 PM on weekdays</li>
          </ul>
        </ExampleSection>
      </Frame>
      
      <TimeBasedAccessPanel onLocationAccess={handleLocationAccess} />
    </WindowContainer>
  );
};

export default TimeBasedAccessWindow;
