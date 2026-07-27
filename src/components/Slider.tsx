interface Props {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange(value: number): void;
  className?: string;
}

export default function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  className = "",
}: Props) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        background: `linear-gradient(
          to right,
          white ${percentage}%,
          rgb(63 63 70) ${percentage}%
        )`,
      }}
      className={`
  ${className}

  h-1.5
  w-full
  cursor-pointer
  appearance-none
  rounded-full
  accent-white

  [&::-webkit-slider-thumb]:appearance-none
  [&::-webkit-slider-thumb]:h-4
  [&::-webkit-slider-thumb]:w-4
  [&::-webkit-slider-thumb]:rounded-full
  [&::-webkit-slider-thumb]:bg-white
  [&::-webkit-slider-thumb]:shadow-lg
  [&::-webkit-slider-thumb]:transition
  [&::-webkit-slider-thumb]:hover:scale-125

  [&::-moz-range-thumb]:h-4
  [&::-moz-range-thumb]:w-4
  [&::-moz-range-thumb]:rounded-full
  [&::-moz-range-thumb]:border-0
  [&::-moz-range-thumb]:bg-white
`}
    />
  );
}
