import React, { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import * as fcl from '@onflow/fcl';
import '../config/fcl';

interface SemesterZeroSetupProps {
  onClose?: () => void;
  compact?: boolean;
}

const SemesterZeroSetup: React.FC<SemesterZeroSetupProps> = ({ onClose, compact = false }) => {
  const { primaryWallet } = useDynamicContext();
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const [hasCollection, setHasCollection] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Check allowlist status and collection status
  useEffect(() => {
    if (primaryWallet?.address) {
      checkStatus();
    }
  }, [primaryWallet?.address]);

  const checkStatus = async () => {
    if (!primaryWallet?.address) return;

    try {
      setIsLoading(true);

      // Check if user has completed Chapter 5 requirements (slacker + overachiever)
      const completionResponse = await fetch(`/api/check-chapter5-completion?address=${primaryWallet.address}`);
      const completionData = await completionResponse.json();
      setIsAllowed(completionData.success && completionData.isFullyComplete);

      // Check if collection already exists
      const collectionExists = await fcl.query({
        cadence: `
          import SemesterZero from 0x807c3d470888cc48
          import NonFungibleToken from 0x1d7e57aa55817448
          
          access(all) fun main(address: Address): Bool {
            return getAccount(address)
              .capabilities.get<&{NonFungibleToken.Receiver}>(SemesterZero.Chapter5CollectionPublicPath)
              .check()
          }
        `,
        args: (arg, t) => [arg(primaryWallet.address, t.Address)],
      });

      setHasCollection(collectionExists);

    } catch (error) {
      console.error('Error checking status:', error);
      setMessage('❌ Error checking status');
    } finally {
      setIsLoading(false);
    }
  };

  const setupCollection = async () => {
    if (!primaryWallet?.address) {
      setMessage('❌ Please connect your wallet first');
      return;
    }

    if (!isAllowed) {
      setMessage('🔒 Complete Chapter 5 Slacker & Overachiever objectives first!');
      return;
    }

    if (hasCollection) {
      setMessage('✅ You already have Flunks: Semester Zero enabled!');
      return;
    }

    try {
      setIsLoading(true);
      setMessage('⏳ Setting up your Flunks: Semester Zero collection...');

      console.log('🏆 Setting up Flunks: Semester Zero collection...');
      console.log('📡 Using wallet address:', primaryWallet.address);

      const createCollectionCadence = `
// Create Chapter5 NFT collection only
// UserProfile is managed in Supabase

import SemesterZero from 0x807c3d470888cc48
import NonFungibleToken from 0x1d7e57aa55817448

transaction() {
  prepare(signer: auth(Storage, Capabilities) &Account) {
    // Check if user already has Chapter 5 collection
    if signer.storage.borrow<&SemesterZero.Chapter5Collection>(from: SemesterZero.Chapter5CollectionStoragePath) == nil {
      // Create collection
      let collection <- SemesterZero.createEmptyChapter5Collection()
      signer.storage.save(<-collection, to: SemesterZero.Chapter5CollectionStoragePath)
      
      // Link public capability
      let nftCap = signer.capabilities.storage.issue<&{NonFungibleToken.Receiver}>(SemesterZero.Chapter5CollectionStoragePath)
      signer.capabilities.publish(nftCap, at: SemesterZero.Chapter5CollectionPublicPath)
      
      log("✅ Created Chapter 5 NFT collection")
    } else {
      log("ℹ️ Collection already exists")
    }
  }
  
  execute {
    log("🎃 Ready to receive Chapter 5 NFTs!")
  }
}
      `;

      // Send the transaction
      const transactionId = await fcl.mutate({
        cadence: createCollectionCadence,
        args: (arg, t) => [],
        payer: fcl.currentUser,
        proposer: fcl.currentUser,
        authorizations: [fcl.currentUser],
        limit: 9999,
      });

      console.log('📤 Transaction sent:', transactionId);

      // Wait for transaction to be sealed
      console.log('⏳ Waiting for transaction to be sealed...');
      const result = await fcl.tx(transactionId).onceSealed();
      
      console.log('✅ Transaction sealed successfully:', result);
      setMessage('🎉 Flunks: Semester Zero enabled! You\'re ready to receive NFTs!');
      setHasCollection(true);

    } catch (error) {
      console.error('💥 Error setting up collection:', error);
      
      // Provide more specific error messages
      let errorMessage = '❌ Failed to setup collection. ';
      
      if (error.message && error.message.includes('ErrInvalidRequest')) {
        errorMessage += 'The transaction is not supported. This might be a wallet or network issue.';
      } else if (error.message && error.message.includes('declined')) {
        errorMessage += 'Transaction was declined by user.';
      } else if (error.message && error.message.includes('timeout')) {
        errorMessage += 'Transaction timed out. Please try again.';
      } else if (error.message && error.message.includes('insufficient')) {
        errorMessage += 'Insufficient account balance for transaction fees.';
      } else {
        errorMessage += 'Please check your wallet connection and try again.';
      }
      
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

    const getStatusDisplay = () => {
    if (isLoading) return { text: '⏳ Checking...', color: '#666' };
    if (!primaryWallet?.address) return { text: '❌ Wallet not connected', color: '#ff6b6b' };
    if (hasCollection) return { text: '✅ Collection enabled', color: '#51cf66' };
    if (isAllowed === false) return { text: '🔒 Complete Ch5 objectives', color: '#ff6b6b' };
    if (isAllowed === true) return { text: '✅ Ready to setup', color: '#51cf66' };
    return { text: '❓ Checking eligibility...', color: '#666' };
  };  
  
  const canSetup = primaryWallet?.address && isAllowed && !hasCollection && !isLoading;
  const status = getStatusDisplay();

  if (compact) {
    return (
      <div className="p-3 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg border-2 border-purple-500">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white">🎓 Semester Zero</h3>
          <span className="text-xs" style={{ color: status.color }}>{status.text}</span>
        </div>
        
        {message && (
          <p className="text-xs text-yellow-300 mb-2">{message}</p>
        )}
        
        <button
          onClick={setupCollection}
          disabled={!canSetup}
          className={`w-full text-xs py-1 px-2 rounded font-bold transition-all duration-300 ${
            canSetup 
              ? 'bg-green-600 hover:bg-green-500 text-white hover:scale-105' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {hasCollection ? '✅ Ready' : isLoading ? '⏳ Working...' : '🚀 Get Collection'}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-lg border-4 border-purple-400 shadow-2xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Cooper Black, Georgia, serif' }}>
          🎓 Flunks: Semester Zero
        </h2>
        <p className="text-purple-200 text-sm">Get your Chapter 5 collection ready</p>
      </div>

      <div className="bg-black bg-opacity-30 p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold">Status:</span>
          <span className="font-bold" style={{ color: status.color }}>
            {status.text}
          </span>
        </div>
        
        {primaryWallet?.address && (
          <div className="text-xs text-gray-300">
            <span className="opacity-70">Wallet:</span> {primaryWallet.address.slice(0, 8)}...{primaryWallet.address.slice(-6)}
          </div>
        )}
      </div>

      {message && (
        <div className="bg-yellow-900 bg-opacity-50 border border-yellow-500 p-3 rounded-lg mb-4">
          <p className="text-yellow-200 text-sm">{message}</p>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={setupCollection}
          disabled={!canSetup}
          className={`w-full py-3 px-6 rounded-lg font-black text-lg transition-all duration-300 ${
            canSetup 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white border-2 border-green-400 hover:scale-105 shadow-lg' 
              : 'bg-gray-700 text-gray-400 cursor-not-allowed border-2 border-gray-600'
          }`}
          style={{ fontFamily: 'Cooper Black, Georgia, serif' }}
        >
          {hasCollection ? '✅ Collection Ready' : isLoading ? '⏳ Preparing...' : '🚀 Get Collection'}
        </button>

        <button
          onClick={checkStatus}
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105"
        >
          🔄 Refresh Status
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-semibold text-sm transition-all duration-300"
          >
            Close
          </button>
        )}
      </div>

      <div className="mt-4 text-xs text-purple-200 opacity-70">
        <p>💡 Setup access is currently limited to select users.</p>
        <p>🎮 Complete Semester Zero objectives to gain access!</p>
      </div>
    </div>
  );
};

export default SemesterZeroSetup;