import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Admin-only API for managing Semester Zero collection allowlist
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for admin operations
);

interface AllowlistEntry {
  wallet_address: string;
  added_by: string;
  added_at: string;
  reason?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('❌ Allowlist API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// GET: Check if wallet is on allowlist or get full list (admin only)
async function handleGet(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { wallet_address, admin_key } = req.query;

  if (wallet_address) {
    // Check if specific wallet is allowed
    const { data, error } = await supabase
      .from('semester_zero_allowlist')
      .select('wallet_address')
      .eq('wallet_address', wallet_address)
      .single();

    return res.status(200).json({
      success: true,
      data: {
        allowed: !!data,
        wallet_address
      }
    });
  }

  // Admin-only: Get full allowlist
  if (admin_key !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({
      success: false,
      error: 'Unauthorized - admin access required'
    });
  }

  const { data, error } = await supabase
    .from('semester_zero_allowlist')
    .select('*')
    .order('added_at', { ascending: false });

  if (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch allowlist'
    });
  }

  return res.status(200).json({
    success: true,
    data: data || []
  });
}

// POST: Add wallets to allowlist (admin only)
async function handlePost(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { wallets, admin_key, added_by, reason } = req.body;

  // Validate admin access
  if (admin_key !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({
      success: false,
      error: 'Unauthorized - admin access required'
    });
  }

  if (!wallets || !Array.isArray(wallets)) {
    return res.status(400).json({
      success: false,
      error: 'Wallets array is required'
    });
  }

  // Prepare entries
  const entries = wallets.map(wallet => ({
    wallet_address: wallet.toLowerCase().trim(),
    added_by: added_by || 'admin',
    added_at: new Date().toISOString(),
    reason: reason || 'Manual admin addition'
  }));

  // Insert entries (ignore duplicates)
  const { data, error } = await supabase
    .from('semester_zero_allowlist')
    .upsert(entries, { onConflict: 'wallet_address' })
    .select();

  if (error) {
    console.error('Allowlist insert error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to add wallets to allowlist'
    });
  }

  return res.status(200).json({
    success: true,
    message: `Added ${entries.length} wallets to allowlist`,
    data: data
  });
}

// DELETE: Remove wallet from allowlist (admin only)
async function handleDelete(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { wallet_address, admin_key } = req.body;

  // Validate admin access
  if (admin_key !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({
      success: false,
      error: 'Unauthorized - admin access required'
    });
  }

  if (!wallet_address) {
    return res.status(400).json({
      success: false,
      error: 'Wallet address is required'
    });
  }

  const { error } = await supabase
    .from('semester_zero_allowlist')
    .delete()
    .eq('wallet_address', wallet_address.toLowerCase().trim());

  if (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to remove wallet from allowlist'
    });
  }

  return res.status(200).json({
    success: true,
    message: `Removed ${wallet_address} from allowlist`
  });
}