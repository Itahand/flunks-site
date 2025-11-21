-- FIX award_gum function - correct schema based on actual database
-- Run this in Supabase SQL Editor

-- Drop all existing award_gum functions
DROP FUNCTION IF EXISTS public.award_gum(character varying, character varying, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.award_gum(text, text, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.award_gum(varchar, varchar, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.award_gum(p_wallet_address character varying, p_source character varying, p_metadata jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.award_gum(p_wallet_address text, p_source text, p_metadata jsonb) CASCADE;

-- Create clean function with correct schema
CREATE OR REPLACE FUNCTION public.award_gum(
  p_wallet_address TEXT,
  p_source TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE(success BOOLEAN, earned INTEGER, error TEXT, cooldown_remaining_minutes INTEGER) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_amount INTEGER;
  v_source_exists BOOLEAN;
  v_cooldown_minutes INTEGER;
  v_last_transaction TIMESTAMPTZ;
  v_minutes_since_last NUMERIC;
BEGIN
  -- Validate wallet address
  IF p_wallet_address IS NULL OR p_wallet_address = '' THEN
    RETURN QUERY SELECT FALSE, 0, 'Invalid wallet address'::TEXT, 0;
    RETURN;
  END IF;

  -- Check if source exists in gum_sources table
  SELECT EXISTS(
    SELECT 1 FROM public.gum_sources WHERE source_name = p_source
  ) INTO v_source_exists;

  IF NOT v_source_exists THEN
    RETURN QUERY SELECT FALSE, 0, ('Source not found: ' || p_source)::TEXT, 0;
    RETURN;
  END IF;

  -- Get the amount and cooldown for this source
  SELECT base_reward, COALESCE(cooldown_minutes, 0) INTO v_amount, v_cooldown_minutes
  FROM public.gum_sources
  WHERE source_name = p_source;

  -- Check cooldown if applicable
  IF v_cooldown_minutes > 0 THEN
    SELECT created_at INTO v_last_transaction
    FROM public.gum_transactions
    WHERE wallet_address = p_wallet_address AND source = p_source
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_last_transaction IS NOT NULL THEN
      SELECT EXTRACT(EPOCH FROM (NOW() - v_last_transaction)) / 60 INTO v_minutes_since_last;
      
      IF v_minutes_since_last < v_cooldown_minutes THEN
        RETURN QUERY SELECT FALSE, 0, 'Cooldown active'::TEXT, CEIL(v_cooldown_minutes - v_minutes_since_last)::INTEGER;
        RETURN;
      END IF;
    END IF;
  END IF;

  -- Insert transaction record with correct schema (transaction_type, description)
  INSERT INTO public.gum_transactions (wallet_address, source, amount, metadata, transaction_type, description)
  VALUES (p_wallet_address, p_source, v_amount, p_metadata, 'earned', 'Earned gum from ' || p_source);

  -- Update or insert user balance with correct columns (current_balance, total_earned, total_spent)
  INSERT INTO public.user_gum_balances (wallet_address, current_balance, total_earned, total_spent)
  VALUES (p_wallet_address, v_amount, v_amount, 0)
  ON CONFLICT (wallet_address) 
  DO UPDATE SET 
    current_balance = public.user_gum_balances.current_balance + v_amount,
    total_earned = public.user_gum_balances.total_earned + v_amount,
    updated_at = NOW();

  -- Return success
  RETURN QUERY SELECT TRUE, v_amount, NULL::TEXT, 0;

EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT FALSE, 0, SQLERRM::TEXT, 0;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.award_gum(TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.award_gum(TEXT, TEXT, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION public.award_gum(TEXT, TEXT, JSONB) TO service_role;

-- Verify
SELECT 
  proname as function_name,
  pg_get_function_identity_arguments(oid) as arguments
FROM pg_proc 
WHERE proname = 'award_gum' 
AND pronamespace = 'public'::regnamespace;
