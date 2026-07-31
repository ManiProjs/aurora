export interface HiddenTheme {
  id: string;

  name: string;

  author: string;

  variant: "dark" | "light";

  preview: string;

  css: string;
}

export const SECRET_PHRASE = "it's dangerous to go alone. take this aurora.";

export const HIDDEN_THEMES: HiddenTheme[] = [
  {
    id: "neon-night",

    name: "Neon Night",

    author: "Aurora Secret",

    variant: "dark",

    preview: "#00f5ff",

    css: `
:root {
  --aurora-bg: #050510;
  --aurora-surface: #101020;
  --aurora-surface-muted: #191933;

  --aurora-text: #f5f5ff;
  --aurora-text-muted: #9ca3ff;

  --aurora-border: rgba(0,245,255,0.25);
}
`,
  },

  {
    id: "deep-forest",

    name: "Deep Forest",

    author: "Aurora Secret",

    variant: "dark",

    preview: "#22c55e",

    css: `
:root {
  --aurora-bg: #06120b;
  --aurora-surface: #0d2115;
  --aurora-surface-muted: #15351f;

  --aurora-text: #ecfdf5;
  --aurora-text-muted: #86efac;

  --aurora-border: rgba(34,197,94,0.25);
}
`,
  },

  {
    id: "ocean",

    name: "Ocean",

    author: "Aurora Secret",

    variant: "dark",

    preview: "#06b6d4",

    css: `
:root {
  --aurora-bg: #03131c;
  --aurora-surface: #062534;
  --aurora-surface-muted: #09384c;

  --aurora-text: #ecfeff;
  --aurora-text-muted: #67e8f9;

  --aurora-border: rgba(6,182,212,0.25);
}
`,
  },

  {
    id: "sunset",

    name: "Sunset",

    author: "Aurora Secret",

    variant: "dark",

    preview: "#f97316",

    css: `
:root {
  --aurora-bg: #190b12;
  --aurora-surface: #2b121c;
  --aurora-surface-muted: #451827;

  --aurora-text: #fff7ed;
  --aurora-text-muted: #fdba74;

  --aurora-border: rgba(249,115,22,0.25);
}
`,
  },

  {
    id: "synthwave",

    name: "Synthwave",

    author: "Aurora Secret",

    variant: "dark",

    preview: "#d946ef",

    css: `
:root {
  --aurora-bg: #100019;
  --aurora-surface: #1f0033;
  --aurora-surface-muted: #350052;

  --aurora-text: #ffffff;
  --aurora-text-muted: #f0abfc;

  --aurora-border: rgba(217,70,239,0.3);
}
`,
  },

  {
    id: "terminal",

    name: "Terminal",

    author: "Aurora Secret",

    variant: "dark",

    preview: "#22c55e",

    css: `
:root {
  --aurora-bg: #000000;
  --aurora-surface: #050505;
  --aurora-surface-muted: #111111;

  --aurora-text: #22c55e;
  --aurora-text-muted: #15803d;

  --aurora-border: rgba(34,197,94,0.3);
}

.aurora-card,
.aurora-glass {
  border-radius: 4px;
}
`,
  },

  {
    id: "matcha",

    name: "Matcha",

    author: "Aurora Secret",

    variant: "light",

    preview: "#a3b18a",

    css: `
:root {
  --aurora-bg: #f7f5e8;
  --aurora-surface: #ffffff;
  --aurora-surface-muted: #e8e5d0;

  --aurora-text: #344e41;
  --aurora-text-muted: #588157;

  --aurora-border: rgba(52,78,65,0.15);
}
`,
  },

  {
    id: "midnight",

    name: "Midnight",

    author: "Aurora Secret",

    variant: "dark",

    preview: "#1e40af",

    css: `
:root {
  --aurora-bg: #020617;
  --aurora-surface: #0f172a;
  --aurora-surface-muted: #172554;

  --aurora-text: #f8fafc;
  --aurora-text-muted: #93c5fd;

  --aurora-border: rgba(59,130,246,0.25);
}
`,
  },

  {
    id: "ember",

    name: "Ember",

    author: "Aurora Secret",

    variant: "dark",

    preview: "#ef4444",

    css: `
:root {
  --aurora-bg: #120707;
  --aurora-surface: #221010;
  --aurora-surface-muted: #3b1717;

  --aurora-text: #fff7ed;
  --aurora-text-muted: #fca5a5;

  --aurora-border: rgba(239,68,68,0.25);
}
`,
  },

  {
    id: "arctic",

    name: "Arctic",

    author: "Aurora Secret",

    variant: "light",

    preview: "#38bdf8",

    css: `
:root {
  --aurora-bg: #f8fafc;
  --aurora-surface: #ffffff;
  --aurora-surface-muted: #e0f2fe;

  --aurora-text: #0f172a;
  --aurora-text-muted: #0369a1;

  --aurora-border: rgba(3,105,161,0.15);
}
`,
  },
];

export function checkSecretCSS(css: string) {
  const match = css.match(/--aurora-secret:\s*"([^"]+)"/);

  if (!match) {
    return false;
  }

  return match[1].trim().toLowerCase() === SECRET_PHRASE.toLowerCase();
}
