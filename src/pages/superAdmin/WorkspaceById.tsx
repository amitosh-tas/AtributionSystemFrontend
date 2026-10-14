import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageLayout from "@/components/layout/PageLayout";
import EmptyState from "@/components/ui/EmptyState";
import { WorkspaceDetailsSkeleton } from "@/components/ui/Skeleton";
import { getWorkspaceById } from "@/services/platfromAdmin";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  status: string;
  country: string;
  dataRegion: string;
  defaultModel: string;
  reportingCurrency: string;
  timezone: string;
  consentMode: string;
  lookbackDays: number;
  rawRetentionMonths: number;
  createdAt: string;
  updatedAt: string;
  industry: string | null;
  websiteUrl: string | null;
  plan: string | null;
}

interface WorkspaceResponse {
  workspace: Workspace;
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  }>;
  sites: unknown[];
  locations: unknown[];
  apiKeys: unknown[];
  connectors: unknown[];
  webhooks: unknown[];
}

function WorkspaceById() {
  const { id } = useParams<{ id: string }>();

  const [workspaceData, setWorkspaceData] =
    useState<WorkspaceResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Workspace ID is missing.");
      return;
    }

    let cancelled = false;
    const workspaceId: string = id;

    async function fetchWorkspace() {
      try {
        setLoading(true);
        setError(null);

        const res = await getWorkspaceById(workspaceId);
        const result: WorkspaceResponse = res.data.data;

        if (!cancelled) {
          setWorkspaceData(result);
        }
      } catch (err) {
        console.error("Failed to fetch workspace:", err);

        if (!cancelled) {
          setError("Unable to load workspace details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchWorkspace();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <PageLayout
      headTitle={workspaceData?.workspace.name ?? id ?? "Workspace"}
      title="Workspace"
      description="Manage client workspace, edit, and monitor their status."
    >
      {loading ? (
        <WorkspaceDetailsSkeleton />
      ) : error ? (
        <EmptyState
          title="Unable to Load Workspace"
          description={error}
        />
      ) : workspaceData ? (
        <div className="space-y-6">
          {/* Workspace overview */}
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {workspaceData.workspace.name}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {workspaceData.workspace.slug}
                </p>
              </div>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium capitalize text-amber-800">
                {workspaceData.workspace.status}
              </span>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="mt-1 font-medium">
                  {workspaceData.workspace.country}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Data Region</p>
                <p className="mt-1 font-medium">
                  {workspaceData.workspace.dataRegion}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Reporting Currency</p>
                <p className="mt-1 font-medium">
                  {workspaceData.workspace.reportingCurrency}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Default Attribution Model</p>
                <p className="mt-1 font-medium">
                  {workspaceData.workspace.defaultModel}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Lookback Window</p>
                <p className="mt-1 font-medium">
                  {workspaceData.workspace.lookbackDays} days
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Raw Data Retention</p>
                <p className="mt-1 font-medium">
                  {workspaceData.workspace.rawRetentionMonths} months
                </p>
              </div>
            </div>
          </section>

          {/* Workspace users */}
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Workspace Users
            </h2>

            {workspaceData.users.length > 0 ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500">
                      <th className="py-3 pr-4 font-medium">Name</th>
                      <th className="py-3 pr-4 font-medium">Email</th>
                      <th className="py-3 pr-4 font-medium">Role</th>
                      <th className="py-3 font-medium">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {workspaceData.users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="py-3 pr-4 font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="py-3 pr-4 text-gray-600">
                          {user.email}
                        </td>
                        <td className="py-3 pr-4 capitalize text-gray-600">
                          {user.role.replaceAll("_", " ")}
                        </td>
                        <td className="py-3 capitalize text-gray-600">
                          {user.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                No users found in this workspace.
              </p>
            )}
          </section>
        </div>
      ) : (
        <EmptyState
          title="No Workspace Defined"
          description="Please go back and select a workspace again."
        />
      )}
    </PageLayout>
  );
}

export default WorkspaceById;