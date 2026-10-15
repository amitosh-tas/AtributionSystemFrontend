import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import CustomerTable, {
  type Customer,
} from "@/features/customers/components/CustomerTable";
import EmptyState from "@/components/ui/EmptyState";
import { getCustomers } from "@/services/companyServices";

const CUSTOMER_API_TOKEN_KEY = "customer-api-token";

interface CustomerPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface CustomersResponse {
  data: Customer[];
  pagination: CustomerPagination;
}

function readSavedToken() {
  try {
    return window.localStorage.getItem(CUSTOMER_API_TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

function Customers() {
  const [savedToken, setSavedToken] = useState(readSavedToken);
  const [tokenInput, setTokenInput] = useState(savedToken);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const [reloadCount, setReloadCount] = useState(0);
  const [pagination, setPagination] = useState<CustomerPagination>({
    page: 1,
    limit: 25,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    if (!savedToken) {
      setCustomers([]);
      setPagination({ page: 1, limit: 25, total: 0, pages: 1 });
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchCustomers() {
      setLoading(true);
      setError("");

      try {
        const response = await getCustomers(savedToken, page);
        const result = response.data as CustomersResponse;
        if (
          !Array.isArray(result?.data) ||
          !result.pagination ||
          typeof result.pagination.page !== "number" ||
          typeof result.pagination.limit !== "number" ||
          typeof result.pagination.total !== "number" ||
          typeof result.pagination.pages !== "number"
        ) {
          throw new Error("Unexpected customer API response format.");
        }

        if (!cancelled) {
          setCustomers(result.data);
          setPagination(result.pagination);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load customers. Check the API token and try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchCustomers();

    return () => {
      cancelled = true;
    };
  }, [page, reloadCount, savedToken]);

  const saveToken = () => {
    const token = tokenInput.trim();
    if (!token) {
      setTokenError("Enter an API token.");
      return;
    }

    try {
      window.localStorage.setItem(CUSTOMER_API_TOKEN_KEY, token);
      setSavedToken(token);
      setPage(1);
      setTokenError("");
      setError("");
    } catch {
      setTokenError("Unable to save the token in this browser.");
    }
  };

  const clearToken = () => {
    try {
      window.localStorage.removeItem(CUSTOMER_API_TOKEN_KEY);
      setSavedToken("");
      setTokenInput("");
      setTokenError("");
      setError("");
    } catch {
      setTokenError("Unable to remove the saved token from this browser.");
    }
  };

  return (
    <PageLayout
      title="Customers"
      headTitle="Audience"
      description="Review customer activity and purchase history."
    >
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-heading text-base font-semibold text-text">
          Customer API token
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          The token is saved in this browser until you remove it.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <label htmlFor="customer-api-token" className="sr-only">
            Customer API token
          </label>
          <input
            id="customer-api-token"
            type="password"
            autoComplete="off"
            value={tokenInput}
            onChange={(event) => setTokenInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") saveToken();
            }}
            placeholder="Enter API token"
            className="min-w-60 flex-1 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-text"
          />
          <button
            type="button"
            onClick={saveToken}
            disabled={!tokenInput.trim()}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {savedToken ? "Save token" : "Connect"}
          </button>
          {savedToken && (
            <button
              type="button"
              onClick={clearToken}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text hover:bg-surface-muted"
            >
              Remove saved token
            </button>
          )}
        </div>
        {tokenError && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {tokenError}
          </p>
        )}
      </section>

      {!savedToken ? (
        <EmptyState
          title="Connect your customer data"
          description="Enter and save an API token to load customer profiles and purchase activity."
        />
      ) : error ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-danger"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setReloadCount((current) => current + 1)}
            className="font-medium underline"
          >
            Retry
          </button>
        </div>
      ) : (
        <CustomerTable
          customers={customers}
          loading={loading}
          total={pagination.total}
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

export default Customers;
