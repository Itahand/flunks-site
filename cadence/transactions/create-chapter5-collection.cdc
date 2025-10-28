// Create Chapter5 NFT collection only
// UserProfile is managed in Supabase

import SemesterZero from 0x807c3d470888cc48
import NonFungibleToken from 0x1d7e57aa55817448

transaction() {
  prepare(signer: auth(Storage, Capabilities) &Account) {
    // Check if user already has Chapter 5 collection
    if signer.storage.borrow<&SemesterZero.Chapter5Collection>(from: SemesterZero.Chapter5CollectionStoragePath) == nil {
      // Create collection
      let collection <- SemesterZero.createEmptyChapter5Collection()
      signer.storage.save(<-collection, to: SemesterZero.Chapter5CollectionStoragePath)
      
      // Link public capability
      let nftCap = signer.capabilities.storage.issue<&{NonFungibleToken.Receiver}>(SemesterZero.Chapter5CollectionStoragePath)
      signer.capabilities.publish(nftCap, at: SemesterZero.Chapter5CollectionPublicPath)
      
      log("✅ Created Chapter 5 NFT collection")
    } else {
      log("ℹ️ Collection already exists")
    }
  }
  
  execute {
    log("🎃 Ready to receive Chapter 5 NFTs!")
  }
}
