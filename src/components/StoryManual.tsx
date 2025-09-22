import React, { useState } from 'react';
import styled from 'styled-components';
import CutscenePlayer from './CutscenePlayer';
import DraggableResizeableWindow from './DraggableResizeableWindow';
import { WINDOW_IDS } from '../fixed';

interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  scenes: Array<{
    id: string;
    image: string;
    lines: string[];
    music?: string;
  }>;
  unlocked: boolean;
  thumbnail?: string;
}

interface StoryManualProps {
  onClose: () => void;
}

const ChapterGrid = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ChapterCard = styled.div<{ unlocked: boolean }>`
  background: ${props => props.unlocked ? 
    'linear-gradient(135deg, rgba(245, 162, 211, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)' :
    'linear-gradient(135deg, rgba(100, 100, 100, 0.1) 0%, rgba(50, 50, 50, 0.8) 100%)'
  };
  border: 2px solid ${props => props.unlocked ? '#f5a2d3' : '#666'};
  border-radius: 12px;
  padding: 20px;
  cursor: ${props => props.unlocked ? 'pointer' : 'not-allowed'};
  transition: all 0.3s ease;
  position: relative;
  opacity: ${props => props.unlocked ? 1 : 0.6};

  &:hover {
    ${props => props.unlocked && `
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(245, 162, 211, 0.3);
      border-color: #ff69b4;
    `}
  }
`;

const ChapterThumbnail = styled.div<{ bgImage?: string }>`
  width: 100%;
  height: 120px;
  background: ${props => props.bgImage ? 
    `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${props.bgImage})` :
    'linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333), linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333)'
  };
  background-size: ${props => props.bgImage ? 'cover' : '10px 10px'};
  background-position: ${props => props.bgImage ? 'center' : '0 0, 5px 5px'};
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(245, 162, 211, 0.3);
`;

const ChapterNumber = styled.div`
  position: absolute;
  top: -10px;
  left: 15px;
  background: #f5a2d3;
  color: #000;
  padding: 5px 10px;
  border-radius: 15px;
  font-weight: bold;
  font-size: 14px;
`;

const ChapterTitle = styled.h3`
  color: #f5a2d3;
  font-size: 18px;
  margin: 0 0 8px 0;
  font-weight: bold;
`;

const ChapterSubtitle = styled.p`
  color: #ffffff;
  font-size: 14px;
  margin: 0;
  opacity: 0.8;
  line-height: 1.4;
`;

const LockedIcon = styled.div`
  font-size: 40px;
  color: #666;
`;

const PlayIcon = styled.div`
  font-size: 40px;
  color: #f5a2d3;
  opacity: 0.8;
`;

// Sample chapter data - this would come from your game state/progress
const sampleChapters: Chapter[] = [
  {
    id: 'homecoming',
    title: 'The Story So Far',
    subtitle: 'The sky seems like it was a different color back then. Maybe it was brighter… or maybe I just had younger eyes.',
    unlocked: true,
    thumbnail: '/images/cutscenes/main.png',
    scenes: [
      // Scene 1: Welcome to Arcadia Sign (main.png)
      {
        id: 'welcome-sign',
        image: '/images/cutscenes/main.png',
        lines: [
          'Welcome to Arcadia, Lancaster County. Population: 15,847.',
          'Est. 1854. The same wooden sign that\'s greeted visitors for decades.',
          'Some say this place never changes. Others say that\'s exactly the problem.',
          'But tonight... tonight feels different.'
        ],
        music: '/music/child.mp3'
      },
      // Scene 2: Town Street View (1.png)
      {
        id: 'town-street',
        image: '/images/cutscenes/1.png',
        lines: [
          'Main Street stretches out like a time capsule.',
          'The same brick buildings, the same faded shop signs.',
          'Miller\'s Hardware. Betty\'s Diner. The old movie theater that never quite reopened.',
          'Everything exactly where it was when we were kids.'
        ]
      },
      // Scene 3: High School on the Hill (2.png)
      {
        id: 'school-hill',
        image: '/images/cutscenes/2.png',
        lines: [
          'And there it is. Arcadia High School, sitting on that hill like a castle.',
          'Four years of our lives happened behind those walls.',
          'Friendships. Heartbreaks. Dreams that seemed so big back then.',
          'Tonight\'s homecoming. The night everything comes full circle.'
        ]
      },
      // Scene 4: Memory Lane (3.png) 
      {
        id: 'memories',
        image: '/images/cutscenes/3.png',
        lines: [
          'We used to think we\'d conquer the world after graduation.',
          'Some of us left. Some of us stayed. Some of us came back.',
          'But tonight, we\'re all seventeen again.',
          'Welcome home, Flunks. Let\'s see what stories we write tonight.'
        ]
      }
    ]
  }
];

const StoryManual: React.FC<StoryManualProps> = ({ onClose }) => {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [playingCutscene, setPlayingCutscene] = useState(false);

  const handleChapterClick = (chapter: Chapter) => {
    if (!chapter.unlocked) return;
    setSelectedChapter(chapter);
    setPlayingCutscene(true);
  };

  const handleCutsceneComplete = () => {
    setPlayingCutscene(false);
    setSelectedChapter(null);
  };

  const handleCutsceneClose = () => {
    setPlayingCutscene(false);
    setSelectedChapter(null);
  };

  if (playingCutscene && selectedChapter) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #2a1810 0%, #1a1008 100%)',
        height: '100%',
        overflow: 'hidden',
        fontFamily: 'Courier New, monospace',
        padding: '20px',
        position: 'relative'
      }}>
        {/* Chapter selection in background */}
        <ChapterGrid style={{ opacity: 0.3, pointerEvents: 'none' }}>
          {sampleChapters.map((chapter, index) => (
            <ChapterCard
              key={chapter.id}
              unlocked={chapter.unlocked}
            >
              <ChapterNumber>{index + 1}</ChapterNumber>
              <ChapterThumbnail bgImage={chapter.thumbnail} />
              <ChapterTitle>{chapter.title}</ChapterTitle>
              <ChapterSubtitle>{chapter.subtitle}</ChapterSubtitle>
            </ChapterCard>
          ))}
        </ChapterGrid>
        
        {/* Cutscene in draggable window */}
        <DraggableResizeableWindow
          windowsId={`cutscene-${selectedChapter.id}`}
          onClose={handleCutsceneClose}
          initialWidth="1200px"
          initialHeight="700px"
          resizable={true}
          headerTitle={selectedChapter.title}
          headerIcon="🎬"
          style={{ 
            zIndex: 1000,
            position: 'absolute',
            top: '20px',
            left: '50px'
          }}
        >
          <CutscenePlayer
            scenes={selectedChapter.scenes}
            onComplete={handleCutsceneComplete}
            onClose={handleCutsceneClose}
            windowed={true}
          />
        </DraggableResizeableWindow>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #2a1810 0%, #1a1008 100%)',
      height: '100%',
      overflow: 'hidden',
      fontFamily: 'Courier New, monospace',
      padding: '20px'
    }}>
      <ChapterGrid>
          {sampleChapters.map((chapter, index) => (
            <ChapterCard
              key={chapter.id}
              unlocked={chapter.unlocked}
              onClick={() => handleChapterClick(chapter)}
            >
              <ChapterThumbnail bgImage={chapter.thumbnail}>
                {chapter.unlocked ? (
                  <PlayIcon>▶️</PlayIcon>
                ) : (
                  <LockedIcon>🔒</LockedIcon>
                )}
              </ChapterThumbnail>

              <ChapterTitle>{chapter.title}</ChapterTitle>
              <ChapterSubtitle>
                {chapter.unlocked ? chapter.subtitle : 'Complete previous chapters to unlock'}
              </ChapterSubtitle>
            </ChapterCard>
          ))}
        </ChapterGrid>
      </div>
    );
  };

export default StoryManual;