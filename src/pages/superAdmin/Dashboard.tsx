import PageLayout from "@/components/layout/PageLayout";
import Card from "@/components/ui/Card";
import AnalyticsGrid from "@/features/analytics/components/AnalyticsGrid";
import { getPlatformDashboard } from "@/services/platfromAdmin";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface PlatformAdminDashboard {
  workspaces: {
    total: number;
    pending: number;
    active: number;
    suspended: number;
    closed: number;
  };
  users: {
    total: number;
    platformAdmins: number;
    active: number;
    deactivated: number;
  };
  apiKeys: {
    total: number;
    active: number;
    revoked: number;
  };
  connectors: {
    total: number;
    healthy: number;
    failing: number;
    disabled: number;
  };
  webhooks: {
    total: number;
    active: number;
  };
  auditEvents: number;
}

type ActiveMetric = {
  title: string;
  value: number;
};

function Dashboard() {
  const [dashboardData, setDashboardData] =
    useState<PlatformAdminDashboard | null>(null);

  useEffect(() => {
    const callApi = async () => {
      try {
        const res = await getPlatformDashboard();
        setDashboardData(res?.data?.data);
      } catch (error) {
        console.error("Failed to fetch platform dashboard:", error);
        toast.error("Unable to load the platform dashboard.");
      }
    };

    callApi();
  }, []);

  const activeMetrics: ActiveMetric[] = dashboardData
    ? [
        {
          title: "Active Workspaces",
          value: dashboardData.workspaces.active,
        },
        {
          title: "Active Users",
          value: dashboardData.users.active,
        },
        {
          title: "Active API Keys",
          value: dashboardData.apiKeys.active,
        },
        {
          title: "Active Webhooks",
          value: dashboardData.webhooks.active,
        },
      ]
    : [];

  return (
    <PageLayout
      headTitle="Platform"
      title="Super Admin"
      description="Manage Ledger workspaces, members, and platform access."
    >
      <AnalyticsGrid>
        {activeMetrics.map((item) => (
          <Card
            key={item.title}
            title={item.title}
            value={String(item.value)}
            description="Currently active on the platform"
          />
        ))}
      </AnalyticsGrid>
    </PageLayout>
  );
}

export default Dashboard;