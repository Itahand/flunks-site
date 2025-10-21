/**
 * Blockchain Registration Utilities
 * 
 * These functions register user achievements on the Flow blockchain
 * for NFT eligibility tracking via the SemesterZero contract
 */

import * as fcl from '@onflow/fcl';

/**
 * Register Chapter 5 Slacker completion on blockchain
 * (Paradise Motel Room 7 night visit)
 */
export async function registerSlackerOnBlockchain(userAddress: string): Promise<boolean> {
  try {
    console.log('🔗 [BLOCKCHAIN] Registering slacker completion for:', userAddress);

    // This is the Cadence transaction that will call the smart contract
    const transactionId = await fcl.mutate({
      cadence: `
        import SemesterZero from 0xYOUR_CONTRACT_ADDRESS

        transaction(userAddress: Address) {
          prepare(admin: &SemesterZero.Admin) {
            admin.registerSlackerCompletion(userAddress: userAddress)
          }
        }
      `,
      args: (arg: any, t: any) => [
        arg(userAddress, t.Address)
      ],
      payer: fcl.authz, // Admin account pays for transaction
      proposer: fcl.authz, // Admin proposes
      authorizations: [fcl.authz], // Admin authorizes
      limit: 100
    });

    console.log('✅ [BLOCKCHAIN] Slacker registration transaction:', transactionId);

    // Wait for transaction to be sealed
    const receipt = await fcl.tx(transactionId).onceSealed();
    console.log('✅ [BLOCKCHAIN] Transaction sealed:', receipt);

    return true;
  } catch (error) {
    console.error('❌ [BLOCKCHAIN] Failed to register slacker completion:', error);
    return false;
  }
}

/**
 * Register Chapter 5 Overachiever completion on blockchain
 * (Crack the code or whatever you define)
 */
export async function registerOverachieverOnBlockchain(userAddress: string): Promise<boolean> {
  try {
    console.log('🔗 [BLOCKCHAIN] Registering overachiever completion for:', userAddress);

    const transactionId = await fcl.mutate({
      cadence: `
        import SemesterZero from 0xYOUR_CONTRACT_ADDRESS

        transaction(userAddress: Address) {
          prepare(admin: &SemesterZero.Admin) {
            admin.registerOverachieverCompletion(userAddress: userAddress)
          }
        }
      `,
      args: (arg: any, t: any) => [
        arg(userAddress, t.Address)
      ],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 100
    });

    console.log('✅ [BLOCKCHAIN] Overachiever registration transaction:', transactionId);

    const receipt = await fcl.tx(transactionId).onceSealed();
    console.log('✅ [BLOCKCHAIN] Transaction sealed:', receipt);

    return true;
  } catch (error) {
    console.error('❌ [BLOCKCHAIN] Failed to register overachiever completion:', error);
    return false;
  }
}

/**
 * Check if user is eligible for Chapter 5 NFT on blockchain
 */
export async function checkNFTEligibility(userAddress: string): Promise<boolean> {
  try {
    console.log('🔍 [BLOCKCHAIN] Checking NFT eligibility for:', userAddress);

    const result = await fcl.query({
      cadence: `
        import SemesterZero from 0xYOUR_CONTRACT_ADDRESS

        access(all) fun main(userAddress: Address): Bool {
          return SemesterZero.isEligibleForChapter5NFT(userAddress: userAddress)
        }
      `,
      args: (arg: any, t: any) => [
        arg(userAddress, t.Address)
      ]
    });

    console.log('📊 [BLOCKCHAIN] NFT eligibility:', result);
    return result;
  } catch (error) {
    console.error('❌ [BLOCKCHAIN] Failed to check NFT eligibility:', error);
    return false;
  }
}

/**
 * Get Chapter 5 status from blockchain
 */
export async function getChapter5BlockchainStatus(userAddress: string) {
  try {
    console.log('🔍 [BLOCKCHAIN] Getting Chapter 5 status for:', userAddress);

    const result = await fcl.query({
      cadence: `
        import SemesterZero from 0xYOUR_CONTRACT_ADDRESS

        access(all) fun main(userAddress: Address): {String: AnyStruct}? {
          if let status = SemesterZero.getChapter5Status(userAddress: userAddress) {
            return {
              "slackerComplete": status.slackerComplete,
              "overachieverComplete": status.overachieverComplete,
              "nftAirdropped": status.nftAirdropped,
              "nftID": status.nftID,
              "isFullyComplete": status.isFullyComplete()
            }
          }
          return nil
        }
      `,
      args: (arg: any, t: any) => [
        arg(userAddress, t.Address)
      ]
    });

    console.log('📊 [BLOCKCHAIN] Chapter 5 status:', result);
    return result;
  } catch (error) {
    console.error('❌ [BLOCKCHAIN] Failed to get Chapter 5 status:', error);
    return null;
  }
}
