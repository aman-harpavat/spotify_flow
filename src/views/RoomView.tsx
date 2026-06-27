export function RoomView() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[1400px] items-center justify-center px-6 py-12">
      <div className="rounded-[24px] border border-white/8 bg-spotify-surface px-8 py-10 text-center shadow-panel">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-spotify-green">
          Active Flow Room
        </p>
        <h1 className="mt-4 font-spotifyTitle text-3xl font-bold text-white">
          Room playback lands in Phase 2
        </h1>
        <p className="mt-3 max-w-lg text-sm text-spotify-muted">
          Arc suggestion, room creation, and immediate playback are intentionally
          sequenced after this launcher phase.
        </p>
      </div>
    </div>
  );
}
