import SemesterZero from 0xce9dd43888d99574

access(all) fun main(address: Address): {String: String}? {
  let account = getAccount(address)
  let collection = account.capabilities
    .get<&SemesterZero.Chapter5Collection>(SemesterZero.Chapter5CollectionPublicPath)
    .borrow()
  
  if collection == nil { return nil }
  
  let ids = collection!.getIDs()
  if ids.length == 0 { return nil }
  
  let nft = collection!.borrowChapter5NFT(id: ids[0])
  if nft == nil { return nil }
  
  let metadata: {String: String} = {}
  for key in nft!.metadata.keys {
    metadata[key] = nft!.metadata[key]!
  }
  return metadata
}
