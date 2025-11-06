#!/bin/bash

# Update SemesterZero contract with MetadataViews on mainnet
# This adds the required views for Token List compatibility

FLUNKS_FLOW_DIR="$HOME/Desktop/flunks.flow"
CONTRACT_FILE="./contracts/semesterzero.cdc"

echo "🚀 Updating SemesterZero with MetadataViews on mainnet..."
echo ""
echo "⚠️  WARNING: This will update the contract deployed at 0x807c3d470888cc48"
echo ""
echo "✨ Changes being deployed:"
echo "   - Added MetadataViews.Display"
echo "   - Added MetadataViews.ExternalURL"
echo "   - Added MetadataViews.NFTCollectionData"
echo "   - Added MetadataViews.NFTCollectionDisplay"
echo "   - Added MetadataViews.Royalties"
echo "   - Added MetadataViews.Serial"
echo "   - Added contract-level view resolution"
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

echo "🔄 Updating SemesterZero contract on mainnet at 0x807c3d470888cc48..."
echo ""

# Update the contract using Flow CLI with explicit contract name
flow accounts update-contract \
  SemesterZero \
  ./cadence/contracts/SemesterZero.cdc \
  --network mainnet \
  --signer mainnet-account

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Contract update submitted successfully!"
  echo ""
  echo "📝 Next steps:"
  echo "1. Wait for the transaction to be sealed (~2-3 seconds)"
  echo "2. Verify the update worked: flow accounts get 0x807c3d470888cc48 --network mainnet"
  echo "3. Register on Token List: https://token-list.fixes.world"
  echo "4. Search for your collection in Flow Wallet!"
  echo ""
  echo "🎉 Your Chapter 5 NFTs will now be discoverable!"
else
  echo ""
  echo "❌ Contract update failed. Check the error message above."
  exit 1
fi
