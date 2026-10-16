import { useEffect, useState } from "react";
import type { DataTableColumn } from "@/components/ui/DataTable";
import PageLayout from "@/components/layout/PageLayout";
import Card from "@/components/ui/Card";
import DataTable from "@/components/ui/DataTable";
import Pill from "@/components/ui/Pill";
import Analytics from "@/features/analytics/components/Analytics";
import AnalyticsGrid from "@/features/analytics/components/AnalyticsGrid";
import RevenueByPlatform from "@/features/revenue/components/RevenueByPlatform";
import RevenueLedger from "@/features/revenue/components/RevenueLedger";
import RevenueLedgerChart from "@/features/revenue/components/RevenueLedgerChart";
import ReportFilters from "@/features/reports/components/ReportFilters";
import {
  getPresetDateRange,
  type DateRange,
} from "@/features/reports/utils/dateRange";
import {
  formatMajorUnits,
  formatMinorUnits,
} from "@/features/reports/utils/formatting";
import {
  getReportChannels,
  getReportLocations,
  getReportsSummary,
  getWorkspaceDashboard,
  type ReportChannel,
  type ReportLocation,
  type ReportsParams,
  type ReportsSummary,
  type WorkspaceDashboard,
} from "@/services/companyServices";

interface OverviewData {
  summary?: ReportsSummary;
  channels: ReportChannel[];
  locations: ReportLocation[];
  allLocations: ReportLocation[];
  dashboard?: WorkspaceDashboard;
}

interface OverviewErrors {
  summary?: string;
  channels?: string;
  locations?: string;
  dashboard?: string;
}

interface OverviewResult {
  key: string;
  data: OverviewData;
  errors: OverviewErrors;
}

const emptyOverviewData: OverviewData = {
  channels: [],
  locations: [],
  allLocations: [],
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "The request failed.";
}

function Overview() {
  const [dateRange, setDateRange] = useState<DateRange>(() =>
    getPresetDateRange(30),
  );
  const { from, to } = dateRange;
  const [locationId, setLocationId] = useState<string>();
  const requestKey = `${from}:${to}:${locationId ?? ""}`;
  const [result, setResult] = useState<OverviewResult>();
  const currentResult = result?.key === requestKey ? result : undefined;
  const data = currentResult?.data ?? emptyOverviewData;
  const errors = currentResult?.errors ?? {};
  const loading = currentResult === undefined;

  useEffect(() => {
    let cancelled = false;
    const key = `${from}:${to}:${locationId ?? ""}`;
    const params: ReportsParams = {
      from,
      to,
      model: "last_non_direct",
      ...(locationId ? { locationId } : {}),
    };
    const locationParams: ReportsParams = {
      from,
      to,
      model: "last_non_direct",
    };

    const locationsRequest = getReportLocations(params);
    const allLocationsRequest = locationId
      ? getReportLocations(locationParams)
      : locationsRequest;
    const requests = Promise.allSettled([
      getReportsSummary(params),
      getReportChannels(params),
      locationsRequest,
      allLocationsRequest,
      getWorkspaceDashboard(),
    ]);

    void requests.then(
      ([summary, channels, locations, allLocations, dashboard]) => {
        if (cancelled) return;
        setResult({
          key,
          data: {
            summary:
              summary.status === "fulfilled" ? summary.value.data : undefined,
            channels:
              channels.status === "fulfilled" ? channels.value.data.data : [],
            locations:
              locations.status === "fulfilled" ? locations.value.data.data : [],
            allLocations:
              allLocations.status === "fulfilled"
                ? allLocations.value.data.data
                : [],
            dashboard:
              dashboard.status === "fulfilled" ? dashboard.value.data : undefined,
          },
          errors: {
            summary:
              summary.status === "rejected"
                ? getErrorMessage(summary.reason)
                : undefined,
            channels:
              channels.status === "rejected"
                ? getErrorMessage(channels.reason)
                : undefined,
            locations:
              locations.status === "rejected"
                ? getErrorMessage(locations.reason)
                : undefined,
            dashboard:
              dashboard.status === "rejected"
                ? getErrorMessage(dashboard.reason)
                : undefined,
          },
        });
      },
    );

    return () => {
      cancelled = true;
    };
  }, [from, to, locationId]);

  const currency = data.summary?.currency ?? data.dashboard?.currency;
  const locationOptions = data.allLocations.flatMap((location) =>
    location.locationId
      ? [{ id: location.locationId, name: location.locationName }]
      : [],
  );
  const dashboardCards = data.dashboard
    ? [
        {
          title: "New Customers",
          value: data.dashboard.kpis.newCustomers.value.toLocaleString(),
          description: data.dashboard.kpis.newCustomers.label,
        },
        {
          title: "Returning Customers",
          value: data.dashboard.kpis.returningCustomers.value.toLocaleString(),
          description: data.dashboard.kpis.returningCustomers.label,
        },
        {
          title: "Retention",
          value: `${data.dashboard.kpis.retention.percentage}%`,
          description: data.dashboard.kpis.retention.detail,
        },
        {
          title: "Tracked Visits",
          value: data.dashboard.kpis.trackedVisits.value.toLocaleString(),
          description: data.dashboard.kpis.trackedVisits.label,
        },
        {
          title: "Ad-Attributed Revenue",
          value: formatMajorUnits(data.dashboard.revenueCards.adAttributed.value, data.dashboard.currency),
          description: data.dashboard.revenueCards.adAttributed.subtext,
        },
        {
          title: "Direct / Organic Revenue",
          value: formatMajorUnits(data.dashboard.revenueCards.directOrganic.value, data.dashboard.currency),
          description: data.dashboard.revenueCards.directOrganic.subtext,
        },
        {
          title: "Unattributed Revenue",
          value: formatMajorUnits(data.dashboard.revenueCards.unattributed.value, data.dashboard.currency),
          description: data.dashboard.revenueCards.unattributed.subtext,
        },
        {
          title: "Refunded",
          value: formatMajorUnits(data.dashboard.revenueCards.refunded.value, data.dashboard.currency),
          description: data.dashboard.revenueCards.refunded.subtext,
        },
        {
          title: "Avg Order Value",
          value: formatMajorUnits(data.dashboard.revenueCards.avgOrderValue.value, data.dashboard.currency),
          description: data.dashboard.revenueCards.avgOrderValue.subtext,
        },
      ]
    : [];

  const summaryCards = data.summary
    ? [
        {
          title: "Net Revenue",
          value: formatMinorUnits(data.summary.revenue.netMinorUnits, data.summary.currency),
          description: `${data.summary.orders.total.toLocaleString()} orders`,
        },
        {
          title: "Attributed Revenue",
          value: formatMinorUnits(
            data.summary.attribution.attributedRevenueMinorUnits,
            data.summary.currency,
          ),
          description: `${data.summary.attribution.coverageRate}% attribution coverage`,
        },
        {
          title: "Bookings",
          value: data.summary.bookings.total.toLocaleString(),
          description: `${data.summary.bookings.scheduled.toLocaleString()} scheduled · ${data.summary.bookings.cancelled.toLocaleString()} cancelled`,
        },
      ]
    : [];

  const channelColumns: DataTableColumn<ReportChannel>[] = [
    {
      key: "channel",
      header: "Channel",
      render: (row) => <Pill name={row.channel} />,
    },
    {
      key: "orders",
      header: "Orders",
      align: "right",
      render: (row) => row.orders.toLocaleString(),
    },
    {
      key: "revenue",
      header: "Net revenue",
      align: "right",
      render: (row) =>
        currency ? formatMinorUnits(row.netMinorUnits, currency) : "—",
    },
    {
      key: "newCustomers",
      header: "New customers",
      align: "right",
      render: (row) => row.newCustomers.toLocaleString(),
    },
    {
      key: "returningCustomers",
      header: "Returning customers",
      align: "right",
      render: (row) => row.returningCustomers.toLocaleString(),
    },
  ];

  const locationColumns: DataTableColumn<ReportLocation>[] = [
    {
      key: "location",
      header: "Location",
      render: (row) => row.locationName,
    },
    {
      key: "orders",
      header: "Orders",
      align: "right",
      render: (row) => row.orders.toLocaleString(),
    },
    {
      key: "revenue",
      header: "Net revenue",
      align: "right",
      render: (row) =>
        currency ? formatMinorUnits(row.netMinorUnits, currency) : "—",
    },
    {
      key: "newCustomers",
      header: "New customers",
      align: "right",
      render: (row) => row.newCustomers.toLocaleString(),
    },
    {
      key: "returningCustomers",
      header: "Returning customers",
      align: "right",
      render: (row) => row.returningCustomers.toLocaleString(),
    },
  ];

  return (
    <PageLayout
      headTitle="TAS"
      title="Master Report"
      description="Company-wide totals or a single location for your selected date range."
    >
      <ReportFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        locationId={locationId}
        onLocationChange={setLocationId}
        locations={locationOptions}
        locationsLoading={loading}
      />

      {errors.dashboard && (
        <p role="alert" className="text-sm text-danger">
          Unable to load workspace dashboard: {errors.dashboard}
        </p>
      )}
      <Analytics
        revenue={data.dashboard?.primaryRevenue.totalRevenue}
        exclTax={data.dashboard?.primaryRevenue.exclTax}
        tax={data.dashboard?.primaryRevenue.tax}
        invoices={data.dashboard?.primaryRevenue.invoicesCount}
        currency={data.dashboard?.currency}
        description={data.dashboard?.primaryRevenue.description}
      />

      {(dashboardCards.length > 0 || loading) && (
        <AnalyticsGrid>
          {loading && dashboardCards.length === 0 ? (
            <p role="status" className="text-sm text-text-muted">
              Loading workspace metrics…
            </p>
          ) : (
            dashboardCards.map(({ title, value, description }) => (
              <Card
                key={title}
                title={title}
                value={value}
                description={description}
              />
            ))
          )}
        </AnalyticsGrid>
      )}

      {(summaryCards.length > 0 || errors.summary) && (
        <section className="space-y-3">
          <h2 className="font-heading text-base font-semibold text-text">
            Report summary
          </h2>
          {errors.summary && (
            <p role="alert" className="text-sm text-danger">
              Unable to load report summary: {errors.summary}
            </p>
          )}
          {summaryCards.length > 0 && (
            <AnalyticsGrid>
              {summaryCards.map(({ title, value, description }) => (
                <Card
                  key={title}
                  title={title}
                  value={value}
                  description={description}
                />
              ))}
            </AnalyticsGrid>
          )}
        </section>
      )}

      <RevenueLedger>
        <RevenueLedgerChart
          data={data.dashboard?.revenueBySource ?? []}
          loading={loading}
        />
      </RevenueLedger>

      <section className="space-y-3">
        {errors.channels && (
          <p role="alert" className="text-sm text-danger">
            Unable to load channel reports: {errors.channels}
          </p>
        )}
        <DataTable
          tableHead="Revenue by Channel"
          tableSubHead="Attribution by the selected model"
          columns={channelColumns}
          data={data.channels}
          getRowKey={(row) => row.channel}
          loading={loading}
          emptyMessage="No channel data found for this period."
        />
      </section>

      <section className="space-y-3">
        {errors.locations && (
          <p role="alert" className="text-sm text-danger">
            Unable to load location reports: {errors.locations}
          </p>
        )}
        <DataTable
          tableHead="Revenue by Location"
          tableSubHead="Location totals for the selected period"
          columns={locationColumns}
          data={data.locations}
          getRowKey={(row) => row.locationId ?? row.locationName}
          loading={loading}
          emptyMessage="No location data found for this period."
        />
      </section>

      <RevenueByPlatform
        data={data.dashboard?.revenueByPlatform ?? []}
        currency={currency}
        loading={loading}
        error={errors.dashboard}
      />
    </PageLayout>
  );
}

export default Overview;
