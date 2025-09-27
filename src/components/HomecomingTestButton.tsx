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

  const checkAttendanceStatus = async () => {
    if (!primaryWallet?.address) return;
    
    setCheckingStatus(true);
    try {
      console.log('🔍 Checking attendance status for:', primaryWallet.address.slice(0, 8) + '...');
      
      // Check if user has already attended homecoming dance
      const response = await fetch(`/api/check-homecoming-dance-attendance?walletAddress=${primaryWallet.address}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setHasAttended(data.hasAttended || false);
        console.log('📊 TEST - Attendance status:', data);
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
    console.log('🎭 TEST - Starting homecoming dance attendance...');
    
    try {
      const response = await fetch('/api/record-homecoming-dance-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: primaryWallet.address,
          username: profile?.username || 'Test User',
        }),
      });

      const data = await response.json();
      console.log('🎭 TEST - Response data:', data);
      
      if (data.success) {
        setHasAttended(true);
        alert(`🎉 ${data.message}`);
        // Refresh GUM balance
        await refreshBalance();
        await refreshStats();
        console.log('✅ TEST - GUM balance and stats refreshed');
      } else {
        if (data.outsideWindow) {
          alert('The homecoming dance is only available Saturday 5 PM to Sunday 12 PM!');
        } else if (data.alreadyCompleted) {
          alert('You have already attended the homecoming dance!');
          setHasAttended(true);
        } else {
          alert(`Failed to record attendance: ${data.message}`);
        }
        console.error('❌ TEST - Failed:', data);
      }
    } catch (error) {
      console.error('❌ TEST - Error attending homecoming dance:', error);
      alert('Failed to record homecoming dance attendance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking attendance
  if (checkingStatus) {
    return (
      <div className="w-full px-6 py-3 rounded-lg bg-gray-700 text-gray-300 font-bold text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          <span>Checking attendance status...</span>
        </div>
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
        } shadow-lg text-center`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Recording attendance...</span>
          </div>
        ) : (
          buttonText
        )}
      </button>

      {/* Test Mode Indicator */}
      <div className="bg-yellow-900 bg-opacity-50 border border-yellow-500 rounded-lg p-2 text-center">
        <div className="text-yellow-400 text-sm font-bold mb-1">
          ⚠️ BETA TEST MODE
        </div>
        <div className="text-yellow-300 text-xs">
          Time restrictions bypassed for testing purposes
        </div>
      </div>
      
      {/* Bypass Toggle Button */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            // Toggle bypass and check status again
            console.log('🔄 TEST - Toggling time bypass and rechecking status');
            checkAttendanceStatus();
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
        >
          🔄 Refresh Status
        </button>
      </div>
    </div>
  );
};

export default HomecomingTestButton;