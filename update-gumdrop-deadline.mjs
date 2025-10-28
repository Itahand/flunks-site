#!/usr/bin/env node
// Update Halloween GumDrop deadline to November 3, 2025 at 12:00 PM Central Time

// November 3, 2025 12:00 PM Central Time (UTC-6)
// = November 3, 2025 6:00 PM UTC
// = Unix timestamp: 1730656800

const newEndTimeUnix = 1730656800; // Nov 3, 2025 18:00:00 UTC
const newEndTimeUFix64 = newEndTimeUnix.toFixed(1); // Cadence UFix64 format

console.log('🎃 Halloween GumDrop Deadline Update\n');
console.log('New End Time:');
console.log('  Date: November 3, 2025');
console.log('  Time: 12:00 PM Central Time (6:00 PM UTC)');
console.log('  Unix: ' + newEndTimeUnix);
console.log('  UFix64: ' + newEndTimeUFix64);
console.log('\n📋 Next Steps:\n');
console.log('1. Open Flow CLI or Flowdiver with contract owner wallet');
console.log('2. Run transaction: cadence/transactions/update-gumdrop-endtime.cdc');
console.log('3. Argument: newEndTime = ' + newEndTimeUFix64);
console.log('\nOR use Flow CLI:');
console.log('\nflow transactions send ./cadence/transactions/update-gumdrop-endtime.cdc \\');
console.log('  ' + newEndTimeUFix64 + ' \\');
console.log('  --network mainnet \\');
console.log('  --signer mainnet-admin\n');
