import { Home, Disc3, Users, Music2, Search, Settings } from "lucide-react";

import { useNavigationStore, type Page } from "../stores/navigation";

const items: {
  icon: typeof Home;
  name: string;
  page: Page;
}[] = [
  {
    icon: Home,
    name: "Home",
    page: "home",
  },
  {
    icon: Disc3,
    name: "Albums",
    page: "albums",
  },
  {
    icon: Users,
    name: "Artists",
    page: "artists",
  },
  {
    icon: Music2,
    name: "Songs",
    page: "songs",
  },
  {
    icon: Search,
    name: "Search",
    page: "search",
  },
  {
    icon: Settings,
    name: "Settings",
    page: "settings",
  },
];

export default function Sidebar() {
  const page = useNavigationStore((s) => s.page);

  const setPage = useNavigationStore((s) => s.setPage);

  return (
    <aside
      className="
        flex
        h-screen
        w-64
        shrink-0
        flex-col
        border-r
        border-zinc-800
        bg-zinc-950
        p-6
      "
    >
      <h1
        className="
          mb-10
          text-3xl
          font-bold
        "
      >
        Aurora 🌌
      </h1>

      <nav className="space-y-2">
        {items.map(({ icon: Icon, name, page: target }) => (
          <button
            key={target}
            onClick={() => setPage(target)}
            className={`
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                transition

                ${
                  page === target
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }
              `}
          >
            <Icon size={20} />

            {name}
          </button>
        ))}
      </nav>
    </aside>
  );
}
