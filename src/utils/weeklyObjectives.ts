import { createClient } from '@supabase/supabase-js';
import { checkFridayNightLightsClicked } from './fridayNightLightsTracking';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: any = null;
let hasValidSupabaseConfig = false;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  hasValidSupabaseConfig = true;
  console.log('✅ Weekly Objectives: Supabase initialized');
} else {
  console.warn('⚠️ Weekly Objectives: Supabase environment variables not found');
}

export interface ChapterObjective {
  id: string;
  title: string;
  description: string;
  type: 'friday_night_lights' | 'crack_code' | 'daily_checkin' | 'custom';
  completed: boolean;
  completedAt?: string;
  reward?: number; // gum reward if applicable
}

export interface ObjectiveStatus {
  fridayNightLightsClicked: boolean;
  crackedCode: boolean; // Chapter 1 code
  crackedCodeChapter2?: boolean; // Chapter 2 code
  completedObjectives: ChapterObjective[];
}
// The Friday Night Lights checking is handled by the imported function
// from fridayNightLightsTracking.ts

// Check if user has cracked the code
export const checkCrackCodeObjective = async (walletAddress: string): Promise<boolean> => {
  if (!hasValidSupabaseConfig || !supabase) {
    console.warn('Supabase not configured, cannot check crack code objective');
    return false;
  }

  try {
    console.log('🔍 Checking crack code objective for wallet:', walletAddress);
    
    const { data, error } = await supabase
      .from('digital_lock_attempts')
      .select('*')
      .eq('wallet_address', walletAddress)
      .eq('code_entered', '8004')
      .eq('success', true)
      .limit(1)
      .order('created_at', { ascending: false }); // Get most recent first

    if (error) {
      console.error('Error checking crack code objective:', error);
      return false;
    }

    const hasCracked = data && data.length > 0;
    console.log('✅ Crack code objective completed:', hasCracked);
    return hasCracked;
  } catch (err) {
    console.error('Failed to check crack code objective:', err);
    return false;
  }
};

// Check if user has cracked the Chapter 2 code (0730)
export const checkCrackCodeObjectiveChapter2 = async (walletAddress: string): Promise<boolean> => {
  if (!hasValidSupabaseConfig || !supabase) {
    console.warn('Supabase not configured, cannot check Chapter 2 crack code objective');
    return false;
  }

  try {
    console.log('🔍 Checking Chapter 2 crack code objective for wallet:', walletAddress);
    
    const { data, error } = await supabase
      .from('digital_lock_attempts')
      .select('*')
      .eq('wallet_address', walletAddress)
      .eq('code_entered', '0730')
      .eq('success', true)
      .limit(1)
      .order('created_at', { ascending: false }); // Get most recent first

    if (error) {
      console.error('Error checking Chapter 2 crack code objective:', error);
      return false;
    }

    const hasCracked = data && data.length > 0;
    console.log('✅ Chapter 2 crack code objective completed:', hasCracked);
    return hasCracked;
  } catch (err) {
    console.error('Failed to check Chapter 2 crack code objective:', err);
    return false;
  }
};

// Get Chapter 1 objectives status for a user
export const getObjectivesStatus = async (walletAddress: string): Promise<ObjectiveStatus> => {
  console.log('🎯 getObjectivesStatus called for wallet:', walletAddress?.slice(0,10) + '...');
  
  const [fridayNightLightsClicked, crackedCode] = await Promise.all([
    checkFridayNightLightsClicked(walletAddress),
    checkCrackCodeObjective(walletAddress)
  ]);

  console.log('📊 Objectives status:', { fridayNightLightsClicked, crackedCode });

  const completedObjectives: ChapterObjective[] = [
    {
      id: 'slacker',
      title: 'The Slacker',
      description: 'Click the Friday Night Lights button on the football field',
      type: 'friday_night_lights',
      completed: fridayNightLightsClicked,
      reward: 50
    },
    {
      id: 'overachiever',
      title: 'The Overachiever', 
      description: 'Crack the access code',
      type: 'crack_code',
      completed: crackedCode,
      reward: 100
    }
  ];

  const progress = calculateObjectiveProgress(completedObjectives);
  console.log('🎯 Final progress calculated:', progress + '%');
  
  return {
    fridayNightLightsClicked,
    crackedCode,
    completedObjectives
  };
};

// Get Chapter 2 objectives status for a user
export const getChapter2ObjectivesStatus = async (walletAddress: string): Promise<ObjectiveStatus> => {
  console.log('🎯 getChapter2ObjectivesStatus called for wallet:', walletAddress?.slice(0,10) + '...');
  
  const [fridayNightLightsClicked, crackedCodeChapter2] = await Promise.all([
    checkFridayNightLightsClicked(walletAddress),
    checkCrackCodeObjectiveChapter2(walletAddress)
  ]);

  console.log('📊 Chapter 2 Objectives status:', { fridayNightLightsClicked, crackedCodeChapter2 });

  const completedObjectives: ChapterObjective[] = [
    {
      id: 'slacker_chapter2',
      title: 'The Slacker',
      description: 'Click the Friday Night Lights button on the football field',
      type: 'friday_night_lights',
      completed: fridayNightLightsClicked,
      reward: 50
    },
    {
      id: 'overachiever_chapter2',
      title: 'The Overachiever', 
      description: 'Find and unlock the trunk',
      type: 'crack_code',
      completed: crackedCodeChapter2,
      reward: 100
    }
  ];

  const progress = calculateObjectiveProgress(completedObjectives);
  console.log('🎯 Chapter 2 Final progress calculated:', progress + '%');
  
  return {
    fridayNightLightsClicked,
    crackedCode: false, // Chapter 1 code not relevant for Chapter 2
    crackedCodeChapter2,
    completedObjectives
  };
};

// Calculate progress percentage
export const calculateObjectiveProgress = (objectives: ChapterObjective[]): number => {
  if (objectives.length === 0) return 0;
  const completed = objectives.filter(obj => obj.completed).length;
  return Math.round((completed / objectives.length) * 100);
};
