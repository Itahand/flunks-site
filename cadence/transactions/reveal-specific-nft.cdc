import SemesterZero from 0xce9dd43888d99574

transaction(userAddress: Address, nftID: UInt64, newMetadata: {String: String}) {
  let admin: &SemesterZero.Admin
  
  prepare(signer: auth(BorrowValue) &Account) {
    self.admin = signer.storage.borrow<&SemesterZero.Admin>(
      from: SemesterZero.AdminStoragePath
    ) ?? panic("Could not borrow admin reference")
  }
  
  execute {
    // Get user's collection
    let collectionRef = getAccount(userAddress)
      .capabilities.get<&SemesterZero.Chapter5Collection>(SemesterZero.Chapter5CollectionPublicPath)
      .borrow()
      ?? panic("User does not have Chapter 5 collection")
    
    // Borrow the specific NFT and reveal it
    let nftRef = collectionRef.borrowChapter5NFT(id: nftID)
      ?? panic("Could not borrow NFT reference")
    
    nftRef.reveal(newMetadata: newMetadata)
    
    log("NFT revealed with new metadata!")
  }
}
