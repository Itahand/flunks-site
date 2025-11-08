import SemesterZero from 0xce9dd43888d99574
import NonFungibleToken from 0x1d7e57aa55817448

/// Transfer a SemesterZero Chapter5NFT to another address
/// 
/// This transaction transfers an NFT from the signer's SemesterZero collection
/// to the recipient's collection
///
/// Parameters:
/// - recipient: The Flow address receiving the NFT
/// - withdrawID: The NFT ID to transfer
transaction(recipient: Address, withdrawID: UInt64) {

    let transferToken: @{NonFungibleToken.NFT}
    
    prepare(signer: auth(BorrowValue) &Account) {
        // Get the signer's collection
        let collectionRef = signer.storage.borrow<auth(NonFungibleToken.Withdraw) &SemesterZero.Chapter5Collection>(
            from: SemesterZero.Chapter5CollectionStoragePath
        ) ?? panic("Could not borrow reference to owner's collection")

        // Withdraw the NFT
        self.transferToken <- collectionRef.withdraw(withdrawID: withdrawID)
    }

    execute {
        // Get recipient's collection capability
        let recipient = getAccount(recipient)
        let receiverRef = recipient.capabilities.get<&{NonFungibleToken.Receiver}>(
            SemesterZero.Chapter5CollectionPublicPath
        ).borrow() ?? panic("Could not borrow receiver reference")

        // Deposit the NFT
        receiverRef.deposit(token: <-self.transferToken)
    }
}
