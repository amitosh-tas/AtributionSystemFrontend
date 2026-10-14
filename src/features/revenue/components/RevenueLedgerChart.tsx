import { revenueSourceColors } from "@/config/revenue";

const data = [
  {
    name: "Google",
    perc: 95,
  },
  {
    name: "Direct",
    perc: 2,
  },
  {
    name: "Meta",
    perc: 3,
  },
];

function RevenueLedgerChart() {
  return (
    <div className="w-full">
      <div className="flex h-7 w-full overflow-hidden rounded-md">
        {data.map((item) => (
          <div
            key={item.name}
            className="h-7 transition-colors duration-200 first:rounded-l-md last:rounded-r-md"
            style={{
              width: `${item.perc}%`,
              backgroundColor: revenueSourceColors[item.name.toLowerCase()].color,
            }}
            title={`${item.name}: ${item.perc}%`}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2 text-xs"
          >
            <span
              className="size-2.5 shrink-0 rounded-sm"
              style={{
                backgroundColor: revenueSourceColors[item.name.toLowerCase()].color,
              }}
            />

            <span className="text-sm text-text">
              {item.name}
            </span>

            <span className="text-text-muted">
              {item.perc}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RevenueLedgerChart;
