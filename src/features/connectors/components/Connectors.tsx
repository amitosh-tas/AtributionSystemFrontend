import { useCallback, useEffect, useState } from "react";
import DataTable, {
  type DataTableColumn,
} from "@/components/ui/DataTable";
import {
  deleteConnector,
  getConnectors,
  sendConnectors,
  updateConnector,
} from "@/services/connectorService";
import toast from "react-hot-toast";
import ConnectorWebhookSetupModal from "./ConnectorWebhookSetupModal";

const CONNECTOR_PROVIDERS = [
  { type: "razorpay", label: "Razorpay" },
  { type: "stripe", label: "Stripe" },
  { type: "paypal", label: "PayPal" },
  { type: "cashfree", label: "Cashfree" },
  { type: "square", label: "Square" },
  { type: "other", label: "Other" },
] as const;

type ConnectorType = (typeof CONNECTOR_PROVIDERS)[number]["type"];

interface Connector {
  id: string;
  type: string;
  name: string;
  config?: {
    webhookSecret?: string;
  };
}

interface ConnectorPayload {
  type: ConnectorType;
  name: string;
  config: {
    webhookSecret: string;
  };
}

interface ConnectorSetup {
  webhookUrl: string;
  webhookSecret: string;
}

function getProviderLabel(type: string) {
  return CONNECTOR_PROVIDERS.find((provider) => provider.type === type)?.label ??
    type;
}

interface ConnectorFormProps {
  connector?: Connector;
  unavailableTypes: string[];
  onCancel: () => void;
  onSave: (values: ConnectorPayload) => Promise<boolean>;
}

function ConnectorForm({
  connector,
  unavailableTypes,
  onCancel,
  onSave,
}: ConnectorFormProps) {
  const initialType =
    CONNECTOR_PROVIDERS.find(
      (provider) =>
        provider.type === connector?.type ||
        (!connector && !unavailableTypes.includes(provider.type)),
    )?.type ?? CONNECTOR_PROVIDERS[0].type;
  const [type, setType] = useState<ConnectorType>(initialType);
  const [name, setName] = useState(connector?.name ?? "");
  const [webhookSecret, setWebhookSecret] = useState(
    connector?.config?.webhookSecret ?? "",
  );
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      const saved = await onSave({
        type,
        name: name.trim(),
        config: { webhookSecret: webhookSecret.trim() },
      });
      if (saved) onCancel();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="connector-dialog-title"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 sm:p-6"
      >
        <h3
          id="connector-dialog-title"
          className="font-heading text-xl font-semibold"
        >
          {connector ? "Edit connector" : "Generate a connector"}
        </h3>
        <p className="mt-2 text-sm leading-6 text-text-muted">
          Add the payment provider and webhook secret for this connector.
        </p>

        <label
          htmlFor="connector-provider"
          className="mt-5 block text-xs font-medium text-text-muted"
        >
          Connector type
        </label>
        <select
          id="connector-provider"
          required
          disabled={
            !connector &&
            CONNECTOR_PROVIDERS.every((provider) =>
              unavailableTypes.includes(provider.type),
            )
          }
          value={type}
          onChange={(event) => {
            const selectedProvider = CONNECTOR_PROVIDERS.find(
              (provider) => provider.type === event.target.value,
            );
            if (selectedProvider) setType(selectedProvider.type);
          }}
          className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-text focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {CONNECTOR_PROVIDERS.map((provider) => (
            <option
              key={provider.type}
              value={provider.type}
              disabled={
                provider.type !== connector?.type &&
                unavailableTypes.includes(provider.type)
              }
            >
              {provider.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-text-muted">
          Each connector type can only be added once.
        </p>

        <label
          htmlFor="connector-name"
          className="mt-5 block text-xs font-medium text-text-muted"
        >
          Name
        </label>
        <input
          type="text"
          id="connector-name"
          required
          maxLength={100}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Production payments"
          className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-text focus-visible:ring-2 focus-visible:ring-primary/40"
        />

        <label
          htmlFor="connector-webhook-secret"
          className="mt-5 block text-xs font-medium text-text-muted"
        >
          Webhook secret
        </label>
        <input
          id="connector-webhook-secret"
          type="password"
          required
          autoComplete="new-password"
          value={webhookSecret}
          onChange={(event) => setWebhookSecret(event.target.value)}
          placeholder={
            connector && !connector.config?.webhookSecret
              ? "Enter a new webhook secret"
              : "Enter webhook secret"
          }
          className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-text focus-visible:ring-2 focus-visible:ring-primary/40"
        />

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="cursor-pointer rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-surface-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !name.trim() || !webhookSecret.trim()}
            className="cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving…"
              : connector
                ? "Save changes"
                : "Generate connector"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Connectors() {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [connectorToEdit, setConnectorToEdit] = useState<Connector | null>(
    null,
  );
  const [connectorToDelete, setConnectorToDelete] = useState<Connector | null>(
    null,
  );
  const [connectorSetup, setConnectorSetup] =
    useState<ConnectorSetup | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchConnectors = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getConnectors();
      const payload = response.data?.data;
      const connectorList = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : null;

      if (!connectorList) {
        throw new Error("Unexpected connectors API response format.");
      }

      setConnectors(connectorList);
      return connectorList as Connector[];
    } catch (fetchError) {
      console.error("Failed to fetch connectors:", fetchError);
      setError("Unable to load connectors. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchConnectors();
  }, [fetchConnectors]);

  const createConnector = async (values: ConnectorPayload) => {
    try {
      const response = await sendConnectors(values);
      const payload = response.data?.data;
      let connectorId: string | undefined =
        payload?.id ?? response.data?.id;

      const refreshedConnectors = await fetchConnectors();
      connectorId ??= refreshedConnectors?.find(
        (connector) => connector.type === values.type,
      )?.id;

      if (!connectorId) {
        toast.error("Connector was created, but its ID was not returned.");
        return false;
      }

      setConnectorSetup({
        webhookUrl: `https://asbtemp-production.up.railway.app/api/connectors/${values.type}/webhook?connectorId=${connectorId}`,
        webhookSecret: values.config.webhookSecret,
      });
      toast.success("Connector created successfully.");
      return true;
    } catch (createError) {
      console.error("Failed to create connector:", createError);
      toast.error("Unable to create the connector. Please try again.");
      return false;
    }
  };

  const saveConnector = async (values: ConnectorPayload) => {
    const typeAlreadyExists = connectors.some(
      (connector) =>
        connector.type === values.type && connector.id !== connectorToEdit?.id,
    );
    if (typeAlreadyExists) {
      toast.error("A connector of this type already exists.");
      return false;
    }

    if (!connectorToEdit) return createConnector(values);

    try {
      await updateConnector(connectorToEdit.id, values);
      setConnectorSetup({
        webhookUrl: `https://asbtemp-production.up.railway.app/api/connectors/${values.type}/webhook?connectorId=${connectorToEdit.id}`,
        webhookSecret: values.config.webhookSecret,
      });
      await fetchConnectors();
      toast.success("Connector updated successfully.");
      return true;
    } catch (updateError) {
      console.error("Failed to update connector:", updateError);
      toast.error("Unable to update the connector. Please try again.");
      return false;
    }
  };

  const removeConnector = async () => {
    if (!connectorToDelete || deleting) return;

    setDeleting(true);
    try {
      await deleteConnector(connectorToDelete.id);
      toast.success("Connector deleted successfully.");
      setConnectorToDelete(null);
      await fetchConnectors();
    } catch (deleteError) {
      console.error("Failed to delete connector:", deleteError);
      toast.error("Unable to delete the connector. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const columns: DataTableColumn<Connector>[] = [
    {
      key: "type",
      header: "Connector type",
      render: (connector) => (
        <span className="font-medium">{getProviderLabel(connector.type)}</span>
      ),
    },
    {
      key: "name",
      header: "Name",
      render: (connector) => <span>{connector.name}</span>,
    },
    {
      key: "webhooksecret",
      header: "Webhook secret",
      render: () => (
        <span aria-label="Webhook secret hidden" className="text-xs text-text-muted">
          **************
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (connector) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setConnectorToEdit(connector)}
            aria-label={`Edit ${connector.name}`}
            className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition hover:bg-hover"
          >
            <i className="fi fi-rr-edit" aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setConnectorToDelete(connector)}
            aria-label={`Delete ${connector.name}`}
            className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border border-danger/30 px-2.5 py-1.5 text-xs font-medium text-danger transition hover:bg-danger/5"
          >
            <i className="fi fi-rr-trash" aria-hidden="true" />
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-lg font-semibold">Connectors</h2>
          <p className="text-sm text-text-muted">
            Manage payment providers and their webhook secrets.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
            disabled={
              loading ||
              Boolean(error) ||
              CONNECTOR_PROVIDERS.every((provider) =>
                connectors.some(
                  (connector) => connector.type === provider.type,
                ),
              )
            }
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          <i className="fi fi-rr-plus" aria-hidden="true" />
          Generate connector
        </button>
      </div>

      {!error && (
        <DataTable
          tableHead="Your connectors"
          tableSubHead={`${connectors.length} connector${connectors.length === 1 ? "" : "s"} found`}
          columns={columns}
          data={connectors}
          getRowKey={(connector) => connector.id}
          emptyMessage="No connectors yet. Generate a connector to get started."
          loading={loading}
        />
      )}

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-danger"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void fetchConnectors()}
            className="cursor-pointer font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      {(createModalOpen || connectorToEdit) && (
        <ConnectorForm
          key={connectorToEdit?.id ?? "new-connector"}
          connector={connectorToEdit ?? undefined}
          unavailableTypes={connectors
            .filter((connector) => connector.id !== connectorToEdit?.id)
            .map((connector) => connector.type)}
          onCancel={() => {
            setCreateModalOpen(false);
            setConnectorToEdit(null);
          }}
          onSave={saveConnector}
        />
      )}

      {connectorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-connector-title"
            className="w-full max-w-md rounded-2xl border border-border bg-card p-5 sm:p-6"
          >
            <h3
              id="delete-connector-title"
              className="font-heading text-lg font-semibold"
            >
              Delete connector?
            </h3>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              This will remove “{connectorToDelete.name}” from your connectors.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConnectorToDelete(null)}
                disabled={deleting}
                className="cursor-pointer rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void removeConnector()}
                disabled={deleting}
                className="cursor-pointer rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete connector"}
              </button>
            </div>
          </div>
        </div>
      )}

      {connectorSetup && (
        <ConnectorWebhookSetupModal
          webhookUrl={connectorSetup.webhookUrl}
          webhookSecret={connectorSetup.webhookSecret}
          onClose={() => setConnectorSetup(null)}
        />
      )}
    </section>
  );
}

export default Connectors;
