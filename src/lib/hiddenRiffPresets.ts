export const MAJOR_CHORDS = ["A", "B", "C", "D", "E", "F", "G"] as const;

export type MajorChord = (typeof MAJOR_CHORDS)[number];

export type HiddenRiffPreset = {
  id: string;
  tempoBPM: number;
  beatWindowMs: number;
  checkpoints: number[];
  wheel: MajorChord[];
  sequence: MajorChord[];
  hints?: string[];
};

export const PRESET_EASY: HiddenRiffPreset = {
  id: "hidden-riff-01",
  tempoBPM: 92,
  beatWindowMs: 260,
  checkpoints: [2],
  wheel: ["C", "F", "G", "A"],
  sequence: ["C", "F", "G", "C"],
  hints: [
    "Start with the bright tonic you see glowing in the poster.",
    "Climb to the four, then five, then land where you began.",
  ],
};

export const PRESET_MEDIUM: HiddenRiffPreset = {
  id: "hidden-riff-02",
  tempoBPM: 96,
  beatWindowMs: 240,
  checkpoints: [2],
  wheel: ["D", "A", "E", "G", "C"],
  sequence: ["D", "A", "G", "D"],
  hints: [
    "Think of the stadium chant hidden on the bulletin board.",
    "Open with D, jump to the dominant, step down, finish on D again.",
  ],
};

export const PRESET_MYSTERY: HiddenRiffPreset = {
  id: "hidden-riff-03",
  tempoBPM: 88,
  beatWindowMs: 280,
  checkpoints: [2],
  wheel: ["E", "B", "A", "F", "C", "G"],
  sequence: ["E", "G", "A", "E"],
  hints: [
    "Follow the neon arrows: right, up, left, home.",
    "It starts on the bright key taped to the amp.",
  ],
};

export const HIDDEN_RIFF_PRESETS = {
  easy: PRESET_EASY,
  medium: PRESET_MEDIUM,
  mystery: PRESET_MYSTERY,
};
