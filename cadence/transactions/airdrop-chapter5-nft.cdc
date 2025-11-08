import NonFungibleToken from 0x1d7e57aa55817448
import SemesterZero from 0xce9dd43888d99574

/// Airdrop Chapter 5 NFT to a user
/// This will mint and send the NFT to the user's Chapter5 collection
/// The NFT will automatically appear on Flowty under the FlunksSemesterZero collection
transaction(recipientAddress: Address) {
    
    let admin: &SemesterZero.Admin
    
    prepare(signer: auth(BorrowValue) &Account) {
        // Borrow admin resource
        self.admin = signer.storage.borrow<&SemesterZero.Admin>(from: SemesterZero.AdminStoragePath)
            ?? panic("Could not borrow admin reference")
    }
    
    execute {
        // Airdrop the Chapter 5 NFT
        self.admin.airdropChapter5NFT(userAddress: recipientAddress)
        
        log("✅ Chapter 5 NFT airdropped to: ".concat(recipientAddress.toString()))
    }
}
