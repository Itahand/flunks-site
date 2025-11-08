#!/bin/bash

# Test Minting a Patch NFT
# This script mints a test Room 7 achievement patch to a test wallet

echo "🧪 Testing Patch NFT Minting"
echo "============================"
echo ""

# Test wallet (you can change this)
TEST_WALLET="0x807c3d470888cc48"

echo "Minting Room 7 Explorer Patch to: $TEST_WALLET"
echo ""

flow transactions send ./cadence/transactions/airdrop-patch.cdc \
  "$TEST_WALLET" \
  "Paradise Motel" \
  "Room 7 Explorer" \
  "Room 7 Explorer Patch" \
  "Awarded for discovering all secrets of Room 7 at Paradise Motel. You found the path through the chaos." \
  "rare" \
  "https://storage.googleapis.com/flunks_public/images/room7-patch.png" \
  --network mainnet \
  --signer flunks-admin

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Patch minted successfully!"
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
