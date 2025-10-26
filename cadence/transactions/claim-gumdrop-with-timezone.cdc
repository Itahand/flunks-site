// Claim GumDrop transaction with timezone and username context
// This transaction records the user's claim on the blockchain
// and includes timezone information for analytics

import SemesterZero from 0x807c3d470888cc48

transaction(username: String, timezoneOffset: Int) {
  prepare(signer: &Account) {
    // Record claim on blockchain
    SemesterZero.claimGumDrop(user: signer.address)
    
    // Log user context for analytics
    log("User: ".concat(username))
    log("Timezone offset: ".concat(timezoneOffset.toString()))
  }
  
  execute {
    log("GumDrop claimed on blockchain - backend will credit GUM")
  }
}
