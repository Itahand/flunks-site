/**
 * Check if user has completed the Hidden Riff guitar sequence
 * Checks the gum_transactions table for 'hidden_riff' source
 */
export async function checkHiddenRiffCompletion(walletAddress: string): Promise<boolean> {
  try {
    console.log('🎸 [HIDDEN_RIFF] Checking completion for wallet:', walletAddress?.slice(0, 10) + '...');
    
    // Call the API endpoint to check if they've claimed the hidden_riff reward
    const response = await fetch(`/api/check-hidden-riff?walletAddress=${walletAddress}`);
    
    if (!response.ok) {
      console.error('❌ [HIDDEN_RIFF] API response not ok:', response.status);
      return false;
    }
    
    const data = await response.json();
    console.log('📋 [HIDDEN_RIFF] API response:', data);
    
    const hasCompleted = data.success && data.hasCompleted;
    console.log('✅ [HIDDEN_RIFF] Final result:', hasCompleted);
    
    return hasCompleted;

  } catch (err) {
    console.error('💥 [HIDDEN_RIFF] API call failed:', err);
    return false;
  }
}
