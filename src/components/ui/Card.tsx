interface ICard {
  title?: string;
  value?: string;
  description?: string;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
}

function Card({
  title,
  value,
  description,
  trend,
}: ICard) {
  return (
    <div
      className="flex min-h-32 min-w-0 flex-col gap-2 rounded-xl border border-border bg-card p-5 text-text transition-colors hover:border-slate-300"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
        {title}
      </p>

      <p className="mt-1 wrap-break-word font-heading text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>

      {trend ? (
        <p
          className={`text-xs font-medium ${
            trend.direction === "down"
              ? "text-red-600"
              : "text-emerald-700"
          }`}
        >
          {trend.direction === "down" ? "▼" : "▲"} {trend.value}
        </p>
      ) : (
        <p className="text-xs leading-5 text-text-muted">
          {description}
        </p>
      )}
    </div>
  );
}

export default Card;