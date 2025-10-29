# Fix Flow Wallet Connection Issue

Your FCL config is **100% correct** (mainnet), but your browser has cached testnet settings.

## Solution: Aggressive Cache Clear

### Step 1: Clear Browser Data
1. **Chrome/Brave**: Open `chrome://settings/clearBrowserData`
2. Select **"All time"** as time range
3. Check these boxes:
   - ✅ Cookies and other site data
   - ✅ Cached images and files
4. Click **"Clear data"**

### Step 2: Reset Flow Wallet Extension
1. Open Chrome extensions: `chrome://extensions/`
2. Find **"Flow Wallet"**
3. Click **"Details"**
4. Scroll down and click **"Clear extension data"** or toggle Off/On
5. Refresh the extension

### Step 3: Hard Refresh
1. Close all localhost:3000 tabs
2. **Restart browser completely** (Cmd+Q, then reopen)
3. Open fresh tab to `localhost:3000`
4. Try connecting wallet

### Alternative: Use Different Browser Profile
1. Create new Chrome profile (top right corner → Add)
2. Install Flow Wallet in new profile
3. Set up wallet
4. Navigate to localhost:3000
5. Connect wallet (should work immediately)

## Why This Happens
FCL discovery service caches wallet preferences in:
- Browser localStorage
- Browser sessionStorage  
- Service worker cache
- Extension storage

Your code is mainnet, but these caches have testnet URLs.
