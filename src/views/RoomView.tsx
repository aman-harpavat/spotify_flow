import { Navigate, useParams } from "react-router-dom";
import { arcLabels, pulseLabels, trackCatalog } from "../data/demoRooms";
import { useFlowStore } from "../app/store/flowStore";

export function RoomView() {
  const { roomId } = useParams();
  const activeRoom = useFlowStore((state) => state.activeRoom);

  if (!activeRoom || activeRoom.id !== roomId) {
    return <Navigate to="/" replace />;
  }

  const currentTrack = trackCatalog[activeRoom.currentTrackId];
  const nextUp = activeRoom.trackQueue.slice(1).map((trackId) => trackCatalog[trackId]);

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
                {arcLabels[activeRoom.arc]}
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
                  Room direction
                </p>
                <p className="mt-3 text-lg font-bold text-white">{activeRoom.helperText}</p>
                <p className="mt-3 text-sm text-spotify-muted">
                  Playback starts immediately when you enter. Queue updates and live
                  steering land in the next phase.
                </p>
              </div>

              <div className="rounded-[20px] border border-white/8 bg-spotify-surface p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                      Queue access
                    </p>
                    <p className="mt-2 text-sm text-spotify-muted">
                      The queue drawer is the next build step, but the session queue is
                      already seeded below.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-pill border border-white/10 px-4 py-2 text-sm font-bold text-white/85 transition hover:border-white/25 hover:bg-white/5"
                  >
                    Queue
                  </button>
                </div>
              </div>

              <div className="rounded-[20px] border border-white/8 bg-spotify-surface p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                      Prototype hint
                    </p>
                    <p className="mt-2 text-sm text-white">{activeRoom.testHint}</p>
                  </div>
                  <span className="rounded-pill bg-white/10 px-3 py-2 text-xs text-white/65">
                    Playback live
                  </span>
                </div>
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
                      {index + 2}. {track.title}
                    </p>
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
