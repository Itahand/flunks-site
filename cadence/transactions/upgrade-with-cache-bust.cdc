import SemesterZero from 0xce9dd43888d99574

transaction(userAddress: Address, nftID: UInt64) {
    let admin: &SemesterZero.Admin
    
    prepare(signer: auth(BorrowValue) &Account) {
        self.admin = signer.storage.borrow<&SemesterZero.Admin>(
            from: SemesterZero.AdminStoragePath
        ) ?? panic("Could not borrow admin reference")
    }
    
    execute {
        // Restore metadata with cache-busting query parameter
        let upgradedMetadata: {String: String} = {
            "name": "Chapter 5 Completion",
            "description": "Awarded for completing both Slacker and Overachiever objectives in Chapter 5",
            "achievement": "SLACKER_AND_OVERACHIEVER",
            "chapter": "5",
            "rarity": "Legendary",
            "image": "https://storage.googleapis.com/flunks_public/images/testmedaddy.png?v=upgraded",
            "revealed": "true",
            "upgraded": "true",
            "upgradeTime": getCurrentBlock().timestamp.toString()
        }
        
        self.admin.revealChapter5NFT(
            userAddress: userAddress,
            newMetadata: upgradedMetadata
        )
        
        log("Chapter 5 NFT upgraded with cache-busting image URL!")
    }
}
