import type { MajorChord } from "lib/hiddenRiffPresets";

let toneModulePromise: Promise<typeof import("tone")> | null = null;
let polySynth: import("tone").PolySynth<import("tone").Synth> | null = null;

const MAJOR_CHORD_NOTES: Record<MajorChord, string[]> = {
  A: ["A3", "C#4", "E4"],
  B: ["B3", "D#4", "F#4"],
  C: ["C3", "E3", "G3"],
  D: ["D3", "F#3", "A3"],
  E: ["E3", "G#3", "B3"],
  F: ["F3", "A3", "C4"],
  G: ["G3", "B3", "D4"],
};

const getToneModule = async () => {
  if (!toneModulePromise) {
    toneModulePromise = import("tone");
  }
  return toneModulePromise;
};

export const warmToneChordPlayer = async () => {
  const Tone = await getToneModule();
  if (!polySynth) {
    polySynth = new Tone.PolySynth(Tone.Synth, {
      volume: -6,
      envelope: {
        attack: 0.02,
        decay: 0.2,
        sustain: 0.6,
        release: 0.8,
      },
      oscillator: {
        type: "triangle",
      },
    }).toDestination();
  }
  await Tone.start();
  await Tone.loaded();
};

export const playToneChord = async (chord: MajorChord) => {
  await warmToneChordPlayer();
  const notes = MAJOR_CHORD_NOTES[chord];
  if (!notes) return;
  polySynth?.triggerAttackRelease(notes, "8n");
};

export const disposeToneChordPlayer = () => {
  if (polySynth) {
    polySynth.dispose();
    polySynth = null;
  }
};
