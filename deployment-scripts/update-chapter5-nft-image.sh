#!/bin/bash

# Update SemesterZero contract NFT image URL
# Changes Chapter5 NFT image from chapter5-completion.png to 1.png

FLUNKS_FLOW_DIR="$HOME/Desktop/flunks.flow"
CONTRACT_FILE="./contracts/semesterzero.cdc"

echo "🚀 Updating SemesterZero NFT image URL on mainnet..."
echo ""
echo "⚠️  This will update the contract deployed at 0xce9dd43888d99574"
echo ""
echo "✨ Changes being deployed:"
echo "   - Updated Chapter5 NFT image URL"
echo "   - Old: https://storage.googleapis.com/flunks_public/nfts/chapter5-completion.png"
echo "   - New: https://storage.googleapis.com/flunks_public/images/1.png"
echo ""
echo "📝 Note: This only affects NEW mints. Existing NFTs keep their old metadata."
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
echo "📋 Copying updated contract to flunks.flow/cadence/contracts..."
cp "$CONTRACT_FILE" "$FLUNKS_FLOW_DIR/cadence/contracts/SemesterZero.cdc"

# Change to flunks.flow directory to use its flow.json
cd "$FLUNKS_FLOW_DIR" || exit 1

echo "🔄 Updating SemesterZero contract on mainnet at 0xce9dd43888d99574..."
echo ""

# Update the contract using Flow CLI
flow accounts update-contract ./cadence/contracts/SemesterZero.cdc \
  --network mainnet \
  --signer mainnet-account

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Contract update submitted successfully!"
  echo ""
  echo "📝 Next steps:"
  echo "1. Wait for the transaction to be sealed (~2-3 seconds)"
  echo "2. All new Chapter 5 NFTs will use the new image"
  echo "3. Check Flowty to verify the new NFTs display correctly"
  echo ""
  echo "🎉 NFT image updated!"
else
  echo ""
  echo "❌ Contract update failed. Check the error message above."
  exit 1
fi
