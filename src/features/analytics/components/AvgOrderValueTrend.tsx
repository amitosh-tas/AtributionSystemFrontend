import DataChart from "@/components/ui/DataChart";

const orderValueData = [
  { label: "Sep 9", value: 82 },
  { label: "Sep 10", value: 68 },
  { label: "Sep 11", value: 72 },
  { label: "Sep 12", value: 54 },
  { label: "Sep 13", value: 76 },
  { label: "Sep 14", value: 75 },
  { label: "Sep 15", value: 57 },
];

export default function AvgOrderValueTrend() {
  return (
    <DataChart
      title="Avg Order Value Trend"
      subtitle="by day"
      data={orderValueData}
      type="line"
      color="#5B60B8"
      valuePrefix="$"
      actionLabel="‹ Prev wk"
      onAction={() => console.log("Load previous week")}
    />
  );
}