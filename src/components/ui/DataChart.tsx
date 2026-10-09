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
  color = "#5B60B8",
  valuePrefix = "",
  valueSuffix = "",
  actionLabel,
  onAction,
  height = 260,
}: IDataChart) {
  const formatValue = (value: number) =>
    `${valuePrefix}${value.toLocaleString()}${valueSuffix}`;

  return (
    <section className="w-full min-w-0 rounded-2xl border border-border bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-serif font-medium text-gray-900">
          {title}
        </h2>

        <div className="flex items-center gap-2.5">
          {subtitle && (
            <p className="mt-1 text-[10px] text-text-muted">
              {subtitle}
            </p>
          )}

          {actionLabel && (
            <button
            type="button"
            onClick={onAction}
            className="shrink-0 rounded-lg border border-border cursor-pointer px-2.5 font-semibold py-1 text-[10px] text-text-muted hover:text-primary hover:bg-gray-50 duration-300"
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
                stroke="#EAEAEA"
              />

              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#8A8A8A" }}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
              />

              <YAxis hide />

              <Tooltip
                formatter={(value) => formatValue(Number(value))}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #E5E5E5",
                  fontSize: 12,
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
                stroke="#EAEAEA"
              />

              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#8A8A8A" }}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
              />

              <YAxis hide />

              <Tooltip
                formatter={(value) => formatValue(Number(value))}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #E5E5E5",
                  fontSize: 12,
                }}
              />

              <Line
                type="linear"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
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