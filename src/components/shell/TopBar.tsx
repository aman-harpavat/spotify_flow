export function TopBar() {
  return (
    <header className="flex items-center gap-3 border-b border-white/5 bg-black/70 px-4 py-4 backdrop-blur md:px-6">
      <button
        type="button"
        className="hidden h-12 w-12 items-center justify-center rounded-full bg-spotify-surfaceAlt text-white md:flex"
      >
        ⌂
      </button>
      <div className="flex min-w-0 flex-1 items-center rounded-pill bg-spotify-surfaceAlt px-5 py-3 text-spotify-muted shadow-panel">
        <span className="pr-3 text-lg">⌕</span>
        <span className="truncate text-sm font-medium md:text-base">
          What do you want to play?
        </span>
      </div>
      <button
        type="button"
        className="hidden rounded-pill bg-white px-5 py-3 text-sm font-bold text-black md:block"
      >
        Explore Premium
      </button>
      <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#1f5e47] bg-[#f3a35f] text-sm font-black text-black">
        A
      </div>
    </header>
  );
}
