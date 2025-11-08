import SemesterZero from 0xce9dd43888d99574
import NonFungibleToken from 0x1d7e57aa55817448

/// Burn (permanently destroy) an NFT from the signer's collection
/// This is irreversible - the NFT will be destroyed forever
/// 
/// Use Cases:
/// - Remove test NFTs (like Genesis IDs 0 and 1)
/// - Destroy unwanted or mistake NFTs
/// - Clean up collection before public launch
///
/// Parameters:
/// - nftID: The ID of the NFT to burn (e.g., 0 or 1 for Genesis NFTs)
///
/// Example - Burn Genesis NFT #0 (must be signed by the NFT owner):
/// flow transactions send ./cadence/transactions/burn-nft.cdc \
///   0 \
///   --network mainnet \
///   --signer owner-account
///
/// WARNING: This is PERMANENT. The NFT cannot be recovered after burning.
transaction(nftID: UInt64) {
    
    let admin: &SemesterZero.Admin
    let collection: auth(NonFungibleToken.Withdraw) &SemesterZero.Chapter5Collection
    
    prepare(signer: auth(BorrowValue, Storage) &Account) {
        // Borrow admin capability
        self.admin = signer.storage.borrow<&SemesterZero.Admin>(
            from: SemesterZero.AdminStoragePath
        ) ?? panic("Could not borrow admin reference - must be signed by admin")
        
        // Borrow owner's collection with withdraw authorization
        self.collection = signer.storage.borrow<auth(NonFungibleToken.Withdraw) &SemesterZero.Chapter5Collection>(
            from: SemesterZero.Chapter5CollectionStoragePath
        ) ?? panic("Could not borrow collection reference")
    }
    
    execute {
        // Burn the NFT permanently
        self.admin.burnNFTFromOwner(ownerAuth: self.collection, nftID: nftID)
        
        log("🔥 NFT BURNED (PERMANENTLY DESTROYED)")
        log("NFT ID: ".concat(nftID.toString()))
        log("")
        log("⚠️  This action is irreversible - the NFT is gone forever")
    }
}
