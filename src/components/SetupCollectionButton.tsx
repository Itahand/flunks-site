import React, { useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';
import styled from 'styled-components';

/**
 * SemesterZero Collection Setup Button
 * Allows users to initialize their Chapter 5 NFT collection
 * Must be set up before receiving airdrops
 */

interface SetupCollectionButtonProps {
  wallet?: string;
  onSuccess?: () => void;
  compact?: boolean;
}

export const SetupCollectionButton: React.FC<SetupCollectionButtonProps> = ({ 
  wallet, 
  onSuccess,
  compact = false 
}) => {
  const [hasCollection, setHasCollection] = useState<boolean | null>(null);
  const [settingUp, setSettingUp] = useState(false);
  const [message, setMessage] = useState('');

  // Check if user already has collection
  useEffect(() => {
    if (!wallet) {
      setHasCollection(null);
      return;
    }
    
    checkCollection(wallet);
  }, [wallet]);

  const checkCollection = async (address: string) => {
    try {
      const script = `
        import SemesterZero from 0x807c3d470888cc48
        
        access(all) fun main(address: Address): Bool {
          let account = getAccount(address)
          
          let collectionRef = account.capabilities
            .borrow<&SemesterZero.Chapter5Collection>(
              SemesterZero.Chapter5CollectionPublicPath
            )
          
          return collectionRef != nil
        }
      `;
      
      const result = await fcl.query({
        cadence: script,
        args: (arg: any, t: any) => [arg(address, t.Address)]
      });
      
      setHasCollection(result);
    } catch (error) {
      console.error('Error checking collection:', error);
      setHasCollection(false);
    }
  };

  const setupCollection = async () => {
    if (!wallet || settingUp) return;

    setSettingUp(true);
    setMessage('Setting up collection...');

    try {
      const transaction = `
        import SemesterZero from 0x807c3d470888cc48
        import NonFungibleToken from 0x1d7e57aa55817448
        
        transaction {
          prepare(signer: auth(SaveValue, Capabilities, IssueStorageCapabilityController, PublishCapability, BorrowValue) &Account) {
            // Check if collection already exists
            if signer.storage.borrow<&SemesterZero.Chapter5Collection>(
              from: SemesterZero.Chapter5CollectionStoragePath
            ) != nil {
              log("✅ SemesterZero collection already set up")
              return
            }
            
            // Create new empty collection
            let collection <- SemesterZero.createEmptyCollection(nftType: Type<@SemesterZero.Chapter5NFT>())
            
            // Save collection to storage
            signer.storage.save(<-collection, to: SemesterZero.Chapter5CollectionStoragePath)
            
            // Create public capability
            let collectionCap = signer.capabilities.storage.issue<&SemesterZero.Chapter5Collection>(
              SemesterZero.Chapter5CollectionStoragePath
            )
            signer.capabilities.publish(collectionCap, at: SemesterZero.Chapter5CollectionPublicPath)
            
            log("🎉 SemesterZero collection created!")
          }
        }
      `;

      const txId = await fcl.mutate({
        cadence: transaction,
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        authorizations: [fcl.currentUser],
        limit: 999
      });

      setMessage('Transaction submitted. Waiting for confirmation...');
      
      await fcl.tx(txId).onceSealed();
      
      setMessage('✅ Collection set up successfully!');
      setHasCollection(true);
      
      if (onSuccess) {
        onSuccess();
      }
      
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error: any) {
      console.error('Setup failed:', error);
      setMessage(`❌ ${error.message || 'Failed to set up collection'}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setSettingUp(false);
    }
  };

  // Don't show button if collection already exists
  if (hasCollection === true) {
    return compact ? null : (
      <StatusText>✅ Collection ready!</StatusText>
    );
  }

  // Don't show if still checking
  if (hasCollection === null && wallet) {
    return compact ? null : (
      <StatusText>Checking collection...</StatusText>
    );
  }

  // Don't show if no wallet
  if (!wallet) {
    return compact ? null : (
      <StatusText>Connect wallet to set up collection</StatusText>
    );
  }

  return (
    <Container compact={compact}>
      <SetupButton
        onClick={setupCollection}
        disabled={settingUp}
        compact={compact}
      >
        {settingUp ? '⏳ Setting up...' : '🎫 Set up Collection'}
      </SetupButton>
      
      {message && <Message>{message}</Message>}
      
      {!compact && (
        <HelpText>
          Required to receive Chapter 5 NFTs
        </HelpText>
      )}
    </Container>
  );
};

const Container = styled.div<{ compact?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.compact ? '8px' : '12px'};
  padding: ${props => props.compact ? '8px' : '16px'};
`;

const SetupButton = styled.button<{ compact?: boolean }>`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: ${props => props.compact ? '10px 20px' : '14px 28px'};
  font-size: ${props => props.compact ? '11px' : '13px'};
  font-weight: bold;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatusText = styled.p`
  font-size: 12px;
  color: #10b981;
  font-weight: bold;
  margin: 0;
  padding: 8px 16px;
`;

const Message = styled.p`
  font-size: 11px;
  color: #fff;
  background: rgba(0, 0, 0, 0.7);
  padding: 8px 16px;
  border-radius: 6px;
  margin: 0;
  text-align: center;
  max-width: 300px;
`;

const HelpText = styled.p`
  font-size: 10px;
  color: #9ca3af;
  margin: 0;
  text-align: center;
  font-style: italic;
`;

export default SetupCollectionButton;
