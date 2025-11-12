/**
 * Mint Paradise Motel Pin NFT
 * Usage: node admin-scripts/mint-paradise-pin.js <recipient_address>
 */

import * as fcl from "@onflow/fcl";
import { readFileSync } from 'fs';
import { resolve } from 'path';

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

// Read transaction
const transaction = readFileSync(
  resolve('./cadence/transactions/airdrop-pin.cdc'),
  'utf8'
);

// Authorization function
const authorization = async (account) => {
  const { SHA3 } = await import('sha3');
  const elliptic = await import('elliptic');
  const ec = new elliptic.ec('p256');
  
  const key = ec.keyFromPrivate(Buffer.from(ADMIN_PRIVATE_KEY, 'hex'));
  
  return {
    ...account,
    addr: ADMIN_ADDRESS,
    keyId: 0,
    signingFunction: async (signable) => {
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
  };
};

async function mintParadisePin() {
  try {
    console.log('📝 Sending transaction...');
    
    const txId = await fcl.mutate({
      cadence: transaction,
      args: (arg, t) => [
        arg(recipientAddress, t.Address),
        arg('Paradise Motel', t.String),              // location
        arg('Paradise Motel', t.String),              // name
        arg('Collectible pin from Paradise Motel', t.String),  // description
        arg('Base', t.String),                        // rarity
        arg('https://storage.googleapis.com/flunks_public/images/paradise-motel-pin.png', t.String) // image
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
    console.log('📍 Traits:');
    console.log('   • Type: Pin');
    console.log('   • Location: Paradise Motel');
    console.log('   • Rarity: Base');
    console.log('   • Image: Metallic keychain pin');
    console.log('');
    console.log('🎯 Recipient:', recipientAddress);
    console.log('');
    console.log('✅ Check your Flow Wallet and Flowty to see the new Pin NFT!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

mintParadisePin();
