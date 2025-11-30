import * as fcl from '@onflow/fcl';
import elliptic from 'elliptic';
import { createHash } from 'crypto';

// Initialize elliptic curve
const EC = elliptic.ec;
const ec = new EC('p256');

const ADMIN_ADDRESS = '0xce9dd43888d99574';
const ADMIN_PRIVATE_KEY = '84b16ebda82e663e88f823557dd7788c829c0f8ff506b543e56e286c1c3527f3';

fcl.config({
  'accessNode.api': 'https://rest-mainnet.onflow.org',
  'flow.network': 'mainnet'
});

// Hash a message using SHA2-256 (the account uses SHA2_256, NOT SHA3)
function hashMessage(message) {
  return createHash('sha256').update(Buffer.from(message, 'hex')).digest();
}

// Sign a message with the admin private key
function signWithKey(privateKey, message) {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, 'hex'));
  const sig = key.sign(hashMessage(message));
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, 'be', n);
  const s = sig.s.toArrayLike(Buffer, 'be', n);
  return Buffer.concat([r, s]).toString('hex');
}

// Create authorization function
function getAdminAuthorization() {
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
}

const walletAddress = '0xbfffec679fff3a94';
const nftId = 0;
const tier = 'Special';

async function testTransaction() {
  console.log('Testing evolve transaction...');
  
  const revealTransaction = `
    import SemesterZeroV3 from 0xce9dd43888d99574
    
    transaction(userAddress: Address, nftId: UInt64) {
      let admin: &SemesterZeroV3.Admin
      
      prepare(signer: auth(BorrowValue) &Account) {
        self.admin = signer.storage.borrow<&SemesterZeroV3.Admin>(
          from: /storage/SemesterZeroV3Admin
        ) ?? panic("Could not borrow admin reference")
      }
      
      execute {
        let newMetadata: {String: String} = {
          "name": "Paradise Motel Pin - Special",
          "description": "A Special Paradise Motel pin from Flunks: Semester Zero.",
          "image": "https://storage.googleapis.com/flunks_public/images/paradise-motel-pin-special.png",
          "tier": "Special",
          "location": "Paradise Motel",
          "chapter": "5",
          "collection": "Flunks: Semester Zero",
          "serialNumber": "1",
          "achievement": "SLACKER_AND_OVERACHIEVER",
          "evolvedAt": getCurrentBlock().timestamp.toString()
        }
        
        self.admin.evolveNFT(
          userAddress: userAddress,
          nftID: nftId,
          newTier: "Special",
          newMetadata: newMetadata
        )
        
        log("NFT evolved!")
      }
    }
  `;

  try {
    const adminAuth = getAdminAuthorization();
    
    console.log('Submitting transaction...');
    const transactionId = await fcl.mutate({
      cadence: revealTransaction,
      args: (arg, t) => [
        arg(walletAddress, t.Address),
        arg(nftId.toString(), t.UInt64)
      ],
      proposer: adminAuth,
      payer: adminAuth,
      authorizations: [adminAuth],
      limit: 1000,
    });

    console.log('Transaction submitted:', transactionId);
    console.log('Waiting for seal...');
    
    const status = await fcl.tx(transactionId).onceSealed();
    console.log('Transaction sealed!', status);
    
  } catch (error) {
    console.error('Transaction failed:', error);
    console.error('Error message:', error.message);
  }
}

testTransaction();
