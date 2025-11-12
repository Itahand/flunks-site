import * as fcl from "@onflow/fcl";

fcl.config({
  'accessNode.api': 'https://rest-mainnet.onflow.org',
  'flow.network': 'mainnet',
});

const walletAddress = '0xe327216d843357f1';

const script = `
import SemesterZero from 0xce9dd43888d99574

access(all) fun main(address: Address): [{String: String}] {
  let account = getAccount(address)
  
  if let collectionRef = account.capabilities
    .borrow<&SemesterZero.Chapter5Collection>(
      SemesterZero.Chapter5CollectionPublicPath
    ) {
    
    let nftIDs = collectionRef.getIDs()
    let nftData: [{String: String}] = []
    
    for id in nftIDs {
      if let nft = collectionRef.borrowChapter5NFT(id: id) {
        var data = nft.metadata
        data["id"] = id.toString()
        data["mintedAt"] = nft.mintedAt.toString()
        nftData.append(data)
      }
    }
    
    return nftData
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
    console.log('❌ No Chapter 5 NFTs found in wallet');
    console.log('');
    console.log('💡 Diagnosis:');
    console.log('   The Paradise Motel Pin minting did NOT complete successfully.');
    console.log('');
    console.log('   Possible reasons:');
    console.log('   • Script was never executed (no node command run)');
    console.log('   • Transaction failed during execution');
    console.log('   • Collection not initialized on this wallet');
    console.log('');
    console.log('📊 However, the contract shows 3 total NFTs minted system-wide,');
    console.log('   so they must be in other wallets.');
  } else {
    console.log(`✅ Found ${result.length} Chapter 5 NFT(s) in your wallet!`);
    console.log('');
    result.forEach((nft, i) => {
      console.log(`═══════════════════════════════════════`);
      console.log(`NFT #${nft.id}`);
      console.log(`───────────────────────────────────────`);
      console.log(`📛 Name: ${nft.name}`);
      console.log(`📝 Description: ${nft.description}`);
      console.log(`🖼️  Image: ${nft.image}`);
      console.log(`📍 Type: ${nft.type || 'N/A'}`);
      console.log(`🗺️  Location: ${nft.location || 'N/A'}`);
      console.log(`🏆 Achievement: ${nft.achievement || 'N/A'}`);
      console.log(`💎 Rarity: ${nft.rarity || 'N/A'}`);
      console.log(`👁️  Revealed: ${nft.revealed || 'N/A'}`);
      console.log(`⏰ Minted: ${nft.mintedAt}`);
      console.log('');
    });
  }
} catch (error) {
  console.error('❌ Script Error:', error.message);
}
