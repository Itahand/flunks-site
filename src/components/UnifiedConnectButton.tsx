import React, { useState } from 'react';
import { useUnifiedWallet } from '../contexts/UnifiedWalletContext';
import WalletConnectionModal from './WalletConnectionModal';

interface UnifiedConnectButtonProps {
  children: React.ReactElement;
}

const UnifiedConnectButton: React.FC<UnifiedConnectButtonProps> = ({ children }) => {
  const { isConnected } = useUnifiedWallet();
  const [showModal, setShowModal] = useState(false);

  // If already connected, render children as-is (they might have their own onClick)
  if (isConnected) {
    return children;
  }

  // If not connected, intercept click to show wallet selection modal
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      {React.cloneElement(children, { onClick: handleClick })}
      {showModal && <WalletConnectionModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default UnifiedConnectButton;
