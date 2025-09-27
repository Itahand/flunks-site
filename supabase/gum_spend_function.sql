-- Function to spend gum from user balance
-- This is a secure atomic transaction that validates balance and records spending

CREATE OR REPLACE FUNCTION spend_gum(
  p_wallet_address VARCHAR(64),
  p_source VARCHAR(64),
  p_amount INTEGER,
  p_metadata JSONB DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_current_balance BIGINT;
  v_new_balance BIGINT;
BEGIN
  -- Validate inputs
  IF p_amount <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Amount must be positive',
      'spent', 0
    );
  END IF;

  -- Get current balance with row lock to prevent race conditions
  SELECT COALESCE(total_gum, 0) INTO v_current_balance
  FROM user_gum_balances
  WHERE wallet_address = p_wallet_address
  FOR UPDATE;

  -- Check if user has sufficient balance
  IF v_current_balance < p_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient balance',
      'spent', 0,
      'current_balance', v_current_balance,
      'required', p_amount
    );
  END IF;

  -- Calculate new balance
  v_new_balance := v_current_balance - p_amount;

  -- Update balance
  UPDATE user_gum_balances
  SET 
    total_gum = v_new_balance,
    updated_at = CURRENT_TIMESTAMP
  WHERE wallet_address = p_wallet_address;

  -- If no existing balance record, create one (shouldn't happen if user has gum, but safety check)
  IF NOT FOUND THEN
    INSERT INTO user_gum_balances (wallet_address, total_gum)
    VALUES (p_wallet_address, 0)
    ON CONFLICT (wallet_address) DO NOTHING;
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'No balance record found',
      'spent', 0
    );
  END IF;

  -- Record the spending transaction
  INSERT INTO gum_transactions (
    wallet_address, 
    transaction_type, 
    amount, 
    source, 
    description, 
    metadata
  )
  VALUES (
    p_wallet_address,
    'spent',
    p_amount,
    p_source,
    'Spent ' || p_amount || ' gum on ' || p_source,
    p_metadata
  );

  -- Return success
  RETURN jsonb_build_object(
    'success', true,
    'spent', p_amount,
    'previous_balance', v_current_balance,
    'new_balance', v_new_balance,
    'source', p_source
  );

EXCEPTION
  WHEN OTHERS THEN
    -- Handle any unexpected errors
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Database error: ' || SQLERRM,
      'spent', 0
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION spend_gum TO authenticated;
GRANT EXECUTE ON FUNCTION spend_gum TO anon;