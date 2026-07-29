import Toggle from "../components/Toggle";

import { useSettingsStore } from "../stores/settings";

export default function Settings() {
  const {
    discordRPC,
    animations,
    resumePlayback,
    autoplay,
    theme,

    setDiscordRPC,
    setAnimations,
    setResumePlayback,
    setAutoplay,
    setTheme,
  } = useSettingsStore();

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

        {/* Appearance */}

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
                  rounded-xl
                  bg-zinc-900
                  px-4
                  py-2
                "
              >
                <option value="aurora">Aurora</option>

                <option value="dark">Dark</option>

                <option value="amoled">AMOLED</option>
              </select>
            </div>
          </div>
        </section>

        {/* Playback */}

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

        {/* Integrations */}

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

        {/* About */}

        <section className="mt-10">
          <h2 className="text-xl font-semibold">About</h2>

          <div
            className="
              mt-4
              rounded-3xl
              aurora-glass
              p-6
            "
          >
            <p className="font-semibold">Aurora</p>

            <p className="text-sm aurora-text-muted">Version 0.3.1-beta</p>
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
