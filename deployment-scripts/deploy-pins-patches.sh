#!/bin/bash

# Deploy Updated SemesterZero Contract with Pins & Patches
# This updates the existing contract at 0xce9dd43888d99574
# to add PinNFT and PatchNFT resources with location-based traits

echo "🎯 Deploying SemesterZero Contract Update (Pins & Patches)"
echo "============================================"
echo ""
echo "This update adds:"
echo "  - PinNFT resource (location-based collectibles)"
echo "  - PatchNFT resource (achievement collectibles)"
echo "  - Admin.mintPin() function"
echo "  - Admin.mintPatch() function"
echo ""
echo "Supported Locations:"
echo "  - Paradise Motel"
echo "  - Crystal Springs"
echo "  - Arcade"
echo ""
echo "All NFTs will show in the same SemesterZero collection on Flowty"
echo ""

# Confirm deployment
read -p "Deploy to mainnet at 0xce9dd43888d99574? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo ""
echo "📝 Deploying contract..."

# Check if flunks.flow directory exists
FLUNKS_FLOW_DIR="$HOME/Desktop/flunks.flow"

if [ ! -d "$FLUNKS_FLOW_DIR" ]; then
    echo "❌ Error: flunks.flow directory not found at $FLUNKS_FLOW_DIR"
    echo "Please update FLUNKS_FLOW_DIR in this script to point to your flow.json location"
    exit 1
fi

# Copy the updated contract to the flunks.flow folder
echo "📋 Copying updated contract to flunks.flow..."
cp "./contracts/semesterzero.cdc" "$FLUNKS_FLOW_DIR/cadence/contracts/SemesterZero.cdc"

# Change to flunks.flow directory to use its flow.json
cd "$FLUNKS_FLOW_DIR" || exit 1

# Update the contract using Flow CLI
flow accounts update-contract ./cadence/contracts/SemesterZero.cdc \
  --network mainnet \
  --signer mainnet-account

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Contract deployed successfully!"
    echo ""
    echo "Next steps:"
    echo "  1. Test minting a Pin: ./deployment-scripts/test-mint-pin.sh"
    echo "  2. Test minting a Patch: ./deployment-scripts/test-mint-patch.sh"
    echo "  3. Verify on Flowty: https://flowty.io/collection/0xce9dd43888d99574/SemesterZero"
    echo ""
    echo "Admin functions available:"
    echo "  - admin.mintPin(userAddress, location, name, description, rarity, image)"
    echo "  - admin.mintPatch(userAddress, location, achievement, name, description, rarity, image)"
    echo ""
else
    echo ""
    echo "❌ Deployment failed"
    echo ""
    echo "Common issues:"
    echo "  1. Make sure you're authenticated: flow accounts list"
    echo "  2. Check contract syntax: flow cadence parse ./contracts/semesterzero.cdc"
    echo "  3. Verify account has admin access"
    exit 1
fi
