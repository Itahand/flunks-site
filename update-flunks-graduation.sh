#!/bin/bash

# Update FlunksGraduation contract to Cadence 1.0 on mainnet
# This will replace the old contract code with the new Cadence 1.0 version

FLUNKS_FLOW_DIR="$HOME/Desktop/flunks.flow"
CONTRACT_FILE="./contracts/FlunksGraduation_Cadence1.0.cdc"

echo "🚀 Updating FlunksGraduation to Cadence 1.0 on mainnet..."
echo ""
echo "⚠️  WARNING: This will update the contract deployed at 0x807c3d470888cc48"
echo ""
echo "Current contract location: $CONTRACT_FILE"
echo "Using flow.json from: $FLUNKS_FLOW_DIR"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Cancelled."
  exit 1
fi

# Copy the migrated contract to the flunks.flow folder
echo "📋 Copying migrated contract to flunks.flow/cadence/contracts..."
cp "$CONTRACT_FILE" "$FLUNKS_FLOW_DIR/cadence/contracts/FlunksGraduation.cdc"

# Change to flunks.flow directory to use its flow.json
cd "$FLUNKS_FLOW_DIR" || exit 1

echo "🔄 Updating contract on mainnet..."
echo ""

# Update the contract using Flow CLI
flow accounts update-contract FlunksGraduation \
  ./cadence/contracts/FlunksGraduation.cdc \
  --network mainnet \
  --signer mainnet-account

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Contract update submitted successfully!"
  echo ""
  echo "📝 Next steps:"
  echo "1. Wait for the transaction to be sealed (~2-3 seconds)"
  echo "2. Verify by running: ./check-deployed-contracts.sh"
  echo "3. Try the Token List registration again"
else
  echo ""
  echo "❌ Contract update failed. Check the error message above."
  exit 1
fi
