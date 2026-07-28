import { useState } from "react";
import { motion } from "framer-motion";

import { NavidromeClient } from "../api/navidrome";
import { useAuthStore } from "../stores/auth";

export default function Login() {
  const login = useAuthStore((s) => s.login);

  const [server, setServer] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    try {
      setLoading(true);
      setError("");

      const client = new NavidromeClient(server, username, password);

      await client.ping();

      await window.auth.saveAuth({
        server,
        username,
        password,
      });

      login(server, username, password);
    } catch (e) {
      setError(
        `Could not connect to Navidrome: ${
          e instanceof Error ? e.message : String(e)
        }`,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="
        aurora-background
        flex
        h-screen
        items-center
        justify-center
        aurora-text
      "
    >
      <motion.form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        initial={{
          opacity: 0,
          y: 20,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.4,
        }}
        className="
          aurora-glass
          w-96
          rounded-3xl
          p-8
          shadow-2xl
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-5xl"
          >
            🌌
          </motion.div>

          <div>
            <h1 className="text-4xl font-bold">Aurora</h1>

            <p
              className="
                mt-1
                text-sm
                aurora-text-muted
              "
            >
              Navidrome music player
            </p>
          </div>
        </div>

        <p
          className="
            mt-6
            aurora-text-muted
          "
        >
          Connect your Navidrome server
        </p>

        <div className="mt-6 space-y-3">
          <input
            className="input"
            placeholder="Server URL"
            value={server}
            onChange={(e) => setServer(e.target.value)}
            disabled={loading}
          />

          <input
            className="input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />

          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && (
          <motion.p
            initial={{
              opacity: 0,
              y: -5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              mt-4
              text-sm
              text-red-400
            "
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="
            mt-6
            flex
            w-full
            items-center
            justify-center
            rounded-xl
            bg-white
            py-3
            font-semibold
            text-black
            transition
            hover:scale-[1.02]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading ? "Connecting..." : "Connect"}
        </button>
      </motion.form>
    </main>
  );
}
