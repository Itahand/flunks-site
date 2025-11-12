/**
 * Register Flunks: Semester Zero to the Token List
 * This makes the collection discoverable in Flow Wallet browser extension
 * 
 * Token List Website: https://token-list.fixes.world/
 * Contract Address (Mainnet): 0x15a918087ab12d86
 * 
 * Run: node admin-scripts/register-token-list.js
 */

import * as fcl from "@onflow/fcl";

// Configure FCL for Mainnet
fcl.config()
  .put("accessNode.api", "https://rest-mainnet.onflow.org")
  .put("flow.network", "mainnet")
  .put("app.detail.title", "Flunks TokenList Registration");

const SEMESTER_ZERO_CONTRACT = "0xce9dd43888d99574";
const CONTRACT_NAME = "SemesterZero";

// Transaction code that registers the NFT collection
const registerTransaction = `
import NFTList from 0x15a918087ab12d86

transaction {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        // Register SemesterZero collection
        // This is permissionless - anyone can register a valid NFT contract
        NFTList.ensureNFTCollectionRegistered(
            ${SEMESTER_ZERO_CONTRACT},
            "${CONTRACT_NAME}"
        )
    }
}
`;

// Script to check if already registered
const checkRegisteredScript = `
import NFTList from 0x15a918087ab12d86

access(all) fun main(address: Address, contractName: String): Bool {
    return NFTList.isNFTCollectionRegistered(address, contractName)
}
`;

async function checkIfRegistered() {
  try {
    const isRegistered = await fcl.query({
      cadence: checkRegisteredScript,
      args: (arg, t) => [
        arg(SEMESTER_ZERO_CONTRACT, t.Address),
        arg(CONTRACT_NAME, t.String),
      ],
    });
    
    return isRegistered;
  } catch (error) {
    console.error("❌ Error checking registration status:", error.message);
    return false;
  }
}

async function registerCollection() {
  console.log("🔍 Checking if Flunks: Semester Zero is registered...");
  
  const isRegistered = await checkIfRegistered();
  
  if (isRegistered) {
    console.log("✅ Flunks: Semester Zero is already registered on Token List!");
    console.log("🌐 View at: https://token-list.fixes.world/");
    console.log("📱 It should now appear in Flow Wallet browser extension");
    return;
  }
  
  console.log("📝 Collection not registered yet. Starting registration...");
  console.log("\n⚠️  INSTRUCTIONS:");
  console.log("1. Go to: https://token-list.fixes.world/");
  console.log("2. Connect your wallet (any wallet works - registration is permissionless)");
  console.log("3. In the 'Quick Register' section:");
  console.log(`   - Contract Address: ${SEMESTER_ZERO_CONTRACT}`);
  console.log(`   - Contract Name: ${CONTRACT_NAME}`);
  console.log("4. Click 'Register' and approve the transaction");
  console.log("\n✨ Once registered, your collection will appear in:");
  console.log("   - Flow Wallet browser extension");
  console.log("   - Increment Fi");
  console.log("   - Other ecosystem apps");
  
  console.log("\n📄 Transaction code (if you want to do it manually via Flow CLI):");
  console.log(registerTransaction);
}

registerCollection().catch(console.error);
