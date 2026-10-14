import { useEffect, useState } from "react";

import PageLayout from "@/components/layout/PageLayout";
import DataTable from "@/components/ui/DataTable";
import type { DataTableColumn } from "@/components/ui/DataTable";
import Pill from "@/components/ui/Pill";
import StatusPill from "@/components/ui/StatusPill";

import { getWorkspaces } from "@/services/platfromAdmin";

interface WorkspacePagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface WorkspacesResponse {
  data: Workspace[];
  pagination: WorkspacePagination;
}

interface Workspace {
  id: string;
  name: string;
  slug: string;
  country: string;
  industry: string | null;
  status: "active" | "pending" | "suspended" | "closed";
  reportingCurrency: string;
  createdAt: string;
}

function formatDate(value: string) {
  const normalized = value
    .replace(" ", "T")
    .replace(/(\.\d{3})\d+/, "$1")
    .replace(/\+00$/, "Z");

  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function Companies() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    pages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchWorkspaces = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getWorkspaces(page);

        if (cancelled) return;

        setWorkspaces(response.data.data);
        setPagination(response.data.pagination);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to fetch workspaces:", error);
        setError("Unable to load workspaces.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchWorkspaces();

    return () => {
      cancelled = true;
    };
  }, [page]);

  const columns: DataTableColumn<Workspace>[] = [
    {
      key: "name",
      header: "Workspace",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-text">{row.name}</span>
          <span className="text-xs text-text-muted">{row.slug}</span>
        </div>
      ),
    },
    {
      key: "country",
      header: "Country",
      render: (row) => row.country,
    },
    {
      key: "industry",
      header: "Industry",
      render: (row) => (
        <Pill name={row.industry ?? "Unspecified"} />
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusPill status={row.status.toUpperCase() as
          "ACTIVE" | "PENDING" | "SUSPENDED" | "CLOSED"} />
      ),
    },
    {
      key: "currency",
      header: "Currency",
      render: (row) => row.reportingCurrency,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <PageLayout
      headTitle="Workspaces"
      title="Workspaces"
      description="Manage client workspaces, review registrations, and monitor their status."
    >
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            className="mt-3 font-semibold underline"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      ) : (
        <DataTable
          tableHead="All workspaces"
          tableSubHead={`${pagination.total} workspaces`}
          columns={columns}
          data={workspaces}
          getRowKey={(row) => row.id}
          emptyMessage={loading ? "Loading workspaces..." : "No workspaces found."}
          pagination={{
            ...pagination,
            isLoading: loading,
            onPageChange: setPage,
          }}
        />
      )}
    </PageLayout>
  );
}

export default Companies;