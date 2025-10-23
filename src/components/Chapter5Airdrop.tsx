import React, { useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

/**
 * Chapter 5 Airdrop Component
 * NFT airdrop for completing both Slacker AND Overachiever objectives
 * 
 * Features:
 * - Checks Supabase for Room 7 night visit (Slacker)
 * - Checks Supabase for all objectives complete (Overachiever)
 * - Registers completions on blockchain
 * - Airdrops NFT when both are complete
 */

interface Chapter5Status {
  userAddress: string;
  slackerComplete: boolean;
  overachieverComplete: boolean;
  nftAirdropped: boolean;
  nftID?: number;
  slackerTimestamp: number;
  overachieverTimestamp: number;
  completionTimestamp: number;
}

export default function Chapter5Airdrop() {
  const { primaryWallet } = useDynamicContext();
  const [status, setStatus] = useState<Chapter5Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  // Check Chapter 5 completion status
  useEffect(() => {
    if (primaryWallet?.address) {
      checkChapter5Status();
    }
  }, [primaryWallet?.address]);

  const checkChapter5Status = async () => {
    if (!primaryWallet?.address) return;

    setLoading(true);

    try {
      // Step 1: Check blockchain status
      const blockchainStatus = await fcl.query({
        cadence: `
          import SemesterZero from 0xYOUR_CONTRACT_ADDRESS
          
          access(all) fun main(userAddress: Address): SemesterZero.Chapter5Status? {
            return SemesterZero.getChapter5Status(userAddress: userAddress)
          }
        `,
        args: (arg: any, t: any) => [arg(primaryWallet.address, t.Address)],
      });

      // Step 2: Check Supabase for actual objective completion
      const response = await fetch(`/api/check-chapter5-completion?address=${primaryWallet.address}`);
      const supabaseStatus = await response.json();

      // Combine blockchain + Supabase status
      setStatus({
        userAddress: primaryWallet.address,
        slackerComplete: blockchainStatus?.slackerComplete || false,
        overachieverComplete: blockchainStatus?.overachieverComplete || false,
        nftAirdropped: blockchainStatus?.nftAirdropped || false,
        nftID: blockchainStatus?.nftID,
        slackerTimestamp: blockchainStatus?.slackerTimestamp || 0,
        overachieverTimestamp: blockchainStatus?.overachieverTimestamp || 0,
        completionTimestamp: blockchainStatus?.completionTimestamp || 0,
      });

      // Auto-register completions if not yet on blockchain
      if (supabaseStatus.slackerComplete && !blockchainStatus?.slackerComplete) {
        await registerSlackerCompletion();
      }

      if (supabaseStatus.overachieverComplete && !blockchainStatus?.overachieverComplete) {
        await registerOverachieverCompletion();
      }

      setLoading(false);
    } catch (error) {
      console.error('Error checking Chapter 5 status:', error);
      setLoading(false);
    }
  };

  const registerSlackerCompletion = async () => {
    if (!primaryWallet?.address) return;

    try {
      // Call backend to register on blockchain
      const response = await fetch('/api/register-slacker-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: primaryWallet.address,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Slacker completion registered on blockchain');
        await checkChapter5Status();
      }
    } catch (error) {
      console.error('Error registering slacker completion:', error);
    }
  };

  const registerOverachieverCompletion = async () => {
    if (!primaryWallet?.address) return;

    try {
      // Call backend to register on blockchain
      const response = await fetch('/api/register-overachiever-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: primaryWallet.address,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Overachiever completion registered on blockchain');
        await checkChapter5Status();
      }
    } catch (error) {
      console.error('Error registering overachiever completion:', error);
    }
  };

  const claimNFT = async () => {
    if (!primaryWallet?.address) return;

    setClaiming(true);

    try {
      // Step 1: Setup Chapter 5 collection if not exists
      await setupCollection();

      // Step 2: Call backend to airdrop NFT
      const response = await fetch('/api/airdrop-chapter5-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: primaryWallet.address,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to airdrop NFT');
      }

      alert('🎉 Chapter 5 NFT airdropped! Check your wallet!');
      await checkChapter5Status();
    } catch (error) {
      console.error('Error claiming NFT:', error);
      alert('Failed to claim NFT. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  const setupCollection = async () => {
    if (!primaryWallet?.address) return;

    try {
      // Check if collection already exists
      const hasCollection = await fcl.query({
        cadence: `
          import SemesterZero from 0xYOUR_CONTRACT_ADDRESS
          
          access(all) fun main(address: Address): Bool {
            return getAccount(address)
              .capabilities.get<&SemesterZero.Chapter5Collection>(SemesterZero.Chapter5CollectionPublicPath)
              .check()
          }
        `,
        args: (arg: any, t: any) => [arg(primaryWallet.address, t.Address)],
      });

      if (hasCollection) {
        console.log('✅ Chapter 5 collection already exists');
        return;
      }

      // Create collection
      const transactionId = await fcl.mutate({
        cadence: `
          import SemesterZero from 0xYOUR_CONTRACT_ADDRESS
          
          transaction() {
            prepare(signer: AuthAccount) {
              // Create collection
              let collection <- SemesterZero.createEmptyChapter5Collection()
              
              // Save to storage
              signer.save(<-collection, to: SemesterZero.Chapter5CollectionStoragePath)
              
              // Link public capability
              signer.link<&SemesterZero.Chapter5Collection>(
                SemesterZero.Chapter5CollectionPublicPath,
                target: SemesterZero.Chapter5CollectionStoragePath
              )
            }
          }
        `,
        payer: fcl.currentUser,
        proposer: fcl.currentUser,
        authorizations: [fcl.currentUser],
        limit: 100,
      });

      console.log('Setting up Chapter 5 collection...', transactionId);
      await fcl.tx(transactionId).onceSealed();
      console.log('✅ Chapter 5 collection created');
    } catch (error) {
      console.error('Error setting up collection:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="chapter5-loading">
        <p>Checking Chapter 5 completion status...</p>
      </div>
    );
  }

  const isFullyComplete = status?.slackerComplete && status?.overachieverComplete;
  const isEligible = isFullyComplete && !status?.nftAirdropped;

  return (
    <div className="chapter5-airdrop">
      <div className="airdrop-header">
        <h2>🏆 Chapter 5 Completion NFT</h2>
        <p>Complete both objectives to earn your legendary NFT</p>
      </div>

      <div className="objectives-grid">
        <div className={`objective ${status?.slackerComplete ? 'complete' : 'incomplete'}`}>
          <div className="objective-icon">
            {status?.slackerComplete ? '✅' : '⏳'}
          </div>
          <div className="objective-info">
            <h3>Slacker Objective</h3>
            <p>Visit Paradise Motel Room 7 at night</p>
            {status?.slackerComplete && (
              <small>Completed {new Date(status.slackerTimestamp * 1000).toLocaleDateString()}</small>
            )}
          </div>
        </div>

        <div className={`objective ${status?.overachieverComplete ? 'complete' : 'incomplete'}`}>
          <div className="objective-icon">
            {status?.overachieverComplete ? '✅' : '⏳'}
          </div>
          <div className="objective-info">
            <h3>Overachiever Objective</h3>
            <p>Complete all weekly objectives</p>
            {status?.overachieverComplete && (
              <small>Completed {new Date(status.overachieverTimestamp * 1000).toLocaleDateString()}</small>
            )}
          </div>
        </div>
      </div>

      <div className="airdrop-status">
        {status?.nftAirdropped ? (
          <div className="already-claimed">
            <h3>🎉 NFT Already Claimed!</h3>
            <p>NFT ID: #{status.nftID}</p>
            <a 
              href={`https://flowscan.org/account/${primaryWallet?.address}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="view-nft-btn"
            >
              View in Wallet
            </a>
          </div>
        ) : isEligible ? (
          <button 
            onClick={claimNFT} 
            disabled={claiming}
            className="claim-nft-btn eligible"
          >
            {claiming ? 'Claiming NFT...' : '🎁 Claim Chapter 5 NFT'}
          </button>
        ) : (
          <div className="not-eligible">
            <p>Complete both objectives to unlock NFT airdrop</p>
            <div className="progress">
              <span>{(status?.slackerComplete ? 1 : 0) + (status?.overachieverComplete ? 1 : 0)} / 2 objectives complete</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .chapter5-airdrop {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 32px;
          color: white;
          max-width: 600px;
          margin: 20px auto;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .airdrop-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .airdrop-header h2 {
          margin: 0 0 8px 0;
          font-size: 28px;
        }

        .airdrop-header p {
          margin: 0;
          opacity: 0.9;
        }

        .objectives-grid {
          display: grid;
          gap: 16px;
          margin-bottom: 32px;
        }

        .objective {
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 12px;
          display: flex;
          gap: 16px;
          align-items: center;
          transition: all 0.3s ease;
        }

        .objective.complete {
          background: rgba(0, 255, 136, 0.2);
          border: 2px solid rgba(0, 255, 136, 0.5);
        }

        .objective.incomplete {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .objective-icon {
          font-size: 32px;
        }

        .objective-info h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
        }

        .objective-info p {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
        }

        .objective-info small {
          display: block;
          margin-top: 8px;
          opacity: 0.7;
          font-size: 12px;
        }

        .airdrop-status {
          text-align: center;
        }

        .claim-nft-btn {
          width: 100%;
          padding: 18px;
          border: none;
          border-radius: 12px;
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .claim-nft-btn.eligible {
          background: #00ff88;
          color: #000;
        }

        .claim-nft-btn.eligible:hover {
          background: #00dd77;
          transform: scale(1.02);
        }

        .claim-nft-btn:disabled {
          background: #666;
          color: #999;
          cursor: not-allowed;
        }

        .already-claimed {
          background: rgba(0, 255, 136, 0.2);
          padding: 24px;
          border-radius: 12px;
          border: 2px solid rgba(0, 255, 136, 0.5);
        }

        .already-claimed h3 {
          margin: 0 0 8px 0;
        }

        .already-claimed p {
          margin: 0 0 16px 0;
        }

        .view-nft-btn {
          display: inline-block;
          padding: 12px 24px;
          background: white;
          color: #667eea;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .view-nft-btn:hover {
          background: #f0f0f0;
          transform: scale(1.05);
        }

        .not-eligible {
          background: rgba(0, 0, 0, 0.2);
          padding: 24px;
          border-radius: 12px;
        }

        .not-eligible p {
          margin: 0 0 12px 0;
        }

        .progress {
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }

        .progress span {
          font-weight: bold;
        }

        .chapter5-loading {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }
      `}</style>
    </div>
  );
}
