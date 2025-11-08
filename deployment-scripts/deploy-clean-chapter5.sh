#!/bin/bash

# Deploy clean FlunksSemesterZero and hide old SemesterZero collection
# This creates a clean slate for Chapter 5 NFTs

FLUNKS_FLOW_DIR="$HOME/Desktop/flunks.flow"
FLUNKS_CONTRACT="./contracts/FlunksSemesterZero_clean.cdc"

echo "🚀 Deploying clean Chapter 5 NFT collection..."
echo ""
echo "📋 Plan:"
echo "  1️⃣  Update FlunksSemesterZero with full minting capability (clean, 0 NFTs)"
echo "  2️⃣  Users will enable FlunksSemesterZero collection"
echo "  3️⃣  Old SemesterZero stays as-is (2 messy NFTs hidden from Flowty)"
echo ""
echo "⚠️  This will update contracts at 0xce9dd43888d99574"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Cancelled."
  exit 1
fi

# Copy FlunksSemesterZero to flunks.flow folder
echo "📋 Copying FlunksSemesterZero (clean) to flunks.flow..."
cp "$FLUNKS_CONTRACT" "$FLUNKS_FLOW_DIR/cadence/contracts/FlunksSemesterZero.cdc"

# Change to flunks.flow directory
cd "$FLUNKS_FLOW_DIR" || exit 1

echo "🔄 Updating FlunksSemesterZero on mainnet..."
echo ""

# Update FlunksSemesterZero
flow accounts update-contract ./cadence/contracts/FlunksSemesterZero.cdc \
  --network mainnet \
  --signer mainnet-account

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ FlunksSemesterZero updated successfully!"
  echo ""
  echo "📝 Next steps:"
  echo "1. Update notification component to point to FlunksSemesterZero"
  echo "2. Have users enable FlunksSemesterZero collection on Flowty"
  echo "3. Airdrop NFTs using new transaction"
  echo "4. Old SemesterZero collection will still exist but separate"
  echo ""
  echo "🎉 Clean collection ready!"
else
  echo ""
  echo "❌ Deployment failed. Check errors above."
  exit 1
fi
