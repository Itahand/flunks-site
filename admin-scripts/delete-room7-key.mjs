// Script to delete Room 7 key for a specific wallet address
// Usage: node delete-room7-key.mjs <wallet-address>

const walletAddress = process.argv[2];

if (!walletAddress) {
  console.error('❌ Error: Please provide a wallet address');
  console.error('Usage: node delete-room7-key.mjs <wallet-address>');
  process.exit(1);
}

const apiUrl = process.env.API_URL || 'http://localhost:3000';

console.log(`🗑️ Deleting Room 7 key for wallet: ${walletAddress}`);
console.log(`📍 API URL: ${apiUrl}`);

try {
  const response = await fetch(`${apiUrl}/api/delete-room7-key`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ walletAddress }),
  });

  const data = await response.json();

  if (response.ok && data.success) {
    console.log('✅ Success:', data.message);
  } else {
    console.error('❌ Error:', data.error || 'Failed to delete key');
    if (data.details) {
      console.error('Details:', data.details);
    }
  }
} catch (error) {
  console.error('💥 Unexpected error:', error.message);
}
