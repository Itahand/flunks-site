import { NextApiRequest, NextApiResponse } from 'next';

// Flow blockchain API integration
// You'll need to install the Flow client libraries: npm install @onflow/fcl @onflow/types

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    // For now, we'll use mock data until Flow SDK is properly configured
    // TODO: Replace with actual Flow blockchain calls
    const walletData = await fetchFlowWalletData(address);
    
    res.status(200).json(walletData);
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    res.status(500).json({ error: 'Failed to fetch wallet data' });
  }
}

async function fetchFlowWalletData(address: string) {
  // TODO: Implement actual Flow blockchain integration
  // This would use @onflow/fcl to query the Flow blockchain
  
  // Mock implementation for now
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  // Generate realistic mock data
  const baseBalance = Math.random() * 50000 + 1000;
  const transactions = Array.from({ length: Math.floor(Math.random() * 20) + 5 }, (_, i) => {
    const isReceived = Math.random() > 0.6;
    const amount = Math.random() * (isReceived ? 5000 : 1000) + (isReceived ? 100 : 10);
    const daysAgo = Math.floor(Math.random() * 30);
    
    return {
      id: `0x${Math.random().toString(16).substring(2, 18)}`,
      amount: Math.round(amount * 100) / 100,
      timestamp: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      type: isReceived ? 'received' : 'sent',
      from: isReceived ? `0x${Math.random().toString(16).substring(2, 18)}` : address,
      to: isReceived ? address : `0x${Math.random().toString(16).substring(2, 18)}`,
      transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      blockHeight: Math.floor(Math.random() * 1000000) + 50000000,
    };
  });

  // Sort transactions by timestamp (newest first)
  transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    address,
    balance: Math.round(baseBalance * 100) / 100,
    transactions,
    lastUpdated: new Date().toISOString(),
    network: 'mainnet',
    accountExists: true,
  };
}

/* 
TODO: Real Flow blockchain integration would look like this:

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

// Configure FCL for Flow mainnet
fcl.config({
  "accessNode.api": "https://rest-mainnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/authn"
});

async function fetchRealFlowWalletData(address: string) {
  try {
    // Get account info and balance
    const account = await fcl.account(address);
    
    // Get FLOW token balance (FLOW has 8 decimals)
    const balance = parseInt(account.balance) / Math.pow(10, 8);
    
    // Get transaction history (would need to use a Flow indexer like FlowScan API)
    const transactions = await fetchTransactionHistory(address);
    
    return {
      address,
      balance,
      transactions,
      lastUpdated: new Date().toISOString(),
      network: 'mainnet',
      accountExists: true,
    };
  } catch (error) {
    throw new Error(`Failed to fetch Flow account data: ${error.message}`);
  }
}

async function fetchTransactionHistory(address: string) {
  // This would typically use a Flow indexer service like:
  // - FlowScan API
  // - Flow API 
  // - Alchemy Flow API
  // Since these require API keys and setup, we'll use mock data for now
  
  const response = await fetch(`https://flowscan.org/api/account/${address}/transactions`);
  const data = await response.json();
  
  return data.transactions.map(tx => ({
    id: tx.id,
    amount: parseFloat(tx.amount) / Math.pow(10, 8), // Convert from uFLOW to FLOW
    timestamp: new Date(tx.time).toISOString(),
    type: tx.events.some(e => e.type.includes('TokensDeposited')) ? 'received' : 'sent',
    from: tx.proposer,
    to: address,
    transactionHash: tx.id,
    blockHeight: tx.blockHeight,
  }));
}
*/