import SemesterZero from 0xce9dd43888d99574
import NonFungibleToken from 0x1d7e57aa55817448

/// Admin transaction to reveal an NFT and properly emit Updated event
/// This ensures marketplace indexers (Flowty, OpenSea) detect the metadata change
transaction(userAddress: Address, nftID: UInt64, newMetadata: {String: String}) {
    
    let adminRef: &SemesterZero.Admin
    
    prepare(signer: auth(Storage) &Account) {
        // Borrow admin resource
        self.adminRef = signer.storage.borrow<&SemesterZero.Admin>(
            from: SemesterZero.AdminStoragePath
        ) ?? panic("Could not borrow admin reference")
    }
    
    execute {
        // Get user's collection reference
        let collectionRef = getAccount(userAddress)
            .capabilities.get<&SemesterZero.Chapter5Collection>(SemesterZero.Chapter5CollectionPublicPath)
            .borrow()
            ?? panic("User does not have Chapter 5 collection")
        
        // Borrow the specific NFT with Update entitlement
        let nftRef = collectionRef.borrowChapter5NFT(id: nftID)
            ?? panic("Could not borrow NFT #".concat(nftID.toString()))
        
        // Update the metadata
        nftRef.reveal(newMetadata: newMetadata)
        
        // Emit Updated event for indexers
        // This is the key part that tells Flowty/OpenSea to refresh metadata
        NonFungibleToken.emitNFTUpdated(nftRef as auth(NonFungibleToken.Update) &{NonFungibleToken.NFT})
        
        log("✅ NFT #".concat(nftID.toString()).concat(" revealed and Updated event emitted!"))
    }
}
