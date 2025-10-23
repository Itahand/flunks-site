"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import type { HiddenRiffPreset, MajorChord } from "lib/hiddenRiffPresets";
import { playToneChord, warmToneChordPlayer } from "utils/toneChordPlayer";

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    transform: scale(0.92);
    transform-origin: top left;
  }
`;

const Panel = styled.div`
  background: #181818;
  border: 2px solid #333;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35), inset 0 0 0 1px rgba(255, 255, 255, 0.04);
`;

const Wheel = styled.div`
  position: relative;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 50%, #222, #141414 72%);
  border: 2px solid #363636;
`;

const Wedge = styled.button<{ active?: boolean; pulse?: boolean }>`
  position: absolute;
  inset: 0;
  background: conic-gradient(
    from var(--start-angle),
    ${({ active }) => (active ? "#ffd95e" : "#272727")} var(--span),
    transparent var(--span)
  );
  -webkit-mask: radial-gradient(circle at 50% 50%, transparent 35%, black 36%);
  mask: radial-gradient(circle at 50% 50%, transparent 35%, black 36%);
  border: none;
  cursor: pointer;
  transition: filter 0.15s ease;
  ${({ pulse }) => (pulse ? `animation: pulse 0.9s ease-in-out infinite;` : "")}

  @keyframes pulse {
    0%,
    100% {
      filter: brightness(1);
    }
    50% {
      filter: brightness(1.2);
    }
  }
`;

const WedgeLabel = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #f2f2f2;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
`;

const StrumPad = styled.div`
  height: 140px;
  width: 280px;
  border-radius: 12px;
  background: linear-gradient(#1b1b1b, #121212);
  border: 2px solid #333;
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  overflow: hidden;
  user-select: none;
  touch-action: none;

  > div {
    border-top: 1px solid #242424;
  }
`;

const PipBar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;

  > span {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #242424;
    border: 1px solid #3e3e3e;
  }

  > span.ok {
    background: #5dd882;
    border-color: #34965a;
    box-shadow: 0 0 0 2px rgba(93, 216, 130, 0.2);
  }

  > span.cur {
    box-shadow: 0 0 0 2px rgba(255, 217, 94, 0.28);
  }

  > span.fail {
    background: #d86a6a;
    border-color: #9f4545;
  }
`;

type BeatState = "idle" | "preview" | "input" | "success" | "fail";

type HiddenRiffProps = {
  preset: HiddenRiffPreset;
  onComplete?: (payload: {
    presetId: string;
    perfect: boolean;
    misses: number;
    ms: number;
  }) => void;
  showHints?: boolean;
  useToneSynth?: boolean;
};

const loadAudio = (label: MajorChord) => new Audio(`/audio/chords/${label}.mp3`);

const useChordAudioMap = (wheel: MajorChord[], sequence: MajorChord[]) =>
  useMemo(() => {
    const map = new Map<MajorChord, HTMLAudioElement>();
    const unique = new Set<MajorChord>([...wheel, ...sequence]);
    unique.forEach((label) => {
      map.set(label, loadAudio(label));
    });
    return map;
  }, [wheel.join("|"), sequence.join("|")]);

const HiddenRiff = ({ preset, onComplete, showHints = true, useToneSynth = false }: HiddenRiffProps) => {
  const { tempoBPM, beatWindowMs, wheel, sequence, checkpoints } = preset;

  const audioMap = useChordAudioMap(wheel, sequence);
  const beatDurationMs = useMemo(() => 60000 / tempoBPM, [tempoBPM]);

  const [selectedChord, setSelectedChord] = useState<MajorChord>(wheel[0]);
  const [state, setState] = useState<BeatState>("idle");
  const [index, setIndex] = useState(0);
  const [misses, setMisses] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const lastStrumRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const previewRef = useRef<number | null>(null);
  const recapRef = useRef<number | null>(null);
  const indexRef = useRef(0);
  const missesRef = useRef(0);
  const selectedRef = useRef<MajorChord>(wheel[0]);

  const stopBeatLoop = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopPreview = () => {
    if (previewRef.current !== null) {
      window.clearInterval(previewRef.current);
      previewRef.current = null;
    }
  };

  const stopRecap = () => {
    if (recapRef.current !== null) {
      window.clearInterval(recapRef.current);
      recapRef.current = null;
    }
  };

  const stopAllLoops = () => {
    stopBeatLoop();
    stopPreview();
    stopRecap();
  };

  const playChord = (label: MajorChord) => {
    if (useToneSynth) {
      playToneChord(label).catch(() => undefined);
      return;
    }

    const audio = audioMap?.get(label);
    if (!audio) return;
    audio.currentTime = 0;

    if (!audio.paused) {
      const clone = audio.cloneNode(true) as HTMLAudioElement;
      clone.play().catch(() => undefined);
      return;
    }

    audio.play().catch(() => undefined);
  };

  const handleStart = () => {
    stopAllLoops();
    setIndex(0);
    setMisses(0);
  indexRef.current = 0;
  missesRef.current = 0;
    setStartedAt(performance.now());
    setState("preview");

    if (useToneSynth) {
      warmToneChordPlayer().catch(() => undefined);
    }

    let previewIndex = 0;
    previewRef.current = window.setInterval(() => {
      playChord(sequence[previewIndex]);
      previewIndex += 1;
      if (previewIndex >= sequence.length) {
        stopPreview();
        setState("input");
        runInputLoop();
      }
    }, beatDurationMs);
  };

  const runInputLoop = () => {
    stopBeatLoop();
    stopPreview();
    stopRecap();

    timerRef.current = window.setInterval(() => {
      const now = performance.now();
      const lastStrum = lastStrumRef.current;
      const strummedInWindow = lastStrum !== 0 && now - lastStrum <= beatWindowMs;
      const currentIndex = indexRef.current;
      const needsChord = sequence[currentIndex];
  const playedCorrectChord = strummedInWindow && selectedRef.current === needsChord;

      if (playedCorrectChord) {
        const nextIndex = currentIndex + 1;
        setIndex(nextIndex);
        indexRef.current = nextIndex;
        if (nextIndex >= sequence.length) {
          stopBeatLoop();
          setState("success");
          const duration = startedAt ? now - startedAt : 0;
          onComplete?.({
            presetId: preset.id,
            perfect: missesRef.current === 0,
            misses: missesRef.current,
            ms: Math.round(duration),
          });
        }
      } else {
        stopBeatLoop();
        setMisses((prev) => {
          const next = prev + 1;
          missesRef.current = next;
          return next;
        });
        setState("fail");

        const checkpoint = [...checkpoints, 0]
          .filter((cp) => cp <= currentIndex)
          .sort((a, b) => b - a)[0] ?? 0;

        setIndex(checkpoint);
        indexRef.current = checkpoint;

        const phrase = sequence.slice(checkpoint, Math.min(checkpoint + 4, sequence.length));
        let recapIndex = 0;
        stopRecap();
        recapRef.current = window.setInterval(() => {
          playChord(phrase[recapIndex]);
          recapIndex += 1;
          if (recapIndex >= phrase.length) {
            stopRecap();
            setState("input");
            runInputLoop();
          }
        }, beatDurationMs * 1.2);
      }

      lastStrumRef.current = 0;
    }, beatDurationMs);
  };

  const handleReplay = () => {
    if (state === "idle") return;
    stopAllLoops();
    setState("preview");

    if (useToneSynth) {
      warmToneChordPlayer().catch(() => undefined);
    }

    let replayIndex = 0;
    previewRef.current = window.setInterval(() => {
      playChord(sequence[replayIndex]);
      replayIndex += 1;
      if (replayIndex >= sequence.length) {
        stopPreview();
        setState("input");
        runInputLoop();
      }
    }, beatDurationMs);
  };

  const handleStrum = () => {
    lastStrumRef.current = performance.now();
    if (useToneSynth) {
      warmToneChordPlayer().catch(() => undefined);
    }
    playChord(selectedChord);
  };

  const hintPulseIndex = showHints && misses >= 2 ? index : -1;

  useEffect(() => () => stopAllLoops(), []);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    missesRef.current = misses;
  }, [misses]);

  useEffect(() => {
    selectedRef.current = selectedChord;
  }, [selectedChord]);

  useEffect(() => {
    stopAllLoops();
    setState("idle");
    setIndex(0);
    setMisses(0);
    indexRef.current = 0;
    missesRef.current = 0;
    const firstChord = preset.wheel[0];
    setSelectedChord(firstChord);
    selectedRef.current = firstChord;
  }, [preset.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleStart();
        return;
      }

      if (event.key === " ") {
        event.preventDefault();
        handleReplay();
        return;
      }

      const pos = Number(event.key);
      if (!Number.isNaN(pos) && pos >= 1 && pos <= wheel.length) {
        setSelectedChord(wheel[pos - 1]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [wheel, state]);

  useEffect(() => {
    if (!wheel.includes(selectedChord)) {
      setSelectedChord(wheel[0]);
    }
  }, [wheel, selectedChord]);

  const wedges = useMemo(() => {
    const span = 360 / wheel.length;
    return wheel.map((label, i) => ({
      label,
      start: i * span,
      span,
    }));
  }, [wheel]);

  return (
    <Shell>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <Panel>
          <div className="flex flex-col items-center gap-3">
            <Wheel aria-label="Chord Wheel">
              {wedges.map(({ label, start, span }, indexPosition) => (
                <div key={label} style={{ position: "absolute", inset: 0 }}>
                  <Wedge
                    style={{
                      ["--start-angle" as never]: `${start}deg`,
                      ["--span" as never]: `${span}deg`,
                    }}
                    active={selectedChord === label}
                    pulse={hintPulseIndex === indexPosition}
                    onClick={() => setSelectedChord(label)}
                    aria-label={`Select chord ${label}`}
                    title={`${indexPosition + 1}. ${label}`}
                  />
                  <WedgeLabel
                    style={{
                      transform: `rotate(${start + span / 2}deg) translateY(-64px) rotate(-${start + span / 2}deg)`,
                    }}
                  >
                    <span
                      className={`px-2 py-1 rounded ${
                        selectedChord === label ? "bg-yellow-500 text-black" : "bg-black/40"
                      }`}
                    >
                      {label}
                    </span>
                  </WedgeLabel>
                </div>
              ))}
              <div
                style={{
                  position: "absolute",
                  inset: "32%",
                  borderRadius: "50%",
                  border: "2px solid #343434",
                  background: "#0d0d0d",
                }}
              />
            </Wheel>
            <div className="text-xs text-zinc-400">
              Tip: press 1–{wheel.length} to switch chords • Space = Replay • Enter = Start
            </div>
          </div>
        </Panel>

        <div className="flex flex-col gap-4 items-center">
          <Panel>
            <div className="flex flex-col gap-3 items-center">
              <div className="text-zinc-100 font-semibold">Strum</div>
              <StrumPad role="button" onMouseDown={handleStrum} onTouchStart={handleStrum} aria-label="Strum Pad">
                <div />
                <div />
                <div />
                <div />
                <div />
              </StrumPad>
              <div className="flex gap-2">
                <button
                  className="px-3 py-2 rounded bg-emerald-500 text-black font-semibold hover:brightness-110"
                  onClick={handleStart}
                >
                  {state === "idle" ? "Start" : "Restart"}
                </button>
                <button
                  className="px-3 py-2 rounded bg-zinc-700 text-zinc-100 hover:brightness-110 disabled:opacity-50"
                  onClick={handleReplay}
                  disabled={state === "idle"}
                >
                  Replay Riff
                </button>
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="flex flex-col items-center gap-3">
              <div className="text-zinc-100 font-semibold">Progress</div>
              <PipBar>
                {sequence.map((_, i) => {
                  const stateClass = i < index ? "ok" : i === index ? "cur" : "";
                  return <span key={`${preset.id}-pip-${i}`} className={stateClass} />;
                })}
              </PipBar>
              <div className="text-xs text-zinc-400">
                {misses} misses • {tempoBPM} BPM • Window ±{beatWindowMs}ms
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  );
};

export default HiddenRiff;
