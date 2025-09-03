import React from 'react';

interface MultiColorTextProps {
  text: string;
  colors: string[];
  fontSize?: string;
  fontFamily?: string;
  className?: string;
}

const MultiColorText: React.FC<MultiColorTextProps> = ({ 
  text, 
  colors, 
  fontSize = '18px',
  fontFamily = "'Press Start 2P', monospace",
  className = ""
}) => {
  // Calculate responsive font size
  const getResponsiveFontSize = (baseFontSize: string) => {
    const sizeValue = parseInt(baseFontSize);
    return {
      // Use CSS clamp for responsive sizing
      fontSize: `clamp(${Math.max(8, Math.floor(sizeValue * 0.5))}px, ${Math.floor(sizeValue * 0.8)}vw, ${sizeValue}px)`
    };
  };

  return (
    <span 
      className={className}
      style={{ 
        ...getResponsiveFontSize(fontSize),
        fontFamily,
        lineHeight: '1.8',
        textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        hyphens: 'auto',
        maxWidth: '100%',
        display: 'inline-block'
      }}
    >
      {text.split('').map((char, index) => (
        <span
          key={index}
          style={{
            color: colors[index % colors.length],
            display: char === ' ' ? 'inline' : 'inline',
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export default MultiColorText;
