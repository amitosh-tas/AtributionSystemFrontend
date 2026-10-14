import { useMemo, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import Card from "@/components/ui/Card";
import { StatCardsSkeleton } from "@/components/ui/Skeleton";
import {
  useCompanyApiKeys,
  ApiKeyTable,
  RotateKeyModal,
  NewSecretModal,
  CreateApiKeyModal,
  EditApiKeyModal,
  RevokeApiKeyModal,
} from "@/features/api-keys";
import { normalizeAllowedOrigin } from "@/features/api-keys/utils/origins";

function Settings() {
  const {
    keys,
    loading,
    rotating,
    creating,
    updating,
    revoking,
    error,
    createError,
    selectedKey,
    setSelectedKey,
    newSecret,
    secretCopied,
    copyError,
    fetchKeys,
    rotateKey,
    createKey,
    updateKey,
    revokeKey,
    copySecret,
    closeSecretModal,
  } = useCompanyApiKeys();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [keyToEdit, setKeyToEdit] = useState<(typeof keys)[number] | null>(null);
  const [keyToRevoke, setKeyToRevoke] = useState<(typeof keys)[number] | null>(
    null,
  );

  const existingOrigins = useMemo(
    () =>
      [...new Set(
        keys
          .flatMap((key) => key.allowedOrigins ?? [])
          .map(
            (origin) =>
              normalizeAllowedOrigin(origin.trim()) ?? origin.trim().toLowerCase(),
          )
          .filter(Boolean),
      )],
    [keys],
  );
  const editOrigins = useMemo(
    () =>
      keyToEdit
        ? [
            ...new Set(
              keys
                .filter((key) => key.id !== keyToEdit.id)
                .flatMap((key) => key.allowedOrigins ?? [])
                .map(
                  (origin) =>
                    normalizeAllowedOrigin(origin.trim()) ??
                    origin.trim().toLowerCase(),
                )
                .filter(Boolean),
            ),
          ]
        : [],
    [keys, keyToEdit],
  );

  const activeKeys = keys.filter((key) => !key.revokedAt).length;
  const revokedKeys = keys.filter((key) => Boolean(key.revokedAt)).length;

  return (
    <PageLayout title="Secret Key" headTitle="Manage your Secret key">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-lg font-semibold">
              API keys
            </h2>

            <p className="text-sm text-text-muted">
              Manage the API credentials used to connect your website
              to Ledger.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-text-muted">
              <i className="fi fi-rr-shield-check" />
              Keys are sensitive credentials
            </div>
            {activeKeys === 0 && (
              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                disabled={loading}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <i className="fi fi-rr-plus" />
                Generate API key
              </button>
            )}
          </div>
        </div>

        {/* Summary cards */}
        {loading ? (
          <StatCardsSkeleton
            count={3}
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
          />
        ) : error ? null : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card
              title="Total keys"
              value={String(keys.length)}
              description="All API keys"
            />

            <Card
              title="Active keys"
              value={String(activeKeys)}
              description="Currently usable"
            />

            <Card
              title="Revoked keys"
              value={String(revokedKeys)}
              description="No longer active"
            />
          </div>
        )}

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
              className="cursor-pointer font-medium underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        {!error && (
          <ApiKeyTable
            keys={keys}
            loading={loading}
            busy={rotating || updating || revoking}
            onRotate={setSelectedKey}
            onEdit={setKeyToEdit}
            onRevoke={setKeyToRevoke}
          />
        )}

        {/* Modals */}
        <RotateKeyModal
          apiKey={selectedKey}
          rotating={rotating}
          onCancel={() => setSelectedKey(null)}
          onConfirm={() => void rotateKey()}
        />

        {keyToEdit && (
          <EditApiKeyModal
            key={keyToEdit.id}
            apiKey={keyToEdit}
            existingOrigins={editOrigins}
            saving={updating}
            onCancel={() => setKeyToEdit(null)}
            onSubmit={async (id, credentials) => {
              const updated = await updateKey(id, credentials);
              if (updated) setKeyToEdit(null);
              return updated;
            }}
          />
        )}

        <RevokeApiKeyModal
          apiKey={keyToRevoke}
          revoking={revoking}
          onCancel={() => setKeyToRevoke(null)}
          onConfirm={() => {
            if (keyToRevoke) {
              void revokeKey(keyToRevoke.id).then((revoked) => {
                if (revoked) setKeyToRevoke(null);
              });
            }
          }}
        />

        <CreateApiKeyModal
          open={createModalOpen}
          creating={creating}
          error={createError}
          existingOrigins={existingOrigins}
          onCancel={() => setCreateModalOpen(false)}
          onSubmit={createKey}
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

export default Settings;