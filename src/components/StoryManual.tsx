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
    thumbnail: '/images/cutscenes/homecoming/homecoming-main.png',
    scenes: [
      // Scene 1: Thursday - The Dream
      {
        id: 'thursday-parade',
        image: '/images/cutscenes/homecoming/homecoming-main.png',
        lines: [
          'Thursday felt like something out of a dream. The parade crawled down Main Street, floats wrapped in pink and black, the marching band echoing between brick buildings. Kids chased candy in the street. The air smelled like popcorn and autumn. Looking back, it all feels brighter than it probably was — that soft, golden kind of memory you can\'t quite trust.'
        ],
        music: '/music/homecomingstory.mp3'
      },
      // Scene 2: Homecoming Court
      {
        id: 'homecoming-court',
        image: '/images/cutscenes/homecoming/homecoming-1.png',
        lines: [
          'The usual suspects lined up for Homecoming Court — the ones everyone expected. Smiles that had been in yearbooks since kindergarten, names the town could recite by heart. Sons and daughters of the same families who\'d walked the halls decades before.',
          '',
          'In a place like this, it\'s hard to fall through the cracks — everyone knows you, everyone waves. Generations born, raised, and rooted here like the maples out by the football field.'
        ]
      },
      // Scene 3: Friday Morning
      {
        id: 'friday-morning',
        image: '/images/cutscenes/homecoming/homecoming-2.png',
        lines: [
          'Friday morning carried a weird quiet. Teachers whispering in doorways, eyes darting just long enough to notice. We brushed it off — chalked it up to nerves before the big game. The pep rally roared like normal, but underneath the cheers, something heavy was starting to settle in.'
        ]
      },
      // Scene 4: Friday Night Game
      {
        id: 'friday-night-game',
        image: '/images/cutscenes/homecoming/homecoming-3.png',
        lines: [
          'By Friday night, the whispers had turned into something heavier — the kind of quiet that hums beneath the noise. The bleachers were packed, the band still played, but people were starting to look at each other instead of the field. The players didn\'t hear it — not yet. They were locked in, chasing a win under the glare of the lights.',
          '',
          'And when that last-minute touchdown hit, the crowd erupted like always… but the cheers felt thinner this time. Somewhere between the echoes, you could feel it — that something wasn\'t right, and no one wanted to be the first to say it.'
        ]
      },
      // Scene 5: The Geek
      {
        id: 'the-geek',
        image: '/images/cutscenes/homecoming/homecoming-4.png',
        lines: [
          'They\'d bonded over late-night arcade runs, sharing quarters and secrets between flashing screens. Study sessions that turned into stories, inside jokes no one else got. When the call came, it didn\'t make sense. Some connections just hit deeper — like a code only two people ever knew.'
        ]
      },
      // Scene 6: The Jock
      {
        id: 'the-jock',
        image: '/images/cutscenes/homecoming/homecoming-5.png',
        lines: [
          'He\'d known Flunko forever. Same babysitter, same muddy backyard, same scraped knees from summers that felt like they\'d never end. Even when they grew up on opposite sides of town — one with a beat-up truck, the other with hand-me-down cleats — it didn\'t matter. They were teammates, brothers in all but name.',
          '',
          'Friday nights usually hit different: brothers in arms going into battle. But last night without Flunko on the sidelines he could tell, something was off. He couldn\'t shake the feeling — that strange ache that comes when a piece of your past doesn\'t show up where it always should.'
        ]
      },
      // Scene 7: The Freak
      {
        id: 'the-freak',
        image: '/images/cutscenes/homecoming/homecoming-6.png',
        lines: [
          'Morning came slow. News spread faster. They\'d met through static-filled mixtapes and midnight basement shows. Two people who found each other in the noise. When the phone rang, everything tilted. The songs they used to share suddenly sounded hollow.'
        ]
      },
      // Scene 8: The Prep
      {
        id: 'the-prep',
        image: '/images/cutscenes/homecoming/homecoming-7.png',
        lines: [
          'They\'d known each other since treehouse summers and picture-day smiles. They were in the same troop for the scouts for as long as they can remember. The kind of friendship you think will just always be there.',
          '',
          'The news hit like a ton of bricks. The sudden sharp, numb feeling spread throughout his body like a chill from the first morning freeze of the year. He heard the sounds, but stopped processing the words. "Your friend is missing" and then everything goes blank...'
        ]
      },
      // Scene 9: The Empty Gym
      {
        id: 'empty-gym',
        image: '/images/cutscenes/homecoming/homecoming-gym.png',
        lines: [
          'The gym was supposed to glow that night — decked out in silver streamers, cardboard stars, and an MTV theme everyone was looking forward to. They\'d even built a makeshift Moon Man for the stage, spray-painted and glittered under the cheap lights. It should\'ve been loud — music shaking the floor, laughter echoing off the bleachers.',
          '',
          'Instead, it sat still. Decorations hung like ghosts in the dark, the disco ball catching only the glow of emergency lights. While the gym waited, everyone else was out searching — flashlights in hand, hearts pounding, trying to find what the night had stolen.'
        ]
      },
      // Scene 10: Sunday Search
      {
        id: 'sunday-search',
        image: '/images/cutscenes/homecoming/homecoming-8.png',
        lines: [
          'By Sunday, the whole town was out. Scouring the ditches, retracing steps. Parents calling names into the wind. Streets that once felt safe started to feel like someone else\'s town. Every corner held a maybe, every sound felt like hope trying to find its way home.'
        ]
      },
      // Scene 11: Missing Posters
      {
        id: 'missing-posters',
        image: '/images/cutscenes/homecoming/homecoming-9.png',
        lines: [
          'The whole town was covered in paper faces. Flyers on light poles, grocery store windows, the diner door — all curling at the edges in the autumn wind. The radio played his name between songs, the local news ran the same school photo on repeat.',
          '',
          'Parents stood shoulder to shoulder, voices cracking as they called out into fields that suddenly felt endless. Days passed. No tracks. No trail. Just a name that echoed everywhere, and a silence that grew louder each time the sun went down. It was like he\'d vanished — clean, without a trace.'
        ]
      },
      // Scene 12: Town Response
      {
        id: 'town-response',
        image: '/images/cutscenes/homecoming/homecoming-10.png',
        lines: [
          'In a town like ours, everything stops when something like this happens. The 4 Thieves bar and grill closed early. The Snack Shack handed out coffee for free. People who hadn\'t spoken in years found themselves side by side stapling posters to telephone poles. Murals started to appear — chalk drawings on sidewalks, spray paint on brick walls — his face looking out over the streets he used to walk.',
          '',
          'Folks checked the creek, the fields, the old hangouts behind the school. Everyone had a story, a theory, a memory. That\'s how small towns work — when one person goes missing, the whole world narrows until all that matters is bringing them home.'
        ]
      },
      // Scene 13: Monday Investigation
      {
        id: 'monday-investigation',
        image: '/images/cutscenes/homecoming/homecoming-11.png',
        lines: [
          'But come Monday, the school went dark. Police tape wrapped the entrances, the kind you\'d only ever seen on TV. Reporters parked out front, microphones catching the wind while investigators moved through hallways that used to buzz with noise. They talked to everyone — students, teachers, anyone who might\'ve seen something, heard something, felt something.'
        ]
      },
            // Scene 14: The Beginning
      {
        id: 'the-beginning',
        image: '/images/cutscenes/homecoming/homecoming-final.png',
        lines: [
          'And that\'s when the real work started. Four kids who knew each other from passing in the halls and shared glances — a geek, a freak, a prep, a jock. Different worlds, same story now. They met up in the fading light, drawn together by the silence that had swallowed their town.',
          '',
          'What began as whispers had turned into something else — purpose, maybe. Hope, definitely. In that moment, standing there under the hum of streetlights, they didn\'t know what they\'d find. But they knew one thing for sure — they weren\'t going to stop looking.'
        ]
      }
    ]
  }
];

const StoryManual: React.FC<StoryManualProps> = ({ onClose }) => {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [playingCutscene, setPlayingCutscene] = useState(false);
  
  // Filter chapters based on build mode - show Homecoming in both build and public modes
  const buildMode = getCurrentBuildMode();
  const availableChapters = sampleChapters.filter(chapter => {
    if (chapter.id === 'homecoming') {
      return buildMode === 'build' || buildMode === 'public'; // Show Homecoming in build and public modes
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