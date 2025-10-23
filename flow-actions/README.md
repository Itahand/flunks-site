# Flunks GumDrop - Flow Actions

This directory contains Flow Actions for interacting with the FlunksGumDrop smart contract. Flow Actions provide user-friendly interfaces for blockchain interactions.

## Available Actions

### 🎃 User Actions

#### 1. Claim GumDrop (`claim-gumdrop.json`)
Allows Flunk holders to claim their GUM reward during active drop events.
- **Type**: Transaction
- **Requirements**: Active drop, hasn't claimed yet
- **Result**: Records claim on-chain, triggers GUM credit via API

#### 2. Check GumDrop Status (`check-gumdrop-status.json`)
View current event status, remaining time, and reward amount.
- **Type**: Script (read-only)
- **Returns**: Event info including isActive, timeRemaining, gumPerFlunk

#### 3. Check My Claim Status (`check-claim-status.json`)
Check if you're eligible to claim and whether you've already claimed.
- **Type**: Script (read-only)
- **Input**: Your wallet address (auto-filled)
- **Returns**: Eligibility status and claim history

### ⚙️ Admin Actions

#### 4. Start GumDrop Event (`admin-start-gumdrop.json`)
Launch a new reward event with custom parameters.
- **Type**: Transaction
- **Requirements**: Contract owner only
- **Parameters**:
  - Start time (Unix timestamp)
  - End time (Unix timestamp)
  - GUM amount per claim

#### 5. End GumDrop Event (`admin-end-gumdrop.json`)
Manually deactivate the current event.
- **Type**: Transaction
- **Requirements**: Contract owner only
- **Result**: Stops all claims immediately

## Setup Instructions

### 1. Update Contract Address
After deploying FlunksGumDrop to mainnet, replace `0xFLUNKS_CONTRACT_ADDRESS` in each JSON file with your actual contract address.

```bash
# Example: If your contract is at 0x1234567890abcdef
find flow-actions -name "*.json" -exec sed -i '' 's/0xFLUNKS_CONTRACT_ADDRESS/0x1234567890abcdef/g' {} +
```

### 2. Host Flow Actions
Flow Actions can be:
- **Embedded** in your website
- **Shared** via direct links
- **Listed** in Flow's action directory

Example hosting:
```
https://flunks.net/.well-known/flow-actions/claim-gumdrop.json
https://flunks.net/.well-known/flow-actions/check-gumdrop-status.json
```

### 3. Register with Flow
Submit your actions to Flow's action registry:
```bash
# Using Flow CLI
flow actions register ./flow-actions/claim-gumdrop.json --network mainnet
```

## Integration Examples

### Embed in Your Website
```html
<script src="https://cdn.flow.com/flow-actions.js"></script>
<button id="claim-btn">Claim GumDrop</button>

<script>
  document.getElementById('claim-btn').addEventListener('click', () => {
    FlowActions.execute('/flow-actions/claim-gumdrop.json');
  });
</script>
```

### Direct Link
Share a link that opens the action:
```
flow://action?url=https://flunks.net/flow-actions/claim-gumdrop.json
```

### QR Code
Generate QR codes that open Flow Actions in mobile wallets for easy claiming.

## Testing

### Local Testing
```bash
# Install Flow Actions CLI
npm install -g @onflow/flow-actions-cli

# Validate actions
flow-actions validate ./flow-actions/claim-gumdrop.json

# Test execution (testnet)
flow-actions test ./flow-actions/claim-gumdrop.json --network testnet
```

### Admin Testing
Before going live, test admin functions:

1. Deploy contract to testnet
2. Update testnet addresses in action files
3. Run `admin-start-gumdrop.json` to start test event
4. Run `claim-gumdrop.json` to test user claim
5. Verify on testnet block explorer

## Timestamp Helpers

### Generate Unix Timestamps
```javascript
// Current time
const now = Math.floor(Date.now() / 1000);

// 72 hours from now
const in72Hours = now + (72 * 60 * 60);

// Format for Cadence UFix64
console.log(`${now}.0`); // e.g., "1729713600.0"
console.log(`${in72Hours}.0`); // e.g., "1729972800.0"
```

### Using Date
```javascript
// Halloween 2025: Oct 31, 2025, 12:00 PM UTC
const start = new Date('2025-10-31T12:00:00Z').getTime() / 1000;
const end = new Date('2025-11-03T12:00:00Z').getTime() / 1000; // 72 hours

console.log(`Start: ${start}.0`);
console.log(`End: ${end}.0`);
```

## Benefits of Flow Actions

✅ **User-Friendly**: No need for users to write Cadence code  
✅ **Mobile Compatible**: Works in mobile wallets like Dapper and Lilico  
✅ **Standardized**: Consistent UX across different dApps  
✅ **Shareable**: Send direct links or QR codes to users  
✅ **Discoverable**: Listed in Flow's action marketplace  

## Security Notes

- Admin actions check for owner authorization on-chain
- User actions validate eligibility before executing
- All transactions require wallet approval
- Scripts are read-only and don't modify state

## Customization

Feel free to modify:
- **Icons**: Change emoji or add image URLs
- **Messages**: Customize confirmation text
- **Display Format**: Adjust how results are shown
- **Arguments**: Add validation or helper text

## Support

For issues or questions:
- Flow Actions Docs: https://developers.flow.com/blockchain-development-tutorials/forte/flow-actions
- Flunks Discord: [your discord link]
- GitHub Issues: [your repo link]

---

**Ready to launch?** Deploy the contract, update addresses, and share your Flow Actions! 🚀
