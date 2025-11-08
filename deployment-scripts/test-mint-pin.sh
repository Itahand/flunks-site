#!/bin/bash

# Test Minting a Pin NFT
# This script mints a test Paradise Motel pin to a test wallet

echo "🧪 Testing Pin NFT Minting"
echo "=========================="
echo ""

# Test wallet (you can change this)
TEST_WALLET="0x807c3d470888cc48"

echo "Minting Paradise Motel Pin to: $TEST_WALLET"
echo ""

flow transactions send ./cadence/transactions/airdrop-pin.cdc \
  "$TEST_WALLET" \
  "Paradise Motel" \
  "Paradise Motel Pin" \
  "Collectible pin commemorating your visit to Paradise Motel during Semester Zero. Orange and blue retro vibes." \
  "uncommon" \
  "https://storage.googleapis.com/flunks_public/images/paradise-motel-pin.png" \
  --network mainnet \
  --signer flunks-admin

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Pin minted successfully!"
    echo ""
    echo "View on Flowty:"
    echo "https://flowty.io/collection/0xce9dd43888d99574/SemesterZero"
    echo ""
    echo "Check wallet collection:"
    echo "https://flowdiver.io/account/$TEST_WALLET"
else
    echo ""
    echo "❌ Minting failed"
    echo "Make sure the wallet has the SemesterZero collection enabled"
fi
