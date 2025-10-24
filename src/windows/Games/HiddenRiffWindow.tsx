import { useMemo, useState } from "react";
import DraggableResizeableWindow from "components/DraggableResizeableWindow";
import HiddenRiff from "components/HiddenRiff";
import { WINDOW_IDS } from "fixed";
import { HIDDEN_RIFF_PRESETS } from "lib/hiddenRiffPresets";
import { useWindowsContext } from "contexts/WindowsContext";

const HiddenRiffWindow = () => {
  const { closeWindow } = useWindowsContext();
  // Locked to mystery preset only - no difficulty selection
  const [lastResult, setLastResult] = useState<{
    presetId: string;
    perfect: boolean;
    misses: number;
    ms: number;
  } | null>(null);
  const [useToneSynth, setUseToneSynth] = useState(true);

  const activePreset = useMemo(() => HIDDEN_RIFF_PRESETS.mystery, []);

  return (
    <DraggableResizeableWindow
      windowsId={WINDOW_IDS.HIDDEN_RIFF}
      headerTitle="Hidden Riff"
      headerIcon="/images/icons/controller-bg.png"
      onClose={() => closeWindow(WINDOW_IDS.HIDDEN_RIFF)}
      initialWidth="980px"
      initialHeight="720px"
      resizable
    >
      <div className="flex flex-col gap-6 text-zinc-100">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 text-sm leading-relaxed text-zinc-300">
            {activePreset.hints?.length ? (
              <div>
                <span className="font-semibold text-zinc-200">Hints:</span>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  {activePreset.hints.map((hint, index) => (
                    <li key={`${activePreset.id}-hint-${index}`}>{hint}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <span>No hints revealed yet. Study the room art for clues.</span>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-200 border border-zinc-700 rounded px-3 py-2 bg-zinc-900/60">
            <input
              type="checkbox"
              className="accent-emerald-500"
              checked={useToneSynth}
              onChange={(event) => setUseToneSynth(event.target.checked)}
            />
            <span className="font-semibold">Use generated tones</span>
          </label>
          {lastResult && (
            <div className="rounded border border-emerald-500/60 bg-emerald-500/10 px-4 py-3 text-sm">
              <div className="font-semibold text-emerald-300">Last run complete</div>
              <div className="mt-1 text-emerald-100">
                {lastResult.perfect ? "Perfect performance!" : `${lastResult.misses} misses recorded.`}
              </div>
              <div className="text-emerald-200">Time: {(lastResult.ms / 1000).toFixed(2)}s</div>
            </div>
          )}
        </div>

        <HiddenRiff
          preset={activePreset}
          showHints
          useToneSynth={useToneSynth}
          onComplete={(result) => {
            setLastResult(result);
          }}
        />

        <div className="text-xs text-zinc-500">
          {useToneSynth ? (
            <span>
              Audio is generated with <code>Tone.js</code> poly-synth voices, so you can ship without chord samples. Toggle the
              checkbox above if you want to use your own one-shots instead.
            </span>
          ) : (
            <span>
              Audio samples load from <code>/public/audio/chords/$&#123;chord&#125;.mp3</code>. Supply normalized one-shots for all major chords in this preset list (A–G).
            </span>
          )}
        </div>
      </div>
    </DraggableResizeableWindow>
  );
};

export default HiddenRiffWindow;
