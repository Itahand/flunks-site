# Mobile Wallet Fix - WalletConnect Project ID Configuration

**Date:** October 24, 2025  
**Issue:** Mobile wallets not showing up in Dynamic Labs SDK  
**Solution:** Add `walletconnect.projectId` to FCL configuration

---

## Problem Statement

Mobile wallets (Flow Wallet, Dapper, etc.) were not appearing as connection options on mobile devices, even though desktop wallet connections worked perfectly.

## Root Cause Analysis

### Key Discovery from FCL Demo

After reviewing the official FCL React SDK demo at:
- https://github.com/onflow/fcl-js/blob/master/packages/demo/src/components/flow-provider-wrapper.tsx
- https://react.flow.com/

The **critical missing configuration** was identified:

```tsx
// From FCL Demo (line 129-158)
<FlowProvider
  config={{
    ...flowConfig[currentNetwork],
    appDetailTitle: "Demo App",
    appDetailUrl: window.location.origin,
    appDetailIcon: "https://avatars.githubusercontent.com/u/62387156?v=4",
    appDetailDescription: "Your app description",
    computeLimit: 1000,
    walletconnectProjectId: "9b70cfa398b2355a5eb9b1cf99f4a981", // ✅ THIS WAS MISSING
    flowNetwork: currentNetwork,
  }}
>
```

### Why WalletConnect Project ID is Required

From the FCL source code analysis:

1. **Desktop wallet connections** use browser extensions or iframes (direct connection)
2. **Mobile wallet connections** use WalletConnect protocol (requires project ID)

Without `walletconnect.projectId`, the WalletConnect initialization fails silently, and mobile wallets never appear.

### How FCL Handles WalletConnect

From `packages/fcl/src/utils/walletconnect/loader.ts`:

```typescript
export function initFclWcLoader() {
  config.subscribe(async (fullConfig: any) => {
    const wcConfig = {
      walletConnectProjectId: fullConfig["walletconnect.projectId"], // ← Looks for this key
      walletConnectDisableNotifications: fullConfig["walletconnect.disableNotifications"],
      appDetailTitle: fullConfig["app.detail.title"],
      appDetailIcon: fullConfig["app.detail.icon"],
      appDetailDescription: fullConfig["app.detail.description"],
      appDetailUrl: fullConfig["app.detail.url"],
    }
    loadFclWc(wcConfig)
  })
}
```

---

## The Fix

### Files Changed

#### 1. `src/utils/flowConfig.ts`

**Before:**
```typescript
import * as fcl from "@onflow/fcl";

export const configureFlow = () => {
  fcl.config({
    "accessNode.api": "https://rest-mainnet.onflow.org",
    "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
    "0xFlowToken": "0x1654653399040a61",
  });
};

configureFlow();
export { fcl };
```

**After:**
```typescript
import * as fcl from "@onflow/fcl";

export const configureFlow = () => {
  fcl.config({
    "accessNode.api": "https://rest-mainnet.onflow.org",
    "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
    "0xFlowToken": "0x1654653399040a61",
    "app.detail.title": "Flunks",
    "app.detail.icon": "https://flunks.net/flunks-logo.png",
    "app.detail.url": "https://flunks.net",
    "flow.network": "mainnet", // Required for mobile detection
    "walletconnect.projectId": process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "9b70cfa398b2355a5eb9b1cf99f4a981",
  });

  console.log('🌊 FCL configured with WalletConnect support for mobile wallets');
};

configureFlow();
export { fcl };
```

#### 2. `.env.local`

**Added:**
```bash
# WalletConnect Configuration (required for mobile wallet support)
# Get your own project ID at: https://cloud.walletconnect.com/sign-in
# For testing, you can use the FCL demo project ID below
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=9b70cfa398b2355a5eb9b1cf99f4a981
```

---

## Configuration Keys Explained

### Essential Keys for Mobile Wallet Support

| FCL Config Key | Purpose | Required For Mobile? |
|----------------|---------|---------------------|
| `walletconnect.projectId` | WalletConnect Cloud project identifier | **YES - Critical** |
| `app.detail.title` | App name shown in wallet | Recommended |
| `app.detail.icon` | App icon shown in wallet | Recommended |
| `app.detail.url` | App URL for WalletConnect metadata | Recommended |
| `flow.network` | Network identifier (mainnet/testnet) | **YES - Required** |
| `discovery.wallet` | Wallet discovery endpoint | YES |
| `accessNode.api` | Flow access node URL | YES |

### From FCL Documentation

From `packages/fcl/docs/extra.md`:

| Config Key | Example | Description |
|------------|---------|-------------|
| `walletconnect.projectId` | `YOUR_PROJECT_ID` | Your app's WalletConnect project ID. See [WalletConnect Cloud](https://cloud.walletconnect.com/sign-in) |
| `flow.network` | `mainnet` | Used for stored interactions and provides FCLCryptoContract address. Values: `local`, `testnet`, `mainnet` |
| `walletconnect.disableNotifications` | `false` | Optional flag to disable pending WalletConnect request notifications |

---

## How Mobile Wallets Work

### Desktop Flow (Works Without WalletConnect)
```
User clicks "Connect Wallet"
  ↓
Dynamic Labs shows wallet list
  ↓
User selects wallet (e.g., Lilico Chrome Extension)
  ↓
Browser extension opens (direct communication)
  ↓
User approves in extension
  ↓
✅ Connected via extension API
```

### Mobile Flow (Requires WalletConnect)
```
User clicks "Connect Wallet" on mobile browser
  ↓
Dynamic Labs shows wallet list
  ↓
User selects wallet (e.g., Flow Wallet mobile app)
  ↓
🔗 WalletConnect protocol initiates
  ↓
Deep link opens mobile wallet app
  ↓
User approves in wallet app
  ↓
🔗 WalletConnect relays approval back to browser
  ↓
✅ Connected via WalletConnect bridge
```

**Without `walletconnect.projectId`:** The "🔗 WalletConnect protocol initiates" step fails silently.

---

## Getting Your Own WalletConnect Project ID

### Option 1: Use FCL Demo ID (Testing Only)
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=9b70cfa398b2355a5eb9b1cf99f4a981
```

⚠️ **Warning:** This is the FCL demo project ID. It's fine for testing but should NOT be used in production.

### Option 2: Create Your Own Project ID (Production)

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/sign-in)
2. Sign up / Log in with GitHub or email
3. Click "Create New Project"
4. Fill in project details:
   - **Name:** Flunks
   - **Homepage URL:** https://flunks.net
   - **Icon:** Upload your app icon
5. Copy the **Project ID** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
6. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
   ```

---

## Why This Wasn't Obvious

1. **Dynamic Labs Abstraction**
   - Dynamic Labs wraps FCL configuration
   - FCL's `walletconnect.projectId` requirement isn't exposed in Dynamic's docs
   - You have to configure FCL directly, separate from Dynamic

2. **Desktop Works Without It**
   - Desktop browser extensions work via direct API calls
   - Mobile requires WalletConnect bridge protocol
   - Only mobile users see the issue

3. **Silent Failure**
   - No console errors about missing WalletConnect config
   - Wallets just don't appear on mobile
   - No warning in FCL or Dynamic Labs

4. **Different SDK**
   - FCL's official demo uses `@onflow/react-sdk` with `<FlowProvider>`
   - You're using Dynamic Labs SDK with `<DynamicContextProvider>`
   - The integration pattern is different

---

## Testing the Fix

### On Desktop (Should Still Work)
1. Open https://flunks.net on Chrome/Firefox
2. Click "Connect Wallet"
3. Select "Flow Wallet" or "Lilico" extension
4. Extension popup appears
5. Approve connection
6. ✅ Should connect successfully

### On Mobile (Should Now Work)
1. Open https://flunks.net on mobile Safari/Chrome
2. Click "Connect Wallet"
3. Select "Flow Wallet" mobile
4. Deep link opens Flow Wallet app
5. Approve connection in app
6. Return to browser
7. ✅ Should be connected

### Console Output to Look For

After the fix, you should see:
```
🌊 FCL configured with WalletConnect support for mobile wallets
```

And in the FCL config (check via `console.log(fcl.config)`):
```javascript
{
  "accessNode.api": "https://rest-mainnet.onflow.org",
  "walletconnect.projectId": "9b70cfa398b2355a5eb9b1cf99f4a981", // ✅ Should be present
  "flow.network": "mainnet",
  // ... other config
}
```

---

## Architecture: Dynamic Labs + FCL + WalletConnect

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Next.js App                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Dynamic Labs SDK (@dynamic-labs/sdk-react-core)     │   │
│  │  - Manages UI for wallet selection                   │   │
│  │  - Uses FlowWalletConnectors internally              │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                         │
│                     │ Uses                                    │
│                     ▼                                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  FCL (@onflow/fcl)                                   │   │
│  │  - Core Flow blockchain interaction library          │   │
│  │  - Handles authentication & signing                  │   │
│  │  - Configured via fcl.config({...})                  │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                         │
│                     │ Loads (when projectId is set)           │
│                     ▼                                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  FCL WalletConnect Plugin (@onflow/fcl-wc)          │   │
│  │  - Loads ONLY if walletconnect.projectId is set     │   │
│  │  - Initializes WalletConnect UniversalProvider       │   │
│  │  - Fetches mobile wallet list from WC API           │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                         │
└─────────────────────┼─────────────────────────────────────────┘
                      │
                      │ Uses
                      ▼
        ┌────────────────────────────┐
        │  WalletConnect Protocol     │
        │  - Relay server bridge      │
        │  - Deep linking to apps     │
        │  - QR code pairing          │
        └─────────────┬──────────────┘
                      │
                      │ Connects to
                      ▼
        ┌────────────────────────────┐
        │  Mobile Wallet Apps         │
        │  - Flow Wallet (iOS/Android)│
        │  - Dapper                   │
        │  - Blocto                   │
        └────────────────────────────┘
```

### The Fix in Context

**Before:** The FCL WalletConnect Plugin never loaded because `walletconnect.projectId` wasn't set.

**After:** The plugin loads, initializes WalletConnect, and mobile wallets appear in the Dynamic Labs UI.

---

## Comparison: Your Setup vs FCL Demo

| Feature | FCL Demo | Your Setup (Before) | Your Setup (After) |
|---------|----------|---------------------|-------------------|
| **SDK** | `@onflow/react-sdk` | Dynamic Labs | Dynamic Labs |
| **Provider Component** | `<FlowProvider>` | `<DynamicContextProvider>` | `<DynamicContextProvider>` |
| **FCL Config Method** | Via FlowProvider props | Direct `fcl.config()` | Direct `fcl.config()` |
| **WalletConnect ID** | ✅ In provider config | ❌ Missing | ✅ In fcl.config() |
| **flow.network** | ✅ Set | ❌ Not set | ✅ Set to "mainnet" |
| **app.detail.*** | ✅ Set | ❌ Not set | ✅ All set |
| **Desktop Support** | ✅ Works | ✅ Works | ✅ Works |
| **Mobile Support** | ✅ Works | ❌ Broken | ✅ Should work |

---

## Additional Debugging

### If Mobile Wallets Still Don't Appear

#### 1. Check FCL Config in Browser Console
```javascript
// On mobile device browser console (or use remote debugging)
fcl.config().get('walletconnect.projectId')
// Should return: "9b70cfa398b2355a5eb9b1cf99f4a981" (or your custom ID)
```

#### 2. Check Environment Variable Loading
```javascript
// In your app
console.log('WC Project ID:', process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID);
// Should NOT be undefined
```

#### 3. Verify WalletConnect Initialization
```javascript
// Look for these logs in console
"🌊 FCL configured with WalletConnect support for mobile wallets"
// And FCL's internal WC logs (if enabled)
```

#### 4. Check Network Connection
- Mobile wallet apps need internet connection
- WalletConnect relay needs to be accessible
- Check if you're behind a firewall/VPN that blocks WalletConnect

#### 5. Test with Different Mobile Wallets
- **Flow Wallet** (Official, best compatibility)
- **Dapper** (Popular, good mobile support)
- **Blocto** (Cross-chain, reliable)

---

## Known Limitations

### Dynamic Labs + FCL Integration

1. **Two Separate Configurations**
   - Dynamic Labs has its own config (`DynamicContextProvider settings`)
   - FCL has its own config (`fcl.config()`)
   - WalletConnect setup must be in FCL config, not Dynamic config

2. **FlowWalletConnectors Abstraction**
   - `@dynamic-labs/flow` provides `FlowWalletConnectors`
   - This wraps FCL but doesn't expose all FCL config options
   - You must configure FCL directly in addition to using FlowWalletConnectors

3. **Mobile Detection**
   - FCL uses `isMobile()` helper from `@onflow/fcl-core/src/utils`
   - Checks user agent for Android/iOS
   - Automatically shows appropriate wallet options

---

## References

### Official Documentation
- [FCL Configuration Docs](https://github.com/onflow/fcl-js/tree/main/packages/fcl-core/docs)
- [FCL WalletConnect Loader Source](https://github.com/onflow/fcl-js/tree/main/packages/fcl/src/utils/walletconnect/loader.ts)
- [WalletConnect Cloud](https://cloud.walletconnect.com)

### FCL Demo Implementation
- [Flow Provider Wrapper](https://github.com/onflow/fcl-js/blob/master/packages/demo/src/components/flow-provider-wrapper.tsx)
- [React SDK Docs](https://react.flow.com/)
- [FCL React SDK Source](https://github.com/onflow/fcl-js/tree/main/packages/react-sdk)

### Dynamic Labs
- [Dynamic Labs + Flow Docs](https://docs.dynamic.xyz/chains/flow)
- [Flow Wallet Connectors](https://www.npmjs.com/package/@dynamic-labs/flow)

---

## Next Steps

1. ✅ **Configuration Updated**
   - `src/utils/flowConfig.ts` now includes WalletConnect config
   - `.env.local` includes `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

2. 🚀 **Deploy & Test**
   - Restart dev server to load new env vars
   - Test on actual mobile device (not emulator)
   - Check console logs for WalletConnect initialization

3. 📱 **Production Preparation**
   - Get your own WalletConnect Project ID from WalletConnect Cloud
   - Update production environment variables
   - Test with multiple mobile wallets

4. 📊 **Monitor**
   - Track mobile wallet connection success rate
   - Check for any WalletConnect-related errors in production
   - Consider adding analytics for mobile vs desktop wallet usage

---

## Status

- ✅ Root cause identified
- ✅ Configuration updated
- ✅ Environment variables set
- 📱 Ready for mobile testing
- 🎯 Using FCL demo project ID for initial testing
- ⏳ Pending production WalletConnect project ID

---

**Last Updated:** October 24, 2025  
**Next Action:** Test on mobile device and verify wallet connections work
