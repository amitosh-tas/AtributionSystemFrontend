import GlassSurface from "@/components/GlassSurface";

interface ICard {
  title?: string;
  value?: string;
  description?: string;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
}

function Card({ title, value, description, trend }: ICard) {
  return (
    <GlassSurface
      width="100%"
      height="100%"
      borderRadius={24}
      borderWidth={0.8}
      displace={0.15}
      backgroundOpacity={0.12}
      opacity={0.92}
      blur={12}
      saturation={1.2}
      redOffset={0}
      greenOffset={2}
      blueOffset={6}
      refraction
      renderer="auto"
      className="min-h-[150px]"
    >
      <div className="flex h-full w-full flex-col justify-between rounded-[inherit] bg-slate-950/10 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</p>

        <p className="font-heading text-2xl font-medium tracking-tight text-slate-50">{value}</p>

        {trend ? (
          <p
            className={`text-xs ${
              trend.direction === "down" ? "text-rose-300" : "text-emerald-300"
            }`}
          >
            {trend.direction === "down" ? "▼" : "▲"} {trend.value}
          </p>
        ) : (
          <p className="text-xs leading-5 text-slate-400">{description}</p>
        )}
      </div>
    </GlassSurface>
  );
}

export default Card;