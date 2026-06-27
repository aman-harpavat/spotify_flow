import { FlowEntryCard } from "../components/home/FlowEntryCard";
import { LauncherModal } from "../components/launcher/LauncherModal";
import { useFlowStore } from "../app/store/flowStore";

const quickCollections = [
  "Soft-focus evenings",
  "Discovery arcs",
  "Fresh rotation",
  "Saved rooms soon"
];

export function HomeView() {
  const isLauncherOpen = useFlowStore((state) => state.isLauncherOpen);
  const openLauncher = useFlowStore((state) => state.openLauncher);

  return (
    <>
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-wrap gap-3">
          {["All", "Music", "Discovery"].map((pill, index) => (
            <span
              key={pill}
              className={`inline-flex rounded-pill px-4 py-3 text-sm font-semibold ${
                index === 0
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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quickCollections.map((collection, index) => (
              <button
                key={collection}
                type="button"
                onClick={openLauncher}
                className="group overflow-hidden rounded-[18px] bg-spotify-surface p-4 text-left shadow-panel transition hover:bg-[#222222]"
              >
                <div
                  className={`h-40 rounded-[14px] ${
                    index === 0
                      ? "bg-gradient-to-br from-[#1d6b5a] to-[#0d2126]"
                      : index === 1
                        ? "bg-gradient-to-br from-[#7c3f62] to-[#1d1622]"
                        : index === 2
                          ? "bg-gradient-to-br from-[#83611b] to-[#241f12]"
                          : "bg-gradient-to-br from-[#364a5c] to-[#161b28]"
                  }`}
                />
                <p className="mt-4 text-lg font-bold text-white">{collection}</p>
                <p className="mt-2 text-sm text-spotify-muted">
                  Open Flow to start a temporary room for this moment.
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
