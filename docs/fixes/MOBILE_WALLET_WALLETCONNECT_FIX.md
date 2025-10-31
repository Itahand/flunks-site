# Mobile Wallet Fix - WalletConnect Configuration

## Problem
Mobile wallets (Flow Wallet, Dapper, etc.) were not showing up in Dynamic Labs SDK on mobile devices, even though they worked fine on desktop.

## Root Cause
After comparing your setup with the official FCL React SDK demo, the key missing piece was:

### **Missing `walletconnect.projectId` in FCL Configuration**

The FCL demo at [onflow/fcl-js/demo](https://github.com/onflow/fcl-js/blob/7963d7aa2984e4fd0ad94182a65c8c4065f1d98c/packages/demo/src/components/flow-provider-wrapper.tsx#L150) includes:

```tsx
<FlowProvider
  config={{
    ...flowConfig[currentNetwork],
    walletconnectProjectId: "9b70cfa398b2355a5eb9b1cf99f4a981", // ✅ THIS WAS MISSING
    flowNetwork: currentNetwork,
  }}
>
```

### **Why This Matters**

WalletConnect is the protocol that enables **mobile wallet connections**. Without the `walletconnectProjectId`:
- Desktop wallets work (they use browser extensions/iframes)
- Mobile wallets don't work (they need WalletConnect)

## What Changed

### File: `src/config/fcl.ts`

**BEFORE:**
```typescript
config({
  "accessNode.api": FLOW_ACCESS_NODE,
  "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
  "app.detail.title": "Flunks",
  "app.detail.icon": "https://flunks.net/flunks-logo.png",
  "challenge.handshake": "https://fcl-discovery.onflow.org/authn",
})
```

**AFTER:**
```typescript
config({
  "accessNode.api": FLOW_ACCESS_NODE,
  "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
  "app.detail.title": "Flunks",
  "app.detail.icon": "https://flunks.net/flunks-logo.png",
  "app.detail.url": "https://flunks.net", // 🆕 Added
  "challenge.handshake": "https://fcl-discovery.onflow.org/authn",
  "flow.network": "mainnet", // 🆕 Added for mobile detection
  "walletconnect.projectId": WALLETCONNECT_PROJECT_ID, // 🆕 CRITICAL FIX
})
```

## Configuration Keys Explained

### From FCL Documentation:

| Key | Example | Purpose |
|-----|---------|---------|
| `walletconnect.projectId` | `"9b70cfa398b2355a5eb9b1cf99f4a981"` | **Required** for mobile WalletConnect. Get yours at [WalletConnect Cloud](https://cloud.walletconnect.com/sign-in) |
| `flow.network` | `"testnet"` or `"mainnet"` | Used in conjunction with stored interactions and provides FCLCryptoContract address |
| `app.detail.url` | `"https://flunks.net"` | Your app URL, requested by wallets and WalletConnect |

## How Mobile Wallets Work

```
DESKTOP:
User clicks "Connect Wallet"
         ↓
Dynamic Labs shows wallet options
         ↓
User selects wallet (e.g., Lilico extension)
         ↓
Browser extension opens
         ↓
User approves in extension
         ↓
✅ Connected!

MOBILE:
User clicks "Connect Wallet"
         ↓
Dynamic Labs shows wallet options
         ↓
User selects wallet (e.g., Flow Wallet)
         ↓
🔗 WalletConnect protocol initiates
         ↓
📱 Mobile wallet app opens (via deep link)
         ↓
User approves in mobile app
         ↓
🔗 WalletConnect sends approval back
         ↓
✅ Connected!
```

**Without `walletconnect.projectId`:** The "🔗 WalletConnect protocol initiates" step fails.

## Environment Variable Setup

### Option 1: Use the Demo Project ID (Testing)
```bash
# .env.local
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=9b70cfa398b2355a5eb9b1cf99f4a981
```

### Option 2: Get Your Own Project ID (Production)
1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/sign-in)
2. Sign up / Log in
3. Create a new project
4. Copy your Project ID
5. Add to `.env.local`:
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
```

## Testing

### Desktop (Should Still Work):
1. Open site on desktop browser
2. Click "Connect Wallet"
3. Select "Flow Wallet" or "Lilico"
4. Extension opens
5. Approve connection
6. ✅ Connected

### Mobile (Should Now Work):
1. Open site on mobile browser
2. Click "Connect Wallet"
3. Select "Flow Wallet" or "Dapper"
4. Mobile app opens via deep link
5. Approve connection in app
6. Return to browser
7. ✅ Connected

## Console Output

You should now see:
```
🌊 Configuring FCL with access node: https://rest-mainnet.onflow.org
📱 WalletConnect Project ID: Set ✅
✅ FCL Configuration complete: {
  accessNode: 'https://rest-mainnet.onflow.org',
  network: 'mainnet',
  walletConnectConfigured: true
}
```

## Comparison Table: Your Setup vs FCL Demo

| Feature | FCL Demo (Working) | Your Setup (Before Fix) | Your Setup (After Fix) |
|---------|-------------------|------------------------|----------------------|
| **SDK** | @onflow/react-sdk | Dynamic Labs + Flow | Dynamic Labs + Flow |
| **WalletConnect Project ID** | ✅ Yes | ❌ No | ✅ Yes |
| **flow.network** | ✅ Set | ❌ Not set | ✅ Set |
| **app.detail.url** | ✅ Set | ❌ Not set | ✅ Set |
| **discovery.wallet** | ✅ Set | ✅ Set | ✅ Set |
| **Mobile Support** | ✅ Works | ❌ Broken | ✅ Should work |

## Key Differences: FCL React SDK vs Dynamic Labs

### FCL React SDK (What the demo uses):
```tsx
<FlowProvider
  config={{
    accessNodeUrl: "https://rest-mainnet.onflow.org",
    walletconnectProjectId: "...",  // Built-in prop
    flowNetwork: "mainnet",         // Built-in prop
  }}
>
  <App />
</FlowProvider>
```

### Dynamic Labs SDK (What you use):
```tsx
<DynamicContextProvider
  settings={{
    environmentId: "...",
    walletConnectors: [FlowWalletConnectors],  // Abstracts FCL
  }}
>
  <App />
</DynamicContextProvider>
```

**The issue:** Dynamic Labs' `FlowWalletConnectors` doesn't automatically configure FCL's `walletconnect.projectId`. You have to do it manually in your FCL config!

## Why This Wasn't Obvious

1. **Dynamic Labs abstracts FCL** - You don't directly see the FCL configuration
2. **Desktop works without WalletConnect** - Only mobile needs it
3. **No error messages** - Just silently doesn't show mobile wallets
4. **Different SDK** - FCL demo uses native SDK, you use Dynamic Labs

## Additional Notes

### If Still Not Working on Mobile:

1. **Check console logs:**
   ```javascript
   // In browser console on mobile:
   localStorage.getItem('fcl:config')
   ```
   Should show `walletconnect.projectId` is set

2. **Check Dynamic Labs Flow connector:**
   ```javascript
   // In browser console:
   window.Dynamic?.walletConnector
   ```

3. **Try different mobile wallets:**
   - Flow Wallet (Flow Foundation's official wallet)
   - Dapper Wallet (Most compatible)
   - Blocto (Good mobile support)

4. **Check deep linking:**
   - Make sure you're on HTTPS (required for deep links)
   - Test on actual mobile device (not emulator)

## Next Steps

1. ✅ **Deploy the updated `fcl.ts` config**
2. ✅ **Add WalletConnect Project ID to environment variables**
3. 📱 **Test on actual mobile device**
4. 🔍 **Check console logs for WalletConnect initialization**

---

## Reference

- [FCL Demo Source](https://github.com/onflow/fcl-js/blob/7963d7aa2984e4fd0ad94182a65c8c4065f1d98c/packages/demo/src/components/flow-provider-wrapper.tsx#L150)
- [FCL Configuration Docs](https://github.com/onflow/fcl-js/tree/main/packages/fcl-core/docs)
- [WalletConnect Cloud](https://cloud.walletconnect.com)
- [Dynamic Labs + Flow Docs](https://docs.dynamic.xyz/chains/flow)

---

**Status:** ✅ Configuration updated  
**Next:** Test on mobile device with WalletConnect Project ID configured
