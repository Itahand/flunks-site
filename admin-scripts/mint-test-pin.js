/**
 * Mint a test Pin NFT with 1.png to a test account
 * Usage: node admin-scripts/mint-test-pin.js <address>
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

const recipientAddress = process.argv[2];

if (!recipientAddress) {
  console.error('❌ Usage: node admin-scripts/mint-test-pin.js <address>');
  process.exit(1);
}

console.log(`🎯 Minting test Pin NFT to: ${recipientAddress}`);

// Read transaction
const transaction = readFileSync(
  resolve('./cadence/transactions/airdrop-pin.cdc'),
  'utf8'
);

// Authorization function
const authz = fcl.authz;
const authorization = fcl.authorize({
  ...authz,
  addr: ADMIN_ADDRESS,
  keyId: 0,
  signingFunction: async (signable) => {
    const { SHA3 } = await import('sha3');
    const EC = (await import('elliptic')).ec;
    const ec = new EC('p256');
    
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

async function mintTestPin() {
  try {
    console.log('📝 Sending transaction...');
    
    const txId = await fcl.mutate({
      cadence: transaction,
      args: (arg, t) => [
        arg(recipientAddress, t.Address),
        arg('Test Location', t.String),
        arg('Test Pin #1', t.String),
        arg('Test Pin NFT minted with 1.png - will be upgraded to Patch', t.String),
        arg('common', t.String),
        arg('https://storage.googleapis.com/flunks_public/images/1.png', t.String)
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
    
    console.log('✅ Test Pin minted successfully!');
    console.log('📍 Location: Test Location');
    console.log('🖼️  Image: 1.png');
    console.log('🎯 Recipient:', recipientAddress);
    console.log('\n🔄 Ready to test Level Up upgrade to Patch!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

mintTestPin();
