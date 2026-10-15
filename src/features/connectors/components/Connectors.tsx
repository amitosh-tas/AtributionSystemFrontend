import { useState } from "react";
import DataTable, {
  type DataTableColumn,
} from "@/components/ui/DataTable";
import { sendConnectors } from "@/services/connectorService";
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
  type: ConnectorType;
  name: string;
  config: {
    webhooksecret: string;
  };
}

type ConnectorPayload = Omit<Connector, "id">;

function getProviderLabel(type: ConnectorType) {
  return CONNECTOR_PROVIDERS.find((provider) => provider.type === type)?.label ??
    type;
}

type ConnectorDialog =
  | { mode: "create" }
  | { mode: "edit"; connector: Connector }
  | null;

interface ConnectorFormProps {
  connector?: Connector;
  onCancel: () => void;
  onSave: (values: ConnectorPayload) => Promise<boolean>;
}

function ConnectorForm({
  connector,
  onCancel,
  onSave,
}: ConnectorFormProps) {
  const [type, setType] = useState<ConnectorType>(
    connector?.type ?? CONNECTOR_PROVIDERS[0].type,
  );
  const [name, setName] = useState(connector?.name ?? "");
  const [webhookSecret, setWebhookSecret] = useState(
    connector?.config.webhooksecret ?? "",
  );
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave({
        type,
        name: name.trim(),
        config: { webhooksecret: webhookSecret.trim() },
      });
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
  const [dialog, setDialog] = useState<ConnectorDialog>(null);
  const [connectorToDelete, setConnectorToDelete] =
    useState<Connector | null>(null);

  const saveConnector = async (values: ConnectorPayload) => {
    if (dialog?.mode !== "edit") {
      try {
        await sendConnectors(values);
      } catch (error) {
        console.error("Failed to create connector:", error);
        toast.error("Unable to create the connector. Please try again.");
        return false;
      }
    }

    if (dialog?.mode === "edit") {
      setConnectors((current) =>
        current.map((connector) =>
          connector.id === dialog.connector.id
            ? { ...connector, ...values }
            : connector,
        ),
      );
    } else {
      setConnectors((current) => [
        ...current,
        { id: crypto.randomUUID(), ...values },
      ]);
    }
    setDialog(null);
    return true;
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
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (connector) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setDialog({ mode: "edit", connector })}
            aria-label={`Edit ${connector.name}`}
            className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition hover:bg-surface-muted"
          >
            <i className="fi fi-rr-edit" aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setConnectorToDelete(connector)}
            aria-label={`Delete ${connector.name}`}
            className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50"
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
            Manage payment providers and their webhook endpoints.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDialog({ mode: "create" })}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <i className="fi fi-rr-plus" aria-hidden="true" />
          Generate connector
        </button>
      </div>

      <DataTable
        tableHead="Your connectors"
        tableSubHead={`${connectors.length} connector${connectors.length === 1 ? "" : "s"} found`}
        columns={columns}
        data={connectors}
        getRowKey={(connector) => connector.id}
        emptyMessage="No connectors yet. Generate a connector to get started."
      />

      {dialog && (
        <ConnectorForm
          key={
            dialog.mode === "edit"
              ? dialog.connector.id
              : "new-connector"
          }
          connector={dialog.mode === "edit" ? dialog.connector : undefined}
          onCancel={() => setDialog(null)}
          onSave={saveConnector}
        />
      )}

      {connectorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-connector-title"
            className="w-full max-w-md rounded-xl border border-border bg-card p-5 sm:p-6"
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
                className="cursor-pointer rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConnectors((current) =>
                    current.filter(
                      (connector) => connector.id !== connectorToDelete.id,
                    ),
                  );
                  setConnectorToDelete(null);
                }}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete connector
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Connectors;
