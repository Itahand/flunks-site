import { useEffect, useState } from "react";
import { ProgressBar } from "react95";
import styled, { keyframes } from "styled-components";

interface Props {
  children?: React.ReactNode;
}

// Animations
const synthwaveGridTilted = keyframes`
  0% { transform: perspective(600px) rotateX(70deg) rotateY(-5deg) translateZ(0px); }
  100% { transform: perspective(600px) rotateX(70deg) rotateY(-5deg) translateZ(-250px); }
`;

const neonPulse = keyframes`
  0%, 100% { 
    text-shadow: 
      0 0 10px rgba(120, 200, 255, 0.8),
      0 0 20px rgba(255, 119, 198, 0.6),
      0 0 30px rgba(120, 119, 198, 0.4);
  }
  50% { 
    text-shadow: 
      0 0 15px rgba(120, 200, 255, 1),
      0 0 30px rgba(255, 119, 198, 0.8),
      0 0 45px rgba(120, 119, 198, 0.6);
  }
`;

const starTwinkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
`;

// Styled Components
const LoaderContainer = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 1fr;
  grid-template-rows: 11fr 1fr;
`;

const TiltedSynthContainer = styled.div`
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.2) 0%, transparent 50%),
    linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%);
  perspective: 600px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const StarField = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
`;

const Star = styled.div<{ delay: number; size: number; x: number; y: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: #fff;
  border-radius: 50%;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  animation: ${starTwinkle} ${props => 2 + Math.random() * 2}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  box-shadow: 0 0 ${props => props.size * 2}px rgba(255, 255, 255, 0.8);
`;

const TiltedSynthGrid = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 220%;
  height: 220%;
  background-image: 
    linear-gradient(rgba(120, 200, 255, 0.4) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 119, 198, 0.4) 1px, transparent 1px);
  background-size: 30px 30px;
  animation: ${synthwaveGridTilted} 2.5s linear infinite;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20%;
    background: linear-gradient(
      135deg,
      rgba(120, 119, 198, 0.3) 0%,
      rgba(255, 119, 198, 0.2) 50%,
      rgba(120, 200, 255, 0.3) 100%
    );
    border-top: 1px solid rgba(120, 200, 255, 0.6);
  }
`;

const MyPlaceSynthText = styled.div`
  color: rgba(120, 200, 255, 1);
  font-size: 16px;
  text-shadow: 
    0 0 10px rgba(120, 200, 255, 0.8),
    0 0 20px rgba(255, 119, 198, 0.6),
    0 0 30px rgba(120, 119, 198, 0.4);
  z-index: 10;
  text-align: center;
  animation: ${neonPulse} 2s ease-in-out infinite;
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.8);
`;

const TiltedGridLoader: React.FC<Props> = ({ children }) => {
  const [percent, setPercent] = useState(0);
  const [complete, setComplete] = useState(false);

  // Generate stars
  const generateStars = () => {
    const stars = [];
    const colors = ['rgba(120, 200, 255, 0.9)', 'rgba(255, 119, 198, 0.8)', 'rgba(120, 119, 198, 0.7)', 'rgba(255, 255, 255, 0.8)'];
    
    for (let i = 0; i < 28; i++) {
      stars.push(
        <Star
          key={i}
          delay={Math.random() * 3}
          size={Math.random() * 3 + 1}
          x={Math.random() * 100}
          y={Math.random() * 100}
          style={{ 
            background: colors[Math.floor(Math.random() * colors.length)]
          }}
        />
      );
    }
    return stars;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((previousPercent) => {
        if (previousPercent === 100) {
          clearInterval(timer);
          setTimeout(() => setComplete(true), 200);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(previousPercent + diff, 100);
      });
    }, 200);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  if (complete) {
    return <>{children}</>;
  }

  return (
    <LoaderContainer>
      <TiltedSynthContainer>
        <StarField>
          {generateStars()}
        </StarField>
        <TiltedSynthGrid />
        <MyPlaceSynthText>
          ◢ M Y P L A C E ◣<br />
          ↗ CONNECTING ↖<br />
          ◣ O N L I N E ◢
        </MyPlaceSynthText>
      </TiltedSynthContainer>
      
      <ProgressContainer>
        <ProgressBar
          value={Math.floor(percent)}
          style={{ width: "300px", marginTop: "10px" }}
        />
        <div style={{ 
          color: 'rgba(120, 200, 255, 1)', 
          fontSize: '12px', 
          marginTop: '8px',
          textShadow: '0 0 10px rgba(120, 200, 255, 0.8)'
        }}>
          Loading... {Math.floor(percent)}%
        </div>
      </ProgressContainer>
    </LoaderContainer>
  );
};

export default TiltedGridLoader;