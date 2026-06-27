type FlowEntryCardProps = {
  onOpen: () => void;
};

export function FlowEntryCard({ onOpen }: FlowEntryCardProps) {
  return (
    <section className="rounded-[22px] bg-gradient-to-br from-[#c05f89] via-[#7d3b63] to-[#221826] p-6 shadow-spotify md:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">
            Flow
          </p>
          <h2 className="mt-3 font-spotifyTitle text-4xl font-bold text-white md:text-6xl">
            Find your next sound
          </h2>
          <p className="mt-4 max-w-xl text-base text-[#f6d9e5] md:text-lg">
            Start a room for what you want right now. Explore a vibe, tune it as
            you listen, and keep your usual recommendations feeling familiar
            while you explore.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onOpen}
              className="rounded-pill bg-spotify-green px-6 py-3 text-sm font-bold uppercase tracking-spotify text-black transition hover:scale-[1.02]"
            >
              Open Flow
            </button>
            <span className="inline-flex items-center rounded-pill bg-white/10 px-4 py-3 text-sm text-white/80">
              Made for right now
            </span>
            <span className="inline-flex items-center rounded-pill bg-white/10 px-4 py-3 text-sm text-white/80">
              Tune it as you listen
            </span>
          </div>
        </div>

        <div className="grid min-w-[300px] max-w-[360px] gap-3 rounded-[18px] bg-black/25 p-4 backdrop-blur">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/60">
            <span>Playable room</span>
            <span className="whitespace-nowrap rounded-pill bg-white/10 px-3 py-1">
              Just for this moment
            </span>
          </div>
          <div className="rounded-[16px] bg-black/30 p-4">
            <p className="text-lg font-bold text-white">Rainy Evening Flow</p>
            <p className="mt-2 text-sm text-white/70">
              Exploring soft Hindi for a rainy evening
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-pill bg-white/10 px-3 py-2 text-xs text-white/80">
                Deep Dive
              </span>
              <span className="rounded-pill bg-white/10 px-3 py-2 text-xs text-white/80">
                Starts with your vibe
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
