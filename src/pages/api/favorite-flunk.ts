import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === 'GET') {
    // Get favorite flunk for wallet
    const { wallet_address } = req.query;

    if (!wallet_address || typeof wallet_address !== 'string') {
      return res.status(400).json({ error: 'wallet_address is required' });
    }

    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('favorite_flunk_data')
        .eq('wallet_address', wallet_address.toLowerCase())
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        // Check if it's a column doesn't exist error
        if (error.message?.includes('favorite_flunk_data') && error.message?.includes('does not exist')) {
          console.warn('⚠️ favorite_flunk_data column does not exist yet, returning null');
          return res.status(200).json({ favoriteFlunk: null });
        }
        console.error('❌ Error fetching favorite flunk:', error);
        return res.status(500).json({ error: 'Database error' });
      }

      return res.status(200).json({ 
        favoriteFlunk: profile?.favorite_flunk_data || null 
      });
    } catch (error) {
      console.error('❌ Error in favorite-flunk GET:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (method === 'POST') {
    // Save favorite flunk for wallet
    const { wallet_address, favorite_flunk_data } = req.body;

    if (!wallet_address || typeof wallet_address !== 'string') {
      return res.status(400).json({ error: 'wallet_address is required' });
    }

    try {
      // First try to update existing profile
      const { data: updateData, error: updateError } = await supabase
        .from('user_profiles')
        .update({ favorite_flunk_data })
        .eq('wallet_address', wallet_address.toLowerCase())
        .select();

      if (updateError) {
        // Check if it's a column doesn't exist error
        if (updateError.message?.includes('favorite_flunk_data') && updateError.message?.includes('does not exist')) {
          console.warn('⚠️ favorite_flunk_data column does not exist yet');
          return res.status(200).json({ 
            success: false, 
            message: 'Database schema needs to be updated. Using localStorage fallback.' 
          });
        }
        console.error('❌ Error updating favorite flunk:', updateError);
        return res.status(500).json({ error: 'Database error' });
      }

      // If no rows were updated, the profile doesn't exist yet
      if (!updateData || updateData.length === 0) {
        console.log('🆕 Creating new profile for favorite flunk');
        
        // Create a minimal profile just for the favorite flunk
        const { data: insertData, error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            wallet_address: wallet_address.toLowerCase(),
            username: `User_${wallet_address.slice(0, 6)}`, // Temporary username
            favorite_flunk_data
          })
          .select();

        if (insertError) {
          console.error('❌ Error creating profile for favorite flunk:', insertError);
          return res.status(500).json({ error: 'Failed to create profile' });
        }

        console.log('✅ Created new profile with favorite flunk');
        return res.status(200).json({ 
          success: true, 
          message: 'Favorite flunk saved to new profile',
          profile: insertData[0]
        });
      }

      console.log('✅ Updated favorite flunk for existing profile');
      return res.status(200).json({ 
        success: true, 
        message: 'Favorite flunk updated',
        profile: updateData[0]
      });
    } catch (error) {
      console.error('❌ Error in favorite-flunk POST:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (method === 'DELETE') {
    // Clear favorite flunk for wallet
    const { wallet_address } = req.query;

    if (!wallet_address || typeof wallet_address !== 'string') {
      return res.status(400).json({ error: 'wallet_address is required' });
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ favorite_flunk_data: null })
        .eq('wallet_address', wallet_address.toLowerCase());

      if (error) {
        console.error('❌ Error clearing favorite flunk:', error);
        return res.status(500).json({ error: 'Database error' });
      }

      console.log('✅ Cleared favorite flunk for wallet:', wallet_address);
      return res.status(200).json({ 
        success: true, 
        message: 'Favorite flunk cleared' 
      });
    } catch (error) {
      console.error('❌ Error in favorite-flunk DELETE:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
}
