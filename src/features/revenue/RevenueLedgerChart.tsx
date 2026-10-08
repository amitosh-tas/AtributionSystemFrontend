const data = [
  {
    name: "Google",
    perc: 50,
  },
  {
    name: "Direct",
    perc: 20,
  },
  {
    name: "Meta",
    perc: 30,
  },
];

const colors = [
  "#B45F3C",
  "#46777D",
  "#71896A",
];

function RevenueLedgerChart() {
  return (
    <div className="w-full">
      {/* Mixed Revenue Bar */}
      <div className="w-full h-10 flex overflow-hidden rounded-md">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="h-full transition-all duration-300"
            style={{
              width: `${item.perc}%`,
              backgroundColor: colors[index],
            }}
            title={`${item.name}: ${item.perc}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center gap-2 text-xs"
          >
            {/* Color indicator */}
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{
                backgroundColor: colors[index],
              }}
            />

            {/* Source */}
            <span className="text-text">
              {item.name}
            </span>

            {/* Percentage */}
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