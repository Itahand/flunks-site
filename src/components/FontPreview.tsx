import React, { useState } from 'react';
import styled from 'styled-components';
import DraggableResizeableWindow from 'components/DraggableResizeableWindow';

const FontContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 500px;
  overflow-y: auto;
  background: #c0c0c0;
`;

const FontSample = styled.div<{ fontFamily: string }>`
  padding: 10px;
  border: 2px inset #c0c0c0;
  background: white;
  font-family: ${props => props.fontFamily};
  font-size: 14px;
  line-height: 1.4;
`;

const FontName = styled.div`
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 12px;
  font-weight: bold;
  color: #000080;
  margin-bottom: 5px;
`;

const SelectButton = styled.button`
  padding: 2px 8px;
  border: 2px outset #c0c0c0;
  background: #c0c0c0;
  font-family: 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  cursor: pointer;
  margin-top: 5px;

  &:active {
    border: 2px inset #c0c0c0;
  }
`;

interface FontPreviewProps {
  onClose: () => void;
  onFontSelect: (fontFamily: string) => void;
}

const FontPreview: React.FC<FontPreviewProps> = ({ onClose, onFontSelect }) => {
  const sampleText = "Multiple monitors glow in the darkness. Lines of code scroll endlessly across the screens.";
  
  const retroFonts = [
    { name: 'Classic Monospace', family: "'Courier New', 'Courier', monospace" },
    { name: 'DOS Terminal', family: "'Perfect DOS VGA 437', 'Courier New', monospace" },
    { name: 'Bitmap Classic', family: "'Press Start 2P', 'Courier New', monospace" },
    { name: 'System Font', family: "system-ui, -apple-system, 'Segoe UI', sans-serif" },
    { name: 'Terminal Green', family: "'Monaco', 'Menlo', 'Consolas', monospace" },
    { name: 'Retro Sans', family: "'MS Sans Serif', 'Tahoma', 'Arial', sans-serif" },
    { name: 'Pixelated', family: "'Silkscreen', 'Press Start 2P', monospace" },
    { name: 'Old School', family: "'Chicago', 'Times', serif" },
    { name: 'Computer Modern', family: "'Liberation Mono', 'Courier New', monospace" },
    { name: 'Arcade Classic', family: "'Orbitron', 'Courier New', monospace" },
    { name: 'Matrix Style', family: "'Fira Code', 'Consolas', monospace" },
    { name: 'Windows 95', family: "w95fa, 'MS Sans Serif', sans-serif" },
  ];

  return (
    <DraggableResizeableWindow
      windowsId="font-preview"
      headerTitle="🔤 Font Preview - Choose Your Style"
      onClose={onClose}
      initialWidth="600px"
      initialHeight="500px"
      resizable={true}
    >
      <FontContainer>
        {retroFonts.map((font, index) => (
          <div key={index}>
            <FontName>{font.name}</FontName>
            <FontSample fontFamily={font.family}>
              {sampleText}
            </FontSample>
            <SelectButton onClick={() => onFontSelect(font.family)}>
              Use This Font
            </SelectButton>
          </div>
        ))}
      </FontContainer>
    </DraggableResizeableWindow>
  );
};

export default FontPreview;
