
import { useCallback, useEffect, useState } from "react";

import PageLayout from "@/components/layout/PageLayout";
import DataTable, {
  type DataTableColumn,
} from "@/components/ui/DataTable";
import StatusPill from "@/components/ui/StatusPill";

import {
  getCompanyKey,
  rotateCompanyKey,
} from "@/services/apiService";

type KeyMode = "live" | "test";

interface CompanyApiKey {
  id: string;
  name: string;
  mode: KeyMode;
  keyPrefix: string;
  siteId: string | null;
  allowedOrigins: string[];
  rateLimitPerMin: number;
  lastUsedAt: string | null;
  expiresAt: string | null;
  rotatedFromId: string | null;
  revokedAt: string | null;
  createdAt: string;
}

function Settings() {
  const [keys, setKeys] = useState<CompanyApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedKey, setSelectedKey] =
    useState<CompanyApiKey | null>(null);

  const [rotating, setRotating] = useState(false);

  // The plaintext key exists in frontend memory only while
  // the one-time reveal modal is open.
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [secretCopied, setSecretCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getCompanyKey();
      const payload = response.data;

      // Supports either { data: [...] } or { data: { data: [...] } }
      const keysData = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.data)
          ? payload.data.data
          : null;

      if (!keysData) {
        console.error("Unexpected API response:", payload);
        throw new Error("Unexpected API response format.");
      }

      setKeys(keysData as CompanyApiKey[]);
    } catch (err) {
      console.error("Failed to fetch company API keys:", err);
      setError("Unable to load API keys. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchKeys();
  }, [fetchKeys]);

  async function handleRotate() {
    if (!selectedKey || rotating) return;

    setRotating(true);
    setError("");

    try {
      const response = await rotateCompanyKey();

      // Support both possible response structures
      const newKey =
        response.data?.data?.key ??
        response.data?.key;

      if (!newKey) {
        console.error("Rotation response:", response.data);
        throw new Error("The server did not return the new API key.");
      }

      setNewSecret(newKey);
      setSecretCopied(false);
      setCopyError("");
      setSelectedKey(null);

      await fetchKeys();
    } catch (err) {
      console.error("Failed to rotate API key:", err);
      setError(
        "Unable to rotate the API key. Check the server response and try again."
      );
    } finally {
      setRotating(false);
    }
  }

  async function handleCopySecret() {
    if (!newSecret) return;

    setCopyError("");

    try {
      await navigator.clipboard.writeText(newSecret);
      setSecretCopied(true);
    } catch (err) {
      console.error("Unable to copy the API key:", err);
      setSecretCopied(false);
      setCopyError(
        "Clipboard access failed. Select and copy the key manually."
      );
    }
  }

  function closeSecretModal() {
    // Remove the reference to the plaintext secret from React state.
    setNewSecret(null);
    setSecretCopied(false);
    setCopyError("");
  }

  const columns: DataTableColumn<CompanyApiKey>[] = [
    {
      key: "name",
      header: "Key name",
      render: (key) => (
        <div className="flex min-w-40 flex-col gap-1">
          <span className="font-medium">{key.name}</span>
          <span className="text-[10px] text-text-muted">
            ID: {key.id.slice(0, 8)}…
          </span>
        </div>
      ),
    },
    {
      key: "keyPrefix",
      header: "API key",
      render: (key) => (
        <div className="flex min-w-40 items-center">
          <code className="whitespace-nowrap rounded bg-surface-muted px-2 py-1 text-xs">
            {key.keyPrefix}
            {"*".repeat(12)}
          </code>
        </div>
      ),
    },
    {
      key: "mode",
      header: "Mode",
      render: (key) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            key.mode === "live"
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {key.mode.toUpperCase()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (key) => (
        <StatusPill
          status={key.revokedAt ? "DEACTIVE" : "ACTIVE"}
        />
      ),
    },
    {
      key: "rateLimitPerMin",
      header: "Rate limit",
      align: "right",
      render: (key) => (
        <span>{key.rateLimitPerMin.toLocaleString()} / min</span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (key) => (
        <span className="whitespace-nowrap text-xs text-text-muted">
          {new Date(key.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (key) => (
        <button
          type="button"
          disabled={Boolean(key.revokedAt) || rotating}
          onClick={() => setSelectedKey(key)}
          className="whitespace-nowrap rounded-md border border-border px-3 py-1.5 text-xs font-medium transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          Rotate key
        </button>
      ),
    },
  ];

  return (
    <PageLayout
      title="Secret Key"
      headTitle="Manage your Secret key"
    >
      <div className="flex flex-col gap-6">
        {/* Introduction */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-lg font-medium">
              API keys
            </h2>
            <p className="text-sm text-text-muted">
              Manage the API credentials used to connect your website
              to Ledger.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-text-muted">
            <i className="fi fi-rr-shield-check" />
            Keys are sensitive credentials
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-text-muted">Total keys</p>
            <p className="mt-2 text-2xl font-semibold">
              {loading ? "—" : keys.length}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-text-muted">Active keys</p>
            <p className="mt-2 text-2xl font-semibold">
              {loading
                ? "—"
                : keys.filter((key) => !key.revokedAt).length}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-text-muted">Revoked keys</p>
            <p className="mt-2 text-2xl font-semibold">
              {loading
                ? "—"
                : keys.filter((key) => Boolean(key.revokedAt)).length}
            </p>
          </div>
        </div>

        {/* Errors */}
        {error && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => void fetchKeys()}
              className="font-medium underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* API key table */}
        {loading ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-text-muted">
            Loading API keys…
          </div>
        ) : (
          <DataTable
            tableHead="Your API keys"
            tableSubHead={`${keys.length} key${keys.length === 1 ? "" : "s"} found`}
            columns={columns}
            data={keys}
            getRowKey={(key) => key.id}
            emptyMessage="No API keys found for this company."
          />
        )}

        {/* Rotation confirmation modal */}
        {selectedKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="rotate-title"
              className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <i className="fi fi-rr-refresh text-lg" />
              </div>

              <h3
                id="rotate-title"
                className="font-heading text-lg font-medium"
              >
                Rotate API key?
              </h3>

              <p className="mt-2 text-sm leading-6 text-text-muted">
                You're about to rotate{" "}
                <span className="font-medium text-text-main">
                  {selectedKey.name}
                </span>
                . Your integration may need the new key. Make sure
                you save it after rotation.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={rotating}
                  onClick={() => setSelectedKey(null)}
                  className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={rotating}
                  onClick={() => void handleRotate()}
                  className="rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {rotating ? "Rotating…" : "Confirm rotation"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* One-time new secret modal */}
        {newSecret && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="new-secret-title"
              className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                <i className="fi fi-rr-shield-check text-xl" />
              </div>

              <h3
                id="new-secret-title"
                className="font-heading text-xl font-semibold"
              >
                Your new API key is ready
              </h3>

              <p className="mt-2 text-sm leading-6 text-text-muted">
                Copy and securely save this key now. The full key
                will not be available from the key list after you
                close this window.
              </p>

              <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <i className="fi fi-rr-triangle-warning mr-2" />
                Never share this key publicly or commit it to source
                control.
              </div>

              <label
                htmlFor="new-api-secret"
                className="mt-5 block text-xs font-medium text-text-muted"
              >
                Your new secret key
              </label>

              <div className="mt-2 flex items-start gap-2">
                <textarea
                  id="new-api-secret"
                  readOnly
                  value={newSecret}
                  rows={3}
                  onFocus={(event) => event.currentTarget.select()}
                  className="min-w-0 flex-1 resize-none break-all rounded-lg border border-border bg-surface-muted p-3 font-mono text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() => void handleCopySecret()}
                  className="flex shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-surface-muted"
                >
                  <i
                    className={
                      secretCopied
                        ? "fi fi-rr-check text-green-600"
                        : "fi fi-rr-copy-alt"
                    }
                  />
                  {secretCopied ? "Copied" : "Copy"}
                </button>
              </div>

              {copyError && (
                <p role="alert" className="mt-2 text-xs text-red-600">
                  {copyError}
                </p>
              )}

              <p className="mt-3 text-xs text-text-muted">
                Save this key in your password manager or secure
                secrets storage before continuing.
              </p>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={closeSecretModal}
                  className="rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-medium text-white"
                >
                  I've saved my key
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default Settings;
