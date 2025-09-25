import React, { useState } from 'react';
import styled from 'styled-components';
import { CLIQUE_PROFILES, BACKGROUND_PATTERNS, CliqueProfile, Friend } from '../data/cliqueProfiles';
import MusicPlayer from './MusicPlayer';
import { useWindowsContext } from '../contexts/WindowsContext';
import DraggableResizeableWindow from './DraggableResizeableWindow';
import { WINDOW_IDS } from '../fixed';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { awardGum } from '../utils/gumAPI';
import AchievementNotification from './AchievementNotification';

interface MySpaceProfileProps {
  clique: string;
}

const ProfileContainer = styled.div<{ bgColor: string; pattern: string }>`
  width: 100%;
  height: 100vh;
  max-height: 100%;
  overflow-y: auto;
  background: ${props => props.bgColor};
  background-image: url("${props => BACKGROUND_PATTERNS[props.pattern as keyof typeof BACKGROUND_PATTERNS] || ''}");
  font-family: 'Arial', 'Helvetica', sans-serif;
  font-size: 11px;
  color: #ffffff;
  
  /* MySpace-style scrollbar */
  &::-webkit-scrollbar {
    width: 16px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1e1e1e;
    border: 1px solid #666;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #666, #333);
    border: 1px solid #999;
  }
  
  /* Ensure scrolling works on mobile */
  @media (max-width: 768px) {
    -webkit-overflow-scrolling: touch;
    height: calc(100vh - 60px); /* Account for window header */
  }
`;

const ProfileHeader = styled.div`
  background: linear-gradient(to bottom, #4a90e2, #357abd);
  color: white;
  padding: 10px;
  border-bottom: 2px solid #2c5aa0;
  font-family: 'Verdana', sans-serif;
  font-size: 12px;
  font-weight: bold;
`;

const ProfileContent = styled.div`
  padding: 15px;
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 15px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Section = styled.div<{ bgColor?: string }>`
  background: ${props => props.bgColor || 'rgba(255, 255, 255, 0.9)'};
  border: 2px outset #cccccc;
  padding: 8px;
  color: #000000;
  font-family: 'Verdana', sans-serif;
  font-size: 11px;
`;

const SectionHeader = styled.div<{ bgColor?: string }>`
  background: ${props => props.bgColor || 'linear-gradient(to bottom, #4a90e2, #357abd)'};
  color: white;
  padding: 4px 8px;
  margin: -8px -8px 8px -8px;
  font-weight: bold;
  font-size: 11px;
  border-bottom: 1px solid #2c5aa0;
`;

const UserInfo = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border: 2px inset #cccccc;
  padding: 10px;
  color: #000000;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 15px;
  align-items: start;
`;

const ProfilePictureSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfilePicture = styled.div<{ bgColor: string; hasImage?: boolean; clique?: string }>`
  width: ${props => props.clique === 'the-nerds' ? '80px' : '100px'};
  height: ${props => props.clique === 'the-nerds' ? '80px' : '100px'};
  background: ${props => props.hasImage ? 'transparent' : `linear-gradient(135deg, ${props.bgColor}, ${props.bgColor}aa)`};
  border: 3px solid #666;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  font-family: 'Impact', sans-serif;
  margin-bottom: 8px;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.5);
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserDetailsSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h1<{ color: string }>`
  color: ${props => props.color};
  font-family: 'Impact', 'Arial Black', sans-serif;
  font-size: 24px;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  letter-spacing: 1px;
`;

const UserStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  margin: 0;
  font-size: 10px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 3px;
    font-size: 9px;
  }
`;

const StatItem = styled.div`
  background: #f0f0f0;
  padding: 3px 5px;
  border: 1px solid #ccc;
`;

const AboutSection = styled.div`
  line-height: 1.4;
  margin: 10px 0;
`;

const FriendsList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 8px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 5px;
  }
`;

const FriendCard = styled.div<{ isClickable?: boolean }>`
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #ccc;
  padding: 5px;
  text-align: center;
  font-size: 9px;
  color: #000;
  cursor: ${props => props.isClickable ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  word-wrap: break-word;
  overflow-wrap: break-word;
  min-width: 0; // Allow shrinking below content size

  ${props => props.isClickable && `
    &:hover {
      background: rgba(245, 162, 211, 0.8);
      border-color: #f5a2d3;
      transform: scale(1.05);
    }
  `}
  
  @media (max-width: 768px) {
    padding: 4px;
    font-size: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 3px;
    font-size: 7px;
  }
`;

const FriendAvatar = styled.div<{ hasImage?: boolean }>`
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #ccc, #999);
  margin: 0 auto 3px;
  border: 1px solid #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: #333;
  overflow: hidden;
  border-radius: 2px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 20%;
  }
`;

const CommentsSection = styled.div`
  grid-column: 1 / -1;
  background: rgba(255, 255, 255, 0.95);
  border: 2px inset #cccccc;
  padding: 15px;
  margin-top: 15px;
  color: #000000;
`;

const CommentHeader = styled.div`
  background: linear-gradient(to bottom, #2c5aa0, #1a4480);
  color: white;
  padding: 6px 10px;
  margin: -15px -15px 15px -15px;
  font-weight: bold;
  font-size: 12px;
  border-bottom: 1px solid #2c5aa0;
  text-align: center;
`;

const Comment = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
  font-size: 10px;
  line-height: 1.4;
  
  &:last-child {
    border-bottom: none;
  }
`;

const CommentAuthor = styled.span`
  font-weight: bold;
  color: #2c5aa0;
  font-size: 11px;
`;

const CommentTime = styled.span`
  color: #666;
  font-size: 9px;
  margin-left: 10px;
`;

const CommentText = styled.div`
  margin-top: 5px;
  color: #333;
`;

const InterestsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 5px;
`;

const InterestTag = styled.span<{ bgColor: string }>`
  background: ${props => props.bgColor};
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 9px;
  border: 1px solid rgba(255,255,255,0.3);
`;

const ListItem = styled.li`
  margin: 2px 0;
  font-size: 10px;
  list-style-type: disc;
  margin-left: 15px;
`;

const BlinkingText = styled.span`
  animation: blink 1s infinite;
  color: #ff0000;
  font-weight: bold;
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const MySpaceProfile: React.FC<MySpaceProfileProps> = ({ clique }) => {
  const profile = CLIQUE_PROFILES[clique];
  const { openWindow } = useWindowsContext();
  const { primaryWallet } = useDynamicContext();
  const [showAchievement, setShowAchievement] = useState(false);
  
  if (!profile) {
    return <div>Profile not found</div>;
  }

  const handleFriendClick = async (friendName: string) => {
    if (friendName === 'Flunko') {
      // Check for Chapter 3 Overachiever achievement
      if (primaryWallet?.address && clique !== 'flunko') {
        try {
          const result = await awardGum(primaryWallet.address, 'chapter3_overachiever', {
            clicked_from_clique: clique,
            achievement: 'Chapter 3 Overachiever'
          });
          
          if (result.success && result.earned > 0) {
            // Show achievement notification
            setShowAchievement(true);
          }
        } catch (error) {
          console.error('Error awarding Chapter 3 Overachiever:', error);
        }
      }

      // Open Flunko's MySpace profile in a new window
      openWindow({
        key: `${WINDOW_IDS.MYPLACE}_flunko`,
        window: (
          <DraggableResizeableWindow
            windowsId={`${WINDOW_IDS.MYPLACE}_flunko`}
            onClose={() => {}} // Will be handled by the window system
            initialWidth="100%"
            initialHeight="100%"
            resizable={false}
            headerTitle="Flunko's MyPlace Profile"
            headerIcon="/images/icons/open-book.png"
          >
            <MySpaceProfile clique="flunko" />
          </DraggableResizeableWindow>
        ),
      });
    }
  };

  const formatList = (items: string[], maxDisplay: number = 6) => {
    const displayItems = items.slice(0, maxDisplay);
    return displayItems.map((item, index) => (
      <ListItem key={index}>{item}</ListItem>
    ));
  };

  // Generate random 90s comments from top friends
  const generateComments = () => {
    // Special comments for Flunko
    if (clique === 'flunko') {
      return [
        {
          author: "Casey",
          text: "paradise motel after the hoco dance this weekend?",
          time: "2 hours ago"
        },
        {
          author: "Drew",
          text: "Dude, that guitar solo last night was INSANE! 🎸",
          time: "Yesterday at 7:23 PM"
        },
        {
          author: "Alex",
          text: "Movie night at my place Friday? Got the new releases! 🎬",
          time: "3 days ago"
        }
      ];
    }

    const comments90s = [
      "OMG did you see what happened at the mall today?? DRAMA! 🛍️",
      "Dude, that new CD is SO fetch! We need to burn a copy! 💿",
      "Can't wait for the dance! Are you wearing your new JNCO jeans? 👖",
      "Did you tape that episode of Friends last night? Ross is such a loser! 📺",
      "Your hair looks AMAZING! What gel are you using? The spikes are perfect! 💇‍♂️",
      "NOOO WAY! Tell me you didn't actually go to Blockbuster without me! 📼",
      "That test was BRUTAL. Mrs. Johnson is seriously trying to ruin our lives! 📚",
      "Are you going to the football game Friday? Brad is totally checking you out! 🏈",
      "I can't believe you got the new Tamagotchi! Mine keeps dying 😭 🐣",
      "Did you hear? Sarah and Mike are totally going out now! SO CUTE! 💕",
      "Your MySpace layout is SICK! How did you get the glitter background? ✨",
      "Mom won't let me go to the mall again. She's being such a total buzzkill! 🙄",
      "I'm SO over this algebra homework. When am I ever going to use this?? 📐",
      "That new Britney song is EVERYTHING! I've listened to it like 50 times! 🎵",
      "Can you believe summer is almost over? Senior year is going to be INSANE! 🎓",
      "Your profile pic is adorable! You look like a total movie star! 📸",
      "Are we still on for the movies Saturday? I heard Titanic is amazing! 🚢",
      "I'm totally going to fail PE if I have to run another mile! 🏃‍♀️",
      "Did you see what she wore to school today? Fashion police need to arrest her! 👮‍♀️",
      "Can't believe we have to wait until college to get out of this boring town! 🌍"
    ];

    const timeStamps = [
      "2 hours ago",
      "Yesterday at 3:47 PM",
      "Monday at 11:23 AM",
      "3 days ago",
      "Last Friday at 8:15 PM",
      "4 days ago"
    ];

    const selectedComments = [];
    const topFriends = profile.topFriends.slice(0, 6); // Use top 6 friends
    const availableComments = [...comments90s]; // Copy array so we can remove used comments
    const availableTimes = [...timeStamps]; // Copy array so we can remove used times
    
    for (let i = 0; i < 3; i++) {
      const commentIndex = Math.floor(Math.random() * availableComments.length);
      const friendIndex = Math.floor(Math.random() * topFriends.length);
      const timeIndex = Math.floor(Math.random() * availableTimes.length);
      
      selectedComments.push({
        author: topFriends[friendIndex].name,
        text: availableComments[commentIndex],
        time: availableTimes[timeIndex]
      });
      
      // Remove used comment and time to prevent duplicates
      availableComments.splice(commentIndex, 1);
      availableTimes.splice(timeIndex, 1);
    }
    
    return selectedComments;
  };

  const comments = generateComments();

  // Check if profile image exists
  const profileImagePath = clique === 'flunko' 
    ? `/images/myplace/myspace-flunko.png`
    : clique === 'the-jocks'
    ? `/images/myplace/${clique}/jock-profile.png`
    : clique === 'the-freaks'
    ? `/images/myplace/${clique}/freak-profile.png`
    : `/images/myplace/${clique}/profile.png`;
  
  return (
    <ProfileContainer bgColor={profile.backgroundColor} pattern={profile.backgroundPattern}>
      <ProfileHeader>
        🏠 MyPlace.com - Profile
      </ProfileHeader>
      
      <ProfileContent>
        <MainContent>
          <UserInfo>
            <ProfilePictureSection>
              <ProfilePicture bgColor={profile.backgroundColor} hasImage={true} clique={profile.clique}>
                <img 
                  src={profileImagePath} 
                  alt={profile.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: profile.clique === 'flunko' ? 'center 10%' : 'center',
                    transform: 'scale(1)',
                    transformOrigin: 'center center'
                  }}
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.style.background = `linear-gradient(135deg, ${profile.backgroundColor}, ${profile.backgroundColor}aa)`;
                      parent.innerHTML = profile.name.charAt(0);
                      parent.style.fontSize = '36px';
                      parent.style.color = 'white';
                      parent.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
                      parent.style.fontFamily = 'Impact, sans-serif';
                    }
                  }}
                />
              </ProfilePicture>
              <div style={{ 
                fontSize: '8px', 
                textAlign: 'center', 
                color: '#666',
                fontWeight: 'bold' 
              }}>
                Online Now!
              </div>
            </ProfilePictureSection>
            
            <UserDetailsSection>
              {/* <UserName color={profile.backgroundColor}>
                {profile.name}
              </UserName> */}
              
              <UserStats>
                <StatItem><strong>Mood:</strong> {profile.mood}</StatItem>
                <StatItem><strong>Age:</strong> {profile.age}</StatItem>
                <StatItem><strong>Location:</strong> {profile.location}</StatItem>
                <StatItem><strong>Last Login:</strong> {profile.lastLogin}</StatItem>
                <StatItem><strong>Profile Views:</strong> {profile.profileViews.toLocaleString()}</StatItem>
                <StatItem><strong>Status:</strong> <BlinkingText>Online</BlinkingText></StatItem>
              </UserStats>
            </UserDetailsSection>
          </UserInfo>

          <Section>
            <SectionHeader>About Me</SectionHeader>
            <AboutSection>
              {profile.aboutMe}
            </AboutSection>
            <div style={{ marginTop: '10px', fontStyle: 'italic', fontSize: '10px', color: '#666' }}>
              <strong>Favorite Quote:</strong> "{profile.favoriteQuote}"
            </div>
          </Section>

          <Section>
            <SectionHeader>Interests</SectionHeader>
            <InterestsList>
              {profile.interests.map((interest, index) => (
                <InterestTag key={index} bgColor={profile.backgroundColor}>
                  {interest}
                </InterestTag>
              ))}
            </InterestsList>
          </Section>

          <Section>
            <SectionHeader>Music</SectionHeader>
            <ul style={{ margin: '5px 0', padding: 0 }}>
              {formatList(profile.music)}
            </ul>
          </Section>

          <Section>
            <SectionHeader>Movies</SectionHeader>
            <ul style={{ margin: '5px 0', padding: 0 }}>
              {formatList(profile.movies)}
            </ul>
          </Section>

          <Section>
            <SectionHeader>Books</SectionHeader>
            <ul style={{ margin: '5px 0', padding: 0 }}>
              {formatList(profile.books)}
            </ul>
          </Section>

          <Section>
            <SectionHeader>Heroes</SectionHeader>
            <ul style={{ margin: '5px 0', padding: 0 }}>
              {formatList(profile.heroes)}
            </ul>
          </Section>
        </MainContent>

        <Sidebar>
          <Section>
            <SectionHeader bgColor="#ff6600">Top 6 Friends</SectionHeader>
            <FriendsList>
              {profile.topFriends.map((friend: Friend, index: number) => (
                <FriendCard 
                  key={index}
                  isClickable={friend.name === 'Flunko'}
                  onClick={() => friend.name === 'Flunko' ? handleFriendClick(friend.name) : undefined}
                  title={friend.name === 'Flunko' ? 'Click to visit Flunko\'s profile!' : undefined}
                >
                  <FriendAvatar hasImage={friend.name === 'Flunko'}>
                    {friend.name === 'Flunko' ? (
                      <img 
                        src="/images/myplace/myspace-flunko.png" 
                        alt="Flunko"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.textContent = 'F';
                        }}
                      />
                    ) : (
                      friend.name.charAt(0)
                    )}
                  </FriendAvatar>
                  <div style={{ fontWeight: 'bold', fontSize: '8px' }}>
                    {friend.name}
                  </div>
                  <div style={{ fontSize: '7px', color: '#666', marginTop: '2px' }}>
                    {friend.status}
                  </div>
                </FriendCard>
              ))}
            </FriendsList>
          </Section>

          <Section bgColor="rgba(144, 238, 144, 0.9)">
            <SectionHeader bgColor="#228B22">Things I Like 👍</SectionHeader>
            <ul style={{ margin: '5px 0', padding: 0 }}>
              {profile.likes.slice(0, 8).map((like, index) => (
                <ListItem key={index}>{like}</ListItem>
              ))}
            </ul>
          </Section>

          <Section bgColor="rgba(255, 182, 193, 0.9)">
            <SectionHeader bgColor="#DC143C">Things I Dislike 👎</SectionHeader>
            <ul style={{ margin: '5px 0', padding: 0 }}>
              {profile.dislikes.slice(0, 8).map((dislike, index) => (
                <ListItem key={index}>{dislike}</ListItem>
              ))}
            </ul>
          </Section>

          <Section bgColor="rgba(255, 255, 0, 0.9)">
            <SectionHeader bgColor="#FF8C00">MyPlace Stats</SectionHeader>
            <div style={{ fontSize: '10px', color: '#000' }}>
              <div>📅 Member since: 1997</div>
              <div>👥 Friends: {profile.topFriends.length * 47}</div>
              <div>📧 Messages: {Math.floor(profile.profileViews / 10)}</div>
              <div>💬 Comments: {Math.floor(profile.profileViews / 5)}</div>
            </div>
          </Section>

          <Section>
            <SectionHeader bgColor="#8A2BE2">🎵 Profile Song</SectionHeader>
            <MusicPlayer
              songTitle={profile.profileSong?.split(' - ')[1] || profile.profileSong || "No song"}
              artist={profile.profileSong?.split(' - ')[0] || "Unknown Artist"}
              songFile={profile.clique === 'flunko' ? `/music/Flunko.mp3` : `/music/${profile.clique}.mp3`}
              themeColor={profile.backgroundColor}
              autoplay={true}
              startTime={profile.clique === 'the-jocks' ? 10 : 0}
            />
          </Section>
        </Sidebar>

        {/* Comments Section - spans full width */}
        <CommentsSection>
          <CommentHeader>
            💬 Friend Comments ({comments.length})
          </CommentHeader>
          {comments.map((comment, index) => (
            <Comment key={index}>
              <div>
                <CommentAuthor>{comment.author}</CommentAuthor>
                <CommentTime>{comment.time}</CommentTime>
              </div>
              <CommentText>{comment.text}</CommentText>
            </Comment>
          ))}
        </CommentsSection>
      </ProfileContent>
      
      {/* Achievement Notification */}
      <AchievementNotification
        show={showAchievement}
        title="Achievement Unlocked!"
        description="Chapter 3 Overachiever Complete - You found Flunko in the top 6!"
        gumAmount={100}
        onComplete={() => setShowAchievement(false)}
      />
    </ProfileContainer>
  );
};

export default MySpaceProfile;