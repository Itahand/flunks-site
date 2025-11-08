import * as fcl from '@onflow/fcl';

// Configure FCL for mainnet
fcl.config()
  .put('accessNode.api', 'https://rest-mainnet.onflow.org')
  .put('flow.network', 'mainnet');

const checkScript = `
import SemesterZero from 0xce9dd43888d99574

access(all) fun main(): {String: UInt64} {
    return {
        "totalChapter5NFTs": SemesterZero.totalChapter5NFTs,
        "totalChapter5Completions": SemesterZero.totalChapter5Completions
    }
}
`;

async function checkContractState() {
  console.log('🔍 Checking SemesterZero contract state...\n');
  
  try {
    const result = await fcl.query({
      cadence: checkScript
    });
    
    console.log('═══════════════════════════════════════════════════════\n');
    console.log(`Total Chapter 5 NFTs minted: ${result.totalChapter5NFTs}`);
    console.log(`Total Chapter 5 completions recorded: ${result.totalChapter5Completions}`);
    console.log('\n═══════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Error checking contract state:', error);
  }
  
  process.exit(0);
}

checkContractState();
