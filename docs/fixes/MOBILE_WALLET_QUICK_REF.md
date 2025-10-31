# Mobile Wallet Fix - Quick Reference

## ✅ What Was Done

Updated `src/config/fcl.ts` to match FCL demo configuration:

```typescript
// Added /mainnet/ to discovery endpoints
"discovery.wallet": "https://fcl-discovery.onflow.org/mainnet/authn"
"challenge.handshake": "https://fcl-discovery.onflow.org/mainnet/authn"
"discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/mainnet/authn"
```

## 🧪 Quick Test

1. **Restart dev server:**
   ```bash
   npm run dev
   ```

2. **Test on mobile device:**
   - Open https://flunks.net on mobile Safari/Chrome
   - Click "Connect Wallet"
   - Look for Flow Wallet, Dapper, or other mobile wallets
   - Select one and test connection

3. **Check console logs:**
   ```
   🌊 Configuring FCL with access node: ...
   📱 WalletConnect Project ID: Set ✅
   ✅ FCL Configuration complete: ...
   ```

## 🐛 Debug Commands

**In browser console (mobile):**
```javascript
// Check WalletConnect ID
fcl.config().get('walletconnect.projectId')
// Should return: "9b70cfa398b2355a5eb9b1cf99f4a981"

// Check network
fcl.config().get('flow.network')
// Should return: "mainnet"

// Check discovery endpoint
fcl.config().get('discovery.wallet')
// Should return: "https://fcl-discovery.onflow.org/mainnet/authn"
```

## 📚 Related Docs

- `MOBILE_WALLET_FIX_FINAL.md` - Complete implementation details
- `MOBILE_WALLET_WALLETCONNECT_FIX_V2.md` - Comprehensive explanation
- `MOBILE_WALLET_INVESTIGATION_SUMMARY.md` - Investigation notes

## 🔗 References

- [FCL Demo](https://github.com/onflow/fcl-js/blob/master/packages/demo/src/components/flow-provider-wrapper.tsx)
- [React Flow Docs](https://react.flow.com/)
- [WalletConnect Cloud](https://cloud.walletconnect.com/)

## ⏭️ Next Steps

1. Test on mobile ✓
2. Verify wallet connections work
3. Get your own WalletConnect Project ID for production
4. Deploy and monitor
