/**
 * Mint Paradise Motel Pin using SemesterZeroV3
 * Usage: node admin-scripts/mint-paradise-pin-v3.js <address> [count]
 * 
 * Examples:
 *   node admin-scripts/mint-paradise-pin-v3.js 0xbfffec679fff3a94
 *   node admin-scripts/mint-paradise-pin-v3.js 0xbfffec679fff3a94 3
 */

import * as fcl from "@onflow/fcl";
import { createHash } from 'crypto';
import elliptic from 'elliptic';

const EC = elliptic.ec;
const ec = new EC('p256');

// Configure FCL for mainnet
fcl.config({
  'accessNode.api': 'https://rest-mainnet.onflow.org',
  'flow.network': 'mainnet',
});

const ADMIN_ADDRESS = '0xce9dd43888d99574';
// This is the correct private key that matches the account's public key
const ADMIN_PRIVATE_KEY = '84b16ebda82e663e88f823557dd7788c829c0f8ff506b543e56e286c1c3527f3';

const recipientAddress = process.argv[2] || '0xbfffec679fff3a94';
const mintCount = parseInt(process.argv[3]) || 1;

console.log(`📍 Minting ${mintCount} Paradise Motel Pin(s) to: ${recipientAddress}`);

// Hash using SHA2-256 (matching the account's hash algorithm)
function hashMessage(message) {
  return createHash('sha256').update(Buffer.from(message, 'hex')).digest();
}

// Sign with the admin private key
function signWithKey(privateKey, message) {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, 'hex'));
  const sig = key.sign(hashMessage(message));
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, 'be', n);
  const s = sig.s.toArrayLike(Buffer, 'be', n);
  return Buffer.concat([r, s]).toString('hex');
}

// Authorization function
const getAuthorization = () => {
  return async (account = {}) => {
    const addr = ADMIN_ADDRESS.replace('0x', '');
    const keyId = 0;

    return {
      ...account,
      tempId: `${addr}-${keyId}`,
      addr: fcl.sansPrefix(addr),
      keyId: keyId,
      signingFunction: async (signable) => {
        const signature = signWithKey(ADMIN_PRIVATE_KEY, signable.message);
        return {
          addr: fcl.withPrefix(addr),
          keyId: keyId,
          signature: signature,
        };
      },
    };
  };
};

async function mintParadisePins() {
  try {
    for (let i = 0; i < mintCount; i++) {
      console.log(`\n📝 Minting NFT ${i + 1} of ${mintCount}...`);
      
      const transaction = `
import SemesterZeroV3 from 0xce9dd43888d99574

transaction(recipientAddress: Address) {
  let admin: &SemesterZeroV3.Admin
  
  prepare(signer: auth(BorrowValue) &Account) {
    self.admin = signer.storage.borrow<&SemesterZeroV3.Admin>(
      from: /storage/SemesterZeroV3Admin
    ) ?? panic("Could not borrow admin reference")
  }
  
  execute {
    // Mint metadata for an un-evolved Paradise Motel Pin
    let metadata: {String: String} = {
      "name": "Paradise Motel Pin",
      "description": "A collectible pin from Paradise Motel. Evolve it to unlock special artwork!",
      "image": "https://storage.googleapis.com/flunks_public/images/paradise-motel-pin-base.png"
    }
    
    self.admin.mintNFT(
      recipientAddress: recipientAddress,
      nftType: "Pin",
      location: "Paradise Motel",
      metadata: metadata
    )
    
    log("Paradise Motel Pin minted!")
  }
}
`;

      const auth = getAuthorization();
      
      const txId = await fcl.mutate({
        cadence: transaction,
        args: (arg, t) => [
          arg(recipientAddress, t.Address)
        ],
        proposer: auth,
        payer: auth,
        authorizations: [auth],
        limit: 1000
      });
      
      console.log(`⏳ Transaction submitted: ${txId}`);
      console.log(`   https://www.flowdiver.io/tx/${txId}`);
      
      const txStatus = await fcl.tx(txId).onceSealed();
      
      if (txStatus.errorMessage) {
        console.error(`❌ Transaction failed: ${txStatus.errorMessage}`);
        continue;
      }
      
      // Find the minted NFT ID from events
      const mintEvent = txStatus.events.find(e => e.type.includes('Minted') || e.type.includes('Deposit'));
      if (mintEvent) {
        console.log(`✅ NFT minted! Event data:`, mintEvent.data);
      } else {
        console.log('✅ NFT minted successfully!');
      }
    }
    
    console.log('\n========================================');
    console.log(`✅ Minted ${mintCount} Paradise Motel Pin(s) to ${recipientAddress}`);
    console.log('========================================');
    console.log('');
    console.log('📍 Each NFT has:');
    console.log('   • Name: Paradise Motel Pin');
    console.log('   • Type: Pin');
    console.log('   • Tier: Base (can be evolved to Silver/Gold/Special)');
    console.log('   • Location: Paradise Motel');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

mintParadisePins();
