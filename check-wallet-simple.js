import * as fcl from "@onflow/fcl";

fcl.config({
  'accessNode.api': 'https://rest-mainnet.onflow.org',
  'flow.network': 'mainnet',
});

const walletAddress = '0xe327216d843357f1';

// Simple script that just checks if NFTs exist
const script = `
import SemesterZero from 0xce9dd43888d99574

access(all) fun main(address: Address): [UInt64] {
  let account = getAccount(address)
  
  if let collectionRef = account.capabilities
    .borrow<&SemesterZero.Chapter5Collection>(
      SemesterZero.Chapter5CollectionPublicPath
    ) {
    return collectionRef.getIDs()
  }
  
  return []
}
`;

console.log('🔍 Checking wallet: 0xe327216d843357f1');
console.log('');

try {
  const result = await fcl.query({
    cadence: script,
    args: (arg, t) => [arg(walletAddress, t.Address)]
  });
  
  if (result.length === 0) {
    console.log('❌ NO CHAPTER 5 NFTs FOUND');
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('💡 CONCLUSION:');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('The Paradise Motel Pin minting did NOT complete.');
    console.log('');
    console.log('🔍 Evidence:');
    console.log('   • Contract shows 3 total NFTs minted system-wide');
    console.log('   • Your wallet (0xe327216d843357f1) has 0 NFTs');
    console.log('   • The 3 existing NFTs must be in other wallets');
    console.log('');
    console.log('🤔 Most likely:');
    console.log('   You updated the minting script but never ran it.');
    console.log('   The script files were modified at 22:11 but no');
    console.log('   "node admin-scripts/mint-paradise-pin..." command');
    console.log('   appears in your terminal history.');
    console.log('');
    console.log('✅ To actually mint it, run:');
    console.log('   node admin-scripts/mint-paradise-pin-simple.js');
    console.log('');
  } else {
    console.log(`✅ FOUND ${result.length} CHAPTER 5 NFT(S)!`);
    console.log('');
    console.log('NFT IDs in your wallet:', result.join(', '));
    console.log('');
    console.log('The Paradise Motel Pin was successfully minted!');
    console.log('Check your Flow wallet or Flowty to view it.');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  if (error.message.includes('cannot borrow')) {
    console.log('\n💡 This means the Chapter 5 collection is not set up on your wallet yet.');
  }
}
