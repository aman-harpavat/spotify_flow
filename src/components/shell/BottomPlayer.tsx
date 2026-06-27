import { useEffect } from "react";
import {
  arcDisplayNames,
  durationToSeconds,
  formatPlaybackTime,
  previewQueue,
  trackCatalog
} from "../../data/demoRooms";
import { useFlowStore } from "../../app/store/flowStore";

export function BottomPlayer() {
  const activeRoom = useFlowStore((state) => state.activeRoom);
  const currentTrackIndex = useFlowStore((state) => state.currentTrackIndex);
  const previewCurrentTrackIndex = useFlowStore((state) => state.previewCurrentTrackIndex);
  const isPlaying = useFlowStore((state) => state.isPlaying);
  const togglePlayback = useFlowStore((state) => state.togglePlayback);
  const playbackProgressSeconds = useFlowStore((state) => state.playbackProgressSeconds);
  const tickPlayback = useFlowStore((state) => state.tickPlayback);
  const playNextTrack = useFlowStore((state) => state.playNextTrack);
  const playPreviousTrack = useFlowStore((state) => state.playPreviousTrack);
  const toggleQueue = useFlowStore((state) => state.toggleQueue);
  const isQueueOpen = useFlowStore((state) => state.isQueueOpen);
  const currentTrack = activeRoom
    ? trackCatalog[activeRoom.currentTrackId]
    : trackCatalog[previewQueue[previewCurrentTrackIndex]];
  const trackDurationSeconds = currentTrack ? durationToSeconds(currentTrack.duration) : 0;
  const progressRatio =
    trackDurationSeconds > 0
      ? Math.min(playbackProgressSeconds / trackDurationSeconds, 1)
      : 0;
  const previousDisabled = activeRoom
    ? currentTrackIndex <= 0
    : previewCurrentTrackIndex <= 0;

  useEffect(() => {
    if (!isPlaying || !currentTrack) {
      return;
    }

    const intervalId = window.setInterval(() => {
      tickPlayback(trackDurationSeconds);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [currentTrack, isPlaying, tickPlayback, trackDurationSeconds]);

  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-white/5 bg-black/95 px-3 py-3 backdrop-blur">
      <div className="flex flex-col gap-4 rounded-[16px] bg-black text-white md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`h-14 w-14 rounded-[6px] bg-gradient-to-br ${
              currentTrack?.coverGradient ?? "from-[#f7a55e] via-[#c96485] to-[#43305c]"
            }`}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">
              {currentTrack ? currentTrack.title : "Flow preview"}
            </p>
            <p className="truncate text-sm text-spotify-muted">
              {activeRoom && currentTrack
                ? `${currentTrack.artist} • ${activeRoom.title}`
                : currentTrack
                  ? `${currentTrack.artist} • Preview mix`
                  : "Build a room to start playback"}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-3">
          <div className="flex items-center gap-5 text-xl text-spotify-muted">
            <button type="button">↺</button>
            <button
              type="button"
              onClick={playPreviousTrack}
              aria-label="Previous track"
              disabled={previousDisabled}
              className={previousDisabled ? "cursor-not-allowed opacity-35" : undefined}
            >
              ⏮
            </button>
            <button
              type="button"
              onClick={togglePlayback}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-black"
              aria-label={isPlaying ? "Pause playback" : "Play playback"}
            >
              {isPlaying ? (
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 3h3v10H4V3Zm5 0h3v10H9V3Z" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  className="ml-[2px] h-4 w-4"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M3 2.4c0-.78.84-1.26 1.5-.86l8.2 4.96c.63.38.63 1.29 0 1.68L4.5 13.14A1 1 0 0 1 3 12.28V2.4Z" />
                </svg>
              )}
            </button>
            <button type="button" onClick={playNextTrack} aria-label="Next track">
              ⏭
            </button>
            <button
              type="button"
              onClick={toggleQueue}
              aria-label={isQueueOpen ? "Hide queue" : "Show queue"}
              className={isQueueOpen ? "text-white" : undefined}
            >
              ☰
            </button>
          </div>
          <div className="flex w-full max-w-[520px] items-center gap-3 text-xs text-spotify-muted">
            <span>{formatPlaybackTime(playbackProgressSeconds)}</span>
            <div className="h-1 flex-1 rounded-pill bg-white/10">
              <div
                className="h-1 rounded-pill bg-white transition-[width] duration-700 ease-linear"
                style={{
                  width: `${Math.max(progressRatio * 100, currentTrack ? 1 : 4)}%`
                }}
              />
            </div>
            <span>
              {currentTrack
                ? formatPlaybackTime(trackDurationSeconds - playbackProgressSeconds)
                : "3:46"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="hidden rounded-pill bg-spotify-surfaceAlt px-3 py-2 text-xs text-spotify-muted lg:inline-flex">
            {activeRoom ? "Now playing from Flow" : "Ready when you are"}
          </span>
          <span className="hidden rounded-pill bg-spotify-surfaceAlt px-3 py-2 text-xs text-spotify-muted lg:inline-flex">
            {activeRoom ? arcDisplayNames[activeRoom.arc] : "Preview mix"}
          </span>
          <span className="hidden rounded-pill bg-spotify-surfaceAlt px-3 py-2 text-xs text-spotify-muted lg:inline-flex">
            {isQueueOpen ? "Queue open" : "Open queue"}
          </span>
        </div>
      </div>
    </footer>
  );
}
