import { useEffect, useState } from "react";
import { useAuthStore } from "./stores/auth";

import Login from "./pages/Login";
import Home from "./pages/Home";

import Sidebar from "./components/Sidebar";
import AudioEngine from "./components/AudioEngine";
import MiniPlayer from "./components/MiniPlayer";
import FullPlayer from "./components/FullPlayer";

import Albums from "./pages/Albums";
import Artists from "./pages/Artists";
import Songs from "./pages/Songs";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import AlbumPage from "./pages/Album";

import { useNavigationStore } from "./stores/navigation";

import { AnimatePresence, motion } from "framer-motion";

export default function App() {
  const login = useAuthStore((state) => state.login);
  const authenticated = useAuthStore((state) => state.authenticated);

  const [checkingAuth, setCheckingAuth] = useState(true);

  const page = useNavigationStore((s) => s.page);

  function renderPage() {
    switch (page) {
      case "albums":
        return <Albums />;

      case "album":
        return <AlbumPage />;

      case "artists":
        return <Artists />;

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
        const auth = await window.aurora.loadAuth();

        if (auth) {
          login(auth.server, auth.username, auth.password);
        }
      } finally {
        setCheckingAuth(false);
      }
    }

    restoreSession();
  }, [login]);

  if (checkingAuth) {
    return (
      <div
        className="
        flex
        h-screen
        items-center
        justify-center
        bg-zinc-950
        text-white
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
        flex
        h-screen
        overflow-hidden
        bg-zinc-950
        text-white
      "
    >
      <Sidebar />

      <main
        className="
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
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -15,
            }}
            transition={{
              duration: 0.25,
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
