/**
 * Check if a wallet has Chapter 5 NFT collection set up
 * Usage: node check-chapter5-collection.js <wallet_address>
 */

const fcl = require("@onflow/fcl");

// Configure for mainnet
fcl.config({
  "accessNode.api": "https://rest-mainnet.onflow.org",
  "0xSemesterZero": "0x807c3d470888cc48",
  "0xNonFungibleToken": "0x1d7e57aa55817448"
});

const CHECK_COLLECTION_SCRIPT = `
import SemesterZero from 0x807c3d470888cc48
import NonFungibleToken from 0x1d7e57aa55817448

access(all) fun main(address: Address): {String: AnyStruct} {
  let account = getAccount(address)
  
  // Check if Chapter 5 Collection exists
  let collectionCap = account.capabilities.get<&{NonFungibleToken.Receiver}>(
    SemesterZero.Chapter5CollectionPublicPath
  )
  
  let hasCollection = collectionCap.check()
  
  // Check if UserProfile exists
  let profileCap = account.capabilities.get<&SemesterZero.UserProfile>(
    SemesterZero.UserProfilePublicPath
  )
  
  let hasProfile = profileCap.check()
  
  var profileData: {String: AnyStruct} = {}
  if hasProfile {
    if let profile = profileCap.borrow() {
      profileData = {
        "username": profile.username,
        "timezone": profile.timezone
      }
    }
  }
  
  return {
    "address": address.toString(),
    "hasChapter5Collection": hasCollection,
    "hasUserProfile": hasProfile,
    "profileData": profileData
  }
}
`;

async function checkCollection(address) {
  try {
    console.log(`\n🔍 Checking wallet: ${address}\n`);
    
    const result = await fcl.query({
      cadence: CHECK_COLLECTION_SCRIPT,
      args: (arg, t) => [arg(address, t.Address)]
    });
    
    console.log('📊 Results:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Address: ${result.address}`);
    console.log(`Has Chapter 5 Collection: ${result.hasChapter5Collection ? '✅ YES' : '❌ NO'}`);
    console.log(`Has User Profile: ${result.hasUserProfile ? '✅ YES' : '❌ NO'}`);
    
    if (result.hasUserProfile && Object.keys(result.profileData).length > 0) {
      console.log('\n👤 Profile Data:');
      console.log(`  Username: ${result.profileData.username}`);
      console.log(`  Timezone: ${result.profileData.timezone > 0 ? '+' : ''}${result.profileData.timezone}`);
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    if (!result.hasChapter5Collection) {
      console.log('💡 Collection not found. User needs to:');
      console.log('   1. Claim Halloween GumDrop');
      console.log('   2. This will auto-create the collection\n');
    }
    
    if (!result.hasUserProfile) {
      console.log('💡 Profile not found. User needs to:');
      console.log('   1. Claim Halloween GumDrop');
      console.log('   2. This will auto-create profile with timezone\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Get wallet address from command line
const walletAddress = process.argv[2];

if (!walletAddress) {
  console.log('Usage: node check-chapter5-collection.js <wallet_address>');
  console.log('Example: node check-chapter5-collection.js 0x92629c2a389dd8a8');
  process.exit(1);
}

checkCollection(walletAddress);
