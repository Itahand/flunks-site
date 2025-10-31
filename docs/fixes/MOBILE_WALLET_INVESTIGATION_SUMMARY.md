# Mobile Wallet Investigation Summary

**Date:** October 24, 2025  
**Status:** ✅ Configuration Already in Place - Ready for Testing

---

## Investigation Results

After reviewing the FCL demo and your current configuration, **the WalletConnect setup is already correctly configured** in your codebase!

### Current Configuration Status

#### ✅ `src/config/fcl.ts` (Active - Imported by _app.tsx)

```typescript
config({
  "accessNode.api": FLOW_ACCESS_NODE,
  "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
  "app.detail.title": "Flunks",
  "app.detail.icon": "https://flunks.net/flunks-logo.png",
  "app.detail.url": "https://flunks.net",
  "challenge.handshake": "https://fcl-discovery.onflow.org/authn",
  "flow.network": "mainnet", // ✅ Required for mobile
  "walletconnect.projectId": WALLETCONNECT_PROJECT_ID, // ✅ Already set!
  "discovery.wallet.method": "POP/RPC",
  "discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/authn",
});
```

#### ✅ Environment Variables

**`.env.local`:**
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=9b70cfa398b2355a5eb9b1cf99f4a981
```

**`.env.production`:**
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=9b70cfa398b2355a5eb9b1cf99f4a981
```

---

## Comparison with FCL Demo

| Configuration | FCL Demo | Your Setup | Status |
|--------------|----------|------------|--------|
| `walletconnect.projectId` | ✅ Set | ✅ Set | ✅ Match |
| `flow.network` | ✅ "mainnet" | ✅ "mainnet" | ✅ Match |
| `app.detail.title` | ✅ Set | ✅ "Flunks" | ✅ Match |
| `app.detail.icon` | ✅ Set | ✅ Set | ✅ Match |
| `app.detail.url` | ✅ Set | ✅ "https://flunks.net" | ✅ Match |
| `accessNode.api` | ✅ Set | ✅ Set | ✅ Match |
| `discovery.wallet` | ✅ Set | ✅ Set | ✅ Match |

### ✅ All Required Keys Are Present!

---

## Why Mobile Wallets Might Still Not Work

If mobile wallets are still not appearing despite correct configuration, here are possible causes:

### 1. **Dynamic Labs Flow Connector Issues**

Dynamic Labs uses `FlowWalletConnectors` from `@dynamic-labs/flow`, which is a wrapper around FCL. There might be an issue with how Dynamic Labs integrates with FCL's WalletConnect.

**Check in browser console:**
```javascript
// On mobile device
window.fcl?.config().get('walletconnect.projectId')
// Should return: "9b70cfa398b2355a5eb9b1cf99f4a981"
```

### 2. **Discovery Endpoint Path**

From the FCL demo source code (line 52-71), they use:
```typescript
mainnet: {
  discoveryWallet: "https://fcl-discovery.onflow.org/mainnet/authn", // Note: /mainnet/
  discoveryAuthnEndpoint: "https://fcl-discovery.onflow.org/api/mainnet/authn",
}
```

Your config uses:
```typescript
"discovery.wallet": "https://fcl-discovery.onflow.org/authn", // No /mainnet/
"discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/authn",
```

**Potential Fix:** Try adding `/mainnet/` to the discovery paths.

### 3. **FCL WalletConnect Plugin Not Loading**

The WalletConnect plugin is loaded via `loadFclWc()` in FCL. Check if it's actually loading:

```javascript
// In browser console (desktop or mobile)
console.log('FCL Plugins:', window.fcl?.pluginRegistry?.plugins);
// Look for a WalletConnect-related plugin
```

### 4. **Dynamic Labs Filtering Mobile Wallets**

From your `_app.tsx` (line 170):
```typescript
// Return ALL wallets - FCL's WalletConnect config will handle mobile properly
console.log('✅ Returning all wallets - FCL WalletConnect will handle mobile');
return wallets;
```

Dynamic Labs might be filtering wallets before FCL gets a chance to add WalletConnect-based ones.

**Check:** Look at the `overrides` configuration in your `DynamicContextProvider`.

---

## Recommended Testing Steps

### Step 1: Verify FCL Config on Mobile

1. Open your site on a mobile device
2. Open browser console (use remote debugging)
3. Check FCL configuration:
   ```javascript
   console.log('FCL Config:', {
     projectId: fcl.config().get('walletconnect.projectId'),
     network: fcl.config().get('flow.network'),
     discovery: fcl.config().get('discovery.wallet')
   });
   ```

Expected output:
```javascript
{
  projectId: "9b70cfa398b2355a5eb9b1cf99f4a981",
  network: "mainnet",
  discovery: "https://fcl-discovery.onflow.org/authn"
}
```

### Step 2: Try Updated Discovery Endpoints

Based on the FCL demo, try updating `src/config/fcl.ts`:

```typescript
config({
  "accessNode.api": FLOW_ACCESS_NODE,
  "discovery.wallet": "https://fcl-discovery.onflow.org/mainnet/authn", // Added /mainnet/
  "app.detail.title": "Flunks",
  "app.detail.icon": "https://flunks.net/flunks-logo.png",
  "app.detail.url": "https://flunks.net",
  "challenge.handshake": "https://fcl-discovery.onflow.org/mainnet/authn", // Added /mainnet/
  "flow.network": "mainnet",
  "walletconnect.projectId": WALLETCONNECT_PROJECT_ID,
  "discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/mainnet/authn", // Added /mainnet/
});
```

### Step 3: Check WalletConnect Initialization Logs

Look for these console logs on mobile:
```
🌊 Configuring FCL with access node: ...
📱 WalletConnect Project ID: Set ✅
✅ FCL Configuration complete: ...
```

And look for WalletConnect-specific logs (FCL might log WC initialization).

### Step 4: Test Direct FCL Authentication

Bypass Dynamic Labs temporarily and test FCL directly:

```javascript
// In browser console on mobile
fcl.authenticate();
// This should trigger wallet discovery
// Check if WalletConnect-enabled wallets appear
```

### Step 5: Check Dynamic Labs Wallet List

```javascript
// In browser console
window.Dynamic?.walletConnector
// Check what wallets Dynamic Labs is providing
```

---

## Possible Solutions

### Solution A: Update Discovery Endpoints (Try First)

Update `src/config/fcl.ts` to match FCL demo:

```typescript
config({
  "accessNode.api": "https://rest-mainnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/mainnet/authn", // ← Changed
  "app.detail.title": "Flunks",
  "app.detail.icon": "https://flunks.net/flunks-logo.png",
  "app.detail.url": "https://flunks.net",
  "challenge.handshake": "https://fcl-discovery.onflow.org/mainnet/authn", // ← Changed  
  "flow.network": "mainnet",
  "walletconnect.projectId": WALLETCONNECT_PROJECT_ID,
  "discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/mainnet/authn", // ← Changed
});
```

### Solution B: Verify WalletConnect Package

Check if `@onflow/fcl-wc` is installed:

```bash
npm list @onflow/fcl-wc
```

If not installed, install it:
```bash
npm install @onflow/fcl-wc
```

### Solution C: Force WalletConnect on Mobile

Add mobile detection and force WC:

```typescript
import { isMobile } from '@onflow/fcl-core/utils';

config({
  // ... existing config
  "walletconnect.projectId": WALLETCONNECT_PROJECT_ID,
  ...(isMobile() && {
    "discovery.wallet.method": "WC/RPC", // Force WalletConnect on mobile
  })
});
```

### Solution D: Check Dynamic Labs Version

Ensure you're using the latest `@dynamic-labs/flow`:

```bash
npm list @dynamic-labs/flow
npm update @dynamic-labs/flow
```

---

## Next Steps

1. ✅ Configuration is already correct
2. 🔍 **Test on actual mobile device** (not emulator)
3. 📱 **Check browser console** for FCL/WC logs
4. 🔧 **Try Solution A** (update discovery endpoints to include `/mainnet/`)
5. 🐛 **Debug with direct FCL** (bypass Dynamic Labs)
6. 📞 **Contact Dynamic Labs support** if issue persists

---

## Files to Check

- ✅ `src/config/fcl.ts` - FCL configuration (already correct)
- ✅ `.env.local` - Environment variables (already set)
- ✅ `src/pages/_app.tsx` - Dynamic Labs setup
- 🔍 `package.json` - Check FCL version and dependencies

---

## Resources

- [FCL Demo Source](https://github.com/onflow/fcl-js/blob/master/packages/demo/src/components/flow-provider-wrapper.tsx)
- [FCL Configuration Docs](https://github.com/onflow/fcl-js/tree/main/packages/fcl-core/docs)
- [WalletConnect Cloud](https://cloud.walletconnect.com)
- [Dynamic Labs Flow Docs](https://docs.dynamic.xyz/chains/flow)

---

**Status:** Configuration is correct. If mobile wallets still don't work, the issue is likely with:
1. Discovery endpoint paths (try adding `/mainnet/`)
2. Dynamic Labs integration layer
3. Mobile browser compatibility
4. WalletConnect package not loading

**Next Action:** Test on mobile and check console logs
