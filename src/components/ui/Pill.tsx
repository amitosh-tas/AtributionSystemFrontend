interface IPill {
  name: string;
}

function getPlatformColors(name: string) {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }

  const hue = Math.abs(hash) % 360;

  return {
    backgroundColor: `hsla(${hue}, 70%, 18%, 0.8)`,
    textColor: `hsl(${hue}, 70%, 88%)`,
    dotColor: `hsl(${hue}, 80%, 70%)`,
  };
}

function Pill({ name }: IPill) {
  const colors = getPlatformColors(name.trim().toLowerCase());

  return (
    <span
      className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-medium whitespace-nowrap"
      style={{
        backgroundColor: colors.backgroundColor,
        color: colors.textColor,
      }}
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: colors.dotColor }} />
      {name}
    </span>
  );
}

export default Pill;