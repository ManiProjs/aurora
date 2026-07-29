import { useEffect, useState } from "react";

import Toggle from "../components/Toggle";

import { useSettingsStore } from "../stores/settings";

import { useAuthStore } from "../stores/auth";

interface ThemeMetadata {
  file: string;

  id: string;

  name: string;

  author?: string;

  description?: string;

  version?: string;
}

export default function Settings() {
  const {
    discordRPC,

    animations,

    resumePlayback,

    autoplay,

    theme,

    customCSS,

    setDiscordRPC,

    setAnimations,

    setResumePlayback,

    setAutoplay,

    setTheme,

    setCustomCSS,
  } = useSettingsStore();

  const {
    server,

    username,

    logout,
  } = useAuthStore();

  const [themes, setThemes] = useState<ThemeMetadata[]>([]);

  useEffect(() => {
    window.themes.list().then(setThemes).catch(console.error);
  }, []);

  return (
    <main
      className="
        h-full
        overflow-y-auto
        p-8
        aurora-text
      "
    >
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">Settings</h1>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Appearance</h2>

          <div
            className="
              mt-4
              rounded-3xl
              aurora-glass
              p-6
              space-y-5
            "
          >
            <SettingRow
              title="Animations"
              description="Enable interface animations"
            >
              <Toggle value={animations} onChange={setAnimations} />
            </SettingRow>

            <div>
              <p className="font-medium">Theme</p>

              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as typeof theme)}
                className="
                  mt-2
                  aurora-input
                "
              >
                <option value="aurora">Aurora</option>

                <option value="light-aurora">Light Aurora</option>

                <option value="dark">Dark</option>

                <option value="amoled">AMOLED</option>

                {themes.map((item) => (
                  <option key={item.id} value={item.file}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="font-medium">Custom CSS</p>

              <textarea
                value={customCSS}

                onChange={(e) => setCustomCSS(e.target.value)}

                className="
                  mt-3
                  h-48
                  w-full
                  aurora-input
                  rounded-xl
                  resize-none
                  font-mono
                  text-sm
                "

                placeholder="/* Custom CSS */"
              />
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Playback</h2>

          <div
            className="
              mt-4
              rounded-3xl
              aurora-glass
              p-6
              space-y-5
            "
          >
            <SettingRow
              title="Resume playback"
              description="Continue where you stopped"
            >
              <Toggle value={resumePlayback} onChange={setResumePlayback} />
            </SettingRow>

            <SettingRow
              title="Autoplay next song"
              description="Automatically continue queue"
            >
              <Toggle value={autoplay} onChange={setAutoplay} />
            </SettingRow>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Integrations</h2>

          <div
            className="
              mt-4
              rounded-3xl
              aurora-glass
              p-6
            "
          >
            <SettingRow
              title="Discord Rich Presence"
              description="Show currently playing song"
            >
              <Toggle value={discordRPC} onChange={setDiscordRPC} />
            </SettingRow>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Accounts</h2>

          <div
            className="
              mt-4
              rounded-3xl
              aurora-glass
              p-6
            "
          >
            <p>{username}</p>

            <p className="text-sm aurora-text-muted">{server}</p>

            <button
              onClick={logout}
              className="
                mt-4
                rounded-xl
                bg-red-500/10
                px-5
                py-3
                text-red-400
              "
            >
              Log out
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
      "
    >
      <div>
        <p className="font-medium">{title}</p>

        <p className="text-sm aurora-text-muted">{description}</p>
      </div>

      {children}
    </div>
  );
}
