// SemesterZero Contract Extension - Multiple NFT Types
// This shows how to add PinNFT and PatchNFT to the existing contract
// All NFTs live in the same collection, same contract, same address

// CURRENT STRUCTURE:
// - Chapter5NFT (already deployed, can't change)

// NEW ADDITIONS (what we'd add):

// ========================================
// PIN NFT - For location-based pins
// ========================================

access(all) resource PinNFT: NonFungibleToken.NFT {
    access(all) let id: UInt64
    access(all) let location: String        // "Paradise Motel", "Crystal Springs", "Arcade"
    access(all) let recipient: Address
    access(all) let mintedAt: UFix64
    access(all) let metadata: {String: String}
    
    init(id: UInt64, recipient: Address, location: String, name: String, image: String) {
        self.id = id
        self.location = location
        self.recipient = recipient
        self.mintedAt = getCurrentBlock().timestamp
        self.metadata = {
            "name": name,                                    // e.g. "Paradise Motel Pin"
            "description": "Collectible pin from ".concat(location),
            "location": location,                           // ← TRAIT
            "type": "Pin",                                  // ← TRAIT
            "rarity": "Rare",
            "image": image
        }
    }
    
    // Same view functions as Chapter5NFT...
}

// ========================================
// PATCH NFT - For achievement patches
// ========================================

access(all) resource PatchNFT: NonFungibleToken.NFT {
    access(all) let id: UInt64
    access(all) let location: String
    access(all) let achievement: String     // What they did to earn it
    access(all) let recipient: Address
    access(all) let mintedAt: UFix64
    access(all) let metadata: {String: String}
    
    init(id: UInt64, recipient: Address, location: String, achievement: String, name: String, image: String) {
        self.id = id
        self.location = location
        self.achievement = achievement
        self.recipient = recipient
        self.mintedAt = getCurrentBlock().timestamp
        self.metadata = {
            "name": name,                                   // e.g. "Crystal Springs Explorer"
            "description": "Earned by ".concat(achievement),
            "location": location,                          // ← TRAIT
            "achievement": achievement,                    // ← TRAIT
            "type": "Patch",                               // ← TRAIT
            "rarity": "Epic",
            "image": image
        }
    }
}

// ========================================
// UNIFIED COLLECTION (already exists, doesn't change)
// ========================================

// The existing Chapter5Collection can hold ALL types:
// - Chapter5NFT (old)
// - PinNFT (new)
// - PatchNFT (new)
// All stored in ownedNFTs: @{UInt64: {NonFungibleToken.NFT}}

// ========================================
// ADMIN FUNCTIONS (add to existing Admin resource)
// ========================================

// Add to the Admin resource:

/// Mint a Pin NFT
access(all) fun mintPin(
    userAddress: Address, 
    location: String, 
    name: String, 
    image: String
) {
    let userAccount = getAccount(userAddress)
    let collectionCap = userAccount.capabilities
        .get<&{NonFungibleToken.Receiver}>(SemesterZero.Chapter5CollectionPublicPath)
    
    assert(collectionCap.check(), message: "User collection not set up")
    
    let newPin <- create PinNFT(
        id: SemesterZero.totalChapter5NFTs,
        recipient: userAddress,
        location: location,
        name: name,
        image: image
    )
    
    let recipientCollection = collectionCap.borrow()!
    recipientCollection.deposit(token: <- newPin)
    
    SemesterZero.totalChapter5NFTs = SemesterZero.totalChapter5NFTs + 1
    
    // Emit event
}

/// Mint a Patch NFT
access(all) fun mintPatch(
    userAddress: Address,
    location: String,
    achievement: String,
    name: String,
    image: String
) {
    // Similar to mintPin...
}

// ========================================
// EXAMPLE USAGE
// ========================================

// Paradise Motel Pin:
admin.mintPin(
    userAddress: 0x123...,
    location: "Paradise Motel",
    name: "Paradise Motel Pin",
    image: "https://storage.googleapis.com/.../paradise-pin.png"
)

// Crystal Springs Patch:
admin.mintPatch(
    userAddress: 0x123...,
    location: "Crystal Springs",
    achievement: "Explored all hidden areas",
    name: "Crystal Springs Explorer",
    image: "https://storage.googleapis.com/.../crystal-patch.png"
)

// Arcade Token:
admin.mintPin(
    userAddress: 0x123...,
    location: "Arcade",
    name: "Arcade Champion Token",
    image: "https://storage.googleapis.com/.../arcade-token.png"
)

// ========================================
// RESULT ON FLOWTY
// ========================================

// ALL NFTs show up under ONE collection:
// https://www.flowty.io/collection/0xce9dd43888d99574/SemesterZero

// Users see:
// - 2x Chapter 5 Completion (existing)
// - 3x Paradise Motel Pin (new)
// - 5x Crystal Springs Patch (new)
// - 2x Arcade Token (new)
// All in the SAME collection, with different traits visible

// ========================================
// TRAITS/FILTERS ON MARKETPLACES
// ========================================

// Marketplaces can filter by:
// - "location": "Paradise Motel" | "Crystal Springs" | "Arcade"
// - "type": "Pin" | "Patch" | "Token" | "Achievement"
// - "rarity": "Legendary" | "Epic" | "Rare"
// - "achievement": various strings

// This gives collectors a reason to collect ALL locations!
