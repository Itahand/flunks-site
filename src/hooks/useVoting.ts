import { useAuth } from '../contexts/AuthContext';

/**
 * Hook to get current user's Flunks count from the AuthContext
 * This provides the fastest access to Flunks data on the client-side
 */
export const useFlunksCount = () => {
  try {
    const { flunksCount } = useAuth();
    return flunksCount || 0;
  } catch (error) {
    console.warn('useFlunksCount: AuthContext not found, returning 0');
    return 0;
  }
};

/**
 * Hook to get comprehensive user voting status
 */
export const useVotingEligibility = () => {
  try {
    const { isAuthenticated, flunksCount } = useAuth();
    
    return {
      isEligible: isAuthenticated && flunksCount > 0,
      flunksCount,
      isAuthenticated,
      reason: !isAuthenticated 
        ? 'Not connected to wallet' 
        : flunksCount === 0 
        ? 'No Flunks in wallet' 
        : 'Eligible to vote'
    };
  } catch (error) {
    return {
      isEligible: false,
      flunksCount: 0,
      isAuthenticated: false,
      reason: 'Not connected to wallet'
    };
  }
};
