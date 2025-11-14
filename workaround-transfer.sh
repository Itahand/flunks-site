#!/bin/bash

echo "🔄 Workaround: Transferring NFT to trigger marketplace refresh"
echo ""
echo "Since we can't update the contract to emit Updated events,"
echo "we'll transfer the NFT which emits Withdraw + Deposit events."
echo "This should trigger Flowty to re-index the NFT metadata."
echo ""

NFT_ID=2
FROM_ADDR="0xce9dd43888d99574"
TO_ADDR="0xe327216d843357f1"  # Your user wallet

echo "Step 1: Transfer NFT #${NFT_ID} from ${FROM_ADDR} to ${TO_ADDR}"
echo "Step 2: Transfer it back from ${TO_ADDR} to ${FROM_ADDR}"
echo ""
echo "This will emit events that trigger Flowty to refresh."
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Create transfer transaction
cat > /tmp/transfer-nft.cdc << 'EOF'
import SemesterZero from 0xce9dd43888d99574
import NonFungibleToken from 0x1d7e57aa55817448

transaction(recipient: Address, nftID: UInt64) {
    
    let senderCollection: auth(NonFungibleToken.Withdraw) &SemesterZero.Chapter5Collection
    let recipientCollection: &SemesterZero.Chapter5Collection
    
    prepare(signer: auth(Storage) &Account) {
        // Borrow sender's collection
        self.senderCollection = signer.storage.borrow<auth(NonFungibleToken.Withdraw) &SemesterZero.Chapter5Collection>(
            from: SemesterZero.Chapter5CollectionStoragePath
        ) ?? panic("Could not borrow sender collection")
        
        // Borrow recipient's collection
        self.recipientCollection = getAccount(recipient)
            .capabilities.get<&SemesterZero.Chapter5Collection>(SemesterZero.Chapter5CollectionPublicPath)
            .borrow()
            ?? panic("Could not borrow recipient collection")
    }
    
    execute {
        // Withdraw NFT from sender
        let nft <- self.senderCollection.withdraw(withdrawID: nftID)
        
        // Deposit to recipient
        self.recipientCollection.deposit(token: <-nft)
        
        log("✅ NFT #".concat(nftID.toString()).concat(" transferred!"))
    }
}
EOF

echo "📝 Transaction created"
echo ""
echo "❌ WAIT! This requires the recipient to have the collection initialized first."
echo ""
echo "💡 Better solution: Let's just wait for Flowty's periodic re-indexing (24-48 hours)"
echo "   OR manually ask Flowty support to refresh the NFT"
echo ""
echo "The metadata IS correct on-chain. The issue is just Flowty's cache."

