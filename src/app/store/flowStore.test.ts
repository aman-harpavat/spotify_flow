import { vi } from "vitest";
import { createRoomFromFlow } from "../../data/demoRooms";
import { useFlowStore } from "./flowStore";

describe("flowStore steering", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useFlowStore.setState({
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
      savedRooms: [],
      currentTrackIndex: 0,
      previewCurrentTrackIndex: 0,
      isPlaying: false,
      playbackProgressSeconds: 0,
      selectedDiagnosticChip: null,
      visibleFollowUpType: null,
      refinementDraft: "",
      toast: null
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("updates the workout queue when too familiar is selected", () => {
    useFlowStore.setState({
      activeRoom: createRoomFromFlow("fresh_workout"),
      isPlaying: true
    });

    useFlowStore.getState().selectDiagnosticChip("too_familiar");

    const pendingState = useFlowStore.getState();
    expect(pendingState.thinkingMessage).toBe(
      "Finding less familiar picks that still fit your energy..."
    );

    vi.runAllTimers();

    const state = useFlowStore.getState();

    expect(state.activeRoom?.trackQueue[0]).toBe("lift-off-zedha");
    expect(state.activeRoom?.pulse).toBe("getting_fresher");
    expect(state.isQueueOpen).toBe(true);
    expect(state.queueRevision).toBe(1);
  });

  it("applies text refinement for melodic surprise", () => {
    useFlowStore.setState({
      activeRoom: createRoomFromFlow("melodic_surprise"),
      refinementDraft: "more emotional, less noisy",
      isPlaying: true
    });

    const result = useFlowStore.getState().submitRefinement();
    vi.runAllTimers();
    const state = useFlowStore.getState();

    expect(result.ok).toBe(true);
    expect(state.activeRoom?.trackQueue[0]).toBe("safar-dheema-samar");
    expect(state.refinementDraft).toBe("");
  });

  it("does not move previous before the first room track", () => {
    useFlowStore.setState({
      activeRoom: createRoomFromFlow("rainy_evening"),
      currentTrackIndex: 0,
      isPlaying: true
    });

    useFlowStore.getState().playPreviousTrack();

    const state = useFlowStore.getState();

    expect(state.currentTrackIndex).toBe(0);
    expect(state.activeRoom?.currentTrackId).toBe("shaam-aisha-khan");
  });

  it("supports playback when no room is active", () => {
    useFlowStore.getState().togglePlayback();
    useFlowStore.getState().tickPlayback(216);

    const state = useFlowStore.getState();

    expect(state.isPlaying).toBe(true);
    expect(state.playbackProgressSeconds).toBe(1);
  });

  it("loops the room queue back to the first track after the last song", () => {
    useFlowStore.setState({
      activeRoom: createRoomFromFlow("fresh_workout"),
      currentTrackIndex: 5,
      isPlaying: true
    });

    useFlowStore.getState().playNextTrack();

    const state = useFlowStore.getState();

    expect(state.currentTrackIndex).toBe(0);
    expect(state.activeRoom?.currentTrackId).toBe("charge-up-nova-run");
  });

  it("shows thinking state before a room starts playing", () => {
    useFlowStore.setState({
      selectedStarterPrompt: "Fresh workout music",
      selectedArc: "refresh"
    });

    const result = useFlowStore.getState().createActiveRoom();
    const pendingState = useFlowStore.getState();

    expect(result.ok).toBe(true);
    expect(result.roomId).toBe("fresh-workout-music");
    expect(pendingState.isFlowThinking).toBe(true);
    expect(pendingState.isPlaying).toBe(false);
    expect(pendingState.thinkingTrackId).toBe("preview-night-bloom");

    vi.runAllTimers();

    const resolvedState = useFlowStore.getState();
    expect(resolvedState.isFlowThinking).toBe(false);
    expect(resolvedState.isPlaying).toBe(true);
    expect(resolvedState.thinkingTrackId).toBeNull();
  });

  it("keeps the currently playing track audible while a new room is building", () => {
    useFlowStore.setState({
      activeRoom: createRoomFromFlow("rainy_evening"),
      currentTrackIndex: 2,
      isPlaying: true,
      playbackProgressSeconds: 42,
      selectedStarterPrompt: "Fresh workout music",
      selectedArc: "refresh"
    });

    const result = useFlowStore.getState().createActiveRoom();
    const pendingState = useFlowStore.getState();

    expect(result.ok).toBe(true);
    expect(result.roomId).toBe("fresh-workout-music");
    expect(pendingState.isFlowThinking).toBe(true);
    expect(pendingState.isPlaying).toBe(true);
    expect(pendingState.playbackProgressSeconds).toBe(42);
    expect(pendingState.thinkingTrackId).toBe("dheemi-raat-kavya");

    vi.runAllTimers();

    const resolvedState = useFlowStore.getState();
    expect(resolvedState.activeRoom?.currentTrackId).toBe("charge-up-nova-run");
    expect(resolvedState.playbackProgressSeconds).toBe(0);
  });

  it("shows flow complete when the same tuning chip is selected again", () => {
    useFlowStore.setState({
      activeRoom: createRoomFromFlow("fresh_workout"),
      isPlaying: true,
      selectedDiagnosticChip: "too_familiar"
    });

    useFlowStore.getState().selectDiagnosticChip("too_familiar");

    const state = useFlowStore.getState();
    expect(state.completionHint).toBe("Demo flow is complete for this room");
    expect(state.toast).toBeNull();
  });

  it("saves the active room for later reopen", () => {
    useFlowStore.setState({
      activeRoom: createRoomFromFlow("rainy_evening"),
      isPlaying: true
    });

    const result = useFlowStore.getState().saveActiveRoom();
    const state = useFlowStore.getState();

    expect(result.ok).toBe(true);
    expect(state.savedRooms).toHaveLength(1);
    expect(state.savedRooms[0]?.title).toBe("Rainy evening Hindi");
    expect(state.activeRoom?.status).toBe("saved");
  });

  it("reopens a saved room as a fresh saved session", () => {
    useFlowStore.setState({
      savedRooms: [
        {
          id: "rainy_evening",
          demoFlow: "rainy_evening",
          title: "Rainy evening Hindi",
          prompt: "Soft Hindi songs for a rainy evening",
          starterPrompt: "Rainy evening Hindi",
          arc: "deep_dive",
          helperText: "Exploring soft Hindi for a rainy evening",
          cardHelper: "Reopen for a fresh session in the same vibe",
          memory: createRoomFromFlow("rainy_evening").memory,
          reopenCount: 0
        }
      ]
    });

    const result = useFlowStore.getState().reopenSavedRoom("rainy_evening");
    const pendingState = useFlowStore.getState();

    expect(result.ok).toBe(true);
    expect(result.roomId).toBe("rainy-evening-hindi");
    expect(pendingState.isFlowThinking).toBe(true);

    vi.runAllTimers();

    const state = useFlowStore.getState();
    expect(state.activeRoom?.status).toBe("saved");
    expect(state.activeRoom?.trackQueue[0]).toBe("bheegi-dhoop-ishan");
    expect(state.savedRooms[0]?.reopenCount).toBe(1);
  });

  it("discards the active room without affecting playback state", () => {
    useFlowStore.setState({
      activeRoom: {
        ...createRoomFromFlow("melodic_surprise"),
        status: "saved"
      },
      savedRooms: [
        {
          id: "melodic_surprise",
          demoFlow: "melodic_surprise",
          title: "Melodic Surprise Flow",
          prompt: "Surprise me, but keep it Indian and melodic",
          starterPrompt: "Surprise me",
          arc: "surprise_me",
          helperText: "Exploring something new without losing your vibe",
          cardHelper: "Reopen for a fresh session in the same vibe",
          memory: createRoomFromFlow("melodic_surprise").memory,
          reopenCount: 0
        }
      ],
      isPlaying: true
    });

    const result = useFlowStore.getState().discardActiveRoom();
    const state = useFlowStore.getState();

    expect(result.ok).toBe(true);
    expect(state.activeRoom).toBeNull();
    expect(state.savedRooms).toHaveLength(0);
    expect(state.toast?.title).toBe("Room discarded");
  });
});
