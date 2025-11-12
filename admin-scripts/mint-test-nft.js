/**
 * Mint a test Chapter 5 NFT with custom image
 * Usage: node admin-scripts/mint-test-nft.js <recipient_address> <image_url>
 */

const fcl = require('@onflow/fcl');
const { ec: EC } = require('elliptic');
const { SHA3 } = require('sha3');

// Flow Mainnet configuration
fcl.config({
  'accessNode.api': 'https://rest-mainnet.onflow.org',
  'discovery.wallet': 'https://fcl-discovery.onflow.org/authn',
  'flow.network': 'mainnet'
});

const ADMIN_ADDRESS = '0xce9dd43888d99574';
const PRIVATE_KEY = process.env.FLOW_PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error('❌ Missing FLOW_PRIVATE_KEY environment variable');
  process.exit(1);
}

const ec = new EC('p256');
const keyPair = ec.keyFromPrivate(Buffer.from(PRIVATE_KEY, 'hex'));

const hashMsg = (msg) => {
  const sha = new SHA3(256);
  sha.update(Buffer.from(msg, 'hex'));
  return sha.digest();
};

const signWithKey = (privateKey, msg) => {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, 'hex'));
  const sig = key.sign(hashMsg(msg));
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, 'be', n);
  const s = sig.s.toArrayLike(Buffer, 'be', n);
  return Buffer.concat([r, s]).toString('hex');
};

const authorization = (account) => {
  return {
    ...account,
    tempId: `${ADMIN_ADDRESS}-${account.keyId}`,
    addr: fcl.sansPrefix(ADMIN_ADDRESS),
    keyId: Number(account.keyId),
    signingFunction: async (signable) => {
      return {
        addr: fcl.withPrefix(ADMIN_ADDRESS),
        keyId: Number(account.keyId),
        signature: signWithKey(PRIVATE_KEY, signable.message)
      };
    }
  };
};

async function mintChapter5NFT(recipientAddress, imageUrl) {
  console.log('🎨 Minting Chapter 5 NFT...');
  console.log('   Recipient:', recipientAddress);
  console.log('   Image:', imageUrl);
  console.log('');

  const transaction = `
import SemesterZero from 0xce9dd43888d99574
import NonFungibleToken from 0x1d7e57aa55817448

transaction(recipient: Address) {
  let admin: &SemesterZero.Admin
  
  prepare(signer: auth(BorrowValue) &Account) {
    self.admin = signer.storage.borrow<&SemesterZero.Admin>(
      from: SemesterZero.AdminStoragePath
    ) ?? panic("Could not borrow admin reference")
  }
  
  execute {
    // Check if user already has completion status
    let status = SemesterZero.getChapter5Status(userAddress: recipient)
    
    if status == nil {
      // Mark both objectives complete
      self.admin.markChapter5SlackerComplete(userAddress: recipient)
      self.admin.markChapter5OverachieverComplete(userAddress: recipient)
    }
    
    // Mint the NFT
    self.admin.airdropChapter5NFT(userAddress: recipient)
    
    log("Chapter 5 NFT minted and airdropped!")
  }
}
`;

  try {
    const txId = await fcl.mutate({
      cadence: transaction,
      args: (arg, t) => [
        arg(recipientAddress, t.Address)
      ],
      proposer: authorization,
      authorizations: [authorization],
      payer: authorization,
      limit: 9999
    });

    console.log('📝 Transaction ID:', txId);
    console.log('   Waiting for confirmation...');

    const txStatus = await fcl.tx(txId).onceSealed();
    console.log('✅ Transaction sealed!');
    console.log('');
    
    // Now update the image
    console.log('🖼️  Updating NFT image...');
    
    const updateTx = `
import SemesterZero from 0xce9dd43888d99574

transaction(userAddress: Address, imageUrl: String) {
  let admin: &SemesterZero.Admin
  
  prepare(signer: auth(BorrowValue) &Account) {
    self.admin = signer.storage.borrow<&SemesterZero.Admin>(
      from: SemesterZero.AdminStoragePath
    ) ?? panic("Could not borrow admin reference")
  }
  
  execute {
    let newMetadata: {String: String} = {
      "name": "Semester Zero Achievement",
      "description": "Awarded for completing objectives in Semester Zero",
      "achievement": "SLACKER_AND_OVERACHIEVER",
      "chapter": "5",
      "rarity": "Legendary",
      "image": imageUrl,
      "revealed": "true",
      "upgraded": "true",
      "upgradeTime": getCurrentBlock().timestamp.toString()
    }
    
    self.admin.revealChapter5NFT(
      userAddress: userAddress,
      newMetadata: newMetadata
    )
    
    log("NFT image updated!")
  }
}
`;

    const updateTxId = await fcl.mutate({
      cadence: updateTx,
      args: (arg, t) => [
        arg(recipientAddress, t.Address),
        arg(imageUrl, t.String)
      ],
      proposer: authorization,
      authorizations: [authorization],
      payer: authorization,
      limit: 9999
    });

    console.log('📝 Update Transaction ID:', updateTxId);
    console.log('   Waiting for confirmation...');

    await fcl.tx(updateTxId).onceSealed();
    console.log('✅ Image updated!');
    console.log('');
    console.log('🎉 Done! Check your wallet and Flowty.');
    
    return { mintTx: txId, updateTx: updateTxId };
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Parse command line arguments
const recipientAddress = process.argv[2];
const imageUrl = process.argv[3];

if (!recipientAddress || !imageUrl) {
  console.error('Usage: node mint-test-nft.js <recipient_address> <image_url>');
  console.error('');
  console.error('Example:');
  console.error('  node mint-test-nft.js 0xe327216d843357f1 https://storage.googleapis.com/flunks_public/images/my-new-image.png');
  process.exit(1);
}

mintChapter5NFT(recipientAddress, imageUrl)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });
