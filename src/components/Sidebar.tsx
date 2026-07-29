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
import type { LucideIcon } from "lucide-react";

import { useNavigationStore } from "../stores/navigation";
import { useAuthStore } from "../stores/auth";
import { useSearchStore } from "../stores/search";

interface SidebarItem {
  name: string;
  icon: LucideIcon;
  page?: string;
  action?: () => void;
}

const items: SidebarItem[] = [
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
    action: () => {
      useSearchStore.getState().setOpen(true);
    },
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

  const shortcut = navigator.platform.toLowerCase().includes("mac")
    ? "⌘K"
    : "Ctrl K";

  return (
    <motion.aside
      initial={{
        x: -30,
        opacity: 0,
      }}

      animate={{
        x: 0,
        opacity: 1,
      }}

      transition={{
        duration: 0.35,
      }}

      className="
        flex
        h-screen
        w-72
        flex-col
        border-r
        aurora-border
        aurora-background
        p-5
        aurora-text
      "
    >
      {/* Logo */}

      <motion.div
        initial={{
          opacity: 0,
          y: -10,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          delay: 0.1,
        }}

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
            aurora-button-primary
            text-xl
            font-bold
          "
        >
          A
        </div>

        <div>
          <h1 className="text-xl font-bold">Aurora</h1>

          <p className="text-xs aurora-text-muted">Music player</p>
        </div>
      </motion.div>

      {/* Navigation */}

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;

          const selected = page === item.page;

          return (
            <motion.button
              key={item.name}

              whileHover={{
                x: 4,
              }}

              whileTap={{
                scale: 0.97,
              }}

              onClick={() => {
                if (item.action) {
                  item.action();

                  return;
                }

                if (item.page) {
                  setPage(item.page as never);
                }
              }}

              className="
                relative
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-left
                aurora-button
              "
            >
              {selected && (
                <motion.div
                  layoutId="sidebar-active"

                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}

                  className="
                    absolute
                    inset-0
                    rounded-xl
                    bg-black/10
                    dark:bg-white/10
                  "
                />
              )}

              <span
                className="
                  relative
                  z-10
                  flex
                  items-center
                  gap-3
                "
              >
                <Icon size={20} />

                <span>{item.name}</span>
              </span>

              {item.action && (
                <kbd
                  className="
                    relative
                    z-10
                    ml-auto
                    rounded-md
                    aurora-border
                    px-2
                    py-1
                    text-xs
                    aurora-text-muted
                  "
                >
                  {shortcut}
                </kbd>
              )}
            </motion.button>
          );
        })}
      </nav>
    </motion.aside>
  );
}
