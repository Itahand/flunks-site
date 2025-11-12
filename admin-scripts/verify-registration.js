/**
 * Check Token List website directly to see registration status
 */

import * as fcl from "@onflow/fcl";

fcl.config()
  .put("accessNode.api", "https://rest-mainnet.onflow.org")
  .put("flow.network", "mainnet");

// Simpler script that just checks if registered
const checkScript = `
import NFTList from 0x15a918087ab12d86

access(all) fun main(address: Address, contractName: String): Bool {
    return NFTList.isNFTCollectionRegistered(address, contractName)
}
`;

async function checkRegistration() {
  try {
    console.log("🔍 Checking registration status...\n");
    
    const isRegistered = await fcl.query({
      cadence: checkScript,
      args: (arg, t) => [
        arg("0xce9dd43888d99574", t.Address),
        arg("SemesterZero", t.String)
      ]
    });
    
    console.log(`Contract Address: 0xce9dd43888d99574`);
    console.log(`Contract Name: SemesterZero`);
    console.log(`Registered: ${isRegistered}\n`);
    
    if (!isRegistered) {
      console.log("❌ NOT REGISTERED");
      console.log("\n💡 What you're seeing in the screenshot:");
      console.log("   ✅ The checkmark = Contract VALIDATES (has required views)");
      console.log("   ❌ But it's NOT REGISTERED in the on-chain registry yet");
      console.log("\n📝 The dropdown is showing you that it CAN be registered,");
      console.log("   but you need to click a 'Register' button to actually submit the transaction.");
      console.log("\n👉 Look for a 'Register' or 'Submit' button below the dropdown!");
    } else {
      console.log("✅ ALREADY REGISTERED on Token List!");
      console.log("\n🎉 Your collection should appear in:");
      console.log("   - Flow Wallet browser extension");
      console.log("   - https://token-list.fixes.world/");
    }
  } catch (error) {
    console.error("❌ Error checking status:", error.message);
  }
}

checkRegistration();
