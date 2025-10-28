// Update Halloween GumDrop end time to November 3, 2025 at 12:00 PM Central Time
// Central Time (UTC-6) = 6:00 PM UTC
// November 3, 2025 18:00:00 UTC = Unix timestamp: 1730656800

import SemesterZero from 0x807c3d470888cc48

transaction(newEndTime: UFix64) {
  prepare(signer: auth(Storage) &Account) {
    // Borrow admin resource
    let admin = signer.storage.borrow<&SemesterZero.Admin>(
      from: SemesterZero.AdminStoragePath
    ) ?? panic("No admin resource found - must be contract owner")
    
    // Close existing drop
    if SemesterZero.activeGumDrop != nil {
      admin.closeGumDrop()
      log("Closed existing GumDrop")
    }
    
    // Create new GumDrop with updated end time
    // Using same settings as before but with new end time
    let eligibleAddresses: [Address] = [] // Empty array means everyone is eligible (we check in frontend)
    let gumPerFlunk: UFix64 = 10.0 // 10 GUM per Flunk NFT (not used anymore, fixed 100 GUM)
    let currentTime = getCurrentBlock().timestamp
    let duration = newEndTime - currentTime
    
    admin.createGumDrop(
      dropId: "halloween-test-2025-v3",
      eligibleAddresses: eligibleAddresses.length > 0 ? eligibleAddresses : [signer.address], // Must have at least one
      gumPerFlunk: gumPerFlunk,
      durationSeconds: duration
    )
  }
  
  execute {
    log("GumDrop updated with new end time")
    if let drop = SemesterZero.activeGumDrop {
      log("New end time: ".concat(drop.endTime.toString()))
    }
  }
}
