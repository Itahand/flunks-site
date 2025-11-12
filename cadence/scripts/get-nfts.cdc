import SemesterZero from 0xce9dd43888d99574

access(all) fun main(address: Address): [AnyStruct] {
  let account = getAccount(address)
  let collectionRef = account.capabilities.borrow<&{SemesterZero.Chapter5CollectionPublic}>(
    SemesterZero.Chapter5CollectionPublicPath
  ) ?? panic("Could not borrow collection")
  
  let ids = collectionRef.getIDs()
  let nfts: [AnyStruct] = []
  
  for id in ids {
    let nft = collectionRef.borrowChapter5NFT(id: id)!
    nfts.append({
      "id": nft.id,
      "metadata": nft.metadata
    })
  }
  
  return nfts
}
