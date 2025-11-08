import React from 'react';
import NFTBurner from '../../components/admin/NFTBurner';

/**
 * Admin page for burning NFTs
 * Access at: /admin/burn-nfts
 * 
 * Requirements:
 * - Must be connected with admin wallet (0x807c3d470888cc48)
 * - Wallet must have admin resource in storage
 * - Can only burn NFTs owned by the connected wallet
 */

const BurnNFTsPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <NFTBurner />
    </div>
  );
};

export default BurnNFTsPage;
