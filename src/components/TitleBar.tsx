export default function TitleBar() {
  return (
    <div
      className="
        top-0
        z-50
        flex
        h-10
        w-full
        items-center
        justify-center
        aurora-glass
        select-none
      "
      style={
        {
          WebkitAppRegion: "drag",
        } as React.CSSProperties
      }
    >
      <span
        className="
          aurora-text
          font-semibold
        "
      >
        Aurora
      </span>
    </div>
  );
}
