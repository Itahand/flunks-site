import React from 'react';

/**
 * Semester Zero NFT Card Component
 * Shows special "Genesis" badge for NFT IDs 0 and 1
 */

interface SemesterZeroNFT {
  id: number;
  name: string;
  description: string;
  image: string;
  type: 'Token' | 'Pin' | 'Patch';
  rarity: string;
  metadata: Record<string, string>;
}

interface NFTCardProps {
  nft: SemesterZeroNFT;
}

export const SemesterZeroNFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  // Check if this is a Genesis NFT (ID 0 or 1)
  const isGenesis = nft.id === 0 || nft.id === 1;
  
  return (
    <div className="nft-card">
      {/* Genesis Badge */}
      {isGenesis && (
        <div className="genesis-badge">
          <span className="genesis-icon">✨</span>
          GENESIS #{nft.id + 1}
          <span className="genesis-tooltip">
            {nft.id === 0 
              ? "The very first NFT minted in Semester Zero" 
              : "The second NFT ever minted in Semester Zero"}
          </span>
        </div>
      )}
      
      {/* NFT Image */}
      <div className="nft-image">
        <img src={nft.image} alt={nft.name} />
        <div className="nft-id">#{nft.id}</div>
      </div>
      
      {/* NFT Details */}
      <div className="nft-details">
        <h3>{nft.name}</h3>
        <p className="nft-description">{nft.description}</p>
        
        {/* Traits */}
        <div className="nft-traits">
          <span className="trait">
            <label>Type:</label> {nft.type}
          </span>
          <span className="trait">
            <label>Rarity:</label> {isGenesis ? 'Legendary' : nft.rarity}
          </span>
          {isGenesis && (
            <span className="trait genesis-trait">
              <label>Status:</label> Genesis (1 of 1)
            </span>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .nft-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: #1a1a1a;
          border: 2px solid ${isGenesis ? '#FFD700' : '#333'};
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .nft-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
        
        .genesis-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 10;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          color: #000;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: bold;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
          animation: pulse 2s ease-in-out infinite;
        }
        
        .genesis-icon {
          font-size: 14px;
          animation: sparkle 1.5s ease-in-out infinite;
        }
        
        .genesis-tooltip {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 8px;
          background: rgba(0, 0, 0, 0.95);
          color: #FFD700;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          white-space: nowrap;
          border: 1px solid #FFD700;
        }
        
        .genesis-badge:hover .genesis-tooltip {
          display: block;
        }
        
        .nft-image {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
        }
        
        .nft-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .nft-id {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.8);
          color: ${isGenesis ? '#FFD700' : '#fff'};
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .nft-details {
          padding: 16px;
        }
        
        .nft-details h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          color: ${isGenesis ? '#FFD700' : '#fff'};
        }
        
        .nft-description {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #999;
          line-height: 1.4;
        }
        
        .nft-traits {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .trait {
          background: #2a2a2a;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 12px;
          color: #ccc;
        }
        
        .trait label {
          color: #666;
          margin-right: 4px;
        }
        
        .genesis-trait {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
          color: #000;
          font-weight: bold;
        }
        
        .genesis-trait label {
          color: #000;
        }
        
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
          }
          50% {
            box-shadow: 0 4px 20px rgba(255, 215, 0, 0.7);
          }
        }
        
        @keyframes sparkle {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(1.2) rotate(-10deg);
          }
          75% {
            transform: scale(1.2) rotate(10deg);
          }
        }
      `}</style>
    </div>
  );
};

// Helper function to check if an NFT is Genesis
export const isGenesisNFT = (nftId: number): boolean => {
  return nftId === 0 || nftId === 1;
};

// Helper to get Genesis metadata
export const getGenesisMetadata = (nftId: number) => {
  if (nftId === 0) {
    return {
      status: 'Genesis #1',
      description: 'The very first NFT minted in the Semester Zero collection',
      rarity: 'Legendary',
      specialTrait: '1 of 1'
    };
  }
  if (nftId === 1) {
    return {
      status: 'Genesis #2',
      description: 'The second NFT ever minted in Semester Zero',
      rarity: 'Legendary',
      specialTrait: '1 of 1'
    };
  }
  return null;
};
