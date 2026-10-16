import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import CustomerTable, {
  type Customer,
} from "@/features/customers/components/CustomerTable";
import {
  getCustomers,
  type CustomersResponse,
} from "@/services/companyServices";

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

  useEffect(() => {

    let cancelled = false;

    async function fetchCustomers() {
      setLoading(true);

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

        if (!cancelled) {
          setCustomers(result.data);
          setPagination(result.pagination);
        }
      } catch {
         
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchCustomers();

  }, [page ]);
  
  return (
    <PageLayout
      title="Customers"
      headTitle="Audience"
      description="Review customer activity and purchase history."
    >
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
