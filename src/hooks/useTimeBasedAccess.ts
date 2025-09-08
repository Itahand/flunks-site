import { useState, useEffect } from 'react';

export interface TimeWindow {
  startHour: number; // 0-23 (24-hour format)
  endHour: number;   // 0-23 (24-hour format)
  days?: number[];   // 0-6 (Sunday=0, Monday=1, etc.) - optional, defaults to all days
}

export interface TimeBasedAccessRule {
  name: string;
  description: string;
  timeWindows: TimeWindow[];
  timezone?: string; // Optional timezone, defaults to user's local timezone
}

interface UseTimeBasedAccessReturn {
  currentTime: Date;
  currentHour: number;
  currentDay: number;
  isLocationOpen: (rule: TimeBasedAccessRule) => boolean;
  getNextOpenTime: (rule: TimeBasedAccessRule) => Date | null;
  getTimeUntilOpen: (rule: TimeBasedAccessRule) => string;
  getTimeUntilClosed: (rule: TimeBasedAccessRule) => string;
  formatTime: (date: Date) => string;
}

/**
 * Hook for time-based location access control
 * Checks if locations should be accessible based on current time
 */
export const useTimeBasedAccess = (): UseTimeBasedAccessReturn => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const currentHour = currentTime.getHours();
  const currentDay = currentTime.getDay();

  const isLocationOpen = (rule: TimeBasedAccessRule): boolean => {
    const now = new Date();
    
    return rule.timeWindows.some(window => {
      // Check if today is an allowed day (if days are specified)
      if (window.days && !window.days.includes(currentDay)) {
        return false;
      }

      // Handle time windows that span midnight
      if (window.startHour <= window.endHour) {
        // Normal time window (e.g., 9 AM to 5 PM)
        return currentHour >= window.startHour && currentHour < window.endHour;
      } else {
        // Time window spans midnight (e.g., 10 PM to 6 AM)
        return currentHour >= window.startHour || currentHour < window.endHour;
      }
    });
  };

  const getNextOpenTime = (rule: TimeBasedAccessRule): Date | null => {
    if (isLocationOpen(rule)) {
      return null; // Already open
    }

    const now = new Date();
    const today = now.getDay();
    
    // Check today's remaining windows
    for (const window of rule.timeWindows) {
      if (!window.days || window.days.includes(today)) {
        if (window.startHour > currentHour) {
          const nextOpen = new Date(now);
          nextOpen.setHours(window.startHour, 0, 0, 0);
          return nextOpen;
        }
      }
    }

    // Check next 7 days for the earliest opening
    for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
      const checkDay = (today + dayOffset) % 7;
      
      for (const window of rule.timeWindows) {
        if (!window.days || window.days.includes(checkDay)) {
          const nextOpen = new Date(now);
          nextOpen.setDate(now.getDate() + dayOffset);
          nextOpen.setHours(window.startHour, 0, 0, 0);
          return nextOpen;
        }
      }
    }

    return null; // No opening time found in next week
  };

  const getTimeUntilOpen = (rule: TimeBasedAccessRule): string => {
    if (isLocationOpen(rule)) {
      return "Open now";
    }

    const nextOpen = getNextOpenTime(rule);
    if (!nextOpen) {
      return "Never opens";
    }

    const now = new Date();
    const msUntilOpen = nextOpen.getTime() - now.getTime();
    
    if (msUntilOpen < 0) {
      return "Open now";
    }

    const hours = Math.floor(msUntilOpen / (1000 * 60 * 60));
    const minutes = Math.floor((msUntilOpen % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours < 24) {
      return `Opens in ${hours}h ${minutes}m`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `Opens in ${days}d ${remainingHours}h`;
    }
  };

  const getTimeUntilClosed = (rule: TimeBasedAccessRule): string => {
    if (!isLocationOpen(rule)) {
      return "Closed";
    }

    const now = new Date();
    
    // Find the current active window
    for (const window of rule.timeWindows) {
      if (!window.days || window.days.includes(currentDay)) {
        let closingTime: Date;
        
        if (window.startHour <= window.endHour) {
          // Normal window
          if (currentHour >= window.startHour && currentHour < window.endHour) {
            closingTime = new Date(now);
            closingTime.setHours(window.endHour, 0, 0, 0);
          } else {
            continue;
          }
        } else {
          // Window spans midnight
          if (currentHour >= window.startHour) {
            // Still same day, closes next day
            closingTime = new Date(now);
            closingTime.setDate(now.getDate() + 1);
            closingTime.setHours(window.endHour, 0, 0, 0);
          } else if (currentHour < window.endHour) {
            // Already next day
            closingTime = new Date(now);
            closingTime.setHours(window.endHour, 0, 0, 0);
          } else {
            continue;
          }
        }

        const msUntilClosed = closingTime.getTime() - now.getTime();
        if (msUntilClosed > 0) {
          const hours = Math.floor(msUntilClosed / (1000 * 60 * 60));
          const minutes = Math.floor((msUntilClosed % (1000 * 60 * 60)) / (1000 * 60));
          
          if (hours === 0) {
            return `Closes in ${minutes}m`;
          } else {
            return `Closes in ${hours}h ${minutes}m`;
          }
        }
      }
    }

    return "Closing soon";
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return {
    currentTime,
    currentHour,
    currentDay,
    isLocationOpen,
    getNextOpenTime,
    getTimeUntilOpen,
    getTimeUntilClosed,
    formatTime
  };
};

// Predefined common time rules
export const TIME_RULES: Record<string, TimeBasedAccessRule> = {
  NIGHT_CLUB: {
    name: "Night Club",
    description: "Only open during nighttime hours",
    timeWindows: [
      { startHour: 21, endHour: 3 } // 9 PM to 3 AM (spans midnight)
    ]
  },
  
  STUDY_HALL: {
    name: "Study Hall", 
    description: "Open during school hours on weekdays",
    timeWindows: [
      { startHour: 8, endHour: 17, days: [1, 2, 3, 4, 5] } // 8 AM to 5 PM, Monday-Friday
    ]
  },
  
  WEEKEND_HANGOUT: {
    name: "Weekend Hangout",
    description: "Only accessible on weekends",
    timeWindows: [
      { startHour: 10, endHour: 22, days: [0, 6] } // 10 AM to 10 PM, Saturday-Sunday
    ]
  },
  
  LUNCH_SPOT: {
    name: "Lunch Spot",
    description: "Open during lunch hours",
    timeWindows: [
      { startHour: 11, endHour: 14 } // 11 AM to 2 PM every day
    ]
  },
  
  EARLY_BIRD_CAFE: {
    name: "Early Bird Cafe",
    description: "Morning coffee spot",
    timeWindows: [
      { startHour: 6, endHour: 10 } // 6 AM to 10 AM every day
    ]
  },
  
  AFTER_SCHOOL_HANGOUT: {
    name: "After School Hangout", 
    description: "Available after school on weekdays",
    timeWindows: [
      { startHour: 15, endHour: 20, days: [1, 2, 3, 4, 5] } // 3 PM to 8 PM, Monday-Friday
    ]
  }
};
