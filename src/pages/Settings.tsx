import { useEffect, useState } from "react";

import Toggle from "../components/Toggle";
import ThemeCard from "../components/ThemeCard";

import { useSettingsStore } from "../stores/settings";
import { useAuthStore } from "../stores/auth";

interface ThemeMetadata {
  file?: string;

  id: string;

  name: string;

  author?: string;

  description?: string;

  version?: string;

  variant?: string;

  preview?: string;
}

export default function Settings() {
  const {
    discordRPC,

    animations,
    reduceAnimations,
    compactMode,

    resumePlayback,
    autoplay,
    defaultVolume,
    crossfade,

    autoScrollLyrics,
    lyricsFontSize,
    lyricsOffset,

    theme,
    customCSS,

    setDiscordRPC,

    setAnimations,
    setReduceAnimations,
    setCompactMode,

    setResumePlayback,
    setAutoplay,
    setDefaultVolume,
    setCrossfade,

    setAutoScrollLyrics,
    setLyricsFontSize,
    setLyricsOffset,

    setTheme,
    setCustomCSS,
  } = useSettingsStore();

  const { server, username, logout } = useAuthStore();

  const builtInThemes: ThemeMetadata[] = [
    {
      id: "aurora",
      name: "Aurora",
      author: "Aurora",
      variant: "dark",
      preview: "#09090b",
    },

    {
      id: "light-aurora",
      name: "Light Aurora",
      author: "Aurora",
      variant: "light",
      preview: "#fafafa",
    },

    {
      id: "dark",
      name: "Dark",
      author: "Aurora",
      variant: "dark",
      preview: "#18181b",
    },

    {
      id: "amoled",
      name: "AMOLED",
      author: "Aurora",
      variant: "dark",
      preview: "#000000",
    },
  ];

  const [externalThemes, setExternalThemes] = useState<ThemeMetadata[]>([]);

  const themes = [...builtInThemes, ...externalThemes];

  useEffect(() => {
    loadThemes();
  }, []);

  async function loadThemes() {
    const result = await window.themes.list();

    setExternalThemes(result);
  }

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

            <SettingRow
              title="Reduce animations"
              description="Disable heavy animations"
            >
              <Toggle value={reduceAnimations} onChange={setReduceAnimations} />
            </SettingRow>

            <SettingRow
              title="Compact mode"
              description="Use smaller interface spacing"
            >
              <Toggle value={compactMode} onChange={setCompactMode} />
            </SettingRow>

            <div>
              <p className="font-medium">Themes</p>

              <div
                className="
                  mt-4
                  flex
                  gap-3
                "
              >
                <button
                  onClick={() => window.themes.openFolder()}
                  className="
                    rounded-xl
                    aurora-button-primary
                  "
                >
                  Open Themes Folder
                </button>

                <button
                  onClick={async () => {
                    const imported = await window.themes.import();

                    if (imported) {
                      loadThemes();
                    }
                  }}
                  className="
                    rounded-xl
                    aurora-button
                  "
                >
                  Import Theme
                </button>
              </div>

              <div
                className="
                  mt-4
                  grid
                  gap-5
                  sm:grid-cols-2
                "
              >
                {themes.map((item) => (
                  <ThemeCard
                    key={item.id}

                    theme={item}

                    active={theme === item.id}

                    onApply={() => setTheme(item.id)}

                    onExport={
                      item.file
                        ? () => window.themes.export(item.file!)
                        : undefined
                    }
                  />
                ))}
              </div>
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

        {/* Player */}

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Player</h2>

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

            <SettingRow
              title="Crossfade"
              description="Smooth transitions between songs"
            >
              <Toggle value={crossfade} onChange={setCrossfade} />
            </SettingRow>

            <div>
              <p className="font-medium">Default volume</p>

              <input
                type="range"

                min="0"

                max="1"

                step="0.01"

                value={defaultVolume}

                onChange={(e) => setDefaultVolume(Number(e.target.value))}

                className="mt-3 w-full"
              />
            </div>
          </div>
        </section>

        {/* Lyrics */}

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Lyrics</h2>

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
              title="Auto-scroll lyrics"
              description="Follow the current song position"
            >
              <Toggle value={autoScrollLyrics} onChange={setAutoScrollLyrics} />
            </SettingRow>

            <div>
              <p className="font-medium">Font size</p>

              <input
                type="range"
                min="12"
                max="32"
                value={lyricsFontSize}

                onChange={(e) => setLyricsFontSize(Number(e.target.value))}

                className="mt-3 w-full"
              />
            </div>

            <div>
              <p className="font-medium">Sync offset</p>

              <input
                type="number"

                value={lyricsOffset}

                onChange={(e) => setLyricsOffset(Number(e.target.value))}

                className="
                  mt-3
                  aurora-input
                  w-full
                "
              />
            </div>
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

        {/* Account */}

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Account</h2>

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
