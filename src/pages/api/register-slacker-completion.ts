import { NextApiRequest, NextApiResponse } from 'next';
import * as fcl from '@onflow/fcl';

/**
 * Register Slacker Completion API
 * 
 * Calls blockchain Admin function to register slacker completion
 * (Paradise Motel Room 7 night visit)
 */

// Admin account private key (stored securely in environment variables)
const ADMIN_PRIVATE_KEY = process.env.FLOW_ADMIN_PRIVATE_KEY!;
const ADMIN_ADDRESS = process.env.FLOW_ADMIN_ADDRESS!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    // Create authorization function for admin
    const authz = fcl.authorization(
      ADMIN_ADDRESS,
      async () => {
        return {
          addr: ADMIN_ADDRESS,
          keyId: 0,
          signingFunction: async (signable: any) => {
            // TODO: Implement proper signing with ADMIN_PRIVATE_KEY
            // For now, this is a placeholder
            // You'll need to use @onflow/sdk or similar for actual signing
            return {
              addr: ADMIN_ADDRESS,
              keyId: 0,
              signature: '', // Sign with private key
            };
          },
        };
      }
    );

    // Register slacker completion on blockchain
    const transactionId = await fcl.mutate({
      cadence: `
        import SemesterZero from 0xYOUR_CONTRACT_ADDRESS
        
        transaction(userAddress: Address) {
          let adminRef: &SemesterZero.Admin
          
          prepare(signer: AuthAccount) {
            self.adminRef = signer.borrow<&SemesterZero.Admin>(from: SemesterZero.AdminStoragePath)
              ?? panic("Could not borrow Admin reference")
          }
          
          execute {
            self.adminRef.registerSlackerCompletion(userAddress: userAddress)
          }
        }
      `,
      args: (arg: any, t: any) => [arg(walletAddress, t.Address)],
      payer: authz,
      proposer: authz,
      authorizations: [authz],
      limit: 100,
    });

    console.log(`✅ Slacker completion registered for ${walletAddress}: ${transactionId}`);

    // Wait for transaction to be sealed
    await fcl.tx(transactionId).onceSealed();

    return res.status(200).json({
      success: true,
      transactionId,
      message: 'Slacker completion registered on blockchain',
    });
  } catch (error: any) {
    console.error('Error registering slacker completion:', error);
    return res.status(500).json({
      error: 'Failed to register slacker completion',
      details: error.message,
    });
  }
}
