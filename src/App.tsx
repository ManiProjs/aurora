import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useAuthStore } from "./stores/auth";
import { useNavigationStore } from "./stores/navigation";
import { useSearchStore } from "./stores/search";
import { usePlayerStore } from "./stores/player";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Albums from "./pages/Albums";
import AlbumPage from "./pages/Album";
import Artists from "./pages/Artists";
import ArtistPage from "./pages/Artist";
import Songs from "./pages/Songs";
import Search from "./pages/Search";
import Settings from "./pages/Settings";

import Sidebar from "./components/Sidebar";
import SearchOverlay from "./components/SearchOverlay";
import AudioEngine from "./components/AudioEngine";
import MiniPlayer from "./components/MiniPlayer";
import FullPlayer from "./components/FullPlayer";
import TitleBar from "./components/TitleBar";
import Notifications from "./components/Notifications";
import StartupScreen from "./components/StartupScreen";

import { useDiscordRPC } from "./hooks/useDiscordRPC";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useMediaKeys } from "./hooks/useMediaKeys";
import { useTheme } from "./hooks/useTheme";
import { useUpdater } from "./hooks/useUpdater";

import { MINI_PLAYER_HEIGHT } from "./constants/layout";

export default function App() {
  const login = useAuthStore((s) => s.login);
  const authenticated = useAuthStore((s) => s.authenticated);

  const page = useNavigationStore((s) => s.page);

  const currentSong = usePlayerStore((s) => s.current);

  const [checkingAuth, setCheckingAuth] = useState(true);

  useUpdater();
  useDiscordRPC();
  useKeyboardShortcuts();
  useMediaKeys();
  useTheme();

  function renderPage() {
    switch (page) {
      case "albums":
        return <Albums />;

      case "album":
        return <AlbumPage />;

      case "artists":
        return <Artists />;

      case "artist":
        return <ArtistPage />;

      case "songs":
        return <Songs />;

      case "search":
        return <Search />;

      case "settings":
        return <Settings />;

      default:
        return <Home />;
    }
  }

  useEffect(() => {
    async function restoreSession() {
      const start = performance.now();

      try {
        const auth = await window.auth.loadAuth();

        if (auth) {
          login(auth.server, auth.username, auth.password);
        }
      } finally {
        const elapsed = performance.now() - start;
        const remaining = 500 - elapsed;

        if (remaining > 0) {
          await new Promise((resolve) => setTimeout(resolve, remaining));
        }

        setCheckingAuth(false);
      }
    }

    restoreSession();
  }, [login]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();

        useSearchStore.getState().setOpen(true);
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {checkingAuth ? (
        <motion.div
          key="startup"
          exit={{
            opacity: 0,
            scale: 1.05,
          }}
          transition={{
            duration: 0.4,
          }}
        >
          <StartupScreen />
        </motion.div>
      ) : !authenticated ? (
        <motion.div
          key="login"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
        >
          <Login />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.4,
          }}
          className="
            aurora-background
            aurora-text
            flex
            h-screen
            flex-col
            overflow-hidden
          "
        >
          <TitleBar />

          <div
            className="
              flex
              min-h-0
              flex-1
            "
          >
            <Sidebar />

            <main
              className="
                aurora-scrollbar
                flex-1
                overflow-y-auto
              "
              style={{
                paddingBottom: currentSong ? MINI_PLAYER_HEIGHT : 0,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={page}
                  initial={{
                    opacity: 0,
                    y: 16,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -16,
                  }}
                  transition={{
                    duration: 0.22,
                  }}
                  className="h-full"
                >
                  {renderPage()}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>

          <SearchOverlay />

          <AudioEngine />

          <AnimatePresence>{currentSong && <MiniPlayer />}</AnimatePresence>

          <FullPlayer />

          <Notifications />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
