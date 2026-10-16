import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { StatCardsSkeleton } from "@/components/ui/Skeleton";
import PageLayout from "@/components/layout/PageLayout";
import AnalyticsGrid from "@/features/analytics/components/AnalyticsGrid";
import AvgOrderValueTrend from "@/features/analytics/components/AvgOrderValueTrend";
import NewCustomersTrend from "@/features/analytics/components/NewCustomerTrend";
import ReportFilters from "@/features/reports/components/ReportFilters";
import {
  getPresetDateRange,
  type DateRange,
} from "@/features/reports/utils/dateRange";
import { formatReportDate } from "@/features/reports/utils/formatting";
import { getRequestErrorMessage } from "@/features/reports/utils/requestError";
import toast from "react-hot-toast";
import {
  getReportCustomers,
  getReportLocations,
  getReportTrend,
  getReportsSummary,
  type ReportCustomerSummary,
  type ReportLocation,
  type ReportTrendPoint,
} from "@/services/companyServices";

interface AnalyticsResult {
  key: string;
  trend: ReportTrendPoint[];
  customerSummary?: ReportCustomerSummary;
  locations: ReportLocation[];
  currency?: string;
  errors: {
    trend?: string;
    customers?: string;
    locations?: string;
    summary?: string;
  };
}

function Analytics() {
  const [dateRange, setDateRange] = useState<DateRange>(() =>
    getPresetDateRange(30),
  );
  const { from, to } = dateRange;
  const [locationId, setLocationId] = useState<string>();
  const requestKey = `${from}:${to}:${locationId ?? ""}`;
  const [result, setResult] = useState<AnalyticsResult>();
  const currentResult = result?.key === requestKey ? result : undefined;
  const trend = currentResult?.trend ?? [];
  const customerSummary = currentResult?.customerSummary;
  const locations = currentResult?.locations ?? [];
  const currency = currentResult?.currency;
  const errors = currentResult?.errors ?? {};
  const loading = currentResult === undefined;

  useEffect(() => {
    let cancelled = false;
    const key = `${from}:${to}:${locationId ?? ""}`;
    const params = {
      from,
      to,
      model: "last_non_direct",
      ...(locationId ? { locationId } : {}),
    };
    const locationParams = { from, to, model: "last_non_direct" };

    void Promise.allSettled([
      getReportTrend(params),
      getReportCustomers(params),
      getReportLocations(locationParams),
      getReportsSummary(params),
    ]).then(([trendResult, customerResult, locationResult, summaryResult]) => {
      if (cancelled) return;
      const failedRequests = [
        trendResult.status === "rejected" ? "trend" : undefined,
        customerResult.status === "rejected" ? "customer analytics" : undefined,
        locationResult.status === "rejected" ? "location filters" : undefined,
        summaryResult.status === "rejected" ? "currency details" : undefined,
      ].filter((request): request is string => request !== undefined);
      if (failedRequests.length > 0) {
        toast.error(`Unable to load ${failedRequests.join(", ")}.`);
      }

      setResult({
        key,
        trend:
          trendResult.status === "fulfilled" ? trendResult.value.data.data : [],
        customerSummary:
          customerResult.status === "fulfilled"
            ? customerResult.value.data
            : undefined,
        locations:
          locationResult.status === "fulfilled"
            ? locationResult.value.data.data
            : [],
        currency:
          summaryResult.status === "fulfilled"
            ? summaryResult.value.data.currency
            : undefined,
        errors: {
          trend:
            trendResult.status === "rejected"
              ? getRequestErrorMessage(trendResult.reason)
              : undefined,
          customers:
            customerResult.status === "rejected"
              ? getRequestErrorMessage(customerResult.reason)
              : undefined,
          locations:
            locationResult.status === "rejected"
              ? getRequestErrorMessage(locationResult.reason)
              : undefined,
          summary:
            summaryResult.status === "rejected"
              ? getRequestErrorMessage(summaryResult.reason)
              : undefined,
        },
      });
    }).catch((requestError: unknown) => {
      if (cancelled) return;
      const message = getRequestErrorMessage(requestError);
      toast.error("Unable to load analytics reports.");
      setResult({
        key,
        trend: [],
        locations: [],
        errors: {
          trend: message,
          customers: message,
          locations: message,
          summary: message,
        },
      });
    });

    return () => {
      cancelled = true;
    };
  }, [from, to, locationId]);

  const locationOptions = locations.flatMap((location) =>
    location.locationId
      ? [{ id: location.locationId, name: location.locationName }]
      : [],
  );
  const avgOrderValueData = trend.map((point) => ({
    label: formatReportDate(point.date),
    value:
      point.orders > 0
        ? Number(point.netMinorUnits) / 100 / point.orders
        : 0,
  }));
  const newCustomerData = trend.map((point) => ({
    label: formatReportDate(point.date),
    value: point.newCustomers,
  }));

  return (
    <PageLayout
      title="Analytics"
      headTitle="TAS"
      description="Explore customer and order trends for the selected reporting period."
    >
      <ReportFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        locationId={locationId}
        onLocationChange={setLocationId}
        locations={locationOptions}
        locationsLoading={loading}
      />

      {errors.locations && (
        <p role="alert" className="text-sm text-danger">
          Unable to load location filters: {errors.locations}
        </p>
      )}

      {loading ? (
        <StatCardsSkeleton count={4} />
      ) : customerSummary && (
        <AnalyticsGrid>
          <Card
            title="Total Customers"
            value={customerSummary.totalCustomers.toLocaleString()}
            description="in selected period"
          />
          <Card
            title="New Customers"
            value={customerSummary.newCustomers.toLocaleString()}
            description="in selected period"
          />
          <Card
            title="Returning Customers"
            value={customerSummary.returningCustomers.toLocaleString()}
            description="in selected period"
          />
          <Card
            title="Repeat Rate"
            value={`${customerSummary.repeatRate}%`}
            description="in selected period"
          />
        </AnalyticsGrid>
      )}
      {errors.customers && (
        <p role="alert" className="text-sm text-danger">
          Unable to load customer analytics: {errors.customers}
        </p>
      )}

      {errors.summary && (
        <p role="alert" className="text-sm text-danger">
          Unable to load currency details: {errors.summary}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AvgOrderValueTrend
          data={avgOrderValueData}
          currency={currency}
          loading={loading}
          error={
            errors.trend ??
            (!currency && !loading ? "Currency details are unavailable." : undefined)
          }
        />
        <NewCustomersTrend
          data={newCustomerData}
          loading={loading}
          error={errors.trend}
        />
      </div>
    </PageLayout>
  );
}

export default Analytics;
