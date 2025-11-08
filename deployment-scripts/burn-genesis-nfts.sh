#!/bin/bash

# Burn Genesis NFTs (IDs 0 and 1)
# WARNING: This permanently destroys the NFTs - cannot be undone!

echo "🔥 Burn Genesis NFTs"
echo "===================="
echo ""
echo "⚠️  WARNING: This will PERMANENTLY DESTROY the Genesis NFTs"
echo "   NFT #0 and #1 will be removed from the collection forever"
echo "   This action CANNOT be undone"
echo ""

# You'll need to find who owns these NFTs first
# Run: node admin-scripts/check-chapter5-nft-owners.js

# Your test wallet addresses (Genesis NFTs owned by you)
OWNER_OF_NFT_0="0xbfffec679fff3a94"
OWNER_OF_NFT_1="0xce9dd43888d99574"

echo "Current assumed owners:"
echo "  NFT #0: $OWNER_OF_NFT_0"
echo "  NFT #1: $OWNER_OF_NFT_1"
echo ""

read -p "Are you ABSOLUTELY SURE you want to burn these NFTs? Type 'BURN' to confirm: " -r
echo ""

if [[ ! $REPLY == "BURN" ]]; then
    echo "❌ Burn cancelled (smart choice to double-check!)"
    exit 1
fi

echo ""
echo "🔥 Burning NFT #0 from wallet $OWNER_OF_NFT_0..."
echo "Note: This transaction must be signed by the admin wallet that owns both NFTs"
flow transactions send ./cadence/transactions/burn-nft.cdc \
  0 \
  --network mainnet \
  --signer mainnet-account

if [ $? -eq 0 ]; then
    echo "✅ NFT #0 burned successfully"
else
    echo "❌ Failed to burn NFT #0"
    exit 1
fi

echo ""
echo "🔥 Burning NFT #1 from wallet $OWNER_OF_NFT_1..."
flow transactions send ./cadence/transactions/burn-nft.cdc \
  1 \
  --network mainnet \
  --signer mainnet-account

if [ $? -eq 0 ]; then
    echo "✅ NFT #1 burned successfully"
else
    echo "❌ Failed to burn NFT #1"
    exit 1
fi

echo ""
echo "🎉 Both Genesis NFTs destroyed!"
echo ""
echo "The collection is now clean - no more test NFTs"
echo "Total NFTs in collection: $(expr $(flow scripts execute ./cadence/scripts/check-semesterzero-state.cdc --network mainnet | grep totalChapter5NFTs | awk '{print $2}') - 2)"
echo ""
echo "Verify on Flowty:"
echo "https://flowty.io/collection/0xce9dd43888d99574/SemesterZero"
