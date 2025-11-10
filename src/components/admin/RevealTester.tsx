import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  min-height: 100vh;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 10px;
  font-size: 36px;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
`;

const Subtitle = styled.p`
  text-align: center;
  color: rgba(255,255,255,0.8);
  margin-bottom: 30px;
  font-size: 14px;
  font-style: italic;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 25px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255,255,255,0.2);
`;

const CardTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: #FFD700;
`;

const NFTImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 12px;
  margin: 0 auto 20px;
  display: block;
  box-shadow: 0 10px 40px rgba(0,0,0,0.4);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const MetadataBox = styled.div`
  background: rgba(0,0,0,0.3);
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  max-height: 400px;
  overflow-y: auto;
`;

const MetadataRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 5px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  
  strong {
    color: #FFD700;
    margin-right: 10px;
  }
  
  span {
    color: #fff;
    text-align: right;
    word-break: break-word;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
  
  ${props => {
    switch(props.variant) {
      case 'danger':
        return `
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          color: white;
          &:hover { background: linear-gradient(135deg, #c0392b 0%, #e74c3c 100%); }
        `;
      case 'secondary':
        return `
          background: rgba(255,255,255,0.2);
          color: white;
          border: 2px solid rgba(255,255,255,0.4);
          &:hover { background: rgba(255,255,255,0.3); }
        `;
      default:
        return `
          background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
          color: white;
          &:hover { 
            background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
            transform: translateY(-2px);
          }
        `;
    }
  }}
`;

const PresetButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
`;

const PresetButton = styled.button`
  padding: 12px;
  border-radius: 8px;
  border: 2px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.1);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.2);
    border-color: rgba(255,255,255,0.5);
    transform: translateY(-2px);
  }
`;

const AnimationContainer = styled.div<{ revealing: boolean }>`
  position: relative;
  
  ${props => props.revealing && `
    animation: revealPulse 1s ease-in-out;
  `}
  
  @keyframes revealPulse {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(0.95) rotate(-2deg); }
    50% { transform: scale(1.05) rotate(2deg); }
    75% { transform: scale(0.98) rotate(-1deg); }
  }
`;

const RevealOverlay = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.9);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const RevealContent = styled.div`
  text-align: center;
  animation: scaleIn 0.5s ease-out;
  
  @keyframes scaleIn {
    from { transform: scale(0.5); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;

const UNREVEALED_IMAGE = 'https://storage.googleapis.com/flunks_public/images/1.png';
const REVEALED_IMAGE = 'https://storage.googleapis.com/flunks_public/images/testmedaddy.png';

interface Metadata {
  [key: string]: string;
}

const PRESETS = {
  simple: {
    name: 'Simple Reveal (Image Only)',
    unrevealed: {
      name: 'Paradise Motel',
      description: 'A mysterious placeholder NFT...',
      image: UNREVEALED_IMAGE,
      revealed: 'false',
      type: 'mystery',
      rarity: 'common'
    },
    revealed: {
      name: 'Paradise Motel',
      description: 'A mysterious placeholder NFT...',
      image: REVEALED_IMAGE,
      revealed: 'true',
      type: 'mystery',
      rarity: 'common'
    }
  },
  upgrade: {
    name: 'Rarity Upgrade',
    unrevealed: {
      name: 'Paradise Motel Key',
      description: 'A basic key...',
      image: UNREVEALED_IMAGE,
      revealed: 'false',
      type: 'key',
      rarity: 'common',
      power: '1'
    },
    revealed: {
      name: 'Paradise Motel Master Key',
      description: 'The legendary master key!',
      image: REVEALED_IMAGE,
      revealed: 'true',
      type: 'legendary_key',
      rarity: 'legendary',
      power: '10',
      special_ability: 'unlock_all_rooms',
      glow: 'golden'
    }
  },
  transform: {
    name: 'Complete Transformation',
    unrevealed: {
      name: 'Mystery Box',
      description: 'What could be inside?',
      image: UNREVEALED_IMAGE,
      revealed: 'false',
      type: 'mystery_box',
      rarity: 'unknown'
    },
    revealed: {
      name: 'Paradise Motel Legendary Patch',
      description: 'An exclusive legendary patch from the Paradise Motel!',
      image: REVEALED_IMAGE,
      revealed: 'true',
      type: 'patch',
      category: 'legendary',
      rarity: 'legendary',
      color: 'rainbow',
      special_edition: 'true',
      unlock_date: '2025-11-10',
      collector_rank: '5'
    }
  },
  achievement: {
    name: 'Achievement Unlock',
    unrevealed: {
      name: 'Locked Achievement',
      description: 'Complete objectives to unlock...',
      image: UNREVEALED_IMAGE,
      revealed: 'false',
      type: 'achievement',
      status: 'locked'
    },
    revealed: {
      name: 'Paradise Motel Champion',
      description: 'Awarded for mastering all Paradise Motel challenges!',
      image: REVEALED_IMAGE,
      revealed: 'true',
      type: 'achievement',
      status: 'unlocked',
      achievement: 'paradise_motel_master',
      completion_date: '2025-11-10',
      bonus_gum: '500',
      special_ability: 'motel_expert'
    }
  },
  retro90s: {
    name: '90s Retro VHS',
    unrevealed: {
      name: 'Mystery VHS Tape',
      description: 'Rewind and play...',
      image: UNREVEALED_IMAGE,
      revealed: 'false',
      type: 'tape',
      rarity: 'common',
      era: 'unknown'
    },
    revealed: {
      name: 'Flunks High: The Lost Episode',
      description: 'A legendary VHS recording from 1995! Features scan lines, tracking issues, and authentic VHS artifacts.',
      image: REVEALED_IMAGE,
      revealed: 'true',
      type: 'vhs_tape',
      rarity: 'legendary',
      era: '1995',
      format: 'VHS',
      quality: 'tracking_issues',
      aesthetic: 'scanlines',
      nostalgia_level: '9000',
      rewind: 'be_kind'
    }
  },
  vintage: {
    name: 'Vintage Photo',
    unrevealed: {
      name: 'Blank Polaroid',
      description: 'Waiting to develop...',
      image: UNREVEALED_IMAGE,
      revealed: 'false',
      type: 'photo',
      condition: 'undeveloped'
    },
    revealed: {
      name: 'Paradise Motel - Grand Opening 1962',
      description: 'A rare vintage photograph from the motel\'s grand opening. Authentic sepia tone, aged paper texture, slight coffee stain on corner.',
      image: REVEALED_IMAGE,
      revealed: 'true',
      type: 'vintage_photo',
      year: '1962',
      condition: 'aged',
      tone: 'sepia',
      rarity: 'antique',
      texture: 'faded_paper',
      historical_value: 'high',
      coffee_stain: 'authentic'
    }
  },
  neon80s: {
    name: 'Neon 80s Synthwave',
    unrevealed: {
      name: 'Encrypted Floppy Disk',
      description: 'Insert disk to boot...',
      image: UNREVEALED_IMAGE,
      revealed: 'false',
      type: 'disk',
      format: '3.5_floppy'
    },
    revealed: {
      name: 'Paradise Motel: Neon Nights',
      description: 'A synthwave masterpiece! Glowing pink and cyan neon lights, palm trees silhouette, retro sunset grid.',
      image: REVEALED_IMAGE,
      revealed: 'true',
      type: 'neon_art',
      aesthetic: 'synthwave',
      colors: 'pink_cyan_purple',
      vibe: 'outrun',
      decade: '1980s',
      glow: 'neon',
      soundtrack: 'synthpop',
      coolness: 'radical'
    }
  },
  basic1: {
    name: 'Basic - Subtle Upgrade',
    unrevealed: {
      name: 'Standard Access Pass',
      description: 'Basic tier access',
      image: UNREVEALED_IMAGE,
      revealed: 'false',
      type: 'pass',
      tier: 'standard'
    },
    revealed: {
      name: 'Standard Access Pass',
      description: 'Basic tier access - verified',
      image: REVEALED_IMAGE,
      revealed: 'true',
      type: 'pass',
      tier: 'standard',
      status: 'verified'
    }
  },
  basic2: {
    name: 'Basic - Color Variant',
    unrevealed: {
      name: 'Room Key',
      description: 'A simple room key',
      image: UNREVEALED_IMAGE,
      revealed: 'false',
      type: 'key',
      color: 'silver'
    },
    revealed: {
      name: 'Room Key',
      description: 'A simple room key',
      image: REVEALED_IMAGE,
      revealed: 'true',
      type: 'key',
      color: 'gold'
    }
  }
};

export const RevealTester: React.FC = () => {
  const [unrevealedMetadata, setUnrevealedMetadata] = useState<Metadata>(PRESETS.simple.unrevealed);
  const [revealedMetadata, setRevealedMetadata] = useState<Metadata>(PRESETS.simple.revealed);
  const [revealing, setRevealing] = useState(false);
  const [showRevealOverlay, setShowRevealOverlay] = useState(false);

  const loadPreset = (presetKey: keyof typeof PRESETS) => {
    const preset = PRESETS[presetKey];
    setUnrevealedMetadata(preset.unrevealed);
    setRevealedMetadata(preset.revealed);
  };

  const simulateReveal = () => {
    setRevealing(true);
    setShowRevealOverlay(true);
    
    setTimeout(() => {
      setShowRevealOverlay(false);
      setRevealing(false);
    }, 2000);
  };

  const renderMetadata = (metadata: Metadata) => {
    return Object.entries(metadata).map(([key, value]) => (
      <MetadataRow key={key}>
        <strong>{key}:</strong>
        <span>{value}</span>
      </MetadataRow>
    ));
  };

  return (
    <Container>
      <Title>🎭 NFT Reveal Tester</Title>
      <Subtitle>⚠️ flunks-build ONLY - Preview different reveal scenarios</Subtitle>

      <PresetButtons>
        <PresetButton onClick={() => loadPreset('simple')}>
          🎨 Simple Reveal
        </PresetButton>
        <PresetButton onClick={() => loadPreset('upgrade')}>
          ⬆️ Rarity Upgrade
        </PresetButton>
        <PresetButton onClick={() => loadPreset('transform')}>
          ✨ Full Transform
        </PresetButton>
        <PresetButton onClick={() => loadPreset('achievement')}>
          🏆 Achievement
        </PresetButton>
        <PresetButton onClick={() => loadPreset('retro90s')}>
          📼 90s VHS
        </PresetButton>
        <PresetButton onClick={() => loadPreset('vintage')}>
          📷 Vintage Photo
        </PresetButton>
        <PresetButton onClick={() => loadPreset('neon80s')}>
          🌴 80s Neon
        </PresetButton>
        <PresetButton onClick={() => loadPreset('basic1')}>
          ⚪ Basic Upgrade
        </PresetButton>
        <PresetButton onClick={() => loadPreset('basic2')}>
          🔑 Color Swap
        </PresetButton>
      </PresetButtons>

      <Grid>
        {/* BEFORE (Unrevealed) */}
        <Card>
          <CardTitle>BEFORE (Unrevealed)</CardTitle>
          <AnimationContainer revealing={false}>
            <NFTImage src={unrevealedMetadata.image} alt="Unrevealed" />
          </AnimationContainer>
          <MetadataBox>
            {renderMetadata(unrevealedMetadata)}
          </MetadataBox>
        </Card>

        {/* AFTER (Revealed) */}
        <Card>
          <CardTitle>AFTER (Revealed)</CardTitle>
          <AnimationContainer revealing={revealing}>
            <NFTImage src={revealedMetadata.image} alt="Revealed" />
          </AnimationContainer>
          <MetadataBox>
            {renderMetadata(revealedMetadata)}
          </MetadataBox>
        </Card>
      </Grid>

      <Button onClick={simulateReveal}>
        ✨ Simulate Reveal Animation
      </Button>

      <Card style={{ marginTop: '30px' }}>
        <CardTitle>📝 How This Would Work</CardTitle>
        <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
          <p><strong>1. Mint unrevealed NFT</strong> with placeholder image (left)</p>
          <p><strong>2. User clicks reveal button</strong> on your website</p>
          <p><strong>3. Transaction updates metadata</strong> via contract's reveal() function</p>
          <p><strong>4. NFT transforms</strong> to revealed state (right)</p>
          <p><strong>5. Same NFT ID</strong> - just new image & traits!</p>
        </div>
      </Card>

      {/* Reveal Animation Overlay */}
      <RevealOverlay show={showRevealOverlay}>
        <RevealContent>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>✨</div>
          <h2 style={{ fontSize: '48px', color: '#FFD700', marginBottom: '20px' }}>
            REVEALING...
          </h2>
          <div style={{ fontSize: '24px', color: 'white' }}>
            NFT Transforming...
          </div>
        </RevealContent>
      </RevealOverlay>
    </Container>
  );
};

export default RevealTester;
