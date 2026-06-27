import { ArcType, DemoFlowKey, FlowRoom, PulseState, RoomMemory, Track } from "../domain/types";

type DemoFlowDefinition = {
  id: DemoFlowKey;
  starterPrompt: string;
  prompt: string;
  title: string;
  suggestedArc: ArcType;
  helperText: string;
  pulse: PulseState;
  testHint: string;
  roomDescription: string;
  currentTrackId: string;
  trackQueue: string[];
};

const trackCatalogEntries: Track[] = [
  {
    id: "shaam-aisha-khan",
    title: "Shaam",
    artist: "Aisha Khan",
    duration: "3:48",
    coverGradient: "from-[#24555a] via-[#18333a] to-[#0b1518]",
    tags: ["soft", "hindi", "rainy"]
  },
  {
    id: "baarish-mein-rohan-mehta",
    title: "Baarish Mein",
    artist: "Rohan Mehta",
    duration: "4:02",
    coverGradient: "from-[#34677c] via-[#2b3c66] to-[#16192e]",
    tags: ["rainy", "mellow"]
  },
  {
    id: "dheemi-raat-kavya",
    title: "Dheemi Raat",
    artist: "Kavya",
    duration: "3:34",
    coverGradient: "from-[#754d73] via-[#3c2446] to-[#15111d]",
    tags: ["night", "soft"]
  },
  {
    id: "mitti-ki-khushboo-arjun-sen",
    title: "Mitti Ki Khushboo",
    artist: "Arjun Sen",
    duration: "4:11",
    coverGradient: "from-[#6c6036] via-[#3c2f1c] to-[#17120f]",
    tags: ["earthy", "acoustic"]
  },
  {
    id: "khidki-noor",
    title: "Khidki",
    artist: "Noor",
    duration: "3:27",
    coverGradient: "from-[#305f5f] via-[#203840] to-[#0c1117]",
    tags: ["intimate", "soft"]
  },
  {
    id: "aasman-neecha-ira",
    title: "Aasman Neecha",
    artist: "Ira",
    duration: "4:07",
    coverGradient: "from-[#656ba0] via-[#36375e] to-[#13131d]",
    tags: ["dreamy", "monsoon"]
  },
  {
    id: "charge-up-nova-run",
    title: "Charge Up",
    artist: "Nova Run",
    duration: "3:05",
    coverGradient: "from-[#8b4f1f] via-[#58251a] to-[#180d12]",
    tags: ["workout", "energy"]
  },
  {
    id: "fireline-kmx",
    title: "Fireline",
    artist: "KMX",
    duration: "2:58",
    coverGradient: "from-[#d35b28] via-[#7d2227] to-[#1a0d13]",
    tags: ["gym", "high-energy"]
  },
  {
    id: "pulse-beat-rey",
    title: "Pulse Beat",
    artist: "Rey",
    duration: "3:12",
    coverGradient: "from-[#a06b1f] via-[#5c3618] to-[#181111]",
    tags: ["cardio", "punchy"]
  },
  {
    id: "high-gear-axton",
    title: "High Gear",
    artist: "Axton",
    duration: "3:26",
    coverGradient: "from-[#5f7b2a] via-[#2e4217] to-[#111510]",
    tags: ["run", "bright"]
  },
  {
    id: "core-mode-vira",
    title: "Core Mode",
    artist: "Vira",
    duration: "3:16",
    coverGradient: "from-[#755d9c] via-[#3d2854] to-[#15111d]",
    tags: ["lift", "steady"]
  },
  {
    id: "sprint-echo-t99",
    title: "Sprint Echo",
    artist: "T99",
    duration: "2:49",
    coverGradient: "from-[#2a7080] via-[#183746] to-[#0e1319]",
    tags: ["sprint", "tempo"]
  },
  {
    id: "raahi-unknown-dev-rai",
    title: "Raahi Unknown",
    artist: "Dev Rai",
    duration: "3:58",
    coverGradient: "from-[#537b91] via-[#273646] to-[#11151d]",
    tags: ["melodic", "indian"]
  },
  {
    id: "sitar-bloom-anvi",
    title: "Sitar Bloom",
    artist: "Anvi",
    duration: "4:15",
    coverGradient: "from-[#79925f] via-[#39452c] to-[#151713]",
    tags: ["sitar", "organic"]
  },
  {
    id: "monsoon-shapes-yuvan",
    title: "Monsoon Shapes",
    artist: "Yuvan",
    duration: "3:41",
    coverGradient: "from-[#4b688d] via-[#293853] to-[#11151b]",
    tags: ["melodic", "ambient"]
  },
  {
    id: "parallel-sky-niva",
    title: "Parallel Sky",
    artist: "Niva",
    duration: "3:36",
    coverGradient: "from-[#9b5f84] via-[#4f2945] to-[#17111a]",
    tags: ["airy", "surprise"]
  },
  {
    id: "dune-lights-reva",
    title: "Dune Lights",
    artist: "Reva",
    duration: "4:03",
    coverGradient: "from-[#9e7a47] via-[#4b341f] to-[#171210]",
    tags: ["textural", "melodic"]
  },
  {
    id: "echo-bazaar-kian",
    title: "Echo Bazaar",
    artist: "Kian",
    duration: "3:29",
    coverGradient: "from-[#44736d] via-[#21413b] to-[#101615]",
    tags: ["bazaar", "rhythmic"]
  }
];

export const trackCatalog = Object.fromEntries(trackCatalogEntries.map((track) => [track.id, track]));

const emptyMemory = (): RoomMemory => ({
  skippedTrackIds: [],
  savedTrackIds: [],
  acceptedDirections: [],
  rejectedDirections: [],
  explorationTolerance: "medium",
  moodCorrections: [],
  energyCorrections: []
});

export const demoFlows: Record<DemoFlowKey, DemoFlowDefinition> = {
  rainy_evening: {
    id: "rainy_evening",
    starterPrompt: "Rainy evening Hindi",
    prompt: "Soft Hindi songs for a rainy evening",
    title: "Rainy Evening Flow",
    suggestedArc: "deep_dive",
    helperText: "Exploring soft Hindi for a rainy evening",
    pulse: "staying_close",
    testHint: "Try Wrong mood and Save room",
    roomDescription: "A soft, rain-soaked Hindi room for slower evenings and close listening.",
    currentTrackId: "shaam-aisha-khan",
    trackQueue: [
      "shaam-aisha-khan",
      "baarish-mein-rohan-mehta",
      "dheemi-raat-kavya",
      "mitti-ki-khushboo-arjun-sen",
      "khidki-noor",
      "aasman-neecha-ira"
    ]
  },
  fresh_workout: {
    id: "fresh_workout",
    starterPrompt: "Fresh workout music",
    prompt: "Fresh workout music without my usual tracks",
    title: "Fresh Workout Flow",
    suggestedArc: "refresh",
    helperText: "Refreshing your workout rotation",
    pulse: "staying_close",
    testHint: "Try Too familiar and Adjust room",
    roomDescription: "A high-energy workout room built to feel fresh without losing momentum.",
    currentTrackId: "charge-up-nova-run",
    trackQueue: [
      "charge-up-nova-run",
      "fireline-kmx",
      "pulse-beat-rey",
      "high-gear-axton",
      "core-mode-vira",
      "sprint-echo-t99"
    ]
  },
  melodic_surprise: {
    id: "melodic_surprise",
    starterPrompt: "Surprise me",
    prompt: "Surprise me, but keep it Indian and melodic",
    title: "Melodic Surprise Flow",
    suggestedArc: "surprise_me",
    helperText: "Exploring something new without losing your vibe",
    pulse: "staying_close",
    testHint: "Try Too different, then refine with text",
    roomDescription: "A melodic Indian discovery room that starts adventurous without drifting too far.",
    currentTrackId: "raahi-unknown-dev-rai",
    trackQueue: [
      "raahi-unknown-dev-rai",
      "sitar-bloom-anvi",
      "monsoon-shapes-yuvan",
      "parallel-sky-niva",
      "dune-lights-reva",
      "echo-bazaar-kian"
    ]
  }
};

export const promptToDemoFlow: Record<string, DemoFlowKey> = Object.fromEntries(
  Object.values(demoFlows).map((flow) => [flow.starterPrompt, flow.id])
) as Record<string, DemoFlowKey>;

export function createRoomFromFlow(flowId: DemoFlowKey, arcOverride?: ArcType): FlowRoom {
  const flow = demoFlows[flowId];
  const arc = arcOverride ?? flow.suggestedArc;

  return {
    id: `${flow.id}-${Date.now()}`,
    demoFlow: flow.id,
    title: flow.title,
    prompt: flow.prompt,
    starterPrompt: flow.starterPrompt,
    arc,
    status: "temporary",
    pulse: flow.pulse,
    helperText: flow.helperText,
    roomDescription: flow.roomDescription,
    currentTrackId: flow.currentTrackId,
    trackQueue: flow.trackQueue,
    memory: emptyMemory(),
    testHint: flow.testHint
  };
}

export const arcLabels: Record<ArcType, string> = {
  deep_dive: "Deep Dive",
  refresh: "Refresh",
  surprise_me: "Surprise Me"
};

export const arcDisplayNames: Record<ArcType, string> = {
  deep_dive: "Stay in the mood",
  refresh: "Freshen it up",
  surprise_me: "Take me somewhere new"
};

export const arcDescriptions: Record<ArcType, string> = {
  deep_dive: "Keeps the same overall feel and digs further into it.",
  refresh: "Keeps the energy, but pulls in newer releases and fresher picks.",
  surprise_me: "Leans toward more unfamiliar songs while still fitting your vibe."
};

export const pulseLabels: Record<PulseState, string> = {
  staying_close: "Starts with your vibe",
  getting_fresher: "Getting fresher",
  going_deeper: "Going deeper",
  pulling_back: "Pulling back"
};

export function durationToSeconds(duration: string): number {
  const [minutes, seconds] = duration.split(":").map(Number);

  return minutes * 60 + seconds;
}

export function formatPlaybackTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
