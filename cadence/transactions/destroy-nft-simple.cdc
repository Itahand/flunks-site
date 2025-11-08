import SemesterZero from 0xce9dd43888d99574
import NonFungibleToken from 0x1d7e57aa55817448

/// Simple burn: Just withdraw and destroy the NFT
/// No admin function needed - owner can destroy their own NFTs
transaction(nftID: UInt64) {
    
    let collection: auth(NonFungibleToken.Withdraw) &SemesterZero.Chapter5Collection
    
    prepare(signer: auth(BorrowValue, Storage) &Account) {
        // Borrow owner's collection with withdraw authorization
        self.collection = signer.storage.borrow<auth(NonFungibleToken.Withdraw) &SemesterZero.Chapter5Collection>(
            from: SemesterZero.Chapter5CollectionStoragePath
        ) ?? panic("Could not borrow collection reference")
    }
    
    execute {
        // Withdraw the NFT
        let nft <- self.collection.withdraw(withdrawID: nftID)
        
        log("🔥 NFT Withdrawn - Now destroying...")
        log("NFT ID: ".concat(nftID.toString()))
        
        // Destroy it (this is permanent!)
        destroy nft
        
        log("✅ NFT DESTROYED PERMANENTLY")
    }
}
