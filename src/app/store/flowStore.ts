import { create } from "zustand";

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
  toast: ToastState;
  openLauncher: () => void;
  closeLauncher: () => void;
  setPromptDraft: (value: string) => void;
  selectStarterPrompt: (value: string) => void;
  toggleSeparateProfile: () => void;
  submitLauncher: () => { ok: boolean; error?: string };
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
  toast: null,
  openLauncher: () =>
    set({
      isLauncherOpen: true,
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
    set({
      promptDraft: value,
      selectedStarterPrompt: value
    }),
  toggleSeparateProfile: () =>
    set((state) => ({
      keepSeparateProfile: !state.keepSeparateProfile
    })),
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
      isLauncherOpen: false,
      toast: {
        title: "Room prompt captured",
        message: "Phase 1 is complete. Arc suggestion and room creation land in Phase 2."
      }
    });

    return {
      ok: true
    };
  },
  dismissToast: () =>
    set({
      toast: null
    })
}));
