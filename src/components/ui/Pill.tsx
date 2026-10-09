interface IPill {
  name: string;
}

function getPlatformColors(name: string) {
  // Generate a consistent hash from the platform name
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }

  // Generate a pleasant, muted color
  const hue = Math.abs(hash) % 360;

  return {
    backgroundColor: `hsl(${hue}, 45%, 92%)`,
    textColor: `hsl(${hue}, 45%, 30%)`,
    dotColor: `hsl(${hue}, 50%, 42%)`,
  };
}

function Pill({ name }: IPill) {
  const colors = getPlatformColors(name.trim().toLowerCase());

  return (
    <span
      className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap"
      style={{
        backgroundColor: colors.backgroundColor,
        color: colors.textColor,
      }}
    >
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: colors.dotColor }}
      />
      {name}
    </span>
  );
}

export default Pill;