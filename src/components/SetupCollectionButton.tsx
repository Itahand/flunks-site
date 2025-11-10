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
          
          // Check if storage has the collection
          let hasStorage = account.storage.borrow<&SemesterZero.Chapter5Collection>(
            from: SemesterZero.Chapter5CollectionStoragePath
          ) != nil
          
          if !hasStorage {
            return false
          }
          
          // Also check public capability (for receiving NFTs)
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
      // On error, assume collection doesn't exist to allow setup
      setHasCollection(false);
    }
  };

  const setupCollection = async () => {
    if (!wallet || settingUp) return;

    setSettingUp(true);
    setMessage('Setting up collection...');

    try {
      // Simplified transaction for Dapper Wallet compatibility
      // Uses minimal auth entitlements that Dapper supports
      const transaction = `
        import SemesterZero from 0x807c3d470888cc48
        import NonFungibleToken from 0x1d7e57aa55817448
        
        transaction {
          prepare(signer: &Account) {
            // Check if collection already exists in storage
            let existingCollection = signer.storage.borrow<&SemesterZero.Chapter5Collection>(
              from: SemesterZero.Chapter5CollectionStoragePath
            )
            
            if existingCollection != nil {
              log("✅ Collection already exists in storage")
              
              // Check if public capability exists
              let existingCap = signer.capabilities.get<&SemesterZero.Chapter5Collection>(
                SemesterZero.Chapter5CollectionPublicPath
              )
              
              // If capability doesn't exist or is invalid, recreate it
              if !existingCap.check() {
                log("🔧 Recreating public capability...")
                
                // Unpublish old capability if it exists (Dapper-safe)
                signer.capabilities.unpublish(SemesterZero.Chapter5CollectionPublicPath)
                
                // Create new public capability (Dapper-safe)
                let newCap = signer.capabilities.storage.issue<&SemesterZero.Chapter5Collection>(
                  SemesterZero.Chapter5CollectionStoragePath
                )
                signer.capabilities.publish(newCap, at: SemesterZero.Chapter5CollectionPublicPath)
                
                log("✅ Public capability restored!")
              }
              
              return
            }
            
            log("🆕 Creating new collection...")
            
            // Create new empty collection
            let collection <- SemesterZero.createEmptyCollection(nftType: Type<@SemesterZero.Chapter5NFT>())
            
            // Save collection to storage (Dapper-safe)
            signer.storage.save(<-collection, to: SemesterZero.Chapter5CollectionStoragePath)
            
            // Create public capability (Dapper-safe)
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
      
      const sealedTx = await fcl.tx(txId).onceSealed();
      
      // Check if transaction succeeded
      if (sealedTx.status === 4 && sealedTx.statusCode === 0) {
        setMessage('✅ Collection set up successfully!');
        setHasCollection(true);
        
        if (onSuccess) {
          onSuccess();
        }
        
        // Recheck collection status
        setTimeout(() => {
          checkCollection(wallet);
        }, 1000);
        
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Transaction failed with status: ' + sealedTx.statusCode);
      }
      
    } catch (error: any) {
      console.error('Setup failed:', error);
      
      // Parse common errors
      let errorMessage = 'Failed to set up collection';
      
      if (error.message?.includes('declined')) {
        errorMessage = 'Transaction was declined';
      } else if (error.message?.includes('Authorizers')) {
        errorMessage = 'Please approve the transaction in your wallet';
      } else if (error.message?.includes('Declined: User rejected')) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessage(`❌ ${errorMessage}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setSettingUp(false);
    }
  };

  // Don't show button if collection already exists
  if (hasCollection === true) {
    return compact ? null : (
      <SuccessContainer>
        <StatusText>✅ Collection ready!</StatusText>
        <RefreshButton onClick={() => wallet && checkCollection(wallet)}>
          🔄 Refresh
        </RefreshButton>
      </SuccessContainer>
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
      
      {message && <Message error={message.startsWith('❌')}>{message}</Message>}
      
      {!compact && (
        <HelpText>
          Required to receive Chapter 5 NFTs (Pins, Patches, etc.)
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

const SuccessContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
`;

const StatusText = styled.p`
  font-size: 12px;
  color: #10b981;
  font-weight: bold;
  margin: 0;
`;

const RefreshButton = styled.button`
  background: rgba(99, 102, 241, 0.2);
  color: #6366f1;
  border: 1px solid #6366f1;
  padding: 4px 12px;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(99, 102, 241, 0.3);
    transform: scale(1.05);
  }
`;

const Message = styled.p<{ error?: boolean }>`
  font-size: 11px;
  color: #fff;
  background: ${props => props.error ? 'rgba(239, 68, 68, 0.8)' : 'rgba(0, 0, 0, 0.7)'};
  padding: 8px 16px;
  border-radius: 6px;
  margin: 0;
  text-align: center;
  max-width: 300px;
  border: ${props => props.error ? '1px solid #ef4444' : 'none'};
`;

const HelpText = styled.p`
  font-size: 10px;
  color: #9ca3af;
  margin: 0;
  text-align: center;
  font-style: italic;
`;

export default SetupCollectionButton;
