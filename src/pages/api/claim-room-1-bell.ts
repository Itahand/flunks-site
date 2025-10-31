import { NextApiRequest, NextApiResponse } from 'next';
import { awardGum } from '../../utils/gumAPI';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { wallet } = req.body;

  if (!wallet || typeof wallet !== 'string') {
    return res.status(400).json({ 
      success: false, 
      error: 'Wallet address required' 
    });
  }

  try {
    // Award 100 GUM for ringing the lobby bell 10 times
    const result = await awardGum(wallet, 'lobby_bell', {
      source: 'paradise_motel_lobby_bell',
      timestamp: new Date().toISOString()
    });

    if (result.success && result.earned > 0) {
      return res.status(200).json({
        success: true,
        earned: result.earned,
        message: `Bell reward claimed: +${result.earned} GUM!`
      });
    } else if (result.cooldown_remaining_minutes && result.cooldown_remaining_minutes > 0) {
      return res.status(200).json({
        success: false,
        message: `Already claimed! This is a one-time reward.`
      });
    } else {
      return res.status(200).json({
        success: false,
        message: result.error || 'Unable to claim bell reward right now'
      });
    }
  } catch (error) {
    console.error('Room 1 bell claim error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
