import NonFungibleToken from 0x1d7e57aa55817448
import FlunksSemesterZero from 0xce9dd43888d99574

/// Airdrop Chapter 5 NFT using clean FlunksSemesterZero collection
transaction(recipientAddress: Address) {
    
    let admin: &FlunksSemesterZero.Admin
    
    prepare(signer: auth(BorrowValue) &Account) {
        // Borrow admin resource from FlunksSemesterZero
        self.admin = signer.storage.borrow<&FlunksSemesterZero.Admin>(from: FlunksSemesterZero.AdminStoragePath)
            ?? panic("Could not borrow FlunksSemesterZero admin reference")
    }
    
    execute {
        // Airdrop the Chapter 5 NFT
        self.admin.airdropChapter5NFT(userAddress: recipientAddress)
        
        log("✅ Chapter 5 NFT airdropped to: ".concat(recipientAddress.toString()))
    }
}
