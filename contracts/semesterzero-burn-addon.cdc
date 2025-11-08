// NOTE: This is a PARTIAL contract showing ONLY the changes to add burn function
// The full deployed contract stays the same, we're just adding this one function to Admin resource

// Inside the Admin resource, add this new function:

/// Burn (permanently destroy) an NFT from the signer's collection
/// The signer must own the NFT and have admin privileges
access(all) fun burnNFTFromCollection(collection: auth(NonFungibleToken.Withdraw) &Chapter5Collection, nftID: UInt64) {
    // Verify the NFT exists
    assert(collection.ownedNFTs[nftID] != nil, message: "NFT does not exist in collection")
    
    // Withdraw and destroy
    let nft <- collection.withdraw(withdrawID: nftID)
    let ownerAddress = collection.owner!.address
    
    emit Chapter5NFTBurned(
        nftID: nftID,
        owner: ownerAddress,
        timestamp: getCurrentBlock().timestamp
    )
    
    destroy nft
}

// Also add this event at the top of the contract with the other events:
access(all) event Chapter5NFTBurned(nftID: UInt64, owner: Address, timestamp: UFix64)
