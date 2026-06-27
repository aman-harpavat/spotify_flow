import { NavLink } from "react-router-dom";

const libraryAvatars = [
  { name: "Rainy Sets", tone: "from-emerald-500 to-cyan-500" },
  { name: "Discovery", tone: "from-orange-500 to-pink-500" },
  { name: "Night Drive", tone: "from-sky-500 to-violet-500" },
  { name: "Workout", tone: "from-lime-400 to-emerald-500" }
];

export function Sidebar() {
  return (
    <aside className="hidden w-[88px] shrink-0 flex-col rounded-[12px] bg-black px-3 py-4 md:flex">
      <div className="flex items-center justify-center pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-black text-black">
          S
        </div>
      </div>

      <div className="space-y-3">
        <NavLink
          to="/"
          className="flex h-14 items-center justify-center rounded-[18px] bg-spotify-surfaceAlt text-2xl text-white transition hover:bg-[#2a2a2a]"
        >
          <span aria-hidden="true">⌂</span>
        </NavLink>
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-spotify-surfaceAlt text-2xl text-spotify-muted transition hover:text-white"
        >
          +
        </button>
      </div>

      <div className="mt-6 flex flex-1 flex-col items-center gap-4">
        {libraryAvatars.map((avatar) => (
          <div
            key={avatar.name}
            className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${avatar.tone} text-xs font-bold uppercase tracking-[0.18em] text-black shadow-panel`}
            title={avatar.name}
          >
            {avatar.name.slice(0, 1)}
          </div>
        ))}
      </div>
    </aside>
  );
}
