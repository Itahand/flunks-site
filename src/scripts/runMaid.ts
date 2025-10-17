import readline from "node:readline";
import { DialogueEngine, normalizeChoice } from "../lib/dialogue";
import { maidGraph } from "../lib/maidGraph";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const engine = new DialogueEngine(maidGraph);

function showNode() {
  const node = engine.getNode();
  console.log(`\n[${node.speaker.toUpperCase()}] ${node.text}`);
  console.log(`  (yes) ${node.options.yes.label}`);
  console.log(`  (no)  ${node.options.no.label}`);
}

function ask() {
  rl.question("\nChoose (yes/no or freeform): ", (answer) => {
    const choice = normalizeChoice(answer);
    const nextNode = engine.step(choice);
    showNode();
    const flags = engine.getFlags();
    const successFlag = maidGraph.meta.success_flag;
    if (successFlag && flags.has(successFlag)) {
      console.log(`\n🎯 Objective set: ${successFlag}`);
    }
    ask();
  });
}

showNode();
ask();
