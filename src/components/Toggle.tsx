interface Props {
  value: boolean;
  onChange(value: boolean): void;
}

export default function Toggle({ value, onChange }: Props) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`
        h-6
        w-11
        rounded-full
        transition
        ${value ? "bg-white" : "bg-zinc-600"}
      `}
    >
      <div
        className={`
          h-5
          w-5
          rounded-full
          bg-black
          transition
          ${value ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  );
}
