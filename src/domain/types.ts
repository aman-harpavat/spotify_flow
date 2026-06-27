export type ArcType = "deep_dive" | "refresh" | "surprise_me";
export type RoomStatus = "temporary" | "saved";
export type PulseState =
  | "staying_close"
  | "getting_fresher"
  | "going_deeper"
  | "pulling_back";

export type DemoFlowKey = "rainy_evening" | "fresh_workout" | "melodic_surprise";
export type DiagnosticChip =
  | "too_familiar"
  | "too_different"
  | "wrong_mood"
  | "wrong_energy";
export type FollowUpType = "mood" | "energy" | null;
export type FollowUpOption =
  | "happier"
  | "sadder"
  | "softer"
  | "darker"
  | "calmer"
  | "more_energetic"
  | "slower"
  | "faster";

export type Track = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverGradient: string;
  tags: string[];
};

export type RoomMemory = {
  skippedTrackIds: string[];
  savedTrackIds: string[];
  acceptedDirections: string[];
  rejectedDirections: string[];
  explorationTolerance: "low" | "medium" | "high";
  moodCorrections: string[];
  energyCorrections: string[];
};

export type FlowRoom = {
  id: string;
  demoFlow: DemoFlowKey;
  title: string;
  prompt: string;
  starterPrompt: string;
  arc: ArcType;
  status: RoomStatus;
  pulse: PulseState;
  helperText: string;
  roomDescription: string;
  currentTrackId: string;
  trackQueue: string[];
  memory: RoomMemory;
  testHint: string;
};
