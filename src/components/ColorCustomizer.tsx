import React, { useState } from 'react';
import styled from 'styled-components';
import DraggableResizeableWindow from 'components/DraggableResizeableWindow';
import { CliqueType, getCliqueColors, getCliqueIcon } from 'utils/cliqueColors';

const ColorContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 600px;
  overflow-y: auto;
  background: #c0c0c0;
`;

const CliqueSection = styled.div`
  border: 2px inset #c0c0c0;
  padding: 15px;
  background: white;
`;

const CliqueHeader = styled.div`
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColorInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 5px 0;
`;

const ColorSwatch = styled.div<{ color: string }>`
  width: 30px;
  height: 20px;
  border: 1px solid #000;
  background: ${props => props.color};
`;

const HexInput = styled.input`
  font-family: 'Courier New', monospace;
  font-size: 12px;
  padding: 2px 4px;
  border: 1px inset #c0c0c0;
  width: 80px;
`;

const PreviewButton = styled.button`
  padding: 4px 8px;
  border: 2px outset #c0c0c0;
  background: #c0c0c0;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  cursor: pointer;
  margin-left: 10px;

  &:active {
    border: 2px inset #c0c0c0;
  }
`;

const ApplyAllButton = styled.button`
  padding: 8px 16px;
  border: 2px outset #c0c0c0;
  background: #008000;
  color: white;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 15px;

  &:active {
    border: 2px inset #c0c0c0;
  }
`;

interface ColorCustomizerProps {
  onClose: () => void;
  onColorChange: (clique: CliqueType, color: string) => void;
  onPreview: (clique: CliqueType, color: string) => void;
}

const ColorCustomizer: React.FC<ColorCustomizerProps> = ({ onClose, onColorChange, onPreview }) => {
  const [colors, setColors] = useState(() => {
    const initial: Record<CliqueType, string> = {} as any;
    const cliques: CliqueType[] = ['GEEK', 'JOCK', 'PREP', 'FREAK'];
    cliques.forEach(clique => {
      initial[clique] = getCliqueColors(clique).primary;
    });
    return initial;
  });

  const updateColor = (clique: CliqueType, value: string) => {
    setColors(prev => ({ ...prev, [clique]: value }));
  };

  const handlePreview = (clique: CliqueType) => {
    onPreview(clique, colors[clique]);
  };

  const handleApplyAll = () => {
    Object.keys(colors).forEach(clique => {
      onColorChange(clique as CliqueType, colors[clique as CliqueType]);
    });
    onClose();
  };

  const cliques: CliqueType[] = ['GEEK', 'JOCK', 'PREP', 'FREAK'];

  return (
    <DraggableResizeableWindow
      windowsId="color-customizer"
      headerTitle="🎨 Color Customizer - Hex Codes"
      onClose={onClose}
      initialWidth="400px"
      initialHeight="500px"
      resizable={true}
    >
      <ColorContainer>
        <div style={{ fontFamily: "'MS Sans Serif', Arial, sans-serif", fontSize: '12px', marginBottom: '10px' }}>
          Enter hex codes (like #FF0000 for red) to customize dialog colors:
        </div>
        
        {cliques.map(clique => (
          <CliqueSection key={clique}>
            <CliqueHeader>
              {getCliqueIcon(clique)} {clique} HOUSE
            </CliqueHeader>
            
            <ColorInput>
              <ColorSwatch color={colors[clique]} />
              <HexInput
                type="text"
                value={colors[clique]}
                onChange={(e) => updateColor(clique, e.target.value)}
                placeholder="#FF0000"
              />
              <PreviewButton onClick={() => handlePreview(clique)}>
                Preview
              </PreviewButton>
            </ColorInput>
          </CliqueSection>
        ))}

        <div style={{ fontFamily: "'MS Sans Serif', Arial, sans-serif", fontSize: '11px', color: '#666' }}>
          Popular 90s Pastel colors:<br/>
          • Mint Green: #90EE90<br/>
          • Coral Pink: #FFB6C1<br/>
          • Sky Blue: #87CEEB<br/>
          • Lavender: #DDA0DD<br/>
          • Peach: #FFDAB9<br/>
          • Aqua: #7FFFD4<br/>
          • Rose: #F0E68C<br/>
          • Lilac: #B19CD9
        </div>

        <ApplyAllButton onClick={handleApplyAll}>
          Apply All Changes
        </ApplyAllButton>
      </ColorContainer>
    </DraggableResizeableWindow>
  );
};

export default ColorCustomizer;
