import { FormEvent, useMemo } from "react";
import { STARTER_PROMPTS, useFlowStore } from "../../app/store/flowStore";

export function LauncherModal() {
  const promptDraft = useFlowStore((state) => state.promptDraft);
  const selectedStarterPrompt = useFlowStore((state) => state.selectedStarterPrompt);
  const keepSeparateProfile = useFlowStore((state) => state.keepSeparateProfile);
  const setPromptDraft = useFlowStore((state) => state.setPromptDraft);
  const selectStarterPrompt = useFlowStore((state) => state.selectStarterPrompt);
  const toggleSeparateProfile = useFlowStore((state) => state.toggleSeparateProfile);
  const closeLauncher = useFlowStore((state) => state.closeLauncher);
  const submitLauncher = useFlowStore((state) => state.submitLauncher);

  const helperText = useMemo(() => {
    if (keepSeparateProfile) {
      return "What you do here will not shape your usual recommendations unless you choose to save this room.";
    }

    return "This room can shape what Flow leans toward later in the experience.";
  }, [keepSeparateProfile]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitLauncher();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 p-4 backdrop-blur md:items-center">
      <div className="w-full max-w-3xl rounded-[28px] border border-white/10 bg-[#111111] p-6 shadow-spotify md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-spotify-green">
              Flow
            </p>
            <h2 className="mt-3 font-spotifyTitle text-3xl font-bold text-white md:text-4xl">
              Start a room for this moment
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-spotify-muted md:text-base">
              Tell Flow what you want right now. We&apos;ll turn it into a room built
              for this moment that you can tune while you listen.
            </p>
          </div>
          <button
            type="button"
            onClick={closeLauncher}
            className="rounded-full bg-white/5 p-3 text-sm text-spotify-muted transition hover:bg-white/10 hover:text-white"
            aria-label="Close Flow launcher"
          >
            ✕
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-white/60">
              What do you want to hear right now?
            </span>
            <textarea
              value={promptDraft}
              onChange={(event) => setPromptDraft(event.target.value)}
              rows={3}
              placeholder="What do you want to hear right now?"
              className="w-full resize-none rounded-[22px] border border-white/10 bg-spotify-surfaceAlt px-5 py-4 text-base text-white outline-none transition placeholder:text-spotify-muted focus:border-white/25"
            />
          </label>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-white/60">
              Starter prompts
            </p>
            <div className="flex flex-wrap gap-3">
              {STARTER_PROMPTS.map((prompt) => {
                const active = selectedStarterPrompt === prompt;

                return (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => selectStarterPrompt(prompt)}
                    className={`rounded-pill border px-4 py-3 text-sm font-bold transition ${
                      active
                        ? "border-spotify-green bg-spotify-green text-black"
                        : "border-white/10 bg-spotify-surface text-white hover:border-white/25 hover:bg-[#242424]"
                    }`}
                  >
                    {prompt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[22px] border border-white/8 bg-spotify-surface p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white">
                  Keep this room separate from my main taste profile
                </p>
                <p className="mt-2 max-w-2xl text-sm text-spotify-muted">{helperText}</p>
              </div>
              <button
                type="button"
                onClick={toggleSeparateProfile}
                className={`relative h-8 w-14 shrink-0 rounded-pill transition ${
                  keepSeparateProfile ? "bg-spotify-green" : "bg-white/20"
                }`}
                aria-pressed={keepSeparateProfile}
                aria-label="Toggle separate room behavior"
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                    keepSeparateProfile ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/8 pt-5 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-spotify-muted">
              Phase 1 captures intent and validates the launcher flow before room
              creation lands in Phase 2.
            </p>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-pill bg-spotify-green px-6 py-3 text-sm font-bold uppercase tracking-spotify text-black transition hover:scale-[1.02]"
            >
              Start room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
