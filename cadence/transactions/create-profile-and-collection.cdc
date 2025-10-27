// Create SemesterZero user profile and Chapter5 NFT collection
// This sets up the user's account to receive Chapter 5 completion NFTs

import SemesterZero from 0x807c3d470888cc48

transaction(username: String, timezoneOffset: Int) {
  prepare(signer: &Account) {
    // Check if user already has a profile
    let profilePath = /storage/SemesterZeroProfile
    let publicProfilePath = /public/SemesterZeroProfile
    
    if signer.storage.borrow<&SemesterZero.UserProfile>(from: profilePath) == nil {
      // Create new profile with username and timezone
      let profile <- SemesterZero.createUserProfile(username: username, timezone: timezoneOffset)
      
      // Save to storage
      signer.storage.save(<-profile, to: profilePath)
      
      // Link public capability
      let cap = signer.capabilities.storage.issue<&SemesterZero.UserProfile>(profilePath)
      signer.capabilities.publish(cap, at: publicProfilePath)
      
      log("✅ Created SemesterZero profile for: ".concat(username))
    } else {
      log("ℹ️ Profile already exists")
    }
    
    // Check if user already has Chapter 5 collection
    let collectionPath = /storage/Chapter5Collection
    let publicCollectionPath = /public/Chapter5Collection
    
    if signer.storage.borrow<&SemesterZero.Chapter5Collection>(from: collectionPath) == nil {
      // Create empty collection
      let collection <- SemesterZero.createEmptyChapter5Collection()
      
      // Save to storage
      signer.storage.save(<-collection, to: collectionPath)
      
      // Link public capability
      let cap = signer.capabilities.storage.issue<&SemesterZero.Chapter5Collection>(collectionPath)
      signer.capabilities.publish(cap, at: publicCollectionPath)
      
      log("✅ Created Chapter 5 NFT collection")
    } else {
      log("ℹ️ Collection already exists")
    }
  }
  
  execute {
    log("🎃 User account setup complete - ready for Chapter 5!")
  }
}
