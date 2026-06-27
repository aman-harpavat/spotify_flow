import { FlowEntryCard } from "../components/home/FlowEntryCard";
import { LauncherModal } from "../components/launcher/LauncherModal";
import { useFlowStore } from "../app/store/flowStore";

const quickCollections = [
  {
    title: "Rainy evening Hindi",
    description: "Soft Hindi songs for a rainy evening.",
    tone: "bg-gradient-to-br from-[#1d6b5a] to-[#0d2126]"
  },
  {
    title: "Fresh workout music",
    description: "High-energy picks that feel less familiar.",
    tone: "bg-gradient-to-br from-[#7c3f62] to-[#1d1622]"
  },
  {
    title: "Surprise me",
    description: "Something melodic, Indian, and a little unexpected.",
    tone: "bg-gradient-to-br from-[#83611b] to-[#241f12]"
  }
];

export function HomeView() {
  const isLauncherOpen = useFlowStore((state) => state.isLauncherOpen);
  const openLauncher = useFlowStore((state) => state.openLauncher);

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
                Starting points
              </h3>
            </div>
            <span className="text-sm font-semibold text-white/60">Spotify Flow prototype</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quickCollections.map((collection) => (
              <button
                key={collection.title}
                type="button"
                onClick={openLauncher}
                className="group overflow-hidden rounded-[18px] bg-spotify-surface p-4 text-left shadow-panel transition hover:bg-[#222222]"
              >
                <div className={`h-40 rounded-[14px] ${collection.tone}`} />
                <p className="mt-4 text-lg font-bold text-white">{collection.title}</p>
                <p className="mt-2 text-sm text-spotify-muted">
                  {collection.description}
                </p>
                <span className="mt-4 inline-flex text-sm font-semibold text-white/70 transition group-hover:text-white">
                  Open Flow
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {isLauncherOpen ? <LauncherModal /> : null}
    </>
  );
}
