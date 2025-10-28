// SPDX-License-Identifier: MIT
// FlunksGraduation - Cadence 1.0 Migration
// This is the updated version to replace the old FlunksGraduation contract

import Flunks from 0x807c3d470888cc48
import NonFungibleToken from 0x1d7e57aa55817448

access(all) contract FlunksGraduation {
  access(all) event ContractInitialized()
  access(all) event Graduate(address: Address, tokenID: UInt64, templateID: UInt64)
  access(all) event GraduateTimeUpdate(tokenID: UInt64, time: UInt64)

  access(all) let AdminStoragePath: StoragePath

  // Graduate a Flunk NFT
  // MIGRATED: Changed AuthAccount to auth(Storage, Capabilities) &Account
  access(all) fun graduateFlunk(owner: auth(Storage, Capabilities, BorrowValue) &Account, tokenID: UInt64) {
    // Get owner's collection
    // MIGRATED: Changed from restricted type to intersection type
    let collection = owner.capabilities.get<&{NonFungibleToken.CollectionPublic}>(
      Flunks.CollectionPublicPath
    ).borrow()
      ?? panic("Could not borrow collection reference")
    
    // Verify ownership
    let ids = collection.getIDs()
    if !ids.contains(tokenID) {
      panic("Owner does not own this NFT")
    }
    
    // Get the NFT reference
    let nft = collection.borrowNFT(tokenID)
      ?? panic("Could not borrow NFT reference")
    
    // Emit graduation event
    emit Graduate(address: owner.address, tokenID: tokenID, templateID: 0)
  }

  // Admin resource for managing graduations
  access(all) resource Admin {
    // Admin can force graduate NFTs if needed
    access(all) fun adminGraduate(ownerAddress: Address, tokenID: UInt64) {
      emit Graduate(address: ownerAddress, tokenID: tokenID, templateID: 0)
    }
    
    // Update graduation time
    access(all) fun updateGraduationTime(tokenID: UInt64, time: UInt64) {
      emit GraduateTimeUpdate(tokenID: tokenID, time: time)
    }
  }

  init() {
    self.AdminStoragePath = /storage/FlunksGraduationAdmin
    
    // Create and store admin resource
    let admin <- create Admin()
    self.account.storage.save(<-admin, to: self.AdminStoragePath)
    
    emit ContractInitialized()
  }
}
