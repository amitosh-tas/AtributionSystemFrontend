import DataTable, {
  type DataTableColumn,
} from "@/components/ui/DataTable";
import StatusPill from "@/components/ui/StatusPill";
import type { CompanyApiKey } from "../types/apiKey.types";

interface ApiKeyTableProps {
  keys: CompanyApiKey[];
  loading: boolean;
  rotating: boolean;
  onRotate: (key: CompanyApiKey) => void;
}

export default function ApiKeyTable({
  keys,
  loading,
  rotating,
  onRotate,
}: ApiKeyTableProps) {
  const columns: DataTableColumn<CompanyApiKey>[] = [
    {
      key: "name",
      header: "Key name",
      render: (key) => (
        <div className="flex min-w-40 flex-col gap-1">
          <span className="font-medium">{key.name}</span>
          <span className="text-[10px] text-text-muted">
            ID: {key.id.slice(0, 8)}…
          </span>
        </div>
      ),
    },
    {
      key: "keyPrefix",
      header: "API key",
      render: (key) => (
        <code className="whitespace-nowrap rounded bg-surface-muted px-2 py-1 text-xs">
          {key.keyPrefix}
          {"*".repeat(12)}
        </code>
      ),
    },
    {
      key: "mode",
      header: "Mode",
      render: (key) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            key.mode === "live"
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {key.mode.toUpperCase()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (key) => (
        <StatusPill
          status={key.revokedAt ? "DEACTIVE" : "ACTIVE"}
        />
      ),
    },
    {
      key: "rateLimitPerMin",
      header: "Rate limit",
      align: "right",
      render: (key) => (
        <span>{key.rateLimitPerMin.toLocaleString()} / min</span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (key) => (
        <span className="whitespace-nowrap text-xs text-text-muted">
          {new Date(key.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (key) => (
        <button
          type="button"
          disabled={Boolean(key.revokedAt) || rotating}
          onClick={() => onRotate(key)}
          className="whitespace-nowrap rounded-md border border-border px-3 py-1.5 text-xs font-medium transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          Rotate key
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-text-muted">
        Loading API keys…
      </div>
    );
  }

  return (
    <DataTable
      tableHead="Your API keys"
      tableSubHead={`${keys.length} key${keys.length === 1 ? "" : "s"} found`}
      columns={columns}
      data={keys}
      getRowKey={(key) => key.id}
      emptyMessage="No API keys found for this company."
    />
  );
}