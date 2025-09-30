import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

// Lightweight script to check only clique traits - much faster than full stake info
const CLIQUE_CHECK_CODE = `
import NonFungibleToken from 0x1d7e57aa55817448
import Flunks from 0x807c3d470888cc48
import Backpack from 0x807c3d470888cc48
import MetadataViews from 0x1d7e57aa55817448

access(all) struct CliqueInfo {
    access(all) let tokenID: UInt64
    access(all) let collection: String
    access(all) let clique: String?

    init(tokenID: UInt64, collection: String, clique: String?) {
        self.tokenID = tokenID
        self.collection = collection
        self.clique = clique
    }
}

access(all) fun getFlunksCliques(address: Address): [CliqueInfo] {
    var results: [CliqueInfo] = []
    
    let collection = getAccount(address)
        .capabilities.borrow<&Flunks.Collection>(Flunks.CollectionPublicPath)
    
    if let collection = collection {
        let tokenIDs = collection.getIDs()
        for tokenID in tokenIDs {
            let nft = collection.borrowNFT(tokenID)
            var cliqueValue: String? = nil
            
            if let traitsView = nft?.resolveView(Type<MetadataViews.Traits>()) {
                let traits = traitsView as! MetadataViews.Traits
                for trait in traits.traits {
                    let traitName = trait.name.toLower()
                    if traitName == "clique" || traitName == "class" {
                        cliqueValue = trait.value as? String
                        break
                    }
                }
            }
            
            results.append(CliqueInfo(
                tokenID: tokenID,
                collection: "Flunks",
                clique: cliqueValue
            ))
        }
    }
    
    return results
}

access(all) fun getBackpackCliques(address: Address): [CliqueInfo] {
    var results: [CliqueInfo] = []
    
    let collection = getAccount(address)
        .capabilities.borrow<&Backpack.Collection>(Backpack.CollectionPublicPath)
    
    if let collection = collection {
        let tokenIDs = collection.getIDs()
        for tokenID in tokenIDs {
            let nft = collection.borrowNFT(tokenID)
            var cliqueValue: String? = nil
            
            if let traitsView = nft?.resolveView(Type<MetadataViews.Traits>()) {
                let traits = traitsView as! MetadataViews.Traits
                for trait in traits.traits {
                    let traitName = trait.name.toLower()
                    if traitName == "clique" || traitName == "class" {
                        cliqueValue = trait.value as? String
                        break
                    }
                }
            }
            
            results.append(CliqueInfo(
                tokenID: tokenID,
                collection: "Backpack",
                clique: cliqueValue
            ))
        }
    }
    
    return results
}

access(all) fun main(address: Address): [CliqueInfo] {
    var allCliques: [CliqueInfo] = []
    
    // Get Flunks cliques
    let flunksCliques = getFlunksCliques(address: address)
    allCliques = allCliques.concat(flunksCliques)
    
    // Get Backpack cliques
    let backpackCliques = getBackpackCliques(address: address)
    allCliques = allCliques.concat(backpackCliques)
    
    return allCliques
}`;

export const getLightweightCliqueInfo = async (address: string, retryCount = 0) => {
  if (!address) return Promise.resolve([]);

  try {
    console.log('🔍 Getting lightweight clique info for:', address.slice(0, 8) + '...', retryCount > 0 ? `(retry ${retryCount})` : '');
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Flow API timeout after 10 seconds')), 10000);
    });
    
    // Race between the actual request and timeout
    const result = await Promise.race([
      fcl
        .send([fcl.script(CLIQUE_CHECK_CODE), fcl.args([fcl.arg(address, t.Address)])])
        .then(fcl.decode),
      timeoutPromise
    ]);
    
    console.log('✅ Clique info retrieved:', (result as any)?.length || 0, 'items');
    return (result as any) || [];
    
  } catch (error) {
    console.error('❌ Error getting clique info:', error);
    
    // Retry once if it's a timeout or 500 error
    if (retryCount === 0 && (error instanceof Error && (
      error.message.includes('timeout') || 
      error.message.includes('500') ||
      error.message.includes('Internal Server Error')
    ))) {
      console.log('🔄 Retrying clique info request...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      return getLightweightCliqueInfo(address, 1);
    }
    
    return [];
  }
};