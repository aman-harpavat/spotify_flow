import { create } from "zustand";
import { createRoomFromFlow, demoFlows, promptToDemoFlow } from "../../data/demoRooms";
import { ArcType, FlowRoom } from "../../domain/types";

export type LauncherStep = "prompt" | "arc";

type ToastState = {
  title: string;
  message: string;
} | null;

type FlowStore = {
  isLauncherOpen: boolean;
  launcherStep: LauncherStep;
  promptDraft: string;
  selectedStarterPrompt: string | null;
  keepSeparateProfile: boolean;
  suggestedArc: ArcType | null;
  selectedArc: ArcType | null;
  activeRoom: FlowRoom | null;
  isPlaying: boolean;
  toast: ToastState;
  openLauncher: () => void;
  closeLauncher: () => void;
  setPromptDraft: (value: string) => void;
  selectStarterPrompt: (value: string) => void;
  toggleSeparateProfile: () => void;
  setSelectedArc: (value: ArcType) => void;
  submitLauncher: () => { ok: boolean; error?: string };
  goBackToPromptStep: () => void;
  createActiveRoom: () => { ok: boolean; roomId?: string; error?: string };
  togglePlayback: () => void;
  dismissToast: () => void;
};

export const STARTER_PROMPTS = [
  "Rainy evening Hindi",
  "Fresh workout music",
  "Surprise me"
] as const;

export const useFlowStore = create<FlowStore>((set, get) => ({
  isLauncherOpen: false,
  launcherStep: "prompt",
  promptDraft: "",
  selectedStarterPrompt: null,
  keepSeparateProfile: true,
  suggestedArc: null,
  selectedArc: null,
  activeRoom: null,
  isPlaying: false,
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
      isPlaying: true,
      isLauncherOpen: false,
      launcherStep: "prompt",
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
  dismissToast: () =>
    set({
      toast: null
    })
}));
