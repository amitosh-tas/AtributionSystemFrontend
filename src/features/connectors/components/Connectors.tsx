import { useCallback, useEffect, useState, type FormEvent } from "react";
import DataTable, {
  type DataTableColumn,
} from "@/components/ui/DataTable";
import {
  getConnectors,
  sendConnectors,
} from "@/services/connectorService";
import toast from "react-hot-toast";

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
    webhooksecret?: string;
  };
}

interface ConnectorPayload {
  type: ConnectorType;
  name: string;
  config: {
    webhooksecret: string;
  };
}

function getProviderLabel(type: string) {
  return CONNECTOR_PROVIDERS.find((provider) => provider.type === type)?.label ??
    type;
}

interface ConnectorFormProps {
  onCancel: () => void;
  onSave: (values: ConnectorPayload) => Promise<boolean>;
}

function ConnectorForm({
  onCancel,
  onSave,
}: ConnectorFormProps) {
  const [type, setType] = useState<ConnectorType>(CONNECTOR_PROVIDERS[0].type);
  const [name, setName] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const saved = await onSave({
        type,
        name: name.trim(),
        config: { webhooksecret: webhookSecret.trim() },
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
        onSubmit={submit}
        className="w-full max-w-lg rounded-xl border border-border bg-card p-5 sm:p-6"
      >
        <h3
          id="connector-dialog-title"
          className="font-heading text-xl font-semibold"
        >
          Generate a connector
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
          value={type}
          onChange={(event) => {
            const selectedProvider = CONNECTOR_PROVIDERS.find(
              (provider) => provider.type === event.target.value,
            );
            if (selectedProvider) setType(selectedProvider.type);
          }}
          className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text focus-visible:ring-2 focus-visible:ring-neutral-500"
        >
          {CONNECTOR_PROVIDERS.map((provider) => (
            <option key={provider.type} value={provider.type}>
              {provider.label}
            </option>
          ))}
        </select>

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
          className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text focus-visible:ring-2 focus-visible:ring-neutral-500"
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
          placeholder="Enter webhook secret"
          className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text focus-visible:ring-2 focus-visible:ring-neutral-500"
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
            className="cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving…" : "Generate connector"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Connectors() {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
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
      return true;
    } catch (fetchError) {
      console.error("Failed to fetch connectors:", fetchError);
      setError("Unable to load connectors. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchConnectors();
  }, [fetchConnectors]);

  const createConnector = async (values: ConnectorPayload) => {
    try {
      await sendConnectors(values);
      toast.success("Connector created successfully.");
      await fetchConnectors();
      return true;
    } catch (createError) {
      console.error("Failed to create connector:", createError);
      toast.error("Unable to create the connector. Please try again.");
      return false;
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
          ••••••••
        </span>
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
          disabled={loading || Boolean(error)}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
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
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
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

      {createModalOpen && (
        <ConnectorForm
          onCancel={() => setCreateModalOpen(false)}
          onSave={createConnector}
        />
      )}
    </section>
  );
}

export default Connectors;
