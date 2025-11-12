/**
 * Mint Paradise Motel Pin as Chapter5NFT with metadata
 * Usage: node admin-scripts/mint-paradise-pin-simple.js <address>
 */

import * as fcl from "@onflow/fcl";

// Configure FCL for mainnet
fcl.config({
  'accessNode.api': 'https://rest-mainnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/authn',
  'flow.network': 'mainnet',
});

const ADMIN_ADDRESS = '0xce9dd43888d99574';
const ADMIN_PRIVATE_KEY = process.env.FLOW_PRIVATE_KEY;

if (!ADMIN_PRIVATE_KEY) {
  console.error('❌ FLOW_PRIVATE_KEY environment variable not set');
  process.exit(1);
}

const recipientAddress = process.argv[2] || '0xe327216d843357f1';

console.log(`📍 Minting Paradise Motel Pin to: ${recipientAddress}`);

// Authorization function - single account for all roles
const authorization = (account) => ({
  ...account,
  addr: ADMIN_ADDRESS,
  keyId: 0,
  signingFunction: async (signable) => {
    const { SHA3 } = await import('sha3');
    const ellipticModule = await import('elliptic');
    const EC = ellipticModule.default || ellipticModule;
    const ec = new EC.ec('p256');
    
    const key = ec.keyFromPrivate(Buffer.from(ADMIN_PRIVATE_KEY, 'hex'));
    const sig = key.sign(Buffer.from(signable.message, 'hex'));
    const n = 32;
    const r = sig.r.toArrayLike(Buffer, 'be', n);
    const s = sig.s.toArrayLike(Buffer, 'be', n);
    
    return {
      addr: ADMIN_ADDRESS,
      keyId: 0,
      signature: Buffer.concat([r, s]).toString('hex')
    };
  }
});

async function mintParadisePin() {
  try {
    console.log('📝 Sending transaction...');
    
    const transaction = `
import SemesterZero from 0xce9dd43888d99574

transaction(userAddress: Address, imageUrl: String) {
  let admin: &SemesterZero.Admin
  
  prepare(signer: auth(BorrowValue) &Account) {
    self.admin = signer.storage.borrow<&SemesterZero.Admin>(
      from: SemesterZero.AdminStoragePath
    ) ?? panic("Could not borrow admin reference")
  }
  
  execute {
    // Check if user already has completion status
    let status = SemesterZero.getChapter5Status(userAddress: userAddress)
    
    if status == nil {
      // Mark both objectives complete
      self.admin.markChapter5SlackerComplete(userAddress: userAddress)
      self.admin.markChapter5OverachieverComplete(userAddress: userAddress)
    }
    
    // Mint the NFT
    self.admin.airdropChapter5NFT(userAddress: userAddress)
    
    // Immediately update with Pin metadata
    let newMetadata: {String: String} = {
      "name": "Paradise Motel",
      "description": "Collectible pin from Paradise Motel",
      "type": "Pin",
      "location": "Paradise Motel",
      "rarity": "Base",
      "image": imageUrl,
      "revealed": "true"
    }
    
    self.admin.revealChapter5NFT(
      userAddress: userAddress,
      newMetadata: newMetadata
    )
    
    log("Paradise Motel Pin minted!")
  }
}
`;
    
    const txId = await fcl.mutate({
      cadence: transaction,
      args: (arg, t) => [
        arg(recipientAddress, t.Address),
        arg('https://storage.googleapis.com/flunks_public/images/paradise-motel-pin.png', t.String)
      ],
      proposer: authorization,
      payer: authorization,
      authorizations: [authorization],
      limit: 9999
    });
    
    console.log(`⏳ Transaction submitted: ${txId}`);
    console.log(`   https://www.flowdiver.io/tx/${txId}`);
    
    const txStatus = await fcl.tx(txId).onceSealed();
    
    if (txStatus.errorMessage) {
      console.error(`❌ Transaction failed: ${txStatus.errorMessage}`);
      process.exit(1);
    }
    
    console.log('✅ Paradise Motel Pin minted successfully!');
    console.log('');
    console.log('📍 Metadata:');
    console.log('   • Name: Paradise Motel');
    console.log('   • Type: Pin');
    console.log('   • Location: Paradise Motel');
    console.log('   • Rarity: Base');
    console.log('   • Image: Metallic keychain pin');
    console.log('');
    console.log('🎯 Recipient:', recipientAddress);
    console.log('');
    console.log('✅ Check Flow Wallet and Flowty - shows under "Flunks: Semester Zero"!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

mintParadisePin();
