import React, { useEffect } from 'react';
import { Frame, Button } from 'react95';
import { useFavorites } from 'contexts/FavoritesContext';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import styled from 'styled-components';

interface Props {
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  showClique?: boolean;
  interactive?: boolean;
  className?: string;
}

const FavoriteContainer = styled(Frame)<{ size: 'small' | 'medium' | 'large' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => 
    props.size === 'small' ? '8px' :
    props.size === 'medium' ? '12px' : '16px'
  };
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%);
  border: 2px solid #DAA520;
  box-shadow: 
    inset 0 0 0 1px #FFFF99,
    0 0 10px rgba(255, 215, 0, 0.3);
  position: relative;
  min-height: ${props => 
    props.size === 'small' ? '80px' :
    props.size === 'medium' ? '120px' : '160px'
  };

  &::before {
    content: '⭐';
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: ${props => 
      props.size === 'small' ? '12px' :
      props.size === 'medium' ? '16px' : '20px'
    };
    animation: starTwinkle 2s ease-in-out infinite;
  }

  @keyframes starTwinkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.1); }
  }
`;

const FavoriteImage = styled.img<{ size: 'small' | 'medium' | 'large' }>`
  width: ${props => 
    props.size === 'small' ? '40px' :
    props.size === 'medium' ? '60px' : '80px'
  };
  height: ${props => 
    props.size === 'small' ? '40px' :
    props.size === 'medium' ? '60px' : '80px'
  };
  border-radius: 4px;
  border: 2px solid #FFF;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
`;

const FavoriteName = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  font-size: ${props => 
    props.size === 'small' ? '10px' :
    props.size === 'medium' ? '12px' : '14px'
  };
  font-weight: bold;
  color: #8B4513;
  text-shadow: 1px 1px 0px #FFFF99;
  margin-top: 4px;
  text-align: center;
`;

const CliqueBadge = styled.div<{ clique: string; size: 'small' | 'medium' | 'large' }>`
  font-size: ${props => 
    props.size === 'small' ? '8px' :
    props.size === 'medium' ? '10px' : '12px'
  };
  padding: ${props => 
    props.size === 'small' ? '2px 4px' :
    props.size === 'medium' ? '3px 6px' : '4px 8px'
  };
  border-radius: 3px;
  font-weight: bold;
  color: white;
  margin-top: 2px;
  background: ${props => 
    props.clique === 'GEEK' ? '#4CAF50' :
    props.clique === 'JOCK' ? '#FF5722' :
    props.clique === 'PREP' ? '#2196F3' :
    props.clique === 'FREAK' ? '#9C27B0' : '#666'
  };
`;

const NoFavoriteContainer = styled(Frame)<{ size: 'small' | 'medium' | 'large' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => 
    props.size === 'small' ? '8px' :
    props.size === 'medium' ? '12px' : '16px'
  };
  background: #f0f0f0;
  border: 2px dashed #ccc;
  min-height: ${props => 
    props.size === 'small' ? '80px' :
    props.size === 'medium' ? '120px' : '160px'
  };
  color: #888;
  text-align: center;
`;

const FavoriteFlunkDisplay: React.FC<Props> = ({ 
  size = 'medium', 
  showName = true, 
  showClique = true, 
  interactive = false,
  className = ''
}) => {
  const { favoriteFlunk, loadFavoriteFlunk, isLoading } = useFavorites();
  const { primaryWallet } = useDynamicContext();

  // Load favorite flunk when wallet changes
  useEffect(() => {
    if (primaryWallet?.address) {
      console.log('🔄 [FavoriteFlunkDisplay] Loading favorite flunk for wallet:', primaryWallet.address);
      loadFavoriteFlunk(primaryWallet.address);
    } else {
      console.log('⚠️ [FavoriteFlunkDisplay] No wallet address available');
    }
  }, [primaryWallet?.address, loadFavoriteFlunk]);

  // Debug the current state
  useEffect(() => {
    console.log('📊 [FavoriteFlunkDisplay] Current state:', {
      isLoading,
      favoriteFlunk,
      walletAddress: primaryWallet?.address
    });
  }, [isLoading, favoriteFlunk, primaryWallet?.address]);

  if (isLoading) {
    return (
      <NoFavoriteContainer size={size} variant="well" className={className}>
        <div style={{ fontSize: size === 'small' ? '16px' : '24px' }}>⏳</div>
        <div style={{ 
          fontSize: size === 'small' ? '10px' : '12px',
          marginTop: '4px'
        }}>
          Loading...
        </div>
      </NoFavoriteContainer>
    );
  }

  if (!favoriteFlunk) {
    return (
      <NoFavoriteContainer size={size} variant="well" className={className}>
        <div style={{ fontSize: size === 'small' ? '16px' : '24px' }}>☆</div>
        <div style={{ 
          fontSize: size === 'small' ? '10px' : '12px',
          marginTop: '4px'
        }}>
          No Favorite Flunk
        </div>
        <div style={{ 
          fontSize: size === 'small' ? '8px' : '10px',
          opacity: 0.7
        }}>
          Select one in OnlyFlunks
        </div>
      </NoFavoriteContainer>
    );
  }

  return (
    <FavoriteContainer size={size} variant="outside" className={className}>
      <FavoriteImage 
        size={size}
        src={favoriteFlunk.imageUrl} 
        alt={favoriteFlunk.name}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/images/icons/user.png';
        }}
      />
      {showName && (
        <FavoriteName size={size}>
          {favoriteFlunk.name}
        </FavoriteName>
      )}
      {showClique && favoriteFlunk.clique && (
        <CliqueBadge clique={favoriteFlunk.clique} size={size}>
          {favoriteFlunk.clique}
        </CliqueBadge>
      )}
    </FavoriteContainer>
  );
};

export default FavoriteFlunkDisplay;
