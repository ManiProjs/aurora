import { useEffect, useState } from "react";

import Toggle from "../components/Toggle";
import ThemeCard from "../components/ThemeCard";

import { useSettingsStore } from "../stores/settings";
import { useAuthStore } from "../stores/auth";

import { HIDDEN_THEMES, checkSecretCSS } from "../utils/secrets";
import CodeEditor from "../components/CodeEditor";

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
    resumePlayback,
    autoplay,
    theme,
    customCSS,
    hiddenThemes,

    setDiscordRPC,
    setAnimations,
    setResumePlayback,
    setAutoplay,
    setTheme,
    setCustomCSS,
    unlockHiddenTheme,
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

  const hiddenThemeList = HIDDEN_THEMES.filter((theme) =>
    hiddenThemes.includes(theme.id),
  ).map((theme) => ({
    id: theme.id,
    name: theme.name,
    author: theme.author,
    variant: theme.variant,
    preview: theme.preview,
  }));

  const themes = [...builtInThemes, ...hiddenThemeList, ...externalThemes];

  useEffect(() => {
    loadThemes();
  }, []);

  async function loadThemes() {
    const themes = await window.themes.list();

    setExternalThemes(themes);
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
              <p className="font-medium">Themes</p>

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

                    onApply={() => {
                      setTheme(item.id);
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium">Custom CSS</p>

              <CodeEditor
                value={customCSS}
                onChange={(css) => {
                  setCustomCSS(css);

                  const unlocked = checkSecretCSS(css);

                  if (unlocked) {
                    for (const theme of HIDDEN_THEMES) {
                      unlockHiddenTheme(theme.id);
                    }
                  }
                }}
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
