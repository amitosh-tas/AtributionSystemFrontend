import DataTable, {
  type DataTableColumn,
} from "@/components/ui/DataTable";
import Pill from "@/components/ui/Pill";

interface PlatformRevenue {
  id: string;
  platform: {
    name: string;
    key: string;
    category: string;
  };
  conversions: number;
  revenue: number;
}

const platformData: PlatformRevenue[] = [
  {
    id: "direct",
    platform: {
      name: "Direct",
      key: "direct",
      category: "direct",
    },
    conversions: 735,
    revenue: 47585.16,
  },
  {
    id: "google",
    platform: {
      name: "Google",
      key: "google",
      category: "paid_search",
    },
    conversions: 91,
    revenue: 6542.63,
  },
  {
    id: "awin",
    platform: {
      name: "AWIN",
      key: "awin",
      category: "affiliate",
    },
    conversions: 8,
    revenue: 276.03,
  },
  {
    id: "meta",
    platform: {
      name: "META",
      key: "meta",
      category: "affiliate",
    },
    conversions: 7,
    revenue: 296.03,
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
    render: (row) => <Pill name={row.platform.name} />,
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