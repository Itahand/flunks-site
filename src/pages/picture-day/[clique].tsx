import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Window, WindowContent, Button } from 'react95';
import styled from 'styled-components';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { VOTING_TIERS } from '../../utils/votingPower';
import { useVotingEligibility } from '../../hooks/useVoting';
import { getCurrentBuildMode, isFeatureEnabled } from '../../utils/buildMode';

// Clique configurations
const CLIQUE_CONFIGS = {
  preps: { 
    name: 'The Preps', 
    primaryColor: '#96CEB4', 
    secondaryColor: '#B4DCC4',
    accentColor: '#D1EAD5',
    pattern: 'plaid',
    bgPattern: 'argyle'
  },
  jocks: { 
    name: 'The Jocks', 
    primaryColor: '#FF6B6B', 
    secondaryColor: '#FF8E8E',
    accentColor: '#FFB3B3',
    pattern: 'letterman',
    bgPattern: 'football'
  },
  geeks: { 
    name: 'The Geeks', 
    primaryColor: '#4ECDC4', 
    secondaryColor: '#7FDDD6',
    accentColor: '#B3F0ED',
    pattern: 'calculator',
    bgPattern: 'binary'
  },
  freaks: { 
    name: 'The Freaks', 
    primaryColor: '#45B7D1', 
    secondaryColor: '#6CC7DD',
    accentColor: '#A3DCE9',
    pattern: 'grunge',
    bgPattern: 'lightning'
  }
};

const VotingContainer = styled.div<{ primaryColor: string; secondaryColor: string }>`
  min-height: 100vh;
  background: linear-gradient(135deg, ${props => props.primaryColor} 0%, ${props => props.secondaryColor} 100%);
  background-attachment: fixed;
  padding: 20px;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.1;
    background-image: radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const YearbookPage = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  margin-left: 20px;
`;

const CliqueTitle = styled.h1<{ primaryColor: string }>`
  color: ${props => props.primaryColor};
  font-size: 2.5rem;
  font-family: 'Times New Roman', serif;
  font-weight: bold;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  transform: rotate(-1deg);
`;

const PageSubtitle = styled.p`
  font-size: 1.1rem;
  color: #000000 !important;
  margin: 10px 0;
  font-style: italic;
  font-weight: 700 !important;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
`;

const ForceBlackText = styled.p`
  font-size: 1.1rem !important;
  color: #000000 !important;
  margin: 10px 0 !important;
  font-style: italic !important;
  font-weight: 900 !important;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.9) !important;
  filter: contrast(2) !important;
`;

const CandidatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  justify-items: center;
  padding: 20px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 15px 10px;
  }
`;

const CandidateCard = styled.div<{ accentColor: string; isWinning: boolean }>`
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border: 3px solid ${props => props.isWinning ? '#FFD700' : props.accentColor};
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: ${props => props.isWinning ? '0 0 20px rgba(255, 215, 0, 0.5)' : '0 4px 8px rgba(0, 0, 0, 0.1)'};
  transform: ${props => props.isWinning ? 'scale(1.05)' : 'none'};
  transition: all 0.3s ease;
  position: relative;
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  
  ${props => props.isWinning && `
    &::before {
      content: '👑';
      position: absolute;
      top: -15px;
      right: -15px;
      font-size: 2rem;
      z-index: 1;
    }
  `}
  
  &:hover {
    transform: ${props => props.isWinning ? 'scale(1.08)' : 'scale(1.02)'};
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    max-width: 300px;
    padding: 15px;
  }
`;

const PhotoFrame = styled.div<{ accentColor: string }>`
  width: 200px;
  height: 250px;
  margin: 0 auto 15px;
  border: 5px solid ${props => props.accentColor};
  border-radius: 5px;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    pointer-events: none;
  }
`;

const PhotoPlaceholder = styled.div`
  color: #999;
  font-size: 0.9rem;
  text-align: center;
  padding: 20px;
`;

const CandidatePhoto = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CandidateName = styled.h3`
  color: #333;
  font-size: 1.2rem;
  margin: 15px 0 10px;
  font-family: 'Times New Roman', serif;
`;

const VoteCount = styled.div<{ primaryColor: string; isWinning: boolean }>`
  color: ${props => props.isWinning ? '#FFD700' : '#000000'} !important;
  font-weight: 900 !important;
  font-size: 1.2rem !important;
  margin: 10px 0 !important;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.9) !important;
  filter: contrast(3) !important;
  ${props => props.isWinning && 'text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8) !important;'}
`;

const VoteButton = styled(Button)<{ primaryColor: string; disabled: boolean }>`
  background: ${props => props.disabled ? '#ccc' : props.primaryColor} !important;
  color: white !important;
  font-weight: bold !important;
  padding: 12px 24px !important;
  margin: 10px 0 !important;
  opacity: ${props => props.disabled ? 0.6 : 1} !important;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'} !important;
  text-align: center !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-1px)'} !important;
  }
`;

const BackButton = styled(Button)`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
`;

const RefreshButton = styled(Button)`
  background: #4CAF50 !important;
  color: white !important;
  padding: 8px 16px !important;
  margin-left: 15px !important;
  font-size: 0.9rem !important;
  
  &:hover {
    background: #45a049 !important;
  }
`;

const RealTimeIndicator = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 255, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 1000;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { opacity: 0.8; }
    50% { opacity: 1; }
    100% { opacity: 0.8; }
  }
`;

const VotingPowerDisplay = styled.div<{ tierColor: string }>`
  background: linear-gradient(145deg, ${props => props.tierColor}, ${props => props.tierColor}CC);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 15px;
  margin: 20px 0;
  text-align: center;
  color: #000000 !important;
  font-weight: 900 !important;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.9) !important;
  filter: contrast(3) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const AuthPrompt = styled.div`
  background: linear-gradient(145deg, #FF6B6B, #FF8E8E);
  border: 3px solid #FFB3B3;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  margin: 20px 0;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
`;

const VoteProgress = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
`;

const ProgressBar = styled.div<{ percentage: number; color: string }>`
  background: ${props => props.color};
  height: 8px;
  border-radius: 4px;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const ScrapbookStickers = styled.div`
  position: absolute;
  top: 20px;
  right: 100px;
  font-size: 1.5rem;
  transform: rotate(15deg);
`;

interface VotingData {
  candidates: Array<{
    id: string;
    name: string;
    photoUrl?: string;
    votes: number;
    userVotedFor: boolean;
  }>;
  totalVotes: number;
  userVoteStatus?: {
    votingPower: {
      maxVotes: number;
      flunksCount: number;
      tier: string;
    };
    votesUsed: number;
    remainingVotes: number;
    canVote: boolean;
  };
  requiresAuth: boolean;
}

const CliquePage: React.FC = () => {
  const router = useRouter();
  const { clique } = router.query;
  const [votingData, setVotingData] = useState<VotingData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, primaryWallet } = useDynamicContext();
  
  // Test mode - check for ?test=true in URL
  const isTestMode = router.query.test === 'true';
  
  // Use client-side hook for faster Flunks count access
  const votingEligibility = useVotingEligibility();
  
  // Check if Picture Day is enabled in current build mode
  const isPictureDayEnabled = isFeatureEnabled('showPictureDay');

  const config = clique ? CLIQUE_CONFIGS[clique as keyof typeof CLIQUE_CONFIGS] : null;

  // If not in build mode, redirect
  useEffect(() => {
    if (!isPictureDayEnabled) {
      console.log('Picture Day is only available in build mode');
      router.push('/');
      return;
    }
  }, [isPictureDayEnabled, router]);

  useEffect(() => {
    if (clique && isPictureDayEnabled) {
      fetchVotingData();
      
      // Set up updates every hour (3,600,000 milliseconds)
      const interval = setInterval(fetchVotingData, 3600000);
      
      return () => clearInterval(interval);
    }
  }, [clique, primaryWallet, isPictureDayEnabled]);

  const fetchVotingData = async () => {
    try {
      const headers: any = {};
      if (primaryWallet?.address) {
        headers['x-wallet-address'] = primaryWallet.address;
      } else if (isTestMode) {
        // Use test wallet address for simulation
        headers['x-wallet-address'] = '0x1234567890123456789012345678901234567890';
      }

      const response = await fetch(`/api/picture-day/clique/${clique}`, { headers });
      const data = await response.json();
      
      // If in test mode and no user vote status, simulate it
      if (isTestMode && !data.userVoteStatus) {
        data.userVoteStatus = {
          votingPower: {
            maxVotes: 2,
            flunksCount: 15,
            tier: 'Regular Voter (11-20 Flunks)'
          },
          votesUsed: 0,
          remainingVotes: 2,
          canVote: true
        };
      }
      
      setVotingData(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch voting data:', error);
      setLoading(false);
    }
  };

  const handleVote = async (candidateId: string) => {
    const walletAddress = primaryWallet?.address || (isTestMode ? '0x1234567890123456789012345678901234567890' : null);
    
    if (!walletAddress) {
      alert('Please connect your wallet to vote!');
      return;
    }

    try {
      const response = await fetch('/api/picture-day/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clique,
          candidateId,
          userWallet: walletAddress,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Vote cast successfully for ${result.candidateName}!`);
        // Immediately update voting data
        fetchVotingData();
        
        // Dispatch event to notify other components (like objectives)
        window.dispatchEvent(new CustomEvent('pictureVoteComplete', {
          detail: { clique, candidateId, candidateName: result.candidateName }
        }));
        
        // If objective was completed, also dispatch objective refresh
        if (result.objectiveCompleted) {
          window.dispatchEvent(new CustomEvent('objectiveCompleted', {
            detail: { type: 'picture_day_voting', wallet: primaryWallet?.address }
          }));
        }
      } else {
        console.error('Vote failed:', result);
        alert(`Voting failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Error submitting vote');
    }
  };

  if (loading) {
    return (
      <VotingContainer primaryColor="#667eea" secondaryColor="#764ba2">
        <div style={{ textAlign: 'center', paddingTop: '200px', color: 'white', fontSize: '1.5rem' }}>
          Loading yearbook page...
        </div>
      </VotingContainer>
    );
  }

  if (!isPictureDayEnabled) {
    return (
      <VotingContainer primaryColor="#667eea" secondaryColor="#764ba2">
        <div style={{ 
          textAlign: 'center', 
          paddingTop: '200px', 
          color: 'white', 
          fontSize: '1.5rem' 
        }}>
          🔒 Picture Day is currently only available in build mode...
        </div>
      </VotingContainer>
    );
  }

  if (!config) {
    return (
      <VotingContainer primaryColor="#667eea" secondaryColor="#764ba2">
        <div style={{ textAlign: 'center', paddingTop: '200px', color: 'white', fontSize: '1.5rem' }}>
          Clique not found!
        </div>
      </VotingContainer>
    );
  }

  const winningCandidate = votingData?.candidates?.length > 0 
    ? votingData.candidates.reduce((prev, current) => 
        (prev.votes > current.votes) ? prev : current
      )
    : null;

  const isAuthenticated = !!user && !!primaryWallet?.address || isTestMode;
  const votingPower = votingData?.userVoteStatus?.votingPower;
  const hasRemainingVotes = isAuthenticated && votingPower && 
    (votingData?.userVoteStatus?.remainingVotes ?? 0) > 0;

  // Debug logging
  console.log('🔍 Frontend Debug:', {
    isAuthenticated,
    isTestMode,
    votingData: votingData?.userVoteStatus,
    votingPower,
    hasRemainingVotes,
    remainingVotes: votingData?.userVoteStatus?.remainingVotes
  });

  return (
    <VotingContainer primaryColor={config.primaryColor} secondaryColor={config.secondaryColor}>
      <BackButton onClick={() => router.push('/picture-day')}>
        ← Back to Cliques
      </BackButton>

      <YearbookPage>
        <ScrapbookStickers>✨🌟⭐</ScrapbookStickers>
        
        <PageHeader>
          <CliqueTitle primaryColor={config.primaryColor}>
            {config.name} Picture Day
          </CliqueTitle>
          <div style={{ 
            fontSize: '1.1rem',
            color: '#000000',
            margin: '10px 0',
            fontStyle: 'italic',
            fontWeight: '900',
            textShadow: '2px 2px 4px rgba(255, 255, 255, 0.9)',
            filter: 'contrast(3)',
            textAlign: 'center'
          }}>
            Vote for your favorite Flunk to represent {config.name} in the yearbook!
          </div>
          {votingData && (
            <div style={{ 
              color: config.primaryColor, 
              fontWeight: 'bold', 
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <span>Total Votes Cast: {votingData.totalVotes}</span>
              <RefreshButton onClick={fetchVotingData} disabled={loading}>
                {loading ? '🔄 Updating...' : '🔄 Refresh Votes'}
              </RefreshButton>
            </div>
          )}
        </PageHeader>

        {/* Authentication Check */}
        {!isAuthenticated && (
          <AuthPrompt>
            🔐 Connect your wallet to vote!<br/>
            <small>You need to be logged in with Dynamic XYZ to participate in Picture Day voting.</small>
          </AuthPrompt>
        )}

        {/* Voting Power Display */}
        {isAuthenticated && votingPower && (
          <VotingPowerDisplay tierColor={VOTING_TIERS[votingPower.maxVotes as keyof typeof VOTING_TIERS]?.color || '#999'}>
            {isTestMode && (
              <div style={{ 
                fontSize: '0.8rem', 
                marginBottom: '5px',
                color: '#000000',
                fontWeight: '900',
                textShadow: '2px 2px 4px rgba(255, 255, 255, 0.9)',
                filter: 'contrast(3)',
                fontStyle: 'italic'
              }}>
                🧪 TEST MODE - Simulated Wallet
              </div>
            )}
            <div style={{ 
              fontSize: '1.2rem', 
              marginBottom: '10px',
              color: '#000000',
              fontWeight: '900',
              textShadow: '2px 2px 4px rgba(255, 255, 255, 0.9)',
              filter: 'contrast(3)'
            }}>
              🗳️ Your Voting Power: {votingPower.tier}
            </div>
            <div style={{ 
              fontSize: '0.9rem', 
              marginBottom: '10px',
              color: '#000000',
              fontWeight: '900',
              textShadow: '2px 2px 4px rgba(255, 255, 255, 0.9)',
              filter: 'contrast(3)'
            }}>
              {votingPower.flunksCount} Flunks = {votingPower.maxVotes} {votingPower.maxVotes === 1 ? 'vote' : 'votes'} per clique
            </div>
            {votingData?.userVoteStatus && (
              <VoteProgress>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.8rem' }}>
                  <span>Votes Used: {votingData.userVoteStatus.votesUsed}/{votingPower.maxVotes}</span>
                  <span>Remaining: {votingData.userVoteStatus.remainingVotes}</span>
                </div>
                <ProgressBar 
                  percentage={(votingData.userVoteStatus.votesUsed / votingPower.maxVotes) * 100}
                  color={votingData.userVoteStatus.remainingVotes > 0 ? '#4ECDC4' : '#FF6B6B'}
                />
              </VoteProgress>
            )}
          </VotingPowerDisplay>
        )}

        <CandidatesGrid>
          {votingData?.candidates && Array.isArray(votingData.candidates) ? votingData.candidates.map((candidate) => {
            const isWinning = winningCandidate?.id === candidate.id && votingData.totalVotes > 0;
            
            return (
              <CandidateCard
                key={candidate.id}
                accentColor={config.accentColor}
                isWinning={isWinning}
              >
                <PhotoFrame accentColor={config.accentColor}>
                  {candidate.photoUrl ? (
                    <CandidatePhoto 
                      src={candidate.photoUrl} 
                      alt={candidate.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <PhotoPlaceholder>
                      📷<br/>
                      Photo Coming Soon!<br/>
                      <small>Upload your Flunk's pic!</small>
                    </PhotoPlaceholder>
                  )}
                </PhotoFrame>
                
                <VoteCount primaryColor={config.primaryColor} isWinning={isWinning}>
                  {candidate.votes} {candidate.votes === 1 ? 'vote' : 'votes'}
                  {isWinning && votingData.totalVotes > 0 && ' 👑'}
                </VoteCount>
                
                {candidate.userVotedFor && (
                  <div style={{ 
                    color: '#000000',
                    fontSize: '0.9rem',
                    fontStyle: 'italic',
                    fontWeight: '900',
                    textShadow: '2px 2px 4px rgba(255, 255, 255, 0.9)',
                    filter: 'contrast(3)'
                  }}>
                    ✓ You voted for this Flunk!
                  </div>
                )}
                
                <VoteButton
                  onClick={() => handleVote(candidate.id)}
                  primaryColor={config.primaryColor}
                  disabled={!isAuthenticated || !hasRemainingVotes}
                >
                  {!isAuthenticated ? 
                    'Connect Wallet to Vote' : 
                    !hasRemainingVotes ? 
                      (votingPower?.maxVotes === 0 ? 'Need Flunks to Vote' : 'No Votes Left') :
                      'Vote for This Flunk!'
                  }
                </VoteButton>
              </CandidateCard>
            );
          }) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '40px', 
              color: config.primaryColor,
              fontSize: '1.2rem' 
            }}>
              📷 No candidates yet! Check back soon for voting options.
            </div>
          )}
        </CandidatesGrid>
      </YearbookPage>
    </VotingContainer>
  );
};

export default CliquePage;
