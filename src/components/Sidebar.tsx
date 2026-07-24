import {
  Home,
  Disc3,
  Mic2,
  Music2,
  Search,
  Settings,
  LogOut,
} from "lucide-react";

import { motion } from "framer-motion";

import { useNavigationStore } from "../stores/navigation";
import { useAuthStore } from "../stores/auth";

const items = [
  {
    name: "Home",
    icon: Home,
    page: "home",
  },
  {
    name: "Albums",
    icon: Disc3,
    page: "albums",
  },
  {
    name: "Artists",
    icon: Mic2,
    page: "artists",
  },
  {
    name: "Songs",
    icon: Music2,
    page: "songs",
  },
  {
    name: "Search",
    icon: Search,
    page: "search",
  },
  {
    name: "Settings",
    icon: Settings,
    page: "settings",
  },
];

export default function Sidebar() {
  const page = useNavigationStore((s) => s.page);

  const setPage = useNavigationStore((s) => s.setPage);

  const username = useAuthStore((s) => s.username);

  const logout = useAuthStore((s) => s.logout);

  return (
    <aside
      className="
        flex
        h-screen
        w-72
        pb-28
        flex-col
        border-r
        border-white/10
        bg-zinc-950/80
        p-5
        text-white
        backdrop-blur-xl
      "
    >
      {/* Logo */}

      <div
        className="
          mb-10
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-white
            text-black
            text-xl
            font-bold
          "
        >
          A
        </div>

        <div>
          <h1 className="text-xl font-bold">Aurora</h1>

          <p
            className="
              text-xs
              text-zinc-500
            "
          >
            Music player
          </p>
        </div>
      </div>

      {/* Navigation */}

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;

          const active = page === item.page;

          return (
            <button
              key={item.page}
              onClick={() => setPage(item.page as any)}
              className="
                relative
                flex
                w-full
                items-center
                gap-4
                rounded-xl
                px-4
                py-3
                text-left
                text-zinc-400
                transition
                hover:text-white
              "
            >
              {active && (
                <motion.div
                  layoutId="active-sidebar"
                  className="
                    absolute
                    inset-0
                    rounded-xl
                    bg-white/10
                  "
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                />
              )}

              <Icon size={21} className="relative z-10" />

              <span
                className="
                  relative
                  z-10
                  font-medium
                "
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom user */}

      <div
        className="
          mt-auto
          rounded-2xl
          border
          border-white/10
          bg-white/5
          p-4
        "
      >
        <p
          className="
            truncate
            font-medium
          "
        >
          {username}
        </p>

        <p
          className="
            text-sm
            text-zinc-500
          "
        >
          Connected
        </p>

        <button
          onClick={logout}
          className="
            mt-4
            flex
            w-full
            items-center
            gap-2
            rounded-xl
            px-3
            py-2
            text-sm
            text-zinc-400
            transition
            hover:bg-white/10
            hover:text-white
          "
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}
