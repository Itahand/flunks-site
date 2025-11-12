import NFTList from 0x15a918087ab12d86

/// Register Flunks: Semester Zero to the Token List
/// This makes the collection discoverable in Flow Wallet and other ecosystem apps
transaction {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        // Register the SemesterZero contract address and name
        // This is permissionless and checks that the contract implements required MetadataViews
        NFTList.ensureNFTCollectionRegistered(
            0xce9dd43888d99574,  // Your SemesterZero contract address
            "SemesterZero"        // Contract name
        )
        
        log("✅ SemesterZero collection registered to Token List!")
    }
}
