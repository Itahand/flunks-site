import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { wallet_address, amount, source, metadata } = req.body;

    // Validate inputs
    if (!wallet_address || !amount || !source) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        spent: 0
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be positive',
        spent: 0
      });
    }

    console.log('💸 Spending gum:', { wallet_address, amount, source, metadata });

    // Get current balance
    const { data: balanceData, error: balanceError } = await supabase
      .from('user_gum_balances')
      .select('total_gum')
      .eq('wallet_address', wallet_address)
      .single();

    if (balanceError && balanceError.code !== 'PGRST116') {
      console.error('Error getting balance:', balanceError);
      return res.status(500).json({
        success: false,
        error: 'Error checking balance',
        spent: 0
      });
    }

    const currentBalance = balanceData?.total_gum || 0;
    console.log('💰 Current balance:', currentBalance, 'Spending:', amount);

    // Check if user has sufficient balance
    if (currentBalance < amount) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient balance',
        spent: 0,
        current_balance: currentBalance,
        required: amount
      });
    }

    // Calculate new balance
    const newBalance = currentBalance - amount;

    // Update balance
    const { error: updateError } = await supabase
      .from('user_gum_balances')
      .update({
        total_gum: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('wallet_address', wallet_address);

    if (updateError) {
      console.error('Error updating balance:', updateError);
      return res.status(500).json({
        success: false,
        error: 'Error updating balance',
        spent: 0
      });
    }

    // Record the transaction
    const { error: transactionError } = await supabase
      .from('user_gum_transactions')
      .insert({
        wallet_address,
        transaction_type: 'spend',
        amount: -amount, // Negative for spending
        source,
        description: `Spent ${amount} GUM on ${source}`,
        metadata: metadata || null
      });

    if (transactionError) {
      console.error('Error recording transaction:', transactionError);
      // Don't fail the request for transaction recording errors
    }

    console.log('✅ Gum spent successfully:', { amount, newBalance });

    return res.status(200).json({
      success: true,
      spent: amount,
      previous_balance: currentBalance,
      new_balance: newBalance,
      source
    });

  } catch (error) {
    console.error('Error spending gum:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      spent: 0
    });
  }
}