import NFTList from 0x15a918087ab12d86

/// Register Flunks: Semester Zero V3 to the Token List
/// This makes the collection discoverable in Flow Wallet and other ecosystem apps
transaction {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        // Register the SemesterZeroV3 contract address and name
        // This is permissionless and checks that the contract implements required MetadataViews
        NFTList.ensureNFTCollectionRegistered(
            0xce9dd43888d99574,  // Your SemesterZeroV3 contract address
            "SemesterZeroV3"      // Contract name
        )
        
        log("✅ SemesterZeroV3 collection registered to Token List!")
    }
}
