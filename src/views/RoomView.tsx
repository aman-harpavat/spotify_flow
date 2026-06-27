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
  const handleRefinementSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitRefinement();
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-6 md:py-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-[24px] border border-white/8 bg-gradient-to-b from-white/6 to-transparent p-6 shadow-panel md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-spotify-green">
                Flow room
              </p>
              <h1 className="mt-3 font-spotifyTitle text-4xl font-bold text-white md:text-5xl">
                {activeRoom.title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm text-spotify-muted md:text-base">
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
              <div className="rounded-[20px] border border-white/8 bg-spotify-surface p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                  Room feel
                </p>
                <p className="mt-3 text-lg font-bold text-white">{activeRoom.helperText}</p>
                <p className="mt-3 text-sm text-spotify-muted">
                  Playback starts immediately when you enter. Use the room controls
                  below to steer what comes next.
                </p>
              </div>

              <div className="rounded-[20px] border border-white/8 bg-spotify-surface p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                  Tune this room
                </p>
                <p className="mt-3 text-sm text-spotify-muted">{interactionHint}</p>
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
                    <p className="mt-2 text-sm text-spotify-muted">{interactionHint}</p>
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
                    <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-white/55">
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
                    <p className="text-sm text-spotify-muted">{activeRoom.testHint}</p>
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

        <aside className="space-y-4">
          <div className="rounded-[20px] border border-white/8 bg-spotify-surface p-5 shadow-panel">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
              Up next
            </p>
            <div className="mt-4 space-y-3">
              {nextUp.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 rounded-[16px] bg-white/5 p-3"
                >
                  <div
                    className={`h-12 w-12 rounded-[10px] bg-gradient-to-br ${track.coverGradient}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{track.title}</p>
                    <p className="truncate text-sm text-spotify-muted">{track.artist}</p>
                  </div>
                  <span className="text-xs text-spotify-muted">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
