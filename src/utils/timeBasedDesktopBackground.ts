// Time-based background utility for Main Desktop
// Shows my-background.png from 8 AM to 4 PM, my-background-2.png for all other times

export const getTimeBasedDesktopBackground = (): string => {
  const now = new Date();
  const currentHour = now.getHours();
  
  // 8 AM (08:00) to 4 PM (16:00) - show my-background.png
  if (currentHour >= 8 && currentHour < 16) {
    return 'url(/images/my-background.png)';
  }
  
  // All other times (4 PM to 7:59 AM) - show my-background-2.png
  return 'url(/images/my-background-2.png)';
};
