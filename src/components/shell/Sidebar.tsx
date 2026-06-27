import { NavLink } from "react-router-dom";

const libraryAvatars = [
  {
    name: "Rahat Fateh Ali Khan",
    shortName: "Rahat",
    tone: "from-cyan-400 to-teal-500"
  },
  {
    name: "Diljit Dosanjh",
    shortName: "Diljit",
    tone: "from-orange-400 to-pink-500"
  },
  {
    name: "Nikhita Gandhi",
    shortName: "Nikhita",
    tone: "from-sky-400 to-indigo-500"
  },
  {
    name: "When Chai Met Toast",
    shortName: "W.C.M.T.",
    tone: "from-lime-400 to-emerald-500"
  }
];

export function Sidebar() {
  return (
    <aside className="hidden w-[118px] shrink-0 flex-col rounded-[12px] bg-black px-3 py-4 md:flex">
      <div className="flex items-center justify-center pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-black text-black">
          S
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <NavLink
          to="/"
          className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-spotify-surfaceAlt text-white transition hover:bg-[#2a2a2a]"
          aria-label="Home"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7">
            <path
              d="M4 10.8 12 4l8 6.8V20a1 1 0 0 1-1 1h-5.5v-6h-3V21H5a1 1 0 0 1-1-1v-9.2Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </NavLink>
        <button
          type="button"
          aria-label="Create something new"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-spotify-surfaceAlt text-spotify-muted transition hover:text-white"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7">
            <path
              d="M12 5v14M5 12h14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="mt-6 flex flex-1 flex-col items-center gap-5">
        {libraryAvatars.map((avatar) => (
          <button
            type="button"
            key={avatar.name}
            className="flex w-full flex-col items-center gap-2 text-center"
            title={avatar.name}
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${avatar.tone} px-2 text-[10px] font-black uppercase tracking-[0.08em] text-black shadow-panel`}
            >
              {avatar.shortName}
            </div>
            <span className="max-w-[86px] text-[11px] leading-tight text-spotify-muted">
              {avatar.name}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
