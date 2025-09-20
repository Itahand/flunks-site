import * as fcl from "@onflow/fcl";

// Configure FCL for Flow mainnet
export const configureFlow = () => {
  fcl.config({
    "accessNode.api": "https://rest-mainnet.onflow.org", // Flow mainnet access node
    "discovery.wallet": "https://fcl-discovery.onflow.org/authn", // Wallet discovery
    "0xFlowToken": "0x1654653399040a61", // Flow Token contract address on mainnet
  });
};

// Initialize Flow configuration
configureFlow();

export { fcl };