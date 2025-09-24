import React, { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useGum } from '../contexts/GumContext';

const HomecomingDanceButton: React.FC = () => {
  const { primaryWallet } = useDynamicContext();
  const { profile } = useUserProfile();
  const { refreshBalance, refreshStats } = useGum();
  const [isLoading, setIsLoading] = useState(false);
  const [hasAttended, setHasAttended] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check if it's currently Saturday
  const isSaturday = (): boolean => {
    const now = new Date();
    // Get day of week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = now.getDay();
    return dayOfWeek === 6; // Saturday
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

    if (!isSaturday()) {
      alert('The homecoming dance is only available on Saturdays!');
      return;
    }

    if (hasAttended) {
      alert('You have already attended the homecoming dance!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/homecoming-dance-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: primaryWallet.address,
          username: profile?.username
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setHasAttended(true);
        alert(`🎉 ${data.message}`);
        // Refresh GUM balance
        refreshBalance();
        refreshStats();
      } else {
        if (data.outsideWindow) {
          alert('The homecoming dance is only available on Saturdays!');
        } else if (data.alreadyCompleted) {
          alert('You have already attended the homecoming dance!');
          setHasAttended(true);
        } else {
          alert(`Failed to record attendance: ${data.message}`);
        }
      }
    } catch (error) {
      console.error('❌ Error attending homecoming dance:', error);
      alert('Failed to record homecoming dance attendance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <button
        disabled
        className="w-full px-6 py-3 rounded-lg font-bold text-gray-400 bg-gray-600 cursor-not-allowed"
      >
        🔄 Checking status...
      </button>
    );
  }

  const isAvailable = isSaturday() && !hasAttended;
  const buttonText = hasAttended 
    ? '✅ Already Attended'
    : isSaturday() 
      ? '🕺 Attend Homecoming Dance (50 GUM)' 
      : '📅 Only Available on Saturdays';

  return (
    <button
      onClick={handleAttendDance}
      disabled={!isAvailable || isLoading}
      className={`w-full px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
        isAvailable && !isLoading
          ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 hover:scale-105 cursor-pointer'
          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
      }`}
    >
      {isLoading ? '⏳ Recording attendance...' : buttonText}
    </button>
  );
};

export default HomecomingDanceButton;