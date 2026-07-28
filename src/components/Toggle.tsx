interface Props {
  value: boolean;
  onChange(value: boolean): void;
}

export default function Toggle({ value, onChange }: Props) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`
        h-7
        w-12
        rounded-full
        transition
        ${value ? "bg-white" : "bg-zinc-700"}
      `}
    >
      <div
        className={`
          h-5
          w-5
          rounded-full
          bg-black
          transition
          ${value ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
}
