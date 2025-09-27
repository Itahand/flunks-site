import React, { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useGum } from '../contexts/GumContext';

interface HomecomingTestButtonProps {
  bypassTimeCheck?: boolean;
}

const HomecomingTestButton: React.FC<HomecomingTestButtonProps> = ({ bypassTimeCheck = true }) => {
  const { primaryWallet } = useDynamicContext();
  const { profile } = useUserProfile();
  const { refreshBalance, refreshStats } = useGum();
  const [isLoading, setIsLoading] = useState(false);
  const [hasAttended, setHasAttended] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check if it's currently Saturday 5 PM to Sunday 12 PM (bypass for testing)
  const isHomecomingTime = (): boolean => {
    if (bypassTimeCheck) {
      console.log('⚠️ Time check bypassed for testing');
      return true; // Always return true for testing
    }

    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = now.getHours(); // 0-23

    // Saturday from 5 PM onwards (17:00-23:59)
    if (dayOfWeek === 6 && hour >= 17) {
      return true;
    }
    
    // Sunday from midnight to 11:59 AM (00:00-11:59)
    if (dayOfWeek === 0 && hour < 12) {
      return true;
    }
    
    return false;
  };

  // Check if user has already attended this week
  const checkAttendanceStatus = async () => {
    if (!primaryWallet?.address) return;

    try {
      setCheckingStatus(true);
      
      // Check if user has already attended homecoming dance
      const response = await fetch(`/api/check-homecoming-attendance?walletAddress=${primaryWallet.address}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setHasAttended(data.hasAttended || false);
        console.log('🔍 Attendance check result:', data);
      } else {
        console.error('❌ Failed to check attendance status');
      }
    } catch (error) {
      console.error('❌ Error checking attendance status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    checkAttendanceStatus();
  }, [primaryWallet?.address]);

  const handleAttendDance = async () => {
    if (!primaryWallet?.address) {
      alert('Please connect your wallet to attend the homecoming dance!');
      return;
    }

    if (!isHomecomingTime()) {
      alert('The homecoming dance is only available Saturday 5 PM to Sunday 12 PM!');
      return;
    }

    if (hasAttended) {
      alert('You have already attended the homecoming dance!');
      return;
    }

    setIsLoading(true);
    console.log('🎭 Starting homecoming dance attendance...');
    
    try {
      const requestBody = {
        walletAddress: primaryWallet.address,
        username: profile?.username,
        testMode: bypassTimeCheck // Flag to indicate testing
      };

      console.log('📤 Sending request:', requestBody);

      const response = await fetch('/api/homecoming-test-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('📥 Response received:', data);
      
      if (data.success) {
        setHasAttended(true);
        alert(`🎉 ${data.message}`);
        // Refresh GUM balance
        await refreshBalance();
        await refreshStats();
        console.log('✅ GUM balance and stats refreshed');
      } else {
        if (data.outsideWindow) {
          alert('The homecoming dance is only available Saturday 5 PM to Sunday 12 PM!');
        } else if (data.alreadyCompleted) {
          alert('You have already attended the homecoming dance!');
          setHasAttended(true);
        } else {
          alert(`Failed to record attendance: ${data.message}`);
        }
        console.error('❌ Failed:', data);
      }
    } catch (error) {
      console.error('❌ Error attending homecoming dance:', error);
      alert('Failed to record homecoming dance attendance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAttendance = async () => {
    if (!primaryWallet?.address) return;
    
    const confirmReset = confirm('Reset your homecoming dance attendance? This will allow you to test again.');
    if (!confirmReset) return;

    try {
      const response = await fetch('/api/reset-homecoming-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: primaryWallet.address
        }),
      });

      if (response.ok) {
        setHasAttended(false);
        alert('✅ Homecoming dance attendance reset!');
        console.log('✅ Attendance reset successfully');
      } else {
        alert('❌ Failed to reset attendance');
      }
    } catch (error) {
      console.error('❌ Error resetting attendance:', error);
      alert('❌ Error resetting attendance');
    }
  };

  if (checkingStatus) {
    return (
      <div className="space-y-2">
        <button
          disabled
          className="w-full px-6 py-3 rounded-lg font-bold text-gray-400 bg-gray-600 cursor-not-allowed"
        >
          🔄 Checking status...
        </button>
      </div>
    );
  }

  const isAvailable = isHomecomingTime() && !hasAttended;
  const buttonText = hasAttended 
    ? '✅ Already Attended'
    : isHomecomingTime() 
      ? '🕺 TEST: Attend Homecoming Dance (50 GUM)' 
      : '📅 Available Saturday 5 PM - Sunday 12 PM';

  return (
    <div className="space-y-2">
      <button
        onClick={handleAttendDance}
        disabled={!isAvailable || isLoading}
        className={`w-full px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
          isAvailable && !isLoading
            ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 hover:scale-105 cursor-pointer'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isLoading ? '⏳ Recording attendance...' : buttonText}
      </button>
      
      {/* Test Controls - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="flex gap-2">
          <button
            onClick={resetAttendance}
            className="flex-1 px-4 py-2 rounded-lg font-bold bg-yellow-600 hover:bg-yellow-700 text-white text-sm transition-all duration-300"
          >
            🔄 Reset Test
          </button>
          <button
            onClick={() => {
              console.log('Current status:', {
                hasAttended,
                isHomecomingTime: isHomecomingTime(),
                bypassTimeCheck,
                walletAddress: primaryWallet?.address
              });
              alert('Check console for debug info');
            }}
            className="flex-1 px-4 py-2 rounded-lg font-bold bg-purple-600 hover:bg-purple-700 text-white text-sm transition-all duration-300"
          >
            🐛 Debug Info
          </button>
        </div>
      )}
    </div>
  );
};

export default HomecomingTestButton;