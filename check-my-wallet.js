import * as fcl from "@onflow/fcl";

fcl.config({
  'accessNode.api': 'https://rest-mainnet.onflow.org',
  'flow.network': 'mainnet',
});

const walletAddress = '0xe327216d843357f1';

const script = `
import SemesterZero from 0xce9dd43888d99574
import NonFungibleToken from 0x1d7e57aa55817448

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
        var data = nft.getMetadata()
        data["id"] = id.toString()
        nftData.append(data)
      }
    }
    
    return nftData
  }
  
  return []
}
`;

console.log('🔍 Checking wallet:', walletAddress);
console.log('');

try {
  const result = await fcl.query({
    cadence: script,
    args: (arg, t) => [arg(walletAddress, t.Address)]
  });
  
  if (result.length === 0) {
    console.log('❌ No Chapter 5 NFTs found in wallet');
    console.log('');
    console.log('This means the minting transaction either:');
    console.log('1. Never completed');
    console.log('2. Failed silently');
    console.log('3. Was minted to a different address');
    console.log('4. Collection not set up on this wallet');
  } else {
    console.log(`✅ Found ${result.length} Chapter 5 NFT(s):`);
    console.log('');
    result.forEach((nft, i) => {
      console.log(`NFT #${nft.id}:`);
      console.log('  Name:', nft.name);
      console.log('  Description:', nft.description);
      console.log('  Image:', nft.image);
      console.log('  Type:', nft.type || 'N/A');
      console.log('  Location:', nft.location || 'N/A');
      console.log('  Achievement:', nft.achievement || 'N/A');
      console.log('  Revealed:', nft.revealed || 'N/A');
      console.log('');
    });
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}
