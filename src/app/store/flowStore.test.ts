import { createRoomFromFlow } from "../../data/demoRooms";
import { useFlowStore } from "./flowStore";

describe("flowStore steering", () => {
  beforeEach(() => {
    useFlowStore.setState({
      isLauncherOpen: false,
      launcherStep: "prompt",
      isQueueOpen: false,
      promptDraft: "",
      selectedStarterPrompt: null,
      keepSeparateProfile: true,
      suggestedArc: null,
      selectedArc: null,
      activeRoom: null,
      currentTrackIndex: 0,
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
});
