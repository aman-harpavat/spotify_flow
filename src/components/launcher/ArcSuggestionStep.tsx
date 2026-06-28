import { arcDescriptions, arcDisplayNames } from "../../data/demoRooms";
import { ArcType } from "../../domain/types";

type ArcSuggestionStepProps = {
  selectedArc: ArcType | null;
  onBack: () => void;
  onConfirm: () => void;
};

const arcOptions: ArcType[] = ["deep_dive", "refresh", "surprise_me"];

export function ArcSuggestionStep({
  selectedArc,
  onBack,
  onConfirm
}: ArcSuggestionStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-spotify-green">
          Building your room...
        </p>
        <h3 className="mt-3 font-spotifyTitle text-3xl font-bold text-white">
          Best fit: {selectedArc ? arcDisplayNames[selectedArc] : "Flow"}
        </h3>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {arcOptions.map((arc) => {
          const active = selectedArc === arc;

          return (
            <button
              key={arc}
              type="button"
              disabled
              className={`flex min-h-[190px] flex-col rounded-[20px] border px-5 py-4 text-left transition ${
                active
                  ? "border-spotify-green bg-spotify-green text-black"
                  : "cursor-not-allowed border-white/8 bg-spotify-surface text-white/35"
              }`}
            >
              <p className="min-h-[3.75rem] text-sm font-bold uppercase tracking-[0.12em]">
                {arcDisplayNames[arc]}
              </p>
              <p
                className={`mt-2 text-sm ${
                  active ? "text-black/80" : "text-spotify-muted"
                }`}
              >
                {arcDescriptions[arc]}
              </p>
            </button>
          );
        })}
      </div>

      <p className="ui-hint px-1">
          This prototype uses one mapped style per demo flow, so the other styles
          stay visible for context but are not selectable here.
      </p>

      <div className="flex flex-col gap-3 border-t border-white/8 pt-5 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-pill border border-white/10 px-5 py-3 text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/5"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex items-center justify-center rounded-pill bg-spotify-green px-6 py-3 text-sm font-bold uppercase tracking-spotify text-black transition hover:scale-[1.02]"
        >
          Enter room
        </button>
      </div>
    </div>
  );
}
