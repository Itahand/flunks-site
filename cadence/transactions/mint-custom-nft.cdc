import SemesterZero from 0xce9dd43888d99574

transaction(userAddress: Address, imageUrl: String, name: String, pinType: String, location: String, rarity: String) {
  let admin: &SemesterZero.Admin
  
  prepare(signer: auth(BorrowValue) &Account) {
    self.admin = signer.storage.borrow<&SemesterZero.Admin>(
      from: SemesterZero.AdminStoragePath
    ) ?? panic("Could not borrow admin reference")
  }
  
  execute {
    // Mint the NFT with custom metadata directly
    let newMetadata: {String: String} = {
      "name": name,
      "description": "Collectible from Semester Zero",
      "type": pinType,
      "location": location,
      "rarity": rarity,
      "image": imageUrl,
      "revealed": "true"
    }
    
    self.admin.revealChapter5NFT(
      userAddress: userAddress,
      newMetadata: newMetadata
    )
    
    log("Custom NFT metadata updated!")
  }
}
