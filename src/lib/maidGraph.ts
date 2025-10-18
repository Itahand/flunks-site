import type { DialogueGraph } from "./dialogue";

export const maidGraph: DialogueGraph = {
  meta: {
  title: "Paradise Motel - 'Round Back",
    restart_node: "start",
    success_flag: "objective_return_after_dark",
  location: "Paradise Motel - 'Round Back",
  },
  nodes: {
    start: {
      id: "start",
      speaker: "maid",
      text: "Hey - aren't you friends with my kid? Did he tell you to come down here?",
      options: {
        yes: { label: "I don't know you.", next: "start" },
        no: { label: "He said you might be able to help us.", next: "check_in" },
      },
    },
    check_in: {
      id: "check_in",
      speaker: "maid",
      text: "You know, I keep thinking about that day Flunko checked in. Such a sweet kid, always so polite. I was running errands when he arrived, never even got to say hello...",
      options: {
        yes: { label: "So you know he checked in.", next: "what_happened" },
        no: { label: "The cops said he was never here.", next: "start" },
      },
    },
    what_happened: {
      id: "what_happened",
      speaker: "maid",
      text: "Honestly? I don't know. Just rumors. Some say he never left his room, others swear they heard strange noises. All I know is the police have been crawling all over this place ever since.",
      options: {
        yes: { label: "Why didn't you stick around longer to help find him?", next: "start" },
        no: { label: "That must be hard on you.", next: "police_tired" },
      },
    },
    police_tired: {
      id: "police_tired",
      speaker: "maid",
      text: "Hard doesn't begin to cover it. They're here every other day asking the same questions. Manager's on edge, guests are spooked... I just want things to go back to normal, you know?",
      options: {
        yes: { label: "I understand completely.", next: "room_7_mention" },
        no: { label: "But why aren't you telling me more?", next: "start" },
      },
    },
    room_7_mention: {
      id: "room_7_mention",
      speaker: "maid",
      text: "You're here about Room 7, aren't you? I can see it in your eyes. You want to know what really happened.",
      options: {
        yes: { label: "You probably don't even know what happened.", next: "start" },
        no: { label: "I just need to know if he left any clues.", next: "timing_concern" },
      },
    },
    timing_concern: {
      id: "timing_concern",
      speaker: "maid",
      text: "Listen sweetie, you need to come back after dark. The police don't sit outside the door then. During the day? They're parked right there, watching everyone who comes and goes.",
      options: {
        yes: { label: "Just take me now, you work here!", next: "start" },
        no: { label: "So after dark is safer?", next: "the_plan" },
      },
    },
    the_plan: {
      id: "the_plan",
      speaker: "maid",
      text: "Here, take this. No one knows I have the spare. But you don't know where you got it from if you get caught.",
      options: {
        yes: { label: "Are you sure this is okay?", next: "start" },
        no: { label: "You got it. Thanks.", next: "final_warning" },
      },
      set_flags: ["objective_return_after_dark"],
    },
    final_warning: {
      id: "final_warning",
      speaker: "maid",
      text: "Seriously, be careful sneaking around out there. You don't know what you're up against.",
      options: {
        yes: { label: "Close", next: "start" },
        no: { label: "Close", next: "start" },
      },
    },
  },
};
