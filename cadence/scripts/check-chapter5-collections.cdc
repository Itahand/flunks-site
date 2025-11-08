import NonFungibleToken from 0x1d7e57aa55817448
import SemesterZero from 0xce9dd43888d99574

/// Check if users have Chapter5 collection set up
/// Returns true if collection exists and is ready to receive NFTs
access(all) fun main(addresses: [Address]): {Address: Bool} {
    let results: {Address: Bool} = {}
    
    for address in addresses {
        let account = getAccount(address)
        
        // Try to borrow the Chapter5 collection capability
        let collectionCap = account
            .capabilities.get<&{NonFungibleToken.Receiver}>(SemesterZero.Chapter5CollectionPublicPath)
        
        // Check if capability is valid
        results[address] = collectionCap.check()
    }
    
    return results
}
