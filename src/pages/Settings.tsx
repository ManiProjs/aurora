import SettingsSection from "../components/SettingsSection";
import Toggle from "../components/Toggle";

import { useSettingsStore } from "../stores/settings";
import { useAuthStore } from "../stores/auth";

export default function Settings() {
  const {
    animations,
    autoScrollLyrics,
    autoplay,

    setAnimations,
    setAutoScrollLyrics,
    setAutoplay,

    discordRPC,
    setDiscordRPC,
  } = useSettingsStore();

  const { server, username, logout } = useAuthStore();

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>

        <p className="aurora-text-muted mt-2">Customize Aurora.</p>
      </div>

      <SettingsSection title="Account" description="Your Navidrome connection.">
        <div>
          <p className="font-medium">Server</p>

          <p className="aurora-text-muted">{server}</p>
        </div>

        <div>
          <p className="font-medium">Username</p>

          <p className="aurora-text-muted">{username}</p>
        </div>

        <button
          onClick={logout}
          className="
            rounded-xl
            bg-red-500
            px-4
            py-2
            text-white
          "
        >
          Logout
        </button>
      </SettingsSection>

      <SettingsSection title="Appearance">
        <SettingRow
          title="Animations"
          description="Enable or disable UI animations."
          value={animations}
          onChange={setAnimations}
        />
      </SettingsSection>

      <SettingsSection
        title="Integrations"
        description="Connect Aurora with other services."
      >
        <SettingRow
          title="Discord Rich Presence"
          description="Show what you're listening to on Discord."
          value={discordRPC}
          onChange={(value) => {
            setDiscordRPC(value);

            if (value) {
              window.discord?.start();
            } else {
              window.discord?.stop();
            }
          }}
        />
      </SettingsSection>

      <SettingsSection title="Lyrics">
        <SettingRow
          title="Auto-scroll lyrics"
          description="Automatically scroll lyrics as the song plays."
          value={autoScrollLyrics}
          onChange={setAutoScrollLyrics}
        />
      </SettingsSection>

      <SettingsSection title="Playback">
        <SettingRow
          title="Autoplay"
          description="Automatically play the next song when the current one ends."
          value={autoplay}
          onChange={setAutoplay}
        />
      </SettingsSection>

      <SettingsSection title="About">
        <p>Aurora v0.1.0-alpha.2</p>

        <p className="aurora-text-muted">
          A beautiful and animation-heavy Navidrome desktop client.
        </p>
      </SettingsSection>
    </div>
  );
}

function SettingRow({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description?: string;
  value: boolean;
  onChange(value: boolean): void;
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

        {description && (
          <p
            className="
            aurora-text-muted
            mt-1
            text-sm
          "
          >
            {description}
          </p>
        )}
      </div>

      <Toggle value={value} onChange={onChange} />
    </div>
  );
}
