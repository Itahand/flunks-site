import SemesterZero from 0xce9dd43888d99574

transaction(userAddress: Address, imageUrl: String) {
  let admin: &SemesterZero.Admin
  
  prepare(signer: auth(BorrowValue) &Account) {
    self.admin = signer.storage.borrow<&SemesterZero.Admin>(
      from: SemesterZero.AdminStoragePath
    ) ?? panic("Could not borrow admin reference")
  }
  
  execute {
    // Mint the NFT
    self.admin.airdropChapter5NFT(userAddress: userAddress)
    
    // Immediately update with Pin metadata
    let newMetadata: {String: String} = {
      "name": "Paradise Motel",
      "description": "Collectible pin from Paradise Motel",
      "type": "Pin",
      "location": "Paradise Motel",
      "rarity": "Base",
      "image": imageUrl,
      "revealed": "true"
    }
    
    self.admin.revealChapter5NFT(
      userAddress: userAddress,
      newMetadata: newMetadata
    )
    
    log("Paradise Motel Pin minted!")
  }
}
