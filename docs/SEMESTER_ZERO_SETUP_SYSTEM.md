# Semester Zero Collection Setup System

This system provides both manual allowlist management and an accessible user interface for setting up Flunks: Semester Zero Chapter 5 NFT collections.

## 🎯 Features

1. **Allowlist Management** - Control which wallets can setup collections
2. **Multiple Access Points** - Users can setup collections from Paradise Motel OR desktop
3. **Admin Interface** - Web-based allowlist management  
4. **Command Line Tools** - Bulk allowlist operations
5. **Enhanced Error Handling** - Clear feedback for users

## 🚀 Quick Start

### 1. Database Setup

First, run the SQL migration to create the allowlist table:

```sql
-- Run this in your Supabase SQL editor
-- File: sql-migrations/create-semester-zero-allowlist.sql
```

### 2. Environment Configuration

Add to your `.env.local`:
```bash
ADMIN_SECRET_KEY=your-super-secret-admin-key-here
```

### 3. Add Wallets to Allowlist

#### Option A: Command Line (Recommended for bulk operations)
```bash
# Add single wallet
node admin-scripts/manage-semester-zero-allowlist.js 0x1234567890abcdef "Early access member"

# Add from file
node admin-scripts/manage-semester-zero-allowlist.js --file wallets.txt "Discord community"

# Check wallet status  
node admin-scripts/manage-semester-zero-allowlist.js --check 0x1234567890abcdef
```

#### Option B: Admin Web Interface
1. Open your Flunks site
2. Access the admin panel (you'll need to add this to your admin tools)
3. Use the `SemesterZeroAllowlistAdmin` component

## 🎮 User Experience

### Collection Setup Locations

Users can now setup their Semester Zero collections from **two locations**:

1. **🏨 Paradise Motel Lobby** (Original location)
   - Navigate to Semester Zero Map → Paradise Motel → Lobby
   - Click "👁️ Flunks: Semester Zero Collection"

2. **🖥️ Desktop Icon** (New, more accessible)
   - Double-click the "🎓 Semester Zero Setup" icon on desktop
   - Opens dedicated setup window

### Setup Process

1. **Wallet Connection** - User must have a connected Flow wallet
2. **Allowlist Check** - System verifies wallet is on allowlist  
3. **Collection Check** - Prevents duplicate collection creation
4. **Transaction** - Creates Chapter 5 NFT collection on Flow blockchain
5. **Confirmation** - User receives success/error feedback

## 🔧 Technical Details

### API Endpoints

#### `GET /api/semester-zero-allowlist`
- **Public**: Check if specific wallet is allowed
- **Admin**: Get full allowlist (requires admin_key)

```javascript
// Check wallet
GET /api/semester-zero-allowlist?wallet_address=0x1234567890abcdef

// Get full list (admin only)  
GET /api/semester-zero-allowlist?admin_key=your-key
```

#### `POST /api/semester-zero-allowlist` (Admin only)
Add wallets to allowlist:

```javascript
POST /api/semester-zero-allowlist
{
  "wallets": ["0x1234567890abcdef", "0xabcdef1234567890"],
  "admin_key": "your-key",
  "added_by": "admin",
  "reason": "Early access members"
}
```

#### `DELETE /api/semester-zero-allowlist` (Admin only)
Remove wallet from allowlist:

```javascript  
DELETE /api/semester-zero-allowlist
{
  "wallet_address": "0x1234567890abcdef",
  "admin_key": "your-key"
}
```

### Database Schema

```sql
CREATE TABLE semester_zero_allowlist (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  added_by VARCHAR(100) NOT NULL DEFAULT 'admin',
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Components

- **`SemesterZeroSetup`** - User-facing collection setup interface
- **`SemesterZeroAllowlistAdmin`** - Admin interface for allowlist management  
- **Enhanced `ParadiseMotelMain`** - Updated with allowlist checking

## 📱 Error Handling

The system provides specific error messages for common issues:

- ❌ Wallet not connected
- ❌ Wallet not on allowlist
- ❌ Collection already exists
- ❌ Transaction declined by user
- ❌ Network/timeout issues
- ❌ Insufficient balance

## 🔒 Security Features

1. **Admin-only Operations** - Allowlist management requires secret key
2. **Input Validation** - Validates Flow wallet address format  
3. **RLS Policies** - Database-level security on allowlist table
4. **Duplicate Prevention** - Prevents duplicate allowlist entries

## 📊 Monitoring

### Check System Status
```bash
# Verify contract deployment
node -e "const fcl = require('@onflow/fcl'); /* contract check code */"

# Check allowlist API
curl "https://yoursite.com/api/semester-zero-allowlist?wallet_address=0xtest"
```

### Common Operations

```bash
# Add Discord community members
node admin-scripts/manage-semester-zero-allowlist.js --file discord-wallets.txt "Discord community members"

# Add NFT holders  
node admin-scripts/manage-semester-zero-allowlist.js --file nft-holders.txt "Existing NFT holders"

# Add team wallets
node admin-scripts/manage-semester-zero-allowlist.js 0xteamwallet1 "Team member"
```

## 🎉 Benefits

1. **Better UX** - Users don't need to navigate deep into Paradise Motel
2. **Admin Control** - Full control over who can setup collections
3. **Bulk Operations** - Easy to add many wallets at once
4. **Better Errors** - Clear feedback when things go wrong  
5. **Multiple Paths** - Maintains original functionality while adding alternatives

## 🚨 Troubleshooting

### "Transaction not supported" Error
- ✅ **FIXED** - This was caused by missing allowlist checks and poor error handling

### Wallet Not on Allowlist  
- Add wallet using admin script or web interface
- Verify wallet address format (must be 18 characters, start with 0x)

### Collection Already Exists
- This is normal! Users who already have collections will see success message

### Network Issues
- Check FCL configuration points to mainnet
- Verify contract exists at 0x807c3d470888cc48