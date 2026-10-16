import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import CustomerTable, {
  type Customer,
} from "@/features/customers/components/CustomerTable";
import {
  getCustomers,
  type CustomersResponse,
} from "@/services/companyServices";
import { getRequestErrorMessage } from "@/features/reports/utils/requestError";
import toast from "react-hot-toast";

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<CustomersResponse["pagination"]>({
    page: 1,
    limit: 25,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchCustomers() {
      setLoading(true);
      setError("");

      try {
        const response = await getCustomers(page);
        const result = response.data;
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

        if (cancelled) return;
        setCustomers(result.data);
        setPagination(result.pagination);
      } catch (requestError) {
        if (cancelled) return;
        const message = getRequestErrorMessage(requestError);
        setError(`Unable to load customers: ${message}`);
        toast.error("Unable to load customers. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchCustomers();

    return () => {
      cancelled = true;
    };
  }, [page, retryCount]);
  
  return (
    <PageLayout
      title="Customers"
      headTitle="Audience"
      description="Review customer activity and purchase history."
    >
      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-danger"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="font-medium underline"
          >
            Retry
          </button>
        </div>
      )}
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
    </PageLayout>
  );
}

export default Customers;
