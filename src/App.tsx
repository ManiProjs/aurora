import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useAuthStore } from "./stores/auth";
import { useNavigationStore } from "./stores/navigation";
import { useSearchStore } from "./stores/search";

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
import { useDiscordRPC } from "./hooks/useDiscordRPC";

export default function App() {
  const login = useAuthStore((s) => s.login);
  const authenticated = useAuthStore((s) => s.authenticated);

  const page = useNavigationStore((s) => s.page);

  const [checkingAuth, setCheckingAuth] = useState(true);

  useDiscordRPC();

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
      try {
        const auth = await window.auth.loadAuth();

        if (auth) {
          login(auth.server, auth.username, auth.password);
        }
      } finally {
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

  if (checkingAuth) {
    return (
      <div
        className="
          aurora-background
          aurora-text
          flex
          h-screen
          items-center
          justify-center
        "
      >
        Loading...
      </div>
    );
  }

  if (!authenticated) {
    return <Login />;
  }

  return (
    <div
      className="
        aurora-background
        aurora-text
        flex
        h-screen
        overflow-hidden
      "
    >
      <Sidebar />

      <SearchOverlay />

      <main
        className="
          aurora-scrollbar
          flex-1
          overflow-y-auto
          pb-24
        "
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
              ease: "easeOut",
            }}
            className="h-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <AudioEngine />

      <MiniPlayer />

      <FullPlayer />
    </div>
  );
}
