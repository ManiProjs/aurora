export default function PlayerBar() {
  return (
    <div
      className="
      fixed
      bottom-0
      left-64
      right-0
      h-20
      border-t
      border-zinc-800
      bg-zinc-900/80
      backdrop-blur-xl
      flex
      items-center
      px-6
    "
    >
      <div>
        <p className="font-medium">Nothing playing</p>

        <p className="text-sm text-zinc-500">Choose a song</p>
      </div>

      <div className="ml-auto">▶</div>
    </div>
  );
}
