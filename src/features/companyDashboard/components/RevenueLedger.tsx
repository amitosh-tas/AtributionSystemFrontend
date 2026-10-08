const data = [
  {
    name: "Google",
    perc: 94,
  },
  {
    name: "Direct",
    perc: 5,
  },
  {
    name: "Meta",
    perc: 1,
  },
];

const colors = [
  "#B45F3C",
  "#46777D",
  "#71896A",
];

function RevenueLedger() {
  return (
    <div
      className="
        p-5
        bg-card
        border-2 border-border
        text-text-muted
        rounded-xl
        shadow
      "
    >
      {/* Header */}
      <div className="text-[10px] uppercase flex justify-between">
        <p>Revenue Ledger - By Source</p>

        <p>
          Rs Total
        </p>
      </div>

      <div className="bg-black/10 w-full h-px my-2.5" />

      {/* Mixed horizontal bar */}
      <div className="w-full h-10 flex overflow-hidden rounded-md">
        {data.map((item, index) => (
          <div
            key={item.name}
            style={{
              width: `${item.perc}%`,
              backgroundColor: colors[index],
            }}
            className="h-full"
            />
          ))}
      </div>

      <div className="bg-black/5 w-full h-px my-2.5" />

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center gap-2 text-xs"
          >
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{
                backgroundColor: colors[index],
              }}
            />

            <span>{item.name}</span>

            <span className="text-text-muted">
              {item.perc}%
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default RevenueLedger;