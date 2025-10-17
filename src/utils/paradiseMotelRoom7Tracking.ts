/**
 * Check if user has visited Paradise Motel Room 7 at night
 * Uses API endpoint to verify completion (EXACTLY like homecoming dance pattern)
 */
export async function checkParadiseMotelRoom7NightVisit(walletAddress: string): Promise<boolean> {
  try {
    console.log('🌙 [ROOM7] Checking Room 7 visit via API for wallet:', walletAddress?.slice(0, 10) + '...');
    
    // Use the EXACT SAME pattern as homecoming dance - call the API endpoint
    const response = await fetch(`/api/check-paradise-motel-room7?walletAddress=${walletAddress}`);
    
    if (!response.ok) {
      console.error('❌ [ROOM7] API response not ok:', response.status);
      return false;
    }
    
    const data = await response.json();
    console.log('📋 [ROOM7] API response:', data);
    
    const hasVisited = data.success && data.hasVisited;
    console.log('✅ [ROOM7] Final result:', hasVisited);
    
    return hasVisited;

  } catch (err) {
    console.error('💥 [ROOM7] API call failed:', err);
    return false;
  }
}
