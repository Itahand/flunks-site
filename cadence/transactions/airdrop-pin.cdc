import SemesterZero from 0xce9dd43888d99574

/// Mint and airdrop a Pin NFT (location-based collectible)
/// 
/// Parameters:
/// - userAddress: Recipient's Flow address
/// - location: Location name (e.g., "Paradise Motel", "Crystal Springs", "Arcade")
/// - name: Display name of the pin
/// - description: Description of the pin
/// - rarity: Rarity tier (e.g., "common", "uncommon", "rare", "legendary")
/// - image: Full URL to pin image on IPFS or Google Cloud Storage
///
/// Example:
/// flow transactions send ./cadence/transactions/airdrop-pin.cdc \
///   0x4ab2327b5e1f3ca1 \
///   "Paradise Motel" \
///   "Paradise Motel Pin" \
///   "Collectible pin from your visit to Paradise Motel during Semester Zero" \
///   "uncommon" \
///   "https://storage.googleapis.com/flunks_public/images/paradise-motel-pin.png" \
///   --signer admin-account
transaction(
    userAddress: Address,
    location: String,
    name: String,
    description: String,
    rarity: String,
    image: String
) {
    
    let admin: &SemesterZero.Admin
    
    prepare(signer: auth(BorrowValue) &Account) {
        // Borrow admin capability
        self.admin = signer.storage.borrow<&SemesterZero.Admin>(
            from: SemesterZero.AdminStoragePath
        ) ?? panic("Could not borrow admin reference")
    }
    
    execute {
        // Mint and airdrop the Pin NFT
        self.admin.mintPin(
            userAddress: userAddress,
            location: location,
            name: name,
            description: description,
            rarity: rarity,
            image: image
        )
        
        log("Successfully minted and airdropped Pin NFT to ".concat(userAddress.toString()))
        log("Location: ".concat(location))
        log("Rarity: ".concat(rarity))
    }
}
