import SemesterZero from 0xce9dd43888d99574
import NonFungibleToken from 0x1d7e57aa55817448
import MetadataViews from 0x1d7e57aa55817448

/// Set up SemesterZero NFT Collection in user's account
/// This allows the user to receive Chapter 5 NFTs
/// 
/// Must be called before receiving NFTs from airdrops
transaction {
    prepare(signer: auth(SaveValue, Capabilities, IssueStorageCapabilityController, PublishCapability) &Account) {
        // Check if collection already exists
        if signer.storage.borrow<&SemesterZero.Chapter5Collection>(
            from: SemesterZero.Chapter5CollectionStoragePath
        ) != nil {
            // Collection already exists - nothing to do
            log("✅ SemesterZero collection already set up")
            return
        }
        
        // Create new empty collection
        let collection <- SemesterZero.createEmptyCollection(nftType: Type<@SemesterZero.Chapter5NFT>())
        
        // Save collection to storage
        signer.storage.save(<-collection, to: SemesterZero.Chapter5CollectionStoragePath)
        
        // Create public capability for deposits and viewing
        let collectionCap = signer.capabilities.storage.issue<&SemesterZero.Chapter5Collection>(
            SemesterZero.Chapter5CollectionStoragePath
        )
        signer.capabilities.publish(collectionCap, at: SemesterZero.Chapter5CollectionPublicPath)
        
        log("🎉 SemesterZero collection created successfully!")
    }
}
