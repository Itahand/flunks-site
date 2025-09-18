import styled from "styled-components";
import { useWindowsContext } from "contexts/WindowsContext";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import { WINDOW_IDS } from "fixed";
import AppLoader from "components/AppLoader";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useCliqueAccess, CliqueType } from "hooks/useCliqueAccess";
import MySpaceProfile from "../components/MySpaceProfile";
import Image from "next/image";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
`;

const HeaderText = styled.h1`
  font-family: 'Press Start 2P', monospace;
  color: #00ffff;
  font-size: 24px;
  text-align: center;
  text-shadow: 
    0 0 10px #00ffff,
    0 0 20px #00ffff,
    0 0 30px #00ffff;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const CharacterGrid = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 800px;
  
  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const CharacterSlot = styled.div<{ locked: boolean }>`
  position: relative;
  width: 150px;
  height: 320px;
  border: 3px solid ${props => props.locked ? '#444' : '#00ffff'};
  border-radius: 12px;
  cursor: ${props => props.locked ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  background: ${props => props.locked 
    ? 'linear-gradient(135deg, #1a1a1a, #333)' 
    : 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 255, 255, 0.05))'
  };
  filter: ${props => props.locked ? 'grayscale(100%)' : 'none'};
  opacity: ${props => props.locked ? 0.5 : 1};
  overflow: hidden;
  
  &:hover {
    ${props => !props.locked && `
      border-color: #ff00ff;
      box-shadow: 
        0 0 20px rgba(0, 255, 255, 0.5),
        inset 0 0 20px rgba(0, 255, 255, 0.1);
      transform: translateY(-5px) scale(1.05);
    `}
  }
  
  &:active {
    ${props => !props.locked && `
      transform: translateY(-2px) scale(1.02);
    `}
  }
  
  @media (max-width: 768px) {
    width: 120px;
    height: 260px;
  }
`;

const CharacterImage = styled.div`
  width: 100%;
  height: 85%;
  position: relative;
  overflow: hidden;
`;

const CharacterLabel = styled.div<{ locked: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 15%;
  background: ${props => props.locked 
    ? 'linear-gradient(90deg, #333, #555)' 
    : 'linear-gradient(90deg, #00ffff, #ff00ff)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Press Start 2P', monospace;
  font-size: 10px;
  color: ${props => props.locked ? '#888' : '#000'};
  font-weight: bold;
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    font-size: 8px;
  }
`;

const LockOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: #666;
  padding: 8px 12px;
  border-radius: 8px;
  font-family: 'Press Start 2P', monospace;
  font-size: 8px;
  text-align: center;
  z-index: 10;
`;

const WalletStatus = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00ffff;
  border-radius: 8px;
  padding: 10px 15px;
  font-family: 'Press Start 2P', monospace;
  font-size: 10px;
  color: #00ffff;
  
  @media (max-width: 768px) {
    position: relative;
    top: auto;
    right: auto;
    margin-bottom: 20px;
    font-size: 8px;
  }
`;

const characterSlots = [
  { clique: "the-nerds", imageId: "images/myplace/myplace-geek", label: "Geek", color: "#059669" },
  { clique: "the-populars", imageId: "images/myplace/myspace-prep", label: "Prep", color: "#ff69b4" },
  { clique: "the-jocks", imageId: "images/myplace/myplace-jock", label: "Jock", color: "#1e3a8a" },
  { clique: "the-outcasts", imageId: "images/myplace/myplace-freak", label: "Freak", color: "#2c1810" },
];

const MyPlace = () => {
  const { closeWindow, openWindow } = useWindowsContext();
  const { user } = useDynamicContext();
  const { hasAccess } = useCliqueAccess();

  const userHasTrait = (clique: string) => {
    // Map our clique names to CliqueType
    const cliqueMap: Record<string, CliqueType> = {
      'the-nerds': 'GEEK',
      'the-populars': 'PREP', 
      'the-jocks': 'JOCK',
      'the-outcasts': 'FREAK',
      'the-artists': 'GEEK', // Map to GEEK for now
      'the-rebels': 'FREAK', // Map to FREAK for now
    };
    
    const cliqueType = cliqueMap[clique];
    return cliqueType ? hasAccess(cliqueType) : false;
  };

  const handleCharacterClick = (character: typeof characterSlots[0]) => {
    const locked = !userHasTrait(character.clique);
    
    if (locked) {
      // Show a message about needing to connect wallet or own an NFT from this clique
      return;
    }

    // Open MySpace-style profile page (we'll create these next)
    openWindow({
      key: `${character.clique}_profile`,
      window: (
        <DraggableResizeableWindow
          windowsId={`${character.clique}_profile`}
          headerTitle={`${character.label}'s MyPlace Profile`}
          onClose={() => closeWindow(`${character.clique}_profile`)}
          initialWidth="90%"
          initialHeight="90%"
          resizable={true}
        >
          <MySpaceProfile clique={character.clique} />
        </DraggableResizeableWindow>
      ),
    });
  };

  return (
    <AppLoader bgImage="/images/loading/bootup.webp">
      <DraggableResizeableWindow
        windowsId={WINDOW_IDS.MYPLACE}
        onClose={() => closeWindow(WINDOW_IDS.MYPLACE)}
        initialWidth="100%"
        initialHeight="100%"
        headerTitle="MyPlace - Select Your Class"
        headerIcon="/images/icons/myplace.png"
        resizable={false}
      >
        <Container>
          <WalletStatus>
            FlunkOS.EXE
            <br />
            Wallet: {user ? "Connected" : "Not connected"}
          </WalletStatus>
          
          <Header>
            <HeaderText>SELECT YOUR CLASS</HeaderText>
          </Header>
          
          <CharacterGrid>
            {characterSlots.map((character) => {
              const locked = !userHasTrait(character.clique);
              return (
                <CharacterSlot
                  key={character.clique}
                  locked={locked}
                  onClick={() => handleCharacterClick(character)}
                  title={locked ? `Requires ${character.label} NFT` : `Enter ${character.label} profile`}
                >
                  <CharacterImage>
                    <Image
                      src={`/${character.imageId}.png`}
                      alt={character.label}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </CharacterImage>
                  <CharacterLabel locked={locked}>
                    {character.label}
                  </CharacterLabel>
                  {locked && (
                    <LockOverlay>
                      LOCKED
                    </LockOverlay>
                  )}
                </CharacterSlot>
              );
            })}
          </CharacterGrid>
        </Container>
      </DraggableResizeableWindow>
    </AppLoader>
  );
};

export default MyPlace;
