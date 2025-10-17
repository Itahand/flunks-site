export type Choice = "yes" | "no";

export interface DialogueOption {
  label: string;
  next: string;
}

export interface DialogueNode {
  id: string;
  speaker: "maid" | "system" | string;
  text: string;
  options: Record<Choice, DialogueOption>;
  tags?: string[];
  set_flags?: string[];
}

export interface DialogueGraph {
  meta: {
    title: string;
    restart_node: string;
    success_flag?: string;
    location?: string;
  };
  nodes: Record<string, DialogueNode>;
}

export function normalizeChoice(input: string): Choice {
  const s = input.trim().toLowerCase();
  const yesWords = ["y", "yes", "yeah", "yep", "sure", "ok", "okay", "fine", "alright", "affirmative", "1"];
  const noWords = ["n", "no", "nope", "nah", "negative", "2", "pass"];
  if (yesWords.includes(s)) return "yes";
  if (noWords.includes(s)) return "no";
  return "no";
}

export interface DialogueState {
  nodeId: string;
  flags: Set<string>;
}

export class DialogueEngine {
  private graph: DialogueGraph;
  private state: DialogueState;

  constructor(graph: DialogueGraph) {
    this.graph = graph;
    this.state = {
      nodeId: graph.meta.restart_node,
      flags: new Set<string>(),
    };
    if (!this.graph.nodes[this.graph.meta.restart_node]) {
      throw new Error(`restart_node "${this.graph.meta.restart_node}" not found in nodes`);
    }
  }

  getNode(): DialogueNode {
    const node = this.graph.nodes[this.state.nodeId];
    if (!node) throw new Error(`Node "${this.state.nodeId}" not found`);
    return node;
  }

  getFlags(): Set<string> {
    return new Set(this.state.flags);
  }

  step(choice: Choice): DialogueNode {
    const current = this.getNode();
    const opt = current.options[choice];
    if (!opt) throw new Error(`Choice "${choice}" not available on node "${current.id}"`);

    if (current.set_flags?.length) {
      for (const f of current.set_flags) this.state.flags.add(f);
    }

    const nextId = opt.next;
    if (!this.graph.nodes[nextId]) {
      this.state.nodeId = this.graph.meta.restart_node;
      return this.getNode();
    }

    this.state.nodeId = nextId;
    return this.getNode();
  }

  isDeadEnd(): boolean {
    return this.getNode().tags?.includes("dead_end") ?? false;
  }

  reset(): DialogueNode {
    this.state.nodeId = this.graph.meta.restart_node;
    return this.getNode();
  }
}
