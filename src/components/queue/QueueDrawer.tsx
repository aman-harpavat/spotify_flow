import { trackCatalog } from "../../data/demoRooms";
import { useFlowStore } from "../../app/store/flowStore";

export function QueueDrawer() {
  const activeRoom = useFlowStore((state) => state.activeRoom);
  const isQueueOpen = useFlowStore((state) => state.isQueueOpen);
  const currentTrackIndex = useFlowStore((state) => state.currentTrackIndex);
  const toggleQueue = useFlowStore((state) => state.toggleQueue);

  if (!activeRoom) {
    return null;
  }

  const currentTrack = trackCatalog[activeRoom.trackQueue[currentTrackIndex]];
  const nextUp = activeRoom.trackQueue
    .slice(currentTrackIndex + 1)
    .map((trackId) => trackCatalog[trackId]);

  return (
    <aside
      className={`fixed right-4 top-24 z-40 hidden w-[360px] rounded-[24px] border border-white/8 bg-[#101010]/95 p-5 shadow-spotify backdrop-blur transition-all duration-300 lg:block ${
        isQueueOpen
          ? "translate-x-0 opacity-100"
          : "pointer-events-none translate-x-8 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-spotify-green">
            Queue
          </p>
          <p className="mt-2 text-sm text-spotify-muted">
            The room updates this list as you steer.
          </p>
        </div>
        <button
          type="button"
          onClick={toggleQueue}
          className="rounded-full bg-white/5 p-3 text-sm text-spotify-muted transition hover:bg-white/10 hover:text-white"
          aria-label="Close queue"
        >
          ✕
        </button>
      </div>

      <div className="mt-6 rounded-[20px] bg-white/5 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
          Now playing
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div
            className={`h-14 w-14 rounded-[10px] bg-gradient-to-br ${currentTrack.coverGradient}`}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{currentTrack.title}</p>
            <p className="truncate text-sm text-spotify-muted">{currentTrack.artist}</p>
          </div>
          <span className="text-xs text-spotify-muted">{currentTrack.duration}</span>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
            Next up
          </p>
          <span className="text-xs text-spotify-muted">{nextUp.length} tracks</span>
        </div>
        <div className="space-y-3">
          {nextUp.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center gap-3 rounded-[16px] bg-white/5 p-3"
            >
              <div
                className={`h-12 w-12 rounded-[10px] bg-gradient-to-br ${track.coverGradient}`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">
                  {currentTrackIndex + index + 2}. {track.title}
                </p>
                <p className="truncate text-sm text-spotify-muted">{track.artist}</p>
              </div>
              <span className="text-xs text-spotify-muted">{track.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
