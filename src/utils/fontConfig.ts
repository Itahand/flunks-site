// Font configuration for retro text dialogs
export interface FontConfig {
  name: string;
  family: string;
  size?: string;
  weight?: string;
}

export const RETRO_FONTS: FontConfig[] = [
  { 
    name: 'Classic Monospace', 
    family: "'Courier New', 'Courier', monospace",
    size: '14px',
    weight: 'normal'
  },
  { 
    name: 'DOS Terminal', 
    family: "'Perfect DOS VGA 437', 'Courier New', monospace",
    size: '14px',
    weight: 'normal'
  },
  { 
    name: 'Bitmap Classic', 
    family: "'Press Start 2P', 'Courier New', monospace",
    size: '12px',
    weight: 'normal'
  },
  { 
    name: 'System Font', 
    family: "system-ui, -apple-system, 'Segoe UI', sans-serif",
    size: '14px',
    weight: 'normal'
  },
  { 
    name: 'Terminal Green', 
    family: "'Monaco', 'Menlo', 'Consolas', monospace",
    size: '13px',
    weight: 'normal'
  },
  { 
    name: 'Retro Sans', 
    family: "'MS Sans Serif', 'Tahoma', 'Arial', sans-serif",
    size: '14px',
    weight: 'normal'
  },
  { 
    name: 'Pixelated', 
    family: "'Silkscreen', 'Press Start 2P', monospace",
    size: '12px',
    weight: 'normal'
  },
  { 
    name: 'Old School', 
    family: "'Chicago', 'Times', serif",
    size: '14px',
    weight: 'normal'
  },
  { 
    name: 'Windows 95', 
    family: "w95fa, 'MS Sans Serif', sans-serif",
    size: '14px',
    weight: 'normal'
  },
  { 
    name: 'Sci-Fi', 
    family: "'Orbitron', 'Courier New', monospace",
    size: '13px',
    weight: 'normal'
  },
  { 
    name: 'Code Font', 
    family: "'Fira Code', 'Consolas', monospace",
    size: '13px',
    weight: 'normal'
  }
];

// Clique-specific fonts for personality
export const CLIQUE_FONTS: Record<string, FontConfig> = {
  GEEK: { 
    name: 'Terminal Code', 
    family: "'Fira Code', 'Monaco', 'Consolas', monospace",
    size: '13px',
    weight: 'normal'
  },
  JOCK: { 
    name: 'Bold Athletic', 
    family: "'Oswald', 'Impact', 'Arial Black', sans-serif",
    size: '14px',
    weight: 'bold'
  },
  PREP: { 
    name: 'Classic Serif', 
    family: "'Times New Roman', 'Georgia', serif",
    size: '14px',
    weight: 'normal'
  },
  FREAK: { 
    name: 'Pixel Art', 
    family: "'Press Start 2P', 'Courier New', monospace",
    size: '12px',
    weight: 'normal'
  }
};

// Current active font (can be changed)
let currentFont: FontConfig = RETRO_FONTS[0]; // Default to Classic Monospace

export const getCurrentFont = (): FontConfig => currentFont;

export const setCurrentFont = (font: FontConfig): void => {
  currentFont = font;
};

export const setFontByFamily = (fontFamily: string): void => {
  const found = RETRO_FONTS.find(f => f.family === fontFamily);
  if (found) {
    currentFont = found;
  }
};

export const getCliqueFont = (clique: string): FontConfig => {
  return CLIQUE_FONTS[clique] || currentFont;
};

export const getFontStyle = (clique?: string) => {
  const font = clique ? getCliqueFont(clique) : currentFont;
  return {
    fontFamily: font.family,
    fontSize: font.size || '14px',
    fontWeight: font.weight || 'normal',
    lineHeight: '1.5',
    color: '#FFFFFF', // White text for better contrast on pastels
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', // Stronger shadow for white text
  };
};
