import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

// Ensure FCL configuration is loaded
import "../config/fcl";

const CODE = `import HybridCustodyHelper from 0x807c3d470888cc48

// mainnet test run: flow scripts execute ./cadence/scripts/GUM/get-owner-token-ids.cdc 0xeff7b7c7795a4d56 --network mainnet

access(all) fun main(address: Address): {String: [UInt64]} {
    let flunksTokenIds = HybridCustodyHelper.getFlunksTokenIDsFromAllLinkedAccounts(ownerAddress: address)
    let backpackTokenIds = HybridCustodyHelper.getBackpackTokenIDsFromAllLinkedAccounts(ownerAddress: address)

    return {
        "flunks": flunksTokenIds,
        "backpack": backpackTokenIds
    }
}`;

export const getOwnerTokenIdsWhale = async (address: string) => {
  if (!address) return Promise.resolve(null);

  console.log('🌊 FCL Configuration check - Access Node:', fcl.config.get('accessNode.api'));
  console.log('🔍 Getting Flunks for address:', address);

  return await fcl
    .send([fcl.script(CODE), fcl.args([fcl.arg(address, t.Address)])])
    .then(fcl.decode)
    .catch(error => {
      console.error('❌ FCL Script Error:', error);
      throw error;
    });
};
