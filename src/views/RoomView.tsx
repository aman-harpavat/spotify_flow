import { FormEvent } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  arcDisplayNames,
  followUpLabels,
  pulseLabels,
  trackCatalog
} from "../data/demoRooms";
import { useFlowStore } from "../app/store/flowStore";
import { DiagnosticChip, FollowUpOption } from "../domain/types";

const diagnosticChipLabels: Record<DiagnosticChip, string> = {
  too_familiar: "Too familiar",
  too_different: "Too different",
  wrong_mood: "Wrong mood",
  wrong_energy: "Wrong energy"
};

const moodOptions: FollowUpOption[] = ["happier", "sadder", "softer", "darker"];
const energyOptions: FollowUpOption[] = ["calmer", "more_energetic", "slower", "faster"];
const visibleQueueSlots = 5;

type DemoControls = {
  enabledChips: DiagnosticChip[];
  enabledMoodOptions: FollowUpOption[];
  enabledEnergyOptions: FollowUpOption[];
  refinementEnabled: boolean;
  hint: string;
};

function getDemoControls(
  flowId: "rainy_evening" | "fresh_workout" | "melodic_surprise"
): DemoControls {
  switch (flowId) {
    case "rainy_evening":
      return {
        enabledChips: ["wrong_mood"],
        enabledMoodOptions: ["softer"],
        enabledEnergyOptions: [],
        refinementEnabled: false,
        hint: "For this demo, try Wrong mood and then Softer."
      };
    case "fresh_workout":
      return {
        enabledChips: ["too_familiar"],
        enabledMoodOptions: [],
        enabledEnergyOptions: [],
        refinementEnabled: false,
        hint: "For this demo, try Too familiar."
      };
    case "melodic_surprise":
      return {
        enabledChips: ["too_different"],
        enabledMoodOptions: [],
        enabledEnergyOptions: [],
        refinementEnabled: true,
        hint: "For this demo, try Too different, then use text refine."
      };
  }
}

export function RoomView() {
  const { roomId } = useParams();
  const activeRoom = useFlowStore((state) => state.activeRoom);
  const currentTrackIndex = useFlowStore((state) => state.currentTrackIndex);
  const queueRevision = useFlowStore((state) => state.queueRevision);
  const isQueueOpen = useFlowStore((state) => state.isQueueOpen);
  const selectedDiagnosticChip = useFlowStore((state) => state.selectedDiagnosticChip);
  const visibleFollowUpType = useFlowStore((state) => state.visibleFollowUpType);
  const refinementDraft = useFlowStore((state) => state.refinementDraft);
  const selectDiagnosticChip = useFlowStore((state) => state.selectDiagnosticChip);
  const applyFollowUpOption = useFlowStore((state) => state.applyFollowUpOption);
  const setRefinementDraft = useFlowStore((state) => state.setRefinementDraft);
  const submitRefinement = useFlowStore((state) => state.submitRefinement);
  const interactionHint = useFlowStore((state) => state.getInteractionHint());

  if (!activeRoom || activeRoom.id !== roomId) {
    return <Navigate to="/" replace />;
  }

  const demoControls = getDemoControls(activeRoom.demoFlow);
  const currentTrack = trackCatalog[activeRoom.currentTrackId];
  const nextUp = activeRoom.trackQueue
    .slice(currentTrackIndex + 1)
    .map((trackId) => trackCatalog[trackId]);
  const visibleNextUp = nextUp.slice(0, visibleQueueSlots);
  const queuePlaceholders = Array.from({
    length: Math.max(visibleQueueSlots - visibleNextUp.length, 0)
  });
  const handleRefinementSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitRefinement();
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-6 md:py-8 lg:pr-[360px]">
      <div className="grid gap-6">
        <section className="rounded-[24px] border border-white/8 bg-gradient-to-b from-white/6 to-transparent p-6 shadow-panel md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-spotify-green">
                Flow room
              </p>
              <h1 className="mt-3 font-spotifyTitle text-4xl font-bold text-white md:text-5xl">
                {activeRoom.title}
              </h1>
              <p className="ui-body mt-4 max-w-2xl">
                {activeRoom.roomDescription}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-pill bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                Temporary room
              </span>
              <span className="rounded-pill bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                Style: {arcDisplayNames[activeRoom.arc]}
              </span>
              <span className="rounded-pill bg-spotify-green/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#9bf0b2]">
                {pulseLabels[activeRoom.pulse]}
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
            <div
              className={`rounded-[20px] bg-gradient-to-br ${currentTrack.coverGradient} p-6 shadow-spotify`}
            >
              <div className="flex h-full min-h-[280px] flex-col justify-between">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/70">
                  <span>Now playing</span>
                  <span>{currentTrack.duration}</span>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{currentTrack.title}</p>
                  <p className="mt-2 text-lg text-white/80">{currentTrack.artist}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {currentTrack.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-pill bg-black/25 px-3 py-2 text-xs text-white/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="ui-surface p-5">
                <p className="ui-label">
                  Room feel
                </p>
                <p className="mt-3 text-lg font-bold text-white">{activeRoom.helperText}</p>
                <p className="ui-body mt-3">
                  Playback starts immediately when you enter. Use the room controls
                  below to steer what comes next.
                </p>
              </div>

              <div className="ui-surface p-5">
                <p className="ui-label">
                  Tune this room
                </p>
                <p className="ui-hint mt-3">{interactionHint}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {(
                    Object.keys(diagnosticChipLabels) as DiagnosticChip[]
                  ).map((chip) => {
                    const active = selectedDiagnosticChip === chip;
                    const enabled = demoControls.enabledChips.includes(chip);

                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => enabled && selectDiagnosticChip(chip)}
                        disabled={!enabled}
                        className={`rounded-pill border px-4 py-2 text-sm font-bold transition ${
                          active
                            ? "border-spotify-green bg-spotify-green text-black"
                            : enabled
                              ? "border-white/10 bg-white/5 text-white hover:border-white/25 hover:bg-white/10"
                              : "cursor-not-allowed border-white/8 bg-white/[0.03] text-white/35"
                        }`}
                      >
                        {diagnosticChipLabels[chip]}
                      </button>
                    );
                  })}
                </div>

                {visibleFollowUpType ? (
                  <div className="mt-5 rounded-[18px] bg-white/5 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                      {visibleFollowUpType === "mood" ? "Shift the mood" : "Shift the energy"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {(visibleFollowUpType === "mood" ? moodOptions : energyOptions).map(
                        (option) => {
                          const enabled =
                            visibleFollowUpType === "mood"
                              ? demoControls.enabledMoodOptions.includes(option)
                              : demoControls.enabledEnergyOptions.includes(option);

                          return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => enabled && applyFollowUpOption(option)}
                            disabled={!enabled}
                            className={`rounded-pill border px-4 py-2 text-sm font-bold transition ${
                              enabled
                                ? "border-white/10 bg-white/5 text-white hover:border-white/25 hover:bg-white/10"
                                : "cursor-not-allowed border-white/8 bg-white/[0.03] text-white/35"
                            }`}
                          >
                            {followUpLabels[option]}
                          </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                ) : null}

                <form className="mt-5 space-y-3" onSubmit={handleRefinementSubmit}>
                  <label className="block">
                    <span className="ui-label mb-3 block">
                      Refine this room...
                    </span>
                    <input
                      value={refinementDraft}
                      onChange={(event) => setRefinementDraft(event.target.value)}
                      placeholder="Try: more emotional, less noisy"
                      disabled={!demoControls.refinementEnabled}
                      className={`w-full rounded-pill border px-4 py-3 text-sm outline-none transition placeholder:text-white/35 ${
                        demoControls.refinementEnabled
                          ? "border-white/10 bg-white/5 text-white focus:border-white/25"
                          : "cursor-not-allowed border-white/8 bg-white/[0.03] text-white/35"
                      }`}
                    />
                  </label>
                  <div className="flex items-center justify-between gap-3">
                    <p className="ui-hint">{activeRoom.testHint}</p>
                    <button
                      type="submit"
                      disabled={!demoControls.refinementEnabled}
                      className={`rounded-pill px-4 py-2 text-sm font-bold transition ${
                        demoControls.refinementEnabled
                          ? "bg-spotify-green text-black hover:scale-[1.02]"
                          : "cursor-not-allowed bg-white/10 text-white/35"
                      }`}
                    >
                      Apply
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4 lg:fixed lg:right-4 lg:top-[88px] lg:z-20 lg:w-[320px] lg:pb-[104px]">
          <div
            className={`flex flex-col rounded-[20px] border bg-spotify-surface p-5 shadow-panel transition lg:max-h-[calc(100vh-12rem)] ${
              isQueueOpen
                ? "border-spotify-green/35 shadow-[0_0_0_1px_rgba(30,215,96,0.22)]"
                : "border-white/8"
            }`}
          >
            <p className="ui-label shrink-0">
              Up next
            </p>
            <div
              key={queueRevision}
              className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1"
            >
              {visibleNextUp.map((track, index) => (
                <div
                  key={track.id}
                  className="queue-refresh-item flex items-center gap-3 rounded-[16px] bg-white/5 p-3"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div
                    className={`h-12 w-12 rounded-[10px] bg-gradient-to-br ${track.coverGradient}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{track.title}</p>
                    <p className="ui-muted truncate">{track.artist}</p>
                  </div>
                  <span className="ui-hint">{track.duration}</span>
                </div>
              ))}
              {queuePlaceholders.map((_, index) => (
                <div
                  key={`placeholder-${currentTrackIndex}-${index}`}
                  className="queue-refresh-item flex items-center gap-3 rounded-[16px] border border-white/6 bg-white/[0.03] p-3"
                  style={{ animationDelay: `${(visibleNextUp.length + index) * 120}ms` }}
                >
                  <div className="h-12 w-12 rounded-[10px] bg-gradient-to-br from-white/12 to-white/[0.03]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white/52">Loading next picks</p>
                    <p className="ui-hint truncate">More songs will appear here as the room continues</p>
                  </div>
                  <span className="ui-hint">--:--</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
