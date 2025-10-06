import React, { useState } from 'react';
import styled from 'styled-components';
import CutscenePlayer from './CutscenePlayer';
import DraggableResizeableWindow from './DraggableResizeableWindow';
import { WINDOW_IDS } from '../fixed';
import { getCurrentBuildMode } from '../utils/buildMode';

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

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 10px;
    gap: 15px;
  }
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

  @media (max-width: 768px) {
    padding: 15px;
    min-height: 120px;
  }

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
    id: 'story-so-far',
    title: 'The Story So Far 📖',
    subtitle: 'The sky looked different back then. Maybe it was brighter… or maybe I just had younger eyes.',
    unlocked: true,
    thumbnail: '/images/cutscenes/main.png',
    scenes: [
      // Scene 1: Opening (main.png)
      {
        id: 'opening',
        image: '/images/cutscenes/main.png',
        lines: [
          'The sky looked different back then. Maybe it was brighter… or maybe I just had younger eyes.'
        ],
        music: '/music/child.mp3'
      },
      // Scene 2: The Town Description (1.png)
      {
        id: 'town-description',
        image: '/images/cutscenes/1.png',
        lines: [
          'The town, however, wasn\'t. It was the same. Same brick buildings, same cracked sidewalks, same old high school sitting on that hill like a castle.'
        ]
      },
      // Scene 3: Arcadia's History (2.png)
      {
        id: 'arcadia-history',
        image: '/images/cutscenes/2.png',
        lines: [
          'It\'s been that way since they founded Arcadia over a hundred years ago.',
          'Folks come and go, dreams flare up and fade out, but this place… this place don\'t change.'
        ]
      },
      // Scene 4: Changing Times (3.png)
      {
        id: 'changing-times',
        image: '/images/cutscenes/3.png',
        lines: [
          'I\'ve seen storefront signs switch names, the kids swap out their playgrounds for video games and CD\'s...'
        ]
      },
      // Scene 5: Friday Night Lights (4.png)
      {
        id: 'friday-nights',
        image: '/images/cutscenes/4.png',
        lines: [
          'I\'ve seen Friday night lights burn for generations of ballplayers, and I\'ve seen the same creek flood every spring like clockwork.',
          'Some call it boring. I call it Arcadia.'
        ]
      },
      // Scene 6: History Repeats (5.png)
      {
        id: 'history-repeats',
        image: '/images/cutscenes/5.png',
        lines: [
          'And if you stick around long enough, you\'ll notice… history has a way of repeating itself here... Sometimes in small ways. Sometimes in ways that\'ll shake the whole town.',
          'And that\'s the thing about Arcadia—no matter how much the sky changes, no matter what logo or name is on the motel, this place never changes.'
        ]
      },
      // Scene 7: The Faces Change (6.png)
      {
        id: 'faces-change',
        image: '/images/cutscenes/6.png',
        lines: [
          'There faces change but the roles stay the same. There\'s the prep. He\'s polished, perfect smile, and carries himself like the whole town is watching — because in a way, they are. People like him have been here forever: the ones who were born with a head start and play the part like it\'s their birthright.'
        ]
      },
      // Scene 8: The Geek (7.png)
      {
        id: 'the-geek',
        image: '/images/cutscenes/7.png',
        lines: [
          'The Geek? Always on the edge of something bigger, a little too smart for the room, a little too weird for everyone else. You can trade the glasses for a hoodie or the textbook for a keyboard, but the role never leaves. There\'s always a geek.'
        ]
      },
      // Scene 9: The Freak (8.png)
      {
        id: 'the-freak',
        image: '/images/cutscenes/8.png',
        lines: [
          'The Freak? The one who won\'t — or can\'t — fit inside the lines. They get whispered about in hallways, judged for every choice of music, clothes, or silence. They burn bright, but always just far enough away to make people nervous.'
        ]
      },
      // Scene 10: The Jock (9.png)
      {
        id: 'the-jock',
        image: '/images/cutscenes/9.png',
        lines: [
          'And the Jock? Muscles, sweat, and Friday nights under the lights. Doesn\'t matter if he\'s lifting trophies or just trying to escape the weight of expectation — he\'s still the one everyone expects to carry the school\'s pride on his back.'
        ]
      },
      // Scene 11: Final Message (final.png)
      {
        id: 'final-scene',
        image: '/images/cutscenes/final.png',
        lines: [
          'High school is a weird time filled with weird people — and that\'s what makes it unforgettable. Everyone carries their own quirks, flaws, and hidden talents. The truth is, you never know when those unique skills will end up mattering most. What might set you apart today could be the very thing that saves the day tomorrow.'
        ]
      }
    ]
  },
  {
    id: 'homecoming',
    title: 'Homecoming 🏈',
    subtitle: 'Thursday: The homecoming parade rolled through town, everything was perfect...',
    unlocked: true, // Will be controlled by build mode
    thumbnail: '/images/cutscenes/homecoming-main.png',
    scenes: [
      // Scene 1: Thursday - Homecoming Parade
      {
        id: 'thursday-parade',
        image: '/images/cutscenes/homecoming-1.png',
        lines: [
          'Thursday: The homecoming parade rolled through town like something out of a dream. Floats wrapped in crimson and gold, the marching band playing our fight song, everyone smiling in the afternoon sun. Looking back now, it all seems brighter than it probably was. But that\'s how memory works, isn\'t it?'
        ],
        music: '/music/homecomingstory.mp3'
      },
      // Scene 2: Thursday Evening - Preparations
      {
        id: 'thursday-prep',
        image: '/images/cutscenes/homecoming-2.png',
        lines: [
          'That evening, the gym glowed with possibility. We stayed late hanging streamers, stringing lights, transforming cinder blocks and hardwood into something magical. The disco ball caught the light just right. Everything felt perfect. We had no idea what was coming.'
        ]
      },
      // Scene 3: Friday Morning - Murmurs Start
      {
        id: 'friday-murmurs',
        image: '/images/cutscenes/homecoming-3.png',
        lines: [
          'Friday morning arrived with whispers we tried to ignore. Something in the teachers\' eyes didn\'t match their reassuring smiles. We pushed it aside, focused on pep rallies and last-minute plans. The murmurs were easy to dismiss when the sun was still shining.'
        ]
      },
      // Scene 4: Friday Afternoon - The Geek
      {
        id: 'friday-geek',
        image: '/images/cutscenes/homecoming-4.png',
        lines: [
          'They\'d known each other from late nights at the arcade, high scores and shared quarters. From tutoring sessions that always ran long, equations turning into real conversations. When the call came, it hit different. Some friendships are built on more than just showing up to the same place.'
        ]
      },
      // Scene 5: Friday Night - The Jock
      {
        id: 'friday-jock',
        image: '/images/cutscenes/homecoming-5.png',
        lines: [
          'The team won that night. Scoreboard blazing, crowd roaring. But they couldn\'t shake the feeling that something was wrong. Early morning workouts together, parties where they\'d always found each other in the crowd. When you know someone like that, you know when something\'s off. Even through the victory, the worry gnawed.'
        ]
      },
      // Scene 6: Saturday Morning - The Freak
      {
        id: 'saturday-freak',
        image: '/images/cutscenes/homecoming-6.png',
        lines: [
          'Saturday morning, the call came. They met at concerts, discovered the same underground bands, ended up at the same parties where the real conversations happened after midnight. That kind of connection doesn\'t just disappear. But when the phone rang, it felt like maybe it had. The news broke everything.'
        ]
      },
      // Scene 7: Saturday Afternoon - The Prep
      {
        id: 'saturday-prep',
        image: '/images/cutscenes/homecoming-7.png',
        lines: [
          'Country club summers and Boy Scout camping trips. They\'d grown up in the same circles, knew each other\'s families, shared history that went back to childhood. When the official announcement came that the dance was cancelled, it wasn\'t just a cancelled dance. It was the end of something that felt permanent.'
        ]
      },
      // Scene 8: Saturday Night - Empty Gym
      {
        id: 'saturday-night',
        image: '/images/cutscenes/homecoming-8.png',
        lines: [
          'Saturday night, the gym sat in darkness. All those decorations we\'d hung with such care just... waiting. The disco ball that should\'ve been spinning caught no light. The silence was deafening. We all felt it, that hollow ache of something stolen.'
        ]
      },
      // Scene 9: Sunday - The Search Begins
      {
        id: 'sunday-search',
        image: '/images/cutscenes/homecoming-9.png',
        lines: [
          'Sunday morning felt surreal. Search parties forming, the whole town mobilizing. Parents with trembling hands holding photos, asking if anyone had seen anything, heard anything. We walked familiar streets that suddenly felt foreign, looking for answers that seemed impossible to find.'
        ]
      },
      // Scene 10: Monday - School Cancelled
      {
        id: 'monday-cancelled',
        image: '/images/cutscenes/homecoming-10.png',
        lines: [
          'Monday, the halls stayed empty. No bells, no voices, no life. Just silence where there should have been the sound of home. We were supposed to be back, comparing stories from the weekend, laughing about the dance. Instead, there was nothing. Just absence.'
        ]
      },
      // Scene 11: The Mystery Remains
      {
        id: 'mystery-remains',
        image: '/images/cutscenes/homecoming-11.png',
        lines: [
          'Looking back now, everything about that week glows with an amber light. The parade, the decorations, the hope. Memory does that—makes the before times shimmer. The mystery of what happened still echoes through these halls. Some questions never get answered. Some losses never stop hurting. We carry them forward, into whatever comes next.'
        ]
      }
    ]
  }
];

const StoryManual: React.FC<StoryManualProps> = ({ onClose }) => {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [playingCutscene, setPlayingCutscene] = useState(false);
  
  // Filter chapters based on build mode - only show Homecoming in build mode
  const buildMode = getCurrentBuildMode();
  const availableChapters = sampleChapters.filter(chapter => {
    if (chapter.id === 'homecoming') {
      return buildMode === 'build'; // Only show actual Homecoming chapter in build mode
    }
    return true; // Show all other chapters including "The Story So Far"
  });

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
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Mobile: Use windowed mode with DraggableResizeableWindow
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
            {availableChapters.map((chapter, index) => (
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
          
          {/* Cutscene in draggable window for mobile */}
          <DraggableResizeableWindow
            windowsId={`cutscene-${selectedChapter.id}`}
            onClose={handleCutsceneClose}
            initialWidth="100%"
            initialHeight="100%"
            resizable={false}
            headerTitle={selectedChapter.title}
            headerIcon="🎬"
            style={{ 
              zIndex: 1000,
              position: 'absolute',
              top: '0px',
              left: '0px',
              width: '100%',
              height: '100%'
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
    } else {
      // Desktop: Use fullscreen mode
      return (
        <CutscenePlayer
          scenes={selectedChapter.scenes}
          onComplete={handleCutsceneComplete}
          onClose={handleCutsceneClose}
          windowed={false}
        />
      );
    }
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
          {availableChapters.map((chapter, index) => (
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