import DataTable, {
  type DataTableColumn,
} from "@/components/ui/DataTable";
import Pill from "@/components/ui/Pill";

export interface Customer {
  id: string;
  firstSeenAt: string;
  firstPurchaseAt: string | null;
  lastPurchaseAt: string | null;
  externalIds: Record<string, unknown> | null;
}

interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  total: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    isLoading: boolean;
    onPageChange: (page: number) => void;
  };
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const normalized = value
    .replace(" ", "T")
    .replace(/(\.\d{3})\d+/, "$1")
    .replace(/\+00$/, "Z");
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getExternalIds(externalIds: Customer["externalIds"]) {
  if (!externalIds) return [];

  return Object.entries(externalIds)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([provider, value]) => `${provider}: ${String(value)}`);
}

export default function CustomerTable({
  customers,
  loading,
  total,
  pagination,
}: CustomerTableProps) {
  const columns: DataTableColumn<Customer>[] = [
    {
      key: "id",
      header: "Customer ID",
      render: (customer) => (
        <code className="text-xs text-text-muted">{customer.id}</code>
      ),
    },
    {
      key: "firstSeenAt",
      header: "First seen",
      render: (customer) => (
        <span className="whitespace-nowrap">
          {formatDate(customer.firstSeenAt)}
        </span>
      ),
    },
    {
      key: "firstPurchaseAt",
      header: "First purchase",
      render: (customer) => (
        <span className="whitespace-nowrap">
          {formatDate(customer.firstPurchaseAt)}
        </span>
      ),
    },
    {
      key: "lastPurchaseAt",
      header: "Last purchase",
      render: (customer) => (
        <span className="whitespace-nowrap">
          {formatDate(customer.lastPurchaseAt)}
        </span>
      ),
    },
    {
      key: "externalIds",
      header: "External IDs",
      render: (customer) => {
        const externalIds = getExternalIds(customer.externalIds);
        return externalIds.length ? (
          <div className="flex flex-wrap gap-1.5">
            {externalIds.map((externalId) => (
              <Pill key={externalId} name={externalId} />
            ))}
          </div>
        ) : (
          <span className="text-text-muted">—</span>
        );
      },
    },
  ];

  return (
    <DataTable
      tableHead="Customer list"
      tableSubHead={`${total.toLocaleString()} customer${total === 1 ? "" : "s"}`}
      columns={columns}
      data={customers}
      getRowKey={(customer) => customer.id}
      loading={loading}
      emptyMessage="No customers found."
      pagination={pagination}
    />
  );
}
