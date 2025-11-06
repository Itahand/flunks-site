# Clear FCL Cache Instructions

The Flow Wallet was trying to switch to testnet because of cached configuration. Here's what was fixed:

## Changes Made:
1. ✅ Removed duplicate FCL config from UnifiedWalletContext
2. ✅ Ensured `flow.network` is set FIRST in fcl.ts config (order matters!)
3. ✅ Removed `challenge.handshake` (not needed for mainnet)

## To Test:
1. **Clear your browser cache/localStorage:**
   - Open Developer Tools (F12)
   - Go to Application tab → Storage → Local Storage → https://flunks.net
   - Look for keys starting with `fcl:` and delete them all
   - OR just run this in console:
   ```javascript
   Object.keys(localStorage).filter(k => k.startsWith('fcl:')).forEach(k => localStorage.removeItem(k));
   location.reload();
   ```

2. **Restart your dev server:**
   ```bash
   npm run dev
   ```

3. **Try connecting to Flow Wallet again**
   - It should now stay on mainnet and NOT ask to switch networks

## Why This Happened:
- FCL caches configuration in localStorage
- Your UnifiedWalletContext was re-configuring FCL after the initial config
- The order of config keys matters - `flow.network` must come first
- The wallet was reading cached testnet config from previous sessions
