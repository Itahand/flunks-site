export type CliqueType = 'GEEK' | 'JOCK' | 'PREP' | 'FREAK';

export interface CliqueColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  light: string;
  dark: string;
}

// Default colors (can be overridden)
const DEFAULT_CLIQUE_COLORS: Record<CliqueType, CliqueColorScheme> = {
  GEEK: {
    primary: '#90EE90',    // Light green (pastel mint green)
    secondary: '#228B22',  // Forest green
    accent: '#98FB98',     // Pale green
    light: '#F0FFF0',     // Honeydew
    dark: '#006400'       // Dark green
  },
  JOCK: {
    primary: '#FFB6C1',    // Light pink (pastel coral)
    secondary: '#CD5C5C',  // Indian red
    accent: '#FFC0CB',     // Pink
    light: '#FFF0F5',     // Lavender blush
    dark: '#8B0000'       // Dark red
  },
  PREP: {
    primary: '#87CEEB',    // Sky blue (pastel blue)
    secondary: '#4682B4',  // Steel blue
    accent: '#B0E0E6',     // Powder blue
    light: '#F0F8FF',     // Alice blue
    dark: '#191970'       // Midnight blue
  },
  FREAK: {
    primary: '#DDA0DD',    // Plum (pastel purple)
    secondary: '#9370DB',  // Medium purple
    accent: '#E6E6FA',     // Lavender
    light: '#F8F8FF',     // Ghost white
    dark: '#4B0082'       // Indigo
  }
};

// Current active colors (can be modified at runtime)
let CLIQUE_COLORS: Record<CliqueType, CliqueColorScheme> = { ...DEFAULT_CLIQUE_COLORS };

export const getCliqueColors = (clique: CliqueType): CliqueColorScheme => {
  return CLIQUE_COLORS[clique];
};

export const setCliquePrimaryColor = (clique: CliqueType, hexColor: string): void => {
  // Generate complementary colors from the primary hex
  const primary = hexColor;
  const secondary = darkenColor(hexColor, 0.3);
  const accent = lightenColor(hexColor, 0.2);
  const light = lightenColor(hexColor, 0.8);
  const dark = darkenColor(hexColor, 0.7);

  CLIQUE_COLORS[clique] = {
    primary,
    secondary,
    accent,
    light,
    dark
  };
};

export const resetCliqueColors = (): void => {
  CLIQUE_COLORS = { ...DEFAULT_CLIQUE_COLORS };
};

// Helper functions to generate color variations
function darkenColor(hex: string, factor: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  return rgbToHex(
    Math.round(rgb.r * (1 - factor)),
    Math.round(rgb.g * (1 - factor)),
    Math.round(rgb.b * (1 - factor))
  );
}

function lightenColor(hex: string, factor: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  return rgbToHex(
    Math.round(rgb.r + (255 - rgb.r) * factor),
    Math.round(rgb.g + (255 - rgb.g) * factor),
    Math.round(rgb.b + (255 - rgb.b) * factor)
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export const getCliqueIcon = (clique: CliqueType): string => {
  switch (clique) {
    case 'GEEK': return '🤓';
    case 'JOCK': return '🏈';
    case 'PREP': return '💅';
    case 'FREAK': return '🖤';
    default: return '❓';
  }
};

export const getCliqueName = (clique: CliqueType): string => {
  switch (clique) {
    case 'GEEK': return 'GEEKS';
    case 'JOCK': return 'JOCKS';
    case 'PREP': return 'PREPS';
    case 'FREAK': return 'FREAKS';
    default: return 'UNKNOWN';
  }
};
