interface RevenueSource {
  source: string;
  percentage: number;
  color: string;
}

interface RevenueLedgerChartProps {
  data: RevenueSource[];
  loading: boolean;
}

function RevenueLedgerChart({ data, loading }: RevenueLedgerChartProps) {
  if (loading) {
    return (
      <p role="status" className="py-4 text-sm text-text-muted">
        Loading revenue sources…
      </p>
    );
  }

  if (data.length === 0) {
    return (
      <p className="py-4 text-sm text-text-muted">
        No revenue source data available.
      </p>
    );
  }

  return (
    <div className="w-full">
      <div className="flex h-7 w-full overflow-hidden rounded-md">
        {data.map((item) => (
          <div
            key={item.source}
            className="h-7 transition-colors duration-200 first:rounded-l-md last:rounded-r-md"
            style={{
              width: `${item.percentage}%`,
              backgroundColor: item.color,
            }}
            title={`${item.source}: ${item.percentage}%`}
          />
        ))}
      </div>

      <div className="my-5 h-px w-full bg-border" />

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        {data.map((item) => (
          <div
            key={item.source}
            className="flex items-center gap-2 text-xs"
          >
            <span
              className="size-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-text">{item.source}</span>
            <span className="text-text-muted">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RevenueLedgerChart;
