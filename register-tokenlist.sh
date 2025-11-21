#!/bin/bash

# Register Flunks: Semester Zero on Token List (Mainnet)
# This makes the collection discoverable in Flow Wallet browser extension

echo "🚀 Registering Flunks: Semester Zero on Token List..."
echo ""

# Create temporary transaction file
cat > /tmp/register-tokenlist.cdc << 'EOF'
import NFTList from 0x15a918087ab12d86

transaction {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        // Register SemesterZeroV3 collection
        // This is permissionless - anyone can register a valid NFT contract
        NFTList.ensureNFTCollectionRegistered(
            0xce9dd43888d99574,
            "SemesterZeroV3"
        )
        
        log("✅ Flunks: Semester Zero registered on Token List!")
    }
}
EOF

echo "📝 Transaction created"
echo "🔐 Signing with flunks-admin account..."
echo ""

# Send transaction
flow transactions send /tmp/register-tokenlist.cdc \
    --network mainnet \
    --signer flunks-admin

echo ""
echo "✨ Registration complete!"
echo ""
echo "🔍 Verify at: https://token-list.fixes.world/"
echo "📱 Collection should now appear in Flow Wallet browser extension"
