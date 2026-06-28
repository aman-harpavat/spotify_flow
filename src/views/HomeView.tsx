import { useNavigate } from "react-router-dom";
import { arcDisplayNames } from "../data/demoRooms";
import { FlowEntryCard } from "../components/home/FlowEntryCard";
import { LauncherModal } from "../components/launcher/LauncherModal";
import { useFlowStore } from "../app/store/flowStore";

const savedRoomTones: Record<string, string> = {
  rainy_evening: "bg-gradient-to-br from-[#1d6b5a] to-[#0d2126]",
  fresh_workout: "bg-gradient-to-br from-[#7c3f62] to-[#1d1622]",
  melodic_surprise: "bg-gradient-to-br from-[#83611b] to-[#241f12]"
};

export function HomeView() {
  const navigate = useNavigate();
  const isLauncherOpen = useFlowStore((state) => state.isLauncherOpen);
  const openLauncher = useFlowStore((state) => state.openLauncher);
  const startDemoRoomFromPrompt = useFlowStore((state) => state.startDemoRoomFromPrompt);
  const savedRooms = useFlowStore((state) => state.savedRooms);
  const reopenSavedRoom = useFlowStore((state) => state.reopenSavedRoom);

  const handleOpenCollection = (title: string) => {
    const result = startDemoRoomFromPrompt(title);

    if (result.ok && result.roomId) {
      navigate(`/room/${result.roomId}`);
    }
  };

  const handleOpenSavedRoom = (savedRoomId: string) => {
    const result = reopenSavedRoom(savedRoomId);

    if (result.ok && result.roomId) {
      navigate(`/room/${result.roomId}`);
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-wrap gap-3">
          {["All", "Music", "Discovery"].map((pill) => (
            <span
              key={pill}
              className={`inline-flex rounded-pill px-4 py-3 text-sm font-semibold ${
                pill === "Music"
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/85"
              }`}
            >
              {pill}
            </span>
          ))}
        </div>

        <div className="mt-8">
          <FlowEntryCard onOpen={openLauncher} />
        </div>

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-sm text-white/65">Built for active explorers</p>
              <h3 className="font-spotifyTitle text-3xl font-bold text-white">
                Saved rooms
              </h3>
            </div>
            <span className="text-sm font-semibold text-white/60">Spotify Flow prototype</span>
          </div>
          {savedRooms.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {savedRooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => handleOpenSavedRoom(room.id)}
                  className="group overflow-hidden rounded-[18px] bg-spotify-surface p-4 text-left shadow-panel transition hover:bg-[#222222]"
                >
                  <div className={`h-40 rounded-[14px] ${savedRoomTones[room.demoFlow]}`} />
                  <p className="mt-4 text-lg font-bold text-white">{room.title}</p>
                  <p className="mt-2 text-sm text-spotify-muted">
                    {room.cardHelper}
                  </p>
                  <span className="mt-4 inline-flex rounded-pill bg-white/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/75">
                    {arcDisplayNames[room.arc]}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-[18px] border border-white/8 bg-spotify-surface px-6 py-8 text-center shadow-panel">
              <p className="text-lg font-bold text-white">No saved rooms yet</p>
              <p className="mt-2 text-sm text-spotify-muted">
                Save a Flow room and it will show up here for a fresh session later.
              </p>
            </div>
          )}
        </section>

      </div>

      {isLauncherOpen ? <LauncherModal /> : null}
    </>
  );
}
