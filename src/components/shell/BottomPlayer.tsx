const queuePreview = [
  "Now playing from Flow",
  "Temporary room",
  "Queue adapts as you steer"
];

export function BottomPlayer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-white/5 bg-black/95 px-3 py-3 backdrop-blur">
      <div className="flex flex-col gap-4 rounded-[16px] bg-black text-white md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-14 w-14 rounded-[6px] bg-gradient-to-br from-[#f7a55e] via-[#c96485] to-[#43305c]" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">Flow preview</p>
            <p className="truncate text-sm text-spotify-muted">
              Build a room to start playback
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-3">
          <div className="flex items-center gap-5 text-xl text-spotify-muted">
            <button type="button">↺</button>
            <button type="button">⏮</button>
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-black"
              aria-label="Play preview"
            >
              <svg
                aria-hidden="true"
                className="ml-[2px] h-4 w-4"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M3 2.4c0-.78.84-1.26 1.5-.86l8.2 4.96c.63.38.63 1.29 0 1.68L4.5 13.14A1 1 0 0 1 3 12.28V2.4Z" />
              </svg>
            </button>
            <button type="button">⏭</button>
            <button type="button">☰</button>
          </div>
          <div className="flex w-full max-w-[520px] items-center gap-3 text-xs text-spotify-muted">
            <span>0:00</span>
            <div className="h-1 flex-1 rounded-pill bg-white/10">
              <div className="h-1 w-[18%] rounded-pill bg-white" />
            </div>
            <span>3:46</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          {queuePreview.map((item) => (
            <span
              key={item}
              className="hidden rounded-pill bg-spotify-surfaceAlt px-3 py-2 text-xs text-spotify-muted lg:inline-flex"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
