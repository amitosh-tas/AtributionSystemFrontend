interface IPill {
  name: string;
}

const platformColors: Record<string, { backgroundColor: string; textColor: string; dotColor: string }> = {
  google: { backgroundColor: "#f8e9eb", textColor: "#7f3039", dotColor: "#a13d48" },
  direct: { backgroundColor: "#e8f0f7", textColor: "#214f78", dotColor: "#28649b" },
  meta: { backgroundColor: "#e8f2ec", textColor: "#205b3b", dotColor: "#28734b" },
};

function getPlatformColors(name: string) {
  const knownColors = platformColors[name];
  if (knownColors) return knownColors;

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
      className="inline-flex w-fit items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap"
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