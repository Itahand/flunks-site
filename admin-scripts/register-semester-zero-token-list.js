/**
 * Register SemesterZero on Flow Token List
 * 
 * This script helps you register the SemesterZero NFT collection
 * on the Flow Token List using the TokenList contract's Quick Register feature.
 * 
 * Steps:
 * 1. Visit https://token-list.fixes.world/
 * 2. Connect wallet (0x807c3d470888cc48)
 * 3. Click "Quick Register"
 * 4. Use the info below
 */

const SEMESTER_ZERO_INFO = {
  // Contract Details
  contractAddress: "0x807c3d470888cc48",
  contractName: "SemesterZero",
  
  // Storage Paths (from your contract)
  storagePath: "/storage/SemesterZeroChapter5Collection",
  publicPath: "/public/SemesterZeroChapter5Collection",
  
  // Collection Info
  name: "Flunks: Semester Zero",
  description: "Chapter 5 completion NFTs for Flunks. Awarded for completing both Slacker and Overachiever objectives in the ultimate high school adventure.",
  
  // Media Assets
  logoURI: "https://storage.googleapis.com/flunks_public/images/flunks.png", // Square logo
  bannerURI: "https://storage.googleapis.com/flunks_public/website-assets/banner_2023.png", // Banner image
  
  // Social Links
  extensions: {
    twitter: "https://twitter.com/flunks_nft",
    website: "https://flunks.net/",
    discord: "", // Add if you have one
    instagram: "", // Add if you have one
  },
  
  // Tags (optional)
  tags: ["gaming", "achievement", "pfp"], // Suggested tags
};

console.log("\n🎯 SemesterZero Token List Registration Info\n");
console.log("=" .repeat(60));
console.log("\n📋 Copy and paste this info into the Quick Register form:\n");
console.log("Contract Address:", SEMESTER_ZERO_INFO.contractAddress);
console.log("Contract Name:", SEMESTER_ZERO_INFO.contractName);
console.log("Storage Path:", SEMESTER_ZERO_INFO.storagePath);
console.log("Public Path:", SEMESTER_ZERO_INFO.publicPath);
console.log("\nCollection Name:", SEMESTER_ZERO_INFO.name);
console.log("Description:", SEMESTER_ZERO_INFO.description);
console.log("\nLogo URI:", SEMESTER_ZERO_INFO.logoURI);
console.log("Banner URI:", SEMESTER_ZERO_INFO.bannerURI);
console.log("\nTwitter:", SEMESTER_ZERO_INFO.extensions.twitter);
console.log("Website:", SEMESTER_ZERO_INFO.extensions.website);
console.log("\n" + "=".repeat(60));
console.log("\n✅ INSTRUCTIONS:");
console.log("1. Import your private key to Flow Wallet Extension:");
console.log("   - Open Flow Wallet Extension");
console.log("   - Settings → Import Account");
console.log("   - Paste private key from emulator-account.pkey");
console.log("\n2. Visit https://token-list.fixes.world/");
console.log("3. Connect with wallet (0x807c3d470888cc48)");
console.log("4. Click 'Quick Register' button");
console.log("5. Fill in the form with the info above");
console.log("6. Submit and sign the transaction");
console.log("\n💡 Your contract already implements MetadataViews, so you're good to go!");
console.log("\n");

// Export for programmatic use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SEMESTER_ZERO_INFO;
}
