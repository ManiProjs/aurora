import { useState } from "react";
import { NavidromeClient } from "../api/navidrome";
import { useAuthStore } from "../stores/auth";

export default function Login() {
  const login = useAuthStore((s) => s.login);

  const [server, setServer] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function submit() {
    try {
      const client = new NavidromeClient(server, username, password);

      await client.ping();

      await window.aurora.saveAuth({
        server,
        username,
        password,
      });

      login(server, username, password);
    } catch (e) {
      setError(`Could not connect to Navidrome: ${e}`);
    }
  }

  return (
    <main
      className="
      flex
      h-screen
      items-center
      justify-center
      bg-zinc-950
      text-white
    "
    >
      <div
        className="
        w-96
        rounded-3xl
        bg-zinc-900
        p-8
        shadow-2xl
      "
      >
        <h1 className="text-4xl font-bold">Aurora 🌌</h1>

        <p className="mt-2 text-zinc-400">Connect your Navidrome server</p>

        <input
          className="input"
          placeholder="Server URL"
          value={server}
          onChange={(e) => setServer(e.target.value)}
        />

        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="mt-3 text-red-400">{error}</p>}

        <button
          onClick={submit}
          className="
            mt-6
            w-full
            rounded-xl
            bg-white
            py-3
            font-semibold
            text-black
          "
        >
          Connect
        </button>
      </div>
    </main>
  );
}
