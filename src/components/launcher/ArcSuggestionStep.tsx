import { arcDescriptions, arcDisplayNames } from "../../data/demoRooms";
import { ArcType } from "../../domain/types";

type ArcSuggestionStepProps = {
  selectedArc: ArcType | null;
  onSelectArc: (arc: ArcType) => void;
  onBack: () => void;
  onConfirm: () => void;
};

const arcOptions: ArcType[] = ["deep_dive", "refresh", "surprise_me"];

export function ArcSuggestionStep({
  selectedArc,
  onSelectArc,
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
        <p className="mt-3 text-sm text-spotify-muted md:text-base">
          Choose how this room should move. You can change it later, but this sets
          the starting feel before playback begins.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {arcOptions.map((arc) => {
          const active = selectedArc === arc;

          return (
            <button
              key={arc}
              type="button"
              onClick={() => onSelectArc(arc)}
              className={`rounded-[20px] border px-5 py-4 text-left transition ${
                active
                  ? "border-spotify-green bg-spotify-green text-black"
                  : "border-white/10 bg-spotify-surface text-white hover:border-white/25 hover:bg-[#242424]"
              }`}
            >
              <p className="text-sm font-bold uppercase tracking-[0.12em]">
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

      <div className="rounded-[22px] border border-white/8 bg-spotify-surface p-4">
        <p className="text-sm text-spotify-muted">
          Think of this as choosing the room&apos;s starting style, not locking in a
          permanent mode.
        </p>
      </div>

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
