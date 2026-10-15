import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageLayout from "@/components/layout/PageLayout";
import EmptyState from "@/components/ui/EmptyState";
import DataTable, { type DataTableColumn } from "@/components/ui/DataTable";
import Pill from "@/components/ui/Pill";
import StatusPill from "@/components/ui/StatusPill";
import { WorkspaceDetailsSkeleton } from "@/components/ui/Skeleton";
import { getWorkspaceById, updateUser } from "@/services/platfromAdmin";
import toast from "react-hot-toast";

type UserStatus = "invited" | "active" | "deactivated";

interface WorkspaceUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface WorkspaceUserUpdate {
  role: string;
  status: UserStatus;
  reason: string;
}

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

const WORKSPACE_DETAIL_FIELDS: ReadonlyArray<{
  key: keyof Workspace;
  label: string;
  suffix?: string;
}> = [
  { key: "country", label: "Country" },
  { key: "dataRegion", label: "Data Region" },
  { key: "reportingCurrency", label: "Reporting Currency" },
  { key: "defaultModel", label: "Default Attribution Model" },
  { key: "lookbackDays", label: "Lookback Window", suffix: "days" },
  {
    key: "rawRetentionMonths",
    label: "Raw Data Retention",
    suffix: "months",
  },
];

interface WorkspaceResponse {
  workspace: Workspace;
  users: WorkspaceUser[];
  sites: unknown[];
  locations: unknown[];
  apiKeys: unknown[];
  connectors: unknown[];
  webhooks: unknown[];
}

function getStatusPillStatus(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "ACTIVE";
    case "invited":
    case "pending":
      return "PENDING";
    case "deactivated":
    case "inactive":
      return "DEACTIVE";
    case "suspended":
      return "SUSPENDED";
    case "ongoing":
      return "ONGOING";
    case "closed":
      return "CLOSED";
    case "open":
      return "OPEN";
    default:
      return null;
  }
}

function WorkspaceById() {
  const { id } = useParams<{ id: string }>();

  const [workspaceData, setWorkspaceData] =
    useState<WorkspaceResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingUser, setSavingUser] = useState(false);
  const [userToEdit, setUserToEdit] = useState<WorkspaceUser | null>(null);
  // const [userToDeactivate, setUserToDeactivate] =
  //   useState<WorkspaceUser | null>(null);
  // const [deactivationReason, setDeactivationReason] = useState("");

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

  const refreshWorkspaceUsers = async () => {
    if (!id) return false;
    try {
      const response = await getWorkspaceById(id);
      const updatedWorkspace: WorkspaceResponse = response.data.data;
      setWorkspaceData(updatedWorkspace);
      return true;
    } catch (refreshError) {
      console.error("Failed to refresh workspace users:", refreshError);
      toast.error("The user was updated, but the workspace could not be refreshed.");
      return false;
    }
  };

  const saveUser = async (
    user: WorkspaceUser,
    data: WorkspaceUserUpdate,
  ) => {
    if (savingUser) return false;
    setSavingUser(true);
    try {
      await updateUser({ id: user.id, data });
      toast.success("User updated successfully.");
      await refreshWorkspaceUsers();
      return true;
    } catch (updateError) {
      console.error("Failed to update workspace user:", updateError);
      toast.error("Unable to update this user. Please try again.");
      return false;
    } finally {
      setSavingUser(false);
    }
  };

  // const deactivateUser = async (user: WorkspaceUser, reason: string) => {
  //   if (savingUser || !reason.trim()) return false;
  //   setSavingUser(true);
  //   try {
  //     await updateUser({
  //       id: user.id,
  //       data: {
  //         role: user.role,
  //         status: "deactivated",
  //         reason: reason.trim(),
  //       },
  //     });
  //     toast.success("User deactivated successfully.");
  //     await refreshWorkspaceUsers();
  //     return true;
  //   } catch (deactivateError) {
  //     console.error("Failed to deactivate workspace user:", deactivateError);
  //     toast.error("Unable to deactivate this user. Please try again.");
  //     return false;
  //   } finally {
  //     setSavingUser(false);
  //   }
  // };

  const userColumns: DataTableColumn<WorkspaceUser>[] = [
    {
      key: "name",
      header: "Name",
      render: (user) => <span className="font-medium">{user.name}</span>,
    },
    {
      key: "email",
      header: "Email",
      render: (user) => <span>{user.email}</span>,
    },
    {
      key: "role",
      header: "Role",
      render: (user) => <Pill name={user.role.replaceAll("_", " ")} />,
    },
    {
      key: "status",
      header: "Status",
      render: (user) => {
        const status = getStatusPillStatus(user.status);
        return status ? (
          <StatusPill status={status} />
        ) : (
          <Pill name={user.status} />
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (user) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setUserToEdit(user)}
            aria-label={`Edit ${user.name}`}
            className=" cursor-pointer rounded-md border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-surface-muted"
          >
            Edit
          </button>
          {/* <button
            type="button"
            onClick={() => {
              setUserToDeactivate(user);
              setDeactivationReason("");
            }}
            disabled={user.status.toLowerCase() === "deactivated"}
            aria-label={`Deactivate ${user.name}`}
            className="rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Deactivate
          </button> */}
        </div>
      ),
    },
  ];

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

              {getStatusPillStatus(workspaceData.workspace.status) ? (
                <StatusPill
                  status={getStatusPillStatus(workspaceData.workspace.status)!}
                />
              ) : (
                <Pill name={workspaceData.workspace.status} />
              )}
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {WORKSPACE_DETAIL_FIELDS.map(({ key, label, suffix }) => (
                <div key={key}>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="mt-1 font-medium">
                    {workspaceData.workspace[key]}
                    {suffix ? ` ${suffix}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <DataTable
            tableHead="Workspace Users"
            tableSubHead={`${workspaceData.users.length} user${workspaceData.users.length === 1 ? "" : "s"}`}
            columns={userColumns}
            data={workspaceData.users}
            getRowKey={(user) => user.id}
            emptyMessage="No users found in this workspace."
          />

          {userToEdit && (
            <>
            <div className="bg-black/40 fixed h-full w-full top-0 left-0 z-50"></div>
            <form
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-workspace-user-title"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const update: WorkspaceUserUpdate = {
                  role: String(formData.get("role")),
                  status: String(formData.get("status")) as UserStatus,
                  reason: String(formData.get("reason")).trim(),
                };
                void saveUser(userToEdit, update).then((saved) => {
                  if (saved) setUserToEdit(null);
                });
              }}
              className="fixed inset-0 z-60 m-auto h-fit max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-5 sm:p-6"
            >
              <h2
                id="edit-workspace-user-title"
                className="font-heading text-xl font-semibold"
              >
                Edit workspace user
              </h2>
              <p className="mt-2 text-sm text-text-muted">
                {userToEdit.email}
              </p>
              <label
                htmlFor="workspace-user-role"
                className="mt-5 block text-xs font-medium text-text-muted"
              >
                Role
              </label>
              <select
                id="workspace-user-role"
                name="role"
                defaultValue={userToEdit.role}
                className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text"
              >
                <option value="company_admin">Admin</option>
                <option value="company_viewer">Viewer</option>
                <option value="platform_admin">Platform admin</option>
              </select>
              <label
                htmlFor="workspace-user-status"
                className="mt-5 block text-xs font-medium text-text-muted"
              >
                Status
              </label>
              <select
                id="workspace-user-status"
                name="status"
                defaultValue={userToEdit.status}
                className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm capitalize text-text"
              >
                <option value="invited">Invited</option>
                <option value="active">Active</option>
                <option value="deactivated">Deactivated</option>
              </select>
              <label
                htmlFor="workspace-user-reason"
                className="mt-5 block text-xs font-medium text-text-muted"
              >
                Reason
              </label>
              <textarea
                id="workspace-user-reason"
                name="reason"
                required
                rows={3}
                placeholder="Reason for this change"
                className="mt-2 w-full resize-none rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text"
              />
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUserToEdit(null)}
                  disabled={savingUser}
                  className="rounded-lg cursor-pointer border border-border px-4 py-2.5 text-sm font-medium hover:bg-surface-muted disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="rounded-lg cursor-pointer bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingUser ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
            </>
          )}

          {/* {userToDeactivate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="deactivate-workspace-user-title"
                className="w-full max-w-md rounded-xl border border-border bg-card p-5 sm:p-6"
              >
                <h2
                  id="deactivate-workspace-user-title"
                  className="font-heading text-lg font-semibold"
                >
                  Deactivate user?
                </h2>
                <p className="mt-2 text-sm leading-6 text-text-muted">
                  {userToDeactivate.name} will remain in this workspace with a
                  deactivated status.
                </p>
                <label
                  htmlFor="deactivate-user-reason"
                  className="mt-5 block text-xs font-medium text-text-muted"
                >
                  Reason
                </label>
                <textarea
                  id="deactivate-user-reason"
                  required
                  value={deactivationReason}
                  onChange={(event) =>
                    setDeactivationReason(event.target.value)
                  }
                  placeholder="Reason for deactivation"
                  rows={3}
                  className="mt-2 w-full resize-y rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text"
                />
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setUserToDeactivate(null)}
                    disabled={savingUser}
                    className="rounded-lg border cursor-pointer border-border px-4 py-2.5 text-sm font-medium hover:bg-surface-muted disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void deactivateUser(
                        userToDeactivate,
                        deactivationReason,
                      ).then((saved) => {
                        if (saved) setUserToDeactivate(null);
                      });
                    }}
                    disabled={savingUser || !deactivationReason.trim()}
                    className="rounded-lg cursor-pointer bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingUser ? "Deactivating…" : "Deactivate user"}
                  </button>
                </div>
              </div>
            </div>
          )} */}
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