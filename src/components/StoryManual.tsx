import React, { useState } from 'react';
import styled from 'styled-components';
import CutscenePlayer from './CutscenePlayer';

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

const ManualContainer = styled.div`
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #2a1810 0%, #1a1008 100%);
  z-index: 1000;
  overflow: hidden;
  font-family: 'Courier New', monospace;
`;

const ManualBook = styled.div`
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 20%, rgba(245, 162, 211, 0.1) 0%, transparent 50%),
    linear-gradient(45deg, transparent 40%, rgba(245, 162, 211, 0.05) 50%, transparent 60%);
  background-size: 200px 200px, 100px 100px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ManualHeader = styled.div`
  background: linear-gradient(90deg, #1a1008 0%, #2a1810 50%, #1a1008 100%);
  border-bottom: 3px solid #f5a2d3;
  padding: 20px;
  text-align: center;
  position: relative;
`;

const ManualTitle = styled.h1`
  color: #f5a2d3;
  font-size: clamp(24px, 4vw, 36px);
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 2px;
  font-weight: bold;
`;

const ManualSubtitle = styled.p`
  color: #ffffff;
  font-size: clamp(14px, 2vw, 18px);
  margin: 8px 0 0 0;
  opacity: 0.8;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: #f5a2d3;
  border: 2px solid #f5a2d3;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(245, 162, 211, 0.2);
  }
`;

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
    id: 'chapter-1',
    title: 'Welcome to Flunks High',
    subtitle: 'The beginning of everything. New student orientation and first impressions.',
    unlocked: true,
    thumbnail: '/images/cutscenes/chapter1-thumb.jpg',
    scenes: [
      {
        id: 'scene-1-1',
        image: '/images/cutscenes/school-entrance.jpg',
        lines: [
          'Welcome to Flunks High School, where dreams come to... well, let\'s see.',
          'The morning sun casts long shadows across the parking lot.',
          'Another year begins, but this one feels different somehow.'
        ],
        music: '/sounds/ambient-school.mp3'
      },
      {
        id: 'scene-1-2',
        image: '/images/cutscenes/hallway-first-day.jpg',
        lines: [
          'The halls buzz with nervous energy and fresh possibilities.',
          'Lockers slam shut like tiny thunder, echoing through the corridors.',
          'Every face tells a story waiting to unfold.'
        ]
      }
    ]
  },
  {
    id: 'chapter-2',
    title: 'The Cliques Form',
    subtitle: 'Social hierarchies emerge as students find their tribes.',
    unlocked: true,
    thumbnail: '/images/cutscenes/chapter2-thumb.jpg',
    scenes: [
      {
        id: 'scene-2-1',
        image: '/images/cutscenes/cafeteria-drama.jpg',
        lines: [
          'The cafeteria becomes a battlefield of social politics.',
          'Each table represents a different world, a different set of rules.',
          'Where you sit defines who you are... or does it?'
        ]
      }
    ]
  },
  {
    id: 'chapter-3',
    title: 'Season Zero Begins',
    subtitle: 'The mysterious Season Zero is announced, changing everything.',
    unlocked: false,
    scenes: []
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
      <CutscenePlayer
        scenes={selectedChapter.scenes}
        onComplete={handleCutsceneComplete}
        onClose={handleCutsceneClose}
      />
    );
  }

  return (
    <ManualContainer>
      <ManualBook>
        <ManualHeader>
          <CloseButton onClick={onClose} aria-label="Close manual">
            ✕
          </CloseButton>
          <ManualTitle>📖 THE STORY SO FAR</ManualTitle>
          <ManualSubtitle>Flunks High Chronicles - Interactive Manual</ManualSubtitle>
        </ManualHeader>

        <ChapterGrid>
          {sampleChapters.map((chapter, index) => (
            <ChapterCard
              key={chapter.id}
              unlocked={chapter.unlocked}
              onClick={() => handleChapterClick(chapter)}
            >
              <ChapterNumber>Ch. {index + 1}</ChapterNumber>
              
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
      </ManualBook>
    </ManualContainer>
  );
};

export default StoryManual;