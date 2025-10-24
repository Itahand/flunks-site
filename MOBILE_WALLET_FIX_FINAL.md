# Mobile Wallet Fix - Final Implementation

**Date:** October 24, 2025  
**Status:** ✅ Updated - Ready for Testing

---

## What Was Changed

Based on the FCL demo at:
- https://github.com/onflow/fcl-js/blob/master/packages/demo/src/components/flow-provider-wrapper.tsx
- https://react.flow.com/

### Updated Discovery Endpoint Paths

Changed the discovery endpoints to match the FCL demo by adding `/mainnet/` to the paths.

#### File: `src/config/fcl.ts`

**Before:**
```typescript
"discovery.wallet": "https://fcl-discovery.onflow.org/authn",
"challenge.handshake": "https://fcl-discovery.onflow.org/authn",
"discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/authn",
```

**After:**
```typescript
"discovery.wallet": "https://fcl-discovery.onflow.org/mainnet/authn", // ← Added /mainnet/
"challenge.handshake": "https://fcl-discovery.onflow.org/mainnet/authn", // ← Added /mainnet/
"discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/mainnet/authn", // ← Added /mainnet/
```

---

## Current Configuration (Complete)

```typescript
import { config } from "@onflow/fcl";

const FLOW_ACCESS_NODE = process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE || "https://rest-mainnet.onflow.org";
const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "9b70cfa398b2355a5eb9b1cf99f4a981";

config({
  "accessNode.api": FLOW_ACCESS_NODE,
  "discovery.wallet": "https://fcl-discovery.onflow.org/mainnet/authn",
  "app.detail.title": "Flunks",
  "app.detail.icon": "https://flunks.net/flunks-logo.png",
  "app.detail.url": "https://flunks.net",
  "challenge.handshake": "https://fcl-discovery.onflow.org/mainnet/authn",
  "flow.network": "mainnet",
  "walletconnect.projectId": WALLETCONNECT_PROJECT_ID,
  "discovery.wallet.method": "POP/RPC",
  "discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/mainnet/authn",
});
```

---

## Why This Should Fix Mobile Wallets

### 1. WalletConnect Project ID ✅
- **Required for mobile wallet connections**
- Enables WalletConnect protocol bridge
- Already configured: `9b70cfa398b2355a5eb9b1cf99f4a981` (FCL demo ID)

### 2. Flow Network ✅
- **Required for mobile wallet detection**
- Set to `"mainnet"`
- Helps FCL determine which wallets to show

### 3. Discovery Endpoints ✅
- **Updated to match FCL demo**
- Now includes `/mainnet/` in paths
- Ensures correct wallet list is fetched

### 4. App Details ✅
- **Shown in wallet approval screens**
- Title, icon, and URL all set
- Provides better UX on mobile

---

## How Mobile Wallet Connection Works

```
Mobile Browser (https://flunks.net)
         ↓
User clicks "Connect Wallet" in Dynamic Labs UI
         ↓
Dynamic Labs → FCL → WalletConnect Discovery
         ↓
FCL fetches wallet list from:
https://fcl-discovery.onflow.org/api/mainnet/authn
         ↓
WalletConnect-enabled wallets appear (Flow Wallet, Dapper, etc.)
         ↓
User selects wallet (e.g., "Flow Wallet")
         ↓
WalletConnect protocol initiates with projectId
         ↓
Deep link opens Flow Wallet mobile app
         ↓
User approves connection in app
         ↓
WalletConnect relays approval back to browser
         ↓
✅ Wallet connected via Dynamic Labs + FCL + WalletConnect
```

---

## Testing Checklist

### ✅ Pre-Deployment Checks

- [x] `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in `.env.local`
- [x] `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in `.env.production`
- [x] FCL config updated with `/mainnet/` endpoints
- [x] All required config keys present

### 🧪 Testing Steps

#### 1. Restart Dev Server
```bash
npm run dev
```

The environment variable needs to be loaded fresh.

#### 2. Check Console Logs (Desktop)
Open https://flunks.net and check console:
```
🌊 Configuring FCL with access node: https://rest-mainnet.onflow.org
📱 WalletConnect Project ID: Set ✅
✅ FCL Configuration complete: { accessNode: ..., network: 'mainnet', walletConnectConfigured: true }
```

#### 3. Test Desktop Wallets (Should Still Work)
- Click "Connect Wallet"
- Select "Lilico" or "Flow Wallet" extension
- Approve connection
- ✅ Should connect successfully

#### 4. Test Mobile Wallets (The Fix)

**On iPhone/Android:**
1. Open https://flunks.net in mobile Safari/Chrome
2. Click "Connect Wallet"
3. **Look for Flow Wallet in the list**
   - Before fix: May not appear
   - After fix: Should appear with WalletConnect support
4. Select "Flow Wallet"
5. Flow Wallet app should open via deep link
6. Approve connection in Flow Wallet app
7. Return to browser
8. ✅ Should be connected

#### 5. Remote Debugging (If Needed)

**iOS Safari:**
1. On Mac: Safari → Develop → [Your iPhone] → [flunks.net]
2. Check console for FCL/WC logs

**Android Chrome:**
1. On Desktop: chrome://inspect
2. Select your device
3. Check console for FCL/WC logs

#### 6. Check FCL Config on Mobile

In mobile browser console:
```javascript
fcl.config().get('walletconnect.projectId')
// Should return: "9b70cfa398b2355a5eb9b1cf99f4a981"

fcl.config().get('flow.network')
// Should return: "mainnet"

fcl.config().get('discovery.wallet')
// Should return: "https://fcl-discovery.onflow.org/mainnet/authn"
```

---

## If Mobile Wallets Still Don't Appear

### Potential Issues

1. **Dynamic Labs Filtering**
   - Check if Dynamic Labs is filtering out mobile wallets before FCL
   - Look at the `overrides` configuration in `DynamicContextProvider`

2. **WalletConnect Package Not Installed**
   ```bash
   npm list @onflow/fcl-wc
   # If not found:
   npm install @onflow/fcl-wc
   ```

3. **FCL Version Compatibility**
   ```bash
   npm list @onflow/fcl
   # Ensure you're on a recent version (1.6.0+)
   ```

4. **Browser Compatibility**
   - Test on different mobile browsers (Safari, Chrome, Brave)
   - Some browsers block deep links

5. **Network Issues**
   - Check if WalletConnect relay is accessible
   - Try on different WiFi/cellular networks

---

## Comparison with FCL Demo

| Feature | FCL Demo | Your Setup (After Fix) | Match? |
|---------|----------|------------------------|--------|
| **Discovery Endpoint** | `/mainnet/authn` | `/mainnet/authn` | ✅ |
| **WalletConnect ID** | `9b70cfa398b2355a5eb9b1cf99f4a981` | `9b70cfa398b2355a5eb9b1cf99f4a981` | ✅ |
| **Flow Network** | `"mainnet"` | `"mainnet"` | ✅ |
| **App Details** | All set | All set | ✅ |
| **SDK** | `@onflow/react-sdk` | Dynamic Labs | ⚠️ Different |

**Note:** The SDK difference (Dynamic Labs vs native FCL SDK) might still cause issues. Dynamic Labs wraps FCL, so there could be integration quirks.

---

## Production Deployment

### Before Deploying

1. **Get Your Own WalletConnect Project ID**
   - Go to https://cloud.walletconnect.com/sign-in
   - Create a new project
   - Copy the project ID
   - Update production environment:
     ```bash
     NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
     ```

2. **Test on Staging First**
   - Deploy to a staging environment
   - Test mobile wallet connections thoroughly
   - Verify no regressions on desktop

3. **Monitor After Deployment**
   - Check analytics for mobile wallet connection success rate
   - Monitor error logs for WalletConnect-related issues
   - Be ready to rollback if issues arise

---

## Alternative: Direct FCL Testing

If Dynamic Labs continues to have issues, you can test FCL directly:

```typescript
// Add a debug button in your app
<button onClick={async () => {
  console.log('Testing direct FCL authentication...');
  await fcl.authenticate();
}}>
  Test FCL Direct
</button>
```

This bypasses Dynamic Labs and tests FCL's wallet connection directly. If this works on mobile but Dynamic Labs doesn't, the issue is with Dynamic Labs' integration.

---

## Documentation Created

1. ✅ `MOBILE_WALLET_WALLETCONNECT_FIX_V2.md` - Comprehensive fix documentation
2. ✅ `MOBILE_WALLET_INVESTIGATION_SUMMARY.md` - Investigation summary
3. ✅ This file - Final implementation summary

---

## Summary

### What Was the Issue?
Mobile wallets require WalletConnect protocol, which needs:
1. `walletconnect.projectId` in FCL config ✅
2. Correct discovery endpoints with `/mainnet/` ✅ (just added)
3. `flow.network` set to "mainnet" ✅

### What Changed?
Updated discovery endpoint paths in `src/config/fcl.ts` to match the FCL demo:
- Added `/mainnet/` to `discovery.wallet`
- Added `/mainnet/` to `challenge.handshake`
- Added `/mainnet/` to `discovery.authn.endpoint`

### What's Next?
1. Restart dev server
2. Test on actual mobile device
3. Verify mobile wallets appear in connection list
4. Monitor console logs for any errors

---

**Status:** ✅ Configuration complete and aligned with FCL demo  
**Next Action:** Test on mobile device  
**Expected Result:** Mobile wallets (Flow Wallet, Dapper, etc.) should now appear and connect successfully
