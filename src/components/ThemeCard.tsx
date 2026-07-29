import { Check, Download } from "lucide-react";

interface ThemeCardProps {
  theme: {
    id: string;

    file?: string;

    name: string;

    author?: string;

    description?: string;

    variant?: string;

    preview?: string;
  };

  active: boolean;

  onApply(): void;

  onExport?(): void;
}

export default function ThemeCard({
  theme,
  active,
  onApply,
  onExport,
}: ThemeCardProps) {
  return (
    <div
      className="
        aurora-card
        overflow-hidden
      "
    >
      {/* Preview */}

      <div
        className="
          relative
          h-36
          w-full
          p-4
        "
        style={{
          background: theme.preview ?? "#18181b",
        }}
      >
        <div
          className="
            rounded-2xl
            bg-black/20
            p-4
            backdrop-blur-xl
            text-white
          "
        >
          <p className="font-semibold">Aurora</p>

          <p className="text-sm opacity-70">Theme Preview</p>
        </div>
      </div>

      <div className="p-5">
        <h3
          className="
            text-lg
            font-semibold
          "
        >
          {theme.name}
        </h3>

        <p
          className="
            aurora-text-muted
            text-sm
          "
        >
          {theme.author ?? "Unknown author"}
        </p>

        {theme.description && (
          <p
            className="
              mt-3
              text-sm
              aurora-text-muted
            "
          >
            {theme.description}
          </p>
        )}

        {theme.variant && (
          <p
            className="
              mt-2
              text-xs
              uppercase
              aurora-text-muted
            "
          >
            {theme.variant}
          </p>
        )}

        <div
          className="
            mt-5
            flex
            gap-2
          "
        >
          <button
            disabled={active}
            onClick={onApply}
            className="
              flex
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              aurora-button-primary
              disabled:opacity-50
            "
          >
            {active && <Check size={16} />}

            {active ? "Active" : "Apply"}
          </button>

          {onExport && theme.file && (
            <button
              onClick={onExport}
              title="Export theme"
              className="
                rounded-xl
                aurora-button
                px-3
              "
            >
              <Download size={17} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
