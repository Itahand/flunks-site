import * as fcl from "@onflow/fcl";

// Configure FCL for mainnet
fcl.config({
  "accessNode.api": "https://rest-mainnet.onflow.org",
});

async function fetchContract(address, contractName) {
  try {
    console.log(`\n🔍 Fetching ${contractName} from ${address}...\n`);
    
    const contract = await fcl.send([
      fcl.getAccount(address)
    ]).then(fcl.decode);
    
    if (contract.contracts && contract.contracts[contractName]) {
      const contractCode = contract.contracts[contractName];
      console.log(`✅ Found ${contractName}!\n`);
      console.log("=" .repeat(80));
      console.log(contractCode);
      console.log("=" .repeat(80));
      return contractCode;
    } else {
      console.log(`❌ Contract ${contractName} not found at ${address}`);
      console.log("\nAvailable contracts:");
      console.log(Object.keys(contract.contracts || {}));
    }
  } catch (error) {
    console.error("Error fetching contract:", error);
  }
}

// Fetch all contracts from your account
async function fetchAllContracts(address) {
  try {
    console.log(`\n📦 Fetching all contracts from ${address}...\n`);
    
    const account = await fcl.send([
      fcl.getAccount(address)
    ]).then(fcl.decode);
    
    const contractNames = Object.keys(account.contracts || {});
    console.log(`Found ${contractNames.length} contracts:\n`);
    
    for (const name of contractNames) {
      console.log(`- ${name}`);
    }
    
    return account.contracts;
  } catch (error) {
    console.error("Error fetching contracts:", error);
  }
}

// Main execution
const ADDRESS = "0x807c3d470888cc48";

(async () => {
  // First, list all contracts
  const contracts = await fetchAllContracts(ADDRESS);
  
  console.log("\n" + "=".repeat(80));
  console.log("FETCHING FlunksGraduation CONTRACT");
  console.log("=".repeat(80));
  
  // Then fetch FlunksGraduation specifically
  await fetchContract(ADDRESS, "FlunksGraduation");
})();
