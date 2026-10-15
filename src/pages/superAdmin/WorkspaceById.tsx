import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageLayout from "@/components/layout/PageLayout";
import EmptyState from "@/components/ui/EmptyState";
import DataTable, { type DataTableColumn } from "@/components/ui/DataTable";
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

interface UserUpdate {
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

interface WorkspaceResponse {
  workspace: Workspace;
  users: WorkspaceUser[];
  sites: unknown[];
  locations: unknown[];
  apiKeys: unknown[];
  connectors: unknown[];
  webhooks: unknown[];
}

interface EditUserDialogProps {
  user: WorkspaceUser;
  saving: boolean;
  onCancel: () => void;
  onSave: (data: UserUpdate) => Promise<boolean>;
}

function EditUserDialog({
  user,
  saving,
  onCancel,
  onSave,
}: EditUserDialogProps) {
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState<UserStatus>(
    user.status === "invited" || user.status === "deactivated"
      ? user.status
      : "active",
  );
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-workspace-user-title"
        onSubmit={(event) => {
          event.preventDefault();
          void onSave({ role, status, reason: reason.trim() });
        }}
        className="w-full max-w-lg rounded-xl border border-border bg-card p-5 sm:p-6"
      >
        <h2
          id="edit-workspace-user-title"
          className="font-heading text-xl font-semibold"
        >
          Edit workspace user
        </h2>
        <p className="mt-2 text-sm text-text-muted">{user.email}</p>

        <label
          htmlFor="workspace-user-role"
          className="mt-5 block text-xs font-medium text-text-muted"
        >
          Role
        </label>
        <select
          id="workspace-user-role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
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
          value={status}
          onChange={(event) => setStatus(event.target.value as UserStatus)}
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
          required
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Reason for this change"
          rows={3}
          className="mt-2 w-full resize-y rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text"
        />

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="cursor-pointer rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-surface-muted disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !reason.trim()}
            className="cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function WorkspaceById() {
  const { id } = useParams<{ id: string }>();

  const [workspaceData, setWorkspaceData] =
    useState<WorkspaceResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userToEdit, setUserToEdit] = useState<WorkspaceUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<WorkspaceUser | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [savingUser, setSavingUser] = useState(false);

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

  const saveUser = async (user: WorkspaceUser, data: UserUpdate) => {
    if (savingUser) return false;
    setSavingUser(true);
    try {
      await updateUser({ id: user.id, data });
      toast.success("User updated successfully.");
      setUserToEdit(null);
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

  const deactivateUser = async () => {
    if (!userToDelete || savingUser || !deleteReason.trim()) return;
    setSavingUser(true);
    try {
      await updateUser({
        id: userToDelete.id,
        data: {
          role: userToDelete.role,
          status: "deactivated",
          reason: deleteReason.trim(),
        },
      });
      toast.success("User deactivated successfully.");
      setUserToDelete(null);
      setDeleteReason("");
      await refreshWorkspaceUsers();
    } catch (deactivateError) {
      console.error("Failed to deactivate workspace user:", deactivateError);
      toast.error("Unable to deactivate this user. Please try again.");
    } finally {
      setSavingUser(false);
    }
  };

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
      render: (user) => (
        <span className="capitalize">{user.role.replaceAll("_", " ")}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (user) => <span className="capitalize">{user.status}</span>,
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
            className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-surface-muted"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              setUserToDelete(user);
              setDeleteReason("");
            }}
            disabled={user.status === "deactivated"}
            aria-label={`Delete ${user.name}`}
            className="rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Delete
          </button>
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
            <DataTable
              tableHead="Workspace Users"
              tableSubHead={`${workspaceData.users.length} user${workspaceData.users.length === 1 ? "" : "s"}`}
              columns={userColumns}
              data={workspaceData.users}
              getRowKey={(user) => user.id}
              emptyMessage="No users found in this workspace."
            />
          </section>

          {userToEdit && (
            <EditUserDialog
              key={userToEdit.id}
              user={userToEdit}
              saving={savingUser}
              onCancel={() => setUserToEdit(null)}
              onSave={(data) => saveUser(userToEdit, data)}
            />
          )}

          {userToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-workspace-user-title"
                className="w-full max-w-md rounded-xl border border-border bg-card p-5 sm:p-6"
              >
                <h2
                  id="delete-workspace-user-title"
                  className="font-heading text-lg font-semibold"
                >
                  Deactivate user?
                </h2>
                <p className="mt-2 text-sm leading-6 text-text-muted">
                  This will deactivate {userToDelete.name}. The user will remain
                  in the workspace with a deactivated status.
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
                  value={deleteReason}
                  onChange={(event) => setDeleteReason(event.target.value)}
                  placeholder="Reason for deactivation"
                  rows={3}
                  className="mt-2 w-full resize-y rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text"
                />
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setUserToDelete(null)}
                    disabled={savingUser}
                    className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-surface-muted disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void deactivateUser()}
                    disabled={savingUser || !deleteReason.trim()}
                    className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingUser ? "Deactivating…" : "Deactivate user"}
                  </button>
                </div>
              </div>
            </div>
          )}
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