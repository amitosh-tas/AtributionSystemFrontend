import { useEffect, useState } from "react";
import type { DataTableColumn } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import Pill from "@/components/ui/Pill";
import PageLayout from "@/components/layout/PageLayout";
import ReportFilters from "@/features/reports/components/ReportFilters";
import {
  getPresetDateRange,
  type DateRange,
} from "@/features/reports/utils/dateRange";
import { formatMinorUnits } from "@/features/reports/utils/formatting";
import {
  getReportCampaigns,
  getReportLocations,
  getReportsSummary,
  type ReportCampaign,
  type ReportLocation,
} from "@/services/companyServices";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "The request failed.";
}

interface CampaignResult {
  key: string;
  campaigns: ReportCampaign[];
  locations: ReportLocation[];
  currency?: string;
  errors: {
    campaigns?: string;
    locations?: string;
    summary?: string;
  };
}

function Campaign() {
  const [dateRange, setDateRange] = useState<DateRange>(() =>
    getPresetDateRange(30),
  );
  const { from, to } = dateRange;
  const [locationId, setLocationId] = useState<string>();
  const requestKey = `${from}:${to}:${locationId ?? ""}`;
  const [result, setResult] = useState<CampaignResult>();
  const currentResult = result?.key === requestKey ? result : undefined;
  const campaigns = currentResult?.campaigns ?? [];
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
      getReportCampaigns(params),
      getReportLocations(locationParams),
      getReportsSummary(params),
    ]).then(([campaignResult, locationResult, summaryResult]) => {
      if (cancelled) return;

      setResult({
        key,
        campaigns:
          campaignResult.status === "fulfilled"
            ? campaignResult.value.data.data
            : [],
        locations:
          locationResult.status === "fulfilled"
            ? locationResult.value.data.data
            : [],
        currency:
          summaryResult.status === "fulfilled"
            ? summaryResult.value.data.currency
            : undefined,
        errors: {
          campaigns:
            campaignResult.status === "rejected"
              ? getErrorMessage(campaignResult.reason)
              : undefined,
          locations:
            locationResult.status === "rejected"
              ? getErrorMessage(locationResult.reason)
              : undefined,
          summary:
            summaryResult.status === "rejected"
              ? getErrorMessage(summaryResult.reason)
              : undefined,
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
  const columns: DataTableColumn<ReportCampaign>[] = [
    {
      key: "channel",
      header: "Channel",
      render: (row) => <Pill name={row.channel} />,
    },
    {
      key: "campaign",
      header: "Campaign",
      render: (row) => row.campaign,
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
  ];

  return (
    <PageLayout
      headTitle="Attribution"
      title="Campaigns"
      description="Understand campaign contribution to orders and net revenue."
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
      {errors.campaigns && (
        <p role="alert" className="text-sm text-danger">
          Unable to load campaign reports: {errors.campaigns}
        </p>
      )}
      {errors.summary && (
        <p role="alert" className="text-sm text-danger">
          Unable to load report currency: {errors.summary}
        </p>
      )}
      <DataTable
        tableHead="Campaign performance"
        tableSubHead="Grouped by attributed channel and campaign"
        columns={columns}
        data={campaigns}
        getRowKey={(row) => `${row.channel}:${row.campaign}`}
        loading={loading}
        emptyMessage="No campaign data found for this period."
      />
    </PageLayout>
  );
}

export default Campaign;
