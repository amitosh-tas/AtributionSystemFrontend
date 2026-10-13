import PageLayout from "@/components/layout/PageLayout";
import {
  useCompanyApiKeys,
  ApiKeyTable,
  RotateKeyModal,
  NewSecretModal,
} from "@/features/api-keys";

function Settings() {
  const {
    keys,
    loading,
    rotating,
    error,
    selectedKey,
    setSelectedKey,
    newSecret,
    secretCopied,
    copyError,
    fetchKeys,
    rotateKey,
    copySecret,
    closeSecretModal,
  } = useCompanyApiKeys();

  const activeKeys = keys.filter((key) => !key.revokedAt).length;
  const revokedKeys = keys.filter((key) => Boolean(key.revokedAt)).length;

  return (
    <PageLayout title="Secret Key" headTitle="Manage your Secret key">
      <div className="flex flex-col gap-6">
        {/* Header */}
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
          <SummaryCard
            label="Total keys"
            value={loading ? "—" : keys.length}
          />

          <SummaryCard
            label="Active keys"
            value={loading ? "—" : activeKeys}
          />

          <SummaryCard
            label="Revoked keys"
            value={loading ? "—" : revokedKeys}
          />
        </div>

        {/* Error */}
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

        {/* Table */}
        <ApiKeyTable
          keys={keys}
          loading={loading}
          rotating={rotating}
          onRotate={setSelectedKey}
        />

        {/* Modals */}
        <RotateKeyModal
          apiKey={selectedKey}
          rotating={rotating}
          onCancel={() => setSelectedKey(null)}
          onConfirm={() => void rotateKey()}
        />

        <NewSecretModal
          secret={newSecret}
          copied={secretCopied}
          copyError={copyError}
          onCopy={() => void copySecret()}
          onClose={closeSecretModal}
        />
      </div>
    </PageLayout>
  );
}

interface SummaryCardProps {
  label: string;
  value: string | number;
}

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default Settings;