import React from 'react';
import { useTimeBasedImage, HOUSE_CONFIGS, BUILDING_CONFIGS, LOCATION_CONFIGS } from '../utils/timeBasedImages';
import styles from '../styles/map.module.css';

interface DynamicHouseIconProps {
  houseId: string;
  className: string;
  onDoubleClick?: () => void;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  children?: React.ReactNode;
}

export function DynamicHouseIcon({
  houseId,
  className,
  onDoubleClick,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  children
}: DynamicHouseIconProps) {
  // Get configuration from house or building configs
  const config = HOUSE_CONFIGS[houseId] || BUILDING_CONFIGS[houseId];
  
  // Use time-based image hook if config exists, otherwise fall back to regular icon
  const timeBasedImage = config ? useTimeBasedImage(
    config.dayImage, 
    config.nightImage,
    undefined, // Use default time config
    7200000 // Update every 2 hours
  ) : null;

  // Determine the image URL to use
  let imageUrl: string;
  
  // First check for location-specific config
  if (LOCATION_CONFIGS[houseId]) {
    imageUrl = LOCATION_CONFIGS[houseId].iconPath;
  } 
  // Then check for time-based image
  else if (timeBasedImage) {
    imageUrl = timeBasedImage.currentImage;
  } 
  // Finally fall back to standard icon naming
  else {
    imageUrl = `/images/icons/${houseId}-icon.png`;
  }

  return (
    <div
      className={`${className} ${styles['dynamic-house']}`}
      onDoubleClick={onDoubleClick}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {children}
    </div>
  );
}
