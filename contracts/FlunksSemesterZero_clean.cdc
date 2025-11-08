// FlunksSemesterZero - Clean Chapter 5 NFT Collection
// This is the main collection for Semester Zero Chapter 5 NFTs
// Replaces the old SemesterZero collection which had test mints

import NonFungibleToken from 0x1d7e57aa55817448
import MetadataViews from 0x1d7e57aa55817448
import ViewResolver from 0x1d7e57aa55817448
import FungibleToken from 0xf233dcee88fe0abe

access(all) contract FlunksSemesterZero: NonFungibleToken, ViewResolver {
    
    // ========================================
    // PATHS
    // ========================================
    
    access(all) let CollectionStoragePath: StoragePath
    access(all) let CollectionPublicPath: PublicPath
    access(all) let AdminStoragePath: StoragePath
    
    // ========================================
    // STATE
    // ========================================
    
    access(all) var totalSupply: UInt64
    access(all) let chapter5Completions: {Address: Bool}
    
    // ========================================
    // EVENTS
    // ========================================
    
    access(all) event ContractInitialized()
    access(all) event Withdraw(id: UInt64, from: Address?)
    access(all) event Deposit(id: UInt64, to: Address?)
    access(all) event Chapter5NFTMinted(nftID: UInt64, recipient: Address, timestamp: UFix64)
    
    // ========================================
    // NFT RESOURCE
    // ========================================
    
    access(all) resource NFT: NonFungibleToken.NFT, ViewResolver.Resolver {
        access(all) let id: UInt64
        access(all) let achievementType: String
        access(all) let recipient: Address
        access(all) let mintedAt: UFix64
        access(all) let metadata: {String: String}
        
        init(id: UInt64, recipient: Address) {
            self.id = id
            self.achievementType = "SLACKER_AND_OVERACHIEVER"
            self.recipient = recipient
            self.mintedAt = getCurrentBlock().timestamp
            self.metadata = {
                "name": "Chapter 5 Completion",
                "description": "Awarded for completing both Slacker and Overachiever objectives in Chapter 5",
                "achievement": "SLACKER_AND_OVERACHIEVER",
                "chapter": "5",
                "rarity": "Legendary",
                "image": "https://storage.googleapis.com/flunks_public/images/1.png"
            }
        }
        
        access(all) view fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.NFTCollectionData>(),
                Type<MetadataViews.NFTCollectionDisplay>(),
                Type<MetadataViews.Royalties>(),
                Type<MetadataViews.ExternalURL>(),
                Type<MetadataViews.Serial>()
            ]
        }
        
        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.metadata["name"] ?? "Chapter 5 NFT",
                        description: self.metadata["description"] ?? "Flunks: Semester Zero achievement",
                        thumbnail: MetadataViews.HTTPFile(
                            url: self.metadata["image"] ?? "https://storage.googleapis.com/flunks_public/images/1.png"
                        )
                    )
                    
                case Type<MetadataViews.ExternalURL>():
                    return MetadataViews.ExternalURL("https://www.flunks.net/semester-zero/chapter-5")
                    
                case Type<MetadataViews.Royalties>():
                    let royaltyReceiver: Capability<&{FungibleToken.Receiver}> =
                        getAccount(0xce9dd43888d99574).capabilities.get<&{FungibleToken.Receiver}>(MetadataViews.getRoyaltyReceiverPublicPath())!
                    return MetadataViews.Royalties(
                        [
                            MetadataViews.Royalty(
                                receiver: royaltyReceiver,
                                cut: 0.10,
                                description: "Flunks: Semester Zero marketplace royalty"
                            )
                        ]
                    )
                
                case Type<MetadataViews.Serial>():
                    return MetadataViews.Serial(self.id)
                
                case Type<MetadataViews.NFTCollectionData>():
                    return FlunksSemesterZero.resolveContractView(resourceType: Type<@FlunksSemesterZero.NFT>(), viewType: Type<MetadataViews.NFTCollectionData>())
                
                case Type<MetadataViews.NFTCollectionDisplay>():
                    return FlunksSemesterZero.resolveContractView(resourceType: Type<@FlunksSemesterZero.NFT>(), viewType: Type<MetadataViews.NFTCollectionDisplay>())
            }
            
            return nil
        }
        
        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <- FlunksSemesterZero.createEmptyCollection(nftType: Type<@FlunksSemesterZero.NFT>())
        }
    }
    
    // ========================================
    // COLLECTION RESOURCE
    // ========================================
    
    access(all) resource Collection: NonFungibleToken.Collection {
        access(all) var ownedNFTs: @{UInt64: {NonFungibleToken.NFT}}
        
        init() {
            self.ownedNFTs <- {}
        }
        
        access(all) view fun getLength(): Int {
            return self.ownedNFTs.length
        }
        
        access(all) view fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }
        
        access(all) view fun borrowNFT(_ id: UInt64): &{NonFungibleToken.NFT}? {
            return &self.ownedNFTs[id]
        }
        
        access(NonFungibleToken.Withdraw) fun withdraw(withdrawID: UInt64): @{NonFungibleToken.NFT} {
            let token <- self.ownedNFTs.remove(key: withdrawID)
                ?? panic("NFT not found in collection")
            
            emit Withdraw(id: token.id, from: self.owner?.address)
            return <- token
        }
        
        access(all) fun deposit(token: @{NonFungibleToken.NFT}) {
            let nft <- token as! @FlunksSemesterZero.NFT
            let id = nft.id
            
            let oldToken <- self.ownedNFTs[id] <- nft
            destroy oldToken
            
            emit Deposit(id: id, to: self.owner?.address)
        }
        
        access(all) view fun getSupportedNFTTypes(): {Type: Bool} {
            let supportedTypes: {Type: Bool} = {}
            supportedTypes[Type<@FlunksSemesterZero.NFT>()] = true
            return supportedTypes
        }
        
        access(all) view fun isSupportedNFTType(type: Type): Bool {
            return type == Type<@FlunksSemesterZero.NFT>()
        }
        
        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <- FlunksSemesterZero.createEmptyCollection(nftType: Type<@FlunksSemesterZero.NFT>())
        }
    }
    
    // ========================================
    // ADMIN RESOURCE
    // ========================================
    
    access(all) resource Admin {
        
        /// Airdrop Chapter 5 NFT to eligible user
        access(all) fun airdropChapter5NFT(userAddress: Address) {
            pre {
                FlunksSemesterZero.chapter5Completions[userAddress] == nil: "User already received Chapter 5 NFT"
            }
            
            // Check user has collection set up
            let userAccount = getAccount(userAddress)
            let collectionCap = userAccount.capabilities
                .get<&{NonFungibleToken.Receiver}>(FlunksSemesterZero.CollectionPublicPath)
            
            assert(collectionCap.check(), message: "User does not have FlunksSemesterZero collection set up")
            
            // Mint the NFT
            let newNFT <- create NFT(
                id: FlunksSemesterZero.totalSupply,
                recipient: userAddress
            )
            let nftID = newNFT.id
            
            // Get recipient's collection reference
            let recipientCollection = collectionCap.borrow()!
            
            // Deposit into recipient's collection
            recipientCollection.deposit(token: <- newNFT)
            
            // Update state
            FlunksSemesterZero.totalSupply = FlunksSemesterZero.totalSupply + 1
            FlunksSemesterZero.chapter5Completions[userAddress] = true
            
            emit Chapter5NFTMinted(
                nftID: nftID,
                recipient: userAddress,
                timestamp: getCurrentBlock().timestamp
            )
        }
    }
    
    // ========================================
    // CONTRACT FUNCTIONS
    // ========================================
    
    access(all) fun createEmptyCollection(nftType: Type): @{NonFungibleToken.Collection} {
        return <- create Collection()
    }
    
    access(all) view fun getContractViews(resourceType: Type?): [Type] {
        return [
            Type<MetadataViews.NFTCollectionData>(),
            Type<MetadataViews.NFTCollectionDisplay>()
        ]
    }
    
    access(all) fun resolveContractView(resourceType: Type?, viewType: Type): AnyStruct? {
        switch viewType {
            case Type<MetadataViews.NFTCollectionData>():
                return MetadataViews.NFTCollectionData(
                    storagePath: self.CollectionStoragePath,
                    publicPath: self.CollectionPublicPath,
                    publicCollection: Type<&FlunksSemesterZero.Collection>(),
                    publicLinkedType: Type<&FlunksSemesterZero.Collection>(),
                    createEmptyCollectionFunction: (fun(): @{NonFungibleToken.Collection} {
                        return <- FlunksSemesterZero.createEmptyCollection(nftType: Type<@FlunksSemesterZero.NFT>())
                    })
                )
            
            case Type<MetadataViews.NFTCollectionDisplay>():
                let squareImage = MetadataViews.Media(
                    file: MetadataViews.HTTPFile(url: "https://storage.googleapis.com/flunks_public/images/semesterzero.png"),
                    mediaType: "image/png"
                )
                let bannerImage = MetadataViews.Media(
                    file: MetadataViews.HTTPFile(url: "https://storage.googleapis.com/flunks_public/images/banner.png"),
                    mediaType: "image/png"
                )
                
                return MetadataViews.NFTCollectionDisplay(
                    name: "Flunks: Semester Zero",
                    description: "Flunks: Semester Zero is a standalone collection that rewards users for exploring flunks.net and participating in events, challenges and completing objectives.",
                    externalURL: MetadataViews.ExternalURL("https://flunks.net"),
                    squareImage: squareImage,
                    bannerImage: bannerImage,
                    socials: {
                        "twitter": MetadataViews.ExternalURL("https://x.com/flunks_nft"),
                        "discord": MetadataViews.ExternalURL("https://discord.gg/flunks")
                    }
                )
        }
        
        return nil
    }
    
    init() {
        self.CollectionStoragePath = /storage/FlunksSemesterZeroCollection
        self.CollectionPublicPath = /public/FlunksSemesterZeroCollection
        self.AdminStoragePath = /storage/FlunksSemesterZeroAdmin
        
        self.totalSupply = 0
        self.chapter5Completions = {}
        
        // Create admin resource
        let admin <- create Admin()
        self.account.storage.save(<-admin, to: self.AdminStoragePath)
        
        emit ContractInitialized()
    }
}
