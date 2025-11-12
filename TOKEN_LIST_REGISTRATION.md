# Making Flunks: Semester Zero Discoverable in Flow Wallet

## 🎯 Overview

Flow Wallet browser extension discovers NFT collections through the **Token List** registry (formerly NFT Catalog, which is now deprecated). This guide explains how to register Flunks: Semester Zero so it appears automatically when users connect their wallets.

## ✅ Current Status

Your `SemesterZero` contract **already implements all required views**:
- ✅ `NFTCollectionData` - Paths and collection creation
- ✅ `NFTCollectionDisplay` - Name, description, images, socials  
- ✅ `Display` - Individual NFT metadata
- ✅ `ExternalURL` - Website link (https://flunks.net)
- ✅ `Royalties` - Marketplace royalty information

**Contract Address:** `0xce9dd43888d99574` (Mainnet)  
**Contract Name:** `SemesterZero`

---

## 📋 Registration Options

### **Option 1: Web UI (Easiest)**

1. **Visit:** https://token-list.fixes.world/

2. **Connect any Flow wallet** (registration is permissionless)

3. **In the "Quick Register" section:**
   - Contract Address: `0xce9dd43888d99574`
   - Contract Name: `SemesterZero`
   - The system auto-validates your MetadataViews implementation

4. **Submit transaction** - Free, on-chain registration

5. **Wait 1-2 minutes** for indexing

---

### **Option 2: Node.js Script**

```bash
node admin-scripts/register-token-list.js
```

This script:
- Checks if already registered
- Provides step-by-step instructions
- Shows transaction code for manual submission

---

### **Option 3: Flow CLI Transaction**

```bash
flow transactions send cadence/transactions/register-semester-zero-tokenlist.cdc --network mainnet --signer flunks-admin
```

---

## 🔍 Verify Registration

### **Check via Script:**

```javascript
import * as fcl from "@onflow/fcl";

fcl.config()
  .put("accessNode.api", "https://rest-mainnet.onflow.org")
  .put("flow.network", "mainnet");

const isRegistered = await fcl.query({
  cadence: `
    import NFTList from 0x15a918087ab12d86
    
    access(all) fun main(address: Address, contractName: String): Bool {
        return NFTList.isNFTCollectionRegistered(address, contractName)
    }
  `,
  args: (arg, t) => [
    arg("0xce9dd43888d99574", t.Address),
    arg("SemesterZero", t.String),
  ],
});

console.log("Registered:", isRegistered);
```

### **Check via Token List Website:**

Visit: https://token-list.fixes.world/
- Navigate to "Full List - Non-Fungible Tokens"
- Search for "Flunks: Semester Zero"

---

## 📱 After Registration

Once registered, your collection will automatically appear in:

### **Flow Wallet Browser Extension**
- Collections tab shows "Flunks: Semester Zero"
- NFTs display with correct metadata
- Images load from your Google Cloud Storage
- Name: "Flunks: Semester Zero"
- Description: "Rewards users for exploring flunks.net..."
- Square Logo: `semesterzero.png`
- Banner: `banner.png`

### **Other Platforms**
- **Increment Fi** - DeFi dashboard
- **Flowty** - NFT marketplace (with Updated events)
- **Flowscan** - Blockchain explorer
- Any app using Token List API

---

## 🔄 Token List API Endpoints

Your collection will be available via API:

### **Query All NFTs:**
```
GET https://token-list.fixes.world/api/nft-list
```

### **Query Specific Address:**
```
GET https://token-list.fixes.world/api/nft-list?address=0xce9dd43888d99574
```

### **JSON Export (Uniswap Standard):**
```
GET https://token-list.fixes.world/export/nft-list.json
```

Also available on GitHub:
https://github.com/fixes-world/token-list-jsons

---

## 🆚 Comparison: Old vs New System

| Feature | Old (NFT Catalog) | New (Token List) |
|---------|-------------------|------------------|
| Status | ❌ Deprecated | ✅ Active |
| Registration | Manual PR required | Permissionless on-chain |
| Cost | Free | Free |
| Approval | Days/weeks | Instant |
| Maintainer | Dapper Labs | Community-driven |
| Contract | `0x49a7cda3a1eecc29` | `0x15a918087ab12d86` |

---

## 🛠️ Technical Details

### **How Token List Works:**

1. **Registration:**
   - Anyone can call `NFTList.ensureNFTCollectionRegistered(address, name)`
   - Contract validates that your NFT implements required MetadataViews
   - If valid, adds entry to on-chain registry

2. **Discovery:**
   - Flow Wallet queries Token List contract
   - Reads `NFTCollectionDisplay` view from your contract
   - Displays collection info in wallet UI

3. **Automatic Collection Setup:**
   - When user receives NFT, wallet detects via Token List
   - Prompts user to initialize collection in their account
   - Uses `NFTCollectionData` view to create storage paths

### **Required Contract Views:**

Your contract must resolve these views at the contract level:

```cadence
access(all) fun resolveContractView(resourceType: Type?, viewType: Type): AnyStruct? {
    switch viewType {
        case Type<MetadataViews.NFTCollectionData>():
            return MetadataViews.NFTCollectionData(
                storagePath: self.Chapter5CollectionStoragePath,
                publicPath: self.Chapter5CollectionPublicPath,
                publicCollection: Type<&Chapter5Collection>(),
                publicLinkedType: Type<&Chapter5Collection>(),
                createEmptyCollectionFunction: (fun(): @{NonFungibleToken.Collection} {
                    return <-SemesterZero.createEmptyCollection(nftType: Type<@SemesterZero.Chapter5NFT>())
                })
            )
        case Type<MetadataViews.NFTCollectionDisplay>():
            return MetadataViews.NFTCollectionDisplay(
                name: "Flunks: Semester Zero",
                description: "Collectible NFTs from Semester Zero...",
                externalURL: MetadataViews.ExternalURL("https://flunks.net"),
                squareImage: MetadataViews.Media(...),
                bannerImage: MetadataViews.Media(...),
                socials: {...}
            )
    }
}
```

✅ **Your contract already has this implemented!**

---

## ❓ Troubleshooting

### **Collection not showing in wallet after registration?**

1. **Check registration status:**
   ```bash
   node admin-scripts/register-token-list.js
   ```

2. **Verify wallet is up to date:**
   - Flow Wallet may cache collection data
   - Try disconnecting and reconnecting
   - Clear browser cache if needed

3. **Confirm user has collection initialized:**
   - Token List registration ≠ user collection setup
   - User must still initialize collection in their account
   - Wallet will prompt automatically when they receive first NFT

### **Images not loading?**

- Verify URLs in contract are accessible:
  - `https://storage.googleapis.com/flunks_public/images/semesterzero.png`
  - `https://storage.googleapis.com/flunks_public/images/banner.png`

- Check MetadataViews.Media format:
  ```cadence
  MetadataViews.Media(
      file: MetadataViews.HTTPFile(url: "https://..."),
      mediaType: "image/png"
  )
  ```

### **Wrong metadata showing?**

- Token List reads data **directly from your contract**
- If you update contract views, changes appear immediately
- No need to re-register after contract updates

---

## 📚 Additional Resources

- **Token List Website:** https://token-list.fixes.world/
- **Token List Docs:** https://docs.fixes.world/concepts/token-list
- **GitHub Repository:** https://github.com/fixes-world/token-list
- **Forum Discussion:** https://forum.flow.com/t/replacing-nft-catalog-with-a-decentralized-alternative-proposal/6723
- **Flow NFT Standard:** https://github.com/onflow/flow-nft
- **MetadataViews Docs:** https://developers.flow.com/build/advanced-concepts/metadata-views

---

## ✨ Benefits After Registration

1. **Automatic Discovery**
   - Users see your collection immediately in Flow Wallet
   - No manual collection setup required

2. **Marketplace Integration**
   - Flowty, Increment Fi automatically recognize collection
   - Proper metadata display everywhere

3. **Ecosystem Visibility**
   - Listed on Token List website
   - API-accessible for dApps
   - GitHub JSON exports

4. **Future-Proof**
   - Decentralized, community-maintained
   - No approval process for updates
   - Permissionless additions

---

## 🚀 Next Steps

1. **Register now:**
   ```bash
   node admin-scripts/register-token-list.js
   ```

2. **Verify in Flow Wallet:**
   - Install Flow Wallet extension
   - Connect wallet with SemesterZero NFT
   - Check Collections tab

3. **Test with users:**
   - Have users mint their first NFT
   - Verify wallet prompts collection setup
   - Confirm metadata displays correctly

4. **Monitor:**
   - Check Token List website periodically
   - Verify API endpoints return correct data
   - Update contract views as needed

---

**Questions?** Visit the Token List Discord or Flunks community channels.

**Ready to register?** Run `node admin-scripts/register-token-list.js` now! 🎉
