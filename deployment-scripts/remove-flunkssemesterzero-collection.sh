#!/bin/bash

# Update FlunksSemesterZero to minimal version to remove duplicate collection from Flowty
# This removes the NonFungibleToken implementation so only SemesterZero appears on marketplaces

FLUNKS_FLOW_DIR="$HOME/Desktop/flunks.flow"
CONTRACT_FILE="./contracts/FlunksSemesterZero_minimal.cdc"

echo "🚀 Updating FlunksSemesterZero to minimal version on mainnet..."
echo ""
echo "⚠️  This will update the contract deployed at 0xce9dd43888d99574"
echo ""
echo "✨ Changes being deployed:"
echo "   - Removes NonFungibleToken implementation"
echo "   - Removes NFT and Collection resources"
echo "   - Contract becomes inactive (won't show on Flowty)"
echo "   - REVERSIBLE - you can restore the full version anytime"
echo ""
echo "📍 Result: Only SemesterZero collection will appear on Flowty"
echo ""
echo "Current contract location: $CONTRACT_FILE"
echo "Using flow.json from: $FLUNKS_FLOW_DIR"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Cancelled."
  exit 1
fi

# Copy the updated contract to the flunks.flow folder
echo "📋 Copying minimal contract to flunks.flow/cadence/contracts..."
cp "$CONTRACT_FILE" "$FLUNKS_FLOW_DIR/cadence/contracts/FlunksSemesterZero.cdc"

# Change to flunks.flow directory to use its flow.json
cd "$FLUNKS_FLOW_DIR" || exit 1

echo "🔄 Updating FlunksSemesterZero contract on mainnet at 0xce9dd43888d99574..."
echo ""

# Update the contract using Flow CLI
flow accounts update-contract ./cadence/contracts/FlunksSemesterZero.cdc \
  --network mainnet \
  --signer mainnet-account

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Contract update submitted successfully!"
  echo ""
  echo "📝 Next steps:"
  echo "1. Wait for transaction to be sealed (~2-3 seconds)"
  echo "2. Check Flowty - FlunksSemesterZero should no longer appear as collection"
  echo "3. Only SemesterZero collection will be visible"
  echo ""
  echo "💡 To revert: Run this script with ./contracts/FlunksSemesterZero.cdc (the full version)"
  echo ""
  echo "🎉 Duplicate collection removed!"
else
  echo ""
  echo "❌ Contract update failed. Check the error message above."
  exit 1
fi
