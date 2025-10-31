/**
 * Reset Halloween GumDrop Claim for Testing
 * 
 * This script resets a user's claim status on the blockchain
 * so they can test the full claim flow again.
 * 
 * Usage: node reset-halloween-claim.js <wallet-address>
 */

const fcl = require("@onflow/fcl");

// Configure FCL for mainnet
fcl.config({
  "accessNode.api": "https://rest-mainnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
  "app.detail.title": "Flunks - Reset Halloween Claim",
  "app.detail.icon": "https://flunks.io/flunks-logo.png",
});

async function resetClaim(userAddress) {
  console.log('🎃 Resetting Halloween claim for:', userAddress);
  
  try {
    // Call admin function to reset user's claim
    const transactionId = await fcl.mutate({
      cadence: `
        import TestPumpkinDrop420 from 0xTestPumpkinDrop420

        transaction(userAddress: Address) {
          prepare(admin: &Account) {
            // Only admin can reset claims
            TestPumpkinDrop420.resetUserClaim(user: userAddress)
          }
          
          execute {
            log("Reset claim for user: ".concat(userAddress.toString()))
          }
        }
      `,
      args: (arg, t) => [
        arg(userAddress, t.Address)
      ],
      proposer: fcl.authz,
      payer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 9999
    });

    console.log('📝 Transaction submitted:', transactionId);
    
    // Wait for transaction to seal
    const result = await fcl.tx(transactionId).onceSealed();
    console.log('✅ Transaction sealed:', result);
    
    if (result.status === 4) {
      console.log('✅ Successfully reset Halloween claim!');
      console.log(`User ${userAddress} can now claim again.`);
    } else {
      console.log('❌ Transaction failed:', result.errorMessage);
    }
    
  } catch (error) {
    console.error('❌ Error resetting claim:', error);
    console.log('\nNote: This requires admin access to the TestPumpkinDrop420 contract.');
    console.log('If you don\'t have admin access, use Option 1 (manual GUM credit) instead.');
  }
}

// Get wallet address from command line
const userAddress = process.argv[2];

if (!userAddress) {
  console.log('Usage: node reset-halloween-claim.js <wallet-address>');
  console.log('Example: node reset-halloween-claim.js 0x1234567890abcdef');
  process.exit(1);
}

// Run the reset
resetClaim(userAddress).then(() => {
  console.log('\n✅ Done!');
  process.exit(0);
}).catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
