import React, { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { usePaginatedItems } from '../contexts/UserPaginatedItems';

interface FootballerGumClaimButtonProps {
  onClaimComplete?: () => void;
}

const FootballerGumClaimButton: React.FC<FootballerGumClaimButtonProps> = ({ onClaimComplete }) => {
  const { primaryWallet } = useDynamicContext();
  const { allItems } = usePaginatedItems();
  const [loading, setLoading] = useState(false);
  const [hasFootballerFlunk, setHasFootballerFlunk] = useState(false);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if user has footballer traits and claim status
  useEffect(() => {
    const checkFootballerEligibility = async () => {
      if (!primaryWallet?.address || !allItems?.length) {
        setHasFootballerFlunk(false);
        setChecking(false);
        return;
      }

      try {
        // Check if user has any Flunks with footballer traits
        const hasFootballer = allItems.some(item => 
          item.collection === 'Flunks' &&
          item.traits?.traits?.some((trait: any) => 
            trait.name === 'Torso' && 
            (trait.value.includes('FOOTBALLER-FLUNK-HOME') || 
             trait.value.includes('FOOTBALLER-FLUNK-AWAY'))
          )
        );

        setHasFootballerFlunk(hasFootballer);

        // Check if they've already claimed this reward
        if (hasFootballer) {
          const response = await fetch('/api/check-footballer-claim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress: primaryWallet.address })
          });
          
          if (response.ok) {
            const { alreadyClaimed } = await response.json();
            setAlreadyClaimed(alreadyClaimed);
          }
        }
      } catch (error) {
        console.error('Error checking footballer eligibility:', error);
        setHasFootballerFlunk(false);
      } finally {
        setChecking(false);
      }
    };

    checkFootballerEligibility();
  }, [primaryWallet?.address, allItems]);

  const handleClaim = async () => {
    if (!primaryWallet?.address || loading || alreadyClaimed || !hasFootballerFlunk) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/claim-footballer-gum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          walletAddress: primaryWallet.address 
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`🏈 Success! You've claimed ${result.gumAwarded} GUM for owning a Footballer Flunk!`);
        setAlreadyClaimed(true);
        onClaimComplete?.();
      } else {
        alert(`❌ ${result.message || 'Failed to claim reward. Please try again.'}`);
      }
    } catch (error) {
      console.error('Error claiming footballer reward:', error);
      alert('❌ Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div style={{
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ color: '#ccc', fontSize: '14px' }}>
          ⏳ Checking your Flunks for Footballer traits...
        </div>
      </div>
    );
  }

  if (!primaryWallet?.address) {
    return (
      <div style={{
        padding: '16px',
        background: 'rgba(255, 0, 0, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 0, 0, 0.3)'
      }}>
        <div style={{ color: '#ff6b6b', fontSize: '14px' }}>
          🔌 Please connect your wallet to check eligibility
        </div>
      </div>
    );
  }

  if (!hasFootballerFlunk) {
    return (
      <div style={{
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ color: '#999', fontSize: '14px', textAlign: 'center' }}>
          🏈 No Footballer Flunks found in your wallet
          <br />
          <small>You need a Flunk with "Footballer Flunk Home" or "Footballer Flunk Away" traits</small>
        </div>
      </div>
    );
  }

  if (alreadyClaimed) {
    return (
      <div style={{
        padding: '16px',
        background: 'rgba(0, 255, 0, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(0, 255, 0, 0.3)'
      }}>
        <div style={{ color: '#32cd32', fontSize: '14px', textAlign: 'center' }}>
          ✅ You've already claimed your Footballer reward!
          <br />
          <small>100 GUM was added to your balance</small>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleClaim}
      disabled={loading || alreadyClaimed}
      style={{
        background: loading 
          ? 'rgba(128, 128, 128, 0.3)' 
          : 'linear-gradient(145deg, #FFD700, #FFA500)',
        border: '2px solid #FFD700',
        borderRadius: '12px',
        color: loading ? '#999' : '#000',
        padding: '16px 24px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: loading ? 'not-allowed' : 'pointer',
        width: '100%',
        transition: 'all 0.3s ease',
        boxShadow: loading ? 'none' : '0 4px 12px rgba(255, 215, 0, 0.4)',
        transform: loading ? 'none' : 'translateY(-2px)'
      }}
      onMouseEnter={(e) => {
        if (!loading && !alreadyClaimed) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.6)';
        }
      }}
      onMouseLeave={(e) => {
        if (!loading && !alreadyClaimed) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.4)';
        }
      }}
    >
      {loading ? (
        <>⏳ Claiming...</>
      ) : (
        <>🏈 Claim 100 GUM</>
      )}
    </button>
  );
};

export default FootballerGumClaimButton;
