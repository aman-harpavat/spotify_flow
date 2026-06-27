import { createRoomFromFlow } from "../../data/demoRooms";
import { useFlowStore } from "./flowStore";

describe("flowStore steering", () => {
  beforeEach(() => {
    useFlowStore.setState({
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
      toast: null
    });
  });

  it("updates the workout queue when too familiar is selected", () => {
    useFlowStore.setState({
      activeRoom: createRoomFromFlow("fresh_workout"),
      isPlaying: true
    });

    useFlowStore.getState().selectDiagnosticChip("too_familiar");

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
});
