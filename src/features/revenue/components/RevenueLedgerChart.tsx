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

const colors = [
  "#B45F3C",
  "#46777D",
  "#71896A",
];

function RevenueLedgerChart() {
  return (
    <div className="w-full">
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

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center gap-2 text-xs"
          >
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{
                backgroundColor: colors[index],
              }}
            />

            <span className="text-text">
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