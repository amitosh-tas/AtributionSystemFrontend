import DataTable, {
  type DataTableColumn,
} from "@/components/ui/DataTable";
import Pill from "@/components/ui/Pill";

interface PlatformRevenue {
  id: string;
  platform: string;
  conversions: number;
  revenue: number;
}

const platformData: PlatformRevenue[] = [
  {
    id: "direct",
    platform: "Direct",
    conversions: 735,
    revenue: 47585.16,
  },
  {
    id: "google",
    platform: "Google",
    conversions: 91,
    revenue: 6542.63,
  },
  {
    id: "awin",
    platform: "AWIN",
    conversions: 8,
    revenue: 276.03,
  },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const columns: DataTableColumn<PlatformRevenue>[] = [
  {
    key: "platform",
    header: "Platform",
    render: (row) => {
      const platformVariants = {
        Direct: "direct",
        Google: "google",
        AWIN: "awin",
        "chatgpt.com": "chatgpt",
        Klaviyo: "klaviyo",
      } as const; 

      const variant =
        platformVariants[
          row.platform as keyof typeof platformVariants
        ] ?? "default";

      return <Pill name={row.platform} variant={variant} />;
    },
  },
  {
    key: "conversions",
    header: "Conversions",
    align: "right",
    render: (row) => row.conversions.toLocaleString(),
  },
  {
    key: "revenue",
    header: "Revenue",
    align: "right",
    render: (row) => (
      <span className="tabular-nums">
        {currency.format(row.revenue)}
      </span>
    ),
  },
];

export default function RevenueByPlatform() {
  return (
    <DataTable
      tableHead="Revenue by Platform"
      tableSubHead="all locations · sent conversions only"
      columns={columns}
      data={platformData}
      getRowKey={(row) => row.id}
      emptyMessage="No platform revenue found."
    />
  );
}
