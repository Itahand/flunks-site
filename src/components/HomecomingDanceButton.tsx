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

  // Check if user has already attended
  const checkAttendanceStatus = async () => {
    if (!primaryWallet?.address) return;

    try {
      setCheckingStatus(true);
      
      // Check if user has already attended homecoming dance
      const response = await fetch(`/api/check-homecoming-dance-attendance?walletAddress=${primaryWallet.address}`, {
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

    if (hasAttended) {
      alert('You have already attended the homecoming dance!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/record-homecoming-dance-attendance', {
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
        if (data.alreadyCompleted) {
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

  const isAvailable = !hasAttended;
  const buttonText = hasAttended 
    ? '✅ Already Attended'
    : '🕺 Attend Homecoming Dance (50 GUM)';

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