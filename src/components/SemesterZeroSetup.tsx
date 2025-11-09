import React from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useUnifiedWallet } from '../contexts/UnifiedWalletContext';
import SetupCollectionButton from './SetupCollectionButton';
import '../config/fcl';

interface SemesterZeroSetupProps {
  onClose?: () => void;
  compact?: boolean;
}

/**
 * Semester Zero NFT Collection Setup
 * Wrapper component for the homepage Semester Zero app
 * Uses the new SetupCollectionButton component
 */
const SemesterZeroSetup: React.FC<SemesterZeroSetupProps> = ({ onClose, compact = false }) => {
  const { primaryWallet } = useDynamicContext();
  const { address: unifiedAddress } = useUnifiedWallet();
  
  // Use unified address (works for both Dapper and FCL wallets)
  const walletAddress = unifiedAddress || primaryWallet?.address;

  // Compact version for small UI elements
  if (compact) {
    return (
      <div className="p-3 bg-gradient-to-br from-purple-800 via-indigo-800 to-blue-800 rounded border-2 border-purple-400">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white">🎓 Semester Zero</h3>
        </div>
        <SetupCollectionButton 
          wallet={walletAddress} 
          compact={true}
        />
      </div>
    );
  }

  // Full version for desktop app window
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      {/* Header */}
      <div className="bg-purple-800 border-b-2 border-purple-600 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">🎓 Semester Zero Collection</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded font-bold transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Wallet Info */}
          <div className="bg-purple-800/50 border border-purple-600 rounded-lg p-4">
            <p className="text-sm text-purple-200 mb-1">Connected Wallet:</p>
            <p className="font-mono text-sm">
              {walletAddress || 'Not connected'}
            </p>
          </div>

          {/* Setup Button */}
          <div className="bg-purple-800/30 border-2 border-purple-600 rounded-lg p-6">
            <SetupCollectionButton 
              wallet={walletAddress}
              compact={false}
            />
          </div>

          {/* Help Text */}
          <div className="bg-indigo-900/50 border border-indigo-600 rounded-lg p-4 text-sm space-y-2">
            <p className="text-indigo-200">
              💡 <strong>Need help?</strong> You can also set up your collection at the Paradise Motel lobby.
            </p>
            <p className="text-indigo-300 text-xs">
              Once your collection is set up, you'll be able to receive Semester Zero NFTs and view them on Flowty.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SemesterZeroSetup;
