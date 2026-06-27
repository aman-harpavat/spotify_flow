import { create } from "zustand";
import {
  createGeneratedDemoTrack,
  createRoomFromFlow,
  demoFlows,
  promptToDemoFlow,
  previewQueue,
  steeringSnapshots,
  trackCatalog
} from "../../data/demoRooms";
import {
  ArcType,
  DiagnosticChip,
  FlowRoom,
  FollowUpOption,
  FollowUpType
} from "../../domain/types";

export type LauncherStep = "prompt" | "arc";

type ToastState = {
  title: string;
  message: string;
} | null;

type FlowStore = {
  isLauncherOpen: boolean;
  launcherStep: LauncherStep;
  isQueueOpen: boolean;
  queueRevision: number;
  promptDraft: string;
  selectedStarterPrompt: string | null;
  keepSeparateProfile: boolean;
  suggestedArc: ArcType | null;
  selectedArc: ArcType | null;
  activeRoom: FlowRoom | null;
  currentTrackIndex: number;
  previewCurrentTrackIndex: number;
  isPlaying: boolean;
  playbackProgressSeconds: number;
  selectedDiagnosticChip: DiagnosticChip | null;
  visibleFollowUpType: FollowUpType;
  refinementDraft: string;
  toast: ToastState;
  openLauncher: () => void;
  closeLauncher: () => void;
  toggleQueue: () => void;
  setPromptDraft: (value: string) => void;
  selectStarterPrompt: (value: string) => void;
  toggleSeparateProfile: () => void;
  setSelectedArc: (value: ArcType) => void;
  submitLauncher: () => { ok: boolean; error?: string };
  goBackToPromptStep: () => void;
  startDemoRoomFromPrompt: (starterPrompt: string) => { ok: boolean; roomId?: string; error?: string };
  createActiveRoom: () => { ok: boolean; roomId?: string; error?: string };
  togglePlayback: () => void;
  tickPlayback: (trackDurationSeconds: number) => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  selectDiagnosticChip: (chip: DiagnosticChip) => void;
  applyFollowUpOption: (option: FollowUpOption) => void;
  setRefinementDraft: (value: string) => void;
  submitRefinement: () => { ok: boolean; error?: string };
  getInteractionHint: () => string | null;
  dismissToast: () => void;
};

function withUpdatedQueue(room: FlowRoom, trackQueue: string[]): FlowRoom {
  return {
    ...room,
    trackQueue,
    currentTrackId: trackQueue[0]
  };
}

function mergeMemory(room: FlowRoom, memory?: Partial<FlowRoom["memory"]>): FlowRoom["memory"] {
  if (!memory) {
    return room.memory;
  }

  return {
    ...room.memory,
    ...memory,
    skippedTrackIds: memory.skippedTrackIds ?? room.memory.skippedTrackIds,
    savedTrackIds: memory.savedTrackIds ?? room.memory.savedTrackIds,
    acceptedDirections: memory.acceptedDirections ?? room.memory.acceptedDirections,
    rejectedDirections: memory.rejectedDirections ?? room.memory.rejectedDirections,
    moodCorrections: memory.moodCorrections ?? room.memory.moodCorrections,
    energyCorrections: memory.energyCorrections ?? room.memory.energyCorrections
  };
}

function getAllowedControls(room: FlowRoom) {
  switch (room.demoFlow) {
    case "rainy_evening":
      return {
        enabledChips: ["wrong_mood"] as DiagnosticChip[],
        enabledMoodOptions: ["softer"] as FollowUpOption[],
        enabledEnergyOptions: [] as FollowUpOption[],
        refinementEnabled: false,
        hint: "This demo flow is tuned for Wrong mood → Softer."
      };
    case "fresh_workout":
      return {
        enabledChips: ["too_familiar"] as DiagnosticChip[],
        enabledMoodOptions: [] as FollowUpOption[],
        enabledEnergyOptions: [] as FollowUpOption[],
        refinementEnabled: false,
        hint: "This demo flow is tuned for Too familiar."
      };
    case "melodic_surprise":
      return {
        enabledChips: ["too_different"] as DiagnosticChip[],
        enabledMoodOptions: [] as FollowUpOption[],
        enabledEnergyOptions: [] as FollowUpOption[],
        refinementEnabled: true,
        hint: "This demo flow is tuned for Too different and text refinement."
      };
  }
}

function getCurrentQueue(state: FlowStore): string[] {
  return state.activeRoom ? state.activeRoom.trackQueue : [...previewQueue];
}

function getCurrentTrackId(state: FlowStore): string | null {
  if (state.activeRoom) {
    return state.activeRoom.trackQueue[state.currentTrackIndex] ?? null;
  }

  return previewQueue[state.previewCurrentTrackIndex] ?? null;
}

export const STARTER_PROMPTS = [
  "Rainy evening Hindi",
  "Fresh workout music",
  "Surprise me"
] as const;

export const useFlowStore = create<FlowStore>((set, get) => ({
  isLauncherOpen: false,
  launcherStep: "prompt",
  isQueueOpen: false,
  queueRevision: 0,
  promptDraft: "",
  selectedStarterPrompt: null,
  keepSeparateProfile: true,
  suggestedArc: null,
  selectedArc: null,
  activeRoom: null,
  currentTrackIndex: 0,
  previewCurrentTrackIndex: 0,
  isPlaying: false,
  playbackProgressSeconds: 0,
  selectedDiagnosticChip: null,
  visibleFollowUpType: null,
  refinementDraft: "",
  toast: null,
  openLauncher: () =>
    set({
      isLauncherOpen: true,
      launcherStep: "prompt",
      toast: null
    }),
  closeLauncher: () =>
    set({
      isLauncherOpen: false
    }),
  toggleQueue: () =>
    set((state) => ({
      isQueueOpen: !state.isQueueOpen
    })),
  setPromptDraft: (value) =>
    set({
      promptDraft: value,
      selectedStarterPrompt: null
    }),
  selectStarterPrompt: (value) =>
    set(() => {
      const flowId = promptToDemoFlow[value];
      const suggestedArc = demoFlows[flowId].suggestedArc;

      return {
        promptDraft: value,
        selectedStarterPrompt: value,
        suggestedArc,
        selectedArc: suggestedArc
      };
    }),
  toggleSeparateProfile: () =>
    set((state) => ({
      keepSeparateProfile: !state.keepSeparateProfile
    })),
  setSelectedArc: (value) =>
    set({
      selectedArc: value
    }),
  submitLauncher: () => {
    const prompt = get().promptDraft.trim();
    const selectedStarterPrompt = get().selectedStarterPrompt;

    if (!selectedStarterPrompt || !prompt) {
      set({
        toast: {
          title: "Choose a demo prompt",
          message: "Select one of the three predefined Flow prompts to continue."
        }
      });

      return {
        ok: false,
        error: "Demo prompt is required"
      };
    }

    set({
      launcherStep: "arc",
      toast: null
    });

    return {
      ok: true
    };
  },
  goBackToPromptStep: () =>
    set({
      launcherStep: "prompt"
    }),
  startDemoRoomFromPrompt: (starterPrompt) => {
    const flowId = promptToDemoFlow[starterPrompt];

    if (!flowId) {
      return {
        ok: false,
        error: "Unknown demo prompt"
      };
    }

    const suggestedArc = demoFlows[flowId].suggestedArc;
    const activeRoom = createRoomFromFlow(flowId, suggestedArc);

    set({
      promptDraft: starterPrompt,
      selectedStarterPrompt: starterPrompt,
      suggestedArc,
      selectedArc: suggestedArc,
      activeRoom,
      currentTrackIndex: 0,
      previewCurrentTrackIndex: 0,
      isPlaying: true,
      playbackProgressSeconds: 0,
      queueRevision: get().queueRevision + 1,
      isLauncherOpen: false,
      isQueueOpen: false,
      launcherStep: "prompt",
      selectedDiagnosticChip: null,
      visibleFollowUpType: null,
      refinementDraft: "",
      toast: null
    });

    return {
      ok: true,
      roomId: activeRoom.id
    };
  },
  createActiveRoom: () => {
    const selectedStarterPrompt = get().selectedStarterPrompt;
    const selectedArc = get().selectedArc;

    if (!selectedStarterPrompt || !selectedArc) {
      return {
        ok: false,
        error: "Arc and demo prompt are required"
      };
    }

    const flowId = promptToDemoFlow[selectedStarterPrompt];
    const activeRoom = createRoomFromFlow(flowId, selectedArc);

    set({
      activeRoom,
      currentTrackIndex: 0,
      previewCurrentTrackIndex: 0,
      isPlaying: true,
      playbackProgressSeconds: 0,
      queueRevision: get().queueRevision + 1,
      isLauncherOpen: false,
      isQueueOpen: false,
      launcherStep: "prompt",
      selectedDiagnosticChip: null,
      visibleFollowUpType: null,
      refinementDraft: "",
      toast: null
    });

    return {
      ok: true,
      roomId: activeRoom.id
    };
  },
  togglePlayback: () =>
    set((state) => ({
      isPlaying: !state.isPlaying
    })),
  tickPlayback: (trackDurationSeconds) =>
    set((state) => {
      if (!state.isPlaying) {
        return state;
      }

      const nextProgress = state.playbackProgressSeconds + 1;

      if (nextProgress < trackDurationSeconds) {
        return {
          playbackProgressSeconds: nextProgress
        };
      }

      if (!state.activeRoom) {
        const isLastPreviewTrack = state.previewCurrentTrackIndex >= previewQueue.length - 1;

        return {
          previewCurrentTrackIndex: isLastPreviewTrack
            ? 0
            : state.previewCurrentTrackIndex + 1,
          playbackProgressSeconds: 0,
          queueRevision: state.queueRevision + 1
        };
      }

      const isLastTrack = state.currentTrackIndex >= state.activeRoom.trackQueue.length - 1;
      const nextIndex = isLastTrack ? 0 : state.currentTrackIndex + 1;

      return {
        activeRoom: {
          ...state.activeRoom,
          currentTrackId: state.activeRoom.trackQueue[nextIndex]
        },
        currentTrackIndex: nextIndex,
        playbackProgressSeconds: 0,
        isQueueOpen: true,
        queueRevision: state.queueRevision + 1
      };
    }),
  playNextTrack: () =>
    set((state) => {
      if (!state.activeRoom) {
        const nextIndex =
          state.previewCurrentTrackIndex >= previewQueue.length - 1
            ? 0
            : state.previewCurrentTrackIndex + 1;

        return {
          previewCurrentTrackIndex: nextIndex,
          playbackProgressSeconds: 0,
          isPlaying: true,
          queueRevision: state.queueRevision + 1
        };
      }

      const isLastTrack = state.currentTrackIndex >= state.activeRoom.trackQueue.length - 1;
      const nextIndex = isLastTrack ? 0 : state.currentTrackIndex + 1;

      return {
        activeRoom: {
          ...state.activeRoom,
          currentTrackId: state.activeRoom.trackQueue[nextIndex]
        },
        currentTrackIndex: nextIndex,
        playbackProgressSeconds: 0,
        isPlaying: true,
        isQueueOpen: true,
        queueRevision: state.queueRevision + 1
      };
    }),
  playPreviousTrack: () =>
    set((state) => {
      if (!state.activeRoom) {
        if (state.previewCurrentTrackIndex <= 0) {
          return state;
        }

        return {
          previewCurrentTrackIndex: state.previewCurrentTrackIndex - 1,
          playbackProgressSeconds: 0,
          isPlaying: true
        };
      }

      if (state.currentTrackIndex <= 0) {
        return state;
      }

      const previousIndex = state.currentTrackIndex - 1;

      return {
        currentTrackIndex: previousIndex,
        playbackProgressSeconds: 0,
        queueRevision: state.queueRevision + 1,
        activeRoom: {
          ...state.activeRoom,
          currentTrackId: state.activeRoom.trackQueue[previousIndex]
        }
      };
    }),
  selectDiagnosticChip: (chip) =>
    set((state) => {
      if (!state.activeRoom) {
        return state;
      }

      if (chip === "wrong_mood") {
        return {
          selectedDiagnosticChip: chip,
          visibleFollowUpType: "mood",
          toast: null
        };
      }

      if (chip === "wrong_energy") {
        return {
          selectedDiagnosticChip: chip,
          visibleFollowUpType: "energy",
          toast: null
        };
      }

      const allowedControls = getAllowedControls(state.activeRoom);

      if (!allowedControls.enabledChips.includes(chip)) {
        return {
          toast: {
            title: "Try the guided option",
            message: allowedControls.hint
          }
        };
      }

      const snapshot = steeringSnapshots[state.activeRoom.demoFlow]?.[chip];

      if (!snapshot) {
        return {
          selectedDiagnosticChip: chip,
          visibleFollowUpType: null,
          toast: {
            title: "Try the room hint",
            message: state.activeRoom.testHint
          }
        };
      }

      const updatedRoomBase = withUpdatedQueue(state.activeRoom, snapshot.trackQueue);
      const updatedRoom: FlowRoom = {
        ...updatedRoomBase,
        pulse: snapshot.pulse ?? updatedRoomBase.pulse,
        helperText: snapshot.helperText ?? updatedRoomBase.helperText,
        memory: mergeMemory(updatedRoomBase, snapshot.memory)
      };

      return {
        activeRoom: updatedRoom,
        currentTrackIndex: 0,
        playbackProgressSeconds: 0,
        selectedDiagnosticChip: chip,
        visibleFollowUpType: null,
        isPlaying: true,
        isQueueOpen: true,
        queueRevision: state.queueRevision + 1,
        toast: null
      };
    }),
  applyFollowUpOption: (option) =>
    set((state) => {
      if (!state.activeRoom) {
        return state;
      }

      const snapshot = steeringSnapshots[state.activeRoom.demoFlow]?.[option];
      const allowedControls = getAllowedControls(state.activeRoom);
      const allowedOptions =
        state.visibleFollowUpType === "mood"
          ? allowedControls.enabledMoodOptions
          : allowedControls.enabledEnergyOptions;

      if (!allowedOptions.includes(option)) {
        return {
          toast: {
            title: "Try the guided option",
            message: allowedControls.hint
          }
        };
      }

      if (!snapshot) {
        return {
          toast: {
            title: "Try the room hint",
            message: state.activeRoom.testHint
          }
        };
      }

      const updatedRoomBase = withUpdatedQueue(state.activeRoom, snapshot.trackQueue);
      const updatedRoom: FlowRoom = {
        ...updatedRoomBase,
        pulse: snapshot.pulse ?? updatedRoomBase.pulse,
        helperText: snapshot.helperText ?? updatedRoomBase.helperText,
        memory: mergeMemory(updatedRoomBase, snapshot.memory)
      };

      return {
        activeRoom: updatedRoom,
        currentTrackIndex: 0,
        playbackProgressSeconds: 0,
        selectedDiagnosticChip: state.selectedDiagnosticChip,
        visibleFollowUpType: null,
        isPlaying: true,
        isQueueOpen: true,
        queueRevision: state.queueRevision + 1,
        toast: null
      };
    }),
  setRefinementDraft: (value) =>
    set({
      refinementDraft: value
    }),
  submitRefinement: () => {
    const state = get();
    const activeRoom = state.activeRoom;

    if (!activeRoom || !state.refinementDraft.trim()) {
      return {
        ok: false,
        error: "Refinement text is required"
      };
    }

    const allowedControls = getAllowedControls(activeRoom);

    if (!allowedControls.refinementEnabled) {
      set({
        toast: {
          title: "Try the guided option",
          message: allowedControls.hint
        }
      });

      return {
        ok: false,
        error: "Text refinement is not active for this demo flow"
      };
    }

    const snapshot = steeringSnapshots[activeRoom.demoFlow]?.nl_refine;

    if (!snapshot) {
      set({
        toast: {
          title: "Try the room hint",
          message: activeRoom.testHint
        }
      });

      return {
        ok: false,
        error: "This room does not use text refinement in the prototype"
      };
    }

    const updatedRoomBase = withUpdatedQueue(activeRoom, snapshot.trackQueue);
    const updatedRoom: FlowRoom = {
      ...updatedRoomBase,
      pulse: snapshot.pulse ?? updatedRoomBase.pulse,
      helperText: snapshot.helperText ?? updatedRoomBase.helperText,
      memory: mergeMemory(updatedRoomBase, snapshot.memory)
    };

    set({
      activeRoom: updatedRoom,
      currentTrackIndex: 0,
      playbackProgressSeconds: 0,
      queueRevision: state.queueRevision + 1,
      refinementDraft: "",
      isPlaying: true,
      isQueueOpen: true,
      toast: null
    });

    return {
      ok: true
    };
  },
  getInteractionHint: () => {
    const activeRoom = get().activeRoom;

    if (!activeRoom) {
      return null;
    }

    return getAllowedControls(activeRoom).hint;
  },
  dismissToast: () =>
    set({
      toast: null
    })
}));
