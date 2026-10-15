import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface ChartData {
  label: string;
  value: number;
}

interface IDataChart {
  title: string;
  subtitle?: string;
  data: ChartData[];
  type?: "line" | "bar";
  color?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  actionLabel?: string;
  onAction?: () => void;
  height?: number;
}

function DataChart({
  title,
  subtitle,
  data,
  type = "line",
  color = "#525252",
  valuePrefix = "",
  valueSuffix = "",
  actionLabel,
  onAction,
  height = 260,
}: IDataChart) {
  const formatValue = (value: number) =>
    `${valuePrefix}${value.toLocaleString()}${valueSuffix}`;

  return (
    <section className="w-full min-w-0 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
        <h2 className="font-heading text-base font-semibold tracking-tight text-text">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xs text-text-muted">
            {subtitle}
          </p>
        )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {actionLabel && (
            <button
            type="button"
            onClick={onAction}
            className="cursor-pointer rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text transition hover:bg-hover"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
            <BarChart
              data={data}
              margin={{ top: 8, right: 4, left: 4, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#E8D9C9"
              />

              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#79685B" }}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
              />

              <YAxis hide />

              <Tooltip
                formatter={(value) => formatValue(Number(value))}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #E8D9C9",
                  fontSize: 12,
                  color: "#38291F",
                }}
              />

              <Bar
                dataKey="value"
                fill={color}
                radius={[2, 2, 0, 0]}
                maxBarSize={18}
              />
            </BarChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 8, right: 4, left: 4, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#E8D9C9"
              />

              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#79685B" }}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
              />

              <YAxis hide />

              <Tooltip
                formatter={(value) => formatValue(Number(value))}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #E8D9C9",
                  fontSize: 12,
                  color: "#38291F",
                }}
              />

              <Line
                type="linear"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                strokeDasharray="0"
                dot={{
                  r: 2.5,
                  fill: color,
                  strokeWidth: 0,
                }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default DataChart;