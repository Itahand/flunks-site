import { useCallback, useMemo, useState } from "react";
import { DialogueEngine, DialogueGraph, DialogueNode, normalizeChoice } from "lib/dialogue";

export function useDialogue(graph: DialogueGraph) {
  const [engine] = useState(() => new DialogueEngine(graph));
  const [node, setNode] = useState<DialogueNode>(() => engine.getNode());
  const [flags, setFlags] = useState<Set<string>>(engine.getFlags());

  const choose = useCallback((raw: string) => {
    const choice = raw === "yes" || raw === "no" ? (raw as "yes" | "no") : normalizeChoice(raw);
    const nextNode = engine.step(choice);
    setNode(nextNode);
    setFlags(engine.getFlags());
  }, [engine]);

  const restart = useCallback(() => {
    const resetNode = engine.reset();
    setNode(resetNode);
    setFlags(engine.getFlags());
  }, [engine]);

  return useMemo(() => ({
    node,
    flags,
    chooseYes: () => choose("yes"),
    chooseNo: () => choose("no"),
    choose,
    restart,
  }), [node, flags, choose, restart]);
}
