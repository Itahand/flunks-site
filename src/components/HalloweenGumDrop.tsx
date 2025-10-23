import React, { useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

/**
 * Halloween GumDrop Component
 * 72-hour claim window starting Halloween 6pm EST
 * Awards 10 GUM per Flunk NFT owned
 * 
 * Features:
 * - Auto-closes after 72 hours (no manual intervention)
 * - Blockchain verifies eligibility
 * - Backend adds GUM to Supabase
 * - Real-time countdown timer
 */

interface GumDropInfo {
  dropId: string;
  gumPerFlunk: number;
  startTime: number;
  endTime: number;
  isActive: boolean;
  timeRemaining: number;
  totalEligible: number;
  totalClaimed: number;
}

export default function HalloweenGumDrop() {
  const { primaryWallet } = useDynamicContext();
  const [dropInfo, setDropInfo] = useState<GumDropInfo | null>(null);
  const [isEligible, setIsEligible] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [flunkCount, setFlunkCount] = useState(0);
  const [claiming, setClaiming] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  // Fetch GumDrop info
  useEffect(() => {
    fetchGumDropInfo();
    const interval = setInterval(fetchGumDropInfo, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Check user eligibility
  useEffect(() => {
    if (primaryWallet?.address) {
      checkEligibility();
      getFlunkCount();
    }
  }, [primaryWallet?.address]);

  // Update countdown timer
  useEffect(() => {
    if (dropInfo?.timeRemaining) {
      const interval = setInterval(() => {
        const hours = Math.floor(dropInfo.timeRemaining / 3600);
        const minutes = Math.floor((dropInfo.timeRemaining % 3600) / 60);
        const seconds = Math.floor(dropInfo.timeRemaining % 60);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [dropInfo]);

  const fetchGumDropInfo = async () => {
    try {
      const response = await fcl.query({
        cadence: `
          import TestPumpkinDrop420 from 0x807c3d470888cc48
          
          access(all) fun main(): {String: AnyStruct}? {
            return TestPumpkinDrop420.getGumDropInfo()
          }
        `,
      });
      
      if (response) {
        setDropInfo(response as GumDropInfo);
      }
    } catch (error) {
      console.error('Error fetching GumDrop info:', error);
    }
  };

  const checkEligibility = async () => {
    if (!primaryWallet?.address) return;

    try {
      const eligible = await fcl.query({
        cadence: `
          import TestPumpkinDrop420 from 0x807c3d470888cc48
          
          access(all) fun main(user: Address): Bool {
            return TestPumpkinDrop420.isEligibleForGumDrop(user: user)
          }
        `,
        args: (arg: any, t: any) => [arg(primaryWallet.address, t.Address)],
      });

      setIsEligible(eligible);

      const claimed = await fcl.query({
        cadence: `
          import TestPumpkinDrop420 from 0x807c3d470888cc48
          
          access(all) fun main(user: Address): Bool {
            return TestPumpkinDrop420.hasClaimedGumDrop(user: user)
          }
        `,
        args: (arg: any, t: any) => [arg(primaryWallet.address, t.Address)],
      });

      setHasClaimed(claimed);
    } catch (error) {
      console.error('Error checking eligibility:', error);
    }
  };

  const getFlunkCount = async () => {
    if (!primaryWallet?.address) return;

    try {
      // TODO: Replace with actual Flunks NFT collection check
      // For now, fetch from backend
      const response = await fetch(`/api/get-flunk-count?address=${primaryWallet.address}`);
      const data = await response.json();
      setFlunkCount(data.flunkCount || 0);
    } catch (error) {
      console.error('Error fetching Flunk count:', error);
    }
  };

  const claimGumDrop = async () => {
    if (!primaryWallet?.address || !isEligible || hasClaimed || flunkCount === 0) return;

    setClaiming(true);

    try {
      // Step 1: Call backend to add GUM to Supabase
      const gumAmount = flunkCount * 10;
      
      const response = await fetch('/api/claim-halloween-gum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: primaryWallet.address,
          flunkCount,
          gumAmount,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to claim GUM');
      }

      // Step 2: Mark as claimed on blockchain
      const transactionId = await fcl.mutate({
        cadence: `
          import TestPumpkinDrop420 from 0x807c3d470888cc48
          
          transaction(flunkCount: Int) {
            let adminRef: &TestPumpkinDrop420.Admin
            
            prepare(signer: AuthAccount) {
              self.adminRef = signer.borrow<&TestPumpkinDrop420.Admin>(from: TestPumpkinDrop420.AdminStoragePath)
                ?? panic("Could not borrow Admin reference")
            }
            
            execute {
              self.adminRef.markGumClaimed(user: signer.address, flunkCount: flunkCount)
            }
          }
        `,
        args: (arg: any, t: any) => [arg(flunkCount, t.Int)],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 100,
      });

      console.log('Transaction ID:', transactionId);
      await fcl.tx(transactionId).onceSealed();

      alert(`🎃 Halloween GumDrop claimed! You received ${gumAmount} GUM!`);
      setHasClaimed(true);
      await fetchGumDropInfo();
    } catch (error) {
      console.error('Error claiming GumDrop:', error);
      alert('Failed to claim GumDrop. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  if (!dropInfo || !dropInfo.isActive) {
    return (
      <div className="halloween-gumdrop inactive">
        <h2>🎃 Halloween GumDrop</h2>
        <p>No active GumDrop at this time.</p>
        <p>Check back on Halloween (October 31, 6pm EST)!</p>
      </div>
    );
  }

  return (
    <div className="halloween-gumdrop active">
      <div className="gumdrop-header">
        <h2>🎃 Halloween GumDrop</h2>
        <div className="countdown">
          <span>Time Remaining:</span>
          <strong>{timeLeft}</strong>
        </div>
      </div>

      <div className="gumdrop-info">
        <p>
          <strong>Reward:</strong> 10 GUM per Flunk NFT owned
        </p>
        <p>
          <strong>Your Flunks:</strong> {flunkCount}
        </p>
        <p>
          <strong>Your Reward:</strong> {flunkCount * 10} GUM
        </p>
      </div>

      <div className="gumdrop-stats">
        <span>{dropInfo.totalClaimed} / {dropInfo.totalEligible} claimed</span>
      </div>

      {!primaryWallet?.address ? (
        <button disabled className="claim-button">
          Connect Wallet to Claim
        </button>
      ) : hasClaimed ? (
        <button disabled className="claim-button claimed">
          ✅ Already Claimed
        </button>
      ) : !isEligible ? (
        <button disabled className="claim-button">
          Not Eligible
        </button>
      ) : flunkCount === 0 ? (
        <button disabled className="claim-button">
          No Flunks NFTs Owned
        </button>
      ) : (
        <button 
          onClick={claimGumDrop} 
          disabled={claiming}
          className="claim-button eligible"
        >
          {claiming ? 'Claiming...' : `🎃 Claim ${flunkCount * 10} GUM`}
        </button>
      )}

      <style jsx>{`
        .halloween-gumdrop {
          background: linear-gradient(135deg, #ff6b00 0%, #ff4500 100%);
          border-radius: 16px;
          padding: 24px;
          color: white;
          max-width: 500px;
          margin: 20px auto;
          box-shadow: 0 8px 24px rgba(255, 107, 0, 0.4);
        }

        .gumdrop-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .countdown {
          background: rgba(0, 0, 0, 0.2);
          padding: 8px 16px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .countdown span {
          font-size: 12px;
          opacity: 0.8;
        }

        .countdown strong {
          font-size: 18px;
          font-weight: bold;
        }

        .gumdrop-info {
          background: rgba(0, 0, 0, 0.2);
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .gumdrop-info p {
          margin: 8px 0;
        }

        .gumdrop-stats {
          text-align: center;
          margin-bottom: 16px;
          opacity: 0.9;
        }

        .claim-button {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 8px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .claim-button.eligible {
          background: #00ff88;
          color: #000;
        }

        .claim-button.eligible:hover {
          background: #00dd77;
          transform: scale(1.02);
        }

        .claim-button.claimed {
          background: #666;
          color: #fff;
          cursor: not-allowed;
        }

        .claim-button:disabled {
          background: #444;
          color: #888;
          cursor: not-allowed;
        }

        .inactive {
          background: linear-gradient(135deg, #555 0%, #333 100%);
        }
      `}</style>
    </div>
  );
}
