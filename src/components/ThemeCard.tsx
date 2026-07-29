import { Check } from "lucide-react";

interface ThemeCardProps {
  theme: {
    id: string;
    name: string;
    author?: string;
    description?: string;
    variant?: string;
    preview?: string;
  };

  active: boolean;

  onApply(): void;
}

export default function ThemeCard({ theme, active, onApply }: ThemeCardProps) {
  return (
    <div
      className="
        aurora-card
        overflow-hidden
      "
    >
      <div
        className="
          h-28
          w-full
        "
        style={{
          background: theme.preview ?? "#18181b",
        }}
      />

      <div className="p-5">
        <h3
          className="
            text-lg
            font-semibold
          "
        >
          {theme.name}
        </h3>

        <p className="aurora-text-muted text-sm">
          {theme.author ?? "Unknown author"}
        </p>

        {theme.description && (
          <p className="mt-3 text-sm aurora-text-muted">{theme.description}</p>
        )}

        {theme.variant && (
          <p className="mt-2 text-xs uppercase aurora-text-muted">
            {theme.variant}
          </p>
        )}

        <button
          disabled={active}
          onClick={onApply}
          className="
            mt-5
            flex
            w-full
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
      </div>
    </div>
  );
}
