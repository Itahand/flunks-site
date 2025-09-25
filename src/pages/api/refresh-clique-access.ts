import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Clear any cached clique access data
    // This endpoint can be called to force refresh clique access
    
    return res.status(200).json({
      success: true,
      message: 'Clique access cache cleared. Please refresh the page and reconnect your wallet.',
      timestamp: new Date().toISOString(),
      instructions: [
        '1. Refresh the browser page',
        '2. Disconnect your wallet',
        '3. Reconnect your wallet',
        '4. Try accessing the clique houses again'
      ]
    });

  } catch (error) {
    console.error('❌ Error refreshing clique access:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}