/**
 * Semester Zero Allowlist Management Script
 * 
 * This script helps you manage the allowlist for Semester Zero collections
 * Usage examples:
 * 
 * 1. Add single wallet:
 *    node add-to-allowlist.js 0x1234567890abcdef "Early access member"
 * 
 * 2. Add multiple wallets from file:
 *    Create wallets.txt with one address per line, then:
 *    node add-to-allowlist.js --file wallets.txt "Batch addition"
 * 
 * 3. Check if wallet is allowed:
 *    node add-to-allowlist.js --check 0x1234567890abcdef
 */

const fs = require('fs');

// Configuration
const API_BASE = process.env.NEXT_PUBLIC_VERCEL_URL 
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
  : 'http://localhost:3001';

const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || 'your-admin-key-here';

async function addWalletsToAllowlist(wallets, reason = 'Manual addition') {
  try {
    console.log(`🔄 Adding ${wallets.length} wallets to allowlist...`);
    
    const response = await fetch(`${API_BASE}/api/semester-zero-allowlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallets,
        admin_key: ADMIN_KEY,
        added_by: 'admin-script',
        reason
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log(`✅ Successfully added ${wallets.length} wallets`);
      console.log(`📊 Result:`, data.message);
    } else {
      console.error(`❌ Failed to add wallets:`, data.error);
    }
  } catch (error) {
    console.error(`💥 Error:`, error.message);
  }
}

async function checkWalletAllowlist(walletAddress) {
  try {
    console.log(`🔍 Checking allowlist status for ${walletAddress}...`);
    
    const response = await fetch(`${API_BASE}/api/semester-zero-allowlist?wallet_address=${walletAddress}`);
    const data = await response.json();

    if (data.success) {
      const status = data.data?.allowed ? '✅ ALLOWED' : '❌ NOT ALLOWED';
      console.log(`Status: ${status}`);
    } else {
      console.error(`❌ Error checking status:`, data.error);
    }
  } catch (error) {
    console.error(`💥 Error:`, error.message);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎓 Semester Zero Allowlist Manager

Usage:
  node add-to-allowlist.js <wallet-address> [reason]
  node add-to-allowlist.js --file <file-path> [reason]
  node add-to-allowlist.js --check <wallet-address>

Examples:
  node add-to-allowlist.js 0x1234567890abcdef "Early access"
  node add-to-allowlist.js --file wallets.txt "Batch from Discord"
  node add-to-allowlist.js --check 0x1234567890abcdef

Environment Variables:
  ADMIN_SECRET_KEY - Your admin secret key
  NEXT_PUBLIC_VERCEL_URL - Your app URL (defaults to localhost:3001)
    `);
    return;
  }

  if (args[0] === '--check') {
    if (args.length < 2) {
      console.error('❌ Wallet address required for --check');
      return;
    }
    await checkWalletAllowlist(args[1]);
    return;
  }

  if (args[0] === '--file') {
    if (args.length < 2) {
      console.error('❌ File path required for --file');
      return;
    }

    const filePath = args[1];
    const reason = args[2] || 'Batch file addition';

    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const wallets = fileContent
      .split('\\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .filter(line => line.startsWith('0x') && line.length === 18);

    if (wallets.length === 0) {
      console.error('❌ No valid wallet addresses found in file');
      return;
    }

    console.log(`📁 Found ${wallets.length} valid wallet addresses in ${filePath}`);
    await addWalletsToAllowlist(wallets, reason);
    return;
  }

  // Single wallet addition
  const walletAddress = args[0];
  const reason = args[1] || 'Manual admin addition';

  // Basic validation
  if (!walletAddress.startsWith('0x') || walletAddress.length !== 18) {
    console.error('❌ Invalid Flow wallet address format');
    return;
  }

  await addWalletsToAllowlist([walletAddress], reason);
}

// Check if required environment variables are set
if (!ADMIN_KEY || ADMIN_KEY === 'your-admin-key-here') {
  console.warn('⚠️  ADMIN_SECRET_KEY not properly configured');
  console.warn('   Set it in your .env.local file or as an environment variable');
}

main().catch(console.error);