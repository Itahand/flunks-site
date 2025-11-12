/**
 * Check NFT List to see if FlunksSemesterZero appears
 * and what its status is
 */

import * as fcl from "@onflow/fcl";

fcl.config()
  .put("accessNode.api", "https://rest-mainnet.onflow.org")
  .put("flow.network", "mainnet");

const queryNFTList = `
import NFTList from 0x15a918087ab12d86

access(all) fun main(page: Int, limit: Int): [AnyStruct] {
    let registry = NFTList.borrowRegistry()
    let types = registry.getNFTTypes()
    
    var results: [AnyStruct] = []
    for nftType in types {
        let entry = registry.borrowNFTEntry(nftType)
        if entry != nil {
            let identity = entry!.getIdentity()
            if identity.address == 0xce9dd43888d99574 {
                results.append({
                    "address": identity.address.toString(),
                    "contractName": identity.contractName,
                    "nftType": nftType.identifier,
                    "hasDisplay": entry!.getDisplay(nil) != nil
                })
            }
        }
    }
    return results
}
`;

async function checkNFTList() {
  try {
    console.log("🔍 Searching NFT List for FlunksSemesterZero entries...\n");
    
    const results = await fcl.query({
      cadence: queryNFTList,
      args: (arg, t) => [
        arg(0, t.Int),
        arg(1000, t.Int)
      ]
    });
    
    if (results && results.length > 0) {
      console.log("✅ Found on Token List:");
      console.log(JSON.stringify(results, null, 2));
    } else {
      console.log("❌ Not found on Token List");
      console.log("\nThis means the web UI is detecting it but it's not actually registered yet.");
      console.log("The checkmark you see is just validation that the contract implements the required views.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkNFTList();
