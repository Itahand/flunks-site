import SemesterZero from 0xce9dd43888d99574

/// Reveal Chapter 5 NFTs by setting the revealed image URL
/// This updates ALL Chapter 5 NFTs to display the revealed image
transaction(revealedImageURL: String) {
    
    let admin: &SemesterZero.Admin
    
    prepare(signer: auth(BorrowValue) &Account) {
        // Borrow admin resource
        self.admin = signer.storage.borrow<&SemesterZero.Admin>(from: SemesterZero.AdminStoragePath)
            ?? panic("Could not borrow admin reference")
    }
    
    execute {
        // Reveal the NFTs
        self.admin.revealChapter5NFTs(revealedImageURL: revealedImageURL)
        
        log("🎉 Chapter 5 NFTs revealed!")
        log("✨ New image URL: ".concat(revealedImageURL))
    }
}
