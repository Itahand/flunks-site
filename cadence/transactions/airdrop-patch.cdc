import SemesterZero from 0xce9dd43888d99574

/// Mint and airdrop a Patch NFT (achievement collectible)
/// 
/// Parameters:
/// - userAddress: Recipient's Flow address
/// - location: Location name (e.g., "Paradise Motel", "Crystal Springs", "Arcade")
/// - achievement: Achievement name (e.g., "Room 7 Explorer", "Gum Master", "High Scorer")
/// - name: Display name of the patch
/// - description: Description of the patch achievement
/// - rarity: Rarity tier (e.g., "common", "uncommon", "rare", "legendary")
/// - image: Full URL to patch image on IPFS or Google Cloud Storage
///
/// Example:
/// flow transactions send ./cadence/transactions/airdrop-patch.cdc \
///   0x4ab2327b5e1f3ca1 \
///   "Paradise Motel" \
///   "Room 7 Explorer" \
///   "Room 7 Explorer Patch" \
///   "Awarded for discovering all secrets of Room 7 at Paradise Motel" \
///   "rare" \
///   "https://storage.googleapis.com/flunks_public/images/room7-patch.png" \
///   --signer admin-account
transaction(
    userAddress: Address,
    location: String,
    achievement: String,
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
        // Mint and airdrop the Patch NFT
        self.admin.mintPatch(
            userAddress: userAddress,
            location: location,
            achievement: achievement,
            name: name,
            description: description,
            rarity: rarity,
            image: image
        )
        
        log("Successfully minted and airdropped Patch NFT to ".concat(userAddress.toString()))
        log("Location: ".concat(location))
        log("Achievement: ".concat(achievement))
        log("Rarity: ".concat(rarity))
    }
}
