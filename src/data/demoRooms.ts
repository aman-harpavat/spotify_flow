import {
  ArcType,
  DemoFlowKey,
  DiagnosticChip,
  FlowRoom,
  FollowUpOption,
  PulseState,
  RoomMemory,
  Track
} from "../domain/types";

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

type QueueSnapshot = {
  key: string;
  trackQueue: string[];
  pulse?: PulseState;
  helperText?: string;
  memory?: Partial<RoomMemory>;
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
  },
  {
    id: "resham-hawa-mira",
    title: "Resham Hawa",
    artist: "Mira",
    duration: "3:43",
    coverGradient: "from-[#6b7db0] via-[#394368] to-[#161720]",
    tags: ["soft", "airy"]
  },
  {
    id: "naram-si-raat-vedika",
    title: "Naram Si Raat",
    artist: "Vedika",
    duration: "3:31",
    coverGradient: "from-[#6d5a84] via-[#35263f] to-[#141118]",
    tags: ["night", "soft"]
  },
  {
    id: "chupke-baarish-aarav",
    title: "Chupke Baarish",
    artist: "Aarav",
    duration: "3:54",
    coverGradient: "from-[#2f5f74] via-[#203947] to-[#0f151a]",
    tags: ["rain", "quiet"]
  },
  {
    id: "dheere-se-anika",
    title: "Dheere Se",
    artist: "Anika",
    duration: "3:40",
    coverGradient: "from-[#846a4d] via-[#453323] to-[#17120f]",
    tags: ["gentle", "close"]
  },
  {
    id: "saans-halki-zoya",
    title: "Saans Halki",
    artist: "Zoya",
    duration: "3:36",
    coverGradient: "from-[#5d8474] via-[#2a473f] to-[#121714]",
    tags: ["light", "soft"]
  },
  {
    id: "mitti-aur-dhuaan-arohi",
    title: "Mitti Aur Dhuaan",
    artist: "Arohi",
    duration: "4:05",
    coverGradient: "from-[#76624f] via-[#403127] to-[#161210]",
    tags: ["earthy", "deep"]
  },
  {
    id: "sannata-advait",
    title: "Sannata",
    artist: "Advait",
    duration: "3:22",
    coverGradient: "from-[#3f5062] via-[#222932] to-[#101216]",
    tags: ["quiet", "minimal"]
  },
  {
    id: "noorani-raat-tara",
    title: "Noorani Raat",
    artist: "Tara",
    duration: "3:58",
    coverGradient: "from-[#6f6896] via-[#3c3754] to-[#15131c]",
    tags: ["glow", "night"]
  },
  {
    id: "bheegi-dhoop-ishan",
    title: "Bheegi Dhoop",
    artist: "Ishan",
    duration: "3:47",
    coverGradient: "from-[#4f7c83] via-[#294048] to-[#111518]",
    tags: ["rain", "warm"]
  },
  {
    id: "lift-off-zedha",
    title: "Lift Off",
    artist: "Zedha",
    duration: "3:01",
    coverGradient: "from-[#d86f31] via-[#7b2c20] to-[#170d10]",
    tags: ["workout", "fresh"]
  },
  {
    id: "iron-pulse-kairo",
    title: "Iron Pulse",
    artist: "Kairo",
    duration: "2:56",
    coverGradient: "from-[#6d707b] via-[#343741] to-[#131416]",
    tags: ["lift", "pulse"]
  },
  {
    id: "fuel-state-nox",
    title: "Fuel State",
    artist: "Nox",
    duration: "3:10",
    coverGradient: "from-[#8f4e24] via-[#512519] to-[#160d10]",
    tags: ["drive", "gym"]
  },
  {
    id: "night-sprint-ariv",
    title: "Night Sprint",
    artist: "Ariv",
    duration: "3:18",
    coverGradient: "from-[#33567d] via-[#203248] to-[#10131a]",
    tags: ["run", "night"]
  },
  {
    id: "runline-jett",
    title: "Runline",
    artist: "Jett",
    duration: "3:02",
    coverGradient: "from-[#6f8a39] via-[#39491d] to-[#131610]",
    tags: ["cardio", "fresh"]
  },
  {
    id: "surgeframe-riko",
    title: "Surgeframe",
    artist: "Riko",
    duration: "3:09",
    coverGradient: "from-[#7b5aa0] via-[#40295d] to-[#15111d]",
    tags: ["tempo", "push"]
  },
  {
    id: "motion-code-lyra",
    title: "Motion Code",
    artist: "Lyra",
    duration: "3:14",
    coverGradient: "from-[#3f8c82] via-[#20504d] to-[#111716]",
    tags: ["new", "motion"]
  },
  {
    id: "breakpoint-eshan",
    title: "Breakpoint",
    artist: "Eshan",
    duration: "3:07",
    coverGradient: "from-[#d16f2b] via-[#733125] to-[#180d11]",
    tags: ["sharp", "fresh"]
  },
  {
    id: "kinetic-heat-vaan",
    title: "Kinetic Heat",
    artist: "Vaan",
    duration: "3:21",
    coverGradient: "from-[#9d4f38] via-[#56251d] to-[#170e10]",
    tags: ["heat", "gym"]
  },
  {
    id: "aero-rush-mivik",
    title: "Aero Rush",
    artist: "Mivik",
    duration: "3:12",
    coverGradient: "from-[#4483a2] via-[#22445c] to-[#10151b]",
    tags: ["aero", "run"]
  },
  {
    id: "crossfade-run-tyra",
    title: "Crossfade Run",
    artist: "Tyra",
    duration: "3:17",
    coverGradient: "from-[#7c6a2b] via-[#45391b] to-[#17130f]",
    tags: ["run", "steady"]
  },
  {
    id: "raagline-iva",
    title: "Raagline",
    artist: "Iva",
    duration: "4:02",
    coverGradient: "from-[#72865c] via-[#39452e] to-[#151712]",
    tags: ["raag", "grounded"]
  },
  {
    id: "safar-dheema-samar",
    title: "Safar Dheema",
    artist: "Samar",
    duration: "3:50",
    coverGradient: "from-[#5d6f91] via-[#313a58] to-[#12141b]",
    tags: ["slow", "emotional"]
  },
  {
    id: "dil-se-door-kavir",
    title: "Dil Se Door",
    artist: "Kavir",
    duration: "3:46",
    coverGradient: "from-[#87576e] via-[#442535] to-[#171116]",
    tags: ["melodic", "close"]
  },
  {
    id: "noor-path-meher",
    title: "Noor Path",
    artist: "Meher",
    duration: "3:39",
    coverGradient: "from-[#73847d] via-[#38423d] to-[#141715]",
    tags: ["warm", "grounded"]
  },
  {
    id: "aabshaar-niyati",
    title: "Aabshaar",
    artist: "Niyati",
    duration: "4:06",
    coverGradient: "from-[#4c7190] via-[#26384b] to-[#10131a]",
    tags: ["water", "calm"]
  },
  {
    id: "sheher-ka-chand-tara-v",
    title: "Sheher Ka Chand",
    artist: "Tara V",
    duration: "3:57",
    coverGradient: "from-[#907254] via-[#493323] to-[#171210]",
    tags: ["city", "night"]
  },
  {
    id: "chalte-reh-avik",
    title: "Chalte Reh",
    artist: "Avik",
    duration: "3:34",
    coverGradient: "from-[#6a7f94] via-[#34404d] to-[#121518]",
    tags: ["forward", "melodic"]
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

export const steeringSnapshots: Partial<
  Record<DemoFlowKey, Partial<Record<DiagnosticChip | FollowUpOption | "nl_refine", QueueSnapshot>>>
> = {
  rainy_evening: {
    softer: {
      key: "rainy-softer",
      pulse: "going_deeper",
      trackQueue: [
        "khidki-noor",
        "resham-hawa-mira",
        "naram-si-raat-vedika",
        "chupke-baarish-aarav",
        "dheere-se-anika",
        "saans-halki-zoya"
      ],
      memory: {
        acceptedDirections: ["softer"],
        moodCorrections: ["softer"]
      }
    }
  },
  fresh_workout: {
    too_familiar: {
      key: "workout-too-familiar",
      pulse: "getting_fresher",
      trackQueue: [
        "lift-off-zedha",
        "iron-pulse-kairo",
        "fuel-state-nox",
        "night-sprint-ariv",
        "runline-jett",
        "surgeframe-riko"
      ],
      memory: {
        rejectedDirections: ["too_familiar"]
      }
    }
  },
  melodic_surprise: {
    too_different: {
      key: "surprise-too-different",
      pulse: "pulling_back",
      trackQueue: [
        "sitar-bloom-anvi",
        "raagline-iva",
        "safar-dheema-samar",
        "dil-se-door-kavir",
        "noor-path-meher",
        "aabshaar-niyati"
      ],
      memory: {
        rejectedDirections: ["too_different"]
      }
    },
    nl_refine: {
      key: "surprise-nl-refine",
      trackQueue: [
        "safar-dheema-samar",
        "noor-path-meher",
        "dil-se-door-kavir",
        "aabshaar-niyati",
        "sheher-ka-chand-tara-v",
        "chalte-reh-avik"
      ],
      memory: {
        acceptedDirections: ["more_emotional", "less_noisy"]
      }
    }
  }
};

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

export const followUpLabels: Record<FollowUpOption, string> = {
  happier: "Happier",
  sadder: "Sadder",
  softer: "Softer",
  darker: "Darker",
  calmer: "Calmer",
  more_energetic: "More energetic",
  slower: "Slower",
  faster: "Faster"
};
