import React from 'react';
import { Button, Frame } from 'react95';
import BackpackAccessPanel from 'components/BackpackAccess';
import styled from 'styled-components';

const WindowContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.material};
  padding: 16px;
`;

const ExampleSection = styled.div`
  margin: 16px 0;
  padding: 12px;
  background: #f0f0f0;
  border: 2px solid #ccc;
  border-radius: 4px;
`;

interface BackpackAccessWindowProps {
  onClose?: () => void;
}

const BackpackAccessWindow: React.FC<BackpackAccessWindowProps> = ({ onClose }) => {
  return (
    <WindowContainer>
      <Frame variant="well" style={{ padding: '16px', marginBottom: '16px' }}>
        <h1 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>🎒 Backpack Trait-Based Access Control</h1>
        <p>
          This system demonstrates how to gate access to different areas or features based on 
          specific backpack NFT traits, similar to how the clique system works for houses.
        </p>
        
        <ExampleSection>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>🔑 Use Cases:</h3>
          <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li><strong>Teddy Bear Lounge:</strong> Only accessible to users with "Base: Teddy" backpacks</li>
            <li><strong>High-Capacity Storage:</strong> Areas requiring minimum slot counts (e.g., 15+ slots)</li>
            <li><strong>Color-Themed Zones:</strong> Orange areas for orange backpacks, blue areas for blue, etc.</li>
            <li><strong>Exclusive Collections:</strong> Special items only for specific trait combinations</li>
            <li><strong>Progressive Access:</strong> More slots = access to higher-tier areas</li>
          </ul>
        </ExampleSection>

        <ExampleSection>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>💡 Implementation Examples:</h3>
          <div style={{ fontSize: '12px', fontFamily: 'monospace', lineHeight: '1.4' }}>
            <p><strong>In a location component:</strong></p>
            <code style={{ display: 'block', background: '#e8e8e8', padding: '8px', margin: '4px 0' }}>
              const &#123; hasBackpackBase &#125; = useBackpackAccess();<br/>
              if (!hasBackpackBase('Teddy')) &#123;<br/>
              &nbsp;&nbsp;return &lt;div&gt;❌ Need a Teddy backpack to enter!&lt;/div&gt;;<br/>
              &#125;
            </code>
            
            <p><strong>For slot-based features:</strong></p>
            <code style={{ display: 'block', background: '#e8e8e8', padding: '8px', margin: '4px 0' }}>
              const &#123; hasMinimumSlots, getTotalSlots &#125; = useBackpackAccess();<br/>
              const canAccessVault = hasMinimumSlots(20);<br/>
              const totalCapacity = getTotalSlots();
            </code>
          </div>
        </ExampleSection>
      </Frame>
      
      <BackpackAccessPanel onClose={onClose} />
    </WindowContainer>
  );
};

export default BackpackAccessWindow;
