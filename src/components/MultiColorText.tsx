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
  return (
    <span 
      className={className}
      style={{ 
        fontSize,
        fontFamily,
        lineHeight: '1.8',
        textShadow: '2px 2px 0px rgba(0,0,0,0.8)'
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
