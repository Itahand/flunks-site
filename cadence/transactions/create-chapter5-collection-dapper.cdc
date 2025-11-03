// Dapper-compatible Chapter5 NFT collection setup
// Uses Cadence 0.42 AuthAccount syntax for Dapper wallet compatibility

import SemesterZero from 0x807c3d470888cc48
import NonFungibleToken from 0x1d7e57aa55817448

transaction() {
  prepare(signer: AuthAccount) {
    // Check if user already has Chapter 5 collection
    if signer.borrow<&SemesterZero.Chapter5Collection>(from: SemesterZero.Chapter5CollectionStoragePath) == nil {
      // Create collection
      let collection <- SemesterZero.createEmptyChapter5Collection()
      signer.save(<-collection, to: SemesterZero.Chapter5CollectionStoragePath)
      
      // Link public capability (old syntax for Dapper)
      signer.link<&{NonFungibleToken.Receiver}>(
        SemesterZero.Chapter5CollectionPublicPath,
        target: SemesterZero.Chapter5CollectionStoragePath
      )
      
      log("✅ Created Chapter 5 NFT collection (Dapper compatible)")
    } else {
      log("ℹ️ Collection already exists")
    }
  }
  
  execute {
    log("🎃 Ready to receive Chapter 5 NFTs!")
  }
}
