import React, { useState } from 'react';
import { Button, Frame, Progress, TextInput } from 'react95';
import styled from 'styled-components';
import { useBackpackAccess, BackpackBaseType, BackpackColorType } from 'hooks/useBackpackAccess';

const BackpackAccessContainer = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background: ${({ theme }) => theme.material};
`;

const TraitCard = styled.div<{ $hasAccess: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  margin: 8px 0;
  background: ${({ $hasAccess }) => $hasAccess ? '#d4edda' : '#f8d7da'};
  border: 2px solid ${({ $hasAccess }) => $hasAccess ? '#c3e6cb' : '#f5c6cb'};
  border-radius: 4px;
`;

const TraitInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TraitLabel = styled.span`
  font-weight: bold;
  font-size: 14px;
`;

const TraitValue = styled.span`
  font-size: 12px;
  color: #666;
`;

const StatusIndicator = styled.span<{ $status: 'success' | 'error' | 'warning' }>`
  font-size: 18px;
  ${({ $status }) => 
    $status === 'success' ? '✅' :
    $status === 'error' ? '❌' : '⚠️'
  }
`;

const BackpackList = styled.div`
  margin: 16px 0;
  max-height: 300px;
  overflow-y: auto;
`;

const BackpackItem = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  padding: 12px;
  margin: 8px 0;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
`;

interface BackpackAccessPanelProps {
  onClose?: () => void;
}

const BackpackAccessPanel: React.FC<BackpackAccessPanelProps> = ({ onClose }) => {
  const {
    backpackAccess,
    loading,
    error,
    hasBackpackWithTrait,
    hasBackpackBase,
    hasBackpackColor,
    hasMinimumSlots,
    refreshAccess,
    getTotalSlots
  } = useBackpackAccess();

  const [requiredBase, setRequiredBase] = useState<BackpackBaseType>('Teddy');
  const [requiredColor, setRequiredColor] = useState<BackpackColorType>('Orange');
  const [requiredSlots, setRequiredSlots] = useState<number>(10);

  const backpackBases: BackpackBaseType[] = ['Teddy', 'Skull', 'Cat', 'Robot', 'Alien'];
  const backpackColors: BackpackColorType[] = ['Orange', 'Blue', 'Red', 'Green', 'Purple', 'Yellow', 'Pink', 'Black'];

  const getAccessStatus = () => {
    if (!backpackAccess.hasBackpack) return 'No Backpack NFTs Found';
    return `Found ${backpackAccess.traits.length} Backpack${backpackAccess.traits.length !== 1 ? 's' : ''} (${getTotalSlots()} total slots)`;
  };

  return (
    <BackpackAccessContainer>
      <Frame variant="well" style={{ padding: '16px' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>🎒 Backpack Access Control</h2>
        
        {loading && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <Progress />
            <p>Scanning your wallet for Backpack NFTs...</p>
          </div>
        )}

        {error && (
          <div style={{ color: 'red', margin: '16px 0', padding: '12px', background: '#ffe6e6', border: '1px solid #ff9999' }}>
            ⚠️ Error: {error}
          </div>
        )}

        {!loading && (
          <>
            <div style={{ margin: '16px 0', padding: '12px', background: '#e9ecef', border: '1px solid #ced4da' }}>
              <strong>Status:</strong> {getAccessStatus()}
            </div>

            {backpackAccess.hasBackpack && (
              <BackpackList>
                <h3>Your Backpack NFTs:</h3>
                {backpackAccess.traits.map((traits, index) => (
                  <BackpackItem key={index}>
                    <div><strong>Base:</strong><br/>{traits.base || 'Unknown'}</div>
                    <div><strong>Primary:</strong><br/>{traits.primary || 'Unknown'}</div>
                    <div><strong>Secondary:</strong><br/>{traits.secondary || 'Unknown'}</div>
                    <div><strong>Tertiary:</strong><br/>{traits.tertiary || 'Unknown'}</div>
                    <div><strong>Slots:</strong><br/>{traits.slots || 'Unknown'}</div>
                  </BackpackItem>
                ))}
              </BackpackList>
            )}

            <h3 style={{ margin: '24px 0 16px 0' }}>Access Requirements Testing</h3>
            
            {/* Base Type Testing */}
            <div style={{ margin: '16px 0' }}>
              <label>Required Base Type:</label>
              <select 
                value={requiredBase} 
                onChange={(e) => setRequiredBase(e.target.value as BackpackBaseType)}
                style={{ margin: '0 8px', padding: '4px' }}
              >
                {backpackBases.map(base => (
                  <option key={base} value={base}>{base}</option>
                ))}
              </select>
              <TraitCard $hasAccess={hasBackpackBase(requiredBase)}>
                <TraitInfo>
                  <TraitLabel>Base: {requiredBase}</TraitLabel>
                  <TraitValue>Required to access special areas</TraitValue>
                </TraitInfo>
                <StatusIndicator $status={hasBackpackBase(requiredBase) ? 'success' : 'error'} />
              </TraitCard>
            </div>

            {/* Color Testing */}
            <div style={{ margin: '16px 0' }}>
              <label>Required Color:</label>
              <select 
                value={requiredColor} 
                onChange={(e) => setRequiredColor(e.target.value as BackpackColorType)}
                style={{ margin: '0 8px', padding: '4px' }}
              >
                {backpackColors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
              <TraitCard $hasAccess={hasBackpackColor(requiredColor)}>
                <TraitInfo>
                  <TraitLabel>Any {requiredColor} Color</TraitLabel>
                  <TraitValue>Primary, Secondary, or Tertiary color</TraitValue>
                </TraitInfo>
                <StatusIndicator $status={hasBackpackColor(requiredColor) ? 'success' : 'error'} />
              </TraitCard>
            </div>

            {/* Slots Testing */}
            <div style={{ margin: '16px 0' }}>
              <label>Minimum Slots:</label>
              <TextInput
                type="number"
                value={requiredSlots.toString()}
                onChange={(e) => setRequiredSlots(parseInt(e.target.value) || 0)}
                style={{ margin: '0 8px', width: '80px' }}
              />
              <TraitCard $hasAccess={hasMinimumSlots(requiredSlots)}>
                <TraitInfo>
                  <TraitLabel>Minimum {requiredSlots} Slots</TraitLabel>
                  <TraitValue>Total across all backpacks: {getTotalSlots()}</TraitValue>
                </TraitInfo>
                <StatusIndicator $status={hasMinimumSlots(requiredSlots) ? 'success' : 'error'} />
              </TraitCard>
            </div>

            {/* Usage Examples */}
            <Frame variant="well" style={{ margin: '24px 0', padding: '16px' }}>
              <h4>🔧 Implementation Examples</h4>
              <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                <p><strong>Teddy Bear Lounge Access:</strong><br/>
                <code>hasBackpackBase('Teddy')</code></p>
                
                <p><strong>Orange-themed Area:</strong><br/>
                <code>hasBackpackColor('Orange')</code></p>
                
                <p><strong>High Capacity Storage:</strong><br/>
                <code>hasMinimumSlots(15)</code></p>
                
                <p><strong>Specific Trait Combo:</strong><br/>
                <code>hasBackpackWithTrait('base', 'Teddy') && hasBackpackWithTrait('primary', 'Orange')</code></p>
              </div>
            </Frame>

            <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
              <Button onClick={refreshAccess} disabled={loading}>
                🔄 Refresh Backpack Data
              </Button>
              {onClose && (
                <Button onClick={onClose}>
                  ❌ Close
                </Button>
              )}
            </div>
          </>
        )}
      </Frame>
    </BackpackAccessContainer>
  );
};

export default BackpackAccessPanel;
