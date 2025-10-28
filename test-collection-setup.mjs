/**
 * Test Chapter 5 Collection Setup
 * 
 * This script tests if the collection setup transaction works correctly
 */

import * as fcl from "@onflow/fcl";

// Configure FCL for mainnet
fcl.config({
  "accessNode.api": "https://rest-mainnet.onflow.org",
  "0xSemesterZero": "0x807c3d470888cc48",
});

async function testCollectionSetup(address) {
  console.log('\n🧪 Testing Chapter 5 Collection Setup\n');
  console.log('Testing Address:', address);
  console.log('='.repeat(60));
  
  try {
    // Test 1: Check if collection already exists
    console.log('\n📋 Test 1: Checking existing collection...');
    const hasCollection = await fcl.query({
      cadence: `
        import SemesterZero from 0x807c3d470888cc48
        import NonFungibleToken from 0x1d7e57aa55817448
        
        access(all) fun main(address: Address): Bool {
          return getAccount(address)
            .capabilities.get<&{NonFungibleToken.Receiver}>(SemesterZero.Chapter5CollectionPublicPath)
            .check()
        }
      `,
      args: (arg, t) => [arg(address, t.Address)],
    });
    
    console.log('Has Collection:', hasCollection ? '✅ YES' : '❌ NO');
    
    // Test 2: Check UserProfile
    console.log('\n📋 Test 2: Checking UserProfile...');
    const profileInfo = await fcl.query({
      cadence: `
        import SemesterZero from 0x807c3d470888cc48
        
        access(all) fun main(address: Address): {String: AnyStruct}? {
          let account = getAccount(address)
          if let profileRef = account.capabilities
            .get<&SemesterZero.UserProfile>(SemesterZero.UserProfilePublicPath)
            .borrow() {
            return {
              "username": profileRef.username,
              "timezone": profileRef.timezone
            }
          }
          return nil
        }
      `,
      args: (arg, t) => [arg(address, t.Address)],
    });
    
    if (profileInfo) {
      console.log('✅ UserProfile exists');
      console.log('   Username:', profileInfo.username);
      console.log('   Timezone:', profileInfo.timezone);
    } else {
      console.log('❌ No UserProfile found');
    }
    
    // Test 3: Check NFT Collection IDs
    console.log('\n📋 Test 3: Checking NFT Collection...');
    const nftIds = await fcl.query({
      cadence: `
        import SemesterZero from 0x807c3d470888cc48
        import NonFungibleToken from 0x1d7e57aa55817448
        
        access(all) fun main(address: Address): [UInt64] {
          let account = getAccount(address)
          if let collectionRef = account.capabilities
            .get<&{NonFungibleToken.CollectionPublic}>(SemesterZero.Chapter5CollectionPublicPath)
            .borrow() {
            return collectionRef.getIDs()
          }
          return []
        }
      `,
      args: (arg, t) => [arg(address, t.Address)],
    });
    
    console.log('NFTs in Collection:', nftIds.length);
    if (nftIds.length > 0) {
      console.log('NFT IDs:', nftIds);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed!\n');
    
    return {
      hasCollection,
      hasProfile: profileInfo !== null,
      nftCount: nftIds.length,
      profileInfo
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Run test
const TEST_ADDRESS = process.argv[2] || "0x807c3d470888cc48";
testCollectionSetup(TEST_ADDRESS);
