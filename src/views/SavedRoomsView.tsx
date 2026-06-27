export function SavedRoomsView() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[1400px] items-center justify-center px-6 py-12">
      <div className="rounded-[24px] border border-white/8 bg-spotify-surface px-8 py-10 text-center shadow-panel">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-spotify-green">
          Your Rooms
        </p>
        <h1 className="mt-4 font-spotifyTitle text-3xl font-bold text-white">
          Saved rooms arrive in Phase 5
        </h1>
        <p className="mt-3 max-w-lg text-sm text-spotify-muted">
          This view is reserved for reopenable discovery rooms with fresh sessions
          in the same vibe.
        </p>
      </div>
    </div>
  );
}
