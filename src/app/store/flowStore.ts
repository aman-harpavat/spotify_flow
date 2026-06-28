import { create } from "zustand";
import {
  createRoomFromSavedDefinition,
  createSavedRoomDefinition,
  createRoomFromFlow,
  defaultSavedRoom,
  demoFlows,
  promptToDemoFlow,
  previewQueue,
  savedRoomCardHelper,
  steeringSnapshots,
  trackCatalog
} from "../../data/demoRooms";
import {
  ArcType,
  DiagnosticChip,
  FlowRoom,
  FollowUpOption,
  FollowUpType,
  SavedRoomDefinition
} from "../../domain/types";

export type LauncherStep = "prompt" | "arc";

type ToastState = {
  title: string;
  message: string;
} | null;

type FlowStoreSet = (
  partial: FlowStore | Partial<FlowStore> | ((state: FlowStore) => FlowStore | Partial<FlowStore>),
  replace?: boolean
) => void;

type FlowStore = {
  isLauncherOpen: boolean;
  launcherStep: LauncherStep;
  isQueueOpen: boolean;
  queueRevision: number;
  isFlowThinking: boolean;
  thinkingMessage: string | null;
  thinkingTrackId: string | null;
  completionHint: string | null;
  promptDraft: string;
  selectedStarterPrompt: string | null;
  keepSeparateProfile: boolean;
  suggestedArc: ArcType | null;
  selectedArc: ArcType | null;
  activeRoom: FlowRoom | null;
  savedRooms: SavedRoomDefinition[];
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
  toggleSaveCurrentSong: () => void;
  saveActiveRoom: () => { ok: boolean; savedRoomId?: string; error?: string };
  discardActiveRoom: () => { ok: boolean };
  reopenSavedRoom: (savedRoomId: string) => { ok: boolean; roomId?: string; error?: string };
  getInteractionHint: () => string | null;
  dismissToast: () => void;
};

const THINKING_DELAY_MS = 5000;
function withThinkingDelay(
  message: string,
  action: () => void,
  set: FlowStoreSet
) {
  set({
    isFlowThinking: true,
    thinkingMessage: message
  });

  window.setTimeout(() => {
    action();
  }, THINKING_DELAY_MS);
}

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

function getSteeringThinkingMessage(
  flowId: FlowRoom["demoFlow"],
  action: DiagnosticChip | FollowUpOption | "nl_refine"
) {
  if (action === "too_familiar") {
    return "Finding less familiar picks that still fit your energy...";
  }

  if (action === "too_different") {
    return "Pulling things closer to your vibe...";
  }

  if (action === "softer") {
    return "Softening the room while keeping the same mood...";
  }

  if (action === "nl_refine") {
    return flowId === "melodic_surprise"
      ? "Reshaping the room around that direction..."
      : "Refreshing your room...";
  }

  return "Refreshing your room...";
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

function getCurrentlyAudibleTrackId(state: FlowStore): string | null {
  return getCurrentTrackId(state);
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
  isFlowThinking: false,
  thinkingMessage: null,
  thinkingTrackId: null,
  completionHint: null,
  promptDraft: "",
  selectedStarterPrompt: null,
  keepSeparateProfile: true,
  suggestedArc: null,
  selectedArc: null,
  activeRoom: null,
  savedRooms: [defaultSavedRoom],
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
      promptDraft: "",
      selectedStarterPrompt: null,
      suggestedArc: null,
      selectedArc: null,
      keepSeparateProfile: true,
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
    const state = get();
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
      previewCurrentTrackIndex: state.previewCurrentTrackIndex,
      isPlaying: state.isPlaying,
      playbackProgressSeconds: state.playbackProgressSeconds,
      queueRevision: get().queueRevision + 1,
      isLauncherOpen: false,
      isQueueOpen: false,
      launcherStep: "prompt",
      selectedDiagnosticChip: null,
      visibleFollowUpType: null,
      refinementDraft: "",
      toast: null,
      thinkingTrackId: getCurrentlyAudibleTrackId(state),
      completionHint: null,
      isFlowThinking: true,
      thinkingMessage: "Building your music..."
    });

    window.setTimeout(() => {
      set({
        isPlaying: true,
        isFlowThinking: false,
        thinkingMessage: null,
        thinkingTrackId: null,
        playbackProgressSeconds: 0
      });
    }, THINKING_DELAY_MS);

    return {
      ok: true,
      roomId: activeRoom.routeSlug
    };
  },
  createActiveRoom: () => {
    const state = get();
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
      previewCurrentTrackIndex: state.previewCurrentTrackIndex,
      isPlaying: state.isPlaying,
      playbackProgressSeconds: state.playbackProgressSeconds,
      queueRevision: state.queueRevision + 1,
      isLauncherOpen: false,
      isQueueOpen: false,
      launcherStep: "prompt",
      selectedDiagnosticChip: null,
      visibleFollowUpType: null,
      refinementDraft: "",
      toast: null,
      thinkingTrackId: getCurrentlyAudibleTrackId(state),
      completionHint: null,
      isFlowThinking: true,
      thinkingMessage: "Building your music..."
    });

    window.setTimeout(() => {
      set({
        isPlaying: true,
        isFlowThinking: false,
        thinkingMessage: null,
        thinkingTrackId: null,
        playbackProgressSeconds: 0
      });
    }, THINKING_DELAY_MS);

    return {
      ok: true,
      roomId: activeRoom.routeSlug
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

      if (state.selectedDiagnosticChip === chip && state.visibleFollowUpType === null) {
        return {
          completionHint: "Demo flow is complete for this room"
        };
      }

      if (chip === "wrong_mood") {
        return {
          selectedDiagnosticChip: chip,
          visibleFollowUpType: "mood",
          toast: null,
          completionHint: null
        };
      }

      if (chip === "wrong_energy") {
        return {
          selectedDiagnosticChip: chip,
          visibleFollowUpType: "energy",
          toast: null,
          completionHint: null
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

      withThinkingDelay(
        getSteeringThinkingMessage(state.activeRoom.demoFlow, chip),
        () => {
          const latestState = get();
          const latestRoom = latestState.activeRoom;

          if (!latestRoom) {
            return;
          }

          const updatedRoomBase = withUpdatedQueue(latestRoom, snapshot.trackQueue);
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
            selectedDiagnosticChip: chip,
            visibleFollowUpType: null,
            isPlaying: true,
            isQueueOpen: true,
            queueRevision: latestState.queueRevision + 1,
            toast: null,
            thinkingTrackId: null,
            completionHint: null,
            isFlowThinking: false,
            thinkingMessage: null
          });
        },
        set
      );

      return {
        toast: null,
        thinkingTrackId: state.activeRoom.currentTrackId
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

      withThinkingDelay(
        getSteeringThinkingMessage(state.activeRoom.demoFlow, option),
        () => {
          const latestState = get();
          const latestRoom = latestState.activeRoom;

          if (!latestRoom) {
            return;
          }

          const updatedRoomBase = withUpdatedQueue(latestRoom, snapshot.trackQueue);
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
            selectedDiagnosticChip: latestState.selectedDiagnosticChip,
            visibleFollowUpType: null,
            isPlaying: true,
            isQueueOpen: true,
            queueRevision: latestState.queueRevision + 1,
            toast: null,
            thinkingTrackId: null,
            completionHint: null,
            isFlowThinking: false,
            thinkingMessage: null
          });
        },
        set
      );

      return {
        toast: null,
        thinkingTrackId: state.activeRoom.currentTrackId
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

    withThinkingDelay(
      getSteeringThinkingMessage(activeRoom.demoFlow, "nl_refine"),
      () => {
        const latestState = get();
        const latestRoom = latestState.activeRoom;

        if (!latestRoom) {
          return;
        }

        const updatedRoomBase = withUpdatedQueue(latestRoom, snapshot.trackQueue);
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
          queueRevision: latestState.queueRevision + 1,
          refinementDraft: "",
          isPlaying: true,
          isQueueOpen: true,
          toast: null,
          thinkingTrackId: null,
          completionHint: null,
          isFlowThinking: false,
          thinkingMessage: null
        });
      },
      set
    );

    set({
      thinkingTrackId: activeRoom.currentTrackId
    });

    return {
      ok: true
    };
  },
  toggleSaveCurrentSong: () =>
    set((state) => {
      if (!state.activeRoom) {
        return state;
      }

      const currentTrackId = state.activeRoom.currentTrackId;
      const savedTrackIds = state.activeRoom.memory.savedTrackIds.includes(currentTrackId)
        ? state.activeRoom.memory.savedTrackIds.filter((trackId) => trackId !== currentTrackId)
        : [...state.activeRoom.memory.savedTrackIds, currentTrackId];

      return {
        activeRoom: {
          ...state.activeRoom,
          memory: {
            ...state.activeRoom.memory,
      savedTrackIds
          }
        },
        toast: {
          title: savedTrackIds.includes(currentTrackId) ? "Song saved" : "Song removed",
          message: savedTrackIds.includes(currentTrackId)
            ? "This song is now saved inside the room."
            : "This song is no longer saved in the room."
        }
      };
    }),
  saveActiveRoom: () => {
    const state = get();

    if (!state.activeRoom) {
      return {
        ok: false,
        error: "No active room"
      };
    }

    const savedRoom = createSavedRoomDefinition({
      ...state.activeRoom,
      status: "saved"
    });

    const savedRooms = [
      savedRoom,
      ...state.savedRooms.filter((room) => room.id !== savedRoom.id)
    ];

    set({
      savedRooms,
      activeRoom: {
        ...state.activeRoom,
        status: "saved"
      },
      toast: {
        title: `${savedRoom.title} saved`,
        message: savedRoomCardHelper
      }
    });

    return {
      ok: true,
      savedRoomId: savedRoom.id
    };
  },
  discardActiveRoom: () => {
    const state = get();
    const savedRooms =
      state.activeRoom?.status === "saved"
        ? state.savedRooms.filter((room) => room.id !== state.activeRoom?.demoFlow)
        : state.savedRooms;

    set({
      activeRoom: null,
      savedRooms,
      currentTrackIndex: 0,
      selectedDiagnosticChip: null,
      visibleFollowUpType: null,
      refinementDraft: "",
      completionHint: null,
      isFlowThinking: false,
      thinkingMessage: null,
      thinkingTrackId: null,
      isQueueOpen: false,
      isPlaying: true,
      toast: {
        title: "Room discarded",
        message: "Your main taste profile was not affected."
      }
    });

    return {
      ok: true
    };
  },
  reopenSavedRoom: (savedRoomId) => {
    const state = get();
    const savedRoom = state.savedRooms.find((room) => room.id === savedRoomId);

    if (!savedRoom) {
      return {
        ok: false,
        error: "Saved room not found"
      };
    }

    const activeRoom = createRoomFromSavedDefinition(savedRoom);
    const updatedSavedRoom: SavedRoomDefinition = {
      ...savedRoom,
      reopenCount: savedRoom.reopenCount + 1
    };
    const savedRooms = state.savedRooms.map((room) =>
      room.id === savedRoomId ? updatedSavedRoom : room
    );

    set({
      activeRoom,
      savedRooms,
      currentTrackIndex: 0,
      isFlowThinking: true,
      thinkingMessage: "Rebuilding this room in the same vibe...",
      thinkingTrackId: getCurrentlyAudibleTrackId(state),
      isPlaying: state.isPlaying,
      playbackProgressSeconds: state.playbackProgressSeconds,
      selectedDiagnosticChip: null,
      visibleFollowUpType: null,
      refinementDraft: "",
      completionHint: null,
      queueRevision: state.queueRevision + 1,
      isQueueOpen: false
    });

    window.setTimeout(() => {
      set({
        isFlowThinking: false,
        thinkingMessage: null,
        thinkingTrackId: null,
        isPlaying: true,
        playbackProgressSeconds: 0,
        toast: {
          title: "Saved room reopened",
          message: "Fresh session ready in the same vibe."
        }
      });
    }, THINKING_DELAY_MS);

    return {
      ok: true,
      roomId: activeRoom.routeSlug
    };
  },
  getInteractionHint: () => {
    const activeRoom = get().activeRoom;

    if (!activeRoom) {
      return null;
    }

    return get().completionHint ?? getAllowedControls(activeRoom).hint;
  },
  dismissToast: () =>
    set({
      toast: null
    })
}));
