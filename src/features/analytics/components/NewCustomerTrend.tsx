import DataChart from "@/components/ui/DataChart";

const customerData = [
  { label: "Sep 9", value: 12 },
  { label: "Sep 10", value: 10 },
  { label: "Sep 11", value: 22 },
  { label: "Sep 12", value: 14 },
  { label: "Sep 13", value: 15 },
  { label: "Sep 14", value: 8 },
  { label: "Sep 15", value: 18 },
];

export default function NewCustomersTrend() {
  return (
    <DataChart
      title="New Customers Trend"
      subtitle="by day · company-wide"
      data={customerData}
      type="bar"
      color="#87957D"
      actionLabel="‹ Prev wk"
      onAction={() => console.log("Load previous week")}
    />
  );
}