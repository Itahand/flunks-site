#!/usr/bin/env node

/**
 * Find Genesis NFT Owners
 * Checks who currently owns NFTs #0 and #1 in the SemesterZero collection
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Known addresses to check
const addressesToCheck = [
  { name: 'roto_flow', address: '0x4ab2327b5e1f3ca1' },
  { name: 'CityofDreams', address: '0x6e5d12b1735caa83' },
  { name: 'Flunkster', address: '0xc4ab4a06ade1fd0f' },
  { name: 'Test Wallet 1', address: '0x807c3d470888cc48' },
  { name: 'Test Wallet 2', address: '0xbfffec679fff3a94' },
  { name: 'Admin/Contract', address: '0xce9dd43888d99574' }
];

async function checkWalletForNFTs(address) {
  const script = `
    import SemesterZero from 0xce9dd43888d99574
    import NonFungibleToken from 0x1d7e57aa55817448
    
    access(all) fun main(address: Address): [UInt64] {
      let account = getAccount(address)
      let collectionRef = account.capabilities.get<&{NonFungibleToken.CollectionPublic}>(
        SemesterZero.Chapter5CollectionPublicPath
      ).borrow()
      
      if collectionRef == nil {
        return []
      }
      
      return collectionRef!.getIDs()
    }
  `;
  
  try {
    const { stdout } = await execPromise(
      `flow scripts execute --network mainnet --args-json '[{"type":"Address","value":"${address}"}]' -c "${script.replace(/"/g, '\\"')}"`
    );
    
    const result = stdout.trim();
    
    // Parse the array of IDs from Flow CLI output
    const match = result.match(/Result: \[(.*)\]/);
    if (match) {
      const idsStr = match[1].trim();
      if (idsStr === '') return [];
      return idsStr.split(',').map(id => parseInt(id.trim()));
    }
    
    return [];
  } catch (error) {
    return [];
  }
}

async function main() {
  console.log('🔍 Finding Genesis NFT Owners');
  console.log('==============================');
  console.log('');
  console.log('Searching for NFT #0 and #1...\n');
  
  const results = {
    nft0: null,
    nft1: null
  };
  
  for (const wallet of addressesToCheck) {
    process.stdout.write(`Checking ${wallet.name} (${wallet.address})... `);
    
    const nftIds = await checkWalletForNFTs(wallet.address);
    
    if (nftIds.length > 0) {
      console.log(`✅ Owns NFTs: [${nftIds.join(', ')}]`);
      
      if (nftIds.includes(0)) {
        results.nft0 = wallet;
      }
      if (nftIds.includes(1)) {
        results.nft1 = wallet;
      }
    } else {
      console.log('No NFTs');
    }
  }
  
  console.log('\n\n📊 Genesis NFT Ownership');
  console.log('========================\n');
  
  if (results.nft0) {
    console.log('🎯 NFT #0 (Genesis #1):');
    console.log(`   Owner: ${results.nft0.name}`);
    console.log(`   Address: ${results.nft0.address}`);
  } else {
    console.log('❓ NFT #0: Owner not found in checked addresses');
  }
  
  console.log('');
  
  if (results.nft1) {
    console.log('🎯 NFT #1 (Genesis #2):');
    console.log(`   Owner: ${results.nft1.name}`);
    console.log(`   Address: ${results.nft1.address}`);
  } else {
    console.log('❓ NFT #1: Owner not found in checked addresses');
  }
  
  console.log('\n\n💡 Next Steps:');
  console.log('==============\n');
  
  if (results.nft0 || results.nft1) {
    console.log('To burn these Genesis NFTs, run:');
    console.log('./deployment-scripts/burn-genesis-nfts.sh');
    console.log('');
    console.log('⚠️  WARNING: This permanently destroys the NFTs!');
    console.log('   Consider keeping them as "Genesis" collectibles instead.');
  } else {
    console.log('Could not locate the Genesis NFTs.');
    console.log('They may be in an unchecked wallet or not yet minted.');
  }
}

main().catch(console.error);
